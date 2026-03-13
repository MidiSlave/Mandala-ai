// Tribal Shield
import type { PatternContext } from '../types';
import { dot } from './helpers';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    // Outer shield shape
    drawUV([
        [0.5, 0.02],
        [0.78, 0.1], [0.9, 0.25], [0.94, 0.45],
        [0.9, 0.65], [0.78, 0.82], [0.5, 0.96],
        [0.22, 0.82], [0.1, 0.65], [0.06, 0.45],
        [0.1, 0.25], [0.22, 0.1],
    ], baseStyle);

    // First concentric border
    drawUV([
        [0.5, 0.1],
        [0.7, 0.16], [0.8, 0.28], [0.84, 0.45],
        [0.8, 0.6], [0.7, 0.74], [0.5, 0.86],
        [0.3, 0.74], [0.2, 0.6], [0.16, 0.45],
        [0.2, 0.28], [0.3, 0.16],
    ], filled ? 'opaque-outline' : 'filled');

    // Second concentric border
    drawUV([
        [0.5, 0.18],
        [0.64, 0.22], [0.72, 0.32], [0.75, 0.45],
        [0.72, 0.56], [0.64, 0.67], [0.5, 0.76],
        [0.36, 0.67], [0.28, 0.56], [0.25, 0.45],
        [0.28, 0.32], [0.36, 0.22],
    ], filled ? 'filled' : 'filled');

    // Central vertical bar (cross)
    if (filled) {
        drawUV([[0.5, 0.2], [0.5, 0.74]], 'opaque-outline');
    } else {
        drawUV([[0.5 - 0.012, 0.2], [0.5 + 0.012, 0.2], [0.5 + 0.012, 0.74], [0.5 - 0.012, 0.74]], baseStyle);
    }

    // Central horizontal bar (cross)
    if (filled) {
        drawUV([[0.27, 0.45], [0.73, 0.45]], 'opaque-outline');
    } else {
        drawUV([[0.27, 0.45 - 0.012], [0.73, 0.45 - 0.012], [0.73, 0.45 + 0.012], [0.27, 0.45 + 0.012]], baseStyle);
    }

    if (filled) {
        // Filled triangles in alternating quadrants (top-right and bottom-left)
        drawUV([[0.5, 0.2], [0.7, 0.32], [0.5, 0.45]], 'opaque-outline');
        drawUV([[0.5, 0.45], [0.3, 0.58], [0.5, 0.74]], 'opaque-outline');
    } else {
        // X dividers as thin filled bars
        // Diagonal from top-left to bottom-right
        drawUV([
            [0.35 - 0.012, 0.25], [0.35 + 0.012, 0.25],
            [0.65 + 0.012, 0.65], [0.65 - 0.012, 0.65],
        ], baseStyle);
        // Diagonal from top-right to bottom-left
        drawUV([
            [0.65 - 0.012, 0.25], [0.65 + 0.012, 0.25],
            [0.35 + 0.012, 0.65], [0.35 - 0.012, 0.65],
        ], baseStyle);
    }

    // Dot patterns along the outer border
    const shieldDots = [
        [0.5, 0.06], [0.68, 0.12], [0.82, 0.22],
        [0.88, 0.38], [0.88, 0.55], [0.82, 0.7],
        [0.68, 0.8], [0.5, 0.9],
        [0.32, 0.8], [0.18, 0.7], [0.12, 0.55],
        [0.12, 0.38], [0.18, 0.22], [0.32, 0.12],
    ];
    for (const [dx, dy] of shieldDots) {
        drawUV(dot(dx, dy, 0.018), filled ? baseStyle : 'filled');
    }
}
