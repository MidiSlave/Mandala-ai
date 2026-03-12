import type { PatternSet, PatternContext } from './types';

// Helper: filled circle polygon
function circle(cx: number, cy: number, r: number, n: number = 28): [number, number][] {
    const pts: [number, number][] = [];
    for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    return pts;
}

// Helper: thick band between two points
function band(u1: number, v1: number, u2: number, v2: number, width: number): [number, number][] {
    const dx = u2 - u1;
    const dy = v2 - v1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return [[u1, v1]];
    const nx = (-dy / len) * width * 0.5;
    const ny = (dx / len) * width * 0.5;
    return [
        [u1 + nx, v1 + ny], [u2 + nx, v2 + ny],
        [u2 - nx, v2 - ny], [u1 - nx, v1 - ny],
    ];
}

// Helper: filled diamond
function diamond(cx: number, cy: number, rx: number, ry: number): [number, number][] {
    return [[cx, cy - ry], [cx + rx, cy], [cx, cy + ry], [cx - rx, cy]];
}

// Helper: arc band (thick arc segment)
function arcBand(cx: number, cy: number, innerR: number, outerR: number,
    startA: number, endA: number, n: number = 24): [number, number][] {
    const pts: [number, number][] = [];
    for (let i = 0; i <= n; i++) {
        const a = startA + (i / n) * (endA - startA);
        pts.push([cx + outerR * Math.cos(a), cy + outerR * Math.sin(a)]);
    }
    for (let i = n; i >= 0; i--) {
        const a = startA + (i / n) * (endA - startA);
        pts.push([cx + innerR * Math.cos(a), cy + innerR * Math.sin(a)]);
    }
    return pts;
}

// Helper: vesica/almond shape between two circle centers
function vesica(cx1: number, cy1: number, cx2: number, cy2: number, r: number, n: number = 20): [number, number][] {
    const dx = cx2 - cx1;
    const dy = cy2 - cy1;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d >= 2 * r || d === 0) return [];
    const baseAngle = Math.atan2(dy, dx);
    const halfAngle = Math.acos(d / (2 * r));
    const pts: [number, number][] = [];
    // Arc from circle 1
    for (let i = 0; i <= n; i++) {
        const a = baseAngle - halfAngle + (i / n) * 2 * halfAngle;
        pts.push([cx1 + r * Math.cos(a), cy1 + r * Math.sin(a)]);
    }
    // Arc from circle 2 (return)
    for (let i = 0; i <= n; i++) {
        const a = baseAngle + Math.PI + halfAngle - (i / n) * 2 * halfAngle;
        pts.push([cx2 + r * Math.cos(a), cy2 + r * Math.sin(a)]);
    }
    return pts;
}

