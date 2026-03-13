// Tree branching
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const drawBranch = (
        x: number, y: number, angle: number,
        length: number, depth: number
    ) => {
        if (depth <= 0 || length < 0.02) return;
        const ex = x + Math.cos(angle) * length;
        const ey = y + Math.sin(angle) * length;
        drawUV([[x, y], [ex, ey]], depth > 1 ? 'line' : baseStyle);
        const spread = 0.4 + r() * 0.4;
        const shrink = 0.6 + r() * 0.15;
        drawBranch(ex, ey, angle - spread, length * shrink, depth - 1);
        drawBranch(ex, ey, angle + spread, length * shrink, depth - 1);
    };
    const depth = 3 + Math.floor(r() * 2);
    drawBranch(0.5, 0.95, -Math.PI / 2, 0.3, depth);
}
