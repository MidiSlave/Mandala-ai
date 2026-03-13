// Engine-turned wave lattice
import type { PatternContext } from '../types';

export function draw({ drawUV, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const nH = 3 + Math.floor(r() * 3);
    const nV = 3 + Math.floor(r() * 2);
    const waveAmp = 0.03 + r() * 0.04;
    const freq = 4 + Math.floor(r() * 4);
    // Horizontal wavy lines
    for (let j = 0; j < nH; j++) {
        const baseV = (j + 1) / (nH + 1);
        const pts: [number, number][] = [];
        for (let s = 0; s <= 20; s++) {
            const u = s / 20;
            pts.push([u, baseV + Math.sin(u * Math.PI * freq) * waveAmp]);
        }
        drawUV(pts, 'line');
    }
    // Vertical wavy lines
    for (let j = 0; j < nV; j++) {
        const baseU = (j + 1) / (nV + 1);
        const pts: [number, number][] = [];
        for (let s = 0; s <= 20; s++) {
            const v = s / 20;
            pts.push([baseU + Math.sin(v * Math.PI * freq) * waveAmp, v]);
        }
        drawUV(pts, 'line');
    }
}
