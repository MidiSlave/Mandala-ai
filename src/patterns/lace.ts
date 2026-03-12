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

/** Small diamond centered at (cx, cy). */
function diamond(cx: number, cy: number, s: number): [number, number][] {
    return [
        [cx, cy - s],
        [cx + s, cy],
        [cx, cy + s],
        [cx - s, cy],
    ];
}

/** Generate a teardrop shape: pointed at (px, py), bulging toward (bx, by) with given width. */
function teardrop(
    px: number, py: number,
    bx: number, by: number,
    width: number, segments: number
): [number, number][] {
    const pts: [number, number][] = [];
    // Direction from point to bulge
    const dx = bx - px;
    const dy = by - py;
    const len = Math.sqrt(dx * dx + dy * dy);
    // Normal perpendicular to direction
    const nx = -dy / len;
    const ny = dx / len;

    // Start at the point
    pts.push([px, py]);

    // Build one side curving out to widest at ~60% along length, then curving to the tip
    const count = segments;
    for (let i = 1; i <= count; i++) {
        const t = i / count;
        // Width envelope: sine-based bulge peaking around t=0.6
        const w = width * Math.sin(Math.PI * Math.pow(t, 0.7));
        const cx = px + dx * t;
        const cy = py + dy * t;
        pts.push([cx + nx * w, cy + ny * w]);
    }
    // Come back on the other side
    for (let i = count - 1; i >= 1; i--) {
        const t = i / count;
        const w = width * Math.sin(Math.PI * Math.pow(t, 0.7));
        const cx = px + dx * t;
        const cy = py + dy * t;
        pts.push([cx - nx * w, cy - ny * w]);
    }

    return pts;
}

/**
 * Build a thin filled band (quad strip) from a 2-point line.
 * Returns a 4-point polygon with the given half-width perpendicular to the line direction.
 */
function lineToBand(
    u0: number, v0: number,
    u1: number, v1: number,
    halfW: number
): [number, number][] {
    const dx = u1 - u0;
    const dy = v1 - v0;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 1e-9) return [[u0, v0], [u1, v1], [u1, v1], [u0, v0]];
    const nx = -dy / len * halfW;
    const ny = dx / len * halfW;
    return [
        [u0 + nx, v0 + ny],
        [u1 + nx, v1 + ny],
        [u1 - nx, v1 - ny],
        [u0 - nx, v0 - ny],
    ];
}

/**
 * Build a thin filled arc band from a polyline (open curve).
 * Offsets each point by +/- halfW along the approximate normal.
 */
function arcToBand(
    pts: [number, number][],
    halfW: number
): [number, number][] {
    const n = pts.length;
    if (n < 2) return pts;
    const left: [number, number][] = [];
    const right: [number, number][] = [];
    for (let i = 0; i < n; i++) {
        // Compute tangent from neighbors
        let tx: number, ty: number;
        if (i === 0) {
            tx = pts[1][0] - pts[0][0];
            ty = pts[1][1] - pts[0][1];
        } else if (i === n - 1) {
            tx = pts[n - 1][0] - pts[n - 2][0];
            ty = pts[n - 1][1] - pts[n - 2][1];
        } else {
            tx = pts[i + 1][0] - pts[i - 1][0];
            ty = pts[i + 1][1] - pts[i - 1][1];
        }
        const len = Math.sqrt(tx * tx + ty * ty);
        if (len < 1e-9) {
            left.push(pts[i]);
            right.push(pts[i]);
            continue;
        }
        const nx = -ty / len * halfW;
        const ny = tx / len * halfW;
        left.push([pts[i][0] + nx, pts[i][1] + ny]);
        right.push([pts[i][0] - nx, pts[i][1] - ny]);
    }
    // Return as a closed polygon: left side forward, right side backward
    return [...left, ...right.reverse()];
}

/**
 * Build a thin filled wedge from a base point to an outer point.
 * The wedge starts very narrow at base and widens to `tipHalfW` at the outer end.
 */
function lineToWedge(
    u0: number, v0: number,
    u1: number, v1: number,
    baseHalfW: number,
    tipHalfW: number
): [number, number][] {
    const dx = u1 - u0;
    const dy = v1 - v0;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 1e-9) return [[u0, v0], [u1, v1], [u1, v1], [u0, v0]];
    const nx = -dy / len;
    const ny = dx / len;
    return [
        [u0 + nx * baseHalfW, v0 + ny * baseHalfW],
        [u1 + nx * tipHalfW, v1 + ny * tipHalfW],
        [u1 - nx * tipHalfW, v1 - ny * tipHalfW],
        [u0 - nx * baseHalfW, v0 - ny * baseHalfW],
    ];
}

