import type { PatternSet, PatternContext } from './types';

/** Approximate a circle as an N-point polygon. */
function circlePoints(cx: number, cy: number, r: number, n: number): [number, number][] {
    const pts: [number, number][] = [];
    for (let i = 0; i < n; i++) {
        const angle = (2 * Math.PI * i) / n;
        pts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
    }
    return pts;
}

const chevronPatterns: PatternSet = {
    name: 'Chevron / Herringbone',
    count: 5,
    draw: (type: number, { drawUV, filled, baseStyle }: PatternContext) => {
        switch (type) {
            case 0: {
                // Thick nested chevrons — 3 nested V-bands with alternating fill
                // Outer V-band: full width, ~0.12 thick in v
                drawUV([
                    [0, 0.05], [0.5, 0.95], [1, 0.05],
                    [1, 0.17], [0.5, 0.83], [0, 0.17]
                ], 'filled');

                // Middle V-band: 70% width, offset inward
                drawUV([
                    [0.15, 0.15], [0.5, 0.80], [0.85, 0.15],
                    [0.85, 0.27], [0.5, 0.68], [0.15, 0.27]
                ], 'opaque-outline');

                // Inner V-band: 40% width, centered
                drawUV([
                    [0.30, 0.25], [0.5, 0.65], [0.70, 0.25],
                    [0.70, 0.37], [0.5, 0.53], [0.30, 0.37]
                ], 'filled');

                // Thin accent lines between the bands for separation
                drawUV([[0.08, 0.12], [0.5, 0.88], [0.92, 0.12]], 'line');
                drawUV([[0.22, 0.22], [0.5, 0.73], [0.78, 0.22]], 'line');

                // Small cap line at the very top of inner chevron
                drawUV([[0.38, 0.30], [0.5, 0.48], [0.62, 0.30]], 'line');
                break;
            }

            case 1: {
                // Herringbone weave — interlocking parallelograms with seam lines
                // Left parallelogram block
                drawUV([
                    [0, 0], [0.5, 0.5], [0.5, 1], [0, 0.5]
                ], filled ? 'filled' : 'outline');

                // Right parallelogram block (mirror)
                drawUV([
                    [0.5, 0.5], [1, 0], [1, 0.5], [0.5, 1]
                ], filled ? 'opaque-outline' : 'outline');

                // Seam lines — thin horizontal and vertical dividers
                drawUV([[0, 0.5], [0.5, 1]], 'line');
                drawUV([[0.5, 0], [0, 0.5]], 'line');
                drawUV([[0.5, 0.5], [1, 0]], 'line');
                drawUV([[1, 0.5], [0.5, 1]], 'line');

                // Vertical seam down the center
                drawUV([[0.5, 0], [0.5, 1]], 'line');

                // Horizontal seam across the middle
                drawUV([[0, 0.5], [1, 0.5]], 'line');

                // Interior diagonal texture lines within left block
                drawUV([[0.1, 0.15], [0.4, 0.65]], 'line');
                drawUV([[0.1, 0.35], [0.3, 0.75]], 'line');

                // Interior diagonal texture lines within right block
                drawUV([[0.6, 0.65], [0.9, 0.15]], 'line');
                drawUV([[0.7, 0.75], [0.9, 0.35]], 'line');
                break;
            }

            case 2: {
                // Arrow with fletching — large arrow filling most of tile vertically (v 0.1-0.9)

                // === Shaft — thick bold shaft across the tile ===
                const shaftTop = 0.40;
                const shaftBot = 0.60;
                drawUV([
                    [0.05, shaftTop], [0.60, shaftTop],
                    [0.60, shaftBot], [0.05, shaftBot]
                ], filled ? 'filled' : 'outline');
                // Center line along shaft
                drawUV([[0.05, 0.5], [0.60, 0.5]], 'line');
                // Shaft edge accent lines
                drawUV([[0.08, shaftTop - 0.02], [0.55, shaftTop - 0.02]], 'line');
                drawUV([[0.08, shaftBot + 0.02], [0.55, shaftBot + 0.02]], 'line');

                // === Arrowhead — large filled triangle spanning v 0.08 to 0.92 ===
                drawUV([
                    [0.58, 0.08], [0.96, 0.50], [0.58, 0.92]
                ], 'filled');
                drawUV([
                    [0.58, 0.08], [0.96, 0.50], [0.58, 0.92], [0.58, 0.08]
                ], 'line');
                // Inner detail lines on arrowhead
                drawUV([[0.62, 0.22], [0.88, 0.50]], 'line');
                drawUV([[0.62, 0.78], [0.88, 0.50]], 'line');
                drawUV([[0.62, 0.50], [0.85, 0.50]], 'line');
                // Extra arrowhead detail — inner chevron lines
                drawUV([[0.64, 0.35], [0.78, 0.50], [0.64, 0.65]], 'line');

                // === Fletching — 4 pairs spanning v 0.05 to 0.95 ===
                // First pair (rear) — largest vanes
                drawUV([
                    [0.02, shaftTop], [0.08, 0.08], [0.18, 0.14], [0.10, shaftTop]
                ], filled ? 'filled' : 'outline');
                drawUV([
                    [0.02, shaftBot], [0.08, 0.92], [0.18, 0.86], [0.10, shaftBot]
                ], filled ? 'filled' : 'outline');

                // Second pair — large vanes
                drawUV([
                    [0.10, shaftTop], [0.17, 0.12], [0.26, 0.18], [0.18, shaftTop]
                ], filled ? 'opaque-outline' : 'outline');
                drawUV([
                    [0.10, shaftBot], [0.17, 0.88], [0.26, 0.82], [0.18, shaftBot]
                ], filled ? 'opaque-outline' : 'outline');

                // Third pair — medium vanes
                drawUV([
                    [0.20, shaftTop], [0.26, 0.18], [0.34, 0.24], [0.27, shaftTop]
                ], filled ? 'filled' : 'outline');
                drawUV([
                    [0.20, shaftBot], [0.26, 0.82], [0.34, 0.76], [0.27, shaftBot]
                ], filled ? 'filled' : 'outline');

                // Fourth pair — small accent vanes
                drawUV([
                    [0.30, shaftTop], [0.34, 0.26], [0.40, 0.30], [0.35, shaftTop]
                ], filled ? 'opaque-outline' : 'outline');
                drawUV([
                    [0.30, shaftBot], [0.34, 0.74], [0.40, 0.70], [0.35, shaftBot]
                ], filled ? 'opaque-outline' : 'outline');

                // Fletching detail lines (barb texture) — more lines spanning further
                for (let i = 0; i < 5; i++) {
                    const u = 0.04 + i * 0.04;
                    drawUV([[u, shaftTop], [u + 0.04, 0.12 + i * 0.03]], 'line');
                    drawUV([[u, shaftBot], [u + 0.04, 0.88 - i * 0.03]], 'line');
                }

                // === Nock — notch at tail ===
                drawUV([[0.01, 0.32], [0.05, 0.50], [0.01, 0.68]], 'line');
                drawUV([[0.00, 0.35], [0.00, 0.65]], 'line');

                // === Decorative elements above arrow (v 0.02-0.35) ===
                // Horizontal lines
                drawUV([[0.30, 0.10], [0.58, 0.10]], 'line');
                drawUV([[0.35, 0.06], [0.53, 0.06]], 'line');
                drawUV([[0.25, 0.14], [0.55, 0.14]], 'line');
                // Row of dots near top
                for (let i = 0; i < 5; i++) {
                    const u = 0.30 + i * 0.06;
                    drawUV(circlePoints(u, 0.03, 0.015, 6), 'filled');
                }
                // Small triangles above shaft
                for (let i = 0; i < 3; i++) {
                    const cu = 0.35 + i * 0.08;
                    drawUV([
                        [cu, 0.18], [cu + 0.025, 0.24], [cu - 0.025, 0.24]
                    ], filled ? 'filled' : 'outline');
                }
                // Tick marks along upper region
                for (let i = 0; i < 6; i++) {
                    const u = 0.20 + i * 0.07;
                    drawUV([[u, 0.28], [u, 0.34]], 'line');
                }

                // === Decorative elements below arrow (v 0.65-0.98) ===
                // Horizontal lines
                drawUV([[0.30, 0.90], [0.58, 0.90]], 'line');
                drawUV([[0.35, 0.94], [0.53, 0.94]], 'line');
                drawUV([[0.25, 0.86], [0.55, 0.86]], 'line');
                // Row of dots near bottom
                for (let i = 0; i < 5; i++) {
                    const u = 0.30 + i * 0.06;
                    drawUV(circlePoints(u, 0.97, 0.015, 6), 'filled');
                }
                // Small triangles below shaft (inverted)
                for (let i = 0; i < 3; i++) {
                    const cu = 0.35 + i * 0.08;
                    drawUV([
                        [cu, 0.82], [cu + 0.025, 0.76], [cu - 0.025, 0.76]
                    ], filled ? 'filled' : 'outline');
                }
                // Tick marks along lower region
                for (let i = 0; i < 6; i++) {
                    const u = 0.20 + i * 0.07;
                    drawUV([[u, 0.66], [u, 0.72]], 'line');
                }

                // Small diamond accents along shaft
                for (let i = 0; i < 4; i++) {
                    const u = 0.30 + i * 0.08;
                    drawUV([
                        [u, 0.46], [u + 0.02, 0.50],
                        [u, 0.54], [u - 0.02, 0.50]
                    ], 'filled');
                }
                break;
            }

            case 3: {
                // Zigzag ribbon — wide zigzag filling the cell with center line and diamonds
                // 5 peaks across u: peaks at u = 0.1, 0.3, 0.5, 0.7, 0.9
                const ribbonHalf = 0.12; // half-thickness of ribbon in v

                // Outer zigzag edge (top edge of ribbon)
                const outerEdge: [number, number][] = [
                    [0, 0.5 + ribbonHalf],
                    [0.1, 0.85 + ribbonHalf],
                    [0.3, 0.15 + ribbonHalf],
                    [0.5, 0.85 + ribbonHalf],
                    [0.7, 0.15 + ribbonHalf],
                    [0.9, 0.85 + ribbonHalf],
                    [1, 0.5 + ribbonHalf]
                ];
                // Inner zigzag edge (bottom edge of ribbon)
                const innerEdge: [number, number][] = [
                    [1, 0.5 - ribbonHalf],
                    [0.9, 0.85 - ribbonHalf],
                    [0.7, 0.15 - ribbonHalf],
                    [0.5, 0.85 - ribbonHalf],
                    [0.3, 0.15 - ribbonHalf],
                    [0.1, 0.85 - ribbonHalf],
                    [0, 0.5 - ribbonHalf]
                ];

                // Filled ribbon polygon (outer edge forward, inner edge reversed)
                drawUV([...outerEdge, ...innerEdge], baseStyle);

                // Center line following the zigzag
                drawUV([
                    [0, 0.5],
                    [0.1, 0.85],
                    [0.3, 0.15],
                    [0.5, 0.85],
                    [0.7, 0.15],
                    [0.9, 0.85],
                    [1, 0.5]
                ], 'line');

                // Outer edge line for crispness
                drawUV(outerEdge, 'line');
                // Inner edge line for crispness
                drawUV([...innerEdge].reverse(), 'line');

                // Small filled diamonds at each peak and valley
                const diamondSize = 0.03;
                const peaksAndValleys: [number, number][] = [
                    [0.1, 0.85], [0.3, 0.15], [0.5, 0.85], [0.7, 0.15], [0.9, 0.85]
                ];
                for (const [pu, pv] of peaksAndValleys) {
                    drawUV([
                        [pu, pv - diamondSize],
                        [pu + diamondSize, pv],
                        [pu, pv + diamondSize],
                        [pu - diamondSize, pv]
                    ], 'filled');
                }
                break;
            }

            case 4: {
                // Art Deco fan chevron — sunburst radiating from bottom center
                const cx = 0.5;
                const cy = 0;
                const numRays = 7;
                const arcV = 0.9;
                const fanHalfAngle = Math.PI * 0.42; // spread angle

                // Draw radiating lines from [0.5, 0] to the top edge
                const rayTips: [number, number][] = [];
                for (let i = 0; i < numRays; i++) {
                    const t = i / (numRays - 1); // 0..1
                    const angle = -fanHalfAngle + t * 2 * fanHalfAngle;
                    const tipU = cx + Math.sin(angle) * arcV;
                    const tipV = cy + Math.cos(angle) * arcV;
                    rayTips.push([tipU, tipV]);
                    drawUV([[cx, cy], [tipU, tipV]], 'line');
                }

                // Alternating filled/empty wedge sectors between rays
                for (let i = 0; i < numRays - 1; i++) {
                    if (i % 2 === 0) {
                        // Filled wedge: triangle from center to two adjacent ray tips
                        drawUV([
                            [cx, cy],
                            rayTips[i],
                            rayTips[i + 1]
                        ], filled ? 'filled' : 'outline');
                    }
                }

                // Semicircular arc at v=0.9 connecting the tips
                // Approximate arc with segments between each ray tip
                const arcSegments = 24;
                const arcPoints: [number, number][] = [];
                for (let i = 0; i <= arcSegments; i++) {
                    const t = i / arcSegments;
                    const angle = -fanHalfAngle + t * 2 * fanHalfAngle;
                    arcPoints.push([
                        cx + Math.sin(angle) * arcV,
                        cy + Math.cos(angle) * arcV
                    ]);
                }
                drawUV(arcPoints, 'line');

                // Second inner arc at v=0.6 for Art Deco layering
                const innerArcV = 0.6;
                const innerArc: [number, number][] = [];
                for (let i = 0; i <= arcSegments; i++) {
                    const t = i / arcSegments;
                    const angle = -fanHalfAngle + t * 2 * fanHalfAngle;
                    innerArc.push([
                        cx + Math.sin(angle) * innerArcV,
                        cy + Math.cos(angle) * innerArcV
                    ]);
                }
                drawUV(innerArc, 'line');

                // Small decorative arc near base at v=0.3
                const baseArcV = 0.3;
                const baseArc: [number, number][] = [];
                for (let i = 0; i <= arcSegments; i++) {
                    const t = i / arcSegments;
                    const angle = -fanHalfAngle + t * 2 * fanHalfAngle;
                    baseArc.push([
                        cx + Math.sin(angle) * baseArcV,
                        cy + Math.cos(angle) * baseArcV
                    ]);
                }
                drawUV(baseArc, 'line');

                // Small filled semicircle at base
                drawUV([
                    [0.43, 0], [0.45, 0.08], [0.50, 0.11],
                    [0.55, 0.08], [0.57, 0]
                ], 'filled');
                break;
            }
        }
    }
};

export default chevronPatterns;
