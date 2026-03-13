// Peacock feather eye
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const cx = 0.5, cy = 0.45;
    // Outer eye shape
    const nRings = 3;
    for (let ring = nRings - 1; ring >= 0; ring--) {
        const rad = 0.12 + ring * 0.08;
        const stretch = 1.6 - ring * 0.15;
        const pts: [number, number][] = [];
        for (let s = 0; s <= 16; s++) {
            const a = (s / 16) * Math.PI * 2;
            pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad * stretch]);
        }
        drawUV(pts, ring === 0 ? baseStyle : (ring === 1 ? 'outline' : baseStyle));
    }
    // Feather barbs radiating outward
    const nBarbs = 8 + Math.floor(r() * 4);
    for (let b = 0; b < nBarbs; b++) {
        const a = (b / nBarbs) * Math.PI * 2;
        const startR = 0.28;
        const endR = 0.42;
        const wobble = Math.sin(a * 3) * 0.02;
        drawUV([
            [cx + Math.cos(a) * startR + wobble, cy + Math.sin(a) * startR * 1.4],
            [cx + Math.cos(a) * endR + wobble, cy + Math.sin(a) * endR * 1.4]
        ], 'line');
    }
}
