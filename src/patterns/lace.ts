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

const lacePatterns: PatternSet = {
    name: 'Lace / Doily',
    count: 5,
    draw: (type: number, { drawUV, filled }: PatternContext) => {
        switch (type) {
            // ── 0: Fan Scallop ──────────────────────────────────────────
            case 0: {
                // Fan broken into individual ribs/sections with gaps between them
                const numRibs = 7;
                const base: [number, number] = [0.5, 0.0];
                const fanRadius = 0.85;
                const ribWidth = 0.035; // narrow ribs with gaps

                // Draw individual rib sections (thin wedge shapes radiating from base)
                for (let i = 0; i < numRibs; i++) {
                    const t = (i + 0.5) / numRibs;
                    const angle = Math.PI * t;
                    const outerU = 0.5 - 0.5 * Math.cos(angle);
                    const outerV = fanRadius * Math.sin(angle);
                    // Direction from base to tip
                    const dx = outerU - base[0];
                    const dy = outerV - base[1];
                    const len = Math.sqrt(dx * dx + dy * dy);
                    const nx = -dy / len;
                    const ny = dx / len;

                    // Each rib is a thin elongated shape
                    const rib: [number, number][] = [
                        [base[0] - nx * ribWidth * 0.3, base[1] - ny * ribWidth * 0.3],
                        [outerU - nx * ribWidth, outerV - ny * ribWidth],
                        [outerU, outerV + 0.02], // rounded tip
                        [outerU + nx * ribWidth, outerV + ny * ribWidth],
                        [base[0] + nx * ribWidth * 0.3, base[1] + ny * ribWidth * 0.3],
                    ];

                    if (filled) {
                        // Alternate between filled and opaque-outline for visual variety
                        drawUV(rib, i % 2 === 0 ? 'filled' : 'opaque-outline');
                    } else {
                        drawUV(rib, 'outline');
                    }
                }

                // Radiating detail lines between ribs (thinner guide lines)
                for (let i = 0; i <= numRibs; i++) {
                    const t = i / numRibs;
                    const angle = Math.PI * t;
                    const outerU = 0.5 - 0.5 * Math.cos(angle);
                    const outerV = fanRadius * Math.sin(angle);
                    drawUV([base, [outerU, outerV]], 'line');
                }

                // Inner arc at 40% radius for structural detail
                const innerArc: [number, number][] = [];
                for (let i = 0; i <= 16; i++) {
                    const t = i / 16;
                    const angle = Math.PI * t;
                    const u = 0.5 - 0.2 * Math.cos(angle);
                    const v = 0.35 * Math.sin(angle);
                    innerArc.push([u, v]);
                }
                drawUV(innerArc, 'line');

                // Middle arc at 60% radius
                const midArc: [number, number][] = [];
                for (let i = 0; i <= 16; i++) {
                    const t = i / 16;
                    const angle = Math.PI * t;
                    const u = 0.5 - 0.32 * Math.cos(angle);
                    const v = 0.55 * Math.sin(angle);
                    midArc.push([u, v]);
                }
                drawUV(midArc, 'line');

                // Decorative small scallops along the outer fan arc edge
                for (let i = 0; i < 6; i++) {
                    const t0 = i / 6;
                    const t1 = (i + 1) / 6;
                    const miniArc: [number, number][] = [];
                    for (let j = 0; j <= 5; j++) {
                        const t = t0 + (t1 - t0) * (j / 5);
                        const angle = Math.PI * t;
                        const u = 0.5 - 0.5 * Math.cos(angle);
                        const v = fanRadius * Math.sin(angle);
                        const nudge = 0.04 * Math.sin(Math.PI * (j / 5));
                        miniArc.push([u, v + nudge]);
                    }
                    drawUV(miniArc, 'line');
                }

                // Small dots at the tips of each rib
                for (let i = 0; i < numRibs; i++) {
                    const t = (i + 0.5) / numRibs;
                    const angle = Math.PI * t;
                    const u = 0.5 - 0.5 * Math.cos(angle);
                    const v = fanRadius * Math.sin(angle);
                    drawUV(circlePoints(u, v, 0.02, 6), 'filled');
                }

                // Small filled dot at the base
                drawUV(circlePoints(0.5, 0.0, 0.03, 8), 'filled');
                break;
            }

            // ── 1: Loops and Eyes ───────────────────────────────────────
            case 1: {
                // Eye/vesica shape: two arcs meeting at left [0.15, 0.5] and right [0.85, 0.5]
                // Top arc bulges to v=0.25, bottom arc bulges to v=0.75
                const eyeSegs = 8;
                const topArc: [number, number][] = [];
                const botArc: [number, number][] = [];
                for (let i = 0; i <= eyeSegs; i++) {
                    const t = i / eyeSegs;
                    const u = 0.15 + 0.7 * t;
                    const bulge = Math.sin(Math.PI * t);
                    topArc.push([u, 0.5 - 0.25 * bulge]); // up toward v=0.25
                    botArc.push([u, 0.5 + 0.25 * bulge]); // down toward v=0.75
                }

                // Full eye outline (top arc forward, bottom arc backward)
                const eyeOutline: [number, number][] = [
                    ...topArc,
                    ...botArc.slice().reverse(),
                ];
                drawUV(eyeOutline, 'outline');

                // Inner filled circle (the "pupil")
                drawUV(circlePoints(0.5, 0.5, 0.07, 8), 'filled');

                // Small ring around the pupil
                drawUV(circlePoints(0.5, 0.5, 0.12, 12), 'outline');

                // Loop shapes above the eye (3 small arcs)
                for (let i = 0; i < 3; i++) {
                    const cu = 0.25 + 0.25 * i; // u = 0.25, 0.5, 0.75
                    const loopPts: [number, number][] = [];
                    for (let j = 0; j <= 6; j++) {
                        const t = j / 6;
                        const angle = Math.PI * t;
                        const lu = cu + 0.08 * Math.cos(angle);
                        const lv = 0.15 - 0.1 * Math.sin(angle); // arcs above
                        loopPts.push([lu, lv]);
                    }
                    drawUV(loopPts, 'outline');
                    // Tiny dot at loop peak
                    drawUV(circlePoints(cu, 0.05, 0.02, 6), 'filled');
                }

                // Loop shapes below the eye (3 small arcs)
                for (let i = 0; i < 3; i++) {
                    const cu = 0.25 + 0.25 * i;
                    const loopPts: [number, number][] = [];
                    for (let j = 0; j <= 6; j++) {
                        const t = j / 6;
                        const angle = Math.PI * t;
                        const lu = cu + 0.08 * Math.cos(angle);
                        const lv = 0.85 + 0.1 * Math.sin(angle); // arcs below
                        loopPts.push([lu, lv]);
                    }
                    drawUV(loopPts, 'outline');
                    drawUV(circlePoints(cu, 0.95, 0.02, 6), 'filled');
                }
                break;
            }

            // ── 2: Mesh Lattice ─────────────────────────────────────────
            case 2: {
                // 3 diagonal lines going one direction: lower-left to upper-right
                const diag1: [number, number][][] = [
                    [[0, 0], [0.33, 1]],
                    [[0.33, 0], [0.67, 1]],
                    [[0.67, 0], [1, 1]],
                ];
                // 3 diagonal lines going other direction: upper-left to lower-right
                const diag2: [number, number][][] = [
                    [[0, 1], [0.33, 0]],
                    [[0.33, 1], [0.67, 0]],
                    [[0.67, 1], [1, 0]],
                ];

                for (const seg of diag1) drawUV(seg, 'line');
                for (const seg of diag2) drawUV(seg, 'line');

                // Compute intersections of each diag1 line with each diag2 line
                // diag1[i]: from (0.33*i, 0) to (0.33*(i+1), 1) => parametric
                // diag2[j]: from (0.33*j, 1) to (0.33*(j+1), 0) => parametric
                // Solving for intersection:
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        // Line 1: P = (0.33*i, 0) + t*( 0.33, 1 )
                        // Line 2: Q = (0.33*j, 1) + s*( 0.33, -1 )
                        // 0.33*i + 0.33*t = 0.33*j + 0.33*s  => i + t = j + s
                        // 0 + t = 1 - s  =>  t + s = 1  =>  s = 1 - t
                        // i + t = j + 1 - t  =>  2t = j - i + 1  =>  t = (j - i + 1) / 2
                        const t = (j - i + 1) / 2;
                        if (t >= 0 && t <= 1) {
                            const ix = 0.33 * i + 0.33 * t;
                            const iy = t;
                            drawUV(diamond(ix, iy, 0.03), 'filled');
                        }
                    }
                }

                // Additional border lines for structure
                drawUV([[0, 0], [1, 0]], 'line');
                drawUV([[0, 1], [1, 1]], 'line');
                drawUV([[0, 0], [0, 1]], 'line');
                drawUV([[1, 0], [1, 1]], 'line');
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
                        drawUV(petal, 'outline');
                    }
                }

                // Center filled circle
                drawUV(circlePoints(cx, cy, 0.06, 8), 'filled');

                // Outer ring around the whole flower
                drawUV(circlePoints(cx, cy, 0.42, 24), 'outline');

                // Small dots between petals
                for (let i = 0; i < petalCount; i++) {
                    const angle = (2 * Math.PI * (i + 0.5)) / petalCount - Math.PI / 2;
                    const dotX = cx + 0.2 * Math.cos(angle);
                    const dotY = cy + 0.2 * Math.sin(angle);
                    drawUV(circlePoints(dotX, dotY, 0.025, 6), 'filled');
                }
                break;
            }

            // ── 4: Scalloped Border with Pendants ───────────────────────
            case 4: {
                const scallopCount = 3;
                const sw = 1 / scallopCount;

                // Draw 3 scallop arcs along the outer edge (v=1)
                for (let i = 0; i < scallopCount; i++) {
                    const cx = sw * (i + 0.5);
                    const arcPts: [number, number][] = [];
                    const segs = 8;
                    for (let j = 0; j <= segs; j++) {
                        const t = j / segs;
                        const angle = Math.PI * t;
                        const u = cx - (sw * 0.48) * Math.cos(angle);
                        const v = 1.0 - (sw * 0.48) * Math.sin(angle);
                        arcPts.push([u, v]);
                    }

                    if (filled) {
                        // Close scallop against outer edge and fill
                        const shape: [number, number][] = [
                            [arcPts[0][0], 1.0],
                            ...arcPts,
                            [arcPts[arcPts.length - 1][0], 1.0],
                        ];
                        drawUV(shape, 'filled');
                    } else {
                        drawUV(arcPts, 'outline');
                    }

                    // Small decorative circle inside each scallop
                    drawUV(circlePoints(cx, 0.88, 0.04, 8), 'outline');
                }

                // Outer edge line
                drawUV([[0, 1], [1, 1]], 'line');

                // Pendants hanging from each scallop valley
                // Valleys are at u = 0, 1/3, 2/3, 1 (boundaries between scallops)
                const valleyUs = [0, sw, 2 * sw, 1];
                for (const vu of valleyUs) {
                    // Teardrop pendant pointing inward (from outer toward inner)
                    const pendantTop = 0.85;
                    const pendantBottom = 0.45;
                    const pendant = teardrop(vu, pendantBottom, vu, pendantTop, 0.06, 5);
                    drawUV(pendant, 'outline');

                    // Tiny filled dot at the bottom tip of pendant
                    drawUV(circlePoints(vu, pendantBottom, 0.02, 6), 'filled');
                }

                // Connecting line between scallops at mid-height
                const midLine: [number, number][] = [];
                for (let i = 0; i <= 12; i++) {
                    const t = i / 12;
                    // Gentle wave connecting the pendants
                    const v = 0.6 + 0.05 * Math.sin(t * scallopCount * 2 * Math.PI);
                    midLine.push([t, v]);
                }
                drawUV(midLine, 'line');
                break;
            }
        }
    },
};

export default lacePatterns;
