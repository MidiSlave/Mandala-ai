// Yagasuri (Arrow Feathers) — interlocking bold arrow/chevron shapes
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    const mainStyle = filled ? 'filled' as const : 'outline' as const;
    const detailStyle = filled ? 'opaque-outline' as const : 'filled' as const;

    // Left arrow (pointing up-right)
    drawUV([
        [0.0, 0.50],
        [0.48, 0.0],
        [0.52, 0.0],
        [0.52, 0.04],
        [0.08, 0.50],
        [0.52, 0.96],
        [0.52, 1.0],
        [0.48, 1.0],
    ], baseStyle);

    // Right arrow (pointing up-left)
    drawUV([
        [1.0, 0.50],
        [0.52, 0.0],
        [0.56, 0.0],
        [0.96, 0.46],
        [0.96, 0.54],
        [0.56, 1.0],
        [0.52, 1.0],
    ], baseStyle);

    // Central spine band (vertical)
    drawUV([
        [0.48, 0.0], [0.52, 0.0],
        [0.52, 1.0], [0.48, 1.0],
    ], detailStyle);

    // Left feather barbs (angled filled bands)
    for (let i = 0; i < 7; i++) {
        const yBase = 0.08 + i * 0.13;
        const bw = 0.025;
        // Upper-left barb
        const x1 = 0.10 + i * 0.05;
        const x2 = 0.46;

        drawUV([
            [x1, yBase],
            [x2, yBase - 0.04],
            [x2, yBase - 0.04 + bw],
            [x1, yBase + bw],
        ], detailStyle);
    }

    // Right feather barbs
    for (let i = 0; i < 7; i++) {
        const yBase = 0.08 + i * 0.13;
        const bw = 0.025;
        const x1 = 0.90 - i * 0.05;
        const x2 = 0.54;

        drawUV([
            [x1, yBase],
            [x2, yBase - 0.04],
            [x2, yBase - 0.04 + bw],
            [x1, yBase + bw],
        ], detailStyle);
    }

    // Arrowhead accent at top
    drawUV([
        [0.50, 0.0],
        [0.40, 0.08],
        [0.44, 0.08],
        [0.50, 0.03],
        [0.56, 0.08],
        [0.60, 0.08],
    ], mainStyle);

    // Arrowhead accent at bottom
    drawUV([
        [0.50, 1.0],
        [0.40, 0.92],
        [0.44, 0.92],
        [0.50, 0.97],
        [0.56, 0.92],
        [0.60, 0.92],
    ], mainStyle);

    // Bold edge bands
    drawUV([
        [0.0, 0.46], [0.06, 0.46],
        [0.06, 0.54], [0.0, 0.54],
    ], mainStyle);
    drawUV([
        [0.94, 0.46], [1.0, 0.46],
        [1.0, 0.54], [0.94, 0.54],
    ], mainStyle);

    if (filled) {
        // Opaque detail diamonds along the arrows
        for (let i = 0; i < 4; i++) {
            const y = 0.20 + i * 0.20;
            // Left arrow diamonds
            const lx = 0.12 + i * 0.08;
            drawUV([
                [lx, y], [lx + 0.04, y + 0.03],
                [lx, y + 0.06], [lx - 0.04, y + 0.03],
            ], 'opaque-outline');
            // Right arrow diamonds
            const rx = 0.88 - i * 0.08;
            drawUV([
                [rx, y], [rx + 0.04, y + 0.03],
                [rx, y + 0.06], [rx - 0.04, y + 0.03],
            ], 'opaque-outline');
        }
    } else {
        // Filled accent diamonds in outline mode
        for (let i = 0; i < 4; i++) {
            const y = 0.20 + i * 0.20;
            const lx = 0.12 + i * 0.08;
            drawUV([
                [lx, y], [lx + 0.04, y + 0.03],
                [lx, y + 0.06], [lx - 0.04, y + 0.03],
            ], 'filled');
            const rx = 0.88 - i * 0.08;
            drawUV([
                [rx, y], [rx + 0.04, y + 0.03],
                [rx, y + 0.06], [rx - 0.04, y + 0.03],
            ], 'filled');
        }
    }
}
