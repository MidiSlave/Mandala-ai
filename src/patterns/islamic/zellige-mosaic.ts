import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const cx = 0.5, cy = 0.5;
    // Central decagon
    const decR = 0.25;
    const dec: [number, number][] = [];
    for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        dec.push([cx + Math.cos(a) * decR, cy + Math.sin(a) * decR]);
    }
    drawUV(dec, baseStyle);
    // Surrounding pentagons
    for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        const pcx = cx + Math.cos(a) * decR * 1.45;
        const pcy = cy + Math.sin(a) * decR * 1.45;
        const pR = decR * 0.38;
        const pent: [number, number][] = [];
        for (let j = 0; j < 5; j++) {
            const pa = a + (j / 5) * Math.PI * 2;
            pent.push([pcx + Math.cos(pa) * pR, pcy + Math.sin(pa) * pR]);
        }
        drawUV(pent, i % 2 === 0 ? 'outline' : baseStyle);
    }
}
