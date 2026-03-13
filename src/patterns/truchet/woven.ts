// Woven Truchet — over-under basket weave
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const n = 3 + Math.floor(r() * 2);
    const cellSize = 1 / n;
    for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
            const x = col * cellSize, y = row * cellSize;
            const isOver = (row + col) % 2 === 0;
            // Horizontal bar
            drawUV([
                [x + cellSize * 0.05, y + cellSize * 0.3],
                [x + cellSize * 0.95, y + cellSize * 0.3],
                [x + cellSize * 0.95, y + cellSize * 0.7],
                [x + cellSize * 0.05, y + cellSize * 0.7]
            ], isOver ? baseStyle : 'outline');
            // Vertical bar
            drawUV([
                [x + cellSize * 0.3, y + cellSize * 0.05],
                [x + cellSize * 0.7, y + cellSize * 0.05],
                [x + cellSize * 0.7, y + cellSize * 0.95],
                [x + cellSize * 0.3, y + cellSize * 0.95]
            ], isOver ? 'outline' : baseStyle);
        }
    }
}
