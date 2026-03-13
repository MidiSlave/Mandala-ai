// Upsilon (octagon + square) maze — large octagonal cells
import type { PatternContext } from '../types';
import { generateMaze } from './helpers';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const gridSize = 2 + Math.floor(r() * 2);
    const margin = 0.05;
    const usableW = 1.0 - 2 * margin;
    const cellW = usableW / gridSize;
    const inset = cellW * 0.29;

    const numOct = gridSize * gridSize;
    const numSq = (gridSize - 1) * (gridSize - 1);
    const totalCells = numOct + numSq;
    const neighbors: number[][] = Array.from({ length: totalCells }, () => []);

    const octIdx = (row: number, col: number) => row * gridSize + col;
    const sqIdx = (row: number, col: number) => numOct + row * (gridSize - 1) + col;

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const oi = octIdx(row, col);
            if (col < gridSize - 1) {
                neighbors[oi].push(octIdx(row, col + 1));
                neighbors[octIdx(row, col + 1)].push(oi);
            }
            if (row < gridSize - 1) {
                neighbors[oi].push(octIdx(row + 1, col));
                neighbors[octIdx(row + 1, col)].push(oi);
            }
            if (row < gridSize - 1 && col < gridSize - 1) {
                const si = sqIdx(row, col);
                neighbors[oi].push(si); neighbors[si].push(oi);
                neighbors[octIdx(row, col + 1)].push(si); neighbors[si].push(octIdx(row, col + 1));
                neighbors[octIdx(row + 1, col)].push(si); neighbors[si].push(octIdx(row + 1, col));
                neighbors[octIdx(row + 1, col + 1)].push(si); neighbors[si].push(octIdx(row + 1, col + 1));
            }
        }
    }

    for (let i = 0; i < totalCells; i++) {
        neighbors[i] = [...new Set(neighbors[i])];
    }

    const open = generateMaze(totalCells, neighbors, r);

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cx = margin + (col + 0.5) * cellW;
            const cy = margin + (row + 0.5) * cellW;
            const hw = cellW * 0.5;
            const oi = octIdx(row, col);

            const octVerts: [number, number][] = [
                [cx - hw + inset, cy - hw],
                [cx + hw - inset, cy - hw],
                [cx + hw, cy - hw + inset],
                [cx + hw, cy + hw - inset],
                [cx + hw - inset, cy + hw],
                [cx - hw + inset, cy + hw],
                [cx - hw, cy + hw - inset],
                [cx - hw, cy - hw + inset],
            ];

            const edgeNeighbors = [
                row > 0 ? octIdx(row - 1, col) : -1,
                row > 0 && col < gridSize - 1 ? sqIdx(row - 1, col) : -1,
                col < gridSize - 1 ? octIdx(row, col + 1) : -1,
                row < gridSize - 1 && col < gridSize - 1 ? sqIdx(row, col) : -1,
                row < gridSize - 1 ? octIdx(row + 1, col) : -1,
                row < gridSize - 1 && col > 0 ? sqIdx(row, col - 1) : -1,
                col > 0 ? octIdx(row, col - 1) : -1,
                row > 0 && col > 0 ? sqIdx(row - 1, col - 1) : -1,
            ];

            for (let e = 0; e < 8; e++) {
                const nb = edgeNeighbors[e];
                if (nb >= 0) {
                    const key = oi < nb ? `${oi}-${nb}` : `${nb}-${oi}`;
                    if (open.has(key)) continue;
                }
                const v1 = octVerts[e];
                const v2 = octVerts[(e + 1) % 8];
                const c1: [number, number] = [Math.min(1, Math.max(0, v1[0])), Math.min(1, Math.max(0, v1[1]))];
                const c2: [number, number] = [Math.min(1, Math.max(0, v2[0])), Math.min(1, Math.max(0, v2[1]))];
                drawUV([c1, c2], 'line');
            }

            if (filled && r() > 0.7) {
                const fillPts = octVerts.map(([u, v]) => [
                    Math.min(1, Math.max(0, cx + (u - cx) * 0.5)),
                    Math.min(1, Math.max(0, cy + (v - cy) * 0.5))
                ] as [number, number]);
                drawUV(fillPts, 'filled');
            }
        }
    }
}
