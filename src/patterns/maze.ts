import type { PatternSet, PatternContext } from './types';

const mazePatterns: PatternSet = {
    name: 'Maze / Labyrinth',
    count: 6,
    draw: (type: number, { drawUV, filled, baseStyle, rng }: PatternContext) => {
        const r = rng ?? (() => Math.random());

        switch (type) {
            case 0: { // Theta maze — concentric rings with radial walls and gaps
                // In UV space: horizontal lines = concentric rings, vertical lines = radial walls
                const rings = 3 + Math.floor(r() * 3); // 3-5 concentric rings
                const segs = 3 + Math.floor(r() * 3); // 3-5 segments per ring
                const ringH = 1.0 / rings;
                const segW = 1.0 / segs;
                const wallThick = filled ? 0.025 : 0;

                // Draw concentric ring walls (horizontal lines at each ring boundary)
                for (let ri = 0; ri <= rings; ri++) {
                    const v = ri * ringH;
                    if (ri === 0 || ri === rings) {
                        // Full boundary walls
                        if (filled) {
                            const t = wallThick * 0.5;
                            const vlo = Math.max(0, v - t);
                            const vhi = Math.min(1, v + t);
                            drawUV([[0, vlo], [1, vlo], [1, vhi], [0, vhi]], 'filled');
                        } else {
                            drawUV([[0, v], [1, v]], 'line');
                        }
                        continue;
                    }
                    // Each ring wall has one gap per segment (randomly placed)
                    for (let si = 0; si < segs; si++) {
                        const u0 = si * segW;
                        const u1 = (si + 1) * segW;
                        // Gap position within this segment
                        const gapCenter = u0 + segW * (0.2 + r() * 0.6);
                        const gapHalf = segW * 0.15;
                        const gapStart = Math.max(u0, gapCenter - gapHalf);
                        const gapEnd = Math.min(u1, gapCenter + gapHalf);

                        if (filled) {
                            const t = wallThick * 0.5;
                            if (gapStart > u0 + 0.01) {
                                drawUV([
                                    [u0, v - t], [gapStart, v - t],
                                    [gapStart, v + t], [u0, v + t]
                                ], 'filled');
                            }
                            if (u1 > gapEnd + 0.01) {
                                drawUV([
                                    [gapEnd, v - t], [u1, v - t],
                                    [u1, v + t], [gapEnd, v + t]
                                ], 'filled');
                            }
                        } else {
                            if (gapStart > u0 + 0.01) {
                                drawUV([[u0, v], [gapStart, v]], 'line');
                            }
                            if (u1 > gapEnd + 0.01) {
                                drawUV([[gapEnd, v], [u1, v]], 'line');
                            }
                        }
                    }
                }

                // Draw radial walls (vertical lines) with staggered gaps between rings
                for (let si = 0; si < segs; si++) {
                    const u = si * segW;
                    if (u < 0.01) continue; // skip u=0 (wraps around in mandala)
                    for (let ri = 0; ri < rings; ri++) {
                        // Alternate: skip some radial walls for variety
                        if (r() > 0.65) continue;
                        const v0 = ri * ringH;
                        const v1 = (ri + 1) * ringH;
                        if (filled) {
                            const t = wallThick * 0.5;
                            drawUV([
                                [u - t, v0], [u + t, v0],
                                [u + t, v1], [u - t, v1]
                            ], 'filled');
                        } else {
                            drawUV([[u, v0], [u, v1]], 'line');
                        }
                    }
                }

                // Decorative dots at some intersections
                if (filled) {
                    for (let ri = 1; ri < rings; ri++) {
                        for (let si = 0; si < segs; si++) {
                            if (r() > 0.3) continue;
                            const cu = si * segW;
                            const cv = ri * ringH;
                            const dotR = 0.015;
                            const pts: [number, number][] = [];
                            for (let j = 0; j <= 6; j++) {
                                const a = (j / 6) * Math.PI * 2;
                                pts.push([cu + Math.cos(a) * dotR, cv + Math.sin(a) * dotR]);
                            }
                            drawUV(pts, 'opaque-outline');
                        }
                    }
                }
                break;
            }

            case 1: { // Classical labyrinth — single winding path (Cretan-style)
                // A series of U-turns that wind back and forth between v=0 and v=1
                const turns = 3 + Math.floor(r() * 3); // 3-5 turns
                const margin = 0.06;
                const pathW = (1.0 - 2 * margin) / (turns * 2 + 1);
                const style = filled ? baseStyle : 'line';

                // Build the winding path as a series of horizontal runs connected by vertical turns
                const path: [number, number][] = [];
                for (let t = 0; t <= turns * 2; t++) {
                    const u = margin + t * pathW + pathW * 0.5;
                    const goingUp = t % 2 === 0;

                    if (t === 0) {
                        path.push([u, goingUp ? 1 - margin : margin]);
                    }
                    // Vertical run
                    path.push([u, goingUp ? margin : 1 - margin]);
                    // Horizontal connector to next column (if not last)
                    if (t < turns * 2) {
                        const nextU = margin + (t + 1) * pathW + pathW * 0.5;
                        path.push([nextU, goingUp ? margin : 1 - margin]);
                    }
                }

                drawUV(path, style);

                // Draw the outer walls
                drawUV([[0, 0], [1, 0]], 'line');
                drawUV([[0, 1], [1, 1]], 'line');

                // Fill alternating corridors for depth
                if (filled) {
                    for (let t = 0; t < turns * 2; t += 2) {
                        if (r() > 0.5) continue;
                        const u0 = margin + t * pathW;
                        const u1 = u0 + pathW;
                        const inset = 0.03;
                        drawUV([
                            [u0 + inset, margin + inset], [u1 - inset, margin + inset],
                            [u1 - inset, 1 - margin - inset], [u0 + inset, 1 - margin - inset]
                        ], 'opaque-outline');
                    }
                }
                break;
            }

            case 2: { // Branching corridors — thick maze-like corridors with dead ends
                const corridorW = 0.06 + r() * 0.03;
                const style = filled ? baseStyle : 'line';

                // Main corridor runs vertically through the center
                const mainU = 0.4 + r() * 0.2;
                drawUV([[mainU, 0], [mainU, 1]], style);

                // Branch corridors at various heights
                const numBranches = 3 + Math.floor(r() * 3);
                for (let b = 0; b < numBranches; b++) {
                    const branchV = (b + 0.5) / numBranches;
                    const goRight = r() > 0.5;
                    const branchLen = 0.15 + r() * 0.35;
                    const endU = goRight
                        ? Math.min(1 - 0.02, mainU + branchLen)
                        : Math.max(0.02, mainU - branchLen);

                    // Horizontal branch
                    drawUV([[mainU, branchV], [endU, branchV]], style);

                    // Some branches have a T-junction or L-turn
                    if (r() > 0.4) {
                        const turnLen = 0.08 + r() * 0.15;
                        const turnDir = r() > 0.5 ? 1 : -1;
                        const turnEnd = Math.min(1, Math.max(0, branchV + turnDir * turnLen));
                        drawUV([[endU, branchV], [endU, turnEnd]], style);

                        // Dead end marker
                        if (filled && r() > 0.5) {
                            const dr = corridorW * 0.6;
                            const pts: [number, number][] = [];
                            for (let j = 0; j <= 6; j++) {
                                const a = (j / 6) * Math.PI * 2;
                                pts.push([endU + Math.cos(a) * dr, turnEnd + Math.sin(a) * dr]);
                            }
                            drawUV(pts, 'opaque-outline');
                        }
                    }

                    // Sub-branch for complexity
                    if (r() > 0.5) {
                        const subV = branchV + (r() - 0.5) * 0.1;
                        const midU = mainU + (endU - mainU) * (0.3 + r() * 0.4);
                        const subLen = 0.05 + r() * 0.1;
                        const subEnd = Math.min(1, Math.max(0, subV + (r() > 0.5 ? subLen : -subLen)));
                        drawUV([[midU, branchV], [midU, subEnd]], style);
                    }
                }

                // Wall borders
                if (filled) {
                    // Draw corridor walls as paired lines
                    const hw = corridorW * 0.5;
                    drawUV([[mainU - hw, 0], [mainU - hw, 1]], 'line');
                    drawUV([[mainU + hw, 0], [mainU + hw, 1]], 'line');
                } else {
                    drawUV([[0, 0], [1, 0]], 'line');
                    drawUV([[0, 1], [1, 1]], 'line');
                }
                break;
            }

            case 3: { // Brick/offset maze — staggered bricks with passage gaps
                const brickRows = 3 + Math.floor(r() * 3);
                const brickCols = 2 + Math.floor(r() * 2);
                const brickH = 1.0 / brickRows;
                const brickW = 1.0 / brickCols;
                const mainStyle = filled ? 'filled' : 'outline';

                for (let row = 0; row < brickRows; row++) {
                    const offset = (row % 2 === 0) ? 0 : brickW * 0.5;
                    const v0 = row * brickH;
                    const v1 = v0 + brickH;
                    const inset = 0.015;

                    for (let col = -1; col <= brickCols; col++) {
                        const u0 = Math.max(0, col * brickW + offset);
                        const u1 = Math.min(1, (col + 1) * brickW + offset);
                        if (u1 <= u0 + 0.02) continue;

                        // Randomly open some bricks (passage through)
                        if (r() > 0.25) {
                            drawUV([
                                [u0 + inset, v0 + inset], [u1 - inset, v0 + inset],
                                [u1 - inset, v1 - inset], [u0 + inset, v1 - inset]
                            ], mainStyle);
                        } else {
                            // Gap — just draw the horizontal edges (no vertical sides)
                            drawUV([[u0 + inset, v0 + inset], [u1 - inset, v0 + inset]], 'line');
                            drawUV([[u0 + inset, v1 - inset], [u1 - inset, v1 - inset]], 'line');
                        }
                    }
                }

                // Border
                drawUV([[0, 0], [1, 0], [1, 1], [0, 1]], filled ? baseStyle : 'outline');
                break;
            }

            case 4: { // Hilbert curve — space-filling fractal path
                const pts: [number, number][] = [];
                const order = 2 + Math.floor(r() * 2);

                const hilbert = (
                    x: number, y: number,
                    ax: number, ay: number,
                    bx: number, by: number,
                    depth: number
                ) => {
                    const w = Math.abs(ax + ay);
                    const h = Math.abs(bx + by);

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

                // Draw as connected path
                drawUV(pts, filled ? baseStyle : 'line');

                // Draw waypoint dots at corners in filled mode
                if (filled) {
                    for (let i = 0; i < pts.length; i += Math.floor(pts.length / 8)) {
                        const p = pts[i];
                        const dr = 0.012;
                        const dotPts: [number, number][] = [];
                        for (let j = 0; j <= 6; j++) {
                            const a = (j / 6) * Math.PI * 2;
                            dotPts.push([p[0] + Math.cos(a) * dr, p[1] + Math.sin(a) * dr]);
                        }
                        drawUV(dotPts, 'filled');
                    }
                }
                break;
            }

            case 5: { // Recursive division maze — fractal nested chambers
                const drawDivision = (u0: number, v0: number, u1: number, v1: number, depth: number) => {
                    const w = u1 - u0;
                    const h = v1 - v0;
                    if (depth <= 0 || w < 0.07 || h < 0.07) return;

                    if (w > h) {
                        const wallU = u0 + w * (0.3 + r() * 0.4);
                        const gapV = v0 + h * (0.1 + r() * 0.8);
                        const gapSize = h * 0.15;
                        drawUV([[wallU, v0], [wallU, Math.max(v0, gapV - gapSize)]], 'line');
                        drawUV([[wallU, Math.min(v1, gapV + gapSize)], [wallU, v1]], 'line');
                        drawDivision(u0, v0, wallU, v1, depth - 1);
                        drawDivision(wallU, v0, u1, v1, depth - 1);
                    } else {
                        const wallV = v0 + h * (0.3 + r() * 0.4);
                        const gapU = u0 + w * (0.1 + r() * 0.8);
                        const gapSize = w * 0.15;
                        drawUV([[u0, wallV], [Math.max(u0, gapU - gapSize), wallV]], 'line');
                        drawUV([[Math.min(u1, gapU + gapSize), wallV], [u1, wallV]], 'line');
                        drawDivision(u0, v0, u1, wallV, depth - 1);
                        drawDivision(u0, wallV, u1, v1, depth - 1);
                    }

                    // Fill leaf chambers in filled mode
                    if (filled && depth === 1 && r() > 0.6) {
                        const inset = 0.02;
                        drawUV([
                            [u0 + inset, v0 + inset], [u1 - inset, v0 + inset],
                            [u1 - inset, v1 - inset], [u0 + inset, v1 - inset]
                        ], 'filled');
                    }
                };

                const depth = 3 + Math.floor(r() * 2);
                drawDivision(0, 0, 1, 1, depth);
                drawUV([[0, 0], [1, 0], [1, 1], [0, 1]], filled ? baseStyle : 'outline');
                break;
            }
        }
    }
};

export default mazePatterns;
