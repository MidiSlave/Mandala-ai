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

const mazePatterns: PatternSet = {
    name: 'Maze / Labyrinth',
    count: 6,
    draw: (type: number, { drawUV, filled, baseStyle, rng }: PatternContext) => {
        const r = rng ?? (() => Math.random());

        switch (type) {
            case 0: { // Delta (triangular) maze — triangular tessellation
                const rows = 4 + Math.floor(r() * 2);
                const cols = 5 + Math.floor(r() * 3);

                // Build triangular grid: each cell is a triangle
                // Row r has (2*cols) triangles, alternating up/down
                const totalCells = rows * cols * 2;
                const cellIdx = (row: number, col: number, up: boolean) => row * cols * 2 + col * 2 + (up ? 0 : 1);

                // Compute triangle vertices in UV space
                const triVerts = (row: number, col: number, up: boolean): [number, number][] => {
                    const rowH = 1.0 / rows;
                    const colW = 1.0 / cols;
                    const x0 = col * colW;
                    const y0 = row * rowH;
                    if (up) {
                        return [[x0, y0 + rowH], [x0 + colW, y0 + rowH], [x0 + colW * 0.5, y0]];
                    } else {
                        return [[x0, y0], [x0 + colW, y0], [x0 + colW * 0.5, y0 + rowH]];
                    }
                };

                // Build adjacency: up-tri shares edges with down-tri neighbors
                const neighbors: number[][] = Array.from({ length: totalCells }, () => []);
                for (let row = 0; row < rows; row++) {
                    for (let col = 0; col < cols; col++) {
                        const upIdx = cellIdx(row, col, true);
                        const downIdx = cellIdx(row, col, false);
                        // Up and down in same cell share bottom/top edge
                        neighbors[upIdx].push(downIdx);
                        neighbors[downIdx].push(upIdx);
                        // Up-tri's left edge neighbors left cell's down-tri
                        if (col > 0) {
                            neighbors[upIdx].push(cellIdx(row, col - 1, false));
                            neighbors[cellIdx(row, col - 1, false)].push(upIdx);
                        }
                        // Down-tri's right edge neighbors right cell's up-tri
                        if (col < cols - 1) {
                            neighbors[downIdx].push(cellIdx(row, col + 1, true));
                            neighbors[cellIdx(row, col + 1, true)].push(downIdx);
                        }
                        // Up-tri top edge neighbors row above's down-tri
                        if (row > 0) {
                            neighbors[upIdx].push(cellIdx(row - 1, col, false));
                            neighbors[cellIdx(row - 1, col, false)].push(upIdx);
                        }
                        // Down-tri bottom edge neighbors row below's up-tri
                        if (row < rows - 1) {
                            neighbors[downIdx].push(cellIdx(row + 1, col, true));
                            neighbors[cellIdx(row + 1, col, true)].push(downIdx);
                        }
                    }
                }

                // Deduplicate adjacency
                for (let i = 0; i < totalCells; i++) {
                    neighbors[i] = [...new Set(neighbors[i])];
                }

                const open = generateMaze(totalCells, neighbors, r);

                // Draw walls: for each pair of adjacent cells, if not open, draw shared edge
                const drawn = new Set<string>();
                for (let row = 0; row < rows; row++) {
                    for (let col = 0; col < cols; col++) {
                        for (const up of [true, false]) {
                            const idx = cellIdx(row, col, up);
                            const verts = triVerts(row, col, up);
                            for (const nb of neighbors[idx]) {
                                const key = idx < nb ? `${idx}-${nb}` : `${nb}-${idx}`;
                                if (drawn.has(key)) continue;
                                drawn.add(key);
                                if (!open.has(key)) {
                                    // Find shared edge (2 closest vertices)
                                    // For simplicity, draw the cell outline edges that are walls
                                    // Each triangle has 3 edges; determine which edge is shared
                                    const nbRow = Math.floor(nb / (cols * 2));
                                    const nbRem = nb % (cols * 2);
                                    const nbCol = Math.floor(nbRem / 2);
                                    const nbUp = nbRem % 2 === 0;
                                    const nbVerts = triVerts(nbRow, nbCol, nbUp);

                                    // Find the two shared vertices (closest pair matching)
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
                            if (filled && r() > 0.8) {
                                drawUV(verts, 'filled');
                            }
                        }
                    }
                }

                // Outer border
                drawUV([[0, 0], [1, 0]], 'line');
                drawUV([[0, 1], [1, 1]], 'line');
                drawUV([[0, 0], [0, 1]], 'line');
                drawUV([[1, 0], [1, 1]], 'line');
                break;
            }

            case 1: { // Sigma (hexagonal) maze — honeycomb tessellation
                const hexRows = 3 + Math.floor(r() * 2);
                const hexCols = 3 + Math.floor(r() * 2);
                const cellW = 1.0 / (hexCols + 0.5);
                const cellH = 1.0 / hexRows;
                const hexR = Math.min(cellW, cellH) * 0.48;

                const hexCenter = (row: number, col: number): [number, number] => {
                    const offset = row % 2 === 0 ? 0 : cellW * 0.5;
                    return [cellW * 0.5 + col * cellW + offset, cellH * 0.5 + row * cellH];
                };

                const hexVertex = (cx: number, cy: number, i: number): [number, number] => {
                    const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
                    return [cx + Math.cos(a) * hexR, cy + Math.sin(a) * hexR];
                };

                const idx = (row: number, col: number) => row * hexCols + col;
                const totalCells = hexRows * hexCols;
                const neighbors: number[][] = Array.from({ length: totalCells }, () => []);

                // Build hex adjacency
                for (let row = 0; row < hexRows; row++) {
                    for (let col = 0; col < hexCols; col++) {
                        const i = idx(row, col);
                        // Right neighbor
                        if (col < hexCols - 1) {
                            neighbors[i].push(idx(row, col + 1));
                            neighbors[idx(row, col + 1)].push(i);
                        }
                        // Diagonal neighbors depend on even/odd row
                        const offset = row % 2 === 0 ? -1 : 0;
                        if (row < hexRows - 1) {
                            // Bottom-left
                            const blCol = col + offset;
                            if (blCol >= 0 && blCol < hexCols) {
                                neighbors[i].push(idx(row + 1, blCol));
                                neighbors[idx(row + 1, blCol)].push(i);
                            }
                            // Bottom-right
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

                // Draw hex outlines with gaps for open passages
                for (let row = 0; row < hexRows; row++) {
                    for (let col = 0; col < hexCols; col++) {
                        const [cx, cy] = hexCenter(row, col);
                        const i = idx(row, col);

                        // Draw each of 6 hex edges if wall is closed
                        for (let e = 0; e < 6; e++) {
                            const v1 = hexVertex(cx, cy, e);
                            const v2 = hexVertex(cx, cy, (e + 1) % 6);

                            // Determine which neighbor shares this edge
                            // Edge directions: 0=NE, 1=E, 2=SE, 3=SW, 4=W, 5=NW
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
                                if (open.has(key)) continue; // passage open, skip wall
                            }

                            // Clamp to UV bounds
                            const cv1: [number, number] = [Math.min(1, Math.max(0, v1[0])), Math.min(1, Math.max(0, v1[1]))];
                            const cv2: [number, number] = [Math.min(1, Math.max(0, v2[0])), Math.min(1, Math.max(0, v2[1]))];
                            drawUV([cv1, cv2], 'line');
                        }

                        // Fill center of some hex cells
                        if (filled && r() > 0.7) {
                            const fillR = hexR * 0.4;
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

            case 2: { // Upsilon (octagon + square) maze
                const gridSize = 3 + Math.floor(r() * 2);
                const cellW = 1.0 / gridSize;
                const inset = cellW * 0.29; // octagon corner cut

                // Each grid position has an octagon; squares fill the gaps at corners
                // Total cells: gridSize*gridSize octagons + (gridSize-1)*(gridSize-1) squares
                const numOct = gridSize * gridSize;
                const numSq = (gridSize - 1) * (gridSize - 1);
                const totalCells = numOct + numSq;
                const neighbors: number[][] = Array.from({ length: totalCells }, () => []);

                const octIdx = (row: number, col: number) => row * gridSize + col;
                const sqIdx = (row: number, col: number) => numOct + row * (gridSize - 1) + col;

                // Build adjacency
                for (let row = 0; row < gridSize; row++) {
                    for (let col = 0; col < gridSize; col++) {
                        const oi = octIdx(row, col);
                        // Right octagon neighbor
                        if (col < gridSize - 1) {
                            neighbors[oi].push(octIdx(row, col + 1));
                            neighbors[octIdx(row, col + 1)].push(oi);
                        }
                        // Bottom octagon neighbor
                        if (row < gridSize - 1) {
                            neighbors[oi].push(octIdx(row + 1, col));
                            neighbors[octIdx(row + 1, col)].push(oi);
                        }
                        // Diagonal squares: octagon connects to 4 adjacent small squares
                        if (row < gridSize - 1 && col < gridSize - 1) {
                            const si = sqIdx(row, col);
                            neighbors[oi].push(si);
                            neighbors[si].push(oi);
                            neighbors[octIdx(row, col + 1)].push(si);
                            neighbors[si].push(octIdx(row, col + 1));
                            neighbors[octIdx(row + 1, col)].push(si);
                            neighbors[si].push(octIdx(row + 1, col));
                            neighbors[octIdx(row + 1, col + 1)].push(si);
                            neighbors[si].push(octIdx(row + 1, col + 1));
                        }
                    }
                }

                for (let i = 0; i < totalCells; i++) {
                    neighbors[i] = [...new Set(neighbors[i])];
                }

                const open = generateMaze(totalCells, neighbors, r);

                // Draw octagons
                for (let row = 0; row < gridSize; row++) {
                    for (let col = 0; col < gridSize; col++) {
                        const cx = (col + 0.5) * cellW;
                        const cy = (row + 0.5) * cellW;
                        const hw = cellW * 0.5;
                        const oi = octIdx(row, col);

                        // 8 vertices of octagon (top-left corner clipped)
                        const octVerts: [number, number][] = [
                            [cx - hw + inset, cy - hw],       // top edge left
                            [cx + hw - inset, cy - hw],       // top edge right
                            [cx + hw, cy - hw + inset],       // right edge top
                            [cx + hw, cy + hw - inset],       // right edge bottom
                            [cx + hw - inset, cy + hw],       // bottom edge right
                            [cx - hw + inset, cy + hw],       // bottom edge left
                            [cx - hw, cy + hw - inset],       // left edge bottom
                            [cx - hw, cy - hw + inset],       // left edge top
                        ];

                        // Draw each octagon edge as wall if no passage
                        // Edge 0(top): neighbor is octagon above
                        // Edge 1(TR corner): neighbor is square at (row-1, col) if exists
                        // Edge 2(right): neighbor is octagon right
                        // Edge 3(BR corner): neighbor is square at (row, col)
                        // Edge 4(bottom): neighbor is octagon below
                        // Edge 5(BL corner): neighbor is square at (row, col-1)
                        // Edge 6(left): neighbor is octagon left
                        // Edge 7(TL corner): neighbor is square at (row-1, col-1)
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

                        if (filled && r() > 0.75) {
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

            case 3: { // Diagonal / zeta maze — orthogonal grid with diagonal passages
                const gridW = 4 + Math.floor(r() * 3);
                const gridH = 4 + Math.floor(r() * 2);
                const cellW = 1.0 / gridW;
                const cellH = 1.0 / gridH;
                const totalCells = gridW * gridH;
                const idx = (row: number, col: number) => row * gridW + col;
                const neighbors: number[][] = Array.from({ length: totalCells }, () => []);

                // Build adjacency: 4 cardinal + 4 diagonal
                for (let row = 0; row < gridH; row++) {
                    for (let col = 0; col < gridW; col++) {
                        const i = idx(row, col);
                        // Cardinal
                        if (col < gridW - 1) { neighbors[i].push(idx(row, col + 1)); neighbors[idx(row, col + 1)].push(i); }
                        if (row < gridH - 1) { neighbors[i].push(idx(row + 1, col)); neighbors[idx(row + 1, col)].push(i); }
                        // Diagonal
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
                        const cx = (col + 0.5) * cellW;
                        const cy = (row + 0.5) * cellH;

                        for (const nb of neighbors[i]) {
                            if (nb <= i) continue; // draw each edge once
                            const key = `${i}-${nb}`;
                            if (!open.has(key)) continue;
                            const nbRow = Math.floor(nb / gridW);
                            const nbCol = nb % gridW;
                            const ncx = (nbCol + 0.5) * cellW;
                            const ncy = (nbRow + 0.5) * cellH;
                            drawUV([[cx, cy], [ncx, ncy]], 'line');
                        }

                        // Node dot at cell center
                        const dotR = 0.01;
                        const dotPts: [number, number][] = [];
                        for (let j = 0; j <= 6; j++) {
                            const a = (j / 6) * Math.PI * 2;
                            dotPts.push([cx + Math.cos(a) * dotR, cy + Math.sin(a) * dotR]);
                        }
                        drawUV(dotPts, filled ? 'filled' : 'outline');
                    }
                }

                // Outer border
                drawUV([[0, 0], [1, 0], [1, 1], [0, 1]], 'outline');
                break;
            }

            case 4: { // Hilbert curve maze — space-filling fractal path
                const pts: [number, number][] = [];
                const order = 2 + Math.floor(r() * 2);

                const hilbert = (
                    x: number, y: number,
                    ax: number, ay: number,
                    bx: number, by: number,
                    depth: number
                ) => {
                    const w = Math.abs(ax + ay);
                    const h = Math.abs(bx + by);

                    if (depth <= 0 || (w <= 1 && h <= 1)) {
                        const size = 1 << order;
                        const px = (x + (x + w)) / 2 / size;
                        const py = (y + (y + h)) / 2 / size;
                        pts.push([
                            Math.min(1, Math.max(0, 0.05 + px * 0.9)),
                            Math.min(1, Math.max(0, 0.05 + py * 0.9))
                        ]);
                        return;
                    }

                    const ax2 = Math.floor(ax / 2);
                    const ay2 = Math.floor(ay / 2);
                    const bx2 = Math.floor(bx / 2);
                    const by2 = Math.floor(by / 2);

                    const w2 = Math.abs(ax2 + ay2);
                    const h2 = Math.abs(bx2 + by2);

                    if (w2 >= h2) {
                        hilbert(x, y, bx2, by2, ax2, ay2, depth - 1);
                        hilbert(x + ax2, y + ay2, ax2, ay2, bx2, by2, depth - 1);
                        hilbert(x + ax2 + bx2, y + ay2 + by2, -bx2, -by2, -(ax - ax2), -(ay - ay2), depth - 1);
                    } else {
                        hilbert(x, y, ax2, ay2, bx2, by2, depth - 1);
                        hilbert(x + bx2, y + by2, bx2, by2, ax2, ay2, depth - 1);
                        hilbert(x + ax2 + bx2, y + ay2 + by2, -(ax - ax2), -(ay - ay2), -bx2, -by2, depth - 1);
                    }
                };

                const size = 1 << order;
                hilbert(0, 0, size, 0, 0, size, order);

                // Draw as connected path
                drawUV(pts, filled ? baseStyle : 'line');

                // Draw waypoint dots at corners in filled mode
                if (filled) {
                    for (let i = 0; i < pts.length; i += Math.floor(pts.length / 8)) {
                        const p = pts[i];
                        const dr = 0.012;
                        const dotPts: [number, number][] = [];
                        for (let j = 0; j <= 6; j++) {
                            const a = (j / 6) * Math.PI * 2;
                            dotPts.push([p[0] + Math.cos(a) * dr, p[1] + Math.sin(a) * dr]);
                        }
                        drawUV(dotPts, 'filled');
                    }
                }
                break;
            }

            case 5: { // Recursive division maze — fractal nested chambers
                const drawDivision = (u0: number, v0: number, u1: number, v1: number, depth: number) => {
                    const w = u1 - u0;
                    const h = v1 - v0;
                    if (depth <= 0 || w < 0.07 || h < 0.07) return;

                    if (w > h) {
                        const wallU = u0 + w * (0.3 + r() * 0.4);
                        const gapV = v0 + h * (0.1 + r() * 0.8);
                        const gapSize = h * 0.15;
                        drawUV([[wallU, v0], [wallU, Math.max(v0, gapV - gapSize)]], 'line');
                        drawUV([[wallU, Math.min(v1, gapV + gapSize)], [wallU, v1]], 'line');
                        drawDivision(u0, v0, wallU, v1, depth - 1);
                        drawDivision(wallU, v0, u1, v1, depth - 1);
                    } else {
                        const wallV = v0 + h * (0.3 + r() * 0.4);
                        const gapU = u0 + w * (0.1 + r() * 0.8);
                        const gapSize = w * 0.15;
                        drawUV([[u0, wallV], [Math.max(u0, gapU - gapSize), wallV]], 'line');
                        drawUV([[Math.min(u1, gapU + gapSize), wallV], [u1, wallV]], 'line');
                        drawDivision(u0, v0, u1, wallV, depth - 1);
                        drawDivision(u0, wallV, u1, v1, depth - 1);
                    }

                    // Fill leaf chambers in filled mode
                    if (filled && depth === 1 && r() > 0.6) {
                        const inset = 0.02;
                        drawUV([
                            [u0 + inset, v0 + inset], [u1 - inset, v0 + inset],
                            [u1 - inset, v1 - inset], [u0 + inset, v1 - inset]
                        ], 'filled');
                    }
                };

                const depth = 3 + Math.floor(r() * 2);
                drawDivision(0, 0, 1, 1, depth);
                drawUV([[0, 0], [1, 0], [1, 1], [0, 1]], filled ? baseStyle : 'outline');
                break;
            }
        }
    }
};

export default mazePatterns;
