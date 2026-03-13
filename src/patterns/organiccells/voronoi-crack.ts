// Voronoi / crack cells — irregular tessellation
import type { PatternContext } from '../types';
import { circleUV } from './helpers';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const numPoints = 6 + Math.floor(r() * 5);
    const pts: [number, number][] = [];
    for (let i = 0; i < numPoints; i++) {
        pts.push([0.1 + r() * 0.8, 0.1 + r() * 0.8]);
    }

    // Approximate Voronoi by checking which region each grid point belongs to
    const gridSize = 20;
    const regions: number[][] = [];
    for (let gy = 0; gy < gridSize; gy++) {
        regions[gy] = [];
        for (let gx = 0; gx < gridSize; gx++) {
            const u = (gx + 0.5) / gridSize;
            const v = (gy + 0.5) / gridSize;
            let minDist = Infinity;
            let minIdx = 0;
            for (let i = 0; i < pts.length; i++) {
                const dx = u - pts[i][0];
                const dy = v - pts[i][1];
                const d = dx * dx + dy * dy;
                if (d < minDist) { minDist = d; minIdx = i; }
            }
            regions[gy][gx] = minIdx;
        }
    }

    // Draw edges where regions differ
    const cellW = 1.0 / gridSize;
    const cellH = 1.0 / gridSize;
    for (let gy = 0; gy < gridSize; gy++) {
        for (let gx = 0; gx < gridSize; gx++) {
            const u = gx * cellW;
            const v = gy * cellH;
            if (gx < gridSize - 1 && regions[gy][gx] !== regions[gy][gx + 1]) {
                drawUV([[u + cellW, v], [u + cellW, v + cellH]], 'line');
            }
            if (gy < gridSize - 1 && regions[gy][gx] !== regions[gy + 1][gx]) {
                drawUV([[u, v + cellH], [u + cellW, v + cellH]], 'line');
            }
        }
    }

    // Fill some cells and draw center points
    if (filled) {
        for (let i = 0; i < pts.length; i++) {
            drawUV(circleUV(pts[i][0], pts[i][1], 0.015, 6), i % 2 === 0 ? 'filled' : 'outline');
        }
    }
}
