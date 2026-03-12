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

/**
 * Build a filled band (thin rectangle) from a multi-point polyline.
 * For each segment, we offset perpendicular to both sides by `half`.
 * Returns a closed polygon suitable for 'filled' drawUV.
 */
function bandFromPolyline(pts: [number, number][], half: number): [number, number][] {
    const left: [number, number][] = [];
    const right: [number, number][] = [];
    for (let i = 0; i < pts.length - 1; i++) {
        const [x1, y1] = pts[i];
        const [x2, y2] = pts[i + 1];
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy) || 1e-9;
        const nx = -dy / len * half;
        const ny = dx / len * half;
        if (i === 0) {
            left.push([x1 + nx, y1 + ny]);
            right.push([x1 - nx, y1 - ny]);
        }
        left.push([x2 + nx, y2 + ny]);
        right.push([x2 - nx, y2 - ny]);
    }
    return [...left, ...right.reverse()];
}

/** Build a filled arc band between two radii from the same center. */
function arcBand(
    cx: number, cy: number,
    rInner: number, rOuter: number,
    startAngle: number, endAngle: number,
    segments: number
): [number, number][] {
    const outer: [number, number][] = [];
    const inner: [number, number][] = [];
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const angle = startAngle + t * (endAngle - startAngle);
        const sinA = Math.sin(angle);
        const cosA = Math.cos(angle);
        outer.push([cx + sinA * rOuter, cy + cosA * rOuter]);
        inner.push([cx + sinA * rInner, cy + cosA * rInner]);
    }
    return [...outer, ...inner.reverse()];
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

                // Thin accent bands between the main bands for separation
                drawUV(bandFromPolyline([
                    [0.08, 0.12], [0.5, 0.88], [0.92, 0.12]
                ], 0.015), 'filled');
                drawUV(bandFromPolyline([
                    [0.22, 0.22], [0.5, 0.73], [0.78, 0.22]
                ], 0.015), 'filled');

                // Small cap band at the very top of inner chevron
                drawUV(bandFromPolyline([
                    [0.38, 0.30], [0.5, 0.48], [0.62, 0.30]
                ], 0.012), 'filled');
                break;
            }

            case 1: {
                // Herringbone weave — interlocking parallelograms with seam bands
                // Left parallelogram block
                drawUV([
                    [0, 0], [0.5, 0.5], [0.5, 1], [0, 0.5]
                ], filled ? 'filled' : 'outline');

                // Right parallelogram block (mirror)
                drawUV([
                    [0.5, 0.5], [1, 0], [1, 0.5], [0.5, 1]
                ], filled ? 'opaque-outline' : 'outline');

                // Seam bands — thin filled rectangles replacing lines
                const sw = 0.015; // seam half-width
                drawUV(bandFromPolyline([[0, 0.5], [0.5, 1]], sw), 'filled');
                drawUV(bandFromPolyline([[0.5, 0], [0, 0.5]], sw), 'filled');
                drawUV(bandFromPolyline([[0.5, 0.5], [1, 0]], sw), 'filled');
                drawUV(bandFromPolyline([[1, 0.5], [0.5, 1]], sw), 'filled');

                // Vertical seam down the center
                drawUV([
                    [0.5 - sw, 0], [0.5 + sw, 0],
                    [0.5 + sw, 1], [0.5 - sw, 1]
                ], 'filled');

                // Horizontal seam across the middle
                drawUV([
                    [0, 0.5 - sw], [1, 0.5 - sw],
                    [1, 0.5 + sw], [0, 0.5 + sw]
                ], 'filled');

                // Interior diagonal texture bands within left block
                drawUV(bandFromPolyline([[0.1, 0.15], [0.4, 0.65]], 0.02), 'filled');
                drawUV(bandFromPolyline([[0.1, 0.35], [0.3, 0.75]], 0.02), 'filled');

                // Interior diagonal texture bands within right block
                drawUV(bandFromPolyline([[0.6, 0.65], [0.9, 0.15]], 0.02), 'filled');
                drawUV(bandFromPolyline([[0.7, 0.75], [0.9, 0.35]], 0.02), 'filled');
                break;
            }

            case 2: {
                // Arrow with fletching — large arrow filling most of tile vertically (v 0.1-0.9)
                const bw = 0.015; // band half-width

                // === Shaft — thick bold shaft across the tile ===
                const shaftTop = 0.40;
                const shaftBot = 0.60;
                drawUV([
                    [0.05, shaftTop], [0.60, shaftTop],
                    [0.60, shaftBot], [0.05, shaftBot]
                ], filled ? 'filled' : 'outline');
                // Center band along shaft
                drawUV([
                    [0.05, 0.5 - bw], [0.60, 0.5 - bw],
                    [0.60, 0.5 + bw], [0.05, 0.5 + bw]
                ], 'filled');
                // Shaft edge accent bands
                drawUV([
                    [0.08, shaftTop - 0.02 - bw], [0.55, shaftTop - 0.02 - bw],
                    [0.55, shaftTop - 0.02 + bw], [0.08, shaftTop - 0.02 + bw]
                ], 'filled');
                drawUV([
                    [0.08, shaftBot + 0.02 - bw], [0.55, shaftBot + 0.02 - bw],
                    [0.55, shaftBot + 0.02 + bw], [0.08, shaftBot + 0.02 + bw]
                ], 'filled');

                // === Arrowhead — large filled triangle spanning v 0.08 to 0.92 ===
                drawUV([
                    [0.58, 0.08], [0.96, 0.50], [0.58, 0.92]
                ], 'filled');
                // Arrowhead outline as filled band
                drawUV(bandFromPolyline([
                    [0.58, 0.08], [0.96, 0.50], [0.58, 0.92], [0.58, 0.08]
                ], 0.012), 'filled');
                // Inner detail bands on arrowhead
                drawUV(bandFromPolyline([[0.62, 0.22], [0.88, 0.50]], 0.02), 'filled');
                drawUV(bandFromPolyline([[0.62, 0.78], [0.88, 0.50]], 0.02), 'filled');
                drawUV([
                    [0.62, 0.5 - 0.02], [0.85, 0.5 - 0.02],
                    [0.85, 0.5 + 0.02], [0.62, 0.5 + 0.02]
                ], 'filled');
                // Extra arrowhead detail — inner chevron band
                drawUV(bandFromPolyline([
                    [0.64, 0.35], [0.78, 0.50], [0.64, 0.65]
                ], 0.018), 'filled');

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

                // Fletching detail bands (barb texture) — filled bands instead of lines
                for (let i = 0; i < 5; i++) {
                    const u = 0.04 + i * 0.04;
                    drawUV(bandFromPolyline([
                        [u, shaftTop], [u + 0.04, 0.12 + i * 0.03]
                    ], 0.012), 'filled');
                    drawUV(bandFromPolyline([
                        [u, shaftBot], [u + 0.04, 0.88 - i * 0.03]
                    ], 0.012), 'filled');
                }

                // === Nock — notch at tail ===
                drawUV(bandFromPolyline([
                    [0.01, 0.32], [0.05, 0.50], [0.01, 0.68]
                ], 0.015), 'filled');
                drawUV([
                    [0.00, 0.35], [0.025, 0.35],
                    [0.025, 0.65], [0.00, 0.65]
                ], 'filled');

                // === Decorative elements above arrow (v 0.02-0.35) ===
                // Horizontal filled rectangles
                drawUV([
                    [0.30, 0.10 - bw], [0.58, 0.10 - bw],
                    [0.58, 0.10 + bw], [0.30, 0.10 + bw]
                ], 'filled');
                drawUV([
                    [0.35, 0.06 - bw], [0.53, 0.06 - bw],
                    [0.53, 0.06 + bw], [0.35, 0.06 + bw]
                ], 'filled');
                drawUV([
                    [0.25, 0.14 - bw], [0.55, 0.14 - bw],
                    [0.55, 0.14 + bw], [0.25, 0.14 + bw]
                ], 'filled');
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
                // Tick marks along upper region — filled rectangles instead of lines
                for (let i = 0; i < 6; i++) {
                    const u = 0.20 + i * 0.07;
                    drawUV([
                        [u - bw, 0.28], [u + bw, 0.28],
                        [u + bw, 0.34], [u - bw, 0.34]
                    ], 'filled');
                }

                // === Decorative elements below arrow (v 0.65-0.98) ===
                // Horizontal filled rectangles
                drawUV([
                    [0.30, 0.90 - bw], [0.58, 0.90 - bw],
                    [0.58, 0.90 + bw], [0.30, 0.90 + bw]
                ], 'filled');
                drawUV([
                    [0.35, 0.94 - bw], [0.53, 0.94 - bw],
                    [0.53, 0.94 + bw], [0.35, 0.94 + bw]
                ], 'filled');
                drawUV([
                    [0.25, 0.86 - bw], [0.55, 0.86 - bw],
                    [0.55, 0.86 + bw], [0.25, 0.86 + bw]
                ], 'filled');
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
                // Tick marks along lower region — filled rectangles instead of lines
                for (let i = 0; i < 6; i++) {
                    const u = 0.20 + i * 0.07;
                    drawUV([
                        [u - bw, 0.66], [u + bw, 0.66],
                        [u + bw, 0.72], [u - bw, 0.72]
                    ], 'filled');
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
                // Zigzag ribbon — wide zigzag filling the cell with center band and diamonds
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

                // Center band following the zigzag (filled band instead of line)
                drawUV(bandFromPolyline([
                    [0, 0.5],
                    [0.1, 0.85],
                    [0.3, 0.15],
                    [0.5, 0.85],
                    [0.7, 0.15],
                    [0.9, 0.85],
                    [1, 0.5]
                ], 0.02), 'filled');

                // Outer edge band for crispness
                drawUV(bandFromPolyline(outerEdge, 0.015), 'filled');
                // Inner edge band for crispness
                drawUV(bandFromPolyline([...innerEdge].reverse(), 0.015), 'filled');

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
                const arcSegments = 24;
                const bandHalf = 0.025; // half-width for ray wedges

                // Draw radiating filled wedges from [0.5, 0] to the top edge
                const rayTips: [number, number][] = [];
                for (let i = 0; i < numRays; i++) {
                    const t = i / (numRays - 1); // 0..1
                    const angle = -fanHalfAngle + t * 2 * fanHalfAngle;
                    const tipU = cx + Math.sin(angle) * arcV;
                    const tipV = cy + Math.cos(angle) * arcV;
                    rayTips.push([tipU, tipV]);

                    // Filled wedge shape instead of line
                    const perpU = Math.cos(angle) * bandHalf;
                    const perpV = -Math.sin(angle) * bandHalf;
                    drawUV([
                        [cx - perpU, cy - perpV],
                        [tipU - perpU, tipV - perpV],
                        [tipU + perpU, tipV + perpV],
                        [cx + perpU, cy + perpV]
                    ], 'filled');
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

                // Filled arc band at v=0.9 connecting the tips
                drawUV(arcBand(
                    cx, cy,
                    arcV - 0.025, arcV + 0.025,
                    -fanHalfAngle, fanHalfAngle,
                    arcSegments
                ), 'filled');

                // Second filled arc band at v=0.6 for Art Deco layering
                const innerArcV = 0.6;
                drawUV(arcBand(
                    cx, cy,
                    innerArcV - 0.02, innerArcV + 0.02,
                    -fanHalfAngle, fanHalfAngle,
                    arcSegments
                ), 'filled');

                // Small decorative arc band near base at v=0.3
                const baseArcV = 0.3;
                drawUV(arcBand(
                    cx, cy,
                    baseArcV - 0.018, baseArcV + 0.018,
                    -fanHalfAngle, fanHalfAngle,
                    arcSegments
                ), 'filled');

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
