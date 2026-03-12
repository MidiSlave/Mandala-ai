import type { PatternSet, PatternContext } from './types';

// Helper: filled rectangle
function rect(u1: number, v1: number, u2: number, v2: number): [number, number][] {
    return [[u1, v1], [u2, v1], [u2, v2], [u1, v2]];
}

// Helper: diamond
function diamond(cx: number, cy: number, rx: number, ry: number): [number, number][] {
    return [[cx, cy - ry], [cx + rx, cy], [cx, cy + ry], [cx - rx, cy]];
}

// Helper: circle polygon
function circle(cx: number, cy: number, r: number, n: number = 20): [number, number][] {
    const pts: [number, number][] = [];
    for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    return pts;
}

// Helper: lens/eye shape — pointed at ends, bulging in middle
function eyeShape(cx: number, cy: number, width: number, height: number, n: number = 16): [number, number][] {
    const pts: [number, number][] = [];
    // Upper arc
    for (let i = 0; i <= n; i++) {
        const t = i / n;
        const u = cx - width / 2 + t * width;
        const v = cy - height * Math.sin(t * Math.PI);
        pts.push([u, v]);
    }
    // Lower arc (return)
    for (let i = n; i >= 0; i--) {
        const t = i / n;
        const u = cx - width / 2 + t * width;
        const v = cy + height * Math.sin(t * Math.PI);
        pts.push([u, v]);
    }
    return pts;
}

// Helper: thick band between two points
function band(u1: number, v1: number, u2: number, v2: number, w: number): [number, number][] {
    const dx = u2 - u1;
    const dy = v2 - v1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return [[u1, v1]];
    const nx = (-dy / len) * w * 0.5;
    const ny = (dx / len) * w * 0.5;
    return [[u1 + nx, v1 + ny], [u2 + nx, v2 + ny], [u2 - nx, v2 - ny], [u1 - nx, v1 - ny]];
}

