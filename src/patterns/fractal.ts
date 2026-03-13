import type { PatternSet, PatternContext } from './types';

// Fractal patterns — recursive geometric subdivisions
const fractalPatterns: PatternSet = {
    name: 'Fractal',
    count: 6,
    draw: (type: number, { drawUV, filled, baseStyle, rng }: PatternContext) => {
        const r = rng ?? (() => Math.random());

        switch (type) {
            case 0: { // Sierpinski triangle
                const drawTri = (
                    ax: number, ay: number, bx: number, by: number,
                    cx: number, cy: number, depth: number
                ) => {
                    if (depth <= 0) {
                        drawUV([[ax, ay], [bx, by], [cx, cy]], r() > 0.5 ? baseStyle : 'outline');
                        return;
                    }
                    const mx1 = (ax + bx) / 2, my1 = (ay + by) / 2;
                    const mx2 = (bx + cx) / 2, my2 = (by + cy) / 2;
                    const mx3 = (ax + cx) / 2, my3 = (ay + cy) / 2;
                    drawTri(ax, ay, mx1, my1, mx3, my3, depth - 1);
                    drawTri(mx1, my1, bx, by, mx2, my2, depth - 1);
                    drawTri(mx3, my3, mx2, my2, cx, cy, depth - 1);
                    // Central triangle is empty (the sierpinski hole)
                };
                const depth = 2 + Math.floor(r() * 2);
                drawTri(0.05, 0.95, 0.95, 0.95, 0.5, 0.05, depth);
                break;
            }

            case 1: { // Koch snowflake edge
                const kochEdge = (
                    x1: number, y1: number, x2: number, y2: number,
                    depth: number, pts: [number, number][]
                ) => {
                    if (depth <= 0) {
                        pts.push([x2, y2]);
                        return;
                    }
                    const dx = x2 - x1, dy = y2 - y1;
                    const ax = x1 + dx / 3, ay = y1 + dy / 3;
                    const bx = x1 + dx * 2 / 3, by = y1 + dy * 2 / 3;
                    // Peak point rotated 60 degrees
                    const px = (ax + bx) / 2 - (by - ay) * Math.sqrt(3) / 2;
                    const py = (ay + by) / 2 + (bx - ax) * Math.sqrt(3) / 2;
                    kochEdge(x1, y1, ax, ay, depth - 1, pts);
                    kochEdge(ax, ay, px, py, depth - 1, pts);
                    kochEdge(px, py, bx, by, depth - 1, pts);
                    kochEdge(bx, by, x2, y2, depth - 1, pts);
                };
                const depth = 2 + Math.floor(r());
                const pts: [number, number][] = [[0.05, 0.7]];
                kochEdge(0.05, 0.7, 0.95, 0.7, depth, pts);
                drawUV(pts, baseStyle);
                // Mirror below
                const pts2: [number, number][] = [[0.05, 0.3]];
                kochEdge(0.05, 0.3, 0.95, 0.3, depth, pts2);
                drawUV(pts2, filled ? 'outline' : baseStyle);
                break;
            }

            case 2: { // Recursive square subdivision (Mondrian-ish)
                const drawRect = (
                    x1: number, y1: number, x2: number, y2: number, depth: number
                ) => {
                    if (depth <= 0 || (x2 - x1) < 0.08 || (y2 - y1) < 0.08) {
                        drawUV([[x1, y1], [x2, y1], [x2, y2], [x1, y2]],
                            r() > 0.6 ? baseStyle : 'outline');
                        return;
                    }
                    const splitH = r() > 0.5;
                    if (splitH) {
                        const split = x1 + (x2 - x1) * (0.3 + r() * 0.4);
                        drawRect(x1, y1, split, y2, depth - 1);
                        drawRect(split, y1, x2, y2, depth - 1);
                    } else {
                        const split = y1 + (y2 - y1) * (0.3 + r() * 0.4);
                        drawRect(x1, y1, x2, split, depth - 1);
                        drawRect(x1, split, x2, y2, depth - 1);
                    }
                };
                drawRect(0.05, 0.05, 0.95, 0.95, 2 + Math.floor(r() * 2));
                break;
            }

            case 3: { // Cantor set / dust bands
                const drawCantor = (x1: number, x2: number, v: number, depth: number) => {
                    const h = 0.04;
                    drawUV([[x1, v - h], [x2, v - h], [x2, v + h], [x1, v + h]],
                        depth % 2 === 0 ? baseStyle : 'outline');
                    if (depth <= 0) return;
                    const third = (x2 - x1) / 3;
                    const gap = 0.06 + depth * 0.02;
                    drawCantor(x1, x1 + third, v + gap, depth - 1);
                    drawCantor(x2 - third, x2, v + gap, depth - 1);
                };
                drawCantor(0.05, 0.95, 0.15, 2 + Math.floor(r()));
                break;
            }

            case 4: { // Tree branching
                const drawBranch = (
                    x: number, y: number, angle: number,
                    length: number, depth: number
                ) => {
                    if (depth <= 0 || length < 0.02) return;
                    const ex = x + Math.cos(angle) * length;
                    const ey = y + Math.sin(angle) * length;
                    drawUV([[x, y], [ex, ey]], depth > 1 ? 'line' : baseStyle);
                    const spread = 0.4 + r() * 0.4;
                    const shrink = 0.6 + r() * 0.15;
                    drawBranch(ex, ey, angle - spread, length * shrink, depth - 1);
                    drawBranch(ex, ey, angle + spread, length * shrink, depth - 1);
                };
                const depth = 3 + Math.floor(r() * 2);
                drawBranch(0.5, 0.95, -Math.PI / 2, 0.3, depth);
                break;
            }

            case 5: { // Hexagonal subdivision
                const drawHex = (cx: number, cy: number, size: number, depth: number) => {
                    const pts: [number, number][] = [];
                    for (let i = 0; i <= 6; i++) {
                        const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
                        pts.push([cx + Math.cos(a) * size, cy + Math.sin(a) * size * 0.8]);
                    }
                    drawUV(pts, depth === 0 ? baseStyle : 'outline');
                    if (depth <= 0) return;
                    const childSize = size * 0.45;
                    // Center hex
                    drawHex(cx, cy, childSize, depth - 1);
                    // Surrounding hexes
                    for (let i = 0; i < 6; i++) {
                        const a = (i / 6) * Math.PI * 2;
                        const nx = cx + Math.cos(a) * size * 0.58;
                        const ny = cy + Math.sin(a) * size * 0.58 * 0.8;
                        if (nx > 0 && nx < 1 && ny > 0 && ny < 1) {
                            drawHex(nx, ny, childSize * 0.6, depth - 1);
                        }
                    }
                };
                drawHex(0.5, 0.5, 0.35, 1 + Math.floor(r() * 2));
                break;
            }
        }
    }
};

export default fractalPatterns;
