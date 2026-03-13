// Greek fret mosaic — tessellating L-shapes and T-shapes
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    // Top-left L (facing down-right)
    drawUV([
        [0.04, 0.56], [0.20, 0.56],
        [0.20, 0.68], [0.14, 0.68],
        [0.14, 0.94], [0.04, 0.94],
    ], baseStyle);

    // Top-right L (facing down-left, mirrored)
    drawUV([
        [0.80, 0.56], [0.96, 0.56],
        [0.96, 0.94], [0.86, 0.94],
        [0.86, 0.68], [0.80, 0.68],
    ], baseStyle);

    // Bottom-left L (facing up-right)
    drawUV([
        [0.04, 0.06], [0.14, 0.06],
        [0.14, 0.32], [0.20, 0.32],
        [0.20, 0.44], [0.04, 0.44],
    ], baseStyle);

    // Bottom-right L (facing up-left, mirrored)
    drawUV([
        [0.86, 0.06], [0.96, 0.06],
        [0.96, 0.44], [0.80, 0.44],
        [0.80, 0.32], [0.86, 0.32],
    ], baseStyle);

    // Center T-shape top
    drawUV([
        [0.28, 0.72], [0.72, 0.72],
        [0.72, 0.82], [0.56, 0.82],
        [0.56, 0.94], [0.44, 0.94],
        [0.44, 0.82], [0.28, 0.82],
    ], baseStyle);

    // Center T-shape bottom (inverted)
    drawUV([
        [0.28, 0.18], [0.44, 0.18],
        [0.44, 0.06], [0.56, 0.06],
        [0.56, 0.18], [0.72, 0.18],
        [0.72, 0.28], [0.28, 0.28],
    ], baseStyle);

    // Center connector block
    drawUV([
        [0.36, 0.40], [0.64, 0.40],
        [0.64, 0.60], [0.36, 0.60],
    ], baseStyle);

    // Horizontal bridge bars
    drawUV([
        [0.20, 0.46], [0.36, 0.46],
        [0.36, 0.54], [0.20, 0.54],
    ], baseStyle);
    drawUV([
        [0.64, 0.46], [0.80, 0.46],
        [0.80, 0.54], [0.64, 0.54],
    ], baseStyle);

    // Additional filled areas to reduce empty space
    // Fill between top L-shapes and T-shape
    drawUV([
        [0.20, 0.68], [0.28, 0.68],
        [0.28, 0.72], [0.20, 0.72],
    ], baseStyle);
    drawUV([
        [0.72, 0.68], [0.80, 0.68],
        [0.80, 0.72], [0.72, 0.72],
    ], baseStyle);
    // Fill between bottom L-shapes and T-shape
    drawUV([
        [0.20, 0.28], [0.28, 0.28],
        [0.28, 0.32], [0.20, 0.32],
    ], baseStyle);
    drawUV([
        [0.72, 0.28], [0.80, 0.28],
        [0.80, 0.32], [0.72, 0.32],
    ], baseStyle);
    // Fill vertical gaps beside center block
    drawUV([
        [0.20, 0.54], [0.36, 0.54],
        [0.36, 0.60], [0.20, 0.60],
    ], baseStyle);
    drawUV([
        [0.64, 0.54], [0.80, 0.54],
        [0.80, 0.60], [0.64, 0.60],
    ], baseStyle);
    drawUV([
        [0.20, 0.40], [0.36, 0.40],
        [0.36, 0.46], [0.20, 0.46],
    ], baseStyle);
    drawUV([
        [0.64, 0.40], [0.80, 0.40],
        [0.80, 0.46], [0.64, 0.46],
    ], baseStyle);

    if (filled) {
        // Center block cutout
        drawUV([
            [0.42, 0.45], [0.58, 0.45],
            [0.58, 0.55], [0.42, 0.55],
        ], 'opaque-outline');
        // T-shape cutouts
        drawUV([
            [0.38, 0.74], [0.62, 0.74],
            [0.62, 0.80], [0.38, 0.80],
        ], 'opaque-outline');
        drawUV([
            [0.38, 0.20], [0.62, 0.20],
            [0.62, 0.26], [0.38, 0.26],
        ], 'opaque-outline');
        // L-shape cutouts
        drawUV([
            [0.06, 0.72], [0.12, 0.72],
            [0.12, 0.86], [0.06, 0.86],
        ], 'opaque-outline');
        drawUV([
            [0.88, 0.72], [0.94, 0.72],
            [0.94, 0.86], [0.88, 0.86],
        ], 'opaque-outline');
        drawUV([
            [0.06, 0.14], [0.12, 0.14],
            [0.12, 0.28], [0.06, 0.28],
        ], 'opaque-outline');
        drawUV([
            [0.88, 0.14], [0.94, 0.14],
            [0.94, 0.28], [0.88, 0.28],
        ], 'opaque-outline');
    }

    // Grid detail lines (converted to filled rects)
    // Horizontal center line
    drawUV([
        [0.0, 0.485], [1.0, 0.485],
        [1.0, 0.515], [0.0, 0.515],
    ], baseStyle);
    // Vertical center line
    drawUV([
        [0.485, 0.0], [0.515, 0.0],
        [0.515, 1.0], [0.485, 1.0],
    ], baseStyle);
    // Corner accent diagonals (converted to filled parallelograms)
    drawUV([
        [0.20, 0.54], [0.22, 0.56],
        [0.30, 0.60], [0.28, 0.58],
    ], baseStyle);
    drawUV([
        [0.72, 0.54], [0.74, 0.56],
        [0.82, 0.60], [0.80, 0.58],
    ], baseStyle);
    drawUV([
        [0.20, 0.46], [0.22, 0.44],
        [0.30, 0.40], [0.28, 0.42],
    ], baseStyle);
    drawUV([
        [0.72, 0.46], [0.74, 0.44],
        [0.82, 0.40], [0.80, 0.42],
    ], baseStyle);
}
