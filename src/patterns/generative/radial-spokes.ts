// Radial spokes with terminal ornaments
import type { PatternContext } from '../types';
import { circleUV } from './helpers';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const nSpokes = 3 + Math.floor(r() * 5);
    const hasOrnament = r() > 0.4;
    for (let j = 0; j < nSpokes; j++) {
        const u = (j + 0.5) / nSpokes;
        // Spoke line
        drawUV([[u, 0.05], [u, 0.95]], 'line');
        // Terminal ornament
        if (hasOrnament) {
            const ornSize = 0.03;
            if (j % 2 === 0) {
                drawUV(circleUV(u, 0.95, ornSize, 8), 'filled');
            } else {
                // Diamond
                drawUV([
                    [u, 0.95 - ornSize],
                    [u + ornSize, 0.95],
                    [u, 0.95 + ornSize],
                    [u - ornSize, 0.95]
                ], 'filled');
            }
        }
    }
    // Midline arc
    const midPts: [number, number][] = [];
    for (let s = 0; s <= 12; s++) {
        midPts.push([s / 12, 0.5]);
    }
    drawUV(midPts, filled ? 'filled' : 'outline');
}
