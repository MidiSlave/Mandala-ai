// Spearhead pattern (mata)
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const cols = 3 + Math.floor(r() * 2);
    const rows = 2 + Math.floor(r() * 2);
    const cellW = 1 / cols, cellH = 1 / rows;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = col * cellW, y = row * cellH;
            const cx = x + cellW / 2;
            // Spearhead pointing up
            drawUV([
                [cx, y],
                [x + cellW, y + cellH * 0.6],
                [cx, y + cellH],
                [x, y + cellH * 0.6]
            ], (row + col) % 2 === 0 ? baseStyle : 'outline');
            // Central spine line
            drawUV([[cx, y], [cx, y + cellH]], 'line');
        }
    }
}
