import type { PatternSet, PatternContext } from './types';

// Helper: generate points along a circular arc as [u, v] pairs
function arcPoints(
    cx: number, cy: number, r: number,
    startAngle: number, endAngle: number, n: number
): [number, number][] {
    const pts: [number, number][] = [];
    for (let i = 0; i <= n; i++) {
        const t = i / n;
        const a = startAngle + t * (endAngle - startAngle);
        pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    return pts;
}

// Helper: create a thick band (filled polygon) along a path by offsetting both sides
function thickBand(
    centerPoints: [number, number][],
    width: number
): [number, number][] {
    const half = width / 2;
    const left: [number, number][] = [];
    const right: [number, number][] = [];

    for (let i = 0; i < centerPoints.length; i++) {
        const [cu, cv] = centerPoints[i];
        // Compute normal direction from neighboring points
        let dx: number, dy: number;
        if (i === 0) {
            dx = centerPoints[1][0] - cu;
            dy = centerPoints[1][1] - cv;
        } else if (i === centerPoints.length - 1) {
            dx = cu - centerPoints[i - 1][0];
            dy = cv - centerPoints[i - 1][1];
        } else {
            dx = centerPoints[i + 1][0] - centerPoints[i - 1][0];
            dy = centerPoints[i + 1][1] - centerPoints[i - 1][1];
        }
        const len = Math.sqrt(dx * dx + dy * dy) || 1e-6;
        const nx = -dy / len;
        const ny = dx / len;

        left.push([cu + nx * half, cv + ny * half]);
        right.push([cu - nx * half, cv - ny * half]);
    }

    // Combine into a closed polygon: left forward, right reversed
    return [...left, ...right.reverse()];
}

// Helper: generate arc center points
function arcCenterPoints(
    cx: number, cy: number, r: number,
    startAngle: number, endAngle: number, n: number
): [number, number][] {
    const pts: [number, number][] = [];
    for (let i = 0; i <= n; i++) {
        const t = i / n;
        const a = startAngle + t * (endAngle - startAngle);
        pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    return pts;
}

const celticPatterns: PatternSet = {
    name: 'Celtic Knotwork',
    count: 5,
    draw: (type: number, { drawUV, filled, baseStyle }: PatternContext) => {
        const mainStyle = filled ? 'filled' : 'outline';
        const detailStyle = filled ? 'opaque-outline' : 'filled';

        switch (type) {
            case 0: { // Triquetra (Trinity Knot)
                const cx = 0.50, cy = 0.50;
                const lobeR = 0.22;
                const bandW = 0.05;
                const n = 24;

                // Three lobe centers arranged in a triangle
                const lobeCenters: [number, number][] = [
                    [cx, cy - 0.18],                                    // top
                    [cx - 0.16, cy + 0.10],                             // bottom-left
                    [cx + 0.16, cy + 0.10],                             // bottom-right
                ];

                // Draw each lobe as a thick circular band
                const lobeAngles: [number, number][] = [
                    [-Math.PI * 0.15, Math.PI * 1.15],   // top lobe
                    [Math.PI * 0.52, Math.PI * 1.82],     // bottom-left
                    [-Math.PI * 0.82, Math.PI * 0.48],    // bottom-right
                ];

                // Layer 1: Draw all three lobes as filled bands (the "under" parts)
                for (let i = 0; i < 3; i++) {
                    const [lx, ly] = lobeCenters[i];
                    const [sa, ea] = lobeAngles[i];
                    const center = arcCenterPoints(lx, ly, lobeR, sa, ea, n);
                    const band = thickBand(center, bandW);
                    drawUV(band, baseStyle);
                }

                // Layer 2: Create crossing illusions with opaque-outline masks then filled overlays
                // Crossing 1: top lobe passes OVER bottom-right lobe at top-right
                {
                    const maskPts: [number, number][] = [
                        [cx + 0.06, cy - 0.10],
                        [cx + 0.16, cy - 0.10],
                        [cx + 0.16, cy + 0.00],
                        [cx + 0.06, cy + 0.00],
                    ];
                    drawUV(maskPts, 'opaque-outline');
                    // Redraw top lobe segment over the mask
                    const topSeg = arcCenterPoints(lobeCenters[0][0], lobeCenters[0][1], lobeR,
                        Math.PI * 0.15, Math.PI * 0.55, 10);
                    drawUV(thickBand(topSeg, bandW), baseStyle);
                }

                // Crossing 2: bottom-right lobe passes OVER bottom-left lobe at bottom
                {
                    const maskPts: [number, number][] = [
                        [cx - 0.05, cy + 0.14],
                        [cx + 0.05, cy + 0.14],
                        [cx + 0.05, cy + 0.26],
                        [cx - 0.05, cy + 0.26],
                    ];
                    drawUV(maskPts, 'opaque-outline');
                    const brSeg = arcCenterPoints(lobeCenters[2][0], lobeCenters[2][1], lobeR,
                        Math.PI * 0.48, Math.PI * 0.95, 10);
                    drawUV(thickBand(brSeg, bandW), baseStyle);
                }

                // Crossing 3: bottom-left lobe passes OVER top lobe at top-left
                {
                    const maskPts: [number, number][] = [
                        [cx - 0.16, cy - 0.10],
                        [cx - 0.06, cy - 0.10],
                        [cx - 0.06, cy + 0.00],
                        [cx - 0.16, cy + 0.00],
                    ];
                    drawUV(maskPts, 'opaque-outline');
                    const blSeg = arcCenterPoints(lobeCenters[1][0], lobeCenters[1][1], lobeR,
                        Math.PI * 1.45, Math.PI * 1.82, 10);
                    drawUV(thickBand(blSeg, bandW), baseStyle);
                }

                // Central triangle detail
                drawUV([
                    [cx, cy - 0.06],
                    [cx + 0.05, cy + 0.04],
                    [cx - 0.05, cy + 0.04],
                ], detailStyle);

                // Outer circle border
                const outerCircle = arcCenterPoints(cx, cy, 0.44, 0, Math.PI * 2, 30);
                drawUV(thickBand(outerCircle, 0.03), baseStyle);

                // Corner accent dots
                const dotS = 0.03;
                const corners: [number, number][] = [[0.06, 0.06], [0.94, 0.06], [0.06, 0.94], [0.94, 0.94]];
                for (const [du, dv] of corners) {
                    drawUV([
                        [du - dotS, dv - dotS], [du + dotS, dv - dotS],
                        [du + dotS, dv + dotS], [du - dotS, dv + dotS],
                    ], mainStyle);
                }

                break;
            }

            case 1: { // Spiral Triskelion
                const cx = 0.50, cy = 0.50;
                const bandW = 0.05;
                const n = 30;

                // Three spiral arms, each rotated 120 degrees apart
                for (let arm = 0; arm < 3; arm++) {
                    const baseAngle = (arm / 3) * Math.PI * 2 - Math.PI / 2;
                    const pts: [number, number][] = [];

                    // Spiral from center outward: r increases, angle sweeps ~270 degrees
                    for (let i = 0; i <= n; i++) {
                        const t = i / n;
                        const r = 0.04 + t * 0.36;
                        const a = baseAngle + t * Math.PI * 1.5;
                        pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
                    }

                    const band = thickBand(pts, bandW);
                    drawUV(band, baseStyle);

                    // Spiral end cap (small filled circle)
                    const endPt = pts[pts.length - 1];
                    const capR = 0.035;
                    const cap = arcCenterPoints(endPt[0], endPt[1], capR, 0, Math.PI * 2, 12);
                    drawUV(cap, mainStyle);
                }

                // Central hub circle
                const hubOuter = arcCenterPoints(cx, cy, 0.08, 0, Math.PI * 2, 16);
                drawUV(hubOuter, detailStyle);

                const hubInner = arcCenterPoints(cx, cy, 0.04, 0, Math.PI * 2, 12);
                drawUV(hubInner, mainStyle);

                // Three crossing masks at the center where spirals overlap
                for (let arm = 0; arm < 3; arm++) {
                    const baseAngle = (arm / 3) * Math.PI * 2 - Math.PI / 2;
                    const maskAngle = baseAngle + Math.PI * 0.6;
                    const mr = 0.16;
                    const mx = cx + mr * Math.cos(maskAngle);
                    const my = cy + mr * Math.sin(maskAngle);
                    const ms = 0.05;
                    drawUV([
                        [mx - ms, my - ms], [mx + ms, my - ms],
                        [mx + ms, my + ms], [mx - ms, my + ms],
                    ], 'opaque-outline');

                    // Redraw the arm segment over the mask
                    const pts: [number, number][] = [];
                    const nextArm = (arm + 1) % 3;
                    const nextBase = (nextArm / 3) * Math.PI * 2 - Math.PI / 2;
                    for (let i = 0; i <= 10; i++) {
                        const t = 0.25 + (i / 10) * 0.25;
                        const r = 0.04 + t * 0.36;
                        const a = nextBase + t * Math.PI * 1.5;
                        pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
                    }
                    drawUV(thickBand(pts, bandW), baseStyle);
                }

                // Outer border ring
                const outerRing = arcCenterPoints(cx, cy, 0.46, 0, Math.PI * 2, 30);
                drawUV(thickBand(outerRing, 0.025), baseStyle);

                break;
            }

            case 2: { // Plaitwork / Braid
                const bandW = 0.055;
                const n = 20;

                // Two diagonal ribbon paths weaving across the tile
                // Ribbon A: goes from bottom-left to top-right in a sinusoidal path
                const ribbonA: [number, number][] = [];
                for (let i = 0; i <= n; i++) {
                    const t = i / n;
                    const u = 0.05 + t * 0.90;
                    const v = 0.25 + 0.50 * t + 0.12 * Math.sin(t * Math.PI * 3);
                    ribbonA.push([u, Math.min(0.95, Math.max(0.05, v))]);
                }

                // Ribbon B: goes from top-left to bottom-right in opposite sinusoidal
                const ribbonB: [number, number][] = [];
                for (let i = 0; i <= n; i++) {
                    const t = i / n;
                    const u = 0.05 + t * 0.90;
                    const v = 0.75 - 0.50 * t + 0.12 * Math.sin(t * Math.PI * 3 + Math.PI);
                    ribbonB.push([u, Math.min(0.95, Math.max(0.05, v))]);
                }

                // Draw ribbon A (under layer)
                drawUV(thickBand(ribbonA, bandW), baseStyle);
                // Draw ribbon B (under layer)
                drawUV(thickBand(ribbonB, bandW), baseStyle);

                // Create crossings: ribbons cross ~3 times
                // At each crossing, mask and redraw the "over" ribbon
                for (let cross = 0; cross < 3; cross++) {
                    const t = (cross + 0.5) / 3;
                    const idx = Math.round(t * n);
                    const crossU = ribbonA[idx][0];
                    const crossV = (ribbonA[idx][1] + ribbonB[idx][1]) / 2;
                    const ms = 0.06;

                    // Mask the crossing area
                    drawUV([
                        [crossU - ms, crossV - ms], [crossU + ms, crossV - ms],
                        [crossU + ms, crossV + ms], [crossU - ms, crossV + ms],
                    ], 'opaque-outline');

                    // Alternating: ribbon A over at even crossings, ribbon B over at odd
                    const overRibbon = cross % 2 === 0 ? ribbonA : ribbonB;
                    const startI = Math.max(0, idx - 3);
                    const endI = Math.min(n, idx + 3);
                    const seg = overRibbon.slice(startI, endI + 1);
                    drawUV(thickBand(seg, bandW), baseStyle);
                }

                // Border frame (thick rectangular border)
                // Top edge
                drawUV([
                    [0.0, 0.0], [1.0, 0.0],
                    [1.0, 0.04], [0.0, 0.04],
                ], baseStyle);
                // Bottom edge
                drawUV([
                    [0.0, 0.96], [1.0, 0.96],
                    [1.0, 1.0], [0.0, 1.0],
                ], baseStyle);
                // Left edge
                drawUV([
                    [0.0, 0.0], [0.04, 0.0],
                    [0.04, 1.0], [0.0, 1.0],
                ], baseStyle);
                // Right edge
                drawUV([
                    [0.96, 0.0], [1.0, 0.0],
                    [1.0, 1.0], [0.96, 1.0],
                ], baseStyle);

                // Diamond accents at crossing points
                for (let cross = 0; cross < 3; cross++) {
                    const t = (cross + 0.5) / 3;
                    const idx = Math.round(t * n);
                    const cu = ribbonA[idx][0];
                    const cv = (ribbonA[idx][1] + ribbonB[idx][1]) / 2;
                    const ds = 0.025;
                    drawUV([
                        [cu, cv - ds], [cu + ds, cv],
                        [cu, cv + ds], [cu - ds, cv],
                    ], detailStyle);
                }

                break;
            }

            case 3: { // Ring Knot
                const cx = 0.50, cy = 0.50;
                const bandW = 0.05;
                const n = 28;

                // Main circular band
                const mainCircle = arcCenterPoints(cx, cy, 0.30, 0, Math.PI * 2, n);
                drawUV(thickBand(mainCircle, bandW), baseStyle);

                // Inner circular band (smaller, offset slightly)
                const innerCircle = arcCenterPoints(cx, cy, 0.16, 0, Math.PI * 2, n);
                drawUV(thickBand(innerCircle, bandW), baseStyle);

                // Four connecting bridges between inner and outer rings (creating the knot)
                const bridgeAngles = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];
                for (let i = 0; i < 4; i++) {
                    const a = bridgeAngles[i];

                    // Bridge: straight band from inner ring to outer ring
                    const innerU = cx + 0.16 * Math.cos(a);
                    const innerV = cy + 0.16 * Math.sin(a);
                    const outerU = cx + 0.30 * Math.cos(a);
                    const outerV = cy + 0.30 * Math.sin(a);

                    const bridgePts: [number, number][] = [];
                    for (let j = 0; j <= 8; j++) {
                        const t = j / 8;
                        bridgePts.push([
                            innerU + t * (outerU - innerU),
                            innerV + t * (outerV - innerV),
                        ]);
                    }
                    drawUV(thickBand(bridgePts, bandW * 0.9), baseStyle);
                }

                // Create over-under crossings at the 4 points where bridges meet the rings
                // Mask and redraw alternating ring segments over bridges
                for (let i = 0; i < 4; i++) {
                    const a = bridgeAngles[i];
                    const crossR = i % 2 === 0 ? 0.30 : 0.16; // alternate inner/outer
                    const mx = cx + crossR * Math.cos(a);
                    const my = cy + crossR * Math.sin(a);
                    const ms = 0.055;

                    drawUV([
                        [mx - ms, my - ms], [mx + ms, my - ms],
                        [mx + ms, my + ms], [mx - ms, my + ms],
                    ], 'opaque-outline');

                    // Redraw ring segment over the bridge
                    const spanAngle = 0.4;
                    const segPts = arcCenterPoints(cx, cy, crossR, a - spanAngle, a + spanAngle, 10);
                    drawUV(thickBand(segPts, bandW), baseStyle);
                }

                // For the other 4 crossings (where the ring passes under)
                for (let i = 0; i < 4; i++) {
                    const a = bridgeAngles[i];
                    const crossR = i % 2 === 0 ? 0.16 : 0.30;
                    const mx = cx + crossR * Math.cos(a);
                    const my = cy + crossR * Math.sin(a);
                    const ms = 0.055;

                    drawUV([
                        [mx - ms, my - ms], [mx + ms, my - ms],
                        [mx + ms, my + ms], [mx - ms, my + ms],
                    ], 'opaque-outline');

                    // Redraw bridge segment over the ring
                    const innerU = cx + 0.16 * Math.cos(a);
                    const innerV = cy + 0.16 * Math.sin(a);
                    const outerU = cx + 0.30 * Math.cos(a);
                    const outerV = cy + 0.30 * Math.sin(a);

                    const tStart = crossR === 0.16 ? 0.0 : 0.5;
                    const tEnd = crossR === 0.16 ? 0.5 : 1.0;
                    const segPts: [number, number][] = [];
                    for (let j = 0; j <= 6; j++) {
                        const t = tStart + (j / 6) * (tEnd - tStart);
                        segPts.push([
                            innerU + t * (outerU - innerU),
                            innerV + t * (outerV - innerV),
                        ]);
                    }
                    drawUV(thickBand(segPts, bandW * 0.9), baseStyle);
                }

                // Central detail: small filled circle
                const centerDot = arcCenterPoints(cx, cy, 0.05, 0, Math.PI * 2, 12);
                drawUV(centerDot, detailStyle);

                // Outer decorative ring
                const outerDeco = arcCenterPoints(cx, cy, 0.42, 0, Math.PI * 2, 30);
                drawUV(thickBand(outerDeco, 0.025), baseStyle);

                // Small diamond accents between bridges on outer ring
                for (let i = 0; i < 4; i++) {
                    const a = bridgeAngles[i] + Math.PI / 4;
                    const dx = cx + 0.37 * Math.cos(a);
                    const dy = cy + 0.37 * Math.sin(a);
                    const ds = 0.03;
                    drawUV([
                        [dx, dy - ds], [dx + ds, dy],
                        [dx, dy + ds], [dx - ds, dy],
                    ], mainStyle);
                }

                break;
            }

            case 4: { // Quaternary Knot (four interlaced loops)
                const cx = 0.50, cy = 0.50;
                const lobeR = 0.17;
                const bandW = 0.045;
                const n = 24;

                // Four lobe centers arranged in a diamond
                const lobeCenters: [number, number][] = [
                    [cx, cy - 0.20],     // top
                    [cx + 0.20, cy],     // right
                    [cx, cy + 0.20],     // bottom
                    [cx - 0.20, cy],     // left
                ];

                // Draw each lobe as a full circle band
                for (let i = 0; i < 4; i++) {
                    const [lx, ly] = lobeCenters[i];
                    const lobeCircle = arcCenterPoints(lx, ly, lobeR, 0, Math.PI * 2, n);
                    drawUV(thickBand(lobeCircle, bandW), baseStyle);
                }

                // Create crossings between adjacent lobes (8 crossing points)
                // Each pair of adjacent lobes has 2 crossing points
                const pairs: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 0]];
                for (let p = 0; p < pairs.length; p++) {
                    const [a, b] = pairs[p];
                    const [ax, ay] = lobeCenters[a];
                    const [bx, by] = lobeCenters[b];

                    // Midpoint between the two lobe centers
                    const midX = (ax + bx) / 2;
                    const midY = (ay + by) / 2;

                    // Mask at crossing
                    const ms = 0.055;
                    drawUV([
                        [midX - ms, midY - ms], [midX + ms, midY - ms],
                        [midX + ms, midY + ms], [midX - ms, midY + ms],
                    ], 'opaque-outline');

                    // Determine which lobe passes over (alternate)
                    const overIdx = p % 2 === 0 ? a : b;
                    const [ox, oy] = lobeCenters[overIdx];

                    // Compute angle from the over-lobe center to the midpoint
                    const angleToMid = Math.atan2(midY - oy, midX - ox);
                    const spanAngle = 0.5;
                    const overSeg = arcCenterPoints(ox, oy, lobeR,
                        angleToMid - spanAngle, angleToMid + spanAngle, 10);
                    drawUV(thickBand(overSeg, bandW), baseStyle);
                }

                // Central diamond detail
                const ds = 0.06;
                drawUV([
                    [cx, cy - ds], [cx + ds, cy],
                    [cx, cy + ds], [cx - ds, cy],
                ], detailStyle);

                // Smaller inner diamond
                const ds2 = 0.03;
                drawUV([
                    [cx, cy - ds2], [cx + ds2, cy],
                    [cx, cy + ds2], [cx - ds2, cy],
                ], mainStyle);

                // Outer border: thick square frame
                const frameW = 0.03;
                // Top
                drawUV([
                    [0.02, 0.02], [0.98, 0.02],
                    [0.98, 0.02 + frameW], [0.02, 0.02 + frameW],
                ], baseStyle);
                // Bottom
                drawUV([
                    [0.02, 0.98 - frameW], [0.98, 0.98 - frameW],
                    [0.98, 0.98], [0.02, 0.98],
                ], baseStyle);
                // Left
                drawUV([
                    [0.02, 0.02], [0.02 + frameW, 0.02],
                    [0.02 + frameW, 0.98], [0.02, 0.98],
                ], baseStyle);
                // Right
                drawUV([
                    [0.98 - frameW, 0.02], [0.98, 0.02],
                    [0.98, 0.98], [0.98 - frameW, 0.98],
                ], baseStyle);

                // Corner knot dots
                const cdot = 0.03;
                const cornerPts: [number, number][] = [
                    [0.08, 0.08], [0.92, 0.08], [0.08, 0.92], [0.92, 0.92]
                ];
                for (const [du, dv] of cornerPts) {
                    const cornerCircle = arcCenterPoints(du, dv, cdot, 0, Math.PI * 2, 10);
                    drawUV(cornerCircle, mainStyle);
                }

                // Diagonal accent bands connecting corners to lobes
                if (filled) {
                    // Small triangular fills in the gaps between lobes
                    drawUV([
                        [cx - 0.08, cy - 0.08],
                        [cx, cy - 0.04],
                        [cx - 0.04, cy],
                    ], 'opaque-outline');
                    drawUV([
                        [cx + 0.08, cy - 0.08],
                        [cx, cy - 0.04],
                        [cx + 0.04, cy],
                    ], 'opaque-outline');
                    drawUV([
                        [cx + 0.08, cy + 0.08],
                        [cx, cy + 0.04],
                        [cx + 0.04, cy],
                    ], 'opaque-outline');
                    drawUV([
                        [cx - 0.08, cy + 0.08],
                        [cx, cy + 0.04],
                        [cx - 0.04, cy],
                    ], 'opaque-outline');
                } else {
                    // In outline mode, fill the center area for visual weight
                    drawUV([
                        [cx - 0.08, cy - 0.08],
                        [cx + 0.08, cy - 0.08],
                        [cx + 0.08, cy + 0.08],
                        [cx - 0.08, cy + 0.08],
                    ], 'filled');
                }

                break;
            }
        }
    }
};

export default celticPatterns;
