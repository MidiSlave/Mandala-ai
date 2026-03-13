// Ocean waves (moana)
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const nWaves = 4 + Math.floor(r() * 3);
    for (let w = 0; w < nWaves; w++) {
        const baseV = (w + 1) / (nWaves + 1);
        const amp = 0.04 + r() * 0.03;
        const freq = 3 + Math.floor(r() * 2);
        const pts: [number, number][] = [];
        for (let s = 0; s <= 20; s++) {
            const u = s / 20;
            const v = baseV + amp * Math.sin(u * Math.PI * freq + w * 0.5);
            pts.push([u, v]);
        }
        drawUV(pts, w % 2 === 0 ? baseStyle : 'line');
        // Wave crests — small spirals
        for (let c = 0; c < freq; c++) {
            const cu = (c * 2 + 1) / (freq * 2);
            const cv = baseV - amp;
            const spiral: [number, number][] = [];
            for (let s = 0; s <= 8; s++) {
                const t = s / 8;
                const a = t * Math.PI * 1.5;
                const sr = t * 0.015;
                spiral.push([cu + Math.cos(a) * sr, cv - Math.sin(a) * sr]);
            }
            drawUV(spiral, 'line');
        }
    }
}
