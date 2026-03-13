// Sierpinski triangle
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const drawTri = (
        ax: number, ay: number, bx: number, by: number,
        cx: number, cy: number, depth: number
    ) => {
        if (depth <= 0) {
            drawUV([[ax, ay], [bx, by], [cx, cy]], r() > 0.5 ? baseStyle : 'outline');
            return;
        }
        const mx1 = (ax + bx) / 2, my1 = (ay + by) / 2;
        const mx2 = (bx + cx) / 2, my2 = (by + cy) / 2;
        const mx3 = (ax + cx) / 2, my3 = (ay + cy) / 2;
        drawTri(ax, ay, mx1, my1, mx3, my3, depth - 1);
        drawTri(mx1, my1, bx, by, mx2, my2, depth - 1);
        drawTri(mx3, my3, mx2, my2, cx, cy, depth - 1);
        // Central triangle is empty (the sierpinski hole)
    };
    const depth = 2 + Math.floor(r() * 2);
    drawTri(0.05, 0.95, 0.95, 0.95, 0.5, 0.05, depth);
}
