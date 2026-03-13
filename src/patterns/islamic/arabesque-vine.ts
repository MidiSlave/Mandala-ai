import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const nCurves = 3 + Math.floor(r() * 2);
    for (let c = 0; c < nCurves; c++) {
        const baseV = (c + 1) / (nCurves + 1);
        const amp = 0.08 + r() * 0.05;
        const freq = 2 + Math.floor(r() * 2);
        const pts: [number, number][] = [];
        for (let s = 0; s <= 20; s++) {
            const u = s / 20;
            const v = baseV + Math.sin(u * Math.PI * freq) * amp;
            pts.push([u, v]);
        }
        drawUV(pts, c === 0 ? baseStyle : 'line');
        // Leaf tendrils at peaks
        for (let peak = 0; peak < freq; peak++) {
            const pu = (peak * 2 + 1) / (freq * 2);
            const pv = baseV + amp * (peak % 2 === 0 ? 1 : -1);
            const leafDir = peak % 2 === 0 ? -1 : 1;
            drawUV([
                [pu, pv],
                [pu + 0.03, pv + leafDir * 0.04],
                [pu + 0.06, pv + leafDir * 0.02],
            ], 'line');
        }
    }
}
