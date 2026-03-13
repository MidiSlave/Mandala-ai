// Smith Truchet — triangle-based tiles
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const n = 3 + Math.floor(r() * 2);
    const cellSize = 1 / n;
    for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
            const x = col * cellSize, y = row * cellSize;
            const variant = Math.floor(r() * 4);
            const cx = x + cellSize / 2, cy = y + cellSize / 2;
            const tris: [number, number][][] = [
                [[x, y], [x + cellSize, y], [cx, cy]],
                [[x + cellSize, y], [x + cellSize, y + cellSize], [cx, cy]],
                [[x + cellSize, y + cellSize], [x, y + cellSize], [cx, cy]],
                [[x, y + cellSize], [x, y], [cx, cy]]
            ];
            for (let t = 0; t < 4; t++) {
                drawUV(tris[t], (t + variant) % 2 === 0 ? baseStyle : 'outline');
            }
        }
    }
}
