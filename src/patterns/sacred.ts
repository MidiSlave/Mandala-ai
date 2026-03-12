import type { PatternSet, PatternContext } from './types';

// Helper: generate a circle polygon
function circle(cx: number, cy: number, r: number, n: number = 24): [number, number][] {
    const pts: [number, number][] = [];
    for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    return pts;
}

// Helper: generate a ring (annulus) as outer circle + reversed inner circle
// This creates a closed polygon that, when filled, leaves a hole in the middle
function ring(cx: number, cy: number, outerR: number, innerR: number, n: number = 24): { outer: [number, number][], inner: [number, number][] } {
    return {
        outer: circle(cx, cy, outerR, n),
        inner: circle(cx, cy, innerR, n),
    };
}

// Helper: create a thick band (filled rectangle) between two points
function band(u1: number, v1: number, u2: number, v2: number, width: number): [number, number][] {
    const dx = u2 - u1;
    const dy = v2 - v1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return [];
    const nx = (-dy / len) * width * 0.5;
    const ny = (dx / len) * width * 0.5;
    return [
        [u1 + nx, v1 + ny],
        [u2 + nx, v2 + ny],
        [u2 - nx, v2 - ny],
        [u1 - nx, v1 - ny],
    ];
}

// Helper: filled dot (small square)
function dot(cx: number, cy: number, size: number): [number, number][] {
    return [
        [cx - size, cy - size], [cx + size, cy - size],
        [cx + size, cy + size], [cx - size, cy + size],
    ];
}

// Helper: filled diamond
function diamond(cx: number, cy: number, rx: number, ry: number): [number, number][] {
    return [
        [cx, cy - ry],
        [cx + rx, cy],
        [cx, cy + ry],
        [cx - rx, cy],
    ];
}

// Helper: triangle
function triangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): [number, number][] {
    return [[x1, y1], [x2, y2], [x3, y3]];
}

// Helper: thick polyline as a series of connected band segments
function thickPolyline(points: [number, number][], width: number): [number, number][][] {
    const bands: [number, number][][] = [];
    for (let i = 0; i < points.length - 1; i++) {
        const b = band(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1], width);
        if (b.length > 0) bands.push(b);
    }
    return bands;
}

