// Wave interference / moire pattern
import type { PatternContext } from '../types';

export function draw({ drawUV, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const freq1 = 2 + Math.floor(r() * 4);
    const freq2 = 3 + Math.floor(r() * 5);
    const nLines = 5 + Math.floor(r() * 4);
    for (let j = 0; j < nLines; j++) {
        const baseV = (j + 1) / (nLines + 1);
        const pts: [number, number][] = [];
        const steps = 20;
        for (let s = 0; s <= steps; s++) {
            const u = s / steps;
            const wave = Math.sin(u * Math.PI * freq1) * 0.06 +
                         Math.sin(u * Math.PI * freq2 + baseV * Math.PI) * 0.04;
            pts.push([u, baseV + wave]);
        }
        drawUV(pts, 'line');
    }
}
