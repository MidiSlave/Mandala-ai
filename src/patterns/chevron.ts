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
                // Arrow with fletching — detailed arrow pointing right

                // Shaft — long center line
                drawUV([[0.05, 0.5], [0.70, 0.5]], 'line');
                // Shaft thickness lines (parallel to shaft for bold look)
                drawUV([[0.05, 0.47], [0.68, 0.47]], 'line');
                drawUV([[0.05, 0.53], [0.68, 0.53]], 'line');

                // Arrowhead — filled triangle pointing right
                drawUV([
                    [0.70, 0.30], [0.95, 0.50], [0.70, 0.70]
                ], 'filled');
                // Arrowhead outline for crisp edge
                drawUV([
                    [0.70, 0.30], [0.95, 0.50], [0.70, 0.70], [0.70, 0.30]
                ], 'line');

                // Fletching — upper diagonal parallelogram
                drawUV([
                    [0.05, 0.47], [0.15, 0.25], [0.20, 0.30], [0.10, 0.50]
                ], filled ? 'filled' : 'outline');

                // Fletching — lower diagonal parallelogram
                drawUV([
                    [0.05, 0.53], [0.15, 0.75], [0.20, 0.70], [0.10, 0.50]
                ], filled ? 'filled' : 'outline');

                // Second layer of fletching (slightly forward)
                drawUV([
                    [0.12, 0.47], [0.20, 0.28], [0.25, 0.33], [0.17, 0.50]
                ], filled ? 'opaque-outline' : 'outline');
                drawUV([
                    [0.12, 0.53], [0.20, 0.72], [0.25, 0.67], [0.17, 0.50]
                ], filled ? 'opaque-outline' : 'outline');

                // Nock — small notch line at the very tail
                drawUV([[0.03, 0.42], [0.05, 0.50], [0.03, 0.58]], 'line');
                drawUV([[0.02, 0.45], [0.02, 0.55]], 'line');
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
