// Noise columns — vertical striations with noise displacement
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const numCols = 8 + Math.floor(r() * 6);
    const amp = 0.04 + r() * 0.04;

    for (let i = 0; i < numCols; i++) {
        const baseU = (i + 0.5) / numCols;
        const pts: [number, number][] = [];
        const steps = 20;
        const phase = r() * Math.PI * 2;
        const freq = 2 + r() * 3;
        for (let s = 0; s <= steps; s++) {
            const v = s / steps;
            const wave = Math.sin(v * Math.PI * freq + phase) * amp;
            pts.push([Math.min(1, Math.max(0, baseU + wave)), v]);
        }
        drawUV(pts, i % 3 === 0 ? baseStyle : 'line');
    }

    // Horizontal tie lines
    if (filled) {
        const ties = 3 + Math.floor(r() * 3);
        for (let i = 0; i < ties; i++) {
            const v = (i + 0.5) / ties;
            drawUV([[0, v], [1, v]], 'line');
        }
    }
}
