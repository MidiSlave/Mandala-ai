// Recursive square subdivision (Mondrian-ish)
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const drawRect = (
        x1: number, y1: number, x2: number, y2: number, depth: number
    ) => {
        if (depth <= 0 || (x2 - x1) < 0.08 || (y2 - y1) < 0.08) {
            drawUV([[x1, y1], [x2, y1], [x2, y2], [x1, y2]],
                r() > 0.6 ? baseStyle : 'outline');
            return;
        }
        const splitH = r() > 0.5;
        if (splitH) {
            const split = x1 + (x2 - x1) * (0.3 + r() * 0.4);
            drawRect(x1, y1, split, y2, depth - 1);
            drawRect(split, y1, x2, y2, depth - 1);
        } else {
            const split = y1 + (y2 - y1) * (0.3 + r() * 0.4);
            drawRect(x1, y1, x2, split, depth - 1);
            drawRect(x1, split, x2, y2, depth - 1);
        }
    };
    drawRect(0.05, 0.05, 0.95, 0.95, 2 + Math.floor(r() * 2));
}
