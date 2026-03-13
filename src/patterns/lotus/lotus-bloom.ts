import type { PatternContext } from '../types';
import { taperedVein, filledLine } from './helpers';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
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
        taperedVein(drawUV, baseStyle, [[0.5, 0.08], [0.5, 0.88]], 0.035, 0.012);
        // Main petal side veins — tapered from spine outward
        taperedVein(drawUV, baseStyle, [[0.5, 0.2], [0.36, 0.42]], 0.028, 0.008);
        taperedVein(drawUV, baseStyle, [[0.5, 0.2], [0.64, 0.42]], 0.028, 0.008);
        taperedVein(drawUV, baseStyle, [[0.5, 0.35], [0.38, 0.55]], 0.028, 0.008);
        taperedVein(drawUV, baseStyle, [[0.5, 0.35], [0.62, 0.55]], 0.028, 0.008);
        taperedVein(drawUV, baseStyle, [[0.5, 0.5], [0.42, 0.68]], 0.028, 0.008);
        taperedVein(drawUV, baseStyle, [[0.5, 0.5], [0.58, 0.68]], 0.028, 0.008);
        taperedVein(drawUV, baseStyle, [[0.5, 0.6], [0.44, 0.78]], 0.028, 0.008);
        taperedVein(drawUV, baseStyle, [[0.5, 0.6], [0.56, 0.78]], 0.028, 0.008);

        // Left petal veins — tapered
        taperedVein(drawUV, baseStyle, [[0.17, 0.25], [0.17, 0.42]], 0.025, 0.008);
        taperedVein(drawUV, baseStyle, [[0.17, 0.32], [0.1, 0.45]], 0.025, 0.008);
        taperedVein(drawUV, baseStyle, [[0.17, 0.32], [0.25, 0.5]], 0.025, 0.008);
        taperedVein(drawUV, baseStyle, [[0.17, 0.4], [0.12, 0.55]], 0.025, 0.008);
        taperedVein(drawUV, baseStyle, [[0.17, 0.4], [0.24, 0.58]], 0.025, 0.008);

        // Right petal veins — tapered
        taperedVein(drawUV, baseStyle, [[0.83, 0.25], [0.83, 0.42]], 0.025, 0.008);
        taperedVein(drawUV, baseStyle, [[0.83, 0.32], [0.9, 0.45]], 0.025, 0.008);
        taperedVein(drawUV, baseStyle, [[0.83, 0.32], [0.75, 0.5]], 0.025, 0.008);
        taperedVein(drawUV, baseStyle, [[0.83, 0.4], [0.88, 0.55]], 0.025, 0.008);
        taperedVein(drawUV, baseStyle, [[0.83, 0.4], [0.76, 0.58]], 0.025, 0.008);

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
        filledLine(drawUV, baseStyle, 0.1, 0.28, 0.22, 0.55, 0.025);
        filledLine(drawUV, baseStyle, 0.22, 0.28, 0.1, 0.55, 0.025);
        filledLine(drawUV, baseStyle, 0.78, 0.28, 0.9, 0.55, 0.025);
        filledLine(drawUV, baseStyle, 0.9, 0.28, 0.78, 0.55, 0.025);

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
}
