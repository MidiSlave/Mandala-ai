import type { PatternSet, PatternContext } from './types';

/** Approximate a semicircular arc from (cx - r, cy) to (cx + r, cy), bulging upward in v. */
function arcPoints(cx: number, cy: number, r: number, segments: number, flip = false): [number, number][] {
    const pts: [number, number][] = [];
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const angle = Math.PI * t;
        const u = cx - r * Math.cos(angle);
        const v = flip ? cy - r * Math.sin(angle) : cy + r * Math.sin(angle);
        pts.push([u, v]);
    }
    return pts;
}

/** Approximate a circle as an N-point polygon. */
function circlePoints(cx: number, cy: number, r: number, n: number): [number, number][] {
    const pts: [number, number][] = [];
    for (let i = 0; i < n; i++) {
        const angle = (2 * Math.PI * i) / n;
        pts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
    }
    return pts;
}

/** Small diamond centered at (cx, cy). */
function diamond(cx: number, cy: number, s: number): [number, number][] {
    return [
        [cx, cy - s],
        [cx + s, cy],
        [cx, cy + s],
        [cx - s, cy],
    ];
}

const lacePatterns: PatternSet = {
    name: 'Lace / Wave',
    count: 5,
    draw: (type: number, { drawUV, filled, baseStyle }: PatternContext) => {
        switch (type) {
            case 0: {
                // Scallop arcs along the outer edge
                const scallops = 3;
                const w = 1 / scallops;
                for (let i = 0; i < scallops; i++) {
                    const cx = w * (i + 0.5);
                    const arc = arcPoints(cx, 1.0, w * 0.48, 8, true);
                    if (filled) {
                        // Close the scallop against the outer edge
                        const shape: [number, number][] = [[arc[0][0], 1.0], ...arc, [arc[arc.length - 1][0], 1.0]];
                        drawUV(shape, 'filled');
                    } else {
                        drawUV(arc, 'outline');
                        // Small circle inside each scallop
                        drawUV(circlePoints(cx, 0.88, 0.04, 8), 'outline');
                    }
                }
                break;
            }

            case 1: {
                // Concentric semicircles / rainbow arcs rising from inner edge
                const radii = [0.65, 0.45, 0.25];
                for (const r of radii) {
                    const arc = arcPoints(0.5, 0.0, r, 10);
                    drawUV(arc, 'line');
                }
                break;
            }

            case 2: {
                // Wave / sine border with parallel lines
                const samples = 12;
                const wave: [number, number][] = [];
                for (let i = 0; i <= samples; i++) {
                    const u = i / samples;
                    const v = 0.5 + 0.2 * Math.sin(u * 2 * Math.PI);
                    wave.push([u, v]);
                }
                drawUV(wave, 'line');
                // Parallel straight lines above and below
                drawUV([[0, 0.8], [1, 0.8]], 'line');
                drawUV([[0, 0.2], [1, 0.2]], 'line');
                break;
            }

            case 3: {
                // Circle medallion
                const outer = circlePoints(0.5, 0.5, 0.4, 16);
                const inner = circlePoints(0.5, 0.5, 0.2, 16);
                if (filled) {
                    drawUV(outer, 'filled');
                    drawUV(inner, 'opaque-outline');
                } else {
                    drawUV(outer, 'outline');
                    drawUV(inner, 'outline');
                    // Dot in center
                    drawUV(circlePoints(0.5, 0.5, 0.04, 8), 'filled');
                }
                break;
            }

            case 4: {
                // Scallop chain with dots along the bottom
                const count = 3;
                const w = 1 / count;
                for (let i = 0; i < count; i++) {
                    const cx = w * (i + 0.5);
                    const arc = arcPoints(cx, 0.0, w * 0.48, 8);
                    drawUV(arc, baseStyle);
                    // Diamond dot at the peak between scallops
                    if (i < count - 1) {
                        const peakU = w * (i + 1);
                        drawUV(diamond(peakU, 0.12, 0.04), 'filled');
                    }
                }
                // Dots at the left and right edges too
                drawUV(diamond(0, 0.12, 0.04), 'filled');
                drawUV(diamond(1, 0.12, 0.04), 'filled');
                break;
            }
        }
    },
};

export default lacePatterns;
