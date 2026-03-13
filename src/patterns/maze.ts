import type { PatternSet, PatternContext } from './types';

const mazePatterns: PatternSet = {
    name: 'Maze / Labyrinth',
    count: 6,
    draw: (type: number, { drawUV, filled, baseStyle, rng }: PatternContext) => {
        const r = rng ?? (() => Math.random());

        switch (type) {
            case 0: { // Theta maze — circular/radial grid maze via recursive backtracking
                const rings = 3 + Math.floor(r() * 2);
                const cols = 4 + Math.floor(r() * 3);
                const ringH = 1.0 / rings;
                const colW = 1.0 / cols;

                // Initialize grid: walls[ring][col] = { right: bool, bottom: bool }
                const walls: { right: boolean; bottom: boolean }[][] = [];
                const visited: boolean[][] = [];
                for (let ri = 0; ri < rings; ri++) {
                    walls[ri] = [];
                    visited[ri] = [];
                    for (let ci = 0; ci < cols; ci++) {
                        walls[ri][ci] = { right: true, bottom: true };
                        visited[ri][ci] = false;
                    }
                }

                // Recursive backtracking maze generation
                const stack: [number, number][] = [];
                const startR = Math.floor(r() * rings);
                const startC = Math.floor(r() * cols);
                visited[startR][startC] = true;
                stack.push([startR, startC]);

                while (stack.length > 0) {
                    const [cr, cc] = stack[stack.length - 1];
                    const neighbors: [number, number, string][] = [];
                    if (cr > 0 && !visited[cr - 1][cc]) neighbors.push([cr - 1, cc, 'up']);
                    if (cr < rings - 1 && !visited[cr + 1][cc]) neighbors.push([cr + 1, cc, 'down']);
                    if (cc > 0 && !visited[cr][cc - 1]) neighbors.push([cr, cc - 1, 'left']);
                    if (cc < cols - 1 && !visited[cr][cc + 1]) neighbors.push([cr, cc + 1, 'right']);

                    if (neighbors.length === 0) {
                        stack.pop();
                        continue;
                    }
                    const [nr, nc, dir] = neighbors[Math.floor(r() * neighbors.length)];
                    if (dir === 'up') walls[cr - 1][cc].bottom = false;
                    else if (dir === 'down') walls[cr][cc].bottom = false;
                    else if (dir === 'left') walls[cr][cc - 1].right = false;
                    else if (dir === 'right') walls[cr][cc].right = false;
                    visited[nr][nc] = true;
                    stack.push([nr, nc]);
                }

                // Draw walls
                for (let ri = 0; ri < rings; ri++) {
                    for (let ci = 0; ci < cols; ci++) {
                        const u = ci * colW;
                        const v = ri * ringH;
                        if (walls[ri][ci].right && ci < cols - 1) {
                            drawUV([[u + colW, v], [u + colW, v + ringH]], 'line');
                        }
                        if (walls[ri][ci].bottom && ri < rings - 1) {
                            drawUV([[u, v + ringH], [u + colW, v + ringH]], 'line');
                        }
                    }
                }
                // Outer border
                drawUV([[0, 0], [1, 0]], 'line');
                drawUV([[0, 1], [1, 1]], 'line');
                drawUV([[0, 0], [0, 1]], 'line');
                drawUV([[1, 0], [1, 1]], 'line');

                // Fill some dead-end cells when filled
                if (filled) {
                    for (let ri = 0; ri < rings; ri++) {
                        for (let ci = 0; ci < cols; ci++) {
                            let openWalls = 0;
                            if (ri > 0 && !walls[ri - 1][ci].bottom) openWalls++;
                            if (ri < rings - 1 && !walls[ri][ci].bottom) openWalls++;
                            if (ci > 0 && !walls[ri][ci - 1].right) openWalls++;
                            if (ci < cols - 1 && !walls[ri][ci].right) openWalls++;
                            if (openWalls === 1) {
                                const u = ci * colW;
                                const v = ri * ringH;
                                const inset = 0.15;
                                drawUV([
                                    [u + colW * inset, v + ringH * inset],
                                    [u + colW * (1 - inset), v + ringH * inset],
                                    [u + colW * (1 - inset), v + ringH * (1 - inset)],
                                    [u + colW * inset, v + ringH * (1 - inset)]
                                ], 'filled');
                            }
                        }
                    }
                }
                break;
            }

            case 1: { // Recursive division maze
                const drawDivision = (u0: number, v0: number, u1: number, v1: number, depth: number) => {
                    const w = u1 - u0;
                    const h = v1 - v0;
                    if (depth <= 0 || w < 0.08 || h < 0.08) return;

                    if (w > h) {
                        // Vertical wall
                        const wallU = u0 + w * (0.3 + r() * 0.4);
                        const gapV = v0 + h * (0.1 + r() * 0.8);
                        const gapSize = h * 0.15;
                        drawUV([[wallU, v0], [wallU, Math.max(v0, gapV - gapSize)]], 'line');
                        drawUV([[wallU, Math.min(v1, gapV + gapSize)], [wallU, v1]], 'line');
                        drawDivision(u0, v0, wallU, v1, depth - 1);
                        drawDivision(wallU, v0, u1, v1, depth - 1);
                    } else {
                        // Horizontal wall
                        const wallV = v0 + h * (0.3 + r() * 0.4);
                        const gapU = u0 + w * (0.1 + r() * 0.8);
                        const gapSize = w * 0.15;
                        drawUV([[u0, wallV], [Math.max(u0, gapU - gapSize), wallV]], 'line');
                        drawUV([[Math.min(u1, gapU + gapSize), wallV], [u1, wallV]], 'line');
                        drawDivision(u0, v0, u1, wallV, depth - 1);
                        drawDivision(u0, wallV, u1, v1, depth - 1);
                    }
                };

                const depth = 3 + Math.floor(r() * 2);
                drawDivision(0, 0, 1, 1, depth);
                // Border
                drawUV([[0, 0], [1, 0], [1, 1], [0, 1]], filled ? baseStyle : 'outline');
                break;
            }

            case 2: { // Classical labyrinth path — unicursal winding
                const circuits = 3 + Math.floor(r() * 3);
                // Draw concentric circuit arcs with specific gap pattern
                const circuitOrder = [2, 0, 3, 1]; // traversal order (simplified)
                const gapSide = r() > 0.5;

                for (let i = 0; i < circuits; i++) {
                    const v = (i + 0.5) / circuits;
                    const gapU = gapSide ? 0.85 + r() * 0.1 : 0.05 + r() * 0.1;
                    const gapW = 0.08;

                    // Draw arc with gap
                    if (gapU > 0.15) {
                        const pts1: [number, number][] = [];
                        const steps = Math.max(4, Math.floor(gapU * 12));
                        for (let s = 0; s <= steps; s++) {
                            pts1.push([s / steps * (gapU - gapW), v]);
                        }
                        drawUV(pts1, 'line');
                    }
                    if (gapU < 0.85) {
                        const pts2: [number, number][] = [];
                        const start = gapU + gapW;
                        const steps = Math.max(4, Math.floor((1 - start) * 12));
                        for (let s = 0; s <= steps; s++) {
                            pts2.push([start + s / steps * (1 - start), v]);
                        }
                        drawUV(pts2, 'line');
                    }

                    // Radial connectors at gaps
                    if (i < circuits - 1) {
                        const nextV = (i + 1.5) / circuits;
                        const connU = gapSide ? gapU - gapW * 0.5 : gapU + gapW * 0.5;
                        drawUV([[connU, v], [connU, nextV]], 'line');
                    }
                }

                // Fill between paths in filled mode
                if (filled) {
                    for (let i = 0; i < circuits - 1; i += 2) {
                        const v0 = (i + 0.5) / circuits;
                        const v1 = (i + 1.5) / circuits;
                        drawUV([
                            [0.1, v0], [0.9, v0], [0.9, v1], [0.1, v1]
                        ], 'filled');
                    }
                }
                break;
            }

            case 3: { // Binary tree maze — diagonal bias
                const gridW = 5 + Math.floor(r() * 3);
                const gridH = 4 + Math.floor(r() * 2);
                const cellW = 1.0 / gridW;
                const cellH = 1.0 / gridH;

                for (let row = 0; row < gridH; row++) {
                    for (let col = 0; col < gridW; col++) {
                        const u = col * cellW;
                        const v = row * cellH;
                        // Binary tree: randomly carve north or west
                        const canNorth = row > 0;
                        const canWest = col > 0;
                        if (canNorth && canWest) {
                            if (r() > 0.5) {
                                // Carve north — draw west wall
                                drawUV([[u, v], [u, v + cellH]], 'line');
                            } else {
                                // Carve west — draw north wall
                                drawUV([[u, v], [u + cellW, v]], 'line');
                            }
                        } else if (canNorth) {
                            // First column — always carve north, keep west wall
                            drawUV([[u, v], [u, v + cellH]], 'line');
                        } else if (canWest) {
                            // First row — always carve west, keep north wall
                            drawUV([[u, v], [u + cellW, v]], 'line');
                        }
                    }
                }
                // Draw outer border
                drawUV([[0, 0], [1, 0]], 'line');
                drawUV([[1, 0], [1, 1]], 'line');
                drawUV([[0, 1], [1, 1]], 'line');
                drawUV([[0, 0], [0, 1]], 'line');

                // Accent fill in cells
                if (filled) {
                    for (let row = 0; row < gridH; row++) {
                        for (let col = 0; col < gridW; col++) {
                            if (r() > 0.75) {
                                const u = col * cellW;
                                const v = row * cellH;
                                const inset = 0.2;
                                drawUV([
                                    [u + cellW * inset, v + cellH * inset],
                                    [u + cellW * (1 - inset), v + cellH * inset],
                                    [u + cellW * (1 - inset), v + cellH * (1 - inset)],
                                    [u + cellW * inset, v + cellH * (1 - inset)]
                                ], 'filled');
                            }
                        }
                    }
                }
                break;
            }

            case 4: { // Hilbert curve — space-filling fractal path
                const pts: [number, number][] = [];
                const order = 2 + Math.floor(r() * 2); // 2-3

                const hilbert = (
                    x: number, y: number,
                    ax: number, ay: number,
                    bx: number, by: number,
                    depth: number
                ) => {
                    const w = Math.abs(ax + ay);
                    const h = Math.abs(bx + by);
                    const dax = ax > 0 ? 1 : ax < 0 ? -1 : 0;
                    const day = ay > 0 ? 1 : ay < 0 ? -1 : 0;
                    const dbx = bx > 0 ? 1 : bx < 0 ? -1 : 0;
                    const dby = by > 0 ? 1 : by < 0 ? -1 : 0;

                    if (depth <= 0 || (w <= 1 && h <= 1)) {
                        const size = 1 << order;
                        const px = (x + (x + w)) / 2 / size;
                        const py = (y + (y + h)) / 2 / size;
                        pts.push([
                            Math.min(1, Math.max(0, 0.05 + px * 0.9)),
                            Math.min(1, Math.max(0, 0.05 + py * 0.9))
                        ]);
                        return;
                    }

                    const ax2 = Math.floor(ax / 2);
                    const ay2 = Math.floor(ay / 2);
                    const bx2 = Math.floor(bx / 2);
                    const by2 = Math.floor(by / 2);

                    const w2 = Math.abs(ax2 + ay2);
                    const h2 = Math.abs(bx2 + by2);

                    if (w2 >= h2) {
                        hilbert(x, y, bx2, by2, ax2, ay2, depth - 1);
                        hilbert(x + ax2, y + ay2, ax2, ay2, bx2, by2, depth - 1);
                        hilbert(x + ax2 + bx2, y + ay2 + by2, -bx2, -by2, -(ax - ax2), -(ay - ay2), depth - 1);
                    } else {
                        hilbert(x, y, ax2, ay2, bx2, by2, depth - 1);
                        hilbert(x + bx2, y + by2, bx2, by2, ax2, ay2, depth - 1);
                        hilbert(x + ax2 + bx2, y + ay2 + by2, -(ax - ax2), -(ay - ay2), -bx2, -by2, depth - 1);
                    }
                };

                const size = 1 << order;
                hilbert(0, 0, size, 0, 0, size, order);
                drawUV(pts, filled ? baseStyle : 'line');
                break;
            }

            case 5: { // Braid maze — woven loops, no dead ends
                const gridW = 4 + Math.floor(r() * 2);
                const gridH = 3 + Math.floor(r() * 2);
                const cellW = 1.0 / gridW;
                const cellH = 1.0 / gridH;

                // Draw interlocking loops — horizontal and vertical paths that weave
                for (let row = 0; row < gridH; row++) {
                    // Horizontal wavy bands
                    const v = (row + 0.5) * cellH;
                    const pts: [number, number][] = [];
                    for (let s = 0; s <= 20; s++) {
                        const u = s / 20;
                        const wave = Math.sin(u * Math.PI * (2 + Math.floor(r() * 2))) * cellH * 0.25;
                        pts.push([u, v + wave]);
                    }
                    drawUV(pts, 'line');
                }

                for (let col = 0; col < gridW; col++) {
                    // Vertical wavy bands
                    const u = (col + 0.5) * cellW;
                    const pts: [number, number][] = [];
                    for (let s = 0; s <= 20; s++) {
                        const v = s / 20;
                        const wave = Math.sin(v * Math.PI * (2 + Math.floor(r() * 2))) * cellW * 0.25;
                        pts.push([u + wave, v]);
                    }
                    drawUV(pts, 'line');
                }

                // Draw intersection nodes
                for (let row = 0; row < gridH; row++) {
                    for (let col = 0; col < gridW; col++) {
                        const cx = (col + 0.5) * cellW;
                        const cy = (row + 0.5) * cellH;
                        const nr = 0.02;
                        if (filled || (row + col) % 2 === 0) {
                            const n = 8;
                            const nodePts: [number, number][] = [];
                            for (let i = 0; i <= n; i++) {
                                const a = (i / n) * Math.PI * 2;
                                nodePts.push([cx + Math.cos(a) * nr, cy + Math.sin(a) * nr]);
                            }
                            drawUV(nodePts, (row + col) % 2 === 0 ? 'filled' : 'outline');
                        }
                    }
                }
                break;
            }
        }
    }
};

export default mazePatterns;
