import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const f1 = Math.floor(r() * 3) + 1;
    const f2 = Math.floor(r() * 3) + 2;
    const p1 = r() * Math.PI;
    const p2 = r() * Math.PI;
    const decay = 0.005 + r() * 0.01;
    const pts: [number, number][] = [];
    const steps = 80;
    for (let j = 0; j <= steps; j++) {
        const t = (j / steps) * Math.PI * 8;
        const d = Math.exp(-decay * t);
        const u = 0.5 + 0.4 * d * Math.sin(f1 * t + p1);
        const v = 0.5 + 0.4 * d * Math.sin(f2 * t + p2);
        pts.push([Math.min(1, Math.max(0, u)), Math.min(1, Math.max(0, v))]);
    }
    drawUV(pts, baseStyle);
}
