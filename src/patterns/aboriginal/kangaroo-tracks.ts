import type { PatternContext } from '../types';
import { dotCircle } from './helpers';

export function draw({ drawUV, filled, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const nTracks = 3 + Math.floor(r() * 3);
    const trackSpacing = 0.8 / nTracks;
    for (let t = 0; t < nTracks; t++) {
        const baseV = (t + 0.5) / nTracks;
        const nPrints = 4 + Math.floor(r() * 3);
        for (let p = 0; p < nPrints; p++) {
            const u = (p + 0.5) / nPrints;
            const hop = (p % 2) * 0.015;
            // Two rear feet (large)
            drawUV(dotCircle(u - 0.015, baseV + hop, 0.012, 6), baseStyle);
            drawUV(dotCircle(u + 0.015, baseV + hop, 0.012, 6), baseStyle);
            // Tail drag
            drawUV([
                [u - 0.005, baseV + hop + 0.025],
                [u + 0.005, baseV + hop + 0.035]
            ], 'line');
        }
    }
}
