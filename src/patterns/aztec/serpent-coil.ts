// Serpent coil — S-curved body with overlapping scale segments
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    // Upper S-curve body (thick band)
    drawUV([
        [0.08, 0.0], [0.22, 0.0],
        [0.38, 0.06], [0.55, 0.14],
        [0.72, 0.20], [0.88, 0.18],
        [0.96, 0.12], [0.98, 0.20],
        [0.96, 0.30], [0.88, 0.36],
        [0.72, 0.38], [0.55, 0.34],
        [0.38, 0.24], [0.22, 0.16],
        [0.08, 0.14],
    ], baseStyle);

    // Middle connecting band (left side)
    drawUV([
        [0.08, 0.14], [0.04, 0.20],
        [0.02, 0.32], [0.02, 0.44],
        [0.04, 0.52], [0.08, 0.54],
        [0.16, 0.54], [0.16, 0.42],
        [0.14, 0.32], [0.12, 0.22],
    ], baseStyle);

    // Lower S-curve body (reversed)
    drawUV([
        [0.08, 0.54], [0.22, 0.56],
        [0.38, 0.64], [0.55, 0.72],
        [0.72, 0.76], [0.88, 0.74],
        [0.96, 0.68], [0.98, 0.76],
        [0.96, 0.86], [0.88, 0.92],
        [0.72, 0.94], [0.55, 0.90],
        [0.38, 0.96], [0.22, 1.0],
        [0.08, 1.0], [0.08, 0.86],
        [0.22, 0.86], [0.38, 0.80],
        [0.55, 0.74], [0.55, 0.66],
        [0.38, 0.58], [0.22, 0.54],
    ], baseStyle);

    // Serpent head (top-left, visible)
    drawUV([
        [0.0, 0.0], [0.10, 0.0],
        [0.14, 0.05], [0.12, 0.10],
        [0.06, 0.12], [0.0, 0.08],
    ], baseStyle);
    // Eye on head
    drawUV([
        [0.04, 0.03], [0.08, 0.03],
        [0.08, 0.07], [0.04, 0.07],
    ], filled ? 'opaque-outline' : 'filled');

    // Scale marks along upper body
    for (let i = 0; i < 6; i++) {
        const t = (i + 1) / 7;
        const su = 0.15 + t * 0.70;
        const sv = 0.04 + 0.18 * Math.sin(t * Math.PI);
        const ss = 0.04;
        drawUV([
            [su, sv], [su + ss, sv + ss * 1.5],
            [su + ss * 2, sv], [su + ss, sv - ss * 0.5],
        ], filled ? 'opaque-outline' : 'filled');
    }

    // Scale marks along lower body
    for (let i = 0; i < 6; i++) {
        const t = (i + 1) / 7;
        const su = 0.15 + t * 0.70;
        const sv = 0.58 + 0.20 * Math.sin(t * Math.PI);
        const ss = 0.04;
        drawUV([
            [su, sv], [su + ss, sv + ss * 1.5],
            [su + ss * 2, sv], [su + ss, sv - ss * 0.5],
        ], filled ? 'opaque-outline' : 'filled');
    }

    // Center spine lines following the S-curve
    drawUV([
        [0.08, 0.07], [0.30, 0.13], [0.55, 0.22],
        [0.75, 0.27], [0.92, 0.24],
    ], 'line');
    drawUV([
        [0.08, 0.48], [0.10, 0.38], [0.08, 0.28],
    ], 'line');
    drawUV([
        [0.08, 0.70], [0.30, 0.68], [0.55, 0.78],
        [0.75, 0.84], [0.92, 0.80],
    ], 'line');

    if (filled) {
        // Cut channel between upper and lower curves
        drawUV([
            [0.20, 0.38], [0.50, 0.44],
            [0.80, 0.48], [0.80, 0.52],
            [0.50, 0.50], [0.20, 0.44],
        ], 'opaque-outline');
    } else {
        // In outline mode, add filled middle band for visual weight
        drawUV([
            [0.20, 0.40], [0.50, 0.44],
            [0.80, 0.46], [0.80, 0.52],
            [0.50, 0.50], [0.20, 0.46],
        ], 'filled');
        // Tail tip filled
        drawUV([
            [0.08, 0.90], [0.22, 0.92],
            [0.22, 1.0], [0.08, 1.0],
        ], 'filled');
    }
}
