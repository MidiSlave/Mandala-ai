import type { PatternSet, PatternContext } from './types';

// Helper: generate a small diamond/dot at (cx, cy) with radius r
function dot(cx: number, cy: number, r: number): [number, number][] {
    return [[cx, cy - r], [cx + r, cy], [cx, cy + r], [cx - r, cy]];
}

// Helper: generate a small square at (cx, cy) with half-size s
function sq(cx: number, cy: number, s: number): [number, number][] {
    return [[cx - s, cy - s], [cx + s, cy - s], [cx + s, cy + s], [cx - s, cy + s]];
}

// Helper: generate an oval approximation centered at (cx, cy) with radii rx, ry
function oval(cx: number, cy: number, rx: number, ry: number, n = 10): [number, number][] {
    const pts: [number, number][] = [];
    for (let i = 0; i < n; i++) {
        const a = (2 * Math.PI * i) / n;
        pts.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]);
    }
    return pts;
}

const tribalPatterns: PatternSet = {
    name: 'Tribal / Ethnic',
    count: 5,
    draw: (type: number, { drawUV, filled, baseStyle }: PatternContext) => {
        switch (type) {
            case 0: { // African Mask
                // Face outline — large shield/oval shape
                drawUV([
                    [0.5, 0.03],
                    [0.65, 0.06], [0.76, 0.14], [0.82, 0.25],
                    [0.84, 0.4], [0.82, 0.55], [0.78, 0.68],
                    [0.72, 0.78], [0.62, 0.88], [0.5, 0.92],
                    [0.38, 0.88], [0.28, 0.78], [0.22, 0.68],
                    [0.18, 0.55], [0.16, 0.4], [0.18, 0.25],
                    [0.24, 0.14], [0.35, 0.06],
                ], baseStyle);

                // Headdress crown — triangles at the top
                drawUV([[0.35, 0.06], [0.38, 0.0], [0.42, 0.06]], baseStyle);
                drawUV([[0.42, 0.04], [0.46, 0.0], [0.5, 0.03]], baseStyle);
                drawUV([[0.5, 0.03], [0.54, 0.0], [0.58, 0.04]], baseStyle);
                drawUV([[0.58, 0.06], [0.62, 0.0], [0.65, 0.06]], baseStyle);

                if (filled) {
                    // Eyes — almond shapes as cutouts
                    drawUV([
                        [0.28, 0.38], [0.33, 0.33], [0.42, 0.34],
                        [0.44, 0.38], [0.42, 0.42], [0.33, 0.43],
                    ], 'opaque-outline');
                    drawUV([
                        [0.56, 0.34], [0.67, 0.33], [0.72, 0.38],
                        [0.67, 0.43], [0.58, 0.42], [0.56, 0.38],
                    ], 'opaque-outline');
                    // Pupils — filled dots inside eyes
                    drawUV(dot(0.37, 0.38, 0.025), 'filled');
                    drawUV(dot(0.63, 0.38, 0.025), 'filled');
                } else {
                    // Eyes — almond filled
                    drawUV([
                        [0.28, 0.38], [0.33, 0.33], [0.42, 0.34],
                        [0.44, 0.38], [0.42, 0.42], [0.33, 0.43],
                    ], 'filled');
                    drawUV([
                        [0.56, 0.34], [0.67, 0.33], [0.72, 0.38],
                        [0.67, 0.43], [0.58, 0.42], [0.56, 0.38],
                    ], 'filled');
                    // Pupils
                    drawUV(dot(0.37, 0.38, 0.02), 'filled');
                    drawUV(dot(0.63, 0.38, 0.02), 'filled');
                }

                // Nose — elongated triangle
                drawUV([
                    [0.5, 0.42], [0.54, 0.6], [0.5, 0.64], [0.46, 0.6],
                ], filled ? baseStyle : 'filled');

                // Mouth — wide rectangle with teeth marks
                drawUV([
                    [0.36, 0.7], [0.64, 0.7], [0.64, 0.78], [0.36, 0.78],
                ], filled ? baseStyle : 'filled');
                if (!filled) {
                    // Vertical teeth as thin filled bars
                    drawUV([[0.42 - 0.012, 0.7], [0.42 + 0.012, 0.7], [0.42 + 0.012, 0.78], [0.42 - 0.012, 0.78]], baseStyle);
                    drawUV([[0.48 - 0.012, 0.7], [0.48 + 0.012, 0.7], [0.48 + 0.012, 0.78], [0.48 - 0.012, 0.78]], baseStyle);
                    drawUV([[0.54 - 0.012, 0.7], [0.54 + 0.012, 0.7], [0.54 + 0.012, 0.78], [0.54 - 0.012, 0.78]], baseStyle);
                    drawUV([[0.60 - 0.012, 0.7], [0.60 + 0.012, 0.7], [0.60 + 0.012, 0.78], [0.60 - 0.012, 0.78]], baseStyle);
                } else {
                    // Teeth as opaque cutouts
                    drawUV([[0.42, 0.71], [0.46, 0.71], [0.46, 0.77], [0.42, 0.77]], 'opaque-outline');
                    drawUV([[0.54, 0.71], [0.58, 0.71], [0.58, 0.77], [0.54, 0.77]], 'opaque-outline');
                }

                // Scarification marks — thin filled bars on cheeks
                if (!filled) {
                    for (let i = 0; i < 3; i++) {
                        const y = 0.5 + i * 0.05;
                        drawUV([[0.22, y - 0.012], [0.34, y - 0.012], [0.34, y + 0.012], [0.22, y + 0.012]], baseStyle);
                        drawUV([[0.66, y - 0.012], [0.78, y - 0.012], [0.78, y + 0.012], [0.66, y + 0.012]], baseStyle);
                    }
                } else {
                    for (let i = 0; i < 3; i++) {
                        const y = 0.5 + i * 0.05;
                        drawUV([[0.22, y], [0.34, y], [0.34, y + 0.015], [0.22, y + 0.015]], 'opaque-outline');
                        drawUV([[0.66, y], [0.78, y], [0.78, y + 0.015], [0.66, y + 0.015]], 'opaque-outline');
                    }
                }

                // Forehead decoration — horizontal band
                drawUV([
                    [0.28, 0.22], [0.72, 0.22], [0.72, 0.27], [0.28, 0.27],
                ], filled ? baseStyle : 'filled');
                break;
            }

            case 1: { // Tribal Shield
                // Outer shield shape
                drawUV([
                    [0.5, 0.02],
                    [0.78, 0.1], [0.9, 0.25], [0.94, 0.45],
                    [0.9, 0.65], [0.78, 0.82], [0.5, 0.96],
                    [0.22, 0.82], [0.1, 0.65], [0.06, 0.45],
                    [0.1, 0.25], [0.22, 0.1],
                ], baseStyle);

                // First concentric border
                drawUV([
                    [0.5, 0.1],
                    [0.7, 0.16], [0.8, 0.28], [0.84, 0.45],
                    [0.8, 0.6], [0.7, 0.74], [0.5, 0.86],
                    [0.3, 0.74], [0.2, 0.6], [0.16, 0.45],
                    [0.2, 0.28], [0.3, 0.16],
                ], filled ? 'opaque-outline' : 'filled');

                // Second concentric border
                drawUV([
                    [0.5, 0.18],
                    [0.64, 0.22], [0.72, 0.32], [0.75, 0.45],
                    [0.72, 0.56], [0.64, 0.67], [0.5, 0.76],
                    [0.36, 0.67], [0.28, 0.56], [0.25, 0.45],
                    [0.28, 0.32], [0.36, 0.22],
                ], filled ? 'filled' : 'filled');

                // Central vertical bar (cross)
                if (filled) {
                    drawUV([[0.5, 0.2], [0.5, 0.74]], 'opaque-outline');
                } else {
                    drawUV([[0.5 - 0.012, 0.2], [0.5 + 0.012, 0.2], [0.5 + 0.012, 0.74], [0.5 - 0.012, 0.74]], baseStyle);
                }

                // Central horizontal bar (cross)
                if (filled) {
                    drawUV([[0.27, 0.45], [0.73, 0.45]], 'opaque-outline');
                } else {
                    drawUV([[0.27, 0.45 - 0.012], [0.73, 0.45 - 0.012], [0.73, 0.45 + 0.012], [0.27, 0.45 + 0.012]], baseStyle);
                }

                if (filled) {
                    // Filled triangles in alternating quadrants (top-right and bottom-left)
                    drawUV([[0.5, 0.2], [0.7, 0.32], [0.5, 0.45]], 'opaque-outline');
                    drawUV([[0.5, 0.45], [0.3, 0.58], [0.5, 0.74]], 'opaque-outline');
                } else {
                    // X dividers as thin filled bars
                    // Diagonal from top-left to bottom-right
                    drawUV([
                        [0.35 - 0.012, 0.25], [0.35 + 0.012, 0.25],
                        [0.65 + 0.012, 0.65], [0.65 - 0.012, 0.65],
                    ], baseStyle);
                    // Diagonal from top-right to bottom-left
                    drawUV([
                        [0.65 - 0.012, 0.25], [0.65 + 0.012, 0.25],
                        [0.35 + 0.012, 0.65], [0.35 - 0.012, 0.65],
                    ], baseStyle);
                }

                // Dot patterns along the outer border
                const shieldDots = [
                    [0.5, 0.06], [0.68, 0.12], [0.82, 0.22],
                    [0.88, 0.38], [0.88, 0.55], [0.82, 0.7],
                    [0.68, 0.8], [0.5, 0.9],
                    [0.32, 0.8], [0.18, 0.7], [0.12, 0.55],
                    [0.12, 0.38], [0.18, 0.22], [0.32, 0.12],
                ];
                for (const [dx, dy] of shieldDots) {
                    drawUV(dot(dx, dy, 0.018), filled ? baseStyle : 'filled');
                }
                break;
            }

            case 2: { // Knotwork Band
                // Top border line
                drawUV([
                    [0.0, 0.82], [1.0, 0.82], [1.0, 0.85], [0.0, 0.85],
                ], baseStyle);
                // Bottom border line
                drawUV([
                    [0.0, 0.15], [1.0, 0.15], [1.0, 0.18], [0.0, 0.18],
                ], baseStyle);

                // Band A — weaving sinusoid (upper strand)
                const bandW = 0.06;
                const strandA: [number, number][] = [];
                const strandAbot: [number, number][] = [];
                const steps = 20;
                for (let i = 0; i <= steps; i++) {
                    const t = i / steps;
                    const u = t;
                    const v = 0.5 + 0.18 * Math.sin(t * 4 * Math.PI);
                    strandA.push([u, v + bandW]);
                    strandAbot.unshift([u, v - bandW]);
                }
                drawUV([...strandA, ...strandAbot], baseStyle);

                // Band B — weaving sinusoid (lower strand, phase-shifted)
                const strandB: [number, number][] = [];
                const strandBbot: [number, number][] = [];
                for (let i = 0; i <= steps; i++) {
                    const t = i / steps;
                    const u = t;
                    const v = 0.5 + 0.18 * Math.sin(t * 4 * Math.PI + Math.PI);
                    strandB.push([u, v + bandW]);
                    strandBbot.unshift([u, v - bandW]);
                }
                drawUV([...strandB, ...strandBbot], baseStyle);

                // Crossover cover patches — opaque rectangles at crossing points
                // where strand A should appear "over" strand B
                if (filled) {
                    // At each crossing, place an opaque patch over the strand that goes "under"
                    for (let k = 0; k < 4; k++) {
                        const crossU = (k + 0.5) * 0.25;
                        const crossV = 0.5;
                        // Alternating which strand is on top
                        if (k % 2 === 0) {
                            // Strand A on top: cover B with opaque, then redraw A
                            drawUV(sq(crossU, crossV, 0.06), 'opaque-outline');
                            // Re-draw small piece of strand A at crossing
                            const va = 0.5 + 0.18 * Math.sin(crossU * 4 * Math.PI);
                            drawUV([
                                [crossU - 0.05, va + bandW], [crossU + 0.05, va + bandW],
                                [crossU + 0.05, va - bandW], [crossU - 0.05, va - bandW],
                            ], 'filled');
                        } else {
                            drawUV(sq(crossU, crossV, 0.06), 'opaque-outline');
                            const vb = 0.5 + 0.18 * Math.sin(crossU * 4 * Math.PI + Math.PI);
                            drawUV([
                                [crossU - 0.05, vb + bandW], [crossU + 0.05, vb + bandW],
                                [crossU + 0.05, vb - bandW], [crossU - 0.05, vb - bandW],
                            ], 'filled');
                        }
                    }
                } else {
                    // In outline mode, draw crossing squares as filled
                    for (let k = 0; k < 4; k++) {
                        const crossU = (k + 0.5) * 0.25;
                        drawUV(sq(crossU, 0.5, 0.05), 'filled');
                    }
                }

                // Decorative dots between borders and bands — use 'filled' not 'outline'
                for (let i = 0; i < 6; i++) {
                    const u = 0.1 + i * 0.16;
                    drawUV(dot(u, 0.88, 0.015), filled ? baseStyle : 'filled');
                    drawUV(dot(u, 0.12, 0.015), filled ? baseStyle : 'filled');
                }
                break;
            }

            case 3: { // Totem Stack — 3 stacked faces
                // === Top face (y: 0.68–0.97) — circular eyes ===
                // Face frame
                drawUV([
                    [0.15, 0.68], [0.85, 0.68], [0.85, 0.97], [0.15, 0.97],
                ], baseStyle);
                // Circular eyes (approximated as octagons)
                drawUV(oval(0.35, 0.82, 0.07, 0.05, 8), filled ? 'opaque-outline' : 'filled');
                drawUV(oval(0.65, 0.82, 0.07, 0.05, 8), filled ? 'opaque-outline' : 'filled');
                // Pupils
                drawUV(dot(0.35, 0.82, 0.02), baseStyle);
                drawUV(dot(0.65, 0.82, 0.02), baseStyle);
                // Nose
                drawUV([[0.5, 0.78], [0.53, 0.74], [0.47, 0.74]], filled ? baseStyle : 'filled');
                // Mouth
                drawUV([[0.38, 0.9], [0.62, 0.9], [0.62, 0.94], [0.38, 0.94]], filled ? baseStyle : 'filled');

                // === Zigzag separator (y: 0.63–0.68) ===
                drawUV([
                    [0.15, 0.68], [0.25, 0.63], [0.35, 0.68], [0.45, 0.63],
                    [0.55, 0.68], [0.65, 0.63], [0.75, 0.68], [0.85, 0.63],
                    [0.85, 0.68], [0.15, 0.68],
                ], baseStyle);

                // === Middle face (y: 0.35–0.63) — diamond eyes ===
                // Face frame
                drawUV([
                    [0.15, 0.35], [0.85, 0.35], [0.85, 0.63], [0.15, 0.63],
                ], baseStyle);
                // Diamond eyes
                drawUV(dot(0.35, 0.49, 0.06), filled ? 'opaque-outline' : 'filled');
                drawUV(dot(0.65, 0.49, 0.06), filled ? 'opaque-outline' : 'filled');
                // Inner pupils
                drawUV(dot(0.35, 0.49, 0.02), baseStyle);
                drawUV(dot(0.65, 0.49, 0.02), baseStyle);
                // Wide nose
                drawUV([[0.46, 0.46], [0.54, 0.46], [0.52, 0.42], [0.48, 0.42]], filled ? baseStyle : 'filled');
                // Grimacing mouth
                drawUV([
                    [0.32, 0.56], [0.40, 0.54], [0.50, 0.56],
                    [0.60, 0.54], [0.68, 0.56],
                    [0.60, 0.59], [0.50, 0.6], [0.40, 0.59],
                ], filled ? baseStyle : 'filled');

                // === Zigzag separator (y: 0.30–0.35) ===
                drawUV([
                    [0.15, 0.35], [0.25, 0.30], [0.35, 0.35], [0.45, 0.30],
                    [0.55, 0.35], [0.65, 0.30], [0.75, 0.35], [0.85, 0.30],
                    [0.85, 0.35], [0.15, 0.35],
                ], baseStyle);

                // === Bottom face (y: 0.03–0.30) — slit eyes ===
                // Face frame
                drawUV([
                    [0.15, 0.03], [0.85, 0.03], [0.85, 0.30], [0.15, 0.30],
                ], baseStyle);
                // Slit eyes — narrow horizontal shapes
                drawUV([
                    [0.24, 0.18], [0.35, 0.16], [0.46, 0.18], [0.35, 0.20],
                ], filled ? 'opaque-outline' : 'filled');
                drawUV([
                    [0.54, 0.18], [0.65, 0.16], [0.76, 0.18], [0.65, 0.20],
                ], filled ? 'opaque-outline' : 'filled');
                // Nose
                drawUV([[0.48, 0.15], [0.52, 0.15], [0.50, 0.10]], filled ? baseStyle : 'filled');
                // Mouth — wide thin slit
                drawUV([
                    [0.3, 0.24], [0.7, 0.24], [0.7, 0.27], [0.3, 0.27],
                ], filled ? baseStyle : 'filled');

                if (!filled) {
                    // Extra detail: vertical filled bars on side of each face (ears/decorations)
                    drawUV([[0.17 - 0.015, 0.7], [0.17 + 0.015, 0.7], [0.17 + 0.015, 0.95], [0.17 - 0.015, 0.95]], baseStyle);
                    drawUV([[0.83 - 0.015, 0.7], [0.83 + 0.015, 0.7], [0.83 + 0.015, 0.95], [0.83 - 0.015, 0.95]], baseStyle);
                    drawUV([[0.17 - 0.015, 0.37], [0.17 + 0.015, 0.37], [0.17 + 0.015, 0.61], [0.17 - 0.015, 0.61]], baseStyle);
                    drawUV([[0.83 - 0.015, 0.37], [0.83 + 0.015, 0.37], [0.83 + 0.015, 0.61], [0.83 - 0.015, 0.61]], baseStyle);
                    drawUV([[0.17 - 0.015, 0.05], [0.17 + 0.015, 0.05], [0.17 + 0.015, 0.28], [0.17 - 0.015, 0.28]], baseStyle);
                    drawUV([[0.83 - 0.015, 0.05], [0.83 + 0.015, 0.05], [0.83 + 0.015, 0.28], [0.83 - 0.015, 0.28]], baseStyle);
                }
                break;
            }

            case 4: { // War Dance Figure
                // Head — circle approximation
                drawUV(oval(0.5, 0.82, 0.07, 0.06, 8), baseStyle);

                // Headdress feathers — 3 feathers radiating up
                drawUV([[0.5, 0.88], [0.48, 0.97], [0.52, 0.97]], baseStyle);
                drawUV([[0.44, 0.87], [0.38, 0.96], [0.43, 0.94]], baseStyle);
                drawUV([[0.56, 0.87], [0.62, 0.96], [0.57, 0.94]], baseStyle);

                // Neck
                drawUV([[0.47, 0.76], [0.53, 0.76], [0.53, 0.72], [0.47, 0.72]], baseStyle);

                // Torso — triangular
                drawUV([
                    [0.5, 0.72],
                    [0.65, 0.45],
                    [0.6, 0.42],
                    [0.4, 0.42],
                    [0.35, 0.45],
                ], baseStyle);

                // Waist / loincloth
                drawUV([
                    [0.4, 0.42], [0.6, 0.42], [0.58, 0.37], [0.42, 0.37],
                ], baseStyle);
                // Loincloth fringe
                drawUV([[0.45, 0.37], [0.5, 0.32], [0.55, 0.37]], baseStyle);

                // Right arm — raised up (holding spear)
                drawUV([
                    [0.62, 0.68], [0.65, 0.7],
                    [0.78, 0.82], [0.8, 0.84],
                    [0.82, 0.82], [0.8, 0.80],
                    [0.67, 0.66], [0.64, 0.65],
                ], baseStyle);
                // Spear in right hand — thin filled bar instead of line
                if (filled) {
                    drawUV([[0.8, 0.84], [0.8, 0.98]], baseStyle);
                } else {
                    drawUV([[0.8 - 0.012, 0.84], [0.8 + 0.012, 0.84], [0.8 + 0.012, 0.98], [0.8 - 0.012, 0.98]], baseStyle);
                }
                drawUV([[0.77, 0.95], [0.8, 0.98], [0.83, 0.95]], baseStyle); // spear tip

                // Left arm — extended down holding shield
                drawUV([
                    [0.38, 0.68], [0.35, 0.66],
                    [0.22, 0.56], [0.2, 0.54],
                    [0.18, 0.56], [0.2, 0.58],
                    [0.33, 0.7], [0.36, 0.7],
                ], baseStyle);

                // Small shield in left hand
                drawUV([
                    [0.1, 0.5], [0.2, 0.44], [0.26, 0.52],
                    [0.2, 0.6], [0.1, 0.56],
                ], baseStyle);
                // Shield inner detail
                drawUV(dot(0.18, 0.52, 0.025), filled ? 'opaque-outline' : 'filled');

                // Right leg — forward (running)
                drawUV([
                    [0.52, 0.37], [0.56, 0.37],
                    [0.68, 0.18], [0.72, 0.14],
                    [0.7, 0.12], [0.66, 0.14],
                    [0.54, 0.32], [0.5, 0.35],
                ], baseStyle);
                // Right foot
                drawUV([[0.68, 0.12], [0.76, 0.12], [0.76, 0.14], [0.68, 0.14]], baseStyle);

                // Left leg — back (running)
                drawUV([
                    [0.44, 0.37], [0.48, 0.37],
                    [0.38, 0.18], [0.34, 0.1],
                    [0.32, 0.12], [0.34, 0.14],
                    [0.42, 0.32], [0.42, 0.35],
                ], baseStyle);
                // Left foot
                drawUV([[0.28, 0.1], [0.34, 0.1], [0.34, 0.12], [0.28, 0.12]], baseStyle);

                // Wrist bands
                drawUV([
                    [0.77, 0.79], [0.83, 0.83], [0.82, 0.85], [0.76, 0.81],
                ], filled ? baseStyle : 'filled');
                drawUV([
                    [0.18, 0.53], [0.22, 0.55], [0.21, 0.57], [0.17, 0.55],
                ], filled ? baseStyle : 'filled');

                // Ankle bands
                drawUV(sq(0.71, 0.13, 0.02), filled ? baseStyle : 'filled');
                drawUV(sq(0.33, 0.11, 0.02), filled ? baseStyle : 'filled');

                if (!filled) {
                    // Torso decoration — horizontal filled bars instead of lines
                    drawUV([[0.42, 0.55 - 0.012], [0.58, 0.55 - 0.012], [0.58, 0.55 + 0.012], [0.42, 0.55 + 0.012]], baseStyle);
                    drawUV([[0.43, 0.5 - 0.012], [0.57, 0.5 - 0.012], [0.57, 0.5 + 0.012], [0.43, 0.5 + 0.012]], baseStyle);
                    drawUV([[0.39, 0.6 - 0.012], [0.61, 0.6 - 0.012], [0.61, 0.6 + 0.012], [0.39, 0.6 + 0.012]], baseStyle);
                    // Face features — filled shapes instead of lines
                    // Eyes as small filled dots
                    drawUV(dot(0.48, 0.82, 0.012), baseStyle);
                    drawUV(dot(0.52, 0.82, 0.012), baseStyle);
                    // Mouth as small filled bar
                    drawUV([[0.48, 0.8 - 0.012], [0.52, 0.8 - 0.012], [0.52, 0.8 + 0.012], [0.48, 0.8 + 0.012]], baseStyle);
                }
                break;
            }
        }
    }
};

export default tribalPatterns;
