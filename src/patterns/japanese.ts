import type { PatternSet, PatternContext } from './types';

const japanesePatterns: PatternSet = {
    name: 'Japanese Kumiko',
    count: 5,
    draw: (type: number, { drawUV, filled, baseStyle }: PatternContext) => {
        const mainStyle = filled ? 'filled' : 'outline';
        const detailStyle = filled ? 'opaque-outline' : 'filled';

        switch (type) {
            case 0: { // Asanoha (Hemp Leaf) — six-pointed star from triangular wedges
                const cx = 0.5, cy = 0.5;

                // Six bold triangular wedges radiating from center forming the star
                const numPoints = 6;
                for (let i = 0; i < numPoints; i++) {
                    const angle = (i / numPoints) * Math.PI * 2 - Math.PI / 2;
                    const nextAngle = ((i + 1) / numPoints) * Math.PI * 2 - Math.PI / 2;
                    const midAngle = (angle + nextAngle) / 2;

                    // Outer tip of the wedge
                    const tipU = cx + 0.46 * Math.cos(angle);
                    const tipV = cy + 0.46 * Math.sin(angle);

                    // Sides of the wedge at the base
                    const leftU = cx + 0.16 * Math.cos(angle - 0.35);
                    const leftV = cy + 0.16 * Math.sin(angle - 0.35);
                    const rightU = cx + 0.16 * Math.cos(angle + 0.35);
                    const rightV = cy + 0.16 * Math.sin(angle + 0.35);

                    // Main wedge — bold filled triangle
                    drawUV([
                        [tipU, tipV],
                        [leftU, leftV],
                        [rightU, rightV],
                    ], baseStyle);

                    // Secondary diamond between wedges for the star lattice effect
                    const outerMidU = cx + 0.38 * Math.cos(midAngle);
                    const outerMidV = cy + 0.38 * Math.sin(midAngle);
                    const innerMidU = cx + 0.18 * Math.cos(midAngle);
                    const innerMidV = cy + 0.18 * Math.sin(midAngle);
                    const sideAU = cx + 0.28 * Math.cos(midAngle - 0.28);
                    const sideAV = cy + 0.28 * Math.sin(midAngle - 0.28);
                    const sideBU = cx + 0.28 * Math.cos(midAngle + 0.28);
                    const sideBV = cy + 0.28 * Math.sin(midAngle + 0.28);

                    drawUV([
                        [outerMidU, outerMidV],
                        [sideAU, sideAV],
                        [innerMidU, innerMidV],
                        [sideBU, sideBV],
                    ], detailStyle);
                }

                // Central hexagon
                const hexInner: [number, number][] = [];
                const hexOuter: [number, number][] = [];
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
                    hexInner.push([cx + 0.08 * Math.cos(angle), cy + 0.08 * Math.sin(angle)]);
                    hexOuter.push([cx + 0.14 * Math.cos(angle), cy + 0.14 * Math.sin(angle)]);
                }
                drawUV(hexOuter, mainStyle);
                drawUV(hexInner, detailStyle);

                // Outer connecting bands between star tips (thick bands)
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
                    const nextAngle = ((i + 1) / 6) * Math.PI * 2 - Math.PI / 2;
                    const bw = 0.03; // band half-width

                    const u1 = cx + 0.44 * Math.cos(angle);
                    const v1 = cy + 0.44 * Math.sin(angle);
                    const u2 = cx + 0.44 * Math.cos(nextAngle);
                    const v2 = cy + 0.44 * Math.sin(nextAngle);

                    // Perpendicular offset for band width
                    const dx = u2 - u1;
                    const dy = v2 - v1;
                    const len = Math.sqrt(dx * dx + dy * dy);
                    const nx = -dy / len * bw;
                    const ny = dx / len * bw;

                    drawUV([
                        [u1 + nx, v1 + ny],
                        [u2 + nx, v2 + ny],
                        [u2 - nx, v2 - ny],
                        [u1 - nx, v1 - ny],
                    ], mainStyle);
                }

                // Corner fill squares
                const corners: [number, number][] = [[0.05, 0.05], [0.95, 0.05], [0.05, 0.95], [0.95, 0.95]];
                for (const [cu, cv] of corners) {
                    drawUV([
                        [cu - 0.04, cv - 0.04], [cu + 0.04, cv - 0.04],
                        [cu + 0.04, cv + 0.04], [cu - 0.04, cv + 0.04],
                    ], mainStyle);
                }

                break;
            }

            case 1: { // Seigaiha (Ocean Waves) — overlapping concentric arc bands
                const numWaves = 3;
                const numArcs = 3;
                const arcSegments = 24;

                for (let w = 0; w < numWaves; w++) {
                    const baseCy = 0.15 + w * 0.30;
                    const offsetX = (w % 2 === 0) ? 0.0 : 0.30;

                    for (let col = -1; col < 3; col++) {
                        const baseCx = offsetX + col * 0.60;

                        for (let a = 0; a < numArcs; a++) {
                            const outerR = 0.28 - a * 0.07;
                            const innerR = outerR - 0.05;
                            if (innerR < 0.02) continue;

                            // Build arc band as closed polygon (semicircle on top)
                            const points: [number, number][] = [];

                            // Outer arc (left to right)
                            for (let s = 0; s <= arcSegments; s++) {
                                const angle = Math.PI + (s / arcSegments) * Math.PI;
                                const u = baseCx + outerR * Math.cos(angle);
                                const v = baseCy + outerR * Math.sin(angle);
                                if (u >= -0.1 && u <= 1.1) {
                                    points.push([Math.max(0, Math.min(1, u)), Math.max(0, Math.min(1, v))]);
                                }
                            }

                            // Inner arc (right to left, reversed)
                            for (let s = arcSegments; s >= 0; s--) {
                                const angle = Math.PI + (s / arcSegments) * Math.PI;
                                const u = baseCx + innerR * Math.cos(angle);
                                const v = baseCy + innerR * Math.sin(angle);
                                if (u >= -0.1 && u <= 1.1) {
                                    points.push([Math.max(0, Math.min(1, u)), Math.max(0, Math.min(1, v))]);
                                }
                            }

                            if (points.length >= 3) {
                                const style = a === 0 ? baseStyle : (a === 1 ? detailStyle : mainStyle);
                                drawUV(points, style);
                            }
                        }
                    }
                }

                // Bottom decorative band
                drawUV([
                    [0.0, 0.88], [1.0, 0.88],
                    [1.0, 0.92], [0.0, 0.92],
                ], mainStyle);

                // Top decorative band
                drawUV([
                    [0.0, 0.0], [1.0, 0.0],
                    [1.0, 0.04], [0.0, 0.04],
                ], mainStyle);

                // Small accent squares along bottom
                for (let i = 0; i < 5; i++) {
                    const u = 0.1 + i * 0.2;
                    drawUV([
                        [u - 0.02, 0.94], [u + 0.02, 0.94],
                        [u + 0.02, 0.98], [u - 0.02, 0.98],
                    ], detailStyle);
                }

                break;
            }

            case 2: { // Shippo (Seven Treasures) — overlapping circles forming petal shapes
                const cx = 0.5, cy = 0.5;
                const petalSegments = 24;

                // Four main petal shapes (formed by circle intersections)
                const petalDirs: [number, number][] = [
                    [0, -1], [1, 0], [0, 1], [-1, 0]
                ];

                for (const [dx, dy] of petalDirs) {
                    // Each petal is a lens/vesica shape
                    const petalPoints: [number, number][] = [];
                    const petalLen = 0.32;
                    const petalWidth = 0.16;

                    // Tip of petal (away from center)
                    const tipU = cx + dx * petalLen;
                    const tipV = cy + dy * petalLen;

                    // Base of petal (at center)
                    const baseU = cx + dx * 0.04;
                    const baseV = cy + dy * 0.04;

                    // Build petal as a smooth lens shape
                    for (let s = 0; s <= petalSegments; s++) {
                        const t = s / petalSegments;
                        const along = baseU + (tipU - baseU) * t;
                        const alongV = baseV + (tipV - baseV) * t;
                        // Bulge perpendicular to petal direction
                        const bulge = petalWidth * Math.sin(t * Math.PI);
                        const perpU = -dy * bulge;
                        const perpV = dx * bulge;
                        petalPoints.push([along + perpU, alongV + perpV]);
                    }
                    // Return along the other side
                    for (let s = petalSegments; s >= 0; s--) {
                        const t = s / petalSegments;
                        const along = baseU + (tipU - baseU) * t;
                        const alongV = baseV + (tipV - baseV) * t;
                        const bulge = petalWidth * Math.sin(t * Math.PI);
                        const perpU = dy * bulge;
                        const perpV = -dx * bulge;
                        petalPoints.push([along + perpU, alongV + perpV]);
                    }

                    drawUV(petalPoints, baseStyle);

                    // Inner detail petal (smaller, contrasting)
                    const innerPoints: [number, number][] = [];
                    const innerLen = 0.24;
                    const innerWidth = 0.08;
                    const innerTipU = cx + dx * innerLen;
                    const innerTipV = cy + dy * innerLen;
                    const innerBaseU = cx + dx * 0.08;
                    const innerBaseV = cy + dy * 0.08;

                    for (let s = 0; s <= petalSegments; s++) {
                        const t = s / petalSegments;
                        const along = innerBaseU + (innerTipU - innerBaseU) * t;
                        const alongV = innerBaseV + (innerTipV - innerBaseV) * t;
                        const bulge = innerWidth * Math.sin(t * Math.PI);
                        innerPoints.push([along + (-dy) * bulge, alongV + dx * bulge]);
                    }
                    for (let s = petalSegments; s >= 0; s--) {
                        const t = s / petalSegments;
                        const along = innerBaseU + (innerTipU - innerBaseU) * t;
                        const alongV = innerBaseV + (innerTipV - innerBaseV) * t;
                        const bulge = innerWidth * Math.sin(t * Math.PI);
                        innerPoints.push([along + dy * bulge, alongV + (-dx) * bulge]);
                    }

                    drawUV(innerPoints, detailStyle);
                }

                // Diagonal petals (4 more for 8-fold symmetry)
                const diagDirs: [number, number][] = [
                    [0.707, -0.707], [0.707, 0.707], [-0.707, 0.707], [-0.707, -0.707]
                ];

                for (const [dx, dy] of diagDirs) {
                    const petalPoints: [number, number][] = [];
                    const petalLen = 0.26;
                    const petalWidth = 0.10;
                    const tipU = cx + dx * petalLen;
                    const tipV = cy + dy * petalLen;
                    const baseU = cx + dx * 0.06;
                    const baseV = cy + dy * 0.06;

                    for (let s = 0; s <= petalSegments; s++) {
                        const t = s / petalSegments;
                        const along = baseU + (tipU - baseU) * t;
                        const alongV = baseV + (tipV - baseV) * t;
                        const bulge = petalWidth * Math.sin(t * Math.PI);
                        petalPoints.push([along + (-dy) * bulge, alongV + dx * bulge]);
                    }
                    for (let s = petalSegments; s >= 0; s--) {
                        const t = s / petalSegments;
                        const along = baseU + (tipU - baseU) * t;
                        const alongV = baseV + (tipV - baseV) * t;
                        const bulge = petalWidth * Math.sin(t * Math.PI);
                        petalPoints.push([along + dy * bulge, alongV + (-dx) * bulge]);
                    }

                    drawUV(petalPoints, mainStyle);
                }

                // Central circle
                const centerPoints: [number, number][] = [];
                for (let i = 0; i < 20; i++) {
                    const angle = (i / 20) * Math.PI * 2;
                    centerPoints.push([cx + 0.07 * Math.cos(angle), cy + 0.07 * Math.sin(angle)]);
                }
                drawUV(centerPoints, detailStyle);

                // Tiny center dot
                const dotPoints: [number, number][] = [];
                for (let i = 0; i < 12; i++) {
                    const angle = (i / 12) * Math.PI * 2;
                    dotPoints.push([cx + 0.03 * Math.cos(angle), cy + 0.03 * Math.sin(angle)]);
                }
                drawUV(dotPoints, mainStyle);

                break;
            }

            case 3: { // Kikkō (Tortoiseshell) — hexagonal tessellation with nested hexagons
                const cx = 0.5, cy = 0.5;

                // Outer hexagonal frame (thick band)
                const outerR = 0.46;
                const innerR = 0.36;
                const outerHex: [number, number][] = [];
                const innerHex: [number, number][] = [];

                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2 - Math.PI / 6;
                    outerHex.push([cx + outerR * Math.cos(angle), cy + outerR * Math.sin(angle)]);
                    innerHex.push([cx + innerR * Math.cos(angle), cy + innerR * Math.sin(angle)]);
                }

                // Draw outer hex frame as 6 trapezoids for bold look
                for (let i = 0; i < 6; i++) {
                    const next = (i + 1) % 6;
                    drawUV([
                        outerHex[i],
                        outerHex[next],
                        innerHex[next],
                        innerHex[i],
                    ], baseStyle);
                }

                // Middle hexagon (outline/detail)
                const midR = 0.28;
                const midHex: [number, number][] = [];
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2 - Math.PI / 6;
                    midHex.push([cx + midR * Math.cos(angle), cy + midR * Math.sin(angle)]);
                }
                drawUV(midHex, detailStyle);

                // Inner hexagonal frame
                const innerFrameOuterR = 0.22;
                const innerFrameInnerR = 0.14;
                const ifo: [number, number][] = [];
                const ifi: [number, number][] = [];
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2 - Math.PI / 6;
                    ifo.push([cx + innerFrameOuterR * Math.cos(angle), cy + innerFrameOuterR * Math.sin(angle)]);
                    ifi.push([cx + innerFrameInnerR * Math.cos(angle), cy + innerFrameInnerR * Math.sin(angle)]);
                }

                for (let i = 0; i < 6; i++) {
                    const next = (i + 1) % 6;
                    drawUV([
                        ifo[i], ifo[next],
                        ifi[next], ifi[i],
                    ], mainStyle);
                }

                // Innermost hexagon (solid)
                const coreR = 0.08;
                const coreHex: [number, number][] = [];
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2 - Math.PI / 6;
                    coreHex.push([cx + coreR * Math.cos(angle), cy + coreR * Math.sin(angle)]);
                }
                drawUV(coreHex, detailStyle);

                // Decorative triangles at each vertex of the outer hex
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2 - Math.PI / 6;
                    const prevAngle = ((i - 1) / 6) * Math.PI * 2 - Math.PI / 6;
                    const nextAngle = ((i + 1) / 6) * Math.PI * 2 - Math.PI / 6;

                    const vu = cx + outerR * Math.cos(angle);
                    const vv = cy + outerR * Math.sin(angle);
                    const lu = cx + (outerR - 0.08) * Math.cos(angle - 0.15);
                    const lv = cy + (outerR - 0.08) * Math.sin(angle - 0.15);
                    const ru = cx + (outerR - 0.08) * Math.cos(angle + 0.15);
                    const rv = cy + (outerR - 0.08) * Math.sin(angle + 0.15);

                    drawUV([[vu, vv], [lu, lv], [ru, rv]], detailStyle);
                }

                // Radial connector bands from inner to outer hex (thick bars)
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2 - Math.PI / 6;
                    const bw = 0.025;
                    const perpAngle = angle + Math.PI / 2;

                    const u1 = cx + innerFrameOuterR * Math.cos(angle);
                    const v1 = cy + innerFrameOuterR * Math.sin(angle);
                    const u2 = cx + innerR * Math.cos(angle);
                    const v2 = cy + innerR * Math.sin(angle);

                    drawUV([
                        [u1 + bw * Math.cos(perpAngle), v1 + bw * Math.sin(perpAngle)],
                        [u2 + bw * Math.cos(perpAngle), v2 + bw * Math.sin(perpAngle)],
                        [u2 - bw * Math.cos(perpAngle), v2 - bw * Math.sin(perpAngle)],
                        [u1 - bw * Math.cos(perpAngle), v1 - bw * Math.sin(perpAngle)],
                    ], mainStyle);
                }

                break;
            }

            case 4: { // Yagasuri (Arrow Feathers) — interlocking bold arrow/chevron shapes

                // Left arrow (pointing up-right)
                drawUV([
                    [0.0, 0.50],
                    [0.48, 0.0],
                    [0.52, 0.0],
                    [0.52, 0.04],
                    [0.08, 0.50],
                    [0.52, 0.96],
                    [0.52, 1.0],
                    [0.48, 1.0],
                ], baseStyle);

                // Right arrow (pointing up-left)
                drawUV([
                    [1.0, 0.50],
                    [0.52, 0.0],
                    [0.56, 0.0],
                    [0.96, 0.46],
                    [0.96, 0.54],
                    [0.56, 1.0],
                    [0.52, 1.0],
                ], baseStyle);

                // Central spine band (vertical)
                drawUV([
                    [0.48, 0.0], [0.52, 0.0],
                    [0.52, 1.0], [0.48, 1.0],
                ], detailStyle);

                // Left feather barbs (angled filled bands)
                for (let i = 0; i < 7; i++) {
                    const yBase = 0.08 + i * 0.13;
                    const bw = 0.025;
                    // Upper-left barb
                    const x1 = 0.10 + i * 0.05;
                    const x2 = 0.46;

                    drawUV([
                        [x1, yBase],
                        [x2, yBase - 0.04],
                        [x2, yBase - 0.04 + bw],
                        [x1, yBase + bw],
                    ], detailStyle);
                }

                // Right feather barbs
                for (let i = 0; i < 7; i++) {
                    const yBase = 0.08 + i * 0.13;
                    const bw = 0.025;
                    const x1 = 0.90 - i * 0.05;
                    const x2 = 0.54;

                    drawUV([
                        [x1, yBase],
                        [x2, yBase - 0.04],
                        [x2, yBase - 0.04 + bw],
                        [x1, yBase + bw],
                    ], detailStyle);
                }

                // Arrowhead accent at top
                drawUV([
                    [0.50, 0.0],
                    [0.40, 0.08],
                    [0.44, 0.08],
                    [0.50, 0.03],
                    [0.56, 0.08],
                    [0.60, 0.08],
                ], mainStyle);

                // Arrowhead accent at bottom
                drawUV([
                    [0.50, 1.0],
                    [0.40, 0.92],
                    [0.44, 0.92],
                    [0.50, 0.97],
                    [0.56, 0.92],
                    [0.60, 0.92],
                ], mainStyle);

                // Bold edge bands
                drawUV([
                    [0.0, 0.46], [0.06, 0.46],
                    [0.06, 0.54], [0.0, 0.54],
                ], mainStyle);
                drawUV([
                    [0.94, 0.46], [1.0, 0.46],
                    [1.0, 0.54], [0.94, 0.54],
                ], mainStyle);

                if (filled) {
                    // Opaque detail diamonds along the arrows
                    for (let i = 0; i < 4; i++) {
                        const y = 0.20 + i * 0.20;
                        // Left arrow diamonds
                        const lx = 0.12 + i * 0.08;
                        drawUV([
                            [lx, y], [lx + 0.04, y + 0.03],
                            [lx, y + 0.06], [lx - 0.04, y + 0.03],
                        ], 'opaque-outline');
                        // Right arrow diamonds
                        const rx = 0.88 - i * 0.08;
                        drawUV([
                            [rx, y], [rx + 0.04, y + 0.03],
                            [rx, y + 0.06], [rx - 0.04, y + 0.03],
                        ], 'opaque-outline');
                    }
                } else {
                    // Filled accent diamonds in outline mode
                    for (let i = 0; i < 4; i++) {
                        const y = 0.20 + i * 0.20;
                        const lx = 0.12 + i * 0.08;
                        drawUV([
                            [lx, y], [lx + 0.04, y + 0.03],
                            [lx, y + 0.06], [lx - 0.04, y + 0.03],
                        ], 'filled');
                        const rx = 0.88 - i * 0.08;
                        drawUV([
                            [rx, y], [rx + 0.04, y + 0.03],
                            [rx, y + 0.06], [rx - 0.04, y + 0.03],
                        ], 'filled');
                    }
                }

                break;
            }
        }
    }
};

export default japanesePatterns;
