// Circular Truchet — overlapping arcs
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const cols = 3, rows = 2;
    const cellW = 1 / cols, cellH = 1 / rows;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cx = (col + 0.5) * cellW;
            const cy = (row + 0.5) * cellH;
            const radius = cellW * (0.3 + r() * 0.15);
            const pts: [number, number][] = [];
            const startA = r() * Math.PI * 2;
            const sweep = Math.PI * (0.5 + r());
            for (let s = 0; s <= 12; s++) {
                const a = startA + (s / 12) * sweep;
                pts.push([cx + Math.cos(a) * radius, cy + Math.sin(a) * radius * (cellH / cellW)]);
            }
            drawUV(pts, (row + col) % 2 === 0 ? baseStyle : 'line');
        }
    }
}
