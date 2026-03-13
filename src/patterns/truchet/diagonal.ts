// Diagonal Truchet — maze-like diagonals
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const cols = 4 + Math.floor(r() * 3);
    const rows = 3 + Math.floor(r() * 2);
    const cellW = 1 / cols, cellH = 1 / rows;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = col * cellW, y = row * cellH;
            if (r() > 0.5) {
                drawUV([[x, y], [x + cellW, y + cellH]], 'line');
            } else {
                drawUV([[x + cellW, y], [x, y + cellH]], 'line');
            }
        }
    }
    // Fill some triangles for visual weight
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (r() > 0.7) {
                const x = col * cellW, y = row * cellH;
                drawUV([[x, y], [x + cellW, y], [x + cellW * 0.5, y + cellH * 0.5]], baseStyle);
            }
        }
    }
}
