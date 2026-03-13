// Temple arch — onion dome with pendant, columns, and steps
import type { PatternContext } from '../types';
import { filledLine } from './helpers';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
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
        filledLine(drawUV, baseStyle, 0.26, 0.5, 0.74, 0.5, 0.03);
        filledLine(drawUV, baseStyle, 0.24, 0.55, 0.76, 0.55, 0.03);
        filledLine(drawUV, baseStyle, 0.22, 0.6, 0.78, 0.6, 0.03);
        filledLine(drawUV, baseStyle, 0.26, 0.65, 0.74, 0.65, 0.03);
        filledLine(drawUV, baseStyle, 0.3, 0.7, 0.7, 0.7, 0.03);
        filledLine(drawUV, baseStyle, 0.35, 0.75, 0.65, 0.75, 0.03);
        filledLine(drawUV, baseStyle, 0.4, 0.8, 0.6, 0.8, 0.03);

        // Column fluting — filled bands (left column)
        filledLine(drawUV, baseStyle, 0.2, 0.1, 0.2, 0.44, 0.025);
        filledLine(drawUV, baseStyle, 0.22, 0.1, 0.22, 0.44, 0.025);
        filledLine(drawUV, baseStyle, 0.24, 0.1, 0.24, 0.44, 0.025);
        // Column fluting — filled bands (right column)
        filledLine(drawUV, baseStyle, 0.76, 0.1, 0.76, 0.44, 0.025);
        filledLine(drawUV, baseStyle, 0.78, 0.1, 0.78, 0.44, 0.025);
        filledLine(drawUV, baseStyle, 0.8, 0.1, 0.8, 0.44, 0.025);

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
        filledLine(drawUV, baseStyle, 0.46, 0.55, 0.54, 0.55, 0.03);
        filledLine(drawUV, baseStyle, 0.47, 0.6, 0.53, 0.6, 0.03);

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
            filledLine(drawUV, baseStyle, 0.5 - hw, v, 0.5 + hw, v, 0.025);
        }
    }
}
