// Turbulence — chaotic overlapping flow lines
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const numLines = 10 + Math.floor(r() * 8);
    const turbFreq = 3 + r() * 3;
    const turbAmp = 0.08 + r() * 0.06;

    for (let i = 0; i < numLines; i++) {
        const baseV = (i + 0.5) / numLines;
        const pts: [number, number][] = [];
        const steps = 30;
        const phaseA = r() * Math.PI * 2;
        const phaseB = r() * Math.PI * 2;
        const freqA = turbFreq + r() * 1.5;
        const freqB = turbFreq * 1.3 + r();
        for (let s = 0; s <= steps; s++) {
            const u = s / steps;
            const wave1 = Math.sin(u * Math.PI * freqA + phaseA) * turbAmp;
            const wave2 = Math.sin(u * Math.PI * freqB + phaseB) * turbAmp * 0.6;
            const wave3 = Math.sin(u * Math.PI * freqA * 2.3 + phaseA + phaseB) * turbAmp * 0.3;
            pts.push([u, Math.min(1, Math.max(0, baseV + wave1 + wave2 + wave3))]);
        }
        drawUV(pts, 'line');
    }

    // Fill some turbulent bands
    if (filled) {
        for (let i = 0; i < 3; i++) {
            const v0 = r() * 0.8;
            const v1 = v0 + 0.05 + r() * 0.1;
            drawUV([
                [0, v0], [1, v0], [1, Math.min(1, v1)], [0, Math.min(1, v1)]
            ], 'filled');
        }
    }
}
