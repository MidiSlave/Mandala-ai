// Paisley — large detailed teardrop with concentric layers
import type { PatternContext } from '../types';
import { filledLine, filledBand } from './helpers';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
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
            filledLine(drawUV, baseStyle, leftU, v, rightU, v, 0.025);
        }
        for (let col = 0; col < 5; col++) {
            const u = 0.35 + col * 0.07;
            filledLine(drawUV, baseStyle, u, 0.25, u + 0.02, 0.72, 0.025);
        }

        // Spiral at the curling tip — filled band
        filledBand(drawUV, baseStyle, [
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
        filledLine(drawUV, baseStyle, 0.25, 0.42, 0.75, 0.42, 0.025);
        filledLine(drawUV, baseStyle, 0.28, 0.52, 0.72, 0.52, 0.025);
        filledLine(drawUV, baseStyle, 0.3, 0.62, 0.7, 0.62, 0.025);
    }
}
