// Labyrinth spiral — rectangular spiral winding inward (classic Greek key motif)
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    const s = filled ? baseStyle : 'outline';

    // Outer border frame
    drawUV([
        [0.05, 0.05], [0.95, 0.05],
        [0.95, 0.12], [0.05, 0.12],
    ], s);
    drawUV([
        [0.05, 0.88], [0.95, 0.88],
        [0.95, 0.95], [0.05, 0.95],
    ], s);
    drawUV([
        [0.05, 0.05], [0.12, 0.05],
        [0.12, 0.95], [0.05, 0.95],
    ], s);
    drawUV([
        [0.88, 0.05], [0.95, 0.05],
        [0.95, 0.95], [0.88, 0.95],
    ], s);

    // First spiral step — open at top-right
    drawUV([
        [0.20, 0.20], [0.80, 0.20],
        [0.80, 0.27], [0.20, 0.27],
    ], s);
    drawUV([
        [0.20, 0.20], [0.27, 0.20],
        [0.27, 0.80], [0.20, 0.80],
    ], s);
    drawUV([
        [0.20, 0.73], [0.80, 0.73],
        [0.80, 0.80], [0.20, 0.80],
    ], s);

    // Second spiral step — open at bottom-left
    drawUV([
        [0.73, 0.27], [0.80, 0.27],
        [0.80, 0.73], [0.73, 0.73],
    ], s);

    // Inner rectangle (center of spiral)
    drawUV([
        [0.35, 0.35], [0.65, 0.35],
        [0.65, 0.42], [0.35, 0.42],
    ], s);
    drawUV([
        [0.35, 0.35], [0.42, 0.35],
        [0.42, 0.65], [0.35, 0.65],
    ], s);
    drawUV([
        [0.35, 0.58], [0.65, 0.58],
        [0.65, 0.65], [0.35, 0.65],
    ], s);
    drawUV([
        [0.58, 0.42], [0.65, 0.42],
        [0.65, 0.65], [0.58, 0.65],
    ], s);

    if (filled) {
        // Central filled block
        drawUV([
            [0.44, 0.44], [0.56, 0.44],
            [0.56, 0.56], [0.44, 0.56],
        ], 'opaque-outline');
        // Cutouts in the spiral corridors
        drawUV([
            [0.30, 0.30], [0.33, 0.30],
            [0.33, 0.70], [0.30, 0.70],
        ], 'opaque-outline');
        drawUV([
            [0.67, 0.30], [0.70, 0.30],
            [0.70, 0.70], [0.67, 0.70],
        ], 'opaque-outline');
    }
}
