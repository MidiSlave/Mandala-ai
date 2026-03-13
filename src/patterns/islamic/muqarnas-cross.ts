import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const n = 4;
    const cellSize = 1 / n;
    for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
            const x = col * cellSize, y = row * cellSize;
            const cx = x + cellSize / 2, cy = y + cellSize / 2;
            const half = cellSize / 2 * 0.85;
            // Diamond
            drawUV([
                [cx, cy - half], [cx + half, cy],
                [cx, cy + half], [cx - half, cy]
            ], (row + col) % 2 === 0 ? baseStyle : 'outline');
            // Small squares at corners
            const sq = half * 0.3;
            drawUV([
                [cx - sq, cy - half + sq], [cx + sq, cy - half + sq],
                [cx + sq, cy - half - sq + cellSize * 0.05], [cx - sq, cy - half - sq + cellSize * 0.05]
            ], 'line');
        }
    }
}
