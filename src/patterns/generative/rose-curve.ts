// Rose curve / rhodonea
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const k = Math.floor(r() * 4) + 2;
    const n = 24 + Math.floor(r() * 16);
    const pts: [number, number][] = [];
    for (let j = 0; j <= n; j++) {
        const t = (j / n) * Math.PI * 2;
        const rho = Math.cos(k * t) * 0.45;
        const u = Math.min(1, Math.max(0, (t / (Math.PI * 2)) * 0.8 + 0.1));
        const v = Math.min(1, Math.max(0, 0.5 + rho));
        pts.push([u, v]);
    }
    drawUV(pts, baseStyle);
}
