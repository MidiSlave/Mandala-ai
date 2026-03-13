// Mango/boteh — kidney shape with internal decoration
import type { PatternContext } from '../types';
import { filledLine, filledBand, taperedVein } from './helpers';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
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
    taperedVein(drawUV, baseStyle, [[0.42, 0.06], [0.5, 0.0], [0.58, 0.06]], 0.03, 0.01);
    taperedVein(drawUV, baseStyle, [[0.38, 0.1], [0.44, 0.02], [0.5, 0.0]], 0.03, 0.01);
    taperedVein(drawUV, baseStyle, [[0.5, 0.0], [0.56, 0.02], [0.62, 0.1]], 0.03, 0.01);

    // Central spine — tapered filled shape (both modes)
    taperedVein(drawUV, baseStyle, [[0.48, 0.15], [0.45, 0.5], [0.48, 0.85]], 0.04, 0.012);

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
        filledBand(drawUV, baseStyle, [
            [0.48, 0.82],
            [0.58, 0.72],
            [0.64, 0.55],
            [0.62, 0.38],
            [0.52, 0.22],
        ], 0.03);
        filledBand(drawUV, baseStyle, [
            [0.42, 0.75],
            [0.52, 0.65],
            [0.56, 0.5],
            [0.54, 0.35],
            [0.47, 0.25],
        ], 0.03);
        // Additional inner curved band — filled
        filledBand(drawUV, baseStyle, [
            [0.38, 0.68],
            [0.46, 0.58],
            [0.48, 0.45],
            [0.46, 0.32],
            [0.42, 0.22],
        ], 0.03);

        // Cross-hatching — filled bands
        for (let i = 0; i < 6; i++) {
            const v = 0.22 + i * 0.1;
            filledLine(drawUV, baseStyle, 0.32, v, 0.58, v + 0.08, 0.022);
            filledLine(drawUV, baseStyle, 0.58, v, 0.32, v + 0.08, 0.022);
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
        filledLine(drawUV, baseStyle, 0.3, 0.3, 0.55, 0.18, 0.025);
        filledLine(drawUV, baseStyle, 0.3, 0.5, 0.6, 0.35, 0.025);
        filledLine(drawUV, baseStyle, 0.3, 0.7, 0.55, 0.55, 0.025);
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
}
