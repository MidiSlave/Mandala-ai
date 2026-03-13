import type { PatternSet, PatternContext } from './types';

// Helper: rectangle as [number, number][]
function filledRect(u1: number, v1: number, u2: number, v2: number): [number, number][] {
    return [[u1, v1], [u2, v1], [u2, v2], [u1, v2]];
}

// Helper: arc band (filled region between inner and outer arc)
function arcBand(
    centerU: number, centerV: number,
    innerR: number, outerR: number,
    startAngle: number, endAngle: number,
    numPoints: number
): [number, number][] {
    const outerPts: [number, number][] = [];
    const innerPts: [number, number][] = [];
    for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        const angle = startAngle + t * (endAngle - startAngle);
        outerPts.push([centerU + outerR * Math.cos(angle), centerV + outerR * Math.sin(angle)]);
        innerPts.push([centerU + innerR * Math.cos(angle), centerV + innerR * Math.sin(angle)]);
    }
    // Outer arc forward, inner arc reversed
    return [...outerPts, ...innerPts.reverse()];
}

// Helper: filled band that looks like a thick line (rectangle between two points with width)
function thickBand(u1: number, v1: number, u2: number, v2: number, width: number): [number, number][] {
    const dx = u2 - u1;
    const dy = v2 - v1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return [[u1, v1]];
    const nx = (-dy / len) * width * 0.5;
    const ny = (dx / len) * width * 0.5;
    return [
        [u1 + nx, v1 + ny],
        [u2 + nx, v2 + ny],
        [u2 - nx, v2 - ny],
        [u1 - nx, v1 - ny],
    ];
}

