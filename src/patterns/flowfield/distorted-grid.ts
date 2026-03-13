// Distorted grid — displaced grid with interpolation
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const gridCols = 5 + Math.floor(r() * 3);
    const gridRows = 6 + Math.floor(r() * 4);
    const displacement = 0.03 + r() * 0.04;

    // Generate displaced grid points
    const grid: [number, number][][] = [];
    for (let col = 0; col <= gridCols; col++) {
        grid[col] = [];
        for (let row = 0; row <= gridRows; row++) {
            grid[col][row] = [
                col / gridCols + (r() - 0.5) * displacement * 2,
                row / gridRows + (r() - 0.5) * displacement * 2
            ];
        }
    }

    // Draw interpolated lines between adjacent columns
    const interpSteps = 2 + Math.floor(r() * 2);
    for (let col = 0; col < gridCols; col++) {
        for (let step = 0; step <= interpSteps; step++) {
            const t = step / interpSteps;
            const pts: [number, number][] = [];
            for (let row = 0; row <= gridRows; row++) {
                const p0 = grid[col][row];
                const p1 = grid[col + 1][row];
                pts.push([
                    Math.min(1, Math.max(0, p0[0] + (p1[0] - p0[0]) * t)),
                    Math.min(1, Math.max(0, p0[1] + (p1[1] - p0[1]) * t))
                ]);
            }
            drawUV(pts, step === 0 || step === interpSteps ? baseStyle : 'line');
        }
    }
}
