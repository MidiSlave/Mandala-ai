import type { PatternSet, PatternContext } from './types';

// Generic maze generator using recursive backtracking on an adjacency graph
// cells: number of cells, neighbors: adjacency list, returns set of open wall keys "a-b"
function generateMaze(numCells: number, neighbors: number[][], rng: () => number): Set<string> {
    const visited = new Uint8Array(numCells);
    const open = new Set<string>();
    const stack: number[] = [];
    const start = Math.floor(rng() * numCells);
    visited[start] = 1;
    stack.push(start);

    while (stack.length > 0) {
        const cur = stack[stack.length - 1];
        const unvisited: number[] = [];
        for (const nb of neighbors[cur]) {
            if (!visited[nb]) unvisited.push(nb);
        }
        if (unvisited.length === 0) { stack.pop(); continue; }
        const next = unvisited[Math.floor(rng() * unvisited.length)];
        const key = cur < next ? `${cur}-${next}` : `${next}-${cur}`;
        open.add(key);
        visited[next] = 1;
        stack.push(next);
    }
    return open;
}

// Simple orthogonal maze generator returning wall arrays
function generateGridMaze(cols: number, rows: number, rng: () => number): { hWalls: boolean[][], vWalls: boolean[][] } {
    const hWalls: boolean[][] = Array.from({ length: rows + 1 }, () => Array(cols).fill(true));
    const vWalls: boolean[][] = Array.from({ length: rows }, () => Array(cols + 1).fill(true));

    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const stack: [number, number][] = [];
    const startR = Math.floor(rng() * rows);
    const startC = Math.floor(rng() * cols);
    visited[startR][startC] = true;
    stack.push([startR, startC]);

    const dirs: [number, number][] = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    while (stack.length > 0) {
        const [cr, cc] = stack[stack.length - 1];
        const shuffled = dirs.slice();
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(rng() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        let found = false;
        for (const [dr, dc] of shuffled) {
            const nr = cr + dr;
            const nc = cc + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc]) {
                visited[nr][nc] = true;
                if (dr === 1) hWalls[cr + 1][cc] = false;
                else if (dr === -1) hWalls[cr][cc] = false;
                else if (dc === 1) vWalls[cr][cc + 1] = false;
                else if (dc === -1) vWalls[cr][cc] = false;
                stack.push([nr, nc]);
                found = true;
                break;
            }
        }
        if (!found) stack.pop();
    }

    return { hWalls, vWalls };
}