const sacredPatterns: PatternSet = {
    name: 'Sacred Geometry',
    count: 5,
    draw: (type: number, { drawUV, filled, baseStyle }: PatternContext) => {
        const mainStyle = filled ? 'filled' as const : 'outline' as const;
        const detailStyle = filled ? 'opaque-outline' as const : 'filled' as const;

        switch (type) {
            case 0: { // Flower of Life — bold overlapping petal shapes
                const cx = 0.5, cy = 0.5;
                const r = 0.22;
                const spacing = 0.20;

                // Background circle
                drawUV(circle(cx, cy, 0.46, 32), baseStyle);
                drawUV(circle(cx, cy, 0.42, 32), detailStyle);

                // 7 circle positions
                const positions: [number, number][] = [[cx, cy]];
                for (let i = 0; i < 6; i++) {
                    const a = (i / 6) * Math.PI * 2;
                    positions.push([cx + spacing * Math.cos(a), cy + spacing * Math.sin(a)]);
                }

                // Draw the vesica/petal shapes at every intersection — these are the "flowers"
                for (let i = 0; i < 6; i++) {
                    // Between center and each surrounding circle
                    const v = vesica(cx, cy, positions[i + 1][0], positions[i + 1][1], r, 16);
                    if (v.length > 0) drawUV(v, filled ? 'filled' : 'outline');
                }

                // Petals between adjacent surrounding circles
                for (let i = 0; i < 6; i++) {
                    const j = (i + 1) % 6;
                    const v = vesica(positions[i + 1][0], positions[i + 1][1], positions[j + 1][0], positions[j + 1][1], r, 16);
                    if (v.length > 0) drawUV(v, detailStyle);
                }

                // Bold center flower
                drawUV(circle(cx, cy, 0.08, 16), filled ? baseStyle : 'filled');
                drawUV(circle(cx, cy, 0.04, 12), detailStyle);

                // Dots at surrounding circle centers
                for (let i = 1; i < 7; i++) {
                    drawUV(circle(positions[i][0], positions[i][1], 0.03, 12), filled ? detailStyle : 'filled');
                }

                // Corner wedges filling the outer ring
                for (let i = 0; i < 12; i++) {
                    const a = (i / 12) * Math.PI * 2;
                    const a2 = ((i + 0.5) / 12) * Math.PI * 2;
                    drawUV([
                        [cx + 0.42 * Math.cos(a), cy + 0.42 * Math.sin(a)],
                        [cx + 0.46 * Math.cos(a2), cy + 0.46 * Math.sin(a2)],
                        [cx + 0.42 * Math.cos(a2 + (0.5 / 12) * Math.PI * 2), cy + 0.42 * Math.sin(a2 + (0.5 / 12) * Math.PI * 2)],
                    ], 'filled');
                }

                break;
            }

            case 1: { // Seed of Life — bold six-petal rosette
                const cx = 0.5, cy = 0.5;
                const r = 0.24;
                const spacing = 0.22;

                // Background frame
                drawUV(circle(cx, cy, 0.46, 32), baseStyle);
                drawUV(circle(cx, cy, 0.40, 32), detailStyle);

                // 6 bold petal shapes radiating from center
                for (let i = 0; i < 6; i++) {
                    const a = (i / 6) * Math.PI * 2;
                    const px = cx + spacing * 0.5 * Math.cos(a);
                    const py = cy + spacing * 0.5 * Math.sin(a);

                    // Each petal is an almond/lens shape
                    const petalPts: [number, number][] = [];
                    const n = 16;
                    const perpA = a + Math.PI / 2;
                    const petalLen = 0.28;
                    const petalW = 0.12;

                    // One side of petal
                    for (let j = 0; j <= n; j++) {
                        const t = j / n;
                        const along = (t - 0.5) * petalLen;
                        const across = petalW * Math.sin(t * Math.PI);
                        petalPts.push([
                            cx + along * Math.cos(a) + across * Math.cos(perpA),
                            cy + along * Math.sin(a) + across * Math.sin(perpA),
                        ]);
                    }
                    // Other side (return)
                    for (let j = n; j >= 0; j--) {
                        const t = j / n;
                        const along = (t - 0.5) * petalLen;
                        const across = -petalW * Math.sin(t * Math.PI);
                        petalPts.push([
                            cx + along * Math.cos(a) + across * Math.cos(perpA),
                            cy + along * Math.sin(a) + across * Math.sin(perpA),
                        ]);
                    }

                    drawUV(petalPts, baseStyle);

                    // Inner petal (smaller, for detail)
                    const innerPetalPts: [number, number][] = [];
                    const iLen = petalLen * 0.6;
                    const iW = petalW * 0.5;
                    for (let j = 0; j <= n; j++) {
                        const t = j / n;
                        const along = (t - 0.5) * iLen;
                        const across = iW * Math.sin(t * Math.PI);
                        innerPetalPts.push([
                            cx + along * Math.cos(a) + across * Math.cos(perpA),
                            cy + along * Math.sin(a) + across * Math.sin(perpA),
                        ]);
                    }
                    for (let j = n; j >= 0; j--) {
                        const t = j / n;
                        const along = (t - 0.5) * iLen;
                        const across = -iW * Math.sin(t * Math.PI);
                        innerPetalPts.push([
                            cx + along * Math.cos(a) + across * Math.cos(perpA),
                            cy + along * Math.sin(a) + across * Math.sin(perpA),
                        ]);
                    }
                    drawUV(innerPetalPts, detailStyle);
                }

                // Center: bold hexagonal rosette
                const hexOuter: [number, number][] = [];
                const hexInner: [number, number][] = [];
                for (let i = 0; i < 6; i++) {
                    const a = (i / 6) * Math.PI * 2;
                    hexOuter.push([cx + 0.10 * Math.cos(a), cy + 0.10 * Math.sin(a)]);
                    hexInner.push([cx + 0.05 * Math.cos(a), cy + 0.05 * Math.sin(a)]);
                }
                drawUV(hexOuter, filled ? detailStyle : baseStyle);
                drawUV(hexInner, filled ? baseStyle : 'filled');

                // Dots at petal tips
                for (let i = 0; i < 6; i++) {
                    const a = (i / 6) * Math.PI * 2;
                    drawUV(circle(cx + 0.32 * Math.cos(a), cy + 0.32 * Math.sin(a), 0.025, 10), 'filled');
                }

                break;
            }

            case 2: { // Sri Yantra — interlocking triangular bands
                const cx = 0.5, cy = 0.5;

                // Outer boundary thick ring
                drawUV(arcBand(cx, cy, 0.42, 0.47, 0, Math.PI * 2, 32), baseStyle);

                // Square bhupura frame
                const bw = 0.04;
                drawUV([[0.02, 0.02], [0.98, 0.02], [0.98, 0.02 + bw], [0.02, 0.02 + bw]], baseStyle);
                drawUV([[0.02, 0.98 - bw], [0.98, 0.98 - bw], [0.98, 0.98], [0.02, 0.98]], baseStyle);
                drawUV([[0.02, 0.02], [0.02 + bw, 0.02], [0.02 + bw, 0.98], [0.02, 0.98]], baseStyle);
                drawUV([[0.98 - bw, 0.02], [0.98, 0.02], [0.98, 0.98], [0.98 - bw, 0.98]], baseStyle);

                // Gate openings (opaque-outline cutouts at midpoints)
                drawUV([[0.40, 0.01], [0.60, 0.01], [0.60, 0.07], [0.40, 0.07]], detailStyle);
                drawUV([[0.40, 0.93], [0.60, 0.93], [0.60, 0.99], [0.40, 0.99]], detailStyle);
                drawUV([[0.01, 0.40], [0.07, 0.40], [0.07, 0.60], [0.01, 0.60]], detailStyle);
                drawUV([[0.93, 0.40], [0.99, 0.40], [0.99, 0.60], [0.93, 0.60]], detailStyle);

                // 4 upward triangles (bold, getting smaller)
                const upSizes = [0.40, 0.30, 0.20, 0.12];
                const tw = 0.035; // triangle band width
                for (const sz of upSizes) {
                    const apex: [number, number] = [cx, cy - sz * 0.85];
                    const left: [number, number] = [cx - sz, cy + sz * 0.55];
                    const right: [number, number] = [cx + sz, cy + sz * 0.55];
                    drawUV([apex, left, right], baseStyle);

                    const isz = sz - tw * 2;
                    if (isz > 0.03) {
                        const iApex: [number, number] = [cx, cy - isz * 0.85];
                        const iLeft: [number, number] = [cx - isz, cy + isz * 0.55];
                        const iRight: [number, number] = [cx + isz, cy + isz * 0.55];
                        drawUV([iApex, iLeft, iRight], detailStyle);
                    }
                }

                // 4 downward triangles (inverted)
                const downSizes = [0.38, 0.28, 0.18, 0.10];
                for (const sz of downSizes) {
                    const apex: [number, number] = [cx, cy + sz * 0.85];
                    const left: [number, number] = [cx - sz, cy - sz * 0.55];
                    const right: [number, number] = [cx + sz, cy - sz * 0.55];
                    drawUV([apex, left, right], baseStyle);

                    const isz = sz - tw * 2;
                    if (isz > 0.03) {
                        const iApex: [number, number] = [cx, cy + isz * 0.85];
                        const iLeft: [number, number] = [cx - isz, cy - isz * 0.55];
                        const iRight: [number, number] = [cx + isz, cy - isz * 0.55];
                        drawUV([iApex, iLeft, iRight], detailStyle);
                    }
                }

                // Central bindu — bold filled dot
                drawUV(circle(cx, cy, 0.05, 16), filled ? baseStyle : 'filled');
                drawUV(circle(cx, cy, 0.025, 12), detailStyle);

                break;
            }

            case 3: { // Metatron's Cube — bold nodes with thick connections
                const cx = 0.5, cy = 0.5;
                const bandW = 0.04;
                const nodeR = 0.055;

                // 13 nodes
                const nodes: [number, number][] = [[cx, cy]];
                const innerHex = 0.17;
                const outerHex = 0.34;
                for (let i = 0; i < 6; i++) {
                    const a = (i / 6) * Math.PI * 2;
                    nodes.push([cx + innerHex * Math.cos(a), cy + innerHex * Math.sin(a)]);
                }
                for (let i = 0; i < 6; i++) {
                    const a = (i / 6) * Math.PI * 2;
                    nodes.push([cx + outerHex * Math.cos(a), cy + outerHex * Math.sin(a)]);
                }

                // Outer boundary
                drawUV(arcBand(cx, cy, 0.43, 0.47, 0, Math.PI * 2, 32), baseStyle);

                // All connections as thick bands
                // Center to inner ring
                for (let i = 1; i <= 6; i++) {
                    drawUV(band(nodes[0][0], nodes[0][1], nodes[i][0], nodes[i][1], bandW), baseStyle);
                }
                // Inner ring connections
                for (let i = 0; i < 6; i++) {
                    const j = (i + 1) % 6;
                    drawUV(band(nodes[1 + i][0], nodes[1 + i][1], nodes[1 + j][0], nodes[1 + j][1], bandW), baseStyle);
                }
                // Inner to outer (radial)
                for (let i = 0; i < 6; i++) {
                    drawUV(band(nodes[1 + i][0], nodes[1 + i][1], nodes[7 + i][0], nodes[7 + i][1], bandW), baseStyle);
                }
                // Outer ring connections
                for (let i = 0; i < 6; i++) {
                    const j = (i + 1) % 6;
                    drawUV(band(nodes[7 + i][0], nodes[7 + i][1], nodes[7 + j][0], nodes[7 + j][1], bandW), baseStyle);
                }
                // Cross connections (inner to adjacent outer) — for cube projection
                for (let i = 0; i < 6; i++) {
                    const j = (i + 1) % 6;
                    drawUV(band(nodes[1 + i][0], nodes[1 + i][1], nodes[7 + j][0], nodes[7 + j][1], bandW * 0.7), mainStyle);
                }

                // Bold node circles on top
                for (const [nx, ny] of nodes) {
                    drawUV(circle(nx, ny, nodeR, 16), baseStyle);
                    drawUV(circle(nx, ny, nodeR * 0.45, 12), detailStyle);
                }

                // Extra: hexagonal fill between inner and outer rings
                for (let i = 0; i < 6; i++) {
                    const a = ((i + 0.5) / 6) * Math.PI * 2;
                    drawUV(diamond(
                        cx + 0.26 * Math.cos(a), cy + 0.26 * Math.sin(a),
                        0.03, 0.03
                    ), 'filled');
                }

                break;
            }

            case 4: { // Vesica Piscis — bold overlapping circles with solid almond
                const cx = 0.5, cy = 0.5;
                const sep = 0.12;
                const r = 0.30;
                const ringW = 0.05;

                // Left circle (thick ring)
                drawUV(circle(cx - sep, cy, r, 32), baseStyle);
                drawUV(circle(cx - sep, cy, r - ringW, 28), detailStyle);

                // Right circle (thick ring)
                drawUV(circle(cx + sep, cy, r, 32), baseStyle);
                drawUV(circle(cx + sep, cy, r - ringW, 28), detailStyle);

                // Vesica piscis (almond intersection) — bold filled
                const vPts = vesica(cx - sep, cy, cx + sep, cy, r, 20);
                if (vPts.length > 0) {
                    drawUV(vPts, filled ? baseStyle : 'filled');

                    // Inner vesica cutout
                    const innerV = vesica(cx - sep, cy, cx + sep, cy, r * 0.75, 16);
                    if (innerV.length > 0) drawUV(innerV, detailStyle);
                }

                // Central eye diamond
                drawUV(diamond(cx, cy, 0.08, 0.18), filled ? baseStyle : 'filled');
                drawUV(diamond(cx, cy, 0.04, 0.10), detailStyle);

                // Bold axis cross
                drawUV(band(0.05, cy, 0.95, cy, 0.03), baseStyle);
                drawUV(band(cx, 0.10, cx, 0.90, 0.03), baseStyle);

                // Filled crescents at top and bottom
                for (let sign = -1; sign <= 1; sign += 2) {
                    const tipY = cy + sign * 0.26;
                    drawUV(circle(cx, tipY, 0.04, 12), 'filled');
                }

                // Corner accent triangles
                const triSize = 0.06;
                drawUV([[0.04, 0.04], [0.04 + triSize, 0.04], [0.04, 0.04 + triSize]], 'filled');
                drawUV([[0.96, 0.04], [0.96 - triSize, 0.04], [0.96, 0.04 + triSize]], 'filled');
                drawUV([[0.04, 0.96], [0.04 + triSize, 0.96], [0.04, 0.96 - triSize]], 'filled');
                drawUV([[0.96, 0.96], [0.96 - triSize, 0.96], [0.96, 0.96 - triSize]], 'filled');

                break;
            }
        }
    }
};

export default sacredPatterns;
