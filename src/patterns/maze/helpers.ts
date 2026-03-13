// Generic maze generator using recursive backtracking on an adjacency graph
// Returns set of open wall keys "a-b" where a < b
export function generateMaze(numCells: number, neighbors: number[][], rng: () => number): Set<string> {
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
export function generateGridMaze(cols: number, rows: number, rng: () => number): { hWalls: boolean[][], vWalls: boolean[][] } {
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
