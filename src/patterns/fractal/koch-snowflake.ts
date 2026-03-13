// Koch snowflake edge
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const kochEdge = (
        x1: number, y1: number, x2: number, y2: number,
        depth: number, pts: [number, number][]
    ) => {
        if (depth <= 0) {
            pts.push([x2, y2]);
            return;
        }
        const dx = x2 - x1, dy = y2 - y1;
        const ax = x1 + dx / 3, ay = y1 + dy / 3;
        const bx = x1 + dx * 2 / 3, by = y1 + dy * 2 / 3;
        // Peak point rotated 60 degrees
        const px = (ax + bx) / 2 - (by - ay) * Math.sqrt(3) / 2;
        const py = (ay + by) / 2 + (bx - ax) * Math.sqrt(3) / 2;
        kochEdge(x1, y1, ax, ay, depth - 1, pts);
        kochEdge(ax, ay, px, py, depth - 1, pts);
        kochEdge(px, py, bx, by, depth - 1, pts);
        kochEdge(bx, by, x2, y2, depth - 1, pts);
    };
    const depth = 2 + Math.floor(r());
    const pts: [number, number][] = [[0.05, 0.7]];
    kochEdge(0.05, 0.7, 0.95, 0.7, depth, pts);
    drawUV(pts, baseStyle);
    // Mirror below
    const pts2: [number, number][] = [[0.05, 0.3]];
    kochEdge(0.05, 0.3, 0.95, 0.3, depth, pts2);
    drawUV(pts2, filled ? 'outline' : baseStyle);
}
