// Sigma (hexagonal) maze — large honeycomb cells
import type { PatternContext } from '../types';
import { generateMaze } from './helpers';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const hexRows = 2 + Math.floor(r() * 2);
    const hexCols = 2 + Math.floor(r() * 2);
    const margin = 0.05;
    const usableW = 1.0 - 2 * margin;
    const usableH = 1.0 - 2 * margin;
    const cellW = usableW / (hexCols + 0.5);
    const cellH = usableH / hexRows;
    const hexR = Math.min(cellW, cellH) * 0.48;

    const hexCenter = (row: number, col: number): [number, number] => {
        const offset = row % 2 === 0 ? 0 : cellW * 0.5;
        return [margin + cellW * 0.5 + col * cellW + offset, margin + cellH * 0.5 + row * cellH];
    };

    const hexVertex = (cx: number, cy: number, i: number): [number, number] => {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
        return [cx + Math.cos(a) * hexR, cy + Math.sin(a) * hexR];
    };

    const idx = (row: number, col: number) => row * hexCols + col;
    const totalCells = hexRows * hexCols;
    const neighbors: number[][] = Array.from({ length: totalCells }, () => []);

    for (let row = 0; row < hexRows; row++) {
        for (let col = 0; col < hexCols; col++) {
            const i = idx(row, col);
            if (col < hexCols - 1) {
                neighbors[i].push(idx(row, col + 1));
                neighbors[idx(row, col + 1)].push(i);
            }
            const offset = row % 2 === 0 ? -1 : 0;
            if (row < hexRows - 1) {
                const blCol = col + offset;
                if (blCol >= 0 && blCol < hexCols) {
                    neighbors[i].push(idx(row + 1, blCol));
                    neighbors[idx(row + 1, blCol)].push(i);
                }
                const brCol = col + offset + 1;
                if (brCol >= 0 && brCol < hexCols) {
                    neighbors[i].push(idx(row + 1, brCol));
                    neighbors[idx(row + 1, brCol)].push(i);
                }
            }
        }
    }

    for (let i = 0; i < totalCells; i++) {
        neighbors[i] = [...new Set(neighbors[i])];
    }

    const open = generateMaze(totalCells, neighbors, r);

    for (let row = 0; row < hexRows; row++) {
        for (let col = 0; col < hexCols; col++) {
            const [cx, cy] = hexCenter(row, col);
            const i = idx(row, col);

            for (let e = 0; e < 6; e++) {
                const v1 = hexVertex(cx, cy, e);
                const v2 = hexVertex(cx, cy, (e + 1) % 6);

                let nbIdx = -1;
                const offset = row % 2 === 0 ? -1 : 0;
                if (e === 1 && col < hexCols - 1) nbIdx = idx(row, col + 1);
                else if (e === 4 && col > 0) nbIdx = idx(row, col - 1);
                else if (e === 0 && row > 0) {
                    const c = col + offset + 1;
                    if (c >= 0 && c < hexCols) nbIdx = idx(row - 1, c);
                } else if (e === 5 && row > 0) {
                    const c = col + offset;
                    if (c >= 0 && c < hexCols) nbIdx = idx(row - 1, c);
                } else if (e === 2 && row < hexRows - 1) {
                    const c = col + offset + 1;
                    if (c >= 0 && c < hexCols) nbIdx = idx(row + 1, c);
                } else if (e === 3 && row < hexRows - 1) {
                    const c = col + offset;
                    if (c >= 0 && c < hexCols) nbIdx = idx(row + 1, c);
                }

                if (nbIdx >= 0) {
                    const key = i < nbIdx ? `${i}-${nbIdx}` : `${nbIdx}-${i}`;
                    if (open.has(key)) continue;
                }

                const cv1: [number, number] = [Math.min(1, Math.max(0, v1[0])), Math.min(1, Math.max(0, v1[1]))];
                const cv2: [number, number] = [Math.min(1, Math.max(0, v2[0])), Math.min(1, Math.max(0, v2[1]))];
                drawUV([cv1, cv2], 'line');
            }

            if (filled && r() > 0.65) {
                const fillR = hexR * 0.45;
                const pts: [number, number][] = [];
                for (let j = 0; j <= 6; j++) {
                    const a = (j / 6) * Math.PI * 2 - Math.PI / 6;
                    pts.push([
                        Math.min(1, Math.max(0, cx + Math.cos(a) * fillR)),
                        Math.min(1, Math.max(0, cy + Math.sin(a) * fillR))
                    ]);
                }
                drawUV(pts, 'filled');
            }
        }
    }
}