const artDecoPatterns: PatternSet = {
    name: 'Art Deco / Gatsby',
    count: 5,
    draw: (type: number, { drawUV, filled, baseStyle }: PatternContext) => {
        const mainStyle = filled ? 'filled' : 'outline';
        const detailStyle = filled ? 'opaque-outline' : 'filled';

        switch (type) {
            case 0: { // Sunburst / Starburst — radiating wedge shapes from bottom-center
                const cx = 0.5;
                const cy = 0.05; // sun rises from bottom of cell
                const numRays = 9;

                // Alternating filled and opaque-outline wedge rays
                for (let i = 0; i < numRays; i++) {
                    const angleStart = -Math.PI * 0.08 + (i / numRays) * Math.PI * 1.16;
                    const angleEnd = -Math.PI * 0.08 + ((i + 0.85) / numRays) * Math.PI * 1.16;
                    const innerR = 0.08;
                    const outerR = 0.55 + (i % 2 === 0 ? 0.08 : 0.0);

                    const pts: [number, number][] = [];
                    // Inner arc (just a small number of points since it's tiny)
                    for (let j = 0; j <= 3; j++) {
                        const t = j / 3;
                        const a = angleStart + t * (angleEnd - angleStart);
                        pts.push([cx + innerR * Math.cos(a), cy + innerR * Math.sin(a)]);
                    }
                    // Outer arc (reversed)
                    for (let j = 3; j >= 0; j--) {
                        const t = j / 3;
                        const a = angleStart + t * (angleEnd - angleStart);
                        pts.push([cx + outerR * Math.cos(a), cy + outerR * Math.sin(a)]);
                    }

                    const style = i % 2 === 0 ? baseStyle : detailStyle;
                    drawUV(pts, style);
                }

                // Semicircular sun body at bottom
                const sunBody = arcBand(cx, cy, 0.0, 0.10, -Math.PI * 0.05, Math.PI * 1.05, 24);
                drawUV(sunBody, baseStyle);

                // Decorative arc bands across the top portion
                drawUV(arcBand(cx, cy, 0.56, 0.62, 0.05, Math.PI * 0.95, 30), mainStyle);
                drawUV(arcBand(cx, cy, 0.66, 0.70, 0.1, Math.PI * 0.9, 28), detailStyle);
                drawUV(arcBand(cx, cy, 0.74, 0.80, 0.15, Math.PI * 0.85, 26), mainStyle);

                // Bold horizontal band at very top
                drawUV(filledRect(0.02, 0.88, 0.98, 0.95), baseStyle);
                if (filled) {
                    // Cutout diamonds in the top band
                    for (let i = 0; i < 5; i++) {
                        const bu = 0.15 + i * 0.175;
                        drawUV([
                            [bu, 0.895], [bu + 0.025, 0.915],
                            [bu, 0.935], [bu - 0.025, 0.915],
                        ], 'opaque-outline');
                    }
                } else {
                    for (let i = 0; i < 5; i++) {
                        const bu = 0.15 + i * 0.175;
                        drawUV([
                            [bu, 0.895], [bu + 0.025, 0.915],
                            [bu, 0.935], [bu - 0.025, 0.915],
                        ], 'filled');
                    }
                }

                // Corner decorative squares
                drawUV(filledRect(0.02, 0.02, 0.10, 0.06), 'filled');
                drawUV(filledRect(0.90, 0.02, 0.98, 0.06), 'filled');

                break;
            }

            case 1: { // Fan / Palmette — concentric arc bands like a hand fan
                const cx = 0.5;
                const cy = 0.0; // fan opens upward from bottom

                // Concentric arc bands from inner to outer
                const bandRadii = [
                    { inner: 0.06, outer: 0.16 },
                    { inner: 0.20, outer: 0.30 },
                    { inner: 0.34, outer: 0.44 },
                    { inner: 0.48, outer: 0.56 },
                    { inner: 0.60, outer: 0.70 },
                    { inner: 0.74, outer: 0.82 },
                ];

                for (let i = 0; i < bandRadii.length; i++) {
                    const { inner, outer } = bandRadii[i];
                    const band = arcBand(cx, cy, inner, outer, 0.12, Math.PI - 0.12, 30);
                    const style = i % 2 === 0 ? baseStyle : detailStyle;
                    drawUV(band, style);
                }

                // Thin separator bands between main bands
                const separators = [0.17, 0.31, 0.45, 0.57, 0.71];
                for (const r of separators) {
                    const sep = arcBand(cx, cy, r, r + 0.025, 0.15, Math.PI - 0.15, 26);
                    drawUV(sep, filled ? 'filled' : 'outline');
                }

                // Decorative base pedestal
                drawUV(filledRect(0.32, 0.0, 0.68, 0.06), baseStyle);
                drawUV(filledRect(0.38, 0.0, 0.62, 0.02), detailStyle);

                // Radial spine lines (as filled bands for boldness)
                const numSpines = 7;
                for (let i = 0; i < numSpines; i++) {
                    const angle = 0.25 + (i / (numSpines - 1)) * (Math.PI - 0.50);
                    const u1 = cx + 0.08 * Math.cos(angle);
                    const v1 = cy + 0.08 * Math.sin(angle);
                    const u2 = cx + 0.80 * Math.cos(angle);
                    const v2 = cy + 0.80 * Math.sin(angle);
                    drawUV(thickBand(u1, v1, u2, v2, 0.02), filled ? 'opaque-outline' : 'filled');
                }

                // Top decorative arc
                drawUV(arcBand(cx, cy, 0.84, 0.90, 0.2, Math.PI - 0.2, 28), mainStyle);

                // Small filled circles at fan tips
                const tipAngles = [0.3, 0.7, Math.PI / 2, Math.PI - 0.7, Math.PI - 0.3];
                for (const angle of tipAngles) {
                    const tu = cx + 0.87 * Math.cos(angle);
                    const tv = cy + 0.87 * Math.sin(angle);
                    const dotR = 0.025;
                    const dot: [number, number][] = [];
                    for (let j = 0; j < 8; j++) {
                        const a = (j / 8) * Math.PI * 2;
                        dot.push([tu + dotR * Math.cos(a), tv + dotR * Math.sin(a)]);
                    }
                    drawUV(dot, 'filled');
                }

                // Outermost border band
                drawUV(arcBand(cx, cy, 0.91, 0.96, 0.25, Math.PI - 0.25, 24), baseStyle);

                break;
            }

            case 2: { // Stepped Ziggurat — terraced pyramid with bold horizontal steps
                // Main ziggurat silhouette — 6 terraces
                const steps: { left: number; right: number; bottom: number; top: number }[] = [
                    { left: 0.02, right: 0.98, bottom: 0.00, top: 0.14 },
                    { left: 0.10, right: 0.90, bottom: 0.14, top: 0.30 },
                    { left: 0.18, right: 0.82, bottom: 0.30, top: 0.46 },
                    { left: 0.26, right: 0.74, bottom: 0.46, top: 0.60 },
                    { left: 0.34, right: 0.66, bottom: 0.60, top: 0.74 },
                    { left: 0.40, right: 0.60, bottom: 0.74, top: 0.86 },
                ];

                for (let i = 0; i < steps.length; i++) {
                    const s = steps[i];
                    const style = i % 2 === 0 ? baseStyle : detailStyle;
                    drawUV(filledRect(s.left, s.bottom, s.right, s.top), style);
                }

                // Crown / capstone on top
                drawUV([
                    [0.44, 0.86], [0.56, 0.86],
                    [0.50, 0.98],
                ], baseStyle);

                // Horizontal accent bands at each step transition
                for (let i = 0; i < steps.length; i++) {
                    const s = steps[i];
                    drawUV(filledRect(s.left - 0.01, s.top - 0.02, s.right + 0.01, s.top), 'filled');
                }

                // Vertical center pillar accent
                drawUV(filledRect(0.47, 0.0, 0.53, 0.86), filled ? 'opaque-outline' : 'filled');

                // Decorative elements on alternating steps
                if (filled) {
                    // Diamond cutouts on even steps
                    for (let i = 0; i < steps.length; i += 2) {
                        const s = steps[i];
                        const midV = (s.bottom + s.top) / 2;
                        // Left diamond
                        const leftU = (s.left + 0.47) / 2;
                        drawUV([
                            [leftU, midV - 0.04], [leftU + 0.04, midV],
                            [leftU, midV + 0.04], [leftU - 0.04, midV],
                        ], 'opaque-outline');
                        // Right diamond
                        const rightU = (0.53 + s.right) / 2;
                        drawUV([
                            [rightU, midV - 0.04], [rightU + 0.04, midV],
                            [rightU, midV + 0.04], [rightU - 0.04, midV],
                        ], 'opaque-outline');
                    }
                } else {
                    // Filled diamond accents in outline mode
                    for (let i = 0; i < steps.length; i += 2) {
                        const s = steps[i];
                        const midV = (s.bottom + s.top) / 2;
                        const leftU = (s.left + 0.47) / 2;
                        drawUV([
                            [leftU, midV - 0.04], [leftU + 0.04, midV],
                            [leftU, midV + 0.04], [leftU - 0.04, midV],
                        ], 'filled');
                        const rightU = (0.53 + s.right) / 2;
                        drawUV([
                            [rightU, midV - 0.04], [rightU + 0.04, midV],
                            [rightU, midV + 0.04], [rightU - 0.04, midV],
                        ], 'filled');
                    }
                }

                // Small square dots at step corners
                const dotSize = 0.02;
                for (const s of steps) {
                    drawUV(filledRect(s.left, s.bottom, s.left + dotSize * 2, s.bottom + dotSize * 2), 'filled');
                    drawUV(filledRect(s.right - dotSize * 2, s.bottom, s.right, s.bottom + dotSize * 2), 'filled');
                }

                break;
            }

            case 3: { // Keystone Arch — pointed arch with internal nested bands
                // Outer arch shape (pointed/ogee arch)
                const archPts = (inset: number, topV: number): [number, number][] => {
                    const pts: [number, number][] = [];
                    const leftBase = 0.05 + inset;
                    const rightBase = 0.95 - inset;
                    const cx = 0.5;
                    const baseV = 0.0 + inset * 0.3;
                    const peakV = topV;

                    // Left column base
                    pts.push([leftBase, baseV]);

                    // Left side of arch — curve up to peak
                    const numArcPts = 20;
                    for (let i = 0; i <= numArcPts; i++) {
                        const t = i / numArcPts;
                        // Ogival (pointed) arch: two arcs meeting at a point
                        const u = leftBase + t * (cx - leftBase);
                        // Parabolic rise with a pointed peak
                        const v = baseV + (peakV - baseV) * Math.pow(t, 0.6);
                        pts.push([u, v]);
                    }
                    // Right side of arch — curve down from peak
                    for (let i = numArcPts; i >= 0; i--) {
                        const t = i / numArcPts;
                        const u = rightBase - t * (rightBase - cx);
                        const v = baseV + (peakV - baseV) * Math.pow(t, 0.6);
                        pts.push([u, v]);
                    }

                    // Right column base
                    pts.push([rightBase, baseV]);

                    return pts;
                };

                // Main outer arch body
                const outerArch = archPts(0, 0.92);
                drawUV(outerArch, baseStyle);

                // Nested inner arches (cutouts or outlines)
                const nestInsets = [0.08, 0.16, 0.24, 0.32];
                const nestTops = [0.82, 0.72, 0.60, 0.46];
                for (let i = 0; i < nestInsets.length; i++) {
                    const inner = archPts(nestInsets[i], nestTops[i]);
                    const style = i % 2 === 0 ? detailStyle : mainStyle;
                    drawUV(inner, style);
                }

                // Bold pillar columns on each side
                drawUV(filledRect(0.02, 0.0, 0.12, 0.50), baseStyle);
                drawUV(filledRect(0.88, 0.0, 0.98, 0.50), baseStyle);

                // Column capital details
                if (filled) {
                    drawUV(filledRect(0.04, 0.42, 0.10, 0.48), 'opaque-outline');
                    drawUV(filledRect(0.90, 0.42, 0.96, 0.48), 'opaque-outline');
                } else {
                    drawUV(filledRect(0.04, 0.42, 0.10, 0.48), 'filled');
                    drawUV(filledRect(0.90, 0.42, 0.96, 0.48), 'filled');
                }

                // Keystone at the apex
                drawUV([
                    [0.44, 0.84], [0.56, 0.84],
                    [0.52, 0.94], [0.48, 0.94],
                ], detailStyle);

                // Decorative band across base
                drawUV(filledRect(0.02, 0.0, 0.98, 0.04), 'filled');

                // Small accent squares along pillar faces
                for (let i = 0; i < 4; i++) {
                    const v = 0.08 + i * 0.09;
                    drawUV(filledRect(0.04, v, 0.10, v + 0.04), detailStyle);
                    drawUV(filledRect(0.90, v, 0.96, v + 0.04), detailStyle);
                }

                break;
            }

            case 4: { // Fountain / Chevron Stack — nested V-shapes with decorative cap
                const cx = 0.5;
                const bandWidth = 0.04; // thickness of each chevron band

                // 6 nested chevrons from bottom to top, decreasing in size
                const chevrons = [
                    { width: 0.46, tipV: 0.12, armV: 0.0 },
                    { width: 0.40, tipV: 0.26, armV: 0.14 },
                    { width: 0.34, tipV: 0.40, armV: 0.28 },
                    { width: 0.28, tipV: 0.52, armV: 0.40 },
                    { width: 0.22, tipV: 0.62, armV: 0.52 },
                    { width: 0.16, tipV: 0.72, armV: 0.62 },
                ];

                for (let i = 0; i < chevrons.length; i++) {
                    const { width, tipV, armV } = chevrons[i];
                    const style = i % 2 === 0 ? baseStyle : detailStyle;

                    // Each chevron is a filled V-band shape
                    // Outer V
                    const outerLeft = cx - width;
                    const outerRight = cx + width;
                    // Inner V (smaller, creating the band)
                    const innerWidth = width - bandWidth * 1.8;
                    const innerLeft = cx - innerWidth;
                    const innerRight = cx + innerWidth;
                    const innerTipV = tipV - bandWidth * 1.2;

                    // Draw as a single polygon: outer V clockwise, then inner V counterclockwise
                    drawUV([
                        [outerLeft, armV],          // outer left arm top
                        [cx, tipV],                 // outer tip (bottom center)
                        [outerRight, armV],         // outer right arm top
                        [outerRight, armV + bandWidth], // outer right arm bottom
                        [cx, tipV + bandWidth],     // outer tip bottom
                        [outerLeft, armV + bandWidth],  // outer left arm bottom
                    ], style);

                    // Inner fill for visual depth (solid inner area)
                    if (i % 2 === 0) {
                        drawUV([
                            [innerLeft, armV + bandWidth * 0.5],
                            [cx, innerTipV + bandWidth],
                            [innerRight, armV + bandWidth * 0.5],
                        ], detailStyle);
                    }
                }

                // Decorative cap on top — a filled circle/diamond
                const capPts: [number, number][] = [];
                const capR = 0.08;
                const capCY = 0.78;
                for (let i = 0; i < 12; i++) {
                    const a = (i / 12) * Math.PI * 2;
                    capPts.push([cx + capR * Math.cos(a), capCY + capR * 0.8 * Math.sin(a)]);
                }
                drawUV(capPts, baseStyle);

                // Inner cap detail
                const innerCapPts: [number, number][] = [];
                const innerCapR = 0.04;
                for (let i = 0; i < 8; i++) {
                    const a = (i / 8) * Math.PI * 2;
                    innerCapPts.push([cx + innerCapR * Math.cos(a), capCY + innerCapR * 0.8 * Math.sin(a)]);
                }
                drawUV(innerCapPts, detailStyle);

                // Vertical spine through center
                drawUV(filledRect(0.48, 0.0, 0.52, 0.70), filled ? 'opaque-outline' : 'filled');

                // Topmost decorative finial — small triangle above cap
                drawUV([
                    [0.45, 0.86], [0.55, 0.86],
                    [0.50, 0.96],
                ], baseStyle);

                // Side border columns
                drawUV(filledRect(0.0, 0.0, 0.05, 0.96), mainStyle);
                drawUV(filledRect(0.95, 0.0, 1.0, 0.96), mainStyle);

                // Horizontal base band
                drawUV(filledRect(0.0, 0.0, 1.0, 0.03), 'filled');

                // Small squares on side columns
                for (let i = 0; i < 5; i++) {
                    const v = 0.08 + i * 0.17;
                    drawUV(filledRect(0.01, v, 0.04, v + 0.04), detailStyle);
                    drawUV(filledRect(0.96, v, 0.99, v + 0.04), detailStyle);
                }

                break;
            }
        }
    }
};

export default artDecoPatterns;
