import type { PatternSet, PatternContext } from './types';

const embroideryPatterns: PatternSet = {
    name: 'Embroidery / Stitch',
    count: 6,
    draw: (type: number, { drawUV, filled, baseStyle, rng }: PatternContext) => {
        const r = rng ?? (() => Math.random());

        switch (type) {
            case 0: { // Herringbone stitch — criss-crossing zigzag band
                const rows = 2 + Math.floor(r() * 2);
                const stitchesPerRow = 4 + Math.floor(r() * 4);
                const rowH = 1.0 / (rows + 1);
                for (let row = 0; row < rows; row++) {
                    const baseV = (row + 0.5) * rowH;
                    const halfH = rowH * 0.35;
                    // Forward slanting stitches
                    const fwdPts: [number, number][] = [];
                    for (let i = 0; i <= stitchesPerRow; i++) {
                        const u = i / stitchesPerRow;
                        const v = i % 2 === 0 ? baseV - halfH : baseV + halfH;
                        fwdPts.push([u, v]);
                    }
                    drawUV(fwdPts, 'line');
                    // Back slanting stitches (offset by half)
                    const backPts: [number, number][] = [];
                    for (let i = 0; i <= stitchesPerRow; i++) {
                        const u = (i + 0.5) / (stitchesPerRow + 1);
                        const v = i % 2 === 0 ? baseV + halfH : baseV - halfH;
                        backPts.push([u, v]);
                    }
                    drawUV(backPts, 'line');
                    // Diamond fills at intersections when filled
                    if (filled) {
                        for (let i = 0; i < stitchesPerRow; i++) {
                            const cx = (i + 0.5) / stitchesPerRow;
                            const ds = rowH * 0.08;
                            drawUV([
                                [cx, baseV - ds], [cx + ds, baseV],
                                [cx, baseV + ds], [cx - ds, baseV]
                            ], 'filled');
                        }
                    }
                }
                break;
            }

            case 1: { // Chain stitch — interlocking loops along paths
                const chains = 2 + Math.floor(r() * 2);
                const loopsPerChain = 5 + Math.floor(r() * 4);
                for (let c = 0; c < chains; c++) {
                    const baseU = (c + 0.5) / chains;
                    const loopH = 0.85 / loopsPerChain;
                    const loopW = 0.06 + r() * 0.04;
                    for (let i = 0; i < loopsPerChain; i++) {
                        const cy = 0.08 + i * loopH;
                        // Each loop is a small oval
                        const pts: [number, number][] = [];
                        const n = 10;
                        for (let j = 0; j <= n; j++) {
                            const a = (j / n) * Math.PI * 2;
                            pts.push([
                                baseU + Math.cos(a) * loopW,
                                cy + Math.sin(a) * loopH * 0.4
                            ]);
                        }
                        drawUV(pts, i % 2 === 0 ? baseStyle : 'outline');
                    }
                }
                break;
            }

            case 2: { // Blanket stitch — comb/fence along edges
                const barCount = 6 + Math.floor(r() * 6);
                const height = 0.3 + r() * 0.2;
                const altHeight = r() > 0.5;
                // Bottom edge blanket stitch
                const baseline: [number, number][] = [[0, 1.0], [1, 1.0]];
                drawUV(baseline, 'line');
                for (let i = 0; i < barCount; i++) {
                    const u = (i + 0.5) / barCount;
                    const h = altHeight ? height * (0.7 + 0.3 * (i % 2)) : height;
                    drawUV([[u, 1.0], [u, 1.0 - h]], 'line');
                    if (filled) {
                        // Small cap at top of each bar
                        const capW = 0.015;
                        drawUV([
                            [u - capW, 1.0 - h], [u + capW, 1.0 - h],
                            [u + capW, 1.0 - h + 0.02], [u - capW, 1.0 - h + 0.02]
                        ], 'filled');
                    }
                }
                // Top edge blanket stitch
                const topline: [number, number][] = [[0, 0.0], [1, 0.0]];
                drawUV(topline, 'line');
                for (let i = 0; i < barCount; i++) {
                    const u = (i + 0.5) / barCount;
                    const h = altHeight ? height * (0.7 + 0.3 * ((i + 1) % 2)) : height;
                    drawUV([[u, 0.0], [u, h]], 'line');
                }
                // Connecting horizontal at midpoint
                if (filled) {
                    drawUV([[0, 0.5], [1, 0.5]], baseStyle);
                }
                break;
            }

            case 3: { // Feather stitch — alternating V-branches from spine
                const branches = 6 + Math.floor(r() * 6);
                const branchW = 0.15 + r() * 0.15;
                const spineU = 0.5;
                // Draw spine
                drawUV([[spineU, 0.02], [spineU, 0.98]], 'line');
                for (let i = 0; i < branches; i++) {
                    const v = 0.06 + (i / branches) * 0.88;
                    const vEnd = v + 0.85 / branches * 0.5;
                    const side = i % 2 === 0 ? -1 : 1;
                    // Branch line
                    drawUV([[spineU, v], [spineU + side * branchW, vEnd]], 'line');
                    // Secondary branch
                    if (r() > 0.3) {
                        const midU = spineU + side * branchW * 0.6;
                        const midV = (v + vEnd) / 2;
                        drawUV([[midU, midV], [midU + side * branchW * 0.4, midV + 0.03]], 'line');
                    }
                    // Small leaf/dot at branch tip
                    if (filled && r() > 0.4) {
                        const tipU = spineU + side * branchW;
                        const ds = 0.012;
                        drawUV([
                            [tipU - ds, vEnd], [tipU, vEnd - ds],
                            [tipU + ds, vEnd], [tipU, vEnd + ds]
                        ], 'filled');
                    }
                }
                break;
            }

            case 4: { // Cross stitch — grid of X marks
                const cols = 4 + Math.floor(r() * 3);
                const rows = 3 + Math.floor(r() * 3);
                const cellW = 1.0 / cols;
                const cellH = 1.0 / rows;
                const inset = 0.15;
                for (let row = 0; row < rows; row++) {
                    for (let col = 0; col < cols; col++) {
                        const u0 = col * cellW + cellW * inset;
                        const v0 = row * cellH + cellH * inset;
                        const u1 = (col + 1) * cellW - cellW * inset;
                        const v1 = (row + 1) * cellH - cellH * inset;
                        // X marks
                        drawUV([[u0, v0], [u1, v1]], 'line');
                        drawUV([[u1, v0], [u0, v1]], 'line');
                        // Grid cell border in filled mode for some cells
                        if (filled && (row + col) % 3 === 0) {
                            drawUV([
                                [col * cellW, row * cellH],
                                [(col + 1) * cellW, row * cellH],
                                [(col + 1) * cellW, (row + 1) * cellH],
                                [col * cellW, (row + 1) * cellH]
                            ], 'outline');
                        }
                    }
                }
                // Horizontal grid lines
                for (let row = 0; row <= rows; row++) {
                    drawUV([[0, row * cellH], [1, row * cellH]], 'line');
                }
                // Vertical grid lines
                for (let col = 0; col <= cols; col++) {
                    drawUV([[col * cellW, 0], [col * cellW, 1]], 'line');
                }
                break;
            }

            case 5: { // Seed stitch — scattered short marks
                const numSeeds = 20 + Math.floor(r() * 20);
                const seedLen = 0.025 + r() * 0.015;
                for (let i = 0; i < numSeeds; i++) {
                    const cx = 0.05 + r() * 0.9;
                    const cy = 0.05 + r() * 0.9;
                    const angle = r() * Math.PI;
                    const dx = Math.cos(angle) * seedLen;
                    const dy = Math.sin(angle) * seedLen;
                    drawUV([[cx - dx, cy - dy], [cx + dx, cy + dy]], 'line');
                }
                // Larger accent stitches
                if (filled) {
                    const accents = 3 + Math.floor(r() * 3);
                    for (let i = 0; i < accents; i++) {
                        const cx = 0.15 + r() * 0.7;
                        const cy = 0.15 + r() * 0.7;
                        const ds = 0.02;
                        drawUV([
                            [cx - ds, cy], [cx, cy - ds],
                            [cx + ds, cy], [cx, cy + ds]
                        ], 'filled');
                    }
                }
                break;
            }
        }
    }
};

export default embroideryPatterns;
