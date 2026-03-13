// Classic Greek key meander — interlocking rectangular spirals with cutouts
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    // Top rail
    drawUV([
        [0.0, 0.85], [1.0, 0.85],
        [1.0, 0.94], [0.0, 0.94],
    ], baseStyle);
    // Bottom rail
    drawUV([
        [0.0, 0.06], [1.0, 0.06],
        [1.0, 0.15], [0.0, 0.15],
    ], baseStyle);

    // Left spiral: vertical bar
    drawUV([
        [0.06, 0.15], [0.16, 0.15],
        [0.16, 0.85], [0.06, 0.85],
    ], baseStyle);
    // Left spiral: top horizontal hook
    drawUV([
        [0.16, 0.72], [0.40, 0.72],
        [0.40, 0.82], [0.16, 0.82],
    ], baseStyle);
    // Left spiral: inner vertical
    drawUV([
        [0.30, 0.32], [0.40, 0.32],
        [0.40, 0.72], [0.30, 0.72],
    ], baseStyle);
    // Left spiral: inner bottom hook
    drawUV([
        [0.16, 0.18], [0.30, 0.18],
        [0.30, 0.28], [0.16, 0.28],
    ], baseStyle);

    // Right spiral: vertical bar
    drawUV([
        [0.84, 0.15], [0.94, 0.15],
        [0.94, 0.85], [0.84, 0.85],
    ], baseStyle);
    // Right spiral: bottom horizontal hook
    drawUV([
        [0.60, 0.18], [0.84, 0.18],
        [0.84, 0.28], [0.60, 0.28],
    ], baseStyle);
    // Right spiral: inner vertical
    drawUV([
        [0.60, 0.28], [0.70, 0.28],
        [0.70, 0.68], [0.60, 0.68],
    ], baseStyle);
    // Right spiral: inner top hook
    drawUV([
        [0.70, 0.72], [0.84, 0.72],
        [0.84, 0.82], [0.70, 0.82],
    ], baseStyle);

    if (filled) {
        // Cutouts in spiral centers
        drawUV([
            [0.18, 0.34], [0.28, 0.34],
            [0.28, 0.56], [0.18, 0.56],
        ], 'opaque-outline');
        drawUV([
            [0.72, 0.44], [0.82, 0.44],
            [0.82, 0.66], [0.72, 0.66],
        ], 'opaque-outline');
        // Small square cutouts in rails
        drawUV([
            [0.44, 0.87], [0.56, 0.87],
            [0.56, 0.92], [0.44, 0.92],
        ], 'opaque-outline');
        drawUV([
            [0.44, 0.08], [0.56, 0.08],
            [0.56, 0.13], [0.44, 0.13],
        ], 'opaque-outline');
    }

    // Center bridge / connector block
    drawUV([
        [0.40, 0.46], [0.60, 0.46],
        [0.60, 0.54], [0.40, 0.54],
    ], baseStyle);

    // Detail lines along rails (converted to filled rects)
    drawUV([
        [0.0, 0.885], [1.0, 0.885],
        [1.0, 0.915], [0.0, 0.915],
    ], baseStyle);
    drawUV([
        [0.0, 0.085], [1.0, 0.085],
        [1.0, 0.115], [0.0, 0.115],
    ], baseStyle);
    // Detail tick marks on vertical bars (converted to filled rects)
    drawUV([
        [0.06, 0.485], [0.16, 0.485],
        [0.16, 0.515], [0.06, 0.515],
    ], baseStyle);
    drawUV([
        [0.84, 0.485], [0.94, 0.485],
        [0.94, 0.515], [0.84, 0.515],
    ], baseStyle);

    // Additional filled background shapes to reduce empty areas
    // Fill between spirals at top
    drawUV([
        [0.40, 0.82], [0.70, 0.82],
        [0.70, 0.85], [0.40, 0.85],
    ], baseStyle);
    // Fill between spirals at bottom
    drawUV([
        [0.30, 0.15], [0.60, 0.15],
        [0.60, 0.18], [0.30, 0.18],
    ], baseStyle);
}
