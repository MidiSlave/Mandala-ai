// Orthogonal grid maze — classic rectangular maze with walls
import type { PatternContext } from '../types';
import { generateGridMaze } from './helpers';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const cols = 3 + Math.floor(r() * 2);
    const rows = 3 + Math.floor(r() * 2);
    const { hWalls, vWalls } = generateGridMaze(cols, rows, r);
    const cellW = 1.0 / cols;
    const cellH = 1.0 / rows;
    const margin = 0.03;

    for (let row = 0; row <= rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (hWalls[row][col]) {
                const u0 = margin + col * cellW * (1 - 2 * margin);
                const u1 = margin + (col + 1) * cellW * (1 - 2 * margin);
                const v = margin + row * cellH * (1 - 2 * margin);
                if (filled) {
                    const t = 0.015;
                    drawUV([[u0, v - t], [u1, v - t], [u1, v + t], [u0, v + t]], 'filled');
                } else {
                    drawUV([[u0, v], [u1, v]], 'line');
                }
            }
        }
    }

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col <= cols; col++) {
            if (vWalls[row][col]) {
                const u = margin + col * cellW * (1 - 2 * margin);
                const v0 = margin + row * cellH * (1 - 2 * margin);
                const v1 = margin + (row + 1) * cellH * (1 - 2 * margin);
                if (filled) {
                    const t = 0.015;
                    drawUV([[u - t, v0], [u + t, v0], [u + t, v1], [u - t, v1]], 'filled');
                } else {
                    drawUV([[u, v0], [u, v1]], 'line');
                }
            }
        }
    }

    if (filled) {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let wallCount = 0;
                if (hWalls[row][col]) wallCount++;
                if (hWalls[row + 1][col]) wallCount++;
                if (vWalls[row][col]) wallCount++;
                if (vWalls[row][col + 1]) wallCount++;
                if (wallCount >= 3 && r() > 0.4) {
                    const cu0 = margin + (col + 0.2) * cellW * (1 - 2 * margin);
                    const cu1 = margin + (col + 0.8) * cellW * (1 - 2 * margin);
                    const cv0 = margin + (row + 0.2) * cellH * (1 - 2 * margin);
                    const cv1 = margin + (row + 0.8) * cellH * (1 - 2 * margin);
                    drawUV([[cu0, cv0], [cu1, cv0], [cu1, cv1], [cu0, cv1]], 'opaque-outline');
                }
            }
        }
    }
}
