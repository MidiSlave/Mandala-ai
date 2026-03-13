// Delta (triangular) maze — large triangular cells
import type { PatternContext } from '../types';
import { generateMaze } from './helpers';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const triRows = 2 + Math.floor(r() * 2);
    const triCols = 3 + Math.floor(r() * 2);
    const totalCells = triRows * triCols * 2;
    const cellIdx = (row: number, col: number, up: boolean) => row * triCols * 2 + col * 2 + (up ? 0 : 1);

    const margin = 0.04;
    const usableH = 1.0 - 2 * margin;
    const usableW = 1.0 - 2 * margin;
    const rowH = usableH / triRows;
    const colW = usableW / triCols;

    const triVerts = (row: number, col: number, up: boolean): [number, number][] => {
        const x0 = margin + col * colW;
        const y0 = margin + row * rowH;
        if (up) {
            return [[x0, y0 + rowH], [x0 + colW, y0 + rowH], [x0 + colW * 0.5, y0]];
        } else {
            return [[x0, y0], [x0 + colW, y0], [x0 + colW * 0.5, y0 + rowH]];
        }
    };

    const neighbors: number[][] = Array.from({ length: totalCells }, () => []);
    const addEdge = (a: number, b: number) => {
        if (!neighbors[a].includes(b)) neighbors[a].push(b);
        if (!neighbors[b].includes(a)) neighbors[b].push(a);
    };

    for (let row = 0; row < triRows; row++) {
        for (let col = 0; col < triCols; col++) {
            const upIdx = cellIdx(row, col, true);
            const downIdx = cellIdx(row, col, false);
            addEdge(upIdx, downIdx);
            if (col > 0) addEdge(upIdx, cellIdx(row, col - 1, false));
            if (col < triCols - 1) addEdge(downIdx, cellIdx(row, col + 1, true));
            if (row > 0) addEdge(upIdx, cellIdx(row - 1, col, false));
            if (row < triRows - 1) addEdge(downIdx, cellIdx(row + 1, col, true));
        }
    }

    const open = generateMaze(totalCells, neighbors, r);

    const drawn = new Set<string>();
    for (let row = 0; row < triRows; row++) {
        for (let col = 0; col < triCols; col++) {
            for (const up of [true, false]) {
                const idx = cellIdx(row, col, up);
                const verts = triVerts(row, col, up);
                for (const nb of neighbors[idx]) {
                    const key = idx < nb ? `${idx}-${nb}` : `${nb}-${idx}`;
                    if (drawn.has(key)) continue;
                    drawn.add(key);
                    if (!open.has(key)) {
                        const nbRow = Math.floor(nb / (triCols * 2));
                        const nbRem = nb % (triCols * 2);
                        const nbCol = Math.floor(nbRem / 2);
                        const nbUp = nbRem % 2 === 0;
                        const nbVerts = triVerts(nbRow, nbCol, nbUp);
                        const shared: [number, number][] = [];
                        for (const v1 of verts) {
                            for (const v2 of nbVerts) {
                                if (Math.abs(v1[0] - v2[0]) < 0.001 && Math.abs(v1[1] - v2[1]) < 0.001) {
                                    shared.push(v1);
                                }
                            }
                        }
                        if (shared.length >= 2) {
                            drawUV([shared[0], shared[1]], 'line');
                        }
                    }
                }

                if (filled && r() > 0.75) {
                    const cx = (verts[0][0] + verts[1][0] + verts[2][0]) / 3;
                    const cy = (verts[0][1] + verts[1][1] + verts[2][1]) / 3;
                    const shrink = 0.55;
                    const fv = verts.map(v => [
                        cx + (v[0] - cx) * shrink,
                        cy + (v[1] - cy) * shrink
                    ] as [number, number]);
                    drawUV(fv, 'filled');
                }
            }
        }
    }

    drawUV([[margin, margin], [1 - margin, margin]], 'line');
    drawUV([[margin, 1 - margin], [1 - margin, 1 - margin]], 'line');
    drawUV([[margin, margin], [margin, 1 - margin]], 'line');
    drawUV([[1 - margin, margin], [1 - margin, 1 - margin]], 'line');
}
