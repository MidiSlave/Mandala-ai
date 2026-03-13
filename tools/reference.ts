/**
 * Reference image downloader and comparison tool.
 *
 * Downloads reference pattern images from the web (or loads local files),
 * analyzes their visual characteristics, and produces a comparison report
 * to guide pattern recreation.
 */

import { createCanvas, loadImage, type Canvas } from 'canvas';
import * as fs from 'fs';
import * as path from 'path';
import https from 'https';
import http from 'http';

const BG_R = 0xEB, BG_G = 0xE7, BG_B = 0xE0;

export interface ReferenceAnalysis {
    file: string;
    width: number;
    height: number;
    coverage: number;           // ink coverage fraction
    dominantRegion: string;     // where most ink is (center, edges, distributed)
    edgeDensity: number;        // edge pixels / total ink pixels
    symmetryScore: number;      // left-right + top-bottom symmetry combined
    avgLuminance: number;       // average brightness 0-255
    contrastRatio: number;      // ratio of dark to light pixels
    description: string;        // auto-generated description for recreation
}

/**
 * Download an image from a URL to a local path.
 */
export function downloadImage(url: string, destPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const dir = path.dirname(destPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const protocol = url.startsWith('https') ? https : http;
        const file = fs.createWriteStream(destPath);

        const request = (url: string, redirectCount: number = 0) => {
            if (redirectCount > 5) {
                reject(new Error('Too many redirects'));
                return;
            }
            protocol.get(url, (response) => {
                if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                    request(response.headers.location, redirectCount + 1);
                    return;
                }
                if (response.statusCode !== 200) {
                    reject(new Error(`HTTP ${response.statusCode}`));
                    return;
                }
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve(destPath);
                });
            }).on('error', (err) => {
                fs.unlink(destPath, () => {});
                reject(err);
            });
        };
        request(url);
    });
}

/**
 * Analyze a reference image for its visual characteristics.
 */
export async function analyzeReference(filePath: string): Promise<ReferenceAnalysis> {
    const img = await loadImage(filePath);
    const w = img.width;
    const h = img.height;

    // Scale down for analysis if large
    const maxDim = 500;
    const scale = Math.min(1, maxDim / Math.max(w, h));
    const aw = Math.round(w * scale);
    const ah = Math.round(h * scale);

    const canvas = createCanvas(aw, ah);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, aw, ah);
    const imgData = ctx.getImageData(0, 0, aw, ah);
    const data = imgData.data;

    let totalLum = 0;
    let darkPixels = 0;
    let lightPixels = 0;
    let inkCount = 0;

    // Build luminance grid
    const lum: number[][] = [];
    for (let y = 0; y < ah; y++) {
        lum[y] = [];
        for (let x = 0; x < aw; x++) {
            const idx = (y * aw + x) * 4;
            const l = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
            lum[y][x] = l;
            totalLum += l;
            if (l < 128) { darkPixels++; inkCount++; }
            else lightPixels++;
        }
    }

    const totalPx = aw * ah;
    const avgLuminance = totalLum / totalPx;
    const coverage = inkCount / totalPx;
    const contrastRatio = darkPixels / Math.max(lightPixels, 1);

    // Symmetry check: LR and TB
    let lrMatch = 0, lrTotal = 0;
    let tbMatch = 0, tbTotal = 0;
    const midX = Math.floor(aw / 2);
    const midY = Math.floor(ah / 2);

    for (let y = 0; y < ah; y++) {
        for (let x = 0; x < midX; x++) {
            const mirrorX = aw - 1 - x;
            if (mirrorX < aw) {
                lrTotal++;
                const isDark = lum[y][x] < 128;
                const mirrorDark = lum[y][mirrorX] < 128;
                if (isDark === mirrorDark) lrMatch++;
            }
        }
    }
    for (let y = 0; y < midY; y++) {
        for (let x = 0; x < aw; x++) {
            const mirrorY = ah - 1 - y;
            if (mirrorY < ah) {
                tbTotal++;
                const isDark = lum[y][x] < 128;
                const mirrorDark = lum[mirrorY][x] < 128;
                if (isDark === mirrorDark) tbMatch++;
            }
        }
    }
    const symmetryScore = ((lrMatch / Math.max(lrTotal, 1)) + (tbMatch / Math.max(tbTotal, 1))) / 2;

    // Edge density
    let edgeCount = 0;
    for (let y = 1; y < ah - 1; y++) {
        for (let x = 1; x < aw - 1; x++) {
            if (lum[y][x] < 128) {
                if (lum[y - 1][x] >= 128 || lum[y + 1][x] >= 128 ||
                    lum[y][x - 1] >= 128 || lum[y][x + 1] >= 128) {
                    edgeCount++;
                }
            }
        }
    }
    const edgeDensity = inkCount > 0 ? edgeCount / inkCount : 0;

    // Dominant region
    const qInk = [0, 0, 0, 0]; // TL, TR, BL, BR
    for (let y = 0; y < ah; y++) {
        for (let x = 0; x < aw; x++) {
            if (lum[y][x] < 128) {
                const qi = (y < midY ? 0 : 2) + (x < midX ? 0 : 1);
                qInk[qi]++;
            }
        }
    }
    const maxQ = Math.max(...qInk);
    const minQ = Math.min(...qInk);
    const qRange = maxQ - minQ;
    let dominantRegion = 'distributed';
    if (qRange / Math.max(maxQ, 1) > 0.5) {
        const maxIdx = qInk.indexOf(maxQ);
        dominantRegion = ['top-left', 'top-right', 'bottom-left', 'bottom-right'][maxIdx];
    }

    // Auto-description for pattern recreation
    const descParts: string[] = [];
    if (coverage < 0.15) descParts.push('Sparse/minimal design');
    else if (coverage < 0.4) descParts.push('Moderate ink density');
    else descParts.push('Dense/heavy design');

    if (symmetryScore > 0.8) descParts.push('highly symmetrical');
    else if (symmetryScore > 0.6) descParts.push('roughly symmetrical');
    else descParts.push('asymmetric');

    if (edgeDensity > 0.5) descParts.push('with fine detail/thin lines');
    else if (edgeDensity > 0.3) descParts.push('with moderate detail');
    else descParts.push('with bold/solid shapes');

    descParts.push(`ink ${dominantRegion}`);

    return {
        file: filePath,
        width: w,
        height: h,
        coverage,
        dominantRegion,
        edgeDensity,
        symmetryScore,
        avgLuminance,
        contrastRatio,
        description: descParts.join(', '),
    };
}

