// Blanket stitch — comb/fence along edges
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const barCount = 6 + Math.floor(r() * 6);
    const height = 0.3 + r() * 0.2;
    const altHeight = r() > 0.5;
    // Bottom edge blanket stitch
    const baseline: [number, number][] = [[0, 1.0], [1, 1.0]];
    drawUV(baseline, 'line');
    for (let i = 0; i < barCount; i++) {
        const u = (i + 0.5) / barCount;
        const h = altHeight ? height * (0.7 + 0.3 * (i % 2)) : height;
        drawUV([[u, 1.0], [u, 1.0 - h]], 'line');
        if (filled) {
            // Small cap at top of each bar
            const capW = 0.015;
            drawUV([
                [u - capW, 1.0 - h], [u + capW, 1.0 - h],
                [u + capW, 1.0 - h + 0.02], [u - capW, 1.0 - h + 0.02]
            ], 'filled');
        }
    }
    // Top edge blanket stitch
    const topline: [number, number][] = [[0, 0.0], [1, 0.0]];
    drawUV(topline, 'line');
    for (let i = 0; i < barCount; i++) {
        const u = (i + 0.5) / barCount;
        const h = altHeight ? height * (0.7 + 0.3 * ((i + 1) % 2)) : height;
        drawUV([[u, 0.0], [u, h]], 'line');
    }
    // Connecting horizontal at midpoint
    if (filled) {
        drawUV([[0, 0.5], [1, 0.5]], baseStyle);
    }
}
