import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const f1 = Math.floor(r() * 3) + 2;
    const f2 = f1 + (r() > 0.5 ? 1 : -1);
    const p = r() * Math.PI * 2;
    const pts: [number, number][] = [];
    const steps = 100;
    for (let j = 0; j <= steps; j++) {
        const t = (j / steps) * Math.PI * 10;
        const d = Math.exp(-0.008 * t);
        const x = d * (Math.sin(f1 * t) + Math.sin(f2 * t + p));
        const y = d * (Math.cos(f1 * t) + Math.cos(f2 * t + p));
        pts.push([
            Math.min(1, Math.max(0, 0.5 + x * 0.22)),
            Math.min(1, Math.max(0, 0.5 + y * 0.22))
        ]);
    }
    drawUV(pts, baseStyle);
}