const egyptianPatterns: PatternSet = {
    name: 'Egyptian / Hieroglyph',
    count: 5,
    draw: (type: number, { drawUV, filled, baseStyle }: PatternContext) => {
        const mainStyle = filled ? 'filled' as const : 'outline' as const;
        const detailStyle = filled ? 'opaque-outline' as const : 'filled' as const;

        switch (type) {
            case 0: { // Eye of Horus — bold almond eye with decorative tearline
                const cx = 0.5, cy = 0.5;

                // Border bands top and bottom
                drawUV(rect(0.0, 0.0, 1.0, 0.06), baseStyle);
                drawUV(rect(0.0, 0.94, 1.0, 1.0), baseStyle);

                // Triangle teeth along top border
                for (let i = 0; i < 8; i++) {
                    const x = 0.0625 + i * 0.125;
                    drawUV([[x - 0.04, 0.06], [x + 0.04, 0.06], [x, 0.14]], baseStyle);
                }

                // Main eye shape — bold almond
                const eye = eyeShape(cx, cy, 0.70, 0.18, 20);
                drawUV(eye, baseStyle);

                // Inner eye cutout (white of the eye)
                const innerEye = eyeShape(cx, cy, 0.54, 0.12, 16);
                drawUV(innerEye, detailStyle);

                // Iris — filled circle
                drawUV(circle(cx, cy, 0.09, 16), filled ? baseStyle : 'filled');

                // Pupil — small contrasting circle
                drawUV(circle(cx, cy, 0.04, 12), detailStyle);

                // Highlight dot
                drawUV(circle(cx + 0.02, cy - 0.02, 0.015, 8), filled ? baseStyle : 'filled');

                // Decorative tear line dropping down from eye (Eye of Horus style)
                // Curved line dropping down-left from bottom of eye
                const tearPts: [number, number][] = [];
                const tearN = 12;
                for (let i = 0; i <= tearN; i++) {
                    const t = i / tearN;
                    const tx = cx - 0.05 - t * 0.10;
                    const ty = cy + 0.12 + t * 0.25;
                    tearPts.push([tx, ty]);
                }
                // Return path (offset for width)
                for (let i = tearN; i >= 0; i--) {
                    const t = i / tearN;
                    const tx = cx - 0.05 - t * 0.10 + 0.035;
                    const ty = cy + 0.12 + t * 0.25;
                    tearPts.push([tx, ty]);
                }
                drawUV(tearPts, baseStyle);

                // Spiral curl at tear bottom
                drawUV(circle(cx - 0.16, cy + 0.40, 0.035, 12), baseStyle);
                drawUV(circle(cx - 0.16, cy + 0.40, 0.015, 8), detailStyle);

                // Eyebrow line (thick arc above eye)
                const browPts: [number, number][] = [];
                for (let i = 0; i <= 16; i++) {
                    const t = i / 16;
                    const u = cx - 0.38 + t * 0.76;
                    const v = cy - 0.22 - 0.06 * Math.sin(t * Math.PI);
                    browPts.push([u, v]);
                }
                for (let i = 16; i >= 0; i--) {
                    const t = i / 16;
                    const u = cx - 0.38 + t * 0.76;
                    const v = cy - 0.18 - 0.04 * Math.sin(t * Math.PI);
                    browPts.push([u, v]);
                }
                drawUV(browPts, mainStyle);

                // Small triangles decorating the bottom border
                for (let i = 0; i < 8; i++) {
                    const x = 0.0625 + i * 0.125;
                    drawUV([[x - 0.04, 0.94], [x + 0.04, 0.94], [x, 0.86]], baseStyle);
                }

                break;
            }

            case 1: { // Lotus/Papyrus Column — scalloped petal shapes
                const cx = 0.5;

                // Base pedestal
                drawUV(rect(0.15, 0.80, 0.85, 0.88), baseStyle);
                drawUV(rect(0.20, 0.88, 0.80, 0.94), detailStyle);
                drawUV(rect(0.10, 0.94, 0.90, 1.0), baseStyle);

                // Central stem
                drawUV(rect(0.42, 0.30, 0.58, 0.80), baseStyle);
                drawUV(rect(0.45, 0.35, 0.55, 0.78), detailStyle);

                // Lotus flower head — multiple overlapping petals
                // Back petals (wider, shorter)
                for (let i = -2; i <= 2; i++) {
                    const angle = i * 0.28;
                    const petalW = 0.10;
                    const petalH = 0.28;
                    const basePtY = 0.34;
                    const tipY = basePtY - petalH;
                    const petalCx = cx + Math.sin(angle) * 0.18;

                    const pts: [number, number][] = [];
                    const n = 12;
                    for (let j = 0; j <= n; j++) {
                        const t = j / n;
                        const y = basePtY - t * petalH;
                        const bulge = petalW * Math.sin(t * Math.PI) * (1 - t * 0.3);
                        pts.push([petalCx - bulge, y]);
                    }
                    for (let j = n; j >= 0; j--) {
                        const t = j / n;
                        const y = basePtY - t * petalH;
                        const bulge = petalW * Math.sin(t * Math.PI) * (1 - t * 0.3);
                        pts.push([petalCx + bulge, y]);
                    }
                    drawUV(pts, i % 2 === 0 ? baseStyle : detailStyle);
                }

                // Central petal (tallest, on top)
                {
                    const pts: [number, number][] = [];
                    const n = 14;
                    for (let j = 0; j <= n; j++) {
                        const t = j / n;
                        const y = 0.34 - t * 0.32;
                        const bulge = 0.08 * Math.sin(t * Math.PI) * (1 - t * 0.4);
                        pts.push([cx - bulge, y]);
                    }
                    for (let j = n; j >= 0; j--) {
                        const t = j / n;
                        const y = 0.34 - t * 0.32;
                        const bulge = 0.08 * Math.sin(t * Math.PI) * (1 - t * 0.4);
                        pts.push([cx + bulge, y]);
                    }
                    drawUV(pts, filled ? baseStyle : 'filled');
                }

                // Top border band
                drawUV(rect(0.0, 0.0, 1.0, 0.04), baseStyle);

                // Side decorative bands
                drawUV(rect(0.0, 0.0, 0.06, 1.0), mainStyle);
                drawUV(rect(0.94, 0.0, 1.0, 1.0), mainStyle);

                break;
            }

            case 2: { // Triangle Teeth & Zigzag — bold horizontal bands
                // Top thick band
                drawUV(rect(0.0, 0.0, 1.0, 0.06), baseStyle);

                // Row of downward-pointing triangles
                for (let i = 0; i < 6; i++) {
                    const x = (i + 0.5) / 6;
                    drawUV([
                        [x - 0.07, 0.06], [x + 0.07, 0.06], [x, 0.18]
                    ], baseStyle);
                }

                // Thin separator
                drawUV(rect(0.0, 0.19, 1.0, 0.22), mainStyle);

                // Zigzag band (thick)
                {
                    const zigW = 0.05;
                    const zigPeaks = 5;
                    const topV = 0.24;
                    const botV = 0.38;
                    const midV = (topV + botV) / 2;

                    for (let i = 0; i < zigPeaks; i++) {
                        const x1 = i / zigPeaks;
                        const x2 = (i + 0.5) / zigPeaks;
                        const x3 = (i + 1) / zigPeaks;

                        // Each zig segment as a thick filled chevron
                        drawUV([
                            [x1, midV - zigW], [x2, topV], [x2 + 0.01, topV],
                            [x1 + 0.02, midV],
                        ], baseStyle);
                        drawUV([
                            [x2, topV], [x3, midV - zigW], [x3, midV + zigW],
                            [x2, topV + zigW * 2],
                        ], baseStyle);
                        drawUV([
                            [x1, midV + zigW], [x2, botV], [x2 + 0.02, botV],
                            [x1 + 0.02, midV],
                        ], baseStyle);
                        drawUV([
                            [x2, botV], [x3, midV + zigW], [x3, midV - zigW],
                            [x2, botV - zigW * 2],
                        ], baseStyle);
                    }
                }

                // Separator
                drawUV(rect(0.0, 0.40, 1.0, 0.43), mainStyle);

                // Row of upward-pointing triangles (alternating filled/detail)
                for (let i = 0; i < 6; i++) {
                    const x = (i + 0.5) / 6;
                    drawUV([
                        [x - 0.07, 0.56], [x + 0.07, 0.56], [x, 0.43]
                    ], i % 2 === 0 ? baseStyle : detailStyle);
                }

                // Diamond chain row
                drawUV(rect(0.0, 0.57, 1.0, 0.60), mainStyle);
                for (let i = 0; i < 5; i++) {
                    const x = 0.1 + i * 0.2;
                    drawUV(diamond(x, 0.68, 0.08, 0.07), baseStyle);
                    drawUV(diamond(x, 0.68, 0.04, 0.035), detailStyle);
                }
                drawUV(rect(0.0, 0.76, 1.0, 0.79), mainStyle);

                // Bottom row: bold oval eye shapes
                for (let i = 0; i < 4; i++) {
                    const x = 0.125 + i * 0.25;
                    const eye = eyeShape(x, 0.87, 0.18, 0.055, 12);
                    drawUV(eye, baseStyle);
                    drawUV(circle(x, 0.87, 0.025, 10), detailStyle);
                }

                // Bottom band
                drawUV(rect(0.0, 0.94, 1.0, 1.0), baseStyle);

                break;
            }

            case 3: { // Scarab/Rosette — circular flower with radiating petals
                const cx = 0.5, cy = 0.5;

                // Outer ring
                drawUV(circle(cx, cy, 0.46, 28), baseStyle);
                drawUV(circle(cx, cy, 0.40, 24), detailStyle);

                // Radiating petals (like a lotus rosette / scarab wings)
                const numPetals = 8;
                for (let i = 0; i < numPetals; i++) {
                    const angle = (i / numPetals) * Math.PI * 2;
                    const perpA = angle + Math.PI / 2;
                    const petalLen = 0.30;
                    const petalW = 0.07;

                    const pts: [number, number][] = [];
                    const n = 12;
                    for (let j = 0; j <= n; j++) {
                        const t = j / n;
                        const r = 0.08 + t * petalLen;
                        const bulge = petalW * Math.sin(t * Math.PI);
                        pts.push([
                            cx + r * Math.cos(angle) + bulge * Math.cos(perpA),
                            cy + r * Math.sin(angle) + bulge * Math.sin(perpA),
                        ]);
                    }
                    for (let j = n; j >= 0; j--) {
                        const t = j / n;
                        const r = 0.08 + t * petalLen;
                        const bulge = petalW * Math.sin(t * Math.PI);
                        pts.push([
                            cx + r * Math.cos(angle) - bulge * Math.cos(perpA),
                            cy + r * Math.sin(angle) - bulge * Math.sin(perpA),
                        ]);
                    }
                    drawUV(pts, i % 2 === 0 ? baseStyle : mainStyle);
                }

                // Inner ring between petals
                drawUV(circle(cx, cy, 0.14, 20), baseStyle);
                drawUV(circle(cx, cy, 0.10, 16), detailStyle);

                // Center dot
                drawUV(circle(cx, cy, 0.06, 12), filled ? baseStyle : 'filled');
                drawUV(circle(cx, cy, 0.025, 10), detailStyle);

                // Small triangles between petals at the outer ring
                for (let i = 0; i < numPetals; i++) {
                    const angle = ((i + 0.5) / numPetals) * Math.PI * 2;
                    drawUV([
                        [cx + 0.36 * Math.cos(angle), cy + 0.36 * Math.sin(angle)],
                        [cx + 0.42 * Math.cos(angle - 0.12), cy + 0.42 * Math.sin(angle - 0.12)],
                        [cx + 0.42 * Math.cos(angle + 0.12), cy + 0.42 * Math.sin(angle + 0.12)],
                    ], detailStyle);
                }

                // Corner accent dots
                drawUV(circle(0.08, 0.08, 0.04, 10), 'filled');
                drawUV(circle(0.92, 0.08, 0.04, 10), 'filled');
                drawUV(circle(0.08, 0.92, 0.04, 10), 'filled');
                drawUV(circle(0.92, 0.92, 0.04, 10), 'filled');

                break;
            }

            case 4: { // Ankh / Hieroglyph — bold ankh symbol with decorative borders
                const cx = 0.5;

                // Side border bands
                drawUV(rect(0.0, 0.0, 0.06, 1.0), baseStyle);
                drawUV(rect(0.94, 0.0, 1.0, 1.0), baseStyle);

                // Top border with small diamonds
                drawUV(rect(0.0, 0.0, 1.0, 0.05), baseStyle);
                for (let i = 0; i < 6; i++) {
                    const x = 0.10 + i * 0.16;
                    drawUV(diamond(x, 0.10, 0.03, 0.04), 'filled');
                }

                // Ankh loop (teardrop/oval at top)
                const loopPts: [number, number][] = [];
                const loopN = 24;
                for (let i = 0; i <= loopN; i++) {
                    const a = (i / loopN) * Math.PI * 2;
                    const rx = 0.14;
                    const ry = 0.16;
                    loopPts.push([cx + rx * Math.cos(a), 0.30 + ry * Math.sin(a)]);
                }
                drawUV(loopPts, baseStyle);

                // Loop hole (inner)
                const holeN = 20;
                const holePts: [number, number][] = [];
                for (let i = 0; i <= holeN; i++) {
                    const a = (i / holeN) * Math.PI * 2;
                    holePts.push([cx + 0.07 * Math.cos(a), 0.30 + 0.09 * Math.sin(a)]);
                }
                drawUV(holePts, detailStyle);

                // Crossbar (horizontal arms)
                drawUV(rect(0.18, 0.44, 0.82, 0.52), baseStyle);
                drawUV(rect(0.22, 0.46, 0.78, 0.50), detailStyle);

                // Vertical staff (below crossbar)
                drawUV(rect(0.40, 0.52, 0.60, 0.88), baseStyle);
                drawUV(rect(0.44, 0.55, 0.56, 0.85), detailStyle);

                // Staff base
                drawUV(rect(0.32, 0.88, 0.68, 0.94), baseStyle);

                // Bottom border
                drawUV(rect(0.0, 0.95, 1.0, 1.0), baseStyle);

                // Decorative wings flanking the ankh
                // Left wing
                for (let i = 0; i < 4; i++) {
                    const baseX = 0.18 - i * 0.02;
                    const y = 0.38 + i * 0.03;
                    const featherPts: [number, number][] = [];
                    const fn = 8;
                    for (let j = 0; j <= fn; j++) {
                        const t = j / fn;
                        featherPts.push([baseX - t * 0.10, y - 0.02 * Math.sin(t * Math.PI)]);
                    }
                    for (let j = fn; j >= 0; j--) {
                        const t = j / fn;
                        featherPts.push([baseX - t * 0.10, y + 0.015 * Math.sin(t * Math.PI)]);
                    }
                    drawUV(featherPts, i % 2 === 0 ? baseStyle : mainStyle);
                }
                // Right wing (mirror)
                for (let i = 0; i < 4; i++) {
                    const baseX = 0.82 + i * 0.02;
                    const y = 0.38 + i * 0.03;
                    const featherPts: [number, number][] = [];
                    const fn = 8;
                    for (let j = 0; j <= fn; j++) {
                        const t = j / fn;
                        featherPts.push([baseX + t * 0.10, y - 0.02 * Math.sin(t * Math.PI)]);
                    }
                    for (let j = fn; j >= 0; j--) {
                        const t = j / fn;
                        featherPts.push([baseX + t * 0.10, y + 0.015 * Math.sin(t * Math.PI)]);
                    }
                    drawUV(featherPts, i % 2 === 0 ? baseStyle : mainStyle);
                }

                // Small ankh symbols at bottom corners
                for (const sx of [0.18, 0.82]) {
                    // Mini loop
                    const miniLoop: [number, number][] = [];
                    for (let i = 0; i < 12; i++) {
                        const a = (i / 12) * Math.PI * 2;
                        miniLoop.push([sx + 0.04 * Math.cos(a), 0.78 + 0.05 * Math.sin(a)]);
                    }
                    drawUV(miniLoop, 'filled');
                    // Mini crossbar
                    drawUV(rect(sx - 0.06, 0.82, sx + 0.06, 0.84), 'filled');
                    // Mini staff
                    drawUV(rect(sx - 0.02, 0.84, sx + 0.02, 0.92), 'filled');
                }

                break;
            }
        }
    }
};

export default egyptianPatterns;
