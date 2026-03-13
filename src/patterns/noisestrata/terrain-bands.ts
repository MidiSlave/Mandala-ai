// Terrain bands — filled noise-modulated horizontal bands
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const numBands = 4 + Math.floor(r() * 3);
    const freq = 1.5 + r() * 2.5;

    for (let i = 0; i < numBands; i++) {
        const v0 = i / numBands;
        const v1 = (i + 1) / numBands;
        const phase = r() * Math.PI * 2;

        // Top edge
        const topPts: [number, number][] = [];
        const botPts: [number, number][] = [];
        const steps = 16;
        for (let s = 0; s <= steps; s++) {
            const u = s / steps;
            const w = Math.sin(u * Math.PI * freq + phase) * 0.03;
            topPts.push([u, Math.min(1, Math.max(0, v0 + w))]);
            botPts.push([u, Math.min(1, Math.max(0, v1 + w * 0.7))]);
        }

        if (filled && i % 2 === 0) {
            // Fill band
            const poly: [number, number][] = [...topPts];
            for (let j = botPts.length - 1; j >= 0; j--) {
                poly.push(botPts[j]);
            }
            drawUV(poly, 'filled');
        }

        // Draw edges
        drawUV(topPts, 'line');
        if (i === numBands - 1) {
            drawUV(botPts, 'line');
        }
    }
}
