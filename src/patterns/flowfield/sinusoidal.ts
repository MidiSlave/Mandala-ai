// Sinusoidal flow — wavy parallel streamlines
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const numLines = 6 + Math.floor(r() * 5);
    const freq = 1.5 + r() * 2;
    const amp = 0.06 + r() * 0.06;
    const phase = r() * Math.PI * 2;

    for (let i = 0; i < numLines; i++) {
        const baseV = (i + 0.5) / numLines;
        const pts: [number, number][] = [];
        const steps = 24;
        for (let s = 0; s <= steps; s++) {
            const u = s / steps;
            const wave = Math.sin(u * Math.PI * freq + phase + i * 0.5) * amp;
            const wave2 = Math.sin(u * Math.PI * freq * 1.7 + phase) * amp * 0.4;
            pts.push([u, Math.min(1, Math.max(0, baseV + wave + wave2))]);
        }
        drawUV(pts, 'line');
    }

    // Fill between adjacent lines in filled mode
    if (filled) {
        for (let i = 0; i < numLines - 1; i += 2) {
            const v0 = (i + 0.5) / numLines;
            const v1 = (i + 1.5) / numLines;
            const poly: [number, number][] = [];
            for (let s = 0; s <= 12; s++) {
                const u = s / 12;
                const w0 = Math.sin(u * Math.PI * freq + phase + i * 0.5) * amp;
                poly.push([u, v0 + w0]);
            }
            for (let s = 12; s >= 0; s--) {
                const u = s / 12;
                const w1 = Math.sin(u * Math.PI * freq + phase + (i + 1) * 0.5) * amp;
                poly.push([u, v1 + w1]);
            }
            drawUV(poly, 'filled');
        }
    }
}
