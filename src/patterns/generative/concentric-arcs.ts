// Concentric arcs with varying widths
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const nArcs = 3 + Math.floor(r() * 4);
    for (let j = 0; j < nArcs; j++) {
        const frac = (j + 0.5) / nArcs;
        const arcSpan = 0.3 + r() * 0.6;
        const arcStart = (1 - arcSpan) * 0.5;
        const pts: [number, number][] = [];
        const steps = 16;
        for (let s = 0; s <= steps; s++) {
            const u = arcStart + (s / steps) * arcSpan;
            pts.push([u, frac]);
        }
        drawUV(pts, j % 2 === 0 ? baseStyle : 'line');
    }
}
