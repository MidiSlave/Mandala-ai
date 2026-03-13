// Stepped Pyramid (Chakana)
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    drawUV([
        [0, 0], [0.15, 0], [0.15, 0.15], [0.3, 0.15],
        [0.3, 0.35], [0.45, 0.35], [0.45, 0.55],
        [0.55, 0.55], [0.55, 0.75], [0.7, 0.75],
        [0.7, 0.85], [0.85, 0.85], [0.85, 1], [1, 1], [1, 0]
    ], baseStyle);
    if (!filled) {
        drawUV([[0.25, 0.2], [0.4, 0.2], [0.4, 0.4], [0.55, 0.4]], 'line');
    }
}
