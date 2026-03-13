// Labyrinth cross — cross with spiral arm tips curling inward
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    // Vertical bar of cross
    drawUV([
        [0.38, 0.06], [0.62, 0.06],
        [0.62, 0.94], [0.38, 0.94],
    ], baseStyle);
    // Horizontal bar of cross
    drawUV([
        [0.06, 0.38], [0.94, 0.38],
        [0.94, 0.62], [0.06, 0.62],
    ], baseStyle);

    // Top-right curl
    drawUV([
        [0.62, 0.78], [0.80, 0.78],
        [0.80, 0.92], [0.62, 0.92],
    ], baseStyle);
    // Bottom-left curl
    drawUV([
        [0.20, 0.08], [0.38, 0.08],
        [0.38, 0.22], [0.20, 0.22],
    ], baseStyle);
    // Top-left curl
    drawUV([
        [0.06, 0.62], [0.22, 0.62],
        [0.22, 0.80], [0.06, 0.80],
    ], baseStyle);
    // Bottom-right curl
    drawUV([
        [0.78, 0.20], [0.94, 0.20],
        [0.94, 0.38], [0.78, 0.38],
    ], baseStyle);

    // Corner fill blocks to reduce empty space
    drawUV([
        [0.06, 0.80], [0.22, 0.80],
        [0.22, 0.94], [0.06, 0.94],
    ], baseStyle);
    drawUV([
        [0.78, 0.06], [0.94, 0.06],
        [0.94, 0.20], [0.78, 0.20],
    ], baseStyle);
    drawUV([
        [0.06, 0.06], [0.20, 0.06],
        [0.20, 0.22], [0.06, 0.22],
    ], baseStyle);
    drawUV([
        [0.80, 0.78], [0.94, 0.78],
        [0.94, 0.94], [0.80, 0.94],
    ], baseStyle);

    if (filled) {
        // Central diamond cutout
        drawUV([
            [0.50, 0.40], [0.60, 0.50],
            [0.50, 0.60], [0.40, 0.50],
        ], 'opaque-outline');
        // Cutouts in each arm
        drawUV([
            [0.44, 0.74], [0.56, 0.74],
            [0.56, 0.84], [0.44, 0.84],
        ], 'opaque-outline');
        drawUV([
            [0.44, 0.16], [0.56, 0.16],
            [0.56, 0.26], [0.44, 0.26],
        ], 'opaque-outline');
        drawUV([
            [0.14, 0.44], [0.24, 0.44],
            [0.24, 0.56], [0.14, 0.56],
        ], 'opaque-outline');
        drawUV([
            [0.76, 0.44], [0.86, 0.44],
            [0.86, 0.56], [0.76, 0.56],
        ], 'opaque-outline');
        // Cutouts in curl blocks
        drawUV([
            [0.66, 0.82], [0.76, 0.82],
            [0.76, 0.88], [0.66, 0.88],
        ], 'opaque-outline');
        drawUV([
            [0.24, 0.12], [0.34, 0.12],
            [0.34, 0.18], [0.24, 0.18],
        ], 'opaque-outline');
        drawUV([
            [0.10, 0.66], [0.18, 0.66],
            [0.18, 0.76], [0.10, 0.76],
        ], 'opaque-outline');
        drawUV([
            [0.82, 0.24], [0.90, 0.24],
            [0.90, 0.34], [0.82, 0.34],
        ], 'opaque-outline');
        // Cutouts in corner fill blocks
        drawUV([
            [0.09, 0.84], [0.19, 0.84],
            [0.19, 0.91], [0.09, 0.91],
        ], 'opaque-outline');
        drawUV([
            [0.81, 0.09], [0.91, 0.09],
            [0.91, 0.17], [0.81, 0.17],
        ], 'opaque-outline');
        drawUV([
            [0.09, 0.09], [0.17, 0.09],
            [0.17, 0.19], [0.09, 0.19],
        ], 'opaque-outline');
        drawUV([
            [0.83, 0.81], [0.91, 0.81],
            [0.91, 0.91], [0.83, 0.91],
        ], 'opaque-outline');
    }

    // Cross-hair detail lines through center (converted to filled rects)
    // Vertical center line
    drawUV([
        [0.485, 0.06], [0.515, 0.06],
        [0.515, 0.94], [0.485, 0.94],
    ], baseStyle);
    // Horizontal center line
    drawUV([
        [0.06, 0.485], [0.94, 0.485],
        [0.94, 0.515], [0.06, 0.515],
    ], baseStyle);
    // Diagonal detail at corners (converted to filled parallelograms)
    drawUV([
        [0.06, 0.04], [0.08, 0.06],
        [0.22, 0.20], [0.20, 0.18],
    ], baseStyle);
    drawUV([
        [0.80, 0.78], [0.82, 0.80],
        [0.96, 0.94], [0.94, 0.92],
    ], baseStyle);
    drawUV([
        [0.80, 0.08], [0.82, 0.06],
        [0.96, 0.20], [0.94, 0.22],
    ], baseStyle);
    drawUV([
        [0.06, 0.82], [0.08, 0.80],
        [0.22, 0.94], [0.20, 0.96],
    ], baseStyle);
}
