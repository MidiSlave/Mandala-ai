import type { PatternSet, PatternContext } from './types';

const lotusPatterns: PatternSet = {
    name: 'Lotus / Indian Floral',
    count: 5,
    draw: (type: number, { drawUV, filled, baseStyle }: PatternContext) => {
        switch (type) {
            case 0: { // Lotus bloom — full flower with petals, veins, and center
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
                ], filled ? baseStyle : 'outline');

                // Ring of small dots around the center (8 dots)
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    const cu = 0.5 + 0.1 * Math.cos(angle);
                    const cv = 0.48 + 0.1 * Math.sin(angle);
                    drawUV([
                        [cu - 0.012, cv - 0.012], [cu + 0.012, cv - 0.012],
                        [cu + 0.012, cv + 0.012], [cu - 0.012, cv + 0.012],
                    ], filled ? baseStyle : 'outline');
                }

                if (!filled) {
                    // Vein lines inside main petal (center spine)
                    drawUV([[0.5, 0.08], [0.5, 0.88]], 'line');
                    // Main petal side veins (multiple levels)
                    drawUV([[0.5, 0.2], [0.36, 0.42]], 'line');
                    drawUV([[0.5, 0.2], [0.64, 0.42]], 'line');
                    drawUV([[0.5, 0.35], [0.38, 0.55]], 'line');
                    drawUV([[0.5, 0.35], [0.62, 0.55]], 'line');
                    drawUV([[0.5, 0.5], [0.42, 0.68]], 'line');
                    drawUV([[0.5, 0.5], [0.58, 0.68]], 'line');
                    drawUV([[0.5, 0.6], [0.44, 0.78]], 'line');
                    drawUV([[0.5, 0.6], [0.56, 0.78]], 'line');

                    // Left petal vein lines
                    drawUV([[0.17, 0.42], [0.17, 0.25]], 'line');
                    drawUV([[0.17, 0.32], [0.1, 0.45]], 'line');
                    drawUV([[0.17, 0.32], [0.25, 0.5]], 'line');
                    drawUV([[0.17, 0.4], [0.12, 0.55]], 'line');
                    drawUV([[0.17, 0.4], [0.24, 0.58]], 'line');

                    // Right petal vein lines
                    drawUV([[0.83, 0.42], [0.83, 0.25]], 'line');
                    drawUV([[0.83, 0.32], [0.9, 0.45]], 'line');
                    drawUV([[0.83, 0.32], [0.75, 0.5]], 'line');
                    drawUV([[0.83, 0.4], [0.88, 0.55]], 'line');
                    drawUV([[0.83, 0.4], [0.76, 0.58]], 'line');

                    // Scallop decoration along main petal edges (left side)
                    for (let i = 0; i < 5; i++) {
                        const t = 0.15 + i * 0.15;
                        const lu = 0.24 + 0.14 * t;
                        const lv = 0.15 + t * 0.7;
                        drawUV([
                            [lu - 0.04, lv], [lu - 0.02, lv + 0.04],
                            [lu, lv], [lu - 0.02, lv - 0.04],
                        ], 'outline');
                    }
                    // Scallop decoration (right side)
                    for (let i = 0; i < 5; i++) {
                        const t = 0.15 + i * 0.15;
                        const ru = 0.76 - 0.14 * t;
                        const rv = 0.15 + t * 0.7;
                        drawUV([
                            [ru + 0.04, rv], [ru + 0.02, rv + 0.04],
                            [ru, rv], [ru + 0.02, rv - 0.04],
                        ], 'outline');
                    }

                    // Inner outline band around center
                    drawUV([
                        [0.5, 0.3],
                        [0.6, 0.38],
                        [0.62, 0.48],
                        [0.6, 0.58],
                        [0.5, 0.65],
                        [0.4, 0.58],
                        [0.38, 0.48],
                        [0.4, 0.38],
                    ], 'outline');
                }
                // Dot above flower tip
                drawUV([
                    [0.48, 0.95], [0.52, 0.95],
                    [0.52, 0.99], [0.48, 0.99],
                ], baseStyle);
                break;
            }

            case 1: { // Paisley — large detailed teardrop with concentric layers
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
                // First inner concentric (thicker outline band)
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
                ], filled ? baseStyle : 'outline');
                // Second inner concentric
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
                ], filled ? baseStyle : 'outline');
                // Third inner concentric
                drawUV([
                    [0.49, 0.38],
                    [0.56, 0.4],
                    [0.58, 0.48],
                    [0.55, 0.55],
                    [0.48, 0.56],
                    [0.42, 0.52],
                    [0.42, 0.44],
                    [0.45, 0.39],
                ], filled ? baseStyle : 'outline');
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
                    ], filled ? baseStyle : 'outline');
                }

                if (!filled) {
                    // Row of dots along inner curve (more rows)
                    for (let i = 0; i < 7; i++) {
                        const t = 0.15 + i * 0.11;
                        const du = 0.22 + 0.12 * Math.sin(t * Math.PI);
                        const dv = 0.28 + t * 0.55;
                        drawUV([
                            [du - 0.015, dv], [du + 0.015, dv],
                            [du + 0.015, dv + 0.03], [du - 0.015, dv + 0.03],
                        ], 'outline');
                    }
                    // Second row of dots along outer curve
                    for (let i = 0; i < 7; i++) {
                        const t = 0.15 + i * 0.11;
                        const du = 0.78 - 0.12 * Math.sin(t * Math.PI);
                        const dv = 0.25 + t * 0.55;
                        drawUV([
                            [du - 0.015, dv], [du + 0.015, dv],
                            [du + 0.015, dv + 0.03], [du - 0.015, dv + 0.03],
                        ], 'outline');
                    }
                    // Third row of dots in center
                    for (let i = 0; i < 4; i++) {
                        const dv = 0.38 + i * 0.07;
                        drawUV([
                            [0.485, dv], [0.515, dv],
                            [0.515, dv + 0.025], [0.485, dv + 0.025],
                        ], 'outline');
                    }

                    // Mesh/grid fill inside paisley
                    for (let row = 0; row < 6; row++) {
                        const v = 0.3 + row * 0.08;
                        const leftU = 0.28 + 0.06 * Math.sin((v - 0.3) * 5);
                        const rightU = 0.72 - 0.06 * Math.sin((v - 0.3) * 5);
                        drawUV([[leftU, v], [rightU, v]], 'line');
                    }
                    for (let col = 0; col < 5; col++) {
                        const u = 0.35 + col * 0.07;
                        drawUV([[u, 0.25], [u + 0.02, 0.72]], 'line');
                    }

                    // Spiral line at the curling tip
                    drawUV([
                        [0.56, 0.07], [0.6, 0.06], [0.64, 0.08],
                        [0.63, 0.12], [0.59, 0.13], [0.57, 0.1],
                    ], 'line');
                    drawUV([
                        [0.58, 0.08], [0.61, 0.09],
                        [0.61, 0.11], [0.59, 0.11],
                    ], 'line');

                    // Additional outline band between outer and first inner
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
                    ], 'outline');
                }
                break;
            }

            case 2: { // Temple arch — onion dome with pendant, columns, and steps
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

                // Left column
                drawUV([
                    [0.18, 0.0], [0.26, 0.0],
                    [0.26, 0.45], [0.18, 0.45],
                ], filled ? baseStyle : 'outline');
                // Right column
                drawUV([
                    [0.74, 0.0], [0.82, 0.0],
                    [0.82, 0.45], [0.74, 0.45],
                ], filled ? baseStyle : 'outline');

                // Left column capital (scroll decoration at top)
                drawUV([
                    [0.16, 0.44], [0.28, 0.44],
                    [0.29, 0.48], [0.27, 0.51],
                    [0.22, 0.5], [0.19, 0.51],
                    [0.15, 0.48],
                ], filled ? baseStyle : 'outline');
                // Right column capital
                drawUV([
                    [0.72, 0.44], [0.84, 0.44],
                    [0.85, 0.48], [0.83, 0.51],
                    [0.78, 0.5], [0.75, 0.51],
                    [0.71, 0.48],
                ], filled ? baseStyle : 'outline');

                // Lotus flower at top of dome
                drawUV([
                    [0.5, 0.94], [0.54, 0.9], [0.52, 0.86],
                    [0.5, 0.88], [0.48, 0.86], [0.46, 0.9],
                ], filled ? baseStyle : 'outline');
                // Lotus side petals
                drawUV([
                    [0.46, 0.9], [0.42, 0.88], [0.43, 0.84],
                    [0.47, 0.86],
                ], filled ? baseStyle : 'outline');
                drawUV([
                    [0.54, 0.9], [0.58, 0.88], [0.57, 0.84],
                    [0.53, 0.86],
                ], filled ? baseStyle : 'outline');
                // Finial dot at very top
                drawUV([
                    [0.49, 0.95], [0.51, 0.95],
                    [0.51, 0.98], [0.49, 0.98],
                ], baseStyle);

                // Hanging pendant/bell inside
                drawUV([
                    [0.5, 0.72],
                    [0.56, 0.62],
                    [0.56, 0.52],
                    [0.52, 0.48],
                    [0.48, 0.48],
                    [0.44, 0.52],
                    [0.44, 0.62],
                ], filled ? baseStyle : 'outline');

                // Steps at base
                drawUV([
                    [0.1, 0.0], [0.9, 0.0],
                    [0.9, 0.06], [0.1, 0.06],
                ], baseStyle);
                drawUV([
                    [0.14, 0.06], [0.86, 0.06],
                    [0.86, 0.1], [0.14, 0.1],
                ], filled ? baseStyle : 'outline');
                // Base decoration - additional step
                drawUV([
                    [0.06, 0.0], [0.94, 0.0],
                    [0.94, 0.03], [0.06, 0.03],
                ], filled ? baseStyle : 'outline');

                // Base decoration diamonds
                for (let i = 0; i < 5; i++) {
                    const bx = 0.25 + i * 0.12;
                    drawUV([
                        [bx, 0.03], [bx + 0.02, 0.06],
                        [bx, 0.09], [bx - 0.02, 0.06],
                    ], filled ? baseStyle : 'outline');
                }

                if (!filled) {
                    // Decorative dots along the arch (doubled quantity)
                    for (let i = 1; i <= 7; i++) {
                        const t = Math.PI * (1 - i / 8);
                        const u = 0.5 + 0.28 * Math.cos(t);
                        const v = 0.52 + 0.34 * Math.sin(t);
                        drawUV([
                            [u - 0.015, v - 0.015], [u + 0.015, v - 0.015],
                            [u + 0.015, v + 0.015], [u - 0.015, v + 0.015],
                        ], 'outline');
                    }
                    // Second row of dots (inner)
                    for (let i = 1; i <= 5; i++) {
                        const t = Math.PI * (1 - i / 6);
                        const u = 0.5 + 0.2 * Math.cos(t);
                        const v = 0.52 + 0.26 * Math.sin(t);
                        drawUV([
                            [u - 0.015, v - 0.015], [u + 0.015, v - 0.015],
                            [u + 0.015, v + 0.015], [u - 0.015, v + 0.015],
                        ], 'outline');
                    }

                    // Horizontal band lines across the arch
                    drawUV([[0.26, 0.5], [0.74, 0.5]], 'line');
                    drawUV([[0.24, 0.55], [0.76, 0.55]], 'line');
                    drawUV([[0.22, 0.6], [0.78, 0.6]], 'line');
                    drawUV([[0.26, 0.65], [0.74, 0.65]], 'line');
                    drawUV([[0.3, 0.7], [0.7, 0.7]], 'line');
                    drawUV([[0.35, 0.75], [0.65, 0.75]], 'line');
                    drawUV([[0.4, 0.8], [0.6, 0.8]], 'line');

                    // Column fluting lines (left column)
                    drawUV([[0.2, 0.1], [0.2, 0.44]], 'line');
                    drawUV([[0.22, 0.1], [0.22, 0.44]], 'line');
                    drawUV([[0.24, 0.1], [0.24, 0.44]], 'line');
                    // Column fluting lines (right column)
                    drawUV([[0.76, 0.1], [0.76, 0.44]], 'line');
                    drawUV([[0.78, 0.1], [0.78, 0.44]], 'line');
                    drawUV([[0.8, 0.1], [0.8, 0.44]], 'line');

                    // Inner arch outline band
                    const innerArch: [number, number][] = [[0.26, 0.45]];
                    for (let i = 0; i <= 8; i++) {
                        const t = Math.PI * (1 - i / 8);
                        const u = 0.5 + 0.24 * Math.cos(t);
                        const bulge = Math.sin(t) > 0.7 ? 0.06 : 0;
                        const v = 0.52 + 0.3 * Math.sin(t) + bulge;
                        innerArch.push([u, v]);
                    }
                    innerArch.push([0.74, 0.45]);
                    drawUV(innerArch, 'outline');

                    // Pendant decoration lines
                    drawUV([[0.46, 0.55], [0.54, 0.55]], 'line');
                    drawUV([[0.47, 0.6], [0.53, 0.6]], 'line');
                }
                break;
            }

            case 3: { // Mango/boteh — kidney shape with internal decoration
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

                // Crown of small leaves/dots at top
                drawUV([[0.42, 0.06], [0.5, 0.0], [0.58, 0.06]], 'line');
                drawUV([[0.38, 0.1], [0.44, 0.02], [0.5, 0.0]], 'line');
                drawUV([[0.5, 0.0], [0.56, 0.02], [0.62, 0.1]], 'line');

                // Central spine line (both modes)
                drawUV([[0.48, 0.15], [0.45, 0.5], [0.48, 0.85]], 'line');

                // Small leaf shapes along outer edge (both modes)
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
                    ], filled ? baseStyle : 'outline');
                }

                // Spiral at the top curl
                drawUV([
                    [0.5, 0.02], [0.54, 0.01], [0.57, 0.03],
                    [0.56, 0.06], [0.52, 0.06], [0.5, 0.04],
                ], filled ? baseStyle : 'outline');

                if (!filled) {
                    // Internal parallel curved lines
                    drawUV([
                        [0.48, 0.82],
                        [0.58, 0.72],
                        [0.64, 0.55],
                        [0.62, 0.38],
                        [0.52, 0.22],
                    ], 'line');
                    drawUV([
                        [0.42, 0.75],
                        [0.52, 0.65],
                        [0.56, 0.5],
                        [0.54, 0.35],
                        [0.47, 0.25],
                    ], 'line');
                    // Additional inner curved line
                    drawUV([
                        [0.38, 0.68],
                        [0.46, 0.58],
                        [0.48, 0.45],
                        [0.46, 0.32],
                        [0.42, 0.22],
                    ], 'line');

                    // Cross-hatching (more lines)
                    for (let i = 0; i < 6; i++) {
                        const v = 0.22 + i * 0.1;
                        drawUV([[0.32, v], [0.58, v + 0.08]], 'line');
                        drawUV([[0.58, v], [0.32, v + 0.08]], 'line');
                    }

                    // Interior seed/dot pattern (rows of small diamonds)
                    for (let row = 0; row < 5; row++) {
                        const rv = 0.28 + row * 0.12;
                        for (let col = 0; col < 3; col++) {
                            const ru = 0.38 + col * 0.08;
                            drawUV([
                                [ru, rv - 0.015], [ru + 0.015, rv],
                                [ru, rv + 0.015], [ru - 0.015, rv],
                            ], 'outline');
                        }
                    }

                    // Inner outline band
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
                    ], 'outline');
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
                    ], 'outline');
                }
                break;
            }

            case 4: { // Chain of bells — two bells connected by chain
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

                // Left bell clapper (larger, more visible)
                drawUV([
                    [0.23, 0.2], [0.27, 0.2],
                    [0.28, 0.27], [0.25, 0.33],
                    [0.22, 0.27],
                ], filled ? baseStyle : 'outline');
                // Left clapper rod
                drawUV([[0.25, 0.33], [0.25, 0.5]], 'line');

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

                // Right bell clapper (larger)
                drawUV([
                    [0.73, 0.2], [0.77, 0.2],
                    [0.78, 0.27], [0.75, 0.33],
                    [0.72, 0.27],
                ], filled ? baseStyle : 'outline');
                // Right clapper rod
                drawUV([[0.75, 0.33], [0.75, 0.5]], 'line');

                // Decorative bands around bell bodies (horizontal stripes)
                // Left bell bands
                drawUV([
                    [0.12, 0.3], [0.38, 0.3],
                    [0.38, 0.33], [0.12, 0.33],
                ], filled ? baseStyle : 'outline');
                drawUV([
                    [0.14, 0.4], [0.36, 0.4],
                    [0.36, 0.43], [0.14, 0.43],
                ], filled ? baseStyle : 'outline');
                drawUV([
                    [0.17, 0.5], [0.33, 0.5],
                    [0.33, 0.53], [0.17, 0.53],
                ], filled ? baseStyle : 'outline');
                // Right bell bands
                drawUV([
                    [0.62, 0.3], [0.88, 0.3],
                    [0.88, 0.33], [0.62, 0.33],
                ], filled ? baseStyle : 'outline');
                drawUV([
                    [0.64, 0.4], [0.86, 0.4],
                    [0.86, 0.43], [0.64, 0.43],
                ], filled ? baseStyle : 'outline');
                drawUV([
                    [0.67, 0.5], [0.83, 0.5],
                    [0.83, 0.53], [0.67, 0.53],
                ], filled ? baseStyle : 'outline');

                // Chain links connecting the bells at top (5 links)
                for (let i = 0; i < 5; i++) {
                    const cx = 0.4 + i * 0.045;
                    drawUV([
                        [cx, 0.72], [cx + 0.035, 0.72],
                        [cx + 0.035, 0.78], [cx, 0.78],
                    ], filled ? baseStyle : 'outline');
                }
                // Chain connectors (diagonal links between)
                for (let i = 0; i < 4; i++) {
                    const cx = 0.4 + i * 0.045;
                    drawUV([[cx + 0.035, 0.75], [cx + 0.045, 0.75]], 'line');
                }

                // Decorative finials on top of each bell
                drawUV([[0.25, 0.8], [0.23, 0.85], [0.27, 0.85]], baseStyle);
                drawUV([[0.75, 0.8], [0.73, 0.85], [0.77, 0.85]], baseStyle);

                // Sound lines radiating from bells (both modes)
                // Left bell sound lines
                drawUV([[0.06, 0.25], [0.02, 0.22]], 'line');
                drawUV([[0.06, 0.3], [0.01, 0.3]], 'line');
                drawUV([[0.06, 0.35], [0.02, 0.38]], 'line');
                drawUV([[0.08, 0.22], [0.05, 0.18]], 'line');
                drawUV([[0.08, 0.38], [0.05, 0.42]], 'line');
                // Right bell sound lines
                drawUV([[0.94, 0.25], [0.98, 0.22]], 'line');
                drawUV([[0.94, 0.3], [0.99, 0.3]], 'line');
                drawUV([[0.94, 0.35], [0.98, 0.38]], 'line');
                drawUV([[0.92, 0.22], [0.95, 0.18]], 'line');
                drawUV([[0.92, 0.38], [0.95, 0.42]], 'line');

                // Hanging tassels below bells
                // Left tassel
                drawUV([[0.25, 0.15], [0.25, 0.06]], 'line');
                drawUV([
                    [0.22, 0.06], [0.28, 0.06],
                    [0.27, 0.02], [0.23, 0.02],
                ], filled ? baseStyle : 'outline');
                drawUV([[0.23, 0.02], [0.22, 0.0]], 'line');
                drawUV([[0.25, 0.02], [0.25, 0.0]], 'line');
                drawUV([[0.27, 0.02], [0.28, 0.0]], 'line');
                // Right tassel
                drawUV([[0.75, 0.15], [0.75, 0.06]], 'line');
                drawUV([
                    [0.72, 0.06], [0.78, 0.06],
                    [0.77, 0.02], [0.73, 0.02],
                ], filled ? baseStyle : 'outline');
                drawUV([[0.73, 0.02], [0.72, 0.0]], 'line');
                drawUV([[0.75, 0.02], [0.75, 0.0]], 'line');
                drawUV([[0.77, 0.02], [0.78, 0.0]], 'line');

                if (!filled) {
                    // Additional bell body detail lines
                    drawUV([[0.15, 0.25], [0.35, 0.25]], 'line');
                    drawUV([[0.19, 0.46], [0.31, 0.46]], 'line');
                    drawUV([[0.65, 0.25], [0.85, 0.25]], 'line');
                    drawUV([[0.69, 0.46], [0.81, 0.46]], 'line');

                    // Sound wave arcs (left)
                    drawUV([
                        [0.04, 0.2], [0.02, 0.25], [0.01, 0.3],
                        [0.02, 0.35], [0.04, 0.4],
                    ], 'line');
                    // Sound wave arcs (right)
                    drawUV([
                        [0.96, 0.2], [0.98, 0.25], [0.99, 0.3],
                        [0.98, 0.35], [0.96, 0.4],
                    ], 'line');

                    // Dots on bell bodies
                    for (let i = 0; i < 3; i++) {
                        const dv = 0.35 + i * 0.06;
                        const spread = 0.06 - i * 0.015;
                        // Left bell dots
                        drawUV([
                            [0.25 - 0.01, dv], [0.25 + 0.01, dv],
                            [0.25 + 0.01, dv + 0.02], [0.25 - 0.01, dv + 0.02],
                        ], 'outline');
                        drawUV([
                            [0.25 - spread - 0.01, dv], [0.25 - spread + 0.01, dv],
                            [0.25 - spread + 0.01, dv + 0.02], [0.25 - spread - 0.01, dv + 0.02],
                        ], 'outline');
                        drawUV([
                            [0.25 + spread - 0.01, dv], [0.25 + spread + 0.01, dv],
                            [0.25 + spread + 0.01, dv + 0.02], [0.25 + spread - 0.01, dv + 0.02],
                        ], 'outline');
                        // Right bell dots
                        drawUV([
                            [0.75 - 0.01, dv], [0.75 + 0.01, dv],
                            [0.75 + 0.01, dv + 0.02], [0.75 - 0.01, dv + 0.02],
                        ], 'outline');
                        drawUV([
                            [0.75 - spread - 0.01, dv], [0.75 - spread + 0.01, dv],
                            [0.75 - spread + 0.01, dv + 0.02], [0.75 - spread - 0.01, dv + 0.02],
                        ], 'outline');
                        drawUV([
                            [0.75 + spread - 0.01, dv], [0.75 + spread + 0.01, dv],
                            [0.75 + spread + 0.01, dv + 0.02], [0.75 + spread - 0.01, dv + 0.02],
                        ], 'outline');
                    }
                }
                break;
            }
        }
    }
};

export default lotusPatterns;
