// Diagonal / zeta maze — grid with diagonal passages
import type { PatternContext } from '../types';
import { generateMaze } from './helpers';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const gridW = 3 + Math.floor(r() * 2);
    const gridH = 3 + Math.floor(r() * 2);
    const margin = 0.04;
    const usableW = 1.0 - 2 * margin;
    const usableH = 1.0 - 2 * margin;
    const cellW = usableW / gridW;
    const cellH = usableH / gridH;
    const totalCells = gridW * gridH;
    const idx = (row: number, col: number) => row * gridW + col;
    const neighbors: number[][] = Array.from({ length: totalCells }, () => []);

    for (let row = 0; row < gridH; row++) {
        for (let col = 0; col < gridW; col++) {
            const i = idx(row, col);
            if (col < gridW - 1) { neighbors[i].push(idx(row, col + 1)); neighbors[idx(row, col + 1)].push(i); }
            if (row < gridH - 1) { neighbors[i].push(idx(row + 1, col)); neighbors[idx(row + 1, col)].push(i); }
            if (row < gridH - 1 && col < gridW - 1) {
                neighbors[i].push(idx(row + 1, col + 1));
                neighbors[idx(row + 1, col + 1)].push(i);
            }
            if (row < gridH - 1 && col > 0) {
                neighbors[i].push(idx(row + 1, col - 1));
                neighbors[idx(row + 1, col - 1)].push(i);
            }
        }
    }

    for (let i = 0; i < totalCells; i++) {
        neighbors[i] = [...new Set(neighbors[i])];
    }

    const open = generateMaze(totalCells, neighbors, r);

    for (let row = 0; row < gridH; row++) {
        for (let col = 0; col < gridW; col++) {
            const i = idx(row, col);
            const cx = margin + (col + 0.5) * cellW;
            const cy = margin + (row + 0.5) * cellH;

            for (const nb of neighbors[i]) {
                if (nb <= i) continue;
                const key = `${i}-${nb}`;
                if (!open.has(key)) continue;
                const nbRow = Math.floor(nb / gridW);
                const nbCol = nb % gridW;
                const ncx = margin + (nbCol + 0.5) * cellW;
                const ncy = margin + (nbRow + 0.5) * cellH;
                drawUV([[cx, cy], [ncx, ncy]], 'line');
            }

            const dotR = 0.015;
            const dotPts: [number, number][] = [];
            for (let j = 0; j <= 6; j++) {
                const a = (j / 6) * Math.PI * 2;
                dotPts.push([cx + Math.cos(a) * dotR, cy + Math.sin(a) * dotR]);
            }
            drawUV(dotPts, filled ? 'filled' : 'outline');
        }
    }

    drawUV([[margin, margin], [1 - margin, margin], [1 - margin, 1 - margin], [margin, 1 - margin]], 'outline');
}
