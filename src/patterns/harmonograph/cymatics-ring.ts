import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const nRings = 4 + Math.floor(r() * 3);
    const mode = Math.floor(r() * 4) + 3;
    for (let ring = 0; ring < nRings; ring++) {
        const ringFrac = (ring + 1) / (nRings + 1);
        const baseR = ringFrac * 0.4;
        const wobble = 0.02 + r() * 0.03;
        const pts: [number, number][] = [];
        for (let s = 0; s <= 24; s++) {
            const a = (s / 24) * Math.PI * 2;
            const mod = 1 + Math.cos(mode * a) * wobble / baseR;
            const rad = baseR * mod;
            pts.push([
                0.5 + Math.cos(a) * rad,
                0.5 + Math.sin(a) * rad
            ]);
        }
        drawUV(pts, ring % 2 === 0 ? baseStyle : 'outline');
    }
}
