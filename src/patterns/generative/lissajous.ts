// Lissajous figure
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const a = Math.floor(r() * 3) + 1;
    const b = Math.floor(r() * 3) + 2;
    const delta = r() * Math.PI;
    const n = 40;
    const pts: [number, number][] = [];
    for (let j = 0; j <= n; j++) {
        const t = (j / n) * Math.PI * 2;
        const u = 0.1 + 0.8 * (0.5 + 0.5 * Math.sin(a * t + delta));
        const v = 0.1 + 0.8 * (0.5 + 0.5 * Math.sin(b * t));
        pts.push([u, v]);
    }
    drawUV(pts, baseStyle);
}
