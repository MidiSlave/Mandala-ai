// Quetzalcoatl Feather
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle }: PatternContext): void {
    drawUV([[0.5, 0.0], [0.5, 1.0]], 'line');
    const nBarbs = 5;
    for (let j = 0; j < nBarbs; j++) {
        const v = (j + 0.5) / nBarbs;
        const side = j % 2 === 0 ? 1 : -1;
        drawUV([
            [0.5, v],
            [0.5 + side * 0.15, v - 0.04],
            [0.5 + side * 0.35, v - 0.06],
            [0.5 + side * 0.45, v - 0.02]
        ], j % 3 === 0 ? baseStyle : 'line');
    }
}
