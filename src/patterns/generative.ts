import type { PatternSet, PatternContext } from './types';

function circleUV(cx: number, cy: number, r: number, n: number = 12): [number, number][] {
    const pts: [number, number][] = [];
    for (let i = 0; i <= n; i++) {
        const a = (i / n) * Math.PI * 2;
        pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    return pts;
}

const generativePatterns: PatternSet = {
    name: 'Generative',
    count: 8,
    draw: (type: number, { drawUV, filled, baseStyle, rng }: PatternContext) => {
        // Generative patterns require rng
        const r = rng ?? (() => Math.random());

        switch (type) {
            case 0: { // Rose curve / rhodonea
                const k = Math.floor(r() * 4) + 2;
                const n = 24 + Math.floor(r() * 16);
                const pts: [number, number][] = [];
                for (let j = 0; j <= n; j++) {
                    const t = (j / n) * Math.PI * 2;
                    const rho = Math.cos(k * t) * 0.45;
                    const u = Math.min(1, Math.max(0, (t / (Math.PI * 2)) * 0.8 + 0.1));
                    const v = Math.min(1, Math.max(0, 0.5 + rho));
                    pts.push([u, v]);
                }
                drawUV(pts, baseStyle);
                break;
            }

            case 1: { // Phyllotaxis / sunflower spiral dots
                const numDots = 12 + Math.floor(r() * 20);
                const goldenAngle = Math.PI * (3 - Math.sqrt(5));
                for (let j = 0; j < numDots; j++) {
                    const frac = j / numDots;
                    const theta = j * goldenAngle;
                    const u = ((theta % (Math.PI * 2)) / (Math.PI * 2));
                    const v = 0.1 + frac * 0.8;
                    const dotR = 0.01 + frac * 0.015;
                    drawUV(circleUV(u, v, dotR, 8), j % 3 === 0 ? 'filled' : 'outline');
                }
                break;
            }

            case 2: { // Lissajous figure
                const a = Math.floor(r() * 3) + 1;
                const b = Math.floor(r() * 3) + 2;
                const delta = r() * Math.PI;
                const n = 40;
                const pts: [number, number][] = [];
                for (let j = 0; j <= n; j++) {
                    const t = (j / n) * Math.PI * 2;
                    const u = 0.1 + 0.8 * (0.5 + 0.5 * Math.sin(a * t + delta));
                    const v = 0.1 + 0.8 * (0.5 + 0.5 * Math.sin(b * t));
                    pts.push([u, v]);
                }
                drawUV(pts, baseStyle);
                break;
            }

            case 3: { // Concentric arcs with varying widths
                const nArcs = 3 + Math.floor(r() * 4);
                for (let j = 0; j < nArcs; j++) {
                    const frac = (j + 0.5) / nArcs;
                    const arcSpan = 0.3 + r() * 0.6;
                    const arcStart = (1 - arcSpan) * 0.5;
                    const pts: [number, number][] = [];
                    const steps = 16;
                    for (let s = 0; s <= steps; s++) {
                        const u = arcStart + (s / steps) * arcSpan;
                        pts.push([u, frac]);
                    }
                    drawUV(pts, j % 2 === 0 ? baseStyle : 'line');
                }
                break;
            }

            case 4: { // Wave interference / moire pattern
                const freq1 = 2 + Math.floor(r() * 4);
                const freq2 = 3 + Math.floor(r() * 5);
                const nLines = 5 + Math.floor(r() * 4);
                for (let j = 0; j < nLines; j++) {
                    const baseV = (j + 1) / (nLines + 1);
                    const pts: [number, number][] = [];
                    const steps = 20;
                    for (let s = 0; s <= steps; s++) {
                        const u = s / steps;
                        const wave = Math.sin(u * Math.PI * freq1) * 0.06 +
                                     Math.sin(u * Math.PI * freq2 + baseV * Math.PI) * 0.04;
                        pts.push([u, baseV + wave]);
                    }
                    drawUV(pts, 'line');
                }
                break;
            }

            case 5: { // Spirograph / epitrochoid
                const R = 0.4;
                const rr = 0.1 + r() * 0.15;
                const d = 0.05 + r() * 0.2;
                const n = 60;
                const pts: [number, number][] = [];
                for (let j = 0; j <= n; j++) {
                    const t = (j / n) * Math.PI * 6;
                    const x = (R - rr) * Math.cos(t) + d * Math.cos(((R - rr) / rr) * t);
                    const y = (R - rr) * Math.sin(t) + d * Math.sin(((R - rr) / rr) * t);
                    const u = Math.min(1, Math.max(0, 0.5 + x));
                    const v = Math.min(1, Math.max(0, 0.5 + y));
                    pts.push([u, v]);
                }
                drawUV(pts, baseStyle);
                break;
            }

            case 6: { // Recursive triangular subdivision
                const subdivide = (
                    ax: number, ay: number, bx: number, by: number,
                    cx: number, cy: number, depth: number
                ) => {
                    if (depth <= 0) {
                        drawUV([[ax, ay], [bx, by], [cx, cy]], r() > 0.6 ? 'filled' : 'outline');
                        return;
                    }
                    const mx1 = (ax + bx) / 2, my1 = (ay + by) / 2;
                    const mx2 = (bx + cx) / 2, my2 = (by + cy) / 2;
                    const mx3 = (ax + cx) / 2, my3 = (ay + cy) / 2;
                    subdivide(ax, ay, mx1, my1, mx3, my3, depth - 1);
                    subdivide(mx1, my1, bx, by, mx2, my2, depth - 1);
                    subdivide(mx3, my3, mx2, my2, cx, cy, depth - 1);
                };
                const depth = 2 + Math.floor(r() * 2);
                subdivide(0.05, 0.05, 0.95, 0.05, 0.5, 0.95, depth);
                break;
            }

            case 7: { // Radial spokes with terminal ornaments
                const nSpokes = 3 + Math.floor(r() * 5);
                const hasOrnament = r() > 0.4;
                for (let j = 0; j < nSpokes; j++) {
                    const u = (j + 0.5) / nSpokes;
                    // Spoke line
                    drawUV([[u, 0.05], [u, 0.95]], 'line');
                    // Terminal ornament
                    if (hasOrnament) {
                        const ornSize = 0.03;
                        if (j % 2 === 0) {
                            drawUV(circleUV(u, 0.95, ornSize, 8), 'filled');
                        } else {
                            // Diamond
                            drawUV([
                                [u, 0.95 - ornSize],
                                [u + ornSize, 0.95],
                                [u, 0.95 + ornSize],
                                [u - ornSize, 0.95]
                            ], 'filled');
                        }
                    }
                }
                // Midline arc
                const midPts: [number, number][] = [];
                for (let s = 0; s <= 12; s++) {
                    midPts.push([s / 12, 0.5]);
                }
                drawUV(midPts, filled ? 'filled' : 'outline');
                break;
            }
        }
    }
};

export default generativePatterns;
