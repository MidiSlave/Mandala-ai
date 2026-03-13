/**
 * Pattern analyzer — reads rendered PNGs and computes quality metrics.
 *
 * Metrics computed:
 *   - coverage: % of tile area with ink (non-background pixels)
 *   - balance: left-right symmetry score (0-1, 1=perfect)
 *   - complexity: number of distinct contiguous regions (connected components)
 *   - density distribution: how evenly ink is spread across quadrants
 *   - emptiness: % of rows/columns with zero ink (dead zones)
 *
 * All metrics are computed on the tile renders (rectangular UV space) since
 * mandala renders have rotational symmetry by construction.
 */

import { createCanvas, loadImage } from 'canvas';
import * as fs from 'fs';
import * as path from 'path';

// Background color in the renders
const BG_R = 0xEB, BG_G = 0xE7, BG_B = 0xE0;

function isBackground(r: number, g: number, b: number, tolerance: number = 30): boolean {
    return Math.abs(r - BG_R) < tolerance
        && Math.abs(g - BG_G) < tolerance
        && Math.abs(b - BG_B) < tolerance;
}

export interface TileMetrics {
    file: string;
    patternSet: string;
    type: number;
    filled: boolean;
    coverage: number;        // 0-1, fraction of pixels with ink
    balance: number;         // 0-1, left-right symmetry
    verticalBalance: number; // 0-1, top-bottom symmetry
    quadrantDensity: [number, number, number, number]; // coverage per quadrant (TL, TR, BL, BR)
    deadRowsFrac: number;    // fraction of rows with zero ink
    deadColsFrac: number;    // fraction of columns with zero ink
    complexity: number;      // estimated edge pixel count (proxy for detail)
    overallScore: number;    // composite quality score 0-100
    issues: string[];        // human-readable issues
}

/**
 * Analyze a single tile PNG and return metrics.
 */
export async function analyzeTile(filePath: string): Promise<TileMetrics> {
    const img = await loadImage(filePath);
    const w = img.width;
    const h = img.height;
    const canvas = createCanvas(w, h);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    // Parse filename to extract metadata
    const basename = path.basename(filePath, '.png');
    const parts = basename.split('_');
    // tile_<setname...>_<type>_<filled|outline>
    const filledStr = parts[parts.length - 1];
    const typeStr = parts[parts.length - 2];
    const setName = parts.slice(1, parts.length - 2).join('_');

    const margin = Math.floor(w * 0.05);

    // Build ink mask (within the margin area)
    const inkW = w - margin * 2;
    const inkH = h - margin * 2;
    const ink: boolean[][] = [];
    for (let y = 0; y < inkH; y++) {
        ink[y] = [];
        for (let x = 0; x < inkW; x++) {
            const px = (margin + x);
            const py = (margin + y);
            const idx = (py * w + px) * 4;
            ink[y][x] = !isBackground(data[idx], data[idx + 1], data[idx + 2]);
        }
    }

    // Coverage
    let inkCount = 0;
    for (let y = 0; y < inkH; y++)
        for (let x = 0; x < inkW; x++)
            if (ink[y][x]) inkCount++;
    const coverage = inkCount / (inkW * inkH);

    // Left-right balance
    let leftInk = 0, rightInk = 0;
    const midX = Math.floor(inkW / 2);
    for (let y = 0; y < inkH; y++) {
        for (let x = 0; x < midX; x++) if (ink[y][x]) leftInk++;
        for (let x = midX; x < inkW; x++) if (ink[y][x]) rightInk++;
    }
    const maxLR = Math.max(leftInk, rightInk, 1);
    const balance = Math.min(leftInk, rightInk) / maxLR;

    // Top-bottom balance
    let topInk = 0, bottomInk = 0;
    const midY = Math.floor(inkH / 2);
    for (let y = 0; y < midY; y++)
        for (let x = 0; x < inkW; x++) if (ink[y][x]) topInk++;
    for (let y = midY; y < inkH; y++)
        for (let x = 0; x < inkW; x++) if (ink[y][x]) bottomInk++;
    const maxTB = Math.max(topInk, bottomInk, 1);
    const verticalBalance = Math.min(topInk, bottomInk) / maxTB;

    // Quadrant density
    const q = [0, 0, 0, 0]; // TL, TR, BL, BR
    const qArea = [0, 0, 0, 0];
    for (let y = 0; y < inkH; y++) {
        for (let x = 0; x < inkW; x++) {
            const qi = (y < midY ? 0 : 2) + (x < midX ? 0 : 1);
            qArea[qi]++;
            if (ink[y][x]) q[qi]++;
        }
    }
    const quadrantDensity = q.map((c, i) => c / Math.max(qArea[i], 1)) as [number, number, number, number];

    // Dead rows/columns
    let deadRows = 0;
    for (let y = 0; y < inkH; y++) {
        if (!ink[y].some(v => v)) deadRows++;
    }
    let deadCols = 0;
    for (let x = 0; x < inkW; x++) {
        let hasInk = false;
        for (let y = 0; y < inkH; y++) {
            if (ink[y][x]) { hasInk = true; break; }
        }
        if (!hasInk) deadCols++;
    }
    const deadRowsFrac = deadRows / inkH;
    const deadColsFrac = deadCols / inkW;

    // Complexity — count edge pixels (ink pixels adjacent to non-ink)
    let edgeCount = 0;
    for (let y = 1; y < inkH - 1; y++) {
        for (let x = 1; x < inkW - 1; x++) {
            if (ink[y][x]) {
                if (!ink[y - 1][x] || !ink[y + 1][x] || !ink[y][x - 1] || !ink[y][x + 1]) {
                    edgeCount++;
                }
            }
        }
    }
    // Normalize: edge count relative to total ink pixels (more = more detailed/complex)
    const complexity = inkCount > 0 ? edgeCount / inkCount : 0;

    // Issues
    const issues: string[] = [];
    if (coverage < 0.05) issues.push('VERY_LOW_COVERAGE: pattern barely visible (<5%)');
    else if (coverage < 0.1) issues.push('LOW_COVERAGE: pattern sparse (<10%)');
    if (coverage > 0.85) issues.push('OVER_FILLED: too much ink (>85%), pattern may be a blob');
    if (balance < 0.3) issues.push('UNBALANCED_LR: heavy left-right asymmetry');
    if (verticalBalance < 0.2) issues.push('UNBALANCED_TB: heavy top-bottom asymmetry');
    if (deadRowsFrac > 0.4) issues.push(`DEAD_ROWS: ${(deadRowsFrac * 100).toFixed(0)}% of rows empty`);
    if (deadColsFrac > 0.4) issues.push(`DEAD_COLS: ${(deadColsFrac * 100).toFixed(0)}% of columns empty`);
    const densityRange = Math.max(...quadrantDensity) - Math.min(...quadrantDensity);
    if (densityRange > 0.3 && coverage > 0.1) issues.push('UNEVEN_DISTRIBUTION: ink concentrated in one area');
    if (complexity < 0.2 && coverage > 0.1) issues.push('LOW_COMPLEXITY: very simple/blocky shapes');

    // Composite score (0-100)
    let score = 50;
    // Coverage: ideal 15-60%
    if (coverage >= 0.15 && coverage <= 0.60) score += 15;
    else if (coverage >= 0.08 && coverage <= 0.75) score += 5;
    else score -= 15;
    // Balance
    score += balance * 10;
    score += verticalBalance * 5;
    // Distribution evenness
    score += (1 - densityRange) * 10;
    // Complexity reward
    score += Math.min(complexity * 20, 10);
    // Dead zone penalty
    score -= deadRowsFrac * 10;
    score -= deadColsFrac * 10;

    const overallScore = Math.max(0, Math.min(100, Math.round(score)));

    return {
        file: filePath,
        patternSet: setName,
        type: parseInt(typeStr) || 0,
        filled: filledStr === 'filled',
        coverage,
        balance,
        verticalBalance,
        quadrantDensity,
        deadRowsFrac,
        deadColsFrac,
        complexity,
        overallScore,
        issues,
    };
}

