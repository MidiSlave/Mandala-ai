import type { PatternSet, PatternContext } from './types';

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
                // Arrow with fletching — large arrow filling most of tile vertically

                // === Shaft — thick bold shaft across the tile ===
                const shaftTop = 0.44;
                const shaftBot = 0.56;
                drawUV([
                    [0.05, shaftTop], [0.65, shaftTop],
                    [0.65, shaftBot], [0.05, shaftBot]
                ], filled ? 'filled' : 'outline');
                // Center line along shaft
                drawUV([[0.05, 0.5], [0.65, 0.5]], 'line');

                // === Arrowhead — large filled triangle ===
                drawUV([
                    [0.65, 0.15], [0.95, 0.50], [0.65, 0.85]
                ], 'filled');
                drawUV([
                    [0.65, 0.15], [0.95, 0.50], [0.65, 0.85], [0.65, 0.15]
                ], 'line');
                // Inner detail lines on arrowhead
                drawUV([[0.68, 0.30], [0.88, 0.50]], 'line');
                drawUV([[0.68, 0.70], [0.88, 0.50]], 'line');
                drawUV([[0.68, 0.50], [0.85, 0.50]], 'line');

                // === Fletching — large, 3 pairs spanning v 0.1 to 0.9 ===
                // First pair (rear) — large vanes
                drawUV([
                    [0.03, shaftTop], [0.10, 0.12], [0.18, 0.18], [0.10, shaftTop]
                ], filled ? 'filled' : 'outline');
                drawUV([
                    [0.03, shaftBot], [0.10, 0.88], [0.18, 0.82], [0.10, shaftBot]
                ], filled ? 'filled' : 'outline');

                // Second pair (mid) — medium vanes
                drawUV([
                    [0.12, shaftTop], [0.20, 0.18], [0.28, 0.24], [0.20, shaftTop]
                ], filled ? 'opaque-outline' : 'outline');
                drawUV([
                    [0.12, shaftBot], [0.20, 0.82], [0.28, 0.76], [0.20, shaftBot]
                ], filled ? 'opaque-outline' : 'outline');

                // Third pair (forward) — smaller accent vanes
                drawUV([
                    [0.22, shaftTop], [0.28, 0.25], [0.34, 0.30], [0.28, shaftTop]
                ], filled ? 'filled' : 'outline');
                drawUV([
                    [0.22, shaftBot], [0.28, 0.75], [0.34, 0.70], [0.28, shaftBot]
                ], filled ? 'filled' : 'outline');

                // Fletching detail lines (barb texture)
                for (let i = 0; i < 3; i++) {
                    const u = 0.06 + i * 0.04;
                    drawUV([[u, 0.42], [u + 0.03, 0.18 + i * 0.04]], 'line');
                    drawUV([[u, 0.58], [u + 0.03, 0.82 - i * 0.04]], 'line');
                }

                // === Nock — notch at tail ===
                drawUV([[0.02, 0.38], [0.05, 0.50], [0.02, 0.62]], 'line');
                drawUV([[0.01, 0.40], [0.01, 0.60]], 'line');

                // === Decorative elements above and below arrow ===
                // Top decoration: dots and small lines
                drawUV([[0.35, 0.12], [0.55, 0.12]], 'line');
                drawUV([[0.40, 0.08], [0.50, 0.08]], 'line');
                for (let i = 0; i < 4; i++) {
                    const u = 0.35 + i * 0.07;
                    drawUV(circlePoints(u, 0.05, 0.015, 6), 'filled');
                }

                // Bottom decoration: dots and small lines
                drawUV([[0.35, 0.88], [0.55, 0.88]], 'line');
                drawUV([[0.40, 0.92], [0.50, 0.92]], 'line');
                for (let i = 0; i < 4; i++) {
                    const u = 0.35 + i * 0.07;
                    drawUV(circlePoints(u, 0.95, 0.015, 6), 'filled');
                }

                // Small diamond accents along shaft
                for (let i = 0; i < 3; i++) {
                    const u = 0.35 + i * 0.10;
                    drawUV([
                        [u, 0.47], [u + 0.015, 0.50],
                        [u, 0.53], [u - 0.015, 0.50]
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
