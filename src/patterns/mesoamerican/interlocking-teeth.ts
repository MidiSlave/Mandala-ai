// Interlocking Teeth
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    drawUV([[0, 0], [0.5, 0.75], [1, 0]], baseStyle);
    drawUV([[0, 1], [0.5, 0.25], [1, 1]], filled ? 'opaque-outline' : 'filled');
    if (!filled) {
        drawUV([[0.2, 0.3], [0.5, 0.55], [0.8, 0.3]], 'line');
        drawUV([[0.2, 0.7], [0.5, 0.45], [0.8, 0.7]], 'line');
    }
}
