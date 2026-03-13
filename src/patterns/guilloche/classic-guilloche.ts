// Classic guilloche — two interleaved sine waves
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const freq = 3 + Math.floor(r() * 5);
    const amp = 0.06 + r() * 0.08;
    const nLines = 4 + Math.floor(r() * 3);
    for (let j = 0; j < nLines; j++) {
        const baseV = (j + 1) / (nLines + 1);
        const phase = j * Math.PI * 0.3;
        const pts1: [number, number][] = [];
        const pts2: [number, number][] = [];
        for (let s = 0; s <= 24; s++) {
            const u = s / 24;
            const w1 = Math.sin(u * Math.PI * freq + phase) * amp;
            const w2 = Math.sin(u * Math.PI * freq + phase + Math.PI) * amp;
            pts1.push([u, baseV + w1]);
            pts2.push([u, baseV + w2]);
        }
        drawUV(pts1, j % 2 === 0 ? baseStyle : 'line');
        drawUV(pts2, 'line');
    }
}
