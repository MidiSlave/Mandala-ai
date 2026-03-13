// Wave scroll / running dog — S-curves with filled wave bands
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    // Upper wave band (thick S-shape)
    drawUV([
        [0.0, 0.56], [0.06, 0.62], [0.14, 0.70],
        [0.22, 0.74], [0.32, 0.74], [0.40, 0.70],
        [0.46, 0.62], [0.50, 0.56],
        [0.54, 0.62], [0.60, 0.70],
        [0.68, 0.74], [0.78, 0.74], [0.86, 0.70],
        [0.94, 0.62], [1.0, 0.56],
        [1.0, 0.68], [0.94, 0.76], [0.86, 0.82],
        [0.78, 0.86], [0.68, 0.86], [0.60, 0.82],
        [0.54, 0.76], [0.50, 0.68],
        [0.46, 0.76], [0.40, 0.82],
        [0.32, 0.86], [0.22, 0.86], [0.14, 0.82],
        [0.06, 0.76], [0.0, 0.68],
    ], baseStyle);

    // Lower wave band (inverted S)
    drawUV([
        [0.0, 0.32], [0.06, 0.24], [0.14, 0.18],
        [0.22, 0.14], [0.32, 0.14], [0.40, 0.18],
        [0.46, 0.24], [0.50, 0.32],
        [0.54, 0.24], [0.60, 0.18],
        [0.68, 0.14], [0.78, 0.14], [0.86, 0.18],
        [0.94, 0.24], [1.0, 0.32],
        [1.0, 0.44], [0.94, 0.38], [0.86, 0.30],
        [0.78, 0.26], [0.68, 0.26], [0.60, 0.30],
        [0.54, 0.38], [0.50, 0.44],
        [0.46, 0.38], [0.40, 0.30],
        [0.32, 0.26], [0.22, 0.26], [0.14, 0.30],
        [0.06, 0.38], [0.0, 0.44],
    ], baseStyle);

    // Top border rail
    drawUV([
        [0.0, 0.90], [1.0, 0.90],
        [1.0, 0.98], [0.0, 0.98],
    ], baseStyle);
    // Bottom border rail
    drawUV([
        [0.0, 0.02], [1.0, 0.02],
        [1.0, 0.08], [0.0, 0.08],
    ], baseStyle);

    // Fill between upper wave and top rail
    drawUV([
        [0.0, 0.86], [1.0, 0.86],
        [1.0, 0.90], [0.0, 0.90],
    ], baseStyle);
    // Fill between lower wave and bottom rail
    drawUV([
        [0.0, 0.08], [1.0, 0.08],
        [1.0, 0.14], [0.0, 0.14],
    ], baseStyle);

    // Center horizontal band between waves
    drawUV([
        [0.0, 0.46], [1.0, 0.46],
        [1.0, 0.54], [0.0, 0.54],
    ], baseStyle);

    if (filled) {
        // Spiral eye cutouts in upper waves
        drawUV([
            [0.24, 0.64], [0.30, 0.64],
            [0.30, 0.72], [0.24, 0.72],
        ], 'opaque-outline');
        drawUV([
            [0.70, 0.64], [0.76, 0.64],
            [0.76, 0.72], [0.70, 0.72],
        ], 'opaque-outline');
        // Spiral eye cutouts in lower waves
        drawUV([
            [0.24, 0.16], [0.30, 0.16],
            [0.30, 0.24], [0.24, 0.24],
        ], 'opaque-outline');
        drawUV([
            [0.70, 0.16], [0.76, 0.16],
            [0.76, 0.24], [0.70, 0.24],
        ], 'opaque-outline');
        // Center band cutout
        drawUV([
            [0.22, 0.48], [0.34, 0.48],
            [0.34, 0.52], [0.22, 0.52],
        ], 'opaque-outline');
        drawUV([
            [0.66, 0.48], [0.78, 0.48],
            [0.78, 0.52], [0.66, 0.52],
        ], 'opaque-outline');
    }

    // Detail lines on borders (converted to filled rects)
    drawUV([
        [0.0, 0.935], [1.0, 0.935],
        [1.0, 0.965], [0.0, 0.965],
    ], baseStyle);
    drawUV([
        [0.0, 0.035], [1.0, 0.035],
        [1.0, 0.065], [0.0, 0.065],
    ], baseStyle);
    // Vertical connector bars between waves (converted to filled rects)
    drawUV([
        [0.235, 0.44], [0.265, 0.44],
        [0.265, 0.56], [0.235, 0.56],
    ], baseStyle);
    drawUV([
        [0.735, 0.44], [0.765, 0.44],
        [0.765, 0.56], [0.735, 0.56],
    ], baseStyle);
    drawUV([
        [0.485, 0.44], [0.515, 0.44],
        [0.515, 0.56], [0.485, 0.56],
    ], baseStyle);
}
