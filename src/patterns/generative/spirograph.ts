// Spirograph / epitrochoid
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const R = 0.4;
    const rr = 0.1 + r() * 0.15;
    const d = 0.05 + r() * 0.2;
    const n = 60;
    const pts: [number, number][] = [];
    for (let j = 0; j <= n; j++) {
        const t = (j / n) * Math.PI * 6;
        const x = (R - rr) * Math.cos(t) + d * Math.cos(((R - rr) / rr) * t);
        const y = (R - rr) * Math.sin(t) + d * Math.sin(((R - rr) / rr) * t);
        const u = Math.min(1, Math.max(0, 0.5 + x));
        const v = Math.min(1, Math.max(0, 0.5 + y));
        pts.push([u, v]);
    }
    drawUV(pts, baseStyle);
}
