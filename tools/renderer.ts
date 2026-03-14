/**
 * Headless pattern renderer — renders pattern tiles and full mandalas to PNG.
 * Uses node-canvas to replicate the App.tsx rendering pipeline without a browser.
 *
 * Usage (via CLI entry point):
 *   npx tsx tools/cli.ts render [--set nordic] [--type 0] [--size 800]
 */

import { createCanvas, type Canvas, type CanvasRenderingContext2D } from 'canvas';
import * as fs from 'fs';
import * as path from 'path';
import type { PathStyle, PatternSet, PatternContext } from '../src/patterns/types';

// Re-export for external use
export { Canvas };

// --- Import all pattern sets ---
import aztecPatterns from '../src/patterns/aztec';
import lacePatterns from '../src/patterns/lace';
import nordicPatterns from '../src/patterns/nordic';
import chevronPatterns from '../src/patterns/chevron';
import lotusPatterns from '../src/patterns/lotus';
import greekkeyPatterns from '../src/patterns/greekkey';
import tribalPatterns from '../src/patterns/tribal';
import artDecoPatterns from '../src/patterns/artdeco';
import japanesePatterns from '../src/patterns/japanese';
import sacredPatterns from '../src/patterns/sacred';
import celticPatterns from '../src/patterns/celtic';
import egyptianPatterns from '../src/patterns/egyptian';
import mesoamericanPatterns from '../src/patterns/mesoamerican';
import generativePatterns from '../src/patterns/generative';
import guillochePatterns from '../src/patterns/guilloche';
import fractalPatterns from '../src/patterns/fractal';
import spiralPatterns from '../src/patterns/spirals';
import harmonographPatterns from '../src/patterns/harmonograph';
import truchetPatterns from '../src/patterns/truchet';
import islamicPatterns from '../src/patterns/islamic';
import opArtPatterns from '../src/patterns/opart';
import artNouveauPatterns from '../src/patterns/artnouveau';
import aboriginalPatterns from '../src/patterns/aboriginal';
import polynesianPatterns from '../src/patterns/polynesian';
import embroideryPatterns from '../src/patterns/embroidery';
import mazePatterns from '../src/patterns/maze';
import flowFieldPatterns from '../src/patterns/flowfield';
import noiseStrataPatterns from '../src/patterns/noisestrata';
import organicCellPatterns from '../src/patterns/organiccells';
import iconPatterns from '../src/patterns/icons';

export const ALL_PATTERN_SETS: PatternSet[] = [
    aztecPatterns, lacePatterns, nordicPatterns, chevronPatterns,
    lotusPatterns, greekkeyPatterns, tribalPatterns, artDecoPatterns,
    japanesePatterns, sacredPatterns, celticPatterns, egyptianPatterns,
    mesoamericanPatterns, generativePatterns, guillochePatterns, fractalPatterns,
    spiralPatterns, harmonographPatterns, truchetPatterns, islamicPatterns,
    opArtPatterns, artNouveauPatterns, aboriginalPatterns, polynesianPatterns,
    embroideryPatterns, mazePatterns, flowFieldPatterns, noiseStrataPatterns,
    organicCellPatterns, iconPatterns,
];

export function getPatternSetByName(name: string): PatternSet | undefined {
    return ALL_PATTERN_SETS.find(s => s.name.toLowerCase().includes(name.toLowerCase()));
}

