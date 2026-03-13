// Ridge lines — absolute-value folded noise creating sharp ridges
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const numLines = 6 + Math.floor(r() * 4);
    const freq = 2 + r() * 2;
    const ridgeAmp = 0.06 + r() * 0.04;

    for (let i = 0; i < numLines; i++) {
        const baseV = (i + 0.5) / numLines;
        const pts: [number, number][] = [];
        const steps = 28;
        const phase = r() * Math.PI * 2;
        for (let s = 0; s <= steps; s++) {
            const u = s / steps;
            // Ridged noise: absolute value creates sharp peaks
            const n1 = Math.abs(Math.sin(u * Math.PI * freq + phase)) * ridgeAmp;
            const n2 = Math.abs(Math.sin(u * Math.PI * freq * 2.1 + phase * 1.3)) * ridgeAmp * 0.5;
            const v = baseV + n1 + n2 - ridgeAmp * 0.5;
            pts.push([u, Math.min(1, Math.max(0, v))]);
        }
        drawUV(pts, i % 2 === 0 ? baseStyle : 'line');
    }
}