const mazePatterns: PatternSet = {
    name: 'Maze / Labyrinth',
    count: 6,
    draw: (type: number, { drawUV, filled, baseStyle, rng }: PatternContext) => {
        const r = rng ?? (() => Math.random());

        switch (type) {
            case 0: { // Theta maze — concentric rings with radial walls and gaps
                const rings = 3 + Math.floor(r() * 3);
                const segs = 3 + Math.floor(r() * 3);
                const ringH = 1.0 / rings;
                const segW = 1.0 / segs;
                const wallThick = filled ? 0.025 : 0;

                for (let ri = 0; ri <= rings; ri++) {
                    const v = ri * ringH;
                    if (ri === 0 || ri === rings) {
                        if (filled) {
                            const t = wallThick * 0.5;
                            drawUV([[0, Math.max(0, v - t)], [1, Math.max(0, v - t)], [1, Math.min(1, v + t)], [0, Math.min(1, v + t)]], 'filled');
                        } else {
                            drawUV([[0, v], [1, v]], 'line');
                        }
                        continue;
                    }
                    for (let si = 0; si < segs; si++) {
                        const u0 = si * segW;
                        const u1 = (si + 1) * segW;
                        const gapCenter = u0 + segW * (0.2 + r() * 0.6);
                        const gapHalf = segW * 0.15;
                        const gapStart = Math.max(u0, gapCenter - gapHalf);
                        const gapEnd = Math.min(u1, gapCenter + gapHalf);

                        if (filled) {
                            const t = wallThick * 0.5;
                            if (gapStart > u0 + 0.01)
                                drawUV([[u0, v - t], [gapStart, v - t], [gapStart, v + t], [u0, v + t]], 'filled');
                            if (u1 > gapEnd + 0.01)
                                drawUV([[gapEnd, v - t], [u1, v - t], [u1, v + t], [gapEnd, v + t]], 'filled');
                        } else {
                            if (gapStart > u0 + 0.01) drawUV([[u0, v], [gapStart, v]], 'line');
                            if (u1 > gapEnd + 0.01) drawUV([[gapEnd, v], [u1, v]], 'line');
                        }
                    }
                }

                for (let si = 0; si < segs; si++) {
                    const u = si * segW;
                    if (u < 0.01) continue;
                    for (let ri = 0; ri < rings; ri++) {
                        if (r() > 0.65) continue;
                        const v0 = ri * ringH;
                        const v1 = (ri + 1) * ringH;
                        if (filled) {
                            const t = wallThick * 0.5;
                            drawUV([[u - t, v0], [u + t, v0], [u + t, v1], [u - t, v1]], 'filled');
                        } else {
                            drawUV([[u, v0], [u, v1]], 'line');
                        }
                    }
                }

                if (filled) {
                    for (let ri = 1; ri < rings; ri++) {
                        for (let si = 0; si < segs; si++) {
                            if (r() > 0.3) continue;
                            const cu = si * segW;
                            const cv = ri * ringH;
                            const dotR = 0.015;
                            const pts: [number, number][] = [];
                            for (let j = 0; j <= 6; j++) {
                                const a = (j / 6) * Math.PI * 2;
                                pts.push([cu + Math.cos(a) * dotR, cv + Math.sin(a) * dotR]);
                            }
                            drawUV(pts, 'opaque-outline');
                        }
                    }
                }
                break;
            }

            case 1: { // Delta (triangular) maze — large triangular cells
                const triRows = 2 + Math.floor(r() * 2); // 2-3 rows
                const triCols = 3 + Math.floor(r() * 2); // 3-4 cols
                const totalCells = triRows * triCols * 2;
                const cellIdx = (row: number, col: number, up: boolean) => row * triCols * 2 + col * 2 + (up ? 0 : 1);

                const margin = 0.04;
                const usableW = 1.0 - 2 * margin;
                const usableH = 1.0 - 2 * margin;
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

                // Build adjacency
                const neighbors: number[][] = Array.from({ length: totalCells }, () => []);
                const addEdge = (a: number, b: number) => {
                    if (!neighbors[a].includes(b)) neighbors[a].push(b);
                    if (!neighbors[b].includes(a)) neighbors[b].push(a);
                };

                for (let row = 0; row < triRows; row++) {
                    for (let col = 0; col < triCols; col++) {
                        const upIdx = cellIdx(row, col, true);
                        const downIdx = cellIdx(row, col, false);
                        addEdge(upIdx, downIdx); // up and down share base
                        if (col > 0) addEdge(upIdx, cellIdx(row, col - 1, false));
                        if (col < triCols - 1) addEdge(downIdx, cellIdx(row, col + 1, true));
                        if (row > 0) addEdge(upIdx, cellIdx(row - 1, col, false));
                        if (row < triRows - 1) addEdge(downIdx, cellIdx(row + 1, col, true));
                    }
                }

                const open = generateMaze(totalCells, neighbors, r);

                // Draw walls: for each adjacent pair, if not open draw the shared edge
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
                                    // Find shared vertices
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

                            // Fill some cells
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

                // Outer border
                drawUV([[margin, margin], [1 - margin, margin]], 'line');
                drawUV([[margin, 1 - margin], [1 - margin, 1 - margin]], 'line');
                drawUV([[margin, margin], [margin, 1 - margin]], 'line');
                drawUV([[1 - margin, margin], [1 - margin, 1 - margin]], 'line');
                break;
            }

            case 2: { // Orthogonal grid maze — classic rectangular maze with walls
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
                break;
            }

            case 3: { // Sigma (hexagonal) maze — large honeycomb cells
                const hexRows = 2 + Math.floor(r() * 2); // 2-3 rows
                const hexCols = 2 + Math.floor(r() * 2); // 2-3 cols
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

                        // Draw each hex edge if wall is closed
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
                                if (open.has(key)) continue; // passage open
                            }

                            const cv1: [number, number] = [Math.min(1, Math.max(0, v1[0])), Math.min(1, Math.max(0, v1[1]))];
                            const cv2: [number, number] = [Math.min(1, Math.max(0, v2[0])), Math.min(1, Math.max(0, v2[1]))];
                            drawUV([cv1, cv2], 'line');
                        }

                        // Fill some hex cells
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
                break;
            }

            case 4: { // Upsilon (octagon + square) maze — large octagonal cells
                const gridSize = 2 + Math.floor(r() * 2); // 2-3 grid
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
                break;
            }

            case 5: { // Diagonal / zeta maze — grid with diagonal passages
                const gridW = 3 + Math.floor(r() * 2); // 3-4 wide
                const gridH = 3 + Math.floor(r() * 2); // 3-4 tall
                const margin = 0.04;
                const usableW = 1.0 - 2 * margin;
                const usableH = 1.0 - 2 * margin;
                const cellW = usableW / gridW;
                const cellH = usableH / gridH;
                const totalCells = gridW * gridH;
                const idx = (row: number, col: number) => row * gridW + col;
                const neighbors: number[][] = Array.from({ length: totalCells }, () => []);

                // Cardinal + diagonal adjacency
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

                // Draw open passages as paths from cell center to cell center
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

                        // Node dot
                        const dotR = 0.015;
                        const dotPts: [number, number][] = [];
                        for (let j = 0; j <= 6; j++) {
                            const a = (j / 6) * Math.PI * 2;
                            dotPts.push([cx + Math.cos(a) * dotR, cy + Math.sin(a) * dotR]);
                        }
                        drawUV(dotPts, filled ? 'filled' : 'outline');
                    }
                }

                // Outer border
                drawUV([[margin, margin], [1 - margin, margin], [1 - margin, 1 - margin], [margin, 1 - margin]], 'outline');
                break;
            }
        }
    }
};

export default mazePatterns;