// --- Seeded RNG (same as App.tsx) ---
export function mulberry32(a: number) {
    return function () {
        let t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

// --- Tunnel radius (same as App.tsx) ---
const TUNNEL_POWER = 2.5;
function tunnelRadius(t: number, maxR: number): number {
    return maxR * Math.pow(Math.max(0, t), TUNNEL_POWER);
}

// Background & foreground colors
const BG = '#EBE7E0';
const FG = '#1A1818';

export interface RenderOptions {
    size?: number;         // canvas size in px (default 800)
    symmetry?: number;     // rotational symmetry (default 12)
    layers?: number;       // number of layers (default 12)
    seed?: number;         // RNG seed (default 42)
    roughness?: number;    // sketch roughness (default 0, clean for analysis)
    zoom?: number;         // tunnel zoom (default 0)
    twist?: number;        // base twist angle (default 0)
}

const DEFAULTS: Required<RenderOptions> = {
    size: 800,
    symmetry: 12,
    layers: 12,
    seed: 42,
    roughness: 0,  // 0 = clean lines for analysis; set >0 for sketchy look
    zoom: 0,
    twist: 0,
};

/**
 * Render a single pattern tile (one UV cell) to a canvas.
 * Draws the pattern in a rectangular [0,1]×[0,1] space, useful for inspecting
 * individual patterns outside the mandala context.
 */
export function renderTile(
    patternSet: PatternSet,
    type: number,
    filled: boolean,
    size: number = 400,
): Canvas {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d') as unknown as CanvasRenderingContext2D;

    // Background
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, size, size);

    // Margin
    const margin = size * 0.05;
    const drawW = size - margin * 2;
    const drawH = size - margin * 2;

    const baseStyle: PathStyle = filled ? 'filled' : 'opaque-outline';

    const drawUV = (uvPoints: [number, number][], style: PathStyle) => {
        const pts = uvPoints.map(([u, v]) => ({
            x: margin + u * drawW,
            y: margin + (1 - v) * drawH, // flip v so 0=bottom, 1=top (matches radial inner=0)
        }));

        if (style === 'filled' || style === 'opaque-outline') {
            ctx.fillStyle = style === 'filled' ? FG : BG;
            ctx.beginPath();
            pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
            ctx.closePath();
            ctx.fill();
        }

        ctx.strokeStyle = style === 'filled' ? 'rgba(26,24,24,0.9)' : 'rgba(26,24,24,0.6)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        if (style !== 'line') ctx.closePath();
        ctx.stroke();
    };

    patternSet.draw(type, { drawUV, filled, baseStyle });

    // Draw border
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(margin, margin, drawW, drawH);

    // Label
    ctx.fillStyle = FG;
    ctx.font = '14px sans-serif';
    ctx.fillText(`${patternSet.name} #${type} (${filled ? 'filled' : 'outline'})`, margin, size - 5);

    return canvas;
}

/**
 * Render a full mandala to a canvas, replicating App.tsx logic.
 */
export function renderMandala(
    patternSet: PatternSet | null, // null = mix mode
    opts: RenderOptions = {},
): Canvas {
    const config = { ...DEFAULTS, ...opts };
    const { size, symmetry: sym, layers, seed, roughness, zoom, twist } = config;

    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d') as unknown as CanvasRenderingContext2D;

    const cx = size / 2;
    const cy = size / 2;
    const maxR = Math.hypot(cx, cy) + 50;
    const angleStep = (2 * Math.PI) / sym;

    // Background
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, size, size);
    ctx.save();
    ctx.translate(cx, cy);

    const isMixMode = patternSet === null;
    const fallbackSet = patternSet ?? ALL_PATTERN_SETS[0];

    // UV → Cartesian mapper
    const mapUV = (u: number, v: number, r1: number, r2: number, layerTwist: number) => {
        const r = r1 + v * (r2 - r1);
        const a = u * angleStep + layerTwist;
        return { x: r * Math.cos(a), y: r * Math.sin(a) };
    };

    // Rough path drawer
    const drawRoughPath = (points: { x: number; y: number }[], style: PathStyle, rng: () => number) => {
        const passes = style === 'filled' ? 1 : 2;

        if (style === 'filled' || style === 'opaque-outline') {
            ctx.fillStyle = style === 'filled' ? FG : BG;
            ctx.beginPath();
            points.forEach((p, i) => {
                const nx = p.x + (rng() - 0.5) * roughness;
                const ny = p.y + (rng() - 0.5) * roughness;
                if (i === 0) ctx.moveTo(nx, ny); else ctx.lineTo(nx, ny);
            });
            ctx.closePath();
            ctx.fill();
        }

        ctx.strokeStyle = style === 'filled' ? 'rgba(26,24,24,0.9)' : 'rgba(26,24,24,0.6)';
        ctx.lineWidth = 1.5;

        for (let pass = 0; pass < passes; pass++) {
            ctx.beginPath();
            points.forEach((p, i) => {
                const nx = p.x + (rng() - 0.5) * roughness * 1.5;
                const ny = p.y + (rng() - 0.5) * roughness * 1.5;
                if (i === 0) ctx.moveTo(nx, ny); else ctx.lineTo(nx, ny);
            });
            if (style !== 'line') ctx.closePath();
            ctx.stroke();
        }
    };

    // Layers
    const N = layers + 1;
    const firstId = Math.ceil(zoom);
    const lastId = Math.floor(zoom + N - 1);

    for (let id = lastId; id >= firstId; id--) {
        const layerRng = mulberry32(seed + id * 999);

        const layerSet = isMixMode
            ? ALL_PATTERN_SETS[Math.floor(layerRng() * ALL_PATTERN_SETS.length)]
            : fallbackSet;

        let type = Math.floor(layerRng() * layerSet.count);
        const neighborRng = mulberry32(seed + (id + 1) * 999);
        if (isMixMode) neighborRng();
        const neighborRaw = Math.floor(neighborRng() * layerSet.count);
        if (type === neighborRaw) type = (type + 1) % layerSet.count;

        const filled = layerRng() > 0.5;
        const spinDir = layerRng() > 0.5 ? 1 : -1;
        const speedOffset = (layerRng() - 0.5) * 2;

        const t1 = Math.max(0, (id - zoom) / N);
        const t2 = Math.min(1, (id + 1 - zoom) / N);

        const r1 = tunnelRadius(t1, maxR);
        const r2 = tunnelRadius(t2, maxR);

        if (r2 <= 0.5) continue;
        if (r1 > maxR * 1.2) continue;

        const thickness = r2 - r1;
        const tooThin = thickness < 3;

        // Mask interior
        ctx.fillStyle = BG;
        ctx.beginPath();
        ctx.arc(0, 0, r2, 0, Math.PI * 2);
        ctx.fill();

        // Layer twist
        const twistMag = 1 / (t2 * 3 + 0.3);
        const layerSpeedMul = spinDir * (1.0 + 0.8 * speedOffset);
        const layerTwist = twist * twistMag * layerSpeedMul;

        // Separator ring
        ctx.save();
        const alpha = Math.min(1, thickness / 8);
        ctx.globalAlpha = alpha;

        const ringPts = [];
        for (let a = 0; a <= Math.PI * 2; a += 0.1) {
            ringPts.push({ x: r2 * Math.cos(a), y: r2 * Math.sin(a) });
        }
        drawRoughPath(ringPts, 'outline', layerRng);

        // Pattern motifs
        if (!tooThin) {
            const baseStyle: PathStyle = filled ? 'filled' : 'opaque-outline';
            for (let i = 0; i < sym; i++) {
                ctx.save();
                ctx.rotate(i * angleStep);

                const drawUV = (uvPoints: [number, number][], style: PathStyle) => {
                    const pts = uvPoints.map(p => mapUV(p[0], p[1], r1, r2, layerTwist));
                    drawRoughPath(pts, style, layerRng);
                };

                layerSet.draw(type, { drawUV, filled, baseStyle });
                ctx.restore();
            }
        }

        ctx.restore();
    }

    // Center vanishing point
    const innermostT = Math.max(0, (firstId - zoom) / N);
    const coreR = tunnelRadius(innermostT, maxR);
    if (coreR > 0.5) {
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, coreR);
        grad.addColorStop(0, 'rgba(26,24,24,0.85)');
        grad.addColorStop(0.4, 'rgba(26,24,24,0.5)');
        grad.addColorStop(0.8, 'rgba(26,24,24,0.15)');
        grad.addColorStop(1, 'rgba(235,231,224,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, coreR, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
    return canvas;
}

/**
 * Save a canvas to a PNG file.
 */
export function savePNG(canvas: Canvas, filePath: string): void {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const buf = canvas.toBuffer('image/png');
    fs.writeFileSync(filePath, buf);
}

/**
 * Render a reference strip image for a pattern set.
 * Each row shows one motif repeating horizontally, all motifs stacked vertically.
 * This produces a rectangular catalog image suitable for documentation.
 */
export function renderStrip(
    patternSet: PatternSet,
    cellSize: number = 200,
    repeats: number = 4,
    seed: number = 42,
): Canvas {
    const rows = patternSet.count;
    const cols = repeats * 2; // filled + outline alternating
    const labelH = 24;
    const headerH = 36;
    const totalW = cellSize * repeats * 2; // filled block + outline block side by side
    const totalH = headerH + rows * (cellSize + labelH);

    const canvas = createCanvas(totalW, totalH);
    const ctx = canvas.getContext('2d') as unknown as CanvasRenderingContext2D;

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, totalW, totalH);

    // Header
    ctx.fillStyle = '#1A1818';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(patternSet.name, 10, headerH - 10);
    ctx.font = '13px sans-serif';
    ctx.fillStyle = '#666';
    ctx.fillText(`${patternSet.count} motifs — filled (left) / outline (right)`, 10 + ctx.measureText(patternSet.name).width + 20, headerH - 10);

    // Draw separator line under header
    ctx.strokeStyle = '#DDD';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, headerH);
    ctx.lineTo(totalW, headerH);
    ctx.stroke();

    const BG = '#EBE7E0';
    const FG = '#1A1818';
    const margin = cellSize * 0.05;
    const drawW = cellSize - margin * 2;
    const drawH = cellSize - margin * 2;

    for (let motif = 0; motif < rows; motif++) {
        const rowY = headerH + motif * (cellSize + labelH);

        // Motif label
        ctx.fillStyle = '#333';
        ctx.font = '12px sans-serif';
        ctx.fillText(`#${motif}`, 4, rowY + cellSize + labelH - 8);

        for (let rep = 0; rep < cols; rep++) {
            const isFilled = rep < repeats;
            const filled = isFilled;
            const colIdx = rep;
            const cellX = colIdx * cellSize;

            // Cell background
            ctx.fillStyle = BG;
            ctx.fillRect(cellX, rowY, cellSize, cellSize);

            // Cell border
            ctx.strokeStyle = '#CCC';
            ctx.lineWidth = 0.5;
            ctx.strokeRect(cellX, rowY, cellSize, cellSize);

            const rng = mulberry32(seed + motif * 137 + rep * 31);
            const baseStyle: PathStyle = filled ? 'filled' : 'opaque-outline';

            const drawUV = (uvPoints: [number, number][], style: PathStyle) => {
                const pts = uvPoints.map(([u, v]) => ({
                    x: cellX + margin + u * drawW,
                    y: rowY + margin + (1 - v) * drawH,
                }));

                if (style === 'filled' || style === 'opaque-outline') {
                    ctx.fillStyle = style === 'filled' ? FG : BG;
                    ctx.beginPath();
                    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
                    ctx.closePath();
                    ctx.fill();
                }

                ctx.strokeStyle = style === 'filled' ? 'rgba(26,24,24,0.9)' : 'rgba(26,24,24,0.6)';
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
                if (style !== 'line') ctx.closePath();
                ctx.stroke();
            };

            patternSet.draw(motif, { drawUV, filled, baseStyle, rng });
        }

        // Separator between filled and outline blocks
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(repeats * cellSize, rowY);
        ctx.lineTo(repeats * cellSize, rowY + cellSize);
        ctx.stroke();
        ctx.setLineDash([]);

        // Row separator
        if (motif < rows - 1) {
            ctx.strokeStyle = '#EEE';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(0, rowY + cellSize + labelH);
            ctx.lineTo(totalW, rowY + cellSize + labelH);
            ctx.stroke();
        }
    }

    return canvas;
}

