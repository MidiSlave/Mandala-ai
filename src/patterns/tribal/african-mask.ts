// African Mask
import type { PatternContext } from '../types';
import { dot } from './helpers';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    // Face outline — large shield/oval shape
    drawUV([
        [0.5, 0.03],
        [0.65, 0.06], [0.76, 0.14], [0.82, 0.25],
        [0.84, 0.4], [0.82, 0.55], [0.78, 0.68],
        [0.72, 0.78], [0.62, 0.88], [0.5, 0.92],
        [0.38, 0.88], [0.28, 0.78], [0.22, 0.68],
        [0.18, 0.55], [0.16, 0.4], [0.18, 0.25],
        [0.24, 0.14], [0.35, 0.06],
    ], baseStyle);

    // Headdress crown — triangles at the top
    drawUV([[0.35, 0.06], [0.38, 0.0], [0.42, 0.06]], baseStyle);
    drawUV([[0.42, 0.04], [0.46, 0.0], [0.5, 0.03]], baseStyle);
    drawUV([[0.5, 0.03], [0.54, 0.0], [0.58, 0.04]], baseStyle);
    drawUV([[0.58, 0.06], [0.62, 0.0], [0.65, 0.06]], baseStyle);

    if (filled) {
        // Eyes — almond shapes as cutouts
        drawUV([
            [0.28, 0.38], [0.33, 0.33], [0.42, 0.34],
            [0.44, 0.38], [0.42, 0.42], [0.33, 0.43],
        ], 'opaque-outline');
        drawUV([
            [0.56, 0.34], [0.67, 0.33], [0.72, 0.38],
            [0.67, 0.43], [0.58, 0.42], [0.56, 0.38],
        ], 'opaque-outline');
        // Pupils — filled dots inside eyes
        drawUV(dot(0.37, 0.38, 0.025), 'filled');
        drawUV(dot(0.63, 0.38, 0.025), 'filled');
    } else {
        // Eyes — almond filled
        drawUV([
            [0.28, 0.38], [0.33, 0.33], [0.42, 0.34],
            [0.44, 0.38], [0.42, 0.42], [0.33, 0.43],
        ], 'filled');
        drawUV([
            [0.56, 0.34], [0.67, 0.33], [0.72, 0.38],
            [0.67, 0.43], [0.58, 0.42], [0.56, 0.38],
        ], 'filled');
        // Pupils
        drawUV(dot(0.37, 0.38, 0.02), 'filled');
        drawUV(dot(0.63, 0.38, 0.02), 'filled');
    }

    // Nose — elongated triangle
    drawUV([
        [0.5, 0.42], [0.54, 0.6], [0.5, 0.64], [0.46, 0.6],
    ], filled ? baseStyle : 'filled');

    // Mouth — wide rectangle with teeth marks
    drawUV([
        [0.36, 0.7], [0.64, 0.7], [0.64, 0.78], [0.36, 0.78],
    ], filled ? baseStyle : 'filled');
    if (!filled) {
        // Vertical teeth as thin filled bars
        drawUV([[0.42 - 0.012, 0.7], [0.42 + 0.012, 0.7], [0.42 + 0.012, 0.78], [0.42 - 0.012, 0.78]], baseStyle);
        drawUV([[0.48 - 0.012, 0.7], [0.48 + 0.012, 0.7], [0.48 + 0.012, 0.78], [0.48 - 0.012, 0.78]], baseStyle);
        drawUV([[0.54 - 0.012, 0.7], [0.54 + 0.012, 0.7], [0.54 + 0.012, 0.78], [0.54 - 0.012, 0.78]], baseStyle);
        drawUV([[0.60 - 0.012, 0.7], [0.60 + 0.012, 0.7], [0.60 + 0.012, 0.78], [0.60 - 0.012, 0.78]], baseStyle);
    } else {
        // Teeth as opaque cutouts
        drawUV([[0.42, 0.71], [0.46, 0.71], [0.46, 0.77], [0.42, 0.77]], 'opaque-outline');
        drawUV([[0.54, 0.71], [0.58, 0.71], [0.58, 0.77], [0.54, 0.77]], 'opaque-outline');
    }

    // Scarification marks — thin filled bars on cheeks
    if (!filled) {
        for (let i = 0; i < 3; i++) {
            const y = 0.5 + i * 0.05;
            drawUV([[0.22, y - 0.012], [0.34, y - 0.012], [0.34, y + 0.012], [0.22, y + 0.012]], baseStyle);
            drawUV([[0.66, y - 0.012], [0.78, y - 0.012], [0.78, y + 0.012], [0.66, y + 0.012]], baseStyle);
        }
    } else {
        for (let i = 0; i < 3; i++) {
            const y = 0.5 + i * 0.05;
            drawUV([[0.22, y], [0.34, y], [0.34, y + 0.015], [0.22, y + 0.015]], 'opaque-outline');
            drawUV([[0.66, y], [0.78, y], [0.78, y + 0.015], [0.66, y + 0.015]], 'opaque-outline');
        }
    }

    // Forehead decoration — horizontal band
    drawUV([
        [0.28, 0.22], [0.72, 0.22], [0.72, 0.27], [0.28, 0.27],
    ], filled ? baseStyle : 'filled');
}
