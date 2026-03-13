import type { PatternContext } from '../types';
import { dotCircle } from './helpers';

export function draw({ drawUV, filled, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const nPaths = 2 + Math.floor(r() * 2);
    for (let p = 0; p < nPaths; p++) {
        const startU = r() * 0.3;
        const startV = 0.2 + r() * 0.6;
        const endU = 0.7 + r() * 0.3;
        const endV = 0.2 + r() * 0.6;
        const midU = (startU + endU) / 2;
        const midV = startV + (r() - 0.5) * 0.3;
        const nDots = 10 + Math.floor(r() * 8);
        for (let d = 0; d < nDots; d++) {
            const t = d / (nDots - 1);
            // Quadratic bezier interpolation
            const u = (1 - t) * (1 - t) * startU + 2 * (1 - t) * t * midU + t * t * endU;
            const v = (1 - t) * (1 - t) * startV + 2 * (1 - t) * t * midV + t * t * endV;
            drawUV(dotCircle(u, v, 0.008, 6),
                d % 3 === 0 ? baseStyle : 'filled');
        }
        // Place markers at start and end
        drawUV(dotCircle(startU, startV, 0.025, 8), baseStyle);
        drawUV(dotCircle(endU, endV, 0.025, 8), baseStyle);
    }
}
