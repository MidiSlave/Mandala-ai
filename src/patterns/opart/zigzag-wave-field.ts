// Zigzag wave field
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const nWaves = 6 + Math.floor(r() * 4);
    const amplitude = 0.03 + r() * 0.02;
    const zigFreq = 6 + Math.floor(r() * 6);
    for (let w = 0; w < nWaves; w++) {
        const baseV = (w + 1) / (nWaves + 1);
        const pts: [number, number][] = [];
        for (let s = 0; s <= zigFreq * 2; s++) {
            const u = s / (zigFreq * 2);
            const zigzag = (s % 2 === 0 ? 1 : -1) * amplitude;
            pts.push([u, baseV + zigzag]);
        }
        drawUV(pts, w % 3 === 0 ? baseStyle : 'line');
    }
}
