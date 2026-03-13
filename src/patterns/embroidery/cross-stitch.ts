// Cross stitch — grid of X marks
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const cols = 4 + Math.floor(r() * 3);
    const rows = 3 + Math.floor(r() * 3);
    const cellW = 1.0 / cols;
    const cellH = 1.0 / rows;
    const inset = 0.15;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const u0 = col * cellW + cellW * inset;
            const v0 = row * cellH + cellH * inset;
            const u1 = (col + 1) * cellW - cellW * inset;
            const v1 = (row + 1) * cellH - cellH * inset;
            // X marks
            drawUV([[u0, v0], [u1, v1]], 'line');
            drawUV([[u1, v0], [u0, v1]], 'line');
            // Grid cell border in filled mode for some cells
            if (filled && (row + col) % 3 === 0) {
                drawUV([
                    [col * cellW, row * cellH],
                    [(col + 1) * cellW, row * cellH],
                    [(col + 1) * cellW, (row + 1) * cellH],
                    [col * cellW, (row + 1) * cellH]
                ], 'outline');
            }
        }
    }
    // Horizontal grid lines
    for (let row = 0; row <= rows; row++) {
        drawUV([[0, row * cellH], [1, row * cellH]], 'line');
    }
    // Vertical grid lines
    for (let col = 0; col <= cols; col++) {
        drawUV([[col * cellW, 0], [col * cellW, 1]], 'line');
    }
}
