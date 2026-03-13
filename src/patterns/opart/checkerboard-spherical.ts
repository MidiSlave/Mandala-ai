// Checkerboard with spherical distortion
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle }: PatternContext): void {
    const n = 4;
    const cellSize = 1 / n;
    for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
            if ((row + col) % 2 !== 0) continue;
            const x = col * cellSize, y = row * cellSize;
            // Distort corners toward center for sphere illusion
            const warp = (px: number, py: number): [number, number] => {
                const dx = px - 0.5, dy = py - 0.5;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const scale = 1 + dist * 0.4;
                return [0.5 + dx * scale, 0.5 + dy * scale];
            };
            drawUV([
                warp(x, y), warp(x + cellSize, y),
                warp(x + cellSize, y + cellSize), warp(x, y + cellSize)
            ], baseStyle);
        }
    }
}
