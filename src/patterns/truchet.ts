import type { PatternSet, PatternContext } from './types';

// Truchet tile patterns — flowing connected curves from rotated base tiles
const truchetPatterns: PatternSet = {
    name: 'Truchet Tiles',
    count: 6,
    draw: (type: number, { drawUV, filled, baseStyle, rng }: PatternContext) => {
        const r = rng ?? (() => Math.random());

        switch (type) {
            case 0: { // Quarter-circle Truchet — classic flowing rivers
                const cols = 3 + Math.floor(r() * 2);
                const rows = 2 + Math.floor(r() * 2);
                const cellW = 1 / cols, cellH = 1 / rows;
                for (let row = 0; row < rows; row++) {
                    for (let col = 0; col < cols; col++) {
                        const x = col * cellW, y = row * cellH;
                        const rot = Math.floor(r() * 2); // 0 or 1
                        const pts1: [number, number][] = [];
                        const pts2: [number, number][] = [];
                        for (let s = 0; s <= 8; s++) {
                            const a = (s / 8) * Math.PI / 2;
                            if (rot === 0) {
                                pts1.push([x + Math.cos(a) * cellW * 0.5, y + Math.sin(a) * cellH * 0.5]);
                                pts2.push([x + cellW - Math.cos(a) * cellW * 0.5, y + cellH - Math.sin(a) * cellH * 0.5]);
                            } else {
                                pts1.push([x + cellW - Math.cos(a) * cellW * 0.5, y + Math.sin(a) * cellH * 0.5]);
                                pts2.push([x + Math.cos(a) * cellW * 0.5, y + cellH - Math.sin(a) * cellH * 0.5]);
                            }
                        }
                        drawUV(pts1, (row + col) % 3 === 0 ? baseStyle : 'line');
                        drawUV(pts2, 'line');
                    }
                }
                break;
            }

            case 1: { // Diagonal Truchet — maze-like diagonals
                const cols = 4 + Math.floor(r() * 3);
                const rows = 3 + Math.floor(r() * 2);
                const cellW = 1 / cols, cellH = 1 / rows;
                for (let row = 0; row < rows; row++) {
                    for (let col = 0; col < cols; col++) {
                        const x = col * cellW, y = row * cellH;
                        if (r() > 0.5) {
                            drawUV([[x, y], [x + cellW, y + cellH]], 'line');
                        } else {
                            drawUV([[x + cellW, y], [x, y + cellH]], 'line');
                        }
                    }
                }
                // Fill some triangles for visual weight
                for (let row = 0; row < rows; row++) {
                    for (let col = 0; col < cols; col++) {
                        if (r() > 0.7) {
                            const x = col * cellW, y = row * cellH;
                            drawUV([[x, y], [x + cellW, y], [x + cellW * 0.5, y + cellH * 0.5]], baseStyle);
                        }
                    }
                }
                break;
            }

            case 2: { // Smith Truchet — triangle-based tiles
                const n = 3 + Math.floor(r() * 2);
                const cellSize = 1 / n;
                for (let row = 0; row < n; row++) {
                    for (let col = 0; col < n; col++) {
                        const x = col * cellSize, y = row * cellSize;
                        const variant = Math.floor(r() * 4);
                        const cx = x + cellSize / 2, cy = y + cellSize / 2;
                        const half = cellSize / 2;
                        const tris: [number, number][][] = [
                            [[x, y], [x + cellSize, y], [cx, cy]],
                            [[x + cellSize, y], [x + cellSize, y + cellSize], [cx, cy]],
                            [[x + cellSize, y + cellSize], [x, y + cellSize], [cx, cy]],
                            [[x, y + cellSize], [x, y], [cx, cy]]
                        ];
                        for (let t = 0; t < 4; t++) {
                            drawUV(tris[t], (t + variant) % 2 === 0 ? baseStyle : 'outline');
                        }
                    }
                }
                break;
            }

            case 3: { // Circular Truchet — overlapping arcs
                const cols = 3, rows = 2;
                const cellW = 1 / cols, cellH = 1 / rows;
                for (let row = 0; row < rows; row++) {
                    for (let col = 0; col < cols; col++) {
                        const cx = (col + 0.5) * cellW;
                        const cy = (row + 0.5) * cellH;
                        const radius = cellW * (0.3 + r() * 0.15);
                        const pts: [number, number][] = [];
                        const startA = r() * Math.PI * 2;
                        const sweep = Math.PI * (0.5 + r());
                        for (let s = 0; s <= 12; s++) {
                            const a = startA + (s / 12) * sweep;
                            pts.push([cx + Math.cos(a) * radius, cy + Math.sin(a) * radius * (cellH / cellW)]);
                        }
                        drawUV(pts, (row + col) % 2 === 0 ? baseStyle : 'line');
                    }
                }
                break;
            }

            case 4: { // Woven Truchet — over-under basket weave
                const n = 3 + Math.floor(r() * 2);
                const cellSize = 1 / n;
                for (let row = 0; row < n; row++) {
                    for (let col = 0; col < n; col++) {
                        const x = col * cellSize, y = row * cellSize;
                        const isOver = (row + col) % 2 === 0;
                        // Horizontal bar
                        drawUV([
                            [x + cellSize * 0.05, y + cellSize * 0.3],
                            [x + cellSize * 0.95, y + cellSize * 0.3],
                            [x + cellSize * 0.95, y + cellSize * 0.7],
                            [x + cellSize * 0.05, y + cellSize * 0.7]
                        ], isOver ? baseStyle : 'outline');
                        // Vertical bar
                        drawUV([
                            [x + cellSize * 0.3, y + cellSize * 0.05],
                            [x + cellSize * 0.7, y + cellSize * 0.05],
                            [x + cellSize * 0.7, y + cellSize * 0.95],
                            [x + cellSize * 0.3, y + cellSize * 0.95]
                        ], isOver ? 'outline' : baseStyle);
                    }
                }
                break;
            }

            case 5: { // Multi-curve Truchet — three arcs per tile
                const cols = 3, rows = 2;
                const cellW = 1 / cols, cellH = 1 / rows;
                for (let row = 0; row < rows; row++) {
                    for (let col = 0; col < cols; col++) {
                        const x = col * cellW, y = row * cellH;
                        const rot = Math.floor(r() * 4);
                        for (let ring = 0; ring < 3; ring++) {
                            const radius = cellW * (0.15 + ring * 0.12);
                            const pts: [number, number][] = [];
                            const corners = [[x, y], [x + cellW, y], [x + cellW, y + cellH], [x, y + cellH]];
                            const corner = corners[(rot + ring) % 4];
                            for (let s = 0; s <= 8; s++) {
                                const a = ((rot + ring) % 4) * Math.PI / 2 + (s / 8) * Math.PI / 2;
                                pts.push([corner[0] + Math.cos(a) * radius, corner[1] + Math.sin(a) * radius]);
                            }
                            drawUV(pts, ring === 1 ? baseStyle : 'line');
                        }
                    }
                }
                break;
            }
        }
    }
};

export default truchetPatterns;