const sacredPatterns: PatternSet = {
    name: 'Sacred Geometry',
    count: 5,
    draw: (type: number, { drawUV, filled, baseStyle }: PatternContext) => {
        const mainStyle = filled ? 'filled' as const : 'outline' as const;
        const detailStyle = filled ? 'opaque-outline' as const : 'filled' as const;

        switch (type) {
            case 0: { // Flower of Life — 7 overlapping thick rings
                const cx = 0.5, cy = 0.5;
                const outerR = 0.18;
                const innerR = 0.14;
                const spacing = 0.16;

                // 6 surrounding circle positions
                const positions: [number, number][] = [[cx, cy]];
                for (let i = 0; i < 6; i++) {
                    const a = (i / 6) * Math.PI * 2;
                    positions.push([cx + spacing * Math.cos(a), cy + spacing * Math.sin(a)]);
                }

                // Draw each ring as outer filled circle + inner cutout circle
                for (const [px, py] of positions) {
                    const r = ring(px, py, outerR, innerR, 28);
                    drawUV(r.outer, baseStyle);
                    drawUV(r.inner, detailStyle);
                }

                // Central filled dot
                drawUV(circle(cx, cy, 0.04, 16), filled ? baseStyle : 'filled');

                // Small accent dots at each surrounding center
                for (let i = 0; i < 6; i++) {
                    const a = (i / 6) * Math.PI * 2;
                    drawUV(dot(cx + spacing * Math.cos(a), cy + spacing * Math.sin(a), 0.02), filled ? detailStyle : 'filled');
                }

                // Outer boundary ring
                const boundR = ring(cx, cy, 0.44, 0.40, 32);
                drawUV(boundR.outer, baseStyle);
                drawUV(boundR.inner, detailStyle);

                // Corner accent diamonds
                const corners: [number, number][] = [[0.08, 0.08], [0.92, 0.08], [0.08, 0.92], [0.92, 0.92]];
                for (const [cu, cv] of corners) {
                    drawUV(diamond(cu, cv, 0.05, 0.05), 'filled');
                }

                break;
            }

            case 1: { // Seed of Life — 7 circles forming petal/vesica shapes
                const cx = 0.5, cy = 0.5;
                const petalR = 0.20;
                const spacing = 0.20;

                // Draw 6 petal/vesica shapes formed at intersections
                for (let i = 0; i < 6; i++) {
                    const a = (i / 6) * Math.PI * 2;
                    const px = cx + spacing * Math.cos(a);
                    const py = cy + spacing * Math.sin(a);

                    // Each petal: an almond shape between center and surrounding circle
                    // Approximate vesica piscis as a lens/almond polygon
                    const midX = (cx + px) / 2;
                    const midY = (cy + py) / 2;
                    const perpX = -Math.sin(a);
                    const perpY = Math.cos(a);
                    const petalWidth = 0.10;

                    const petalPts: [number, number][] = [];
                    const numPts = 16;
                    // Upper arc (from center toward surrounding)
                    for (let j = 0; j <= numPts; j++) {
                        const t = j / numPts;
                        const along = (t - 0.5) * spacing * 0.9;
                        const across = petalWidth * Math.sin(t * Math.PI);
                        petalPts.push([
                            midX + along * Math.cos(a) + across * perpX,
                            midY + along * Math.sin(a) + across * perpY,
                        ]);
                    }
                    // Lower arc (return path)
                    for (let j = numPts; j >= 0; j--) {
                        const t = j / numPts;
                        const along = (t - 0.5) * spacing * 0.9;
                        const across = -petalWidth * Math.sin(t * Math.PI);
                        petalPts.push([
                            midX + along * Math.cos(a) + across * perpX,
                            midY + along * Math.sin(a) + across * perpY,
                        ]);
                    }

                    drawUV(petalPts, baseStyle);
                }

                // Central rosette — filled hexagon
                const hexPts: [number, number][] = [];
                for (let i = 0; i < 6; i++) {
                    const a = (i / 6) * Math.PI * 2;
                    hexPts.push([cx + 0.08 * Math.cos(a), cy + 0.08 * Math.sin(a)]);
                }
                drawUV(hexPts, detailStyle);

                // Center dot
                drawUV(circle(cx, cy, 0.04, 12), filled ? baseStyle : 'filled');

                // Dots at each surrounding circle center
                for (let i = 0; i < 6; i++) {
                    const a = (i / 6) * Math.PI * 2;
                    drawUV(circle(cx + spacing * Math.cos(a), cy + spacing * Math.sin(a), 0.03, 12), 'filled');
                }

                // Outer boundary circle as thick ring
                const bnd = ring(cx, cy, 0.46, 0.42, 32);
                drawUV(bnd.outer, baseStyle);
                drawUV(bnd.inner, detailStyle);

                // Small triangular accents between petals on the boundary
                for (let i = 0; i < 6; i++) {
                    const a = ((i + 0.5) / 6) * Math.PI * 2;
                    const tipU = cx + 0.39 * Math.cos(a);
                    const tipV = cy + 0.39 * Math.sin(a);
                    const bU1 = cx + 0.44 * Math.cos(a - 0.08);
                    const bV1 = cy + 0.44 * Math.sin(a - 0.08);
                    const bU2 = cx + 0.44 * Math.cos(a + 0.08);
                    const bV2 = cy + 0.44 * Math.sin(a + 0.08);
                    drawUV(triangle(tipU, tipV, bU1, bV1, bU2, bV2), 'filled');
                }

                break;
            }

            case 2: { // Sri Yantra — interlocking upward and downward triangles
                const cx = 0.5, cy = 0.5;
                const bandW = 0.025;

                // Draw triangular bands: upward triangles (pointing up in v)
                const upTriSizes = [0.44, 0.34, 0.24, 0.14];
                const downTriSizes = [0.42, 0.32, 0.22, 0.12];

                // Upward-pointing triangles (apex at top = higher v)
                for (const sz of upTriSizes) {
                    const apex: [number, number] = [cx, cy + sz];
                    const left: [number, number] = [cx - sz * 0.95, cy - sz * 0.52];
                    const right: [number, number] = [cx + sz * 0.95, cy - sz * 0.52];

                    // Outer triangle
                    drawUV([apex, left, right], baseStyle);

                    // Inner triangle (cutout to create band effect)
                    const innerSz = sz - bandW * 2.5;
                    if (innerSz > 0.02) {
                        const iApex: [number, number] = [cx, cy + innerSz];
                        const iLeft: [number, number] = [cx - innerSz * 0.95, cy - innerSz * 0.52];
                        const iRight: [number, number] = [cx + innerSz * 0.95, cy - innerSz * 0.52];
                        drawUV([iApex, iLeft, iRight], detailStyle);
                    }
                }

                // Downward-pointing triangles (apex at bottom = lower v)
                for (const sz of downTriSizes) {
                    const apex: [number, number] = [cx, cy - sz];
                    const left: [number, number] = [cx - sz * 0.95, cy + sz * 0.52];
                    const right: [number, number] = [cx + sz * 0.95, cy + sz * 0.52];

                    drawUV([apex, left, right], baseStyle);

                    const innerSz = sz - bandW * 2.5;
                    if (innerSz > 0.02) {
                        const iApex: [number, number] = [cx, cy - innerSz];
                        const iLeft: [number, number] = [cx - innerSz * 0.95, cy + innerSz * 0.52];
                        const iRight: [number, number] = [cx + innerSz * 0.95, cy + innerSz * 0.52];
                        drawUV([iApex, iLeft, iRight], detailStyle);
                    }
                }

                // Central bindu (dot)
                drawUV(circle(cx, cy, 0.04, 12), filled ? baseStyle : 'filled');

                // Outer circle boundary
                const outerBnd = ring(cx, cy, 0.48, 0.45, 32);
                drawUV(outerBnd.outer, baseStyle);
                drawUV(outerBnd.inner, detailStyle);

                // Square gate (bhupura) — outer frame corners
                // Top
                drawUV(band(0.04, 0.04, 0.96, 0.04, 0.03), baseStyle);
                // Bottom
                drawUV(band(0.04, 0.96, 0.96, 0.96, 0.03), baseStyle);
                // Left
                drawUV(band(0.04, 0.04, 0.04, 0.96, 0.03), baseStyle);
                // Right
                drawUV(band(0.96, 0.04, 0.96, 0.96, 0.03), baseStyle);

                // Gate openings (T-shaped gates at midpoints of each side)
                if (filled) {
                    // Top gate
                    drawUV([[0.44, 0.02], [0.56, 0.02], [0.56, 0.06], [0.44, 0.06]], 'opaque-outline');
                    // Bottom gate
                    drawUV([[0.44, 0.94], [0.56, 0.94], [0.56, 0.98], [0.44, 0.98]], 'opaque-outline');
                    // Left gate
                    drawUV([[0.02, 0.44], [0.06, 0.44], [0.06, 0.56], [0.02, 0.56]], 'opaque-outline');
                    // Right gate
                    drawUV([[0.94, 0.44], [0.98, 0.44], [0.98, 0.56], [0.94, 0.56]], 'opaque-outline');
                }

                break;
            }

            case 3: { // Metatron's Cube — circles at vertices connected by thick bands
                const cx = 0.5, cy = 0.5;
                const nodeR = 0.04;
                const bandW = 0.025;

                // 13 nodes of Metatron's Cube:
                // Center + 6 inner hexagon + 6 outer hexagon
                const nodes: [number, number][] = [[cx, cy]];
                const innerR = 0.18;
                const outerR = 0.36;
                for (let i = 0; i < 6; i++) {
                    const a = (i / 6) * Math.PI * 2;
                    nodes.push([cx + innerR * Math.cos(a), cy + innerR * Math.sin(a)]);
                }
                for (let i = 0; i < 6; i++) {
                    const a = (i / 6) * Math.PI * 2;
                    nodes.push([cx + outerR * Math.cos(a), cy + outerR * Math.sin(a)]);
                }

                // Connections: every node to every other node (complete graph)
                // For visual clarity, connect center to all, inner to adjacent inner+outer, outer to adjacent outer
                // Center to all inner
                for (let i = 1; i <= 6; i++) {
                    drawUV(band(nodes[0][0], nodes[0][1], nodes[i][0], nodes[i][1], bandW), baseStyle);
                }
                // Inner ring connections
                for (let i = 0; i < 6; i++) {
                    const j = (i + 1) % 6;
                    drawUV(band(nodes[1 + i][0], nodes[1 + i][1], nodes[1 + j][0], nodes[1 + j][1], bandW), baseStyle);
                }
                // Inner to corresponding outer
                for (let i = 0; i < 6; i++) {
                    drawUV(band(nodes[1 + i][0], nodes[1 + i][1], nodes[7 + i][0], nodes[7 + i][1], bandW), baseStyle);
                }
                // Outer ring connections
                for (let i = 0; i < 6; i++) {
                    const j = (i + 1) % 6;
                    drawUV(band(nodes[7 + i][0], nodes[7 + i][1], nodes[7 + j][0], nodes[7 + j][1], bandW), baseStyle);
                }
                // Inner to adjacent outer (cross connections for cube projections)
                for (let i = 0; i < 6; i++) {
                    const j = (i + 1) % 6;
                    drawUV(band(nodes[1 + i][0], nodes[1 + i][1], nodes[7 + j][0], nodes[7 + j][1], bandW), mainStyle);
                    const k = (i + 5) % 6;
                    drawUV(band(nodes[1 + i][0], nodes[1 + i][1], nodes[7 + k][0], nodes[7 + k][1], bandW), mainStyle);
                }

                // Draw node circles on top (filled rings)
                for (const [nx, ny] of nodes) {
                    drawUV(circle(nx, ny, nodeR, 16), baseStyle);
                    drawUV(circle(nx, ny, nodeR * 0.5, 12), detailStyle);
                }

                // Outer boundary ring
                const bnd = ring(cx, cy, 0.46, 0.43, 32);
                drawUV(bnd.outer, baseStyle);
                drawUV(bnd.inner, detailStyle);

                break;
            }

            case 4: { // Vesica Piscis — two overlapping circles with filled almond intersection
                const cx = 0.5, cy = 0.5;
                const separation = 0.14;
                const circR = 0.28;
                const ringWidth = 0.03;

                // Left circle as thick ring
                const leftCx = cx - separation;
                drawUV(circle(leftCx, cy, circR, 28), baseStyle);
                drawUV(circle(leftCx, cy, circR - ringWidth, 28), detailStyle);

                // Right circle as thick ring
                const rightCx = cx + separation;
                drawUV(circle(rightCx, cy, circR, 28), baseStyle);
                drawUV(circle(rightCx, cy, circR - ringWidth, 28), detailStyle);

                // Vesica piscis (almond/mandorla shape at intersection)
                // The intersection of two circles offset by `separation` with radius `circR`
                // Approximate the almond shape
                const vesicaPts: [number, number][] = [];
                const numVPts = 24;

                // Calculate intersection points
                const d = separation * 2; // total distance between centers
                const halfChord = Math.sqrt(circR * circR - (d / 2) * (d / 2));

                // Right arc (from left circle)
                for (let i = 0; i <= numVPts; i++) {
                    const t = i / numVPts;
                    const angle = Math.atan2(halfChord, d / 2);
                    const a = -angle + t * 2 * angle;
                    vesicaPts.push([leftCx + circR * Math.cos(a), cy + circR * Math.sin(a)]);
                }
                // Left arc (from right circle, going back)
                for (let i = numVPts; i >= 0; i--) {
                    const t = i / numVPts;
                    const angle = Math.atan2(halfChord, d / 2);
                    const a = Math.PI - angle + t * 2 * angle;
                    vesicaPts.push([rightCx + circR * Math.cos(a), cy + circR * Math.sin(a)]);
                }

                drawUV(vesicaPts, filled ? baseStyle : 'filled');

                // Inner vesica decoration — smaller almond inside
                const innerVesica: [number, number][] = [];
                const innerScale = 0.65;
                for (let i = 0; i <= numVPts; i++) {
                    const t = i / numVPts;
                    const angle = Math.atan2(halfChord, d / 2);
                    const a = -angle + t * 2 * angle;
                    const r = circR * innerScale;
                    const offsetCx = leftCx + (cx - leftCx) * (1 - innerScale);
                    innerVesica.push([offsetCx + r * Math.cos(a), cy + r * Math.sin(a)]);
                }
                for (let i = numVPts; i >= 0; i--) {
                    const t = i / numVPts;
                    const angle = Math.atan2(halfChord, d / 2);
                    const a = Math.PI - angle + t * 2 * angle;
                    const r = circR * innerScale;
                    const offsetCx = rightCx + (cx - rightCx) * (1 - innerScale);
                    innerVesica.push([offsetCx + r * Math.cos(a), cy + r * Math.sin(a)]);
                }

                drawUV(innerVesica, detailStyle);

                // Central eye/seed shape inside the vesica
                drawUV(diamond(cx, cy, 0.06, 0.14), filled ? baseStyle : 'filled');
                drawUV(diamond(cx, cy, 0.03, 0.08), detailStyle);

                // Horizontal axis band through center
                drawUV(band(cx - 0.40, cy, cx + 0.40, cy, 0.02), mainStyle);

                // Vertical axis band through center
                drawUV(band(cx, cy - 0.36, cx, cy + 0.36, 0.02), mainStyle);

                // Dots at the tips of the vesica
                drawUV(circle(cx, cy - halfChord + 0.02, 0.025, 12), 'filled');
                drawUV(circle(cx, cy + halfChord - 0.02, 0.025, 12), 'filled');

                // Dots at the outer extents of each circle
                drawUV(circle(leftCx - circR + 0.02, cy, 0.025, 12), 'filled');
                drawUV(circle(rightCx + circR - 0.02, cy, 0.025, 12), 'filled');

                // Decorative triangles at cardinal points
                drawUV(triangle(cx, 0.04, cx - 0.04, 0.10, cx + 0.04, 0.10), 'filled');
                drawUV(triangle(cx, 0.96, cx - 0.04, 0.90, cx + 0.04, 0.90), 'filled');
                drawUV(triangle(0.04, cy, 0.10, cy - 0.04, 0.10, cy + 0.04), 'filled');
                drawUV(triangle(0.96, cy, 0.90, cy - 0.04, 0.90, cy + 0.04), 'filled');

                break;
            }
        }
    }
};

export default sacredPatterns;
