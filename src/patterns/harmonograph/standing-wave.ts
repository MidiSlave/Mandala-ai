import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const nWaves = 3 + Math.floor(r() * 3);
    const baseFreq = 2 + Math.floor(r() * 3);
    for (let w = 0; w < nWaves; w++) {
        const freq = baseFreq + w;
        const baseV = (w + 1) / (nWaves + 1);
        const amp = 0.06 + r() * 0.04;
        // Envelope
        const pts1: [number, number][] = [];
        const pts2: [number, number][] = [];
        for (let s = 0; s <= 24; s++) {
            const u = s / 24;
            const envelope = Math.sin(u * Math.PI);
            const wave = Math.sin(u * Math.PI * freq) * envelope * amp;
            pts1.push([u, baseV + wave]);
            pts2.push([u, baseV - wave]);
        }
        drawUV(pts1, w === 0 ? baseStyle : 'line');
        drawUV(pts2, 'line');
        // Node points
        for (let n = 0; n <= freq; n++) {
            const nodeU = n / freq;
            drawUV([
                [nodeU - 0.008, baseV - 0.008],
                [nodeU + 0.008, baseV - 0.008],
                [nodeU + 0.008, baseV + 0.008],
                [nodeU - 0.008, baseV + 0.008]
            ], 'filled');
        }
    }
}
