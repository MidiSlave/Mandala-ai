// War Dance Figure
import type { PatternContext } from '../types';
import { dot, sq, oval } from './helpers';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    // Head — circle approximation
    drawUV(oval(0.5, 0.82, 0.07, 0.06, 8), baseStyle);

    // Headdress feathers — 3 feathers radiating up
    drawUV([[0.5, 0.88], [0.48, 0.97], [0.52, 0.97]], baseStyle);
    drawUV([[0.44, 0.87], [0.38, 0.96], [0.43, 0.94]], baseStyle);
    drawUV([[0.56, 0.87], [0.62, 0.96], [0.57, 0.94]], baseStyle);

    // Neck
    drawUV([[0.47, 0.76], [0.53, 0.76], [0.53, 0.72], [0.47, 0.72]], baseStyle);

    // Torso — triangular
    drawUV([
        [0.5, 0.72],
        [0.65, 0.45],
        [0.6, 0.42],
        [0.4, 0.42],
        [0.35, 0.45],
    ], baseStyle);

    // Waist / loincloth
    drawUV([
        [0.4, 0.42], [0.6, 0.42], [0.58, 0.37], [0.42, 0.37],
    ], baseStyle);
    // Loincloth fringe
    drawUV([[0.45, 0.37], [0.5, 0.32], [0.55, 0.37]], baseStyle);

    // Right arm — raised up (holding spear)
    drawUV([
        [0.62, 0.68], [0.65, 0.7],
        [0.78, 0.82], [0.8, 0.84],
        [0.82, 0.82], [0.8, 0.80],
        [0.67, 0.66], [0.64, 0.65],
    ], baseStyle);
    // Spear in right hand — thin filled bar instead of line
    if (filled) {
        drawUV([[0.8, 0.84], [0.8, 0.98]], baseStyle);
    } else {
        drawUV([[0.8 - 0.012, 0.84], [0.8 + 0.012, 0.84], [0.8 + 0.012, 0.98], [0.8 - 0.012, 0.98]], baseStyle);
    }
    drawUV([[0.77, 0.95], [0.8, 0.98], [0.83, 0.95]], baseStyle); // spear tip

    // Left arm — extended down holding shield
    drawUV([
        [0.38, 0.68], [0.35, 0.66],
        [0.22, 0.56], [0.2, 0.54],
        [0.18, 0.56], [0.2, 0.58],
        [0.33, 0.7], [0.36, 0.7],
    ], baseStyle);

    // Small shield in left hand
    drawUV([
        [0.1, 0.5], [0.2, 0.44], [0.26, 0.52],
        [0.2, 0.6], [0.1, 0.56],
    ], baseStyle);
    // Shield inner detail
    drawUV(dot(0.18, 0.52, 0.025), filled ? 'opaque-outline' : 'filled');

    // Right leg — forward (running)
    drawUV([
        [0.52, 0.37], [0.56, 0.37],
        [0.68, 0.18], [0.72, 0.14],
        [0.7, 0.12], [0.66, 0.14],
        [0.54, 0.32], [0.5, 0.35],
    ], baseStyle);
    // Right foot
    drawUV([[0.68, 0.12], [0.76, 0.12], [0.76, 0.14], [0.68, 0.14]], baseStyle);

    // Left leg — back (running)
    drawUV([
        [0.44, 0.37], [0.48, 0.37],
        [0.38, 0.18], [0.34, 0.1],
        [0.32, 0.12], [0.34, 0.14],
        [0.42, 0.32], [0.42, 0.35],
    ], baseStyle);
    // Left foot
    drawUV([[0.28, 0.1], [0.34, 0.1], [0.34, 0.12], [0.28, 0.12]], baseStyle);

    // Wrist bands
    drawUV([
        [0.77, 0.79], [0.83, 0.83], [0.82, 0.85], [0.76, 0.81],
    ], filled ? baseStyle : 'filled');
    drawUV([
        [0.18, 0.53], [0.22, 0.55], [0.21, 0.57], [0.17, 0.55],
    ], filled ? baseStyle : 'filled');

    // Ankle bands
    drawUV(sq(0.71, 0.13, 0.02), filled ? baseStyle : 'filled');
    drawUV(sq(0.33, 0.11, 0.02), filled ? baseStyle : 'filled');

    if (!filled) {
        // Torso decoration — horizontal filled bars instead of lines
        drawUV([[0.42, 0.55 - 0.012], [0.58, 0.55 - 0.012], [0.58, 0.55 + 0.012], [0.42, 0.55 + 0.012]], baseStyle);
        drawUV([[0.43, 0.5 - 0.012], [0.57, 0.5 - 0.012], [0.57, 0.5 + 0.012], [0.43, 0.5 + 0.012]], baseStyle);
        drawUV([[0.39, 0.6 - 0.012], [0.61, 0.6 - 0.012], [0.61, 0.6 + 0.012], [0.39, 0.6 + 0.012]], baseStyle);
        // Face features — filled shapes instead of lines
        // Eyes as small filled dots
        drawUV(dot(0.48, 0.82, 0.012), baseStyle);
        drawUV(dot(0.52, 0.82, 0.012), baseStyle);
        // Mouth as small filled bar
        drawUV([[0.48, 0.8 - 0.012], [0.52, 0.8 - 0.012], [0.52, 0.8 + 0.012], [0.48, 0.8 + 0.012]], baseStyle);
    }
}
