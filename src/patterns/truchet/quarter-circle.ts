// Quarter-circle Truchet — classic flowing rivers
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const cols = 3 + Math.floor(r() * 2);
    const rows = 2 + Math.floor(r() * 2);
    const cellW = 1 / cols, cellH = 1 / rows;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = col * cellW, y = row * cellH;
            const rot = Math.floor(r() * 2); // 0 or 1
            const pts1: [number, number][] = [];
            const pts2: [number, number][] = [];
            for (let s = 0; s <= 8; s++) {
                const a = (s / 8) * Math.PI / 2;
                if (rot === 0) {
                    pts1.push([x + Math.cos(a) * cellW * 0.5, y + Math.sin(a) * cellH * 0.5]);
                    pts2.push([x + cellW - Math.cos(a) * cellW * 0.5, y + cellH - Math.sin(a) * cellH * 0.5]);
                } else {
                    pts1.push([x + cellW - Math.cos(a) * cellW * 0.5, y + Math.sin(a) * cellH * 0.5]);
                    pts2.push([x + Math.cos(a) * cellW * 0.5, y + cellH - Math.sin(a) * cellH * 0.5]);
                }
            }
            drawUV(pts1, (row + col) % 3 === 0 ? baseStyle : 'line');
            drawUV(pts2, 'line');
        }
    }
}