/**
 * Create a side-by-side comparison image: reference on left, our render on right.
 */
export async function createComparison(
    refPath: string,
    renderPath: string,
    outputPath: string,
): Promise<void> {
    const refImg = await loadImage(refPath);
    const renderImg = await loadImage(renderPath);

    const maxH = Math.max(refImg.height, renderImg.height);
    const totalW = refImg.width + renderImg.width + 20;

    const canvas = createCanvas(totalW, maxH + 40);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, totalW, maxH + 40);

    ctx.drawImage(refImg, 0, 20);
    ctx.drawImage(renderImg, refImg.width + 20, 20);

    ctx.fillStyle = '#000000';
    ctx.font = '14px sans-serif';
    ctx.fillText('Reference', 5, 15);
    ctx.fillText('Our Render', refImg.width + 25, 15);

    const buf = canvas.toBuffer('image/png');
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(outputPath, buf);
}

/**
 * Format reference analysis as a readable report.
 */
export function formatReferenceReport(analysis: ReferenceAnalysis): string {
    const lines: string[] = [];
    lines.push(`=== REFERENCE IMAGE ANALYSIS ===`);
    lines.push(`File: ${analysis.file}`);
    lines.push(`Size: ${analysis.width}x${analysis.height}`);
    lines.push(`Coverage: ${(analysis.coverage * 100).toFixed(1)}%`);
    lines.push(`Symmetry: ${(analysis.symmetryScore * 100).toFixed(0)}%`);
    lines.push(`Edge density: ${(analysis.edgeDensity * 100).toFixed(0)}%`);
    lines.push(`Avg luminance: ${analysis.avgLuminance.toFixed(0)}/255`);
    lines.push(`Contrast ratio: ${analysis.contrastRatio.toFixed(2)}`);
    lines.push(`Dominant region: ${analysis.dominantRegion}`);
    lines.push(`Description: ${analysis.description}`);
    return lines.join('\n');
}
