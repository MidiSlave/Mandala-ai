// Cantor set / dust bands
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const drawCantor = (x1: number, x2: number, v: number, depth: number) => {
        const h = 0.04;
        drawUV([[x1, v - h], [x2, v - h], [x2, v + h], [x1, v + h]],
            depth % 2 === 0 ? baseStyle : 'outline');
        if (depth <= 0) return;
        const third = (x2 - x1) / 3;
        const gap = 0.06 + depth * 0.02;
        drawCantor(x1, x1 + third, v + gap, depth - 1);
        drawCantor(x2 - third, x2, v + gap, depth - 1);
    };
    drawCantor(0.05, 0.95, 0.15, 2 + Math.floor(r()));
}
