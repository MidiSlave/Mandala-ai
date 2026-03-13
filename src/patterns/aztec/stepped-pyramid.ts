// Stepped pyramid — centered symmetric zigzag steps with internal details
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    // Main pyramid body with stepped outline
    drawUV([
        [0.05, 0.0], [0.95, 0.0],    // base
        [0.95, 0.15], [0.80, 0.15],   // step 1 right
        [0.80, 0.30], [0.70, 0.30],   // step 2 right
        [0.70, 0.48], [0.62, 0.48],   // step 3 right
        [0.62, 0.65], [0.56, 0.65],   // step 4 right
        [0.56, 0.80], [0.44, 0.80],   // peak plateau
        [0.44, 0.65], [0.38, 0.65],   // step 4 left
        [0.38, 0.48], [0.30, 0.48],   // step 3 left
        [0.30, 0.30], [0.20, 0.30],   // step 2 left
        [0.20, 0.15], [0.05, 0.15],   // step 1 left
    ], baseStyle);

    // Temple capstone on top
    drawUV([
        [0.42, 0.80], [0.58, 0.80],
        [0.58, 0.92], [0.42, 0.92],
    ], filled ? 'opaque-outline' : 'outline');

    // Capstone inner diamond
    drawUV([
        [0.50, 0.82], [0.55, 0.86],
        [0.50, 0.90], [0.45, 0.86],
    ], filled ? baseStyle : 'filled');

    // Horizontal step accent lines
    drawUV([[0.08, 0.07], [0.92, 0.07]], 'line');
    drawUV([[0.23, 0.22], [0.77, 0.22]], 'line');
    drawUV([[0.33, 0.39], [0.67, 0.39]], 'line');
    drawUV([[0.40, 0.56], [0.60, 0.56]], 'line');
    drawUV([[0.46, 0.72], [0.54, 0.72]], 'line');

    // Vertical center spine
    drawUV([[0.50, 0.0], [0.50, 0.80]], 'line');

    if (filled) {
        // Doorway cutout at base center
        drawUV([
            [0.40, 0.0], [0.60, 0.0],
            [0.60, 0.12], [0.40, 0.12],
        ], 'opaque-outline');
        // Window cutouts on step 2
        drawUV([
            [0.24, 0.32], [0.32, 0.32],
            [0.32, 0.44], [0.24, 0.44],
        ], 'opaque-outline');
        drawUV([
            [0.68, 0.32], [0.76, 0.32],
            [0.76, 0.44], [0.68, 0.44],
        ], 'opaque-outline');
        // Small diamond cutouts on step 1
        drawUV([
            [0.14, 0.04], [0.18, 0.08],
            [0.14, 0.12], [0.10, 0.08],
        ], 'opaque-outline');
        drawUV([
            [0.86, 0.04], [0.90, 0.08],
            [0.86, 0.12], [0.82, 0.08],
        ], 'opaque-outline');
    } else {
        // In outline mode, add filled accent shapes for visibility
        drawUV([
            [0.14, 0.04], [0.18, 0.08],
            [0.14, 0.12], [0.10, 0.08],
        ], 'filled');
        drawUV([
            [0.86, 0.04], [0.90, 0.08],
            [0.86, 0.12], [0.82, 0.08],
        ], 'filled');
        // Filled squares at step corners
        drawUV([
            [0.24, 0.32], [0.32, 0.32],
            [0.32, 0.44], [0.24, 0.44],
        ], 'filled');
        drawUV([
            [0.68, 0.32], [0.76, 0.32],
            [0.76, 0.44], [0.68, 0.44],
        ], 'filled');
        // Filled doorway block at base
        drawUV([
            [0.40, 0.0], [0.60, 0.0],
            [0.60, 0.12], [0.40, 0.12],
        ], 'filled');
        // Step fill bands for outline visibility
        drawUV([
            [0.34, 0.50], [0.66, 0.50],
            [0.66, 0.56], [0.34, 0.56],
        ], 'filled');
    }

    // Stair-edge dots (small filled squares on each step edge)
    const dotSize = 0.025;
    const stepEdges: [number, number][] = [
        [0.80, 0.15], [0.20, 0.15],
        [0.70, 0.30], [0.30, 0.30],
        [0.62, 0.48], [0.38, 0.48],
    ];
    for (const [su, sv] of stepEdges) {
        drawUV([
            [su - dotSize, sv - dotSize], [su + dotSize, sv - dotSize],
            [su + dotSize, sv + dotSize], [su - dotSize, sv + dotSize],
        ], 'filled');
    }
}
