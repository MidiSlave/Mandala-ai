// Moire diamond mesh
import type { PatternContext } from '../types';

export function draw({ drawUV, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const nDiag = 4 + Math.floor(r() * 4);
    const waveAmp = 0.02 + r() * 0.03;
    const freq = 3 + Math.floor(r() * 4);
    // Diagonal lines going one way
    for (let j = 0; j < nDiag; j++) {
        const offset = (j + 0.5) / nDiag;
        const pts: [number, number][] = [];
        for (let s = 0; s <= 16; s++) {
            const t = s / 16;
            const u = t;
            const v = offset + t * 0.5 - 0.25 + Math.sin(t * Math.PI * freq) * waveAmp;
            pts.push([u, Math.min(1, Math.max(0, v))]);
        }
        drawUV(pts, 'line');
    }
    // Diagonal lines going the other way
    for (let j = 0; j < nDiag; j++) {
        const offset = (j + 0.5) / nDiag;
        const pts: [number, number][] = [];
        for (let s = 0; s <= 16; s++) {
            const t = s / 16;
            const u = t;
            const v = offset - t * 0.5 + 0.25 + Math.sin(t * Math.PI * freq) * waveAmp;
            pts.push([u, Math.min(1, Math.max(0, v))]);
        }
        drawUV(pts, 'line');
    }
}
