// Temple glyph — abstract face/mask with geometric features
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    // Outer face border (rectangular frame with stepped top)
    drawUV([
        [0.10, 0.05], [0.35, 0.05],
        [0.35, 0.0], [0.65, 0.0],
        [0.65, 0.05], [0.90, 0.05],
        [0.90, 0.95], [0.10, 0.95],
    ], baseStyle);

    if (filled) {
        // Inner face cutout
        drawUV([
            [0.18, 0.12], [0.82, 0.12],
            [0.82, 0.88], [0.18, 0.88],
        ], 'opaque-outline');
    }

    // Left eye (stepped rectangle)
    drawUV([
        [0.20, 0.18], [0.30, 0.18],
        [0.32, 0.20], [0.40, 0.20],
        [0.40, 0.38], [0.32, 0.38],
        [0.30, 0.40], [0.20, 0.40],
    ], baseStyle);

    // Right eye (stepped rectangle, mirrored)
    drawUV([
        [0.60, 0.20], [0.68, 0.20],
        [0.70, 0.18], [0.80, 0.18],
        [0.80, 0.40], [0.70, 0.40],
        [0.68, 0.38], [0.60, 0.38],
    ], baseStyle);

    // Left pupil
    drawUV([
        [0.26, 0.26], [0.34, 0.26],
        [0.34, 0.34], [0.26, 0.34],
    ], filled ? 'opaque-outline' : 'filled');

    // Right pupil
    drawUV([
        [0.66, 0.26], [0.74, 0.26],
        [0.74, 0.34], [0.66, 0.34],
    ], filled ? 'opaque-outline' : 'filled');

    // Triangular nose
    drawUV([
        [0.50, 0.34],
        [0.58, 0.54],
        [0.42, 0.54],
    ], baseStyle);
    if (filled) {
        drawUV([
            [0.50, 0.40],
            [0.54, 0.50],
            [0.46, 0.50],
        ], 'opaque-outline');
    }
    // Nose bridge line
    drawUV([[0.50, 0.20], [0.50, 0.34]], 'line');

    // Step-pattern mouth
    drawUV([
        [0.22, 0.60], [0.32, 0.60],
        [0.32, 0.64], [0.40, 0.64],
        [0.40, 0.68], [0.60, 0.68],
        [0.60, 0.64], [0.68, 0.64],
        [0.68, 0.60], [0.78, 0.60],
        [0.78, 0.78], [0.22, 0.78],
    ], baseStyle);

    if (filled) {
        // Teeth gaps
        drawUV([
            [0.30, 0.70], [0.38, 0.70],
            [0.38, 0.76], [0.30, 0.76],
        ], 'opaque-outline');
        drawUV([
            [0.46, 0.70], [0.54, 0.70],
            [0.54, 0.76], [0.46, 0.76],
        ], 'opaque-outline');
        drawUV([
            [0.62, 0.70], [0.70, 0.70],
            [0.70, 0.76], [0.62, 0.76],
        ], 'opaque-outline');
    }

    // Horizontal mouth accent
    drawUV([[0.26, 0.69], [0.74, 0.69]], 'line');

    // Forehead band with glyphs
    drawUV([
        [0.10, 0.05], [0.90, 0.05],
        [0.90, 0.14], [0.10, 0.14],
    ], baseStyle);
    // Forehead triangular glyphs
    drawUV([[0.25, 0.06], [0.30, 0.12], [0.20, 0.12]], filled ? 'opaque-outline' : 'outline');
    drawUV([[0.50, 0.06], [0.55, 0.12], [0.45, 0.12]], filled ? 'opaque-outline' : 'outline');
    drawUV([[0.75, 0.06], [0.80, 0.12], [0.70, 0.12]], filled ? 'opaque-outline' : 'outline');

    // Ear decorations (stepped shapes)
    drawUV([
        [0.04, 0.22], [0.10, 0.18],
        [0.10, 0.44], [0.04, 0.40],
    ], baseStyle);
    drawUV([
        [0.90, 0.18], [0.96, 0.22],
        [0.96, 0.40], [0.90, 0.44],
    ], baseStyle);

    // Ear inner dots
    drawUV([
        [0.05, 0.28], [0.09, 0.28],
        [0.09, 0.34], [0.05, 0.34],
    ], filled ? 'opaque-outline' : 'filled');
    drawUV([
        [0.91, 0.28], [0.95, 0.28],
        [0.95, 0.34], [0.91, 0.34],
    ], filled ? 'opaque-outline' : 'filled');

    // Chin pendant
    drawUV([
        [0.40, 0.88], [0.50, 0.98],
        [0.60, 0.88],
    ], baseStyle);
    // Chin dots
    drawUV([
        [0.32, 0.90], [0.36, 0.90],
        [0.36, 0.94], [0.32, 0.94],
    ], 'filled');
    drawUV([
        [0.64, 0.90], [0.68, 0.90],
        [0.68, 0.94], [0.64, 0.94],
    ], 'filled');

    // Cheek accent lines
    drawUV([[0.18, 0.46], [0.18, 0.56]], 'line');
    drawUV([[0.82, 0.46], [0.82, 0.56]], 'line');
}
