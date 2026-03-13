import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const n = 3;
    const cellSize = 1 / n;
    for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
            const cx = (col + 0.5) * cellSize;
            const cy = (row + 0.5) * cellSize;
            const rad = cellSize * 0.35;
            // Star of David: two overlapping triangles
            const tri1: [number, number][] = [];
            const tri2: [number, number][] = [];
            for (let i = 0; i < 3; i++) {
                const a1 = (i / 3) * Math.PI * 2 - Math.PI / 2;
                const a2 = a1 + Math.PI / 3;
                tri1.push([cx + Math.cos(a1) * rad, cy + Math.sin(a1) * rad]);
                tri2.push([cx + Math.cos(a2) * rad, cy + Math.sin(a2) * rad]);
            }
            drawUV(tri1, baseStyle);
            drawUV(tri2, filled ? 'outline' : baseStyle);
        }
    }
}
