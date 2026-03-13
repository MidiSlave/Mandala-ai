// Moire circles
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const nCircles = 5 + Math.floor(r() * 3);
    const off1x = 0.48, off1y = 0.5;
    const off2x = 0.52, off2y = 0.5;
    for (let c = 0; c < nCircles; c++) {
        const rad = (c + 1) / (nCircles + 1) * 0.4;
        // First set centered at off1
        const pts1: [number, number][] = [];
        const pts2: [number, number][] = [];
        for (let s = 0; s <= 20; s++) {
            const a = (s / 20) * Math.PI * 2;
            pts1.push([off1x + Math.cos(a) * rad, off1y + Math.sin(a) * rad]);
            pts2.push([off2x + Math.cos(a) * rad, off2y + Math.sin(a) * rad]);
        }
        drawUV(pts1, c % 2 === 0 ? baseStyle : 'line');
        drawUV(pts2, 'line');
    }
}