/**
 * Render strip images for all pattern sets.
 */
export function renderAllStrips(outputDir: string, cellSize: number = 200, repeats: number = 4, seed: number = 42): string[] {
    const files: string[] = [];
    for (const set of ALL_PATTERN_SETS) {
        const safeName = set.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase().replace(/-+/g, '-');
        const canvas = renderStrip(set, cellSize, repeats, seed);
        const fpath = path.join(outputDir, `strip-${safeName}.png`);
        savePNG(canvas, fpath);
        files.push(fpath);
    }
    return files;
}

/**
 * Render all tiles for all pattern sets (both filled and outline) to output dir.
 */
export function renderAllTiles(outputDir: string, tileSize: number = 400): string[] {
    const files: string[] = [];
    for (const set of ALL_PATTERN_SETS) {
        const safeName = set.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        for (let type = 0; type < set.count; type++) {
            for (const filled of [true, false]) {
                const canvas = renderTile(set, type, filled, tileSize);
                const fname = `tile_${safeName}_${type}_${filled ? 'filled' : 'outline'}.png`;
                const fpath = path.join(outputDir, fname);
                savePNG(canvas, fpath);
                files.push(fpath);
            }
        }
    }
    return files;
}

/**
 * Render mandalas for each pattern set + mix mode.
 */
export function renderAllMandalas(outputDir: string, opts: RenderOptions = {}): string[] {
    const files: string[] = [];

    for (const set of ALL_PATTERN_SETS) {
        const safeName = set.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        const canvas = renderMandala(set, opts);
        const fpath = path.join(outputDir, `mandala_${safeName}.png`);
        savePNG(canvas, fpath);
        files.push(fpath);
    }

    // Mix mode
    const mixCanvas = renderMandala(null, opts);
    const mixPath = path.join(outputDir, 'mandala_mix.png');
    savePNG(mixCanvas, mixPath);
    files.push(mixPath);

    return files;
}
