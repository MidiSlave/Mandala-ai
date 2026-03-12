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
                // Center dot
                drawUV([
                    [0.47, 0.42], [0.53, 0.42],
                    [0.55, 0.48], [0.53, 0.54],
                    [0.47, 0.54], [0.45, 0.48],
                ], filled ? baseStyle : 'outline');
                if (!filled) {
                    // Vein lines inside main petal
                    drawUV([[0.5, 0.1], [0.5, 0.85]], 'line');
                    drawUV([[0.5, 0.3], [0.38, 0.55]], 'line');
                    drawUV([[0.5, 0.3], [0.62, 0.55]], 'line');
                    drawUV([[0.5, 0.45], [0.42, 0.68]], 'line');
                    drawUV([[0.5, 0.45], [0.58, 0.68]], 'line');
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
                // First inner concentric
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
                if (!filled) {
                    // Row of dots along inner curve
                    for (let i = 0; i < 5; i++) {
                        const t = 0.2 + i * 0.14;
                        const du = 0.22 + 0.12 * Math.sin(t * Math.PI);
                        const dv = 0.3 + t * 0.55;
                        drawUV([
                            [du - 0.015, dv], [du + 0.015, dv],
                            [du + 0.015, dv + 0.03], [du - 0.015, dv + 0.03],
                        ], 'outline');
                    }
                }
                // Curling tip
                drawUV([
                    [0.55, 0.02], [0.62, 0.04],
                    [0.68, 0.08], [0.65, 0.14],
                    [0.58, 0.12],
                ], baseStyle);
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
                    // Onion dome: extra height at top
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

                if (!filled) {
                    // Decorative dots along the arch
                    for (let i = 1; i <= 7; i++) {
                        const t = Math.PI * (1 - i / 8);
                        const u = 0.5 + 0.28 * Math.cos(t);
                        const v = 0.52 + 0.34 * Math.sin(t);
                        drawUV([
                            [u - 0.015, v - 0.015], [u + 0.015, v - 0.015],
                            [u + 0.015, v + 0.015], [u - 0.015, v + 0.015],
                        ], 'outline');
                    }
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
                    // Cross-hatching
                    for (let i = 0; i < 4; i++) {
                        const v = 0.3 + i * 0.12;
                        drawUV([[0.35, v], [0.55, v + 0.1]], 'line');
                        drawUV([[0.55, v], [0.35, v + 0.1]], 'line');
                    }
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

                // Left bell clapper
                drawUV([
                    [0.23, 0.22], [0.27, 0.22],
                    [0.28, 0.28], [0.25, 0.32],
                    [0.22, 0.28],
                ], filled ? baseStyle : 'outline');

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

                // Right bell clapper
                drawUV([
                    [0.73, 0.22], [0.77, 0.22],
                    [0.78, 0.28], [0.75, 0.32],
                    [0.72, 0.28],
                ], filled ? baseStyle : 'outline');

                // Chain links connecting the bells at top
                for (let i = 0; i < 3; i++) {
                    const cx = 0.44 + i * 0.06;
                    drawUV([
                        [cx, 0.72], [cx + 0.04, 0.72],
                        [cx + 0.04, 0.78], [cx, 0.78],
                    ], filled ? baseStyle : 'outline');
                }

                // Decorative finials on top of each bell
                drawUV([[0.25, 0.8], [0.23, 0.85], [0.27, 0.85]], baseStyle);
                drawUV([[0.75, 0.8], [0.73, 0.85], [0.77, 0.85]], baseStyle);
                break;
            }
        }
    }
};

export default lotusPatterns;
