// Concentric warped squares (Vasarely-style)
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const nRings = 4 + Math.floor(r() * 3);
    const wobbleAmt = 0.02 + r() * 0.03;
    const wobbleFreq = 3 + Math.floor(r() * 3);
    for (let ring = 0; ring < nRings; ring++) {
        const frac = (ring + 1) / (nRings + 1);
        const half = frac * 0.45;
        const cx = 0.5, cy = 0.5;
        const pts: [number, number][] = [];
        const sides = 16;
        for (let s = 0; s <= sides; s++) {
            const a = (s / sides) * Math.PI * 2;
            // Square shape with sinusoidal wobble
            const squareR = half / Math.max(Math.abs(Math.cos(a)), Math.abs(Math.sin(a)));
            const wobble = Math.sin(a * wobbleFreq + ring * 0.8) * wobbleAmt;
            const rad = Math.min(0.49, squareR + wobble);
            pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]);
        }
        drawUV(pts, ring % 2 === 0 ? baseStyle : 'outline');
    }
}
