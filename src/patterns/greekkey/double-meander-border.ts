// Double meander border — two rows of stepped keys with connector band
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    // Upper row: top rail
    drawUV([
        [0.0, 0.90], [1.0, 0.90],
        [1.0, 0.97], [0.0, 0.97],
    ], baseStyle);
    // Upper row: bottom rail
    drawUV([
        [0.0, 0.60], [1.0, 0.60],
        [1.0, 0.67], [0.0, 0.67],
    ], baseStyle);
    // Upper step: left key
    drawUV([
        [0.05, 0.67], [0.14, 0.67],
        [0.14, 0.90], [0.05, 0.90],
    ], baseStyle);
    drawUV([
        [0.14, 0.76], [0.28, 0.76],
        [0.28, 0.90], [0.14, 0.90],
    ], baseStyle);
    // Upper step: middle key
    drawUV([
        [0.36, 0.67], [0.45, 0.67],
        [0.45, 0.84], [0.36, 0.84],
    ], baseStyle);
    drawUV([
        [0.45, 0.76], [0.55, 0.76],
        [0.55, 0.90], [0.45, 0.90],
    ], baseStyle);
    // Upper step: right key
    drawUV([
        [0.64, 0.67], [0.73, 0.67],
        [0.73, 0.90], [0.64, 0.90],
    ], baseStyle);
    drawUV([
        [0.73, 0.76], [0.86, 0.76],
        [0.86, 0.90], [0.73, 0.90],
    ], baseStyle);

    // Upper row: fill gaps between keys
    drawUV([
        [0.28, 0.67], [0.36, 0.67],
        [0.36, 0.76], [0.28, 0.76],
    ], baseStyle);
    drawUV([
        [0.55, 0.67], [0.64, 0.67],
        [0.64, 0.76], [0.55, 0.76],
    ], baseStyle);
    drawUV([
        [0.86, 0.67], [0.95, 0.67],
        [0.95, 0.76], [0.86, 0.76],
    ], baseStyle);

    // Lower row: top rail
    drawUV([
        [0.0, 0.33], [1.0, 0.33],
        [1.0, 0.40], [0.0, 0.40],
    ], baseStyle);
    // Lower row: bottom rail
    drawUV([
        [0.0, 0.03], [1.0, 0.03],
        [1.0, 0.10], [0.0, 0.10],
    ], baseStyle);
    // Lower step: keys offset by half
    drawUV([
        [0.18, 0.10], [0.27, 0.10],
        [0.27, 0.33], [0.18, 0.33],
    ], baseStyle);
    drawUV([
        [0.27, 0.10], [0.41, 0.10],
        [0.41, 0.20], [0.27, 0.20],
    ], baseStyle);
    drawUV([
        [0.50, 0.10], [0.59, 0.10],
        [0.59, 0.33], [0.50, 0.33],
    ], baseStyle);
    drawUV([
        [0.59, 0.10], [0.73, 0.10],
        [0.73, 0.20], [0.59, 0.20],
    ], baseStyle);
    drawUV([
        [0.82, 0.10], [0.91, 0.10],
        [0.91, 0.26], [0.82, 0.26],
    ], baseStyle);

    // Lower row: fill gaps between keys
    drawUV([
        [0.05, 0.10], [0.18, 0.10],
        [0.18, 0.20], [0.05, 0.20],
    ], baseStyle);
    drawUV([
        [0.41, 0.10], [0.50, 0.10],
        [0.50, 0.20], [0.41, 0.20],
    ], baseStyle);
    drawUV([
        [0.73, 0.10], [0.82, 0.10],
        [0.82, 0.20], [0.73, 0.20],
    ], baseStyle);

    // Center connector band with notches
    drawUV([
        [0.0, 0.44], [1.0, 0.44],
        [1.0, 0.56], [0.0, 0.56],
    ], baseStyle);

    if (filled) {
        // Cutouts in upper keys
        drawUV([
            [0.07, 0.78], [0.12, 0.78],
            [0.12, 0.86], [0.07, 0.86],
        ], 'opaque-outline');
        drawUV([
            [0.38, 0.69], [0.43, 0.69],
            [0.43, 0.76], [0.38, 0.76],
        ], 'opaque-outline');
        drawUV([
            [0.66, 0.78], [0.71, 0.78],
            [0.71, 0.86], [0.66, 0.86],
        ], 'opaque-outline');
        // Cutouts in lower keys
        drawUV([
            [0.20, 0.22], [0.25, 0.22],
            [0.25, 0.30], [0.20, 0.30],
        ], 'opaque-outline');
        drawUV([
            [0.52, 0.22], [0.57, 0.22],
            [0.57, 0.30], [0.52, 0.30],
        ], 'opaque-outline');
        // Connector band notches
        drawUV([
            [0.15, 0.46], [0.30, 0.46],
            [0.30, 0.54], [0.15, 0.54],
        ], 'opaque-outline');
        drawUV([
            [0.55, 0.46], [0.70, 0.46],
            [0.70, 0.54], [0.55, 0.54],
        ], 'opaque-outline');
    }

    // Detail lines on rails (converted to filled rects)
    drawUV([
        [0.0, 0.915], [1.0, 0.915],
        [1.0, 0.945], [0.0, 0.945],
    ], baseStyle);
    drawUV([
        [0.0, 0.615], [1.0, 0.615],
        [1.0, 0.645], [0.0, 0.645],
    ], baseStyle);
    drawUV([
        [0.0, 0.355], [1.0, 0.355],
        [1.0, 0.385], [0.0, 0.385],
    ], baseStyle);
    drawUV([
        [0.0, 0.055], [1.0, 0.055],
        [1.0, 0.085], [0.0, 0.085],
    ], baseStyle);
    drawUV([
        [0.0, 0.485], [1.0, 0.485],
        [1.0, 0.515], [0.0, 0.515],
    ], baseStyle);
}
