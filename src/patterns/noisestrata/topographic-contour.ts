// Topographic contour lines — wavy horizontal strata
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const numLines = 5 + Math.floor(r() * 4);
    const freq1 = 2 + r() * 3;
    const freq2 = 3 + r() * 4;
    const amp = 0.04 + r() * 0.04;

    const generateLine = (baseV: number, seed: number): [number, number][] => {
        const pts: [number, number][] = [];
        const steps = 24;
        for (let s = 0; s <= steps; s++) {
            const u = s / steps;
            const w1 = Math.sin(u * Math.PI * freq1 + seed * 3.7) * amp;
            const w2 = Math.sin(u * Math.PI * freq2 + seed * 7.3) * amp * 0.5;
            const w3 = Math.sin(u * Math.PI * (freq1 + freq2) + seed) * amp * 0.25;
            pts.push([u, Math.min(1, Math.max(0, baseV + w1 + w2 + w3))]);
        }
        return pts;
    };

    const lines: [number, number][][] = [];
    for (let i = 0; i < numLines; i++) {
        const baseV = (i + 0.5) / numLines;
        const line = generateLine(baseV, i + r() * 10);
        lines.push(line);
        drawUV(line, 'line');
    }

    // Fill between alternate lines
    if (filled) {
        for (let i = 0; i < lines.length - 1; i += 2) {
            const poly: [number, number][] = [...lines[i]];
            for (let j = lines[i + 1].length - 1; j >= 0; j--) {
                poly.push(lines[i + 1][j]);
            }
            drawUV(poly, 'filled');
        }
    }
}
