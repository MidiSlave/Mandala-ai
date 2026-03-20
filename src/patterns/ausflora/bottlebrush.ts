// Bottlebrush (Callistemon) — cylindrical brush-like flower with protruding stamens
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // Stem — continues through the flower
    drawUV([[0.49, 0.05], [0.49, 0.95], [0.51, 0.95], [0.51, 0.05]], mainStyle);

    // Flower zone — dense stamens radiating outward
    const flowerTop = 0.18;
    const flowerBot = 0.58;
    const rows = 12;
    for (let row = 0; row < rows; row++) {
        const ry = flowerTop + (row / (rows - 1)) * (flowerBot - flowerTop);
        const numStamens = 6 + (row % 2);
        for (let s = 0; s < numStamens; s++) {
            const angle = (s / numStamens) * Math.PI * 2 + (row % 2) * 0.3;
            const stamenLen = 0.10 + r() * 0.05;
            const sx = 0.50;
            // Each stamen is a thin line radiating outward
            const ex = sx + Math.cos(angle) * stamenLen;
            const ey = ry + Math.sin(angle) * stamenLen * 0.3;
            drawUV([[sx, ry], [ex, ey]], 'line');
            // Anther (tiny dot) at tip
            drawUV([
                [ex - 0.008, ey - 0.005], [ex + 0.008, ey - 0.005],
                [ex + 0.008, ey + 0.005], [ex - 0.008, ey + 0.005]
            ], detailStyle);
        }
    }

    // Central cylinder body (behind stamens)
    drawUV([
        [0.44, 0.18], [0.56, 0.18], [0.56, 0.58], [0.44, 0.58]
    ], mainStyle);

    // New growth tip emerging from top of flower
    drawUV([[0.48, 0.18], [0.50, 0.08], [0.52, 0.18]], mainStyle);

    // Leaves — narrow, lanceolate (typical of Callistemon)
    // Below flower
    drawUV([
        [0.51, 0.62], [0.58, 0.58], [0.68, 0.55],
        [0.75, 0.56], [0.68, 0.58], [0.58, 0.62], [0.51, 0.65]
    ], mainStyle);
    drawUV([
        [0.49, 0.65], [0.42, 0.60], [0.32, 0.58],
        [0.25, 0.59], [0.32, 0.62], [0.42, 0.65], [0.49, 0.68]
    ], mainStyle);

    // More leaves lower
    drawUV([
        [0.51, 0.72], [0.62, 0.68], [0.72, 0.67],
        [0.70, 0.70], [0.60, 0.72], [0.51, 0.75]
    ], mainStyle);
    drawUV([
        [0.49, 0.76], [0.38, 0.73], [0.28, 0.72],
        [0.30, 0.75], [0.40, 0.77], [0.49, 0.80]
    ], mainStyle);
}
