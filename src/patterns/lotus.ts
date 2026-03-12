import type { PatternSet, PatternContext } from './types';

const lotusPatterns: PatternSet = {
    name: 'Lotus / Indian Floral',
    count: 5,
    draw: (type: number, { drawUV, filled, baseStyle }: PatternContext) => {
        // Helper: convert a 2-point line into a filled band with given width
        const filledLine = (x1: number, y1: number, x2: number, y2: number, w: number = 0.025) => {
            const dx = x2 - x1;
            const dy = y2 - y1;
            const len = Math.sqrt(dx * dx + dy * dy);
            if (len === 0) return;
            const nx = (-dy / len) * w * 0.5;
            const ny = (dx / len) * w * 0.5;
            drawUV([
                [x1 + nx, y1 + ny], [x2 + nx, y2 + ny],
                [x2 - nx, y2 - ny], [x1 - nx, y1 - ny],
            ], baseStyle);
        };

        // Helper: convert a multi-point polyline into a filled band
        const filledBand = (pts: [number, number][], w: number = 0.025) => {
            const half = w * 0.5;
            const left: [number, number][] = [];
            const right: [number, number][] = [];
            for (let i = 0; i < pts.length; i++) {
                let nx: number, ny: number;
                if (i === 0) {
                    const dx = pts[1][0] - pts[0][0];
                    const dy = pts[1][1] - pts[0][1];
                    const len = Math.sqrt(dx * dx + dy * dy) || 1;
                    nx = -dy / len; ny = dx / len;
                } else if (i === pts.length - 1) {
                    const dx = pts[i][0] - pts[i - 1][0];
                    const dy = pts[i][1] - pts[i - 1][1];
                    const len = Math.sqrt(dx * dx + dy * dy) || 1;
                    nx = -dy / len; ny = dx / len;
                } else {
                    const dx1 = pts[i][0] - pts[i - 1][0];
                    const dy1 = pts[i][1] - pts[i - 1][1];
                    const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1) || 1;
                    const dx2 = pts[i + 1][0] - pts[i][0];
                    const dy2 = pts[i + 1][1] - pts[i][1];
                    const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2) || 1;
                    nx = (-dy1 / len1 + -dy2 / len2) * 0.5;
                    ny = (dx1 / len1 + dx2 / len2) * 0.5;
                    const nlen = Math.sqrt(nx * nx + ny * ny) || 1;
                    nx /= nlen; ny /= nlen;
                }
                left.push([pts[i][0] + nx * half, pts[i][1] + ny * half]);
                right.push([pts[i][0] - nx * half, pts[i][1] - ny * half]);
            }
            right.reverse();
            drawUV([...left, ...right], baseStyle);
        };

        // Helper: tapered vein — wider at base (first point), thinner at tip (last point)
        const taperedVein = (pts: [number, number][], baseW: number = 0.03, tipW: number = 0.008) => {
            const left: [number, number][] = [];
            const right: [number, number][] = [];
            for (let i = 0; i < pts.length; i++) {
                const t = pts.length > 1 ? i / (pts.length - 1) : 0;
                const w = (baseW * (1 - t) + tipW * t) * 0.5;
                let nx: number, ny: number;
                if (i === 0) {
                    const dx = pts[1][0] - pts[0][0];
                    const dy = pts[1][1] - pts[0][1];
                    const len = Math.sqrt(dx * dx + dy * dy) || 1;
                    nx = -dy / len; ny = dx / len;
                } else if (i === pts.length - 1) {
                    const dx = pts[i][0] - pts[i - 1][0];
                    const dy = pts[i][1] - pts[i - 1][1];
                    const len = Math.sqrt(dx * dx + dy * dy) || 1;
                    nx = -dy / len; ny = dx / len;
                } else {
                    const dx1 = pts[i][0] - pts[i - 1][0];
                    const dy1 = pts[i][1] - pts[i - 1][1];
                    const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1) || 1;
                    const dx2 = pts[i + 1][0] - pts[i][0];
                    const dy2 = pts[i + 1][1] - pts[i][1];
                    const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2) || 1;
                    nx = (-dy1 / len1 + -dy2 / len2) * 0.5;
                    ny = (dx1 / len1 + dx2 / len2) * 0.5;
                    const nlen = Math.sqrt(nx * nx + ny * ny) || 1;
                    nx /= nlen; ny /= nlen;
                }
                left.push([pts[i][0] + nx * w, pts[i][1] + ny * w]);
                right.push([pts[i][0] - nx * w, pts[i][1] - ny * w]);
            }
            right.reverse();
            drawUV([...left, ...right], baseStyle);
        };

        switch (type) {
            case 0: { // Lotus bloom — full flower with petals, veins, and center
                // Background fill behind flower
                drawUV([
                    [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0],
                ], 'opaque-outline');

                // Main large petal
                drawUV([
                    [0.5, 0.02],
                    [0.62, 0.12],
                    [0.73, 0.28],
                    [0.76, 0.45],
                    [0.72, 0.62],
                    [0.6, 0.8],
                    [0.5, 0.92],
                    [0.4, 0.8],
                    [0.28, 0.62],
                    [0.24, 0.45],
                    [0.27, 0.28],
                    [0.38, 0.12],
                ], baseStyle);
                // Left side petal peeking out
                drawUV([
                    [0.08, 0.25],
                    [0.18, 0.2],
                    [0.28, 0.32],
                    [0.3, 0.5],
                    [0.24, 0.65],
                    [0.12, 0.6],
                    [0.05, 0.45],
                ], baseStyle);
                // Right side petal peeking out
                drawUV([
                    [0.92, 0.25],
                    [0.82, 0.2],
                    [0.72, 0.32],
                    [0.7, 0.5],
                    [0.76, 0.65],
                    [0.88, 0.6],
                    [0.95, 0.45],
                ], baseStyle);

                // Second row of smaller petals between existing ones (upper-left and upper-right)
                drawUV([
                    [0.2, 0.15],
                    [0.28, 0.13],
                    [0.35, 0.22],
                    [0.34, 0.38],
                    [0.26, 0.42],
                    [0.18, 0.35],
                    [0.16, 0.25],
                ], baseStyle);
                drawUV([
                    [0.8, 0.15],
                    [0.72, 0.13],
                    [0.65, 0.22],
                    [0.66, 0.38],
                    [0.74, 0.42],
                    [0.82, 0.35],
                    [0.84, 0.25],
                ], baseStyle);

                // Center dot (larger)
                drawUV([
                    [0.46, 0.41], [0.54, 0.41],
                    [0.56, 0.48], [0.54, 0.55],
                    [0.46, 0.55], [0.44, 0.48],
                ], baseStyle);

                // Ring of small dots around the center (8 dots)
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    const cu = 0.5 + 0.1 * Math.cos(angle);
                    const cv = 0.48 + 0.1 * Math.sin(angle);
                    drawUV([
                        [cu - 0.016, cv - 0.016], [cu + 0.016, cv - 0.016],
                        [cu + 0.016, cv + 0.016], [cu - 0.016, cv + 0.016],
                    ], baseStyle);
                }

                if (!filled) {
                    // Vein lines inside main petal (center spine) — tapered filled shape
                    taperedVein([[0.5, 0.08], [0.5, 0.88]], 0.035, 0.012);
                    // Main petal side veins — tapered from spine outward
                    taperedVein([[0.5, 0.2], [0.36, 0.42]], 0.028, 0.008);
                    taperedVein([[0.5, 0.2], [0.64, 0.42]], 0.028, 0.008);
                    taperedVein([[0.5, 0.35], [0.38, 0.55]], 0.028, 0.008);
                    taperedVein([[0.5, 0.35], [0.62, 0.55]], 0.028, 0.008);
                    taperedVein([[0.5, 0.5], [0.42, 0.68]], 0.028, 0.008);
                    taperedVein([[0.5, 0.5], [0.58, 0.68]], 0.028, 0.008);
                    taperedVein([[0.5, 0.6], [0.44, 0.78]], 0.028, 0.008);
                    taperedVein([[0.5, 0.6], [0.56, 0.78]], 0.028, 0.008);

                    // Left petal veins — tapered
                    taperedVein([[0.17, 0.25], [0.17, 0.42]], 0.025, 0.008);
                    taperedVein([[0.17, 0.32], [0.1, 0.45]], 0.025, 0.008);
                    taperedVein([[0.17, 0.32], [0.25, 0.5]], 0.025, 0.008);
                    taperedVein([[0.17, 0.4], [0.12, 0.55]], 0.025, 0.008);
                    taperedVein([[0.17, 0.4], [0.24, 0.58]], 0.025, 0.008);

                    // Right petal veins — tapered
                    taperedVein([[0.83, 0.25], [0.83, 0.42]], 0.025, 0.008);
                    taperedVein([[0.83, 0.32], [0.9, 0.45]], 0.025, 0.008);
                    taperedVein([[0.83, 0.32], [0.75, 0.5]], 0.025, 0.008);
                    taperedVein([[0.83, 0.4], [0.88, 0.55]], 0.025, 0.008);
                    taperedVein([[0.83, 0.4], [0.76, 0.58]], 0.025, 0.008);

                    // Scallop decoration along main petal edges (left side) — filled
                    for (let i = 0; i < 5; i++) {
                        const t = 0.15 + i * 0.15;
                        const lu = 0.24 + 0.14 * t;
                        const lv = 0.15 + t * 0.7;
                        drawUV([
                            [lu - 0.04, lv], [lu - 0.02, lv + 0.04],
                            [lu, lv], [lu - 0.02, lv - 0.04],
                        ], baseStyle);
                    }
                    // Scallop decoration (right side) — filled
                    for (let i = 0; i < 5; i++) {
                        const t = 0.15 + i * 0.15;
                        const ru = 0.76 - 0.14 * t;
                        const rv = 0.15 + t * 0.7;
                        drawUV([
                            [ru + 0.04, rv], [ru + 0.02, rv + 0.04],
                            [ru, rv], [ru + 0.02, rv - 0.04],
                        ], baseStyle);
                    }

                    // Inner filled band around center
                    drawUV([
                        [0.5, 0.3],
                        [0.6, 0.38],
                        [0.62, 0.48],
                        [0.6, 0.58],
                        [0.5, 0.65],
                        [0.4, 0.58],
                        [0.38, 0.48],
                        [0.4, 0.38],
                    ], baseStyle);

                    // Outer filled band around main petal
                    drawUV([
                        [0.5, 0.05],
                        [0.64, 0.14],
                        [0.75, 0.3],
                        [0.78, 0.47],
                        [0.74, 0.64],
                        [0.62, 0.82],
                        [0.5, 0.94],
                        [0.38, 0.82],
                        [0.26, 0.64],
                        [0.22, 0.47],
                        [0.25, 0.3],
                        [0.36, 0.14],
                    ], baseStyle);

                    // Extra decorative filled diamonds along center spine
                    for (let i = 0; i < 6; i++) {
                        const dv = 0.15 + i * 0.12;
                        drawUV([
                            [0.5, dv - 0.022], [0.522, dv],
                            [0.5, dv + 0.022], [0.478, dv],
                        ], 'filled');
                    }

                    // Filled rectangles at petal tips
                    drawUV([
                        [0.46, 0.02], [0.54, 0.02],
                        [0.54, 0.06], [0.46, 0.06],
                    ], baseStyle);
                    drawUV([
                        [0.04, 0.4], [0.12, 0.4],
                        [0.12, 0.44], [0.04, 0.44],
                    ], baseStyle);
                    drawUV([
                        [0.88, 0.4], [0.96, 0.4],
                        [0.96, 0.44], [0.88, 0.44],
                    ], baseStyle);

                    // Cross-hatching in side petals — filled bands
                    filledLine(0.1, 0.28, 0.22, 0.55, 0.025);
                    filledLine(0.22, 0.28, 0.1, 0.55, 0.025);
                    filledLine(0.78, 0.28, 0.9, 0.55, 0.025);
                    filledLine(0.9, 0.28, 0.78, 0.55, 0.025);

                    // Larger filled dots on side petal centers
                    drawUV([
                        [0.14, 0.38], [0.2, 0.42],
                        [0.16, 0.46], [0.1, 0.42],
                    ], 'filled');
                    drawUV([
                        [0.82, 0.38], [0.88, 0.42],
                        [0.84, 0.46], [0.8, 0.42],
                    ], 'filled');
                }
                // Dot above flower tip
                drawUV([
                    [0.48, 0.95], [0.52, 0.95],
                    [0.52, 0.99], [0.48, 0.99],
                ], baseStyle);
                break;
            }

            case 1: { // Paisley — large detailed teardrop with concentric layers
                // Background fill
                drawUV([
                    [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0],
                ], 'opaque-outline');

                // Outer paisley shape
                drawUV([
                    [0.55, 0.05],
                    [0.7, 0.12],
                    [0.82, 0.25],
                    [0.88, 0.42],
                    [0.85, 0.58],
                    [0.75, 0.72],
                    [0.6, 0.82],
                    [0.45, 0.88],
                    [0.3, 0.85],
                    [0.2, 0.72],
                    [0.15, 0.55],
                    [0.18, 0.38],
                    [0.28, 0.22],
                    [0.42, 0.1],
                ], baseStyle);
                // First inner concentric — filled
                drawUV([
                    [0.52, 0.15],
                    [0.64, 0.2],
                    [0.74, 0.32],
                    [0.78, 0.45],
                    [0.74, 0.58],
                    [0.64, 0.68],
                    [0.5, 0.75],
                    [0.36, 0.72],
                    [0.27, 0.6],
                    [0.24, 0.45],
                    [0.28, 0.32],
                    [0.4, 0.18],
                ], baseStyle);
                // Second inner concentric — filled
                drawUV([
                    [0.5, 0.28],
                    [0.6, 0.32],
                    [0.66, 0.42],
                    [0.65, 0.53],
                    [0.58, 0.62],
                    [0.48, 0.65],
                    [0.38, 0.6],
                    [0.34, 0.48],
                    [0.37, 0.36],
                    [0.44, 0.3],
                ], baseStyle);
                // Third inner concentric — filled
                drawUV([
                    [0.49, 0.38],
                    [0.56, 0.4],
                    [0.58, 0.48],
                    [0.55, 0.55],
                    [0.48, 0.56],
                    [0.42, 0.52],
                    [0.42, 0.44],
                    [0.45, 0.39],
                ], baseStyle);
                // Curling tip
                drawUV([
                    [0.55, 0.02], [0.62, 0.04],
                    [0.68, 0.08], [0.65, 0.14],
                    [0.58, 0.12],
                ], baseStyle);

                // Small leaf shapes along outer curve (both modes)
                const leafPositions: [number, number, number][] = [
                    [0.82, 0.32, -0.5], [0.86, 0.5, -0.3],
                    [0.8, 0.65, 0.3], [0.68, 0.77, 0.7],
                    [0.52, 0.85, 1.0], [0.35, 0.83, 1.3],
                ];
                for (const [lu, lv, a] of leafPositions) {
                    const dx = 0.04 * Math.cos(a);
                    const dy = 0.04 * Math.sin(a);
                    drawUV([
                        [lu, lv],
                        [lu + dx - dy * 0.4, lv + dy + dx * 0.4],
                        [lu + dx * 2, lv + dy * 2],
                        [lu + dx + dy * 0.4, lv + dy - dx * 0.4],
                    ], baseStyle);
                }

                if (!filled) {
                    // Row of filled dots along inner curve
                    for (let i = 0; i < 7; i++) {
                        const t = 0.15 + i * 0.11;
                        const du = 0.22 + 0.12 * Math.sin(t * Math.PI);
                        const dv = 0.28 + t * 0.55;
                        drawUV([
                            [du - 0.018, dv], [du + 0.018, dv],
                            [du + 0.018, dv + 0.035], [du - 0.018, dv + 0.035],
                        ], baseStyle);
                    }
                    // Second row of filled dots along outer curve
                    for (let i = 0; i < 7; i++) {
                        const t = 0.15 + i * 0.11;
                        const du = 0.78 - 0.12 * Math.sin(t * Math.PI);
                        const dv = 0.25 + t * 0.55;
                        drawUV([
                            [du - 0.018, dv], [du + 0.018, dv],
                            [du + 0.018, dv + 0.035], [du - 0.018, dv + 0.035],
                        ], baseStyle);
                    }
                    // Third row of filled dots in center
                    for (let i = 0; i < 4; i++) {
                        const dv = 0.38 + i * 0.07;
                        drawUV([
                            [0.48, dv], [0.52, dv],
                            [0.52, dv + 0.03], [0.48, dv + 0.03],
                        ], baseStyle);
                    }

                    // Mesh/grid fill inside paisley — filled bands
                    for (let row = 0; row < 6; row++) {
                        const v = 0.3 + row * 0.08;
                        const leftU = 0.28 + 0.06 * Math.sin((v - 0.3) * 5);
                        const rightU = 0.72 - 0.06 * Math.sin((v - 0.3) * 5);
                        filledLine(leftU, v, rightU, v, 0.025);
                    }
                    for (let col = 0; col < 5; col++) {
                        const u = 0.35 + col * 0.07;
                        filledLine(u, 0.25, u + 0.02, 0.72, 0.025);
                    }

                    // Spiral at the curling tip — filled band
                    filledBand([
                        [0.56, 0.07], [0.6, 0.06], [0.64, 0.08],
                        [0.63, 0.12], [0.59, 0.13], [0.57, 0.1],
                    ], 0.025);
                    drawUV([
                        [0.58, 0.08], [0.61, 0.09],
                        [0.61, 0.11], [0.59, 0.11],
                    ], baseStyle);

                    // Filled band between outer and first inner
                    drawUV([
                        [0.53, 0.1],
                        [0.67, 0.16],
                        [0.78, 0.28],
                        [0.83, 0.44],
                        [0.8, 0.58],
                        [0.7, 0.7],
                        [0.55, 0.78],
                        [0.4, 0.82],
                        [0.28, 0.78],
                        [0.22, 0.66],
                        [0.18, 0.5],
                        [0.2, 0.36],
                        [0.3, 0.24],
                        [0.44, 0.13],
                    ], baseStyle);

                    // Outermost filled band (tighter to outer shape)
                    drawUV([
                        [0.54, 0.07],
                        [0.69, 0.13],
                        [0.8, 0.26],
                        [0.86, 0.43],
                        [0.83, 0.57],
                        [0.74, 0.71],
                        [0.59, 0.81],
                        [0.44, 0.86],
                        [0.31, 0.84],
                        [0.21, 0.71],
                        [0.16, 0.54],
                        [0.19, 0.37],
                        [0.29, 0.23],
                        [0.43, 0.11],
                    ], baseStyle);

                    // Extra filled diamonds along outer curve (both modes)
                    for (let i = 0; i < 8; i++) {
                        const t = 0.1 + i * 0.1;
                        const eu = 0.85 - 0.3 * t;
                        const ev = 0.2 + t * 0.65;
                        drawUV([
                            [eu, ev - 0.018], [eu + 0.018, ev],
                            [eu, ev + 0.018], [eu - 0.018, ev],
                        ], 'filled');
                    }
                    for (let i = 0; i < 8; i++) {
                        const t = 0.1 + i * 0.1;
                        const eu = 0.15 + 0.3 * t;
                        const ev = 0.2 + t * 0.65;
                        drawUV([
                            [eu, ev - 0.018], [eu + 0.018, ev],
                            [eu, ev + 0.018], [eu - 0.018, ev],
                        ], 'filled');
                    }

                    // Filled rectangles as decorative bands on inner curves
                    drawUV([
                        [0.34, 0.28], [0.42, 0.28],
                        [0.42, 0.32], [0.34, 0.32],
                    ], baseStyle);
                    drawUV([
                        [0.58, 0.28], [0.66, 0.28],
                        [0.66, 0.32], [0.58, 0.32],
                    ], baseStyle);
                    drawUV([
                        [0.36, 0.62], [0.44, 0.62],
                        [0.44, 0.66], [0.36, 0.66],
                    ], baseStyle);
                    drawUV([
                        [0.56, 0.62], [0.64, 0.62],
                        [0.64, 0.66], [0.56, 0.66],
                    ], baseStyle);

                    // Additional horizontal detail bands across the paisley
                    filledLine(0.25, 0.42, 0.75, 0.42, 0.025);
                    filledLine(0.28, 0.52, 0.72, 0.52, 0.025);
                    filledLine(0.3, 0.62, 0.7, 0.62, 0.025);
                }
                break;
            }

            case 2: { // Temple arch — onion dome with pendant, columns, and steps
                // Background fill
                drawUV([
                    [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0],
                ], 'opaque-outline');

                // Main arch / onion dome shape
                const archPts: [number, number][] = [
                    [0.18, 0.0],
                    [0.18, 0.45],
                ];
                for (let i = 0; i <= 8; i++) {
                    const t = Math.PI * (1 - i / 8);
                    const u = 0.5 + 0.32 * Math.cos(t);
                    const bulge = Math.sin(t) > 0.7 ? 0.08 : 0;
                    const v = 0.52 + 0.38 * Math.sin(t) + bulge;
                    archPts.push([u, v]);
                }
                archPts.push([0.82, 0.45]);
                archPts.push([0.82, 0.0]);
                drawUV(archPts, baseStyle);

                // Left column — filled
                drawUV([
                    [0.18, 0.0], [0.26, 0.0],
                    [0.26, 0.45], [0.18, 0.45],
                ], baseStyle);
                // Right column — filled
                drawUV([
                    [0.74, 0.0], [0.82, 0.0],
                    [0.82, 0.45], [0.74, 0.45],
                ], baseStyle);

                // Left column capital — filled
                drawUV([
                    [0.16, 0.44], [0.28, 0.44],
                    [0.29, 0.48], [0.27, 0.51],
                    [0.22, 0.5], [0.19, 0.51],
                    [0.15, 0.48],
                ], baseStyle);
                // Right column capital — filled
                drawUV([
                    [0.72, 0.44], [0.84, 0.44],
                    [0.85, 0.48], [0.83, 0.51],
                    [0.78, 0.5], [0.75, 0.51],
                    [0.71, 0.48],
                ], baseStyle);

                // Lotus flower at top of dome — filled
                drawUV([
                    [0.5, 0.94], [0.54, 0.9], [0.52, 0.86],
                    [0.5, 0.88], [0.48, 0.86], [0.46, 0.9],
                ], baseStyle);
                // Lotus side petals — filled
                drawUV([
                    [0.46, 0.9], [0.42, 0.88], [0.43, 0.84],
                    [0.47, 0.86],
                ], baseStyle);
                drawUV([
                    [0.54, 0.9], [0.58, 0.88], [0.57, 0.84],
                    [0.53, 0.86],
                ], baseStyle);
                // Finial dot at very top
                drawUV([
                    [0.49, 0.95], [0.51, 0.95],
                    [0.51, 0.98], [0.49, 0.98],
                ], baseStyle);

                // Hanging pendant/bell inside — filled
                drawUV([
                    [0.5, 0.72],
                    [0.56, 0.62],
                    [0.56, 0.52],
                    [0.52, 0.48],
                    [0.48, 0.48],
                    [0.44, 0.52],
                    [0.44, 0.62],
                ], baseStyle);

                // Steps at base
                drawUV([
                    [0.1, 0.0], [0.9, 0.0],
                    [0.9, 0.06], [0.1, 0.06],
                ], baseStyle);
                drawUV([
                    [0.14, 0.06], [0.86, 0.06],
                    [0.86, 0.1], [0.14, 0.1],
                ], baseStyle);
                // Base decoration - additional step
                drawUV([
                    [0.06, 0.0], [0.94, 0.0],
                    [0.94, 0.03], [0.06, 0.03],
                ], baseStyle);

                // Base decoration diamonds — filled
                for (let i = 0; i < 5; i++) {
                    const bx = 0.25 + i * 0.12;
                    drawUV([
                        [bx, 0.03], [bx + 0.025, 0.06],
                        [bx, 0.09], [bx - 0.025, 0.06],
                    ], baseStyle);
                }

                if (!filled) {
                    // Decorative filled dots along the arch
                    for (let i = 1; i <= 7; i++) {
                        const t = Math.PI * (1 - i / 8);
                        const u = 0.5 + 0.28 * Math.cos(t);
                        const v = 0.52 + 0.34 * Math.sin(t);
                        drawUV([
                            [u - 0.018, v - 0.018], [u + 0.018, v - 0.018],
                            [u + 0.018, v + 0.018], [u - 0.018, v + 0.018],
                        ], baseStyle);
                    }
                    // Second row of filled dots (inner)
                    for (let i = 1; i <= 5; i++) {
                        const t = Math.PI * (1 - i / 6);
                        const u = 0.5 + 0.2 * Math.cos(t);
                        const v = 0.52 + 0.26 * Math.sin(t);
                        drawUV([
                            [u - 0.018, v - 0.018], [u + 0.018, v - 0.018],
                            [u + 0.018, v + 0.018], [u - 0.018, v + 0.018],
                        ], baseStyle);
                    }

                    // Horizontal filled bands across the arch
                    filledLine(0.26, 0.5, 0.74, 0.5, 0.03);
                    filledLine(0.24, 0.55, 0.76, 0.55, 0.03);
                    filledLine(0.22, 0.6, 0.78, 0.6, 0.03);
                    filledLine(0.26, 0.65, 0.74, 0.65, 0.03);
                    filledLine(0.3, 0.7, 0.7, 0.7, 0.03);
                    filledLine(0.35, 0.75, 0.65, 0.75, 0.03);
                    filledLine(0.4, 0.8, 0.6, 0.8, 0.03);

                    // Column fluting — filled bands (left column)
                    filledLine(0.2, 0.1, 0.2, 0.44, 0.025);
                    filledLine(0.22, 0.1, 0.22, 0.44, 0.025);
                    filledLine(0.24, 0.1, 0.24, 0.44, 0.025);
                    // Column fluting — filled bands (right column)
                    filledLine(0.76, 0.1, 0.76, 0.44, 0.025);
                    filledLine(0.78, 0.1, 0.78, 0.44, 0.025);
                    filledLine(0.8, 0.1, 0.8, 0.44, 0.025);

                    // Inner arch filled band
                    const innerArch: [number, number][] = [[0.26, 0.45]];
                    for (let i = 0; i <= 8; i++) {
                        const t = Math.PI * (1 - i / 8);
                        const u = 0.5 + 0.24 * Math.cos(t);
                        const bulge = Math.sin(t) > 0.7 ? 0.06 : 0;
                        const v = 0.52 + 0.3 * Math.sin(t) + bulge;
                        innerArch.push([u, v]);
                    }
                    innerArch.push([0.74, 0.45]);
                    drawUV(innerArch, baseStyle);

                    // Pendant decoration — filled bands
                    filledLine(0.46, 0.55, 0.54, 0.55, 0.03);
                    filledLine(0.47, 0.6, 0.53, 0.6, 0.03);

                    // Outer arch filled band
                    const outerArchBand: [number, number][] = [[0.16, 0.45]];
                    for (let i = 0; i <= 8; i++) {
                        const t = Math.PI * (1 - i / 8);
                        const u = 0.5 + 0.34 * Math.cos(t);
                        const bulge = Math.sin(t) > 0.7 ? 0.09 : 0;
                        const v = 0.52 + 0.4 * Math.sin(t) + bulge;
                        outerArchBand.push([u, v]);
                    }
                    outerArchBand.push([0.84, 0.45]);
                    drawUV(outerArchBand, baseStyle);

                    // Filled diamonds along the arch curve
                    for (let i = 1; i <= 6; i++) {
                        const t = Math.PI * (1 - i / 7);
                        const u = 0.5 + 0.31 * Math.cos(t);
                        const v = 0.52 + 0.37 * Math.sin(t);
                        drawUV([
                            [u, v - 0.022], [u + 0.022, v],
                            [u, v + 0.022], [u - 0.022, v],
                        ], 'filled');
                    }

                    // Filled rectangles on columns
                    drawUV([
                        [0.19, 0.15], [0.25, 0.15],
                        [0.25, 0.22], [0.19, 0.22],
                    ], baseStyle);
                    drawUV([
                        [0.19, 0.32], [0.25, 0.32],
                        [0.25, 0.39], [0.19, 0.39],
                    ], baseStyle);
                    drawUV([
                        [0.75, 0.15], [0.81, 0.15],
                        [0.81, 0.22], [0.75, 0.22],
                    ], baseStyle);
                    drawUV([
                        [0.75, 0.32], [0.81, 0.32],
                        [0.81, 0.39], [0.75, 0.39],
                    ], baseStyle);

                    // Extra pendant filled band
                    drawUV([
                        [0.5, 0.74],
                        [0.58, 0.63],
                        [0.58, 0.51],
                        [0.54, 0.46],
                        [0.46, 0.46],
                        [0.42, 0.51],
                        [0.42, 0.63],
                    ], baseStyle);

                    // Filled dots on the steps
                    for (let i = 0; i < 7; i++) {
                        const bx = 0.2 + i * 0.1;
                        drawUV([
                            [bx, 0.005], [bx + 0.018, 0.02],
                            [bx, 0.035], [bx - 0.018, 0.02],
                        ], 'filled');
                    }

                    // Cross-hatching inside arch — filled bands
                    for (let row = 0; row < 4; row++) {
                        const v = 0.52 + row * 0.06;
                        const hw = 0.22 - row * 0.04;
                        filledLine(0.5 - hw, v, 0.5 + hw, v, 0.025);
                    }
                }
                break;
            }

            case 3: { // Mango/boteh — kidney shape with internal decoration
                // Background fill
                drawUV([
                    [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0],
                ], 'opaque-outline');

                // Outer mango shape
                drawUV([
                    [0.5, 0.95],
                    [0.62, 0.88],
                    [0.72, 0.75],
                    [0.78, 0.58],
                    [0.76, 0.4],
                    [0.68, 0.25],
                    [0.55, 0.12],
                    [0.45, 0.08],
                    [0.35, 0.12],
                    [0.28, 0.22],
                    [0.22, 0.38],
                    [0.22, 0.55],
                    [0.28, 0.7],
                    [0.38, 0.85],
                ], baseStyle);

                // Crown of small leaves/dots at top — tapered filled veins
                taperedVein([[0.42, 0.06], [0.5, 0.0], [0.58, 0.06]], 0.03, 0.01);
                taperedVein([[0.38, 0.1], [0.44, 0.02], [0.5, 0.0]], 0.03, 0.01);
                taperedVein([[0.5, 0.0], [0.56, 0.02], [0.62, 0.1]], 0.03, 0.01);

                // Central spine — tapered filled shape (both modes)
                taperedVein([[0.48, 0.15], [0.45, 0.5], [0.48, 0.85]], 0.04, 0.012);

                // Small leaf shapes along outer edge (both modes) — filled
                const mangoLeaves: [number, number, number][] = [
                    [0.75, 0.5, -0.3], [0.73, 0.65, 0.5],
                    [0.65, 0.78, 0.9], [0.54, 0.9, 1.2],
                    [0.24, 0.48, 2.8], [0.25, 0.62, 2.3],
                ];
                for (const [lu, lv, a] of mangoLeaves) {
                    const dx = 0.035 * Math.cos(a);
                    const dy = 0.035 * Math.sin(a);
                    drawUV([
                        [lu, lv],
                        [lu + dx - dy * 0.4, lv + dy + dx * 0.4],
                        [lu + dx * 2, lv + dy * 2],
                        [lu + dx + dy * 0.4, lv + dy - dx * 0.4],
                    ], baseStyle);
                }

                // Spiral at the top curl — filled
                drawUV([
                    [0.5, 0.02], [0.54, 0.01], [0.57, 0.03],
                    [0.56, 0.06], [0.52, 0.06], [0.5, 0.04],
                ], baseStyle);

                if (!filled) {
                    // Internal parallel curved bands — filled
                    filledBand([
                        [0.48, 0.82],
                        [0.58, 0.72],
                        [0.64, 0.55],
                        [0.62, 0.38],
                        [0.52, 0.22],
                    ], 0.03);
                    filledBand([
                        [0.42, 0.75],
                        [0.52, 0.65],
                        [0.56, 0.5],
                        [0.54, 0.35],
                        [0.47, 0.25],
                    ], 0.03);
                    // Additional inner curved band — filled
                    filledBand([
                        [0.38, 0.68],
                        [0.46, 0.58],
                        [0.48, 0.45],
                        [0.46, 0.32],
                        [0.42, 0.22],
                    ], 0.03);

                    // Cross-hatching — filled bands
                    for (let i = 0; i < 6; i++) {
                        const v = 0.22 + i * 0.1;
                        filledLine(0.32, v, 0.58, v + 0.08, 0.022);
                        filledLine(0.58, v, 0.32, v + 0.08, 0.022);
                    }

                    // Interior seed/dot pattern — filled diamonds
                    for (let row = 0; row < 5; row++) {
                        const rv = 0.28 + row * 0.12;
                        for (let col = 0; col < 3; col++) {
                            const ru = 0.38 + col * 0.08;
                            drawUV([
                                [ru, rv - 0.018], [ru + 0.018, rv],
                                [ru, rv + 0.018], [ru - 0.018, rv],
                            ], baseStyle);
                        }
                    }

                    // Inner filled band
                    drawUV([
                        [0.48, 0.85],
                        [0.58, 0.78],
                        [0.67, 0.65],
                        [0.72, 0.5],
                        [0.7, 0.35],
                        [0.62, 0.22],
                        [0.52, 0.14],
                        [0.42, 0.12],
                        [0.34, 0.16],
                        [0.28, 0.28],
                        [0.26, 0.42],
                        [0.26, 0.58],
                        [0.32, 0.72],
                        [0.4, 0.82],
                    ], baseStyle);

                    // Outer filled band (close to edge)
                    drawUV([
                        [0.5, 0.93],
                        [0.64, 0.86],
                        [0.74, 0.73],
                        [0.8, 0.56],
                        [0.78, 0.38],
                        [0.7, 0.23],
                        [0.57, 0.1],
                        [0.43, 0.06],
                        [0.33, 0.1],
                        [0.26, 0.2],
                        [0.2, 0.36],
                        [0.2, 0.53],
                        [0.26, 0.68],
                        [0.36, 0.83],
                    ], baseStyle);

                    // Filled diamonds along the spine
                    for (let i = 0; i < 7; i++) {
                        const dv = 0.2 + i * 0.09;
                        drawUV([
                            [0.47, dv - 0.018], [0.49, dv],
                            [0.47, dv + 0.018], [0.45, dv],
                        ], 'filled');
                    }

                    // Filled rectangles as decorative elements
                    drawUV([
                        [0.56, 0.3], [0.64, 0.3],
                        [0.64, 0.34], [0.56, 0.34],
                    ], baseStyle);
                    drawUV([
                        [0.58, 0.45], [0.66, 0.45],
                        [0.66, 0.49], [0.58, 0.49],
                    ], baseStyle);
                    drawUV([
                        [0.56, 0.6], [0.64, 0.6],
                        [0.64, 0.64], [0.56, 0.64],
                    ], baseStyle);

                    // Filled dots along outer edge
                    const edgeDots: [number, number][] = [
                        [0.76, 0.42], [0.77, 0.55], [0.73, 0.68],
                        [0.66, 0.77], [0.56, 0.87], [0.3, 0.78],
                        [0.24, 0.63], [0.23, 0.48], [0.24, 0.33],
                        [0.3, 0.2], [0.4, 0.1],
                    ];
                    for (const [eu, ev] of edgeDots) {
                        drawUV([
                            [eu, ev - 0.015], [eu + 0.015, ev],
                            [eu, ev + 0.015], [eu - 0.015, ev],
                        ], 'filled');
                    }

                    // Additional cross-hatch bands
                    filledLine(0.3, 0.3, 0.55, 0.18, 0.025);
                    filledLine(0.3, 0.5, 0.6, 0.35, 0.025);
                    filledLine(0.3, 0.7, 0.55, 0.55, 0.025);
                } else {
                    // Inner filled shape
                    drawUV([
                        [0.48, 0.8],
                        [0.58, 0.7],
                        [0.64, 0.55],
                        [0.62, 0.38],
                        [0.52, 0.22],
                        [0.42, 0.2],
                        [0.34, 0.32],
                        [0.32, 0.5],
                        [0.36, 0.68],
                    ], baseStyle);
                }
                break;
            }

            case 4: { // Chain of bells — two bells connected by chain
                // Background fill
                drawUV([
                    [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0],
                ], 'opaque-outline');

                // Left bell dome
                const leftBell: [number, number][] = [[0.12, 0.35]];
                for (let i = 0; i <= 6; i++) {
                    const t = Math.PI * (i / 6);
                    leftBell.push([0.25 + 0.13 * Math.cos(t), 0.6 + 0.2 * Math.sin(t)]);
                }
                leftBell.push([0.38, 0.35]);
                // Flared bottom
                leftBell.push([0.4, 0.3]);
                leftBell.push([0.4, 0.2]);
                leftBell.push([0.38, 0.15]);
                leftBell.push([0.12, 0.15]);
                leftBell.push([0.1, 0.2]);
                leftBell.push([0.1, 0.3]);
                drawUV(leftBell, baseStyle);

                // Left bell clapper — filled
                drawUV([
                    [0.23, 0.2], [0.27, 0.2],
                    [0.28, 0.27], [0.25, 0.33],
                    [0.22, 0.27],
                ], baseStyle);
                // Left clapper rod — filled band
                filledLine(0.25, 0.33, 0.25, 0.5, 0.025);

                // Right bell dome
                const rightBell: [number, number][] = [[0.62, 0.35]];
                for (let i = 0; i <= 6; i++) {
                    const t = Math.PI * (i / 6);
                    rightBell.push([0.75 + 0.13 * Math.cos(t), 0.6 + 0.2 * Math.sin(t)]);
                }
                rightBell.push([0.88, 0.35]);
                rightBell.push([0.9, 0.3]);
                rightBell.push([0.9, 0.2]);
                rightBell.push([0.88, 0.15]);
                rightBell.push([0.62, 0.15]);
                rightBell.push([0.6, 0.2]);
                rightBell.push([0.6, 0.3]);
                drawUV(rightBell, baseStyle);

                // Right bell clapper — filled
                drawUV([
                    [0.73, 0.2], [0.77, 0.2],
                    [0.78, 0.27], [0.75, 0.33],
                    [0.72, 0.27],
                ], baseStyle);
                // Right clapper rod — filled band
                filledLine(0.75, 0.33, 0.75, 0.5, 0.025);

                // Decorative bands around bell bodies — filled
                // Left bell bands
                drawUV([
                    [0.12, 0.3], [0.38, 0.3],
                    [0.38, 0.33], [0.12, 0.33],
                ], baseStyle);
                drawUV([
                    [0.14, 0.4], [0.36, 0.4],
                    [0.36, 0.43], [0.14, 0.43],
                ], baseStyle);
                drawUV([
                    [0.17, 0.5], [0.33, 0.5],
                    [0.33, 0.53], [0.17, 0.53],
                ], baseStyle);
                // Right bell bands
                drawUV([
                    [0.62, 0.3], [0.88, 0.3],
                    [0.88, 0.33], [0.62, 0.33],
                ], baseStyle);
                drawUV([
                    [0.64, 0.4], [0.86, 0.4],
                    [0.86, 0.43], [0.64, 0.43],
                ], baseStyle);
                drawUV([
                    [0.67, 0.5], [0.83, 0.5],
                    [0.83, 0.53], [0.67, 0.53],
                ], baseStyle);

                // Chain links connecting the bells at top — filled
                for (let i = 0; i < 5; i++) {
                    const cx = 0.4 + i * 0.045;
                    drawUV([
                        [cx, 0.72], [cx + 0.035, 0.72],
                        [cx + 0.035, 0.78], [cx, 0.78],
                    ], baseStyle);
                }
                // Chain connectors — filled bands
                for (let i = 0; i < 4; i++) {
                    const cx = 0.4 + i * 0.045;
                    filledLine(cx + 0.035, 0.75, cx + 0.045, 0.75, 0.025);
                }

                // Decorative finials on top of each bell
                drawUV([[0.25, 0.8], [0.23, 0.85], [0.27, 0.85]], baseStyle);
                drawUV([[0.75, 0.8], [0.73, 0.85], [0.77, 0.85]], baseStyle);

                // Sound lines radiating from bells — filled bands
                // Left bell sound lines
                filledLine(0.06, 0.25, 0.02, 0.22, 0.02);
                filledLine(0.06, 0.3, 0.01, 0.3, 0.02);
                filledLine(0.06, 0.35, 0.02, 0.38, 0.02);
                filledLine(0.08, 0.22, 0.05, 0.18, 0.02);
                filledLine(0.08, 0.38, 0.05, 0.42, 0.02);
                // Right bell sound lines
                filledLine(0.94, 0.25, 0.98, 0.22, 0.02);
                filledLine(0.94, 0.3, 0.99, 0.3, 0.02);
                filledLine(0.94, 0.35, 0.98, 0.38, 0.02);
                filledLine(0.92, 0.22, 0.95, 0.18, 0.02);
                filledLine(0.92, 0.38, 0.95, 0.42, 0.02);

                // Hanging tassels below bells — filled bands
                // Left tassel
                filledLine(0.25, 0.15, 0.25, 0.06, 0.025);
                drawUV([
                    [0.22, 0.06], [0.28, 0.06],
                    [0.27, 0.02], [0.23, 0.02],
                ], baseStyle);
                filledLine(0.23, 0.02, 0.22, 0.0, 0.02);
                filledLine(0.25, 0.02, 0.25, 0.0, 0.02);
                filledLine(0.27, 0.02, 0.28, 0.0, 0.02);
                // Right tassel
                filledLine(0.75, 0.15, 0.75, 0.06, 0.025);
                drawUV([
                    [0.72, 0.06], [0.78, 0.06],
                    [0.77, 0.02], [0.73, 0.02],
                ], baseStyle);
                filledLine(0.73, 0.02, 0.72, 0.0, 0.02);
                filledLine(0.75, 0.02, 0.75, 0.0, 0.02);
                filledLine(0.77, 0.02, 0.78, 0.0, 0.02);

                if (!filled) {
                    // Additional bell body detail — filled bands
                    filledLine(0.15, 0.25, 0.35, 0.25, 0.025);
                    filledLine(0.19, 0.46, 0.31, 0.46, 0.025);
                    filledLine(0.65, 0.25, 0.85, 0.25, 0.025);
                    filledLine(0.69, 0.46, 0.81, 0.46, 0.025);

                    // Sound wave arcs — filled bands
                    filledBand([
                        [0.04, 0.2], [0.02, 0.25], [0.01, 0.3],
                        [0.02, 0.35], [0.04, 0.4],
                    ], 0.025);
                    filledBand([
                        [0.96, 0.2], [0.98, 0.25], [0.99, 0.3],
                        [0.98, 0.35], [0.96, 0.4],
                    ], 0.025);

                    // Filled dots on bell bodies
                    for (let i = 0; i < 3; i++) {
                        const dv = 0.35 + i * 0.06;
                        const spread = 0.06 - i * 0.015;
                        // Left bell dots — filled
                        drawUV([
                            [0.25 - 0.013, dv], [0.25 + 0.013, dv],
                            [0.25 + 0.013, dv + 0.025], [0.25 - 0.013, dv + 0.025],
                        ], baseStyle);
                        drawUV([
                            [0.25 - spread - 0.013, dv], [0.25 - spread + 0.013, dv],
                            [0.25 - spread + 0.013, dv + 0.025], [0.25 - spread - 0.013, dv + 0.025],
                        ], baseStyle);
                        drawUV([
                            [0.25 + spread - 0.013, dv], [0.25 + spread + 0.013, dv],
                            [0.25 + spread + 0.013, dv + 0.025], [0.25 + spread - 0.013, dv + 0.025],
                        ], baseStyle);
                        // Right bell dots — filled
                        drawUV([
                            [0.75 - 0.013, dv], [0.75 + 0.013, dv],
                            [0.75 + 0.013, dv + 0.025], [0.75 - 0.013, dv + 0.025],
                        ], baseStyle);
                        drawUV([
                            [0.75 - spread - 0.013, dv], [0.75 - spread + 0.013, dv],
                            [0.75 - spread + 0.013, dv + 0.025], [0.75 - spread - 0.013, dv + 0.025],
                        ], baseStyle);
                        drawUV([
                            [0.75 + spread - 0.013, dv], [0.75 + spread + 0.013, dv],
                            [0.75 + spread + 0.013, dv + 0.025], [0.75 + spread - 0.013, dv + 0.025],
                        ], baseStyle);
                    }

                    // Inner filled band on left bell
                    const leftInner: [number, number][] = [[0.14, 0.33]];
                    for (let i = 0; i <= 6; i++) {
                        const t = Math.PI * (i / 6);
                        leftInner.push([0.25 + 0.1 * Math.cos(t), 0.58 + 0.16 * Math.sin(t)]);
                    }
                    leftInner.push([0.36, 0.33]);
                    drawUV(leftInner, baseStyle);

                    // Inner filled band on right bell
                    const rightInner: [number, number][] = [[0.64, 0.33]];
                    for (let i = 0; i <= 6; i++) {
                        const t = Math.PI * (i / 6);
                        rightInner.push([0.75 + 0.1 * Math.cos(t), 0.58 + 0.16 * Math.sin(t)]);
                    }
                    rightInner.push([0.86, 0.33]);
                    drawUV(rightInner, baseStyle);

                    // Filled diamonds on bell bodies
                    for (let i = 0; i < 3; i++) {
                        const bx = 0.2 + i * 0.05;
                        drawUV([
                            [bx, 0.26], [bx + 0.018, 0.28],
                            [bx, 0.30], [bx - 0.018, 0.28],
                        ], 'filled');
                    }
                    for (let i = 0; i < 3; i++) {
                        const bx = 0.7 + i * 0.05;
                        drawUV([
                            [bx, 0.26], [bx + 0.018, 0.28],
                            [bx, 0.30], [bx - 0.018, 0.28],
                        ], 'filled');
                    }

                    // Filled rectangles for bell rims
                    drawUV([
                        [0.11, 0.16], [0.39, 0.16],
                        [0.39, 0.2], [0.11, 0.2],
                    ], baseStyle);
                    drawUV([
                        [0.61, 0.16], [0.89, 0.16],
                        [0.89, 0.2], [0.61, 0.2],
                    ], baseStyle);

                    // Extra chain detail — filled chain links
                    for (let i = 0; i < 5; i++) {
                        const cx = 0.4 + i * 0.045;
                        drawUV([
                            [cx + 0.005, 0.73], [cx + 0.03, 0.73],
                            [cx + 0.03, 0.77], [cx + 0.005, 0.77],
                        ], baseStyle);
                    }

                    // Filled dots on chain connections
                    for (let i = 0; i < 6; i++) {
                        const cx = 0.4 + i * 0.04;
                        drawUV([
                            [cx, 0.745], [cx + 0.012, 0.755],
                            [cx, 0.765], [cx - 0.012, 0.755],
                        ], 'filled');
                    }

                    // Extra vertical filled bands on bell bodies
                    filledLine(0.2, 0.2, 0.2, 0.45, 0.025);
                    filledLine(0.3, 0.2, 0.3, 0.45, 0.025);
                    filledLine(0.7, 0.2, 0.7, 0.45, 0.025);
                    filledLine(0.8, 0.2, 0.8, 0.45, 0.025);

                    // Decorative finial filled shapes
                    drawUV([
                        [0.22, 0.82], [0.25, 0.88],
                        [0.28, 0.82],
                    ], baseStyle);
                    drawUV([
                        [0.72, 0.82], [0.75, 0.88],
                        [0.78, 0.82],
                    ], baseStyle);
                }
                break;
            }
        }
    }
};

export default lotusPatterns;