/**
 * Analyze all tile PNGs in a directory.
 */
export async function analyzeAllTiles(dir: string): Promise<TileMetrics[]> {
    const files = fs.readdirSync(dir)
        .filter(f => f.startsWith('tile_') && f.endsWith('.png'))
        .map(f => path.join(dir, f));

    const results: TileMetrics[] = [];
    for (const f of files) {
        results.push(await analyzeTile(f));
    }
    return results;
}

/**
 * Format analysis results as a readable report.
 */
export function formatReport(metrics: TileMetrics[]): string {
    const lines: string[] = [];
    lines.push('=== PATTERN ANALYSIS REPORT ===\n');

    // Group by pattern set
    const groups = new Map<string, TileMetrics[]>();
    for (const m of metrics) {
        const key = m.patternSet;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(m);
    }

    for (const [setName, items] of groups) {
        lines.push(`\n--- ${setName} ---`);
        const avgScore = items.reduce((s, m) => s + m.overallScore, 0) / items.length;
        lines.push(`  Average score: ${avgScore.toFixed(1)}/100`);

        for (const m of items) {
            const tag = m.filled ? 'filled ' : 'outline';
            const status = m.issues.length === 0 ? 'OK' : `ISSUES(${m.issues.length})`;
            lines.push(`  #${m.type} ${tag}: score=${m.overallScore} coverage=${(m.coverage * 100).toFixed(1)}% balance=${(m.balance * 100).toFixed(0)}% [${status}]`);
            for (const issue of m.issues) {
                lines.push(`    ⚠ ${issue}`);
            }
        }
    }

    // Summary
    const allScores = metrics.map(m => m.overallScore);
    const avg = allScores.reduce((a, b) => a + b, 0) / allScores.length;
    const worst = metrics.reduce((a, b) => a.overallScore < b.overallScore ? a : b);
    const best = metrics.reduce((a, b) => a.overallScore > b.overallScore ? a : b);
    const withIssues = metrics.filter(m => m.issues.length > 0);

    lines.push(`\n=== SUMMARY ===`);
    lines.push(`Total patterns analyzed: ${metrics.length}`);
    lines.push(`Average score: ${avg.toFixed(1)}/100`);
    lines.push(`Best:  ${best.patternSet} #${best.type} (${best.filled ? 'filled' : 'outline'}) = ${best.overallScore}`);
    lines.push(`Worst: ${worst.patternSet} #${worst.type} (${worst.filled ? 'filled' : 'outline'}) = ${worst.overallScore}`);
    lines.push(`Patterns with issues: ${withIssues.length}/${metrics.length}`);

    if (withIssues.length > 0) {
        lines.push(`\n=== PATTERNS NEEDING IMPROVEMENT ===`);
        for (const m of withIssues.sort((a, b) => a.overallScore - b.overallScore)) {
            lines.push(`  ${m.patternSet} #${m.type} (${m.filled ? 'filled' : 'outline'}) score=${m.overallScore}`);
            for (const issue of m.issues) {
                lines.push(`    - ${issue}`);
            }
        }
    }

    return lines.join('\n');
}