const lacePatterns: PatternSet = {
    name: 'Lace / Doily',
    count: 5,
    draw: (type: number, { drawUV, filled }: PatternContext) => {
        switch (type) {
            // ── 0: Fan Scallop ──────────────────────────────────────────
            case 0: {
                // Fan with thin individual ribs separated by gaps
                const numRibs = 9;
                const base: [number, number] = [0.5, 0.0];
                const fanRadius = 0.82;
                const ribWidth = 0.018; // very thin ribs

                // Draw filled rib shapes radiating from base
                for (let i = 0; i < numRibs; i++) {
                    const t = (i + 0.5) / numRibs;
                    const angle = Math.PI * t;
                    const outerU = 0.5 - 0.48 * Math.cos(angle);
                    const outerV = fanRadius * Math.sin(angle);
                    const dx = outerU - base[0];
                    const dy = outerV - base[1];
                    const len = Math.sqrt(dx * dx + dy * dy);
                    const nx = -dy / len;
                    const ny = dx / len;

                    // Thin elongated rib shape
                    const rib: [number, number][] = [
                        [base[0], base[1]],
                        [base[0] + dx * 0.15 + nx * ribWidth * 0.5, base[1] + dy * 0.15 + ny * ribWidth * 0.5],
                        [outerU + nx * ribWidth, outerV + ny * ribWidth],
                        [outerU, outerV],
                        [outerU - nx * ribWidth, outerV - ny * ribWidth],
                        [base[0] + dx * 0.15 - nx * ribWidth * 0.5, base[1] + dy * 0.15 - ny * ribWidth * 0.5],
                    ];

                    drawUV(rib, 'filled');
                }

                // Radiating filled wedges between each rib
                for (let i = 0; i <= numRibs; i++) {
                    const t = i / numRibs;
                    const angle = Math.PI * t;
                    const outerU = 0.5 - 0.48 * Math.cos(angle);
                    const outerV = fanRadius * Math.sin(angle);
                    const wedge = lineToWedge(base[0], base[1], outerU, outerV, 0.003, 0.015);
                    drawUV(wedge, 'filled');
                }

                // Inner arc band at ~30% radius
                const innerArc: [number, number][] = [];
                for (let i = 0; i <= 20; i++) {
                    const t = i / 20;
                    const angle = Math.PI * t;
                    innerArc.push([0.5 - 0.18 * Math.cos(angle), 0.28 * Math.sin(angle)]);
                }
                drawUV(arcToBand(innerArc, 0.012), 'filled');

                // Middle arc band at ~55% radius
                const midArc: [number, number][] = [];
                for (let i = 0; i <= 20; i++) {
                    const t = i / 20;
                    const angle = Math.PI * t;
                    midArc.push([0.5 - 0.30 * Math.cos(angle), 0.48 * Math.sin(angle)]);
                }
                drawUV(arcToBand(midArc, 0.012), 'filled');

                // Outer arc band at ~75% radius
                const outerArc: [number, number][] = [];
                for (let i = 0; i <= 20; i++) {
                    const t = i / 20;
                    const angle = Math.PI * t;
                    outerArc.push([0.5 - 0.42 * Math.cos(angle), 0.68 * Math.sin(angle)]);
                }
                drawUV(arcToBand(outerArc, 0.012), 'filled');

                // Decorative filled scallop arcs along the outer fan edge
                const scallopCount = 8;
                for (let i = 0; i < scallopCount; i++) {
                    const t0 = i / scallopCount;
                    const t1 = (i + 1) / scallopCount;
                    const miniArc: [number, number][] = [];
                    for (let j = 0; j <= 5; j++) {
                        const t = t0 + (t1 - t0) * (j / 5);
                        const angle = Math.PI * t;
                        const u = 0.5 - 0.48 * Math.cos(angle);
                        const v = fanRadius * Math.sin(angle);
                        const nudge = 0.035 * Math.sin(Math.PI * (j / 5));
                        miniArc.push([u, v + nudge]);
                    }
                    drawUV(arcToBand(miniArc, 0.012), 'filled');
                }

                // Tiny dots at rib tips
                for (let i = 0; i < numRibs; i++) {
                    const t = (i + 0.5) / numRibs;
                    const angle = Math.PI * t;
                    const u = 0.5 - 0.48 * Math.cos(angle);
                    const v = fanRadius * Math.sin(angle);
                    drawUV(circlePoints(u, v, 0.015, 6), 'filled');
                }

                // Small filled dot at the base
                drawUV(circlePoints(0.5, 0.0, 0.025, 8), 'filled');
                break;
            }

            // ── 1: Bobbin Lace Eye ─────────────────────────────────────
            case 1: {
                const cx = 0.5;
                const cy = 0.5;
                const segs = 24;

                // Helper: build a vesica/almond shape (two arcs meeting at tips)
                const vesica = (
                    leftU: number, rightU: number,
                    topBulge: number, botBulge: number, n: number
                ): [number, number][] => {
                    const pts: [number, number][] = [];
                    for (let i = 0; i <= n; i++) {
                        const t = i / n;
                        const u = leftU + (rightU - leftU) * t;
                        const b = Math.sin(Math.PI * t);
                        pts.push([u, cy - topBulge * b]);
                    }
                    for (let i = n; i >= 0; i--) {
                        const t = i / n;
                        const u = leftU + (rightU - leftU) * t;
                        const b = Math.sin(Math.PI * t);
                        pts.push([u, cy + botBulge * b]);
                    }
                    return pts;
                };

                // --- Outer eye band (thick, as two nested vesicas with fill) ---
                const outerEye = vesica(0.03, 0.97, 0.40, 0.40, segs);
                const innerEye = vesica(0.08, 0.92, 0.32, 0.32, segs);

                if (filled) {
                    drawUV(outerEye, 'filled');
                    drawUV(innerEye, 'opaque-outline');
                } else {
                    drawUV(outerEye, 'filled');
                    drawUV(innerEye, 'opaque-outline');
                }

                // --- Second concentric eye layer ---
                const midEye = vesica(0.14, 0.86, 0.25, 0.25, segs);
                drawUV(midEye, 'filled');

                // --- Inner concentric eye layer ---
                const innerLayer = vesica(0.22, 0.78, 0.17, 0.17, segs);
                drawUV(innerLayer, 'filled');

                // --- Innermost eye layer ---
                const innermostLayer = vesica(0.28, 0.72, 0.12, 0.12, segs);
                if (filled) {
                    drawUV(innermostLayer, 'opaque-outline');
                } else {
                    drawUV(innermostLayer, 'opaque-outline');
                }

                // --- Radiating filled spoke bands from center to outer eye ---
                const spokeCount = 12;
                for (let i = 0; i < spokeCount; i++) {
                    const angle = (2 * Math.PI * i) / spokeCount;
                    // Extend spoke to where it hits the outer eye boundary
                    const cosA = Math.cos(angle);
                    const sinA = Math.sin(angle);
                    const reach = 0.32;
                    const endU = cx + reach * cosA;
                    const endV = cy + reach * sinA;
                    const band = lineToBand(cx, cy, endU, endV, 0.012);
                    drawUV(band, 'filled');
                }

                // --- Central starburst flower ---
                const starPetals = 8;
                const starR = 0.10;
                for (let i = 0; i < starPetals; i++) {
                    const angle = (2 * Math.PI * i) / starPetals;
                    const tipU = cx + starR * Math.cos(angle);
                    const tipV = cy + starR * Math.sin(angle);
                    const petal = teardrop(cx, cy, tipU, tipV, 0.035, 5);
                    if (filled) {
                        drawUV(petal, i % 2 === 0 ? 'filled' : 'opaque-outline');
                    } else {
                        drawUV(petal, 'filled');
                    }
                }

                // --- Center dot ---
                drawUV(circlePoints(cx, cy, 0.03, 8), 'filled');

                // --- Ring around center flower ---
                drawUV(circlePoints(cx, cy, 0.13, 20), 'filled');

                // --- Decorative filled scallop arcs along outer eye edge (top) ---
                const scallopN = 7;
                for (let i = 0; i < scallopN; i++) {
                    const t0 = (i + 0.5) / (scallopN + 1);
                    const u0 = 0.03 + 0.94 * t0;
                    const bulge0 = Math.sin(Math.PI * t0);
                    const sv = cy - 0.40 * bulge0;
                    const arcPts: [number, number][] = [];
                    for (let j = 0; j <= 6; j++) {
                        const a = Math.PI * (j / 6);
                        arcPts.push([u0 + 0.045 * Math.cos(a), sv - 0.04 * Math.sin(a)]);
                    }
                    drawUV(arcToBand(arcPts, 0.012), 'filled');
                }

                // --- Decorative filled scallop arcs along outer eye edge (bottom) ---
                for (let i = 0; i < scallopN; i++) {
                    const t0 = (i + 0.5) / (scallopN + 1);
                    const u0 = 0.03 + 0.94 * t0;
                    const bulge0 = Math.sin(Math.PI * t0);
                    const sv = cy + 0.40 * bulge0;
                    const arcPts: [number, number][] = [];
                    for (let j = 0; j <= 6; j++) {
                        const a = Math.PI * (j / 6);
                        arcPts.push([u0 + 0.045 * Math.cos(a), sv + 0.04 * Math.sin(a)]);
                    }
                    drawUV(arcToBand(arcPts, 0.012), 'filled');
                }

                // --- Small dots at the tips of the eye ---
                drawUV(circlePoints(0.03, cy, 0.025, 6), 'filled');
                drawUV(circlePoints(0.97, cy, 0.025, 6), 'filled');

                // --- Corner decoration: filled loops in the four corners ---
                const cornerPositions: [number, number][] = [
                    [0.08, 0.08], [0.92, 0.08], [0.08, 0.92], [0.92, 0.92],
                ];
                for (const [cu, cv] of cornerPositions) {
                    drawUV(circlePoints(cu, cv, 0.05, 8), 'filled');
                    drawUV(circlePoints(cu, cv, 0.02, 6), 'filled');
                }

                break;
            }

            // ── 2: Filet Crochet Grid ────────────────────────────────────
            case 2: {
                const gridN = 4;
                const margin = 0.04;
                const cellW = (1 - 2 * margin) / gridN;
                const bandW = 0.025; // thickness of grid bands

                // --- Outer border frame (thick band) ---
                const outerFrame: [number, number][] = [
                    [margin - bandW, margin - bandW],
                    [1 - margin + bandW, margin - bandW],
                    [1 - margin + bandW, 1 - margin + bandW],
                    [margin - bandW, 1 - margin + bandW],
                ];
                const innerFrame: [number, number][] = [
                    [margin, margin],
                    [1 - margin, margin],
                    [1 - margin, 1 - margin],
                    [margin, 1 - margin],
                ];
                if (filled) {
                    drawUV(outerFrame, 'filled');
                    drawUV(innerFrame, 'opaque-outline');
                } else {
                    drawUV(outerFrame, 'filled');
                    drawUV(innerFrame, 'opaque-outline');
                }

                // --- Horizontal grid bands ---
                for (let row = 1; row < gridN; row++) {
                    const v0 = margin + row * cellW - bandW * 0.5;
                    const v1 = margin + row * cellW + bandW * 0.5;
                    const band: [number, number][] = [
                        [margin, v0], [1 - margin, v0],
                        [1 - margin, v1], [margin, v1],
                    ];
                    drawUV(band, 'filled');
                }

                // --- Vertical grid bands ---
                for (let col = 1; col < gridN; col++) {
                    const u0 = margin + col * cellW - bandW * 0.5;
                    const u1 = margin + col * cellW + bandW * 0.5;
                    const band: [number, number][] = [
                        [u0, margin], [u1, margin],
                        [u1, 1 - margin], [u0, 1 - margin],
                    ];
                    drawUV(band, 'filled');
                }

                // --- Cell decorations: checkerboard pattern ---
                for (let row = 0; row < gridN; row++) {
                    for (let col = 0; col < gridN; col++) {
                        const cellU = margin + col * cellW;
                        const cellV = margin + row * cellW;
                        const ccx = cellU + cellW * 0.5;
                        const ccy = cellV + cellW * 0.5;
                        const isChecked = (row + col) % 2 === 0;

                        if (isChecked) {
                            if (filled) {
                                // Filled square in checked cells
                                const sq: [number, number][] = [
                                    [cellU + bandW * 0.6, cellV + bandW * 0.6],
                                    [cellU + cellW - bandW * 0.6, cellV + bandW * 0.6],
                                    [cellU + cellW - bandW * 0.6, cellV + cellW - bandW * 0.6],
                                    [cellU + bandW * 0.6, cellV + cellW - bandW * 0.6],
                                ];
                                drawUV(sq, 'filled');
                                // Cut out a circle in the center for decoration
                                drawUV(circlePoints(ccx, ccy, cellW * 0.22, 12), 'opaque-outline');
                                // Small dot at center
                                drawUV(circlePoints(ccx, ccy, cellW * 0.08, 8), 'filled');
                            } else {
                                // Diagonal cross as filled X shapes
                                const xHalfW = 0.012;
                                const x0 = cellU + bandW;
                                const y0 = cellV + bandW;
                                const x1 = cellU + cellW - bandW;
                                const y1 = cellV + cellW - bandW;
                                // Backslash diagonal
                                drawUV(lineToBand(x0, y0, x1, y1, xHalfW), 'filled');
                                // Forward slash diagonal
                                drawUV(lineToBand(x1, y0, x0, y1, xHalfW), 'filled');
                                // Circle motif
                                drawUV(circlePoints(ccx, ccy, cellW * 0.22, 12), 'filled');
                            }
                        } else {
                            // Unchecked cells: rosette / circle motif
                            const r = cellW * 0.28;
                            drawUV(circlePoints(ccx, ccy, r, 12), 'filled');
                            // Small inner circle
                            drawUV(circlePoints(ccx, ccy, r * 0.4, 8), filled ? 'filled' : 'filled');
                            // Four small dots around the circle
                            const dotR = cellW * 0.06;
                            drawUV(circlePoints(ccx, ccy - r * 0.7, dotR, 6), 'filled');
                            drawUV(circlePoints(ccx, ccy + r * 0.7, dotR, 6), 'filled');
                            drawUV(circlePoints(ccx - r * 0.7, ccy, dotR, 6), 'filled');
                            drawUV(circlePoints(ccx + r * 0.7, ccy, dotR, 6), 'filled');
                        }
                    }
                }

                // --- Corner squares decoration (filled dots at grid intersections) ---
                for (let row = 0; row <= gridN; row++) {
                    for (let col = 0; col <= gridN; col++) {
                        const iu = margin + col * cellW;
                        const iv = margin + row * cellW;
                        drawUV(circlePoints(iu, iv, bandW * 0.7, 6), 'filled');
                    }
                }

                break;
            }

            // ── 3: Flower Rosette ───────────────────────────────────────
            case 3: {
                const cx = 0.5;
                const cy = 0.5;
                const petalCount = 6;
                const petalLength = 0.35;
                const petalWidth = 0.1;

                for (let i = 0; i < petalCount; i++) {
                    const angle = (2 * Math.PI * i) / petalCount - Math.PI / 2;
                    const tipX = cx + petalLength * Math.cos(angle);
                    const tipY = cy + petalLength * Math.sin(angle);

                    const petal = teardrop(cx, cy, tipX, tipY, petalWidth, 6);

                    if (filled) {
                        // Alternate petals: filled vs opaque-outline
                        if (i % 2 === 0) {
                            drawUV(petal, 'filled');
                        } else {
                            drawUV(petal, 'opaque-outline');
                        }
                    } else {
                        drawUV(petal, 'filled');
                    }
                }

                // Center filled circle
                drawUV(circlePoints(cx, cy, 0.06, 8), 'filled');

                // Outer ring around the whole flower - filled
                drawUV(circlePoints(cx, cy, 0.42, 24), 'filled');

                // Small dots between petals
                for (let i = 0; i < petalCount; i++) {
                    const angle = (2 * Math.PI * (i + 0.5)) / petalCount - Math.PI / 2;
                    const dotX = cx + 0.2 * Math.cos(angle);
                    const dotY = cy + 0.2 * Math.sin(angle);
                    drawUV(circlePoints(dotX, dotY, 0.025, 6), 'filled');
                }
                break;
            }

            // ── 4: Lace Medallion ────────────────────────────────────────
            case 4: {
                const cx = 0.5;
                const cy = 0.5;
                const outerR = 0.46;
                const ringSegs = 32;

                // --- Outermost ring band (thick) ---
                const outerRing = circlePoints(cx, cy, outerR, ringSegs);
                const outerRingInner = circlePoints(cx, cy, outerR - 0.04, ringSegs);
                if (filled) {
                    drawUV(outerRing, 'filled');
                    drawUV(outerRingInner, 'opaque-outline');
                } else {
                    drawUV(outerRing, 'filled');
                    drawUV(outerRingInner, 'opaque-outline');
                }

                // --- Decorative scallops around the outermost ring ---
                const scallopN = 12;
                for (let i = 0; i < scallopN; i++) {
                    const angle = (2 * Math.PI * i) / scallopN;
                    const su = cx + (outerR + 0.04) * Math.cos(angle);
                    const sv = cy + (outerR + 0.04) * Math.sin(angle);
                    drawUV(circlePoints(su, sv, 0.035, 8), 'filled');
                }

                // --- Second ring - filled ---
                const ring2R = 0.35;
                drawUV(circlePoints(cx, cy, ring2R, ringSegs), 'filled');

                // --- Radiating petals between ring2 and outerRingInner ---
                const petalCount = 12;
                for (let i = 0; i < petalCount; i++) {
                    const angle = (2 * Math.PI * i) / petalCount;
                    const innerU = cx + ring2R * Math.cos(angle);
                    const innerV = cy + ring2R * Math.sin(angle);
                    const outerU = cx + (outerR - 0.05) * Math.cos(angle);
                    const outerV = cy + (outerR - 0.05) * Math.sin(angle);
                    const petal = teardrop(innerU, innerV, outerU, outerV, 0.05, 5);
                    if (filled) {
                        drawUV(petal, i % 2 === 0 ? 'filled' : 'opaque-outline');
                    } else {
                        drawUV(petal, 'filled');
                    }
                }

                // --- Third ring ---
                const ring3R = 0.24;
                const ring3 = circlePoints(cx, cy, ring3R, ringSegs);
                const ring3inner = circlePoints(cx, cy, ring3R - 0.03, ringSegs);
                if (filled) {
                    drawUV(ring3, 'filled');
                    drawUV(ring3inner, 'opaque-outline');
                } else {
                    drawUV(ring3, 'filled');
                    drawUV(ring3inner, 'opaque-outline');
                }

                // --- Small dots at regular intervals on ring2 ---
                const dotCount = 12;
                for (let i = 0; i < dotCount; i++) {
                    const angle = (2 * Math.PI * i) / dotCount + Math.PI / dotCount;
                    const du = cx + ring2R * Math.cos(angle);
                    const dv = cy + ring2R * Math.sin(angle);
                    drawUV(circlePoints(du, dv, 0.02, 6), 'filled');
                }

                // --- Inner radiating filled spoke bands from center to ring3 ---
                const spokeCount = 8;
                for (let i = 0; i < spokeCount; i++) {
                    const angle = (2 * Math.PI * i) / spokeCount;
                    const eu = cx + (ring3R - 0.04) * Math.cos(angle);
                    const ev = cy + (ring3R - 0.04) * Math.sin(angle);
                    const band = lineToBand(cx, cy, eu, ev, 0.012);
                    drawUV(band, 'filled');
                }

                // --- Central star/flower motif ---
                const starPoints = 8;
                const starOuterR = 0.12;
                const starInnerR = 0.06;
                const starShape: [number, number][] = [];
                for (let i = 0; i < starPoints * 2; i++) {
                    const angle = (Math.PI * i) / starPoints - Math.PI / 2;
                    const r = i % 2 === 0 ? starOuterR : starInnerR;
                    starShape.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
                }
                drawUV(starShape, 'filled');

                // --- Center dot ---
                drawUV(circlePoints(cx, cy, 0.03, 8), 'filled');

                // --- Inner ring around center - filled ---
                drawUV(circlePoints(cx, cy, 0.15, 16), 'filled');

                // --- Corner decorations to fill the tile fully ---
                const cornerR = 0.09;
                const corners: [number, number][] = [
                    [0.04, 0.04], [0.96, 0.04], [0.04, 0.96], [0.96, 0.96],
                ];
                for (const [cu, cv] of corners) {
                    // Quarter-circle fan in each corner
                    const fan: [number, number][] = [[cu, cv]];
                    const startAngle = cu < 0.5
                        ? (cv < 0.5 ? 0 : -Math.PI / 2)
                        : (cv < 0.5 ? Math.PI / 2 : Math.PI);
                    for (let i = 0; i <= 8; i++) {
                        const a = startAngle + (Math.PI / 2) * (i / 8);
                        fan.push([cu + cornerR * Math.cos(a), cv + cornerR * Math.sin(a)]);
                    }
                    drawUV(fan, 'filled');
                }

                // --- Edge midpoint decorations ---
                const edgeMids: [number, number][] = [
                    [0.5, 0.02], [0.5, 0.98], [0.02, 0.5], [0.98, 0.5],
                ];
                for (const [eu, ev] of edgeMids) {
                    drawUV(diamond(eu, ev, 0.04), 'filled');
                }

                break;
            }
        }
    },
};

export default lacePatterns;
