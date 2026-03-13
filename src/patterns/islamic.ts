import type { PatternSet, PatternContext } from './types';

// Islamic geometric patterns — star polygons, girih tiles, arabesques
const islamicPatterns: PatternSet = {
    name: 'Islamic Geometric',
    count: 6,
    draw: (type: number, { drawUV, filled, baseStyle, rng }: PatternContext) => {
        const r = rng ?? (() => Math.random());

        switch (type) {
            case 0: { // 8-point star (khatam)
                const cx = 0.5, cy = 0.5;
                const outerR = 0.38;
                const innerR = outerR * 0.42;
                const pts: [number, number][] = [];
                for (let i = 0; i < 16; i++) {
                    const a = (i / 16) * Math.PI * 2;
                    const rad = i % 2 === 0 ? outerR : innerR;
                    pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]);
                }
                drawUV(pts, baseStyle);
                // Inner octagon
                const inner: [number, number][] = [];
                for (let i = 0; i < 8; i++) {
                    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
                    inner.push([cx + Math.cos(a) * innerR * 0.9, cy + Math.sin(a) * innerR * 0.9]);
                }
                drawUV(inner, filled ? 'opaque-outline' : 'outline');
                break;
            }

            case 1: { // Girih interlocking hexagons
                const cols = 3, rows = 2;
                const cellW = 1 / cols, cellH = 1 / rows;
                for (let row = 0; row < rows; row++) {
                    for (let col = 0; col < cols; col++) {
                        const cx = (col + 0.5) * cellW;
                        const cy = (row + 0.5) * cellH;
                        const rad = cellW * 0.4;
                        const hex: [number, number][] = [];
                        for (let i = 0; i < 6; i++) {
                            const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
                            hex.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]);
                        }
                        drawUV(hex, (row + col) % 2 === 0 ? baseStyle : 'outline');
                        // Connector lines to neighbors
                        for (let i = 0; i < 6; i++) {
                            const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
                            drawUV([
                                [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad],
                                [cx + Math.cos(a) * rad * 1.5, cy + Math.sin(a) * rad * 1.5]
                            ], 'line');
                        }
                    }
                }
                break;
            }

            case 2: { // Arabesque vine scroll
                const nCurves = 3 + Math.floor(r() * 2);
                for (let c = 0; c < nCurves; c++) {
                    const baseV = (c + 1) / (nCurves + 1);
                    const amp = 0.08 + r() * 0.05;
                    const freq = 2 + Math.floor(r() * 2);
                    const pts: [number, number][] = [];
                    for (let s = 0; s <= 20; s++) {
                        const u = s / 20;
                        const v = baseV + Math.sin(u * Math.PI * freq) * amp;
                        pts.push([u, v]);
                    }
                    drawUV(pts, c === 0 ? baseStyle : 'line');
                    // Leaf tendrils at peaks
                    for (let peak = 0; peak < freq; peak++) {
                        const pu = (peak * 2 + 1) / (freq * 2);
                        const pv = baseV + amp * (peak % 2 === 0 ? 1 : -1);
                        const leafDir = peak % 2 === 0 ? -1 : 1;
                        drawUV([
                            [pu, pv],
                            [pu + 0.03, pv + leafDir * 0.04],
                            [pu + 0.06, pv + leafDir * 0.02],
                        ], 'line');
                    }
                }
                break;
            }

            case 3: { // 6-point star tessellation
                const n = 3;
                const cellSize = 1 / n;
                for (let row = 0; row < n; row++) {
                    for (let col = 0; col < n; col++) {
                        const cx = (col + 0.5) * cellSize;
                        const cy = (row + 0.5) * cellSize;
                        const rad = cellSize * 0.35;
                        // Star of David: two overlapping triangles
                        const tri1: [number, number][] = [];
                        const tri2: [number, number][] = [];
                        for (let i = 0; i < 3; i++) {
                            const a1 = (i / 3) * Math.PI * 2 - Math.PI / 2;
                            const a2 = a1 + Math.PI / 3;
                            tri1.push([cx + Math.cos(a1) * rad, cy + Math.sin(a1) * rad]);
                            tri2.push([cx + Math.cos(a2) * rad, cy + Math.sin(a2) * rad]);
                        }
                        drawUV(tri1, baseStyle);
                        drawUV(tri2, filled ? 'outline' : baseStyle);
                    }
                }
                break;
            }

            case 4: { // Muqarnas cross vault pattern
                const n = 4;
                const cellSize = 1 / n;
                for (let row = 0; row < n; row++) {
                    for (let col = 0; col < n; col++) {
                        const x = col * cellSize, y = row * cellSize;
                        const cx = x + cellSize / 2, cy = y + cellSize / 2;
                        const half = cellSize / 2 * 0.85;
                        // Diamond
                        drawUV([
                            [cx, cy - half], [cx + half, cy],
                            [cx, cy + half], [cx - half, cy]
                        ], (row + col) % 2 === 0 ? baseStyle : 'outline');
                        // Small squares at corners
                        const sq = half * 0.3;
                        drawUV([
                            [cx - sq, cy - half + sq], [cx + sq, cy - half + sq],
                            [cx + sq, cy - half - sq + cellSize * 0.05], [cx - sq, cy - half - sq + cellSize * 0.05]
                        ], 'line');
                    }
                }
                break;
            }

            case 5: { // Zellige mosaic — interlocking pentagons and decagons
                const cx = 0.5, cy = 0.5;
                // Central decagon
                const decR = 0.25;
                const dec: [number, number][] = [];
                for (let i = 0; i < 10; i++) {
                    const a = (i / 10) * Math.PI * 2;
                    dec.push([cx + Math.cos(a) * decR, cy + Math.sin(a) * decR]);
                }
                drawUV(dec, baseStyle);
                // Surrounding pentagons
                for (let i = 0; i < 10; i++) {
                    const a = (i / 10) * Math.PI * 2;
                    const pcx = cx + Math.cos(a) * decR * 1.45;
                    const pcy = cy + Math.sin(a) * decR * 1.45;
                    const pR = decR * 0.38;
                    const pent: [number, number][] = [];
                    for (let j = 0; j < 5; j++) {
                        const pa = a + (j / 5) * Math.PI * 2;
                        pent.push([pcx + Math.cos(pa) * pR, pcy + Math.sin(pa) * pR]);
                    }
                    drawUV(pent, i % 2 === 0 ? 'outline' : baseStyle);
                }
                break;
            }
        }
    }
};

export default islamicPatterns;
