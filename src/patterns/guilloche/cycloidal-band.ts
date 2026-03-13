// Cycloidal band — trochoid curves filling the cell
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const nBands = 2 + Math.floor(r() * 3);
    const cusp = Math.floor(r() * 3) + 3;
    for (let b = 0; b < nBands; b++) {
        const bandV = (b + 0.5) / nBands;
        const amp = 0.08 + r() * 0.06;
        const pts: [number, number][] = [];
        for (let s = 0; s <= 36; s++) {
            const t = (s / 36) * Math.PI * 2;
            const u = s / 36;
            const v = bandV + (Math.cos(t) - Math.cos(cusp * t) / cusp) * amp;
            pts.push([u, Math.min(1, Math.max(0, v))]);
        }
        drawUV(pts, b === 0 ? baseStyle : 'line');
    }
}
