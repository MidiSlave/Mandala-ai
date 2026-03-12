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
                ], baseStyle);

                // Ring of small dots around the center (8 dots)
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    const cu = 0.5 + 0.1 * Math.cos(angle);
                    const cv = 0.48 + 0.1 * Math.sin(angle);
                    drawUV([
                        [cu - 0.012, cv - 0.012], [cu + 0.012, cv - 0.012],
                        [cu + 0.012, cv + 0.012], [cu - 0.012, cv + 0.012],
                    ], baseStyle);
                }

                if (!filled) {
                    // Vein lines inside main petal (center spine) — filled bar
                    drawUV([[0.485, 0.08], [0.515, 0.08], [0.515, 0.88], [0.485, 0.88]], 'filled');
                    // Main petal side veins — filled tapered shapes
                    drawUV([[0.5, 0.19], [0.5, 0.21], [0.345, 0.43], [0.375, 0.41]], 'filled');
                    drawUV([[0.5, 0.19], [0.5, 0.21], [0.655, 0.43], [0.625, 0.41]], 'filled');
                    drawUV([[0.5, 0.34], [0.5, 0.36], [0.365, 0.56], [0.395, 0.54]], 'filled');
                    drawUV([[0.5, 0.34], [0.5, 0.36], [0.635, 0.56], [0.605, 0.54]], 'filled');
                    drawUV([[0.5, 0.49], [0.5, 0.51], [0.405, 0.69], [0.435, 0.67]], 'filled');
                    drawUV([[0.5, 0.49], [0.5, 0.51], [0.595, 0.69], [0.565, 0.67]], 'filled');
                    drawUV([[0.5, 0.59], [0.5, 0.61], [0.425, 0.79], [0.455, 0.77]], 'filled');
                    drawUV([[0.5, 0.59], [0.5, 0.61], [0.575, 0.79], [0.545, 0.77]], 'filled');

                    // Left petal vein bars
                    drawUV([[0.155, 0.42], [0.185, 0.42], [0.185, 0.25], [0.155, 0.25]], 'filled');
                    drawUV([[0.17, 0.31], [0.17, 0.33], [0.085, 0.46], [0.115, 0.44]], 'filled');
                    drawUV([[0.17, 0.31], [0.17, 0.33], [0.265, 0.51], [0.235, 0.49]], 'filled');
                    drawUV([[0.17, 0.39], [0.17, 0.41], [0.105, 0.56], [0.135, 0.54]], 'filled');
                    drawUV([[0.17, 0.39], [0.17, 0.41], [0.255, 0.59], [0.225, 0.57]], 'filled');

                    // Right petal vein bars
                    drawUV([[0.815, 0.42], [0.845, 0.42], [0.845, 0.25], [0.815, 0.25]], 'filled');
                    drawUV([[0.83, 0.31], [0.83, 0.33], [0.915, 0.46], [0.885, 0.44]], 'filled');
                    drawUV([[0.83, 0.31], [0.83, 0.33], [0.735, 0.51], [0.765, 0.49]], 'filled');
                    drawUV([[0.83, 0.39], [0.83, 0.41], [0.895, 0.56], [0.865, 0.54]], 'filled');
                    drawUV([[0.83, 0.39], [0.83, 0.41], [0.745, 0.59], [0.775, 0.57]], 'filled');

                    // Scallop decoration along main petal edges (left side)
                    for (let i = 0; i < 5; i++) {
                        const t = 0.15 + i * 0.15;
                        const lu = 0.24 + 0.14 * t;
                        const lv = 0.15 + t * 0.7;
                        drawUV([
                            [lu - 0.04, lv], [lu - 0.02, lv + 0.04],
                            [lu, lv], [lu - 0.02, lv - 0.04],
                        ], 'filled');
                    }
                    // Scallop decoration (right side)
                    for (let i = 0; i < 5; i++) {
                        const t = 0.15 + i * 0.15;
                        const ru = 0.76 - 0.14 * t;
                        const rv = 0.15 + t * 0.7;
                        drawUV([
                            [ru + 0.04, rv], [ru + 0.02, rv + 0.04],
                            [ru, rv], [ru + 0.02, rv - 0.04],
                        ], 'filled');
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
                ], baseStyle);
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
                ], baseStyle);
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
                    // Rows of filled dots along inner curve
                    for (let i = 0; i < 7; i++) {
                        const t = 0.15 + i * 0.11;
                        const du = 0.22 + 0.12 * Math.sin(t * Math.PI);
                        const dv = 0.28 + t * 0.55;
                        drawUV([
                            [du - 0.015, dv], [du + 0.015, dv],
                            [du + 0.015, dv + 0.03], [du - 0.015, dv + 0.03],
                        ], 'filled');
                    }
                    // Second row of filled dots along outer curve
                    for (let i = 0; i < 7; i++) {
                        const t = 0.15 + i * 0.11;
                        const du = 0.78 - 0.12 * Math.sin(t * Math.PI);
                        const dv = 0.25 + t * 0.55;
                        drawUV([
                            [du - 0.015, dv], [du + 0.015, dv],
                            [du + 0.015, dv + 0.03], [du - 0.015, dv + 0.03],
                        ], 'filled');
                    }
                    // Third row of filled dots in center
                    for (let i = 0; i < 4; i++) {
                        const dv = 0.38 + i * 0.07;
                        drawUV([
                            [0.485, dv], [0.515, dv],
                            [0.515, dv + 0.025], [0.485, dv + 0.025],
                        ], 'filled');
                    }

                    // Mesh/grid fill inside paisley — filled bands
                    for (let row = 0; row < 6; row++) {
                        const v = 0.3 + row * 0.08;
                        const leftU = 0.28 + 0.06 * Math.sin((v - 0.3) * 5);
                        const rightU = 0.72 - 0.06 * Math.sin((v - 0.3) * 5);
                        drawUV([[leftU, v - 0.012], [rightU, v - 0.012], [rightU, v + 0.012], [leftU, v + 0.012]], 'filled');
                    }
                    for (let col = 0; col < 5; col++) {
                        const u = 0.35 + col * 0.07;
                        drawUV([[u - 0.012, 0.25], [u + 0.032, 0.25], [u + 0.032, 0.72], [u - 0.012, 0.72]], 'filled');
                    }

                    // Spiral shape at the curling tip
                    drawUV([
                        [0.56, 0.07], [0.6, 0.06], [0.64, 0.08],
                        [0.63, 0.12], [0.59, 0.13], [0.57, 0.1],
                    ], 'filled');
                    drawUV([
                        [0.58, 0.08], [0.61, 0.09],
                        [0.61, 0.11], [0.59, 0.11],
                    ], 'filled');

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
                    ], 'filled');
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
                ], baseStyle);
                // Right column
                drawUV([
                    [0.74, 0.0], [0.82, 0.0],
                    [0.82, 0.45], [0.74, 0.45],
                ], baseStyle);

                // Left column capital (scroll decoration at top)
                drawUV([
                    [0.16, 0.44], [0.28, 0.44],
                    [0.29, 0.48], [0.27, 0.51],
                    [0.22, 0.5], [0.19, 0.51],
                    [0.15, 0.48],
                ], baseStyle);
                // Right column capital
                drawUV([
                    [0.72, 0.44], [0.84, 0.44],
                    [0.85, 0.48], [0.83, 0.51],
                    [0.78, 0.5], [0.75, 0.51],
                    [0.71, 0.48],
                ], baseStyle);

                // Lotus flower at top of dome
                drawUV([
                    [0.5, 0.94], [0.54, 0.9], [0.52, 0.86],
                    [0.5, 0.88], [0.48, 0.86], [0.46, 0.9],
                ], baseStyle);
                // Lotus side petals
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

                // Hanging pendant/bell inside
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

                // Base decoration diamonds
                for (let i = 0; i < 5; i++) {
                    const bx = 0.25 + i * 0.12;
                    drawUV([
                        [bx, 0.03], [bx + 0.02, 0.06],
                        [bx, 0.09], [bx - 0.02, 0.06],
                    ], baseStyle);
                }

                if (!filled) {
                    // Filled dots along the arch
                    for (let i = 1; i <= 7; i++) {
                        const t = Math.PI * (1 - i / 8);
                        const u = 0.5 + 0.28 * Math.cos(t);
                        const v = 0.52 + 0.34 * Math.sin(t);
                        drawUV([
                            [u - 0.015, v - 0.015], [u + 0.015, v - 0.015],
                            [u + 0.015, v + 0.015], [u - 0.015, v + 0.015],
                        ], 'filled');
                    }
                    // Second row of filled dots (inner)
                    for (let i = 1; i <= 5; i++) {
                        const t = Math.PI * (1 - i / 6);
                        const u = 0.5 + 0.2 * Math.cos(t);
                        const v = 0.52 + 0.26 * Math.sin(t);
                        drawUV([
                            [u - 0.015, v - 0.015], [u + 0.015, v - 0.015],
                            [u + 0.015, v + 0.015], [u - 0.015, v + 0.015],
                        ], 'filled');
                    }

                    // Horizontal filled bands across the arch
                    drawUV([[0.26, 0.488], [0.74, 0.488], [0.74, 0.512], [0.26, 0.512]], 'filled');
                    drawUV([[0.24, 0.538], [0.76, 0.538], [0.76, 0.562], [0.24, 0.562]], 'filled');
                    drawUV([[0.22, 0.588], [0.78, 0.588], [0.78, 0.612], [0.22, 0.612]], 'filled');
                    drawUV([[0.26, 0.638], [0.74, 0.638], [0.74, 0.662], [0.26, 0.662]], 'filled');
                    drawUV([[0.3, 0.688], [0.7, 0.688], [0.7, 0.712], [0.3, 0.712]], 'filled');
                    drawUV([[0.35, 0.738], [0.65, 0.738], [0.65, 0.762], [0.35, 0.762]], 'filled');
                    drawUV([[0.4, 0.788], [0.6, 0.788], [0.6, 0.812], [0.4, 0.812]], 'filled');

                    // Column fluting bars (left column)
                    drawUV([[0.188, 0.1], [0.212, 0.1], [0.212, 0.44], [0.188, 0.44]], 'filled');
                    drawUV([[0.208, 0.1], [0.232, 0.1], [0.232, 0.44], [0.208, 0.44]], 'filled');
                    drawUV([[0.228, 0.1], [0.252, 0.1], [0.252, 0.44], [0.228, 0.44]], 'filled');
                    // Column fluting bars (right column)
                    drawUV([[0.748, 0.1], [0.772, 0.1], [0.772, 0.44], [0.748, 0.44]], 'filled');
                    drawUV([[0.768, 0.1], [0.792, 0.1], [0.792, 0.44], [0.768, 0.44]], 'filled');
                    drawUV([[0.788, 0.1], [0.812, 0.1], [0.812, 0.44], [0.788, 0.44]], 'filled');

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
                    drawUV(innerArch, 'filled');

                    // Pendant decoration bars
                    drawUV([[0.46, 0.538], [0.54, 0.538], [0.54, 0.562], [0.46, 0.562]], 'filled');
                    drawUV([[0.47, 0.588], [0.53, 0.588], [0.53, 0.612], [0.47, 0.612]], 'filled');
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

                // Crown of small filled leaves at top
                drawUV([[0.42, 0.06], [0.5, 0.0], [0.58, 0.06]], baseStyle);
                drawUV([[0.38, 0.1], [0.44, 0.02], [0.5, 0.0]], baseStyle);
                drawUV([[0.5, 0.0], [0.56, 0.02], [0.62, 0.1]], baseStyle);

                // Central spine bar (both modes)
                drawUV([[0.465, 0.15], [0.495, 0.15], [0.465, 0.5], [0.435, 0.5]], baseStyle);
                drawUV([[0.435, 0.5], [0.465, 0.5], [0.495, 0.85], [0.465, 0.85]], baseStyle);

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
                    ], baseStyle);
                }

                // Spiral at the top curl
                drawUV([
                    [0.5, 0.02], [0.54, 0.01], [0.57, 0.03],
                    [0.56, 0.06], [0.52, 0.06], [0.5, 0.04],
                ], baseStyle);

                if (!filled) {
                    // Internal parallel filled curved bands
                    drawUV([
                        [0.48, 0.82],
                        [0.58, 0.72],
                        [0.64, 0.55],
                        [0.62, 0.38],
                        [0.52, 0.22],
                    ], 'filled');
                    drawUV([
                        [0.42, 0.75],
                        [0.52, 0.65],
                        [0.56, 0.5],
                        [0.54, 0.35],
                        [0.47, 0.25],
                    ], 'filled');
                    // Additional inner filled curve
                    drawUV([
                        [0.38, 0.68],
                        [0.46, 0.58],
                        [0.48, 0.45],
                        [0.46, 0.32],
                        [0.42, 0.22],
                    ], 'filled');

                    // Cross-hatching filled bands
                    for (let i = 0; i < 6; i++) {
                        const v = 0.22 + i * 0.1;
                        drawUV([[0.32, v - 0.01], [0.58, v + 0.07], [0.58, v + 0.09], [0.32, v + 0.01]], 'filled');
                        drawUV([[0.58, v - 0.01], [0.32, v + 0.07], [0.32, v + 0.09], [0.58, v + 0.01]], 'filled');
                    }

                    // Interior seed/dot pattern (rows of filled diamonds)
                    for (let row = 0; row < 5; row++) {
                        const rv = 0.28 + row * 0.12;
                        for (let col = 0; col < 3; col++) {
                            const ru = 0.38 + col * 0.08;
                            drawUV([
                                [ru, rv - 0.015], [ru + 0.015, rv],
                                [ru, rv + 0.015], [ru - 0.015, rv],
                            ], 'filled');
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
                    ], 'filled');
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
                    ], 'filled');
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
                ], baseStyle);
                // Left clapper rod
                drawUV([[0.235, 0.33], [0.265, 0.33], [0.265, 0.5], [0.235, 0.5]], baseStyle);

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
                ], baseStyle);
                // Right clapper rod
                drawUV([[0.735, 0.33], [0.765, 0.33], [0.765, 0.5], [0.735, 0.5]], baseStyle);

                // Decorative bands around bell bodies (horizontal stripes)
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

                // Chain links connecting the bells at top (5 links)
                for (let i = 0; i < 5; i++) {
                    const cx = 0.4 + i * 0.045;
                    drawUV([
                        [cx, 0.72], [cx + 0.035, 0.72],
                        [cx + 0.035, 0.78], [cx, 0.78],
                    ], baseStyle);
                }
                // Chain connectors (filled links between)
                for (let i = 0; i < 4; i++) {
                    const cx = 0.4 + i * 0.045;
                    drawUV([[cx + 0.035, 0.738], [cx + 0.045, 0.738], [cx + 0.045, 0.762], [cx + 0.035, 0.762]], baseStyle);
                }

                // Decorative finials on top of each bell
                drawUV([[0.25, 0.8], [0.23, 0.85], [0.27, 0.85]], baseStyle);
                drawUV([[0.75, 0.8], [0.73, 0.85], [0.77, 0.85]], baseStyle);

                // Sound bars radiating from bells (both modes)
                // Left bell sound bars
                drawUV([[0.06, 0.238], [0.02, 0.208], [0.02, 0.232], [0.06, 0.262]], baseStyle);
                drawUV([[0.06, 0.288], [0.01, 0.288], [0.01, 0.312], [0.06, 0.312]], baseStyle);
                drawUV([[0.06, 0.338], [0.02, 0.368], [0.02, 0.392], [0.06, 0.362]], baseStyle);
                drawUV([[0.08, 0.208], [0.05, 0.168], [0.05, 0.192], [0.08, 0.232]], baseStyle);
                drawUV([[0.08, 0.368], [0.05, 0.408], [0.05, 0.432], [0.08, 0.392]], baseStyle);
                // Right bell sound bars
                drawUV([[0.94, 0.238], [0.98, 0.208], [0.98, 0.232], [0.94, 0.262]], baseStyle);
                drawUV([[0.94, 0.288], [0.99, 0.288], [0.99, 0.312], [0.94, 0.312]], baseStyle);
                drawUV([[0.94, 0.338], [0.98, 0.368], [0.98, 0.392], [0.94, 0.362]], baseStyle);
                drawUV([[0.92, 0.208], [0.95, 0.168], [0.95, 0.192], [0.92, 0.232]], baseStyle);
                drawUV([[0.92, 0.368], [0.95, 0.408], [0.95, 0.432], [0.92, 0.392]], baseStyle);

                // Hanging tassels below bells
                // Left tassel
                drawUV([[0.235, 0.15], [0.265, 0.15], [0.265, 0.06], [0.235, 0.06]], baseStyle);
                drawUV([
                    [0.22, 0.06], [0.28, 0.06],
                    [0.27, 0.02], [0.23, 0.02],
                ], baseStyle);
                drawUV([[0.215, 0.02], [0.235, 0.02], [0.235, 0.0], [0.215, 0.0]], baseStyle);
                drawUV([[0.235, 0.02], [0.265, 0.02], [0.265, 0.0], [0.235, 0.0]], baseStyle);
                drawUV([[0.255, 0.02], [0.285, 0.02], [0.295, 0.0], [0.265, 0.0]], baseStyle);
                // Right tassel
                drawUV([[0.735, 0.15], [0.765, 0.15], [0.765, 0.06], [0.735, 0.06]], baseStyle);
                drawUV([
                    [0.72, 0.06], [0.78, 0.06],
                    [0.77, 0.02], [0.73, 0.02],
                ], baseStyle);
                drawUV([[0.715, 0.02], [0.735, 0.02], [0.735, 0.0], [0.715, 0.0]], baseStyle);
                drawUV([[0.735, 0.02], [0.765, 0.02], [0.765, 0.0], [0.735, 0.0]], baseStyle);
                drawUV([[0.755, 0.02], [0.785, 0.02], [0.795, 0.0], [0.765, 0.0]], baseStyle);

                if (!filled) {
                    // Additional bell body filled bands
                    drawUV([[0.15, 0.238], [0.35, 0.238], [0.35, 0.262], [0.15, 0.262]], 'filled');
                    drawUV([[0.19, 0.448], [0.31, 0.448], [0.31, 0.472], [0.19, 0.472]], 'filled');
                    drawUV([[0.65, 0.238], [0.85, 0.238], [0.85, 0.262], [0.65, 0.262]], 'filled');
                    drawUV([[0.69, 0.448], [0.81, 0.448], [0.81, 0.472], [0.69, 0.472]], 'filled');

                    // Sound wave arcs (left) — filled
                    drawUV([
                        [0.04, 0.2], [0.02, 0.25], [0.01, 0.3],
                        [0.02, 0.35], [0.04, 0.4],
                    ], 'filled');
                    // Sound wave arcs (right) — filled
                    drawUV([
                        [0.96, 0.2], [0.98, 0.25], [0.99, 0.3],
                        [0.98, 0.35], [0.96, 0.4],
                    ], 'filled');

                    // Filled dots on bell bodies
                    for (let i = 0; i < 3; i++) {
                        const dv = 0.35 + i * 0.06;
                        const spread = 0.06 - i * 0.015;
                        // Left bell dots
                        drawUV([
                            [0.25 - 0.01, dv], [0.25 + 0.01, dv],
                            [0.25 + 0.01, dv + 0.02], [0.25 - 0.01, dv + 0.02],
                        ], 'filled');
                        drawUV([
                            [0.25 - spread - 0.01, dv], [0.25 - spread + 0.01, dv],
                            [0.25 - spread + 0.01, dv + 0.02], [0.25 - spread - 0.01, dv + 0.02],
                        ], 'filled');
                        drawUV([
                            [0.25 + spread - 0.01, dv], [0.25 + spread + 0.01, dv],
                            [0.25 + spread + 0.01, dv + 0.02], [0.25 + spread - 0.01, dv + 0.02],
                        ], 'filled');
                        // Right bell dots
                        drawUV([
                            [0.75 - 0.01, dv], [0.75 + 0.01, dv],
                            [0.75 + 0.01, dv + 0.02], [0.75 - 0.01, dv + 0.02],
                        ], 'filled');
                        drawUV([
                            [0.75 - spread - 0.01, dv], [0.75 - spread + 0.01, dv],
                            [0.75 - spread + 0.01, dv + 0.02], [0.75 - spread - 0.01, dv + 0.02],
                        ], 'filled');
                        drawUV([
                            [0.75 + spread - 0.01, dv], [0.75 + spread + 0.01, dv],
                            [0.75 + spread + 0.01, dv + 0.02], [0.75 + spread - 0.01, dv + 0.02],
                        ], 'filled');
                    }
                }
                break;
            }
        }
    }
};

export default lotusPatterns;
