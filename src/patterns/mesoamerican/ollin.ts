// Ollin (Movement)
import type { PatternContext } from '../types';
import { circle } from './helpers';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    drawUV([
        [0.5, 0.1], [0.7, 0.2], [0.9, 0.5], [0.7, 0.45], [0.55, 0.4]
    ], baseStyle);
    drawUV([
        [0.5, 0.9], [0.3, 0.8], [0.1, 0.5], [0.3, 0.55], [0.45, 0.6]
    ], baseStyle);
    drawUV([[0.4, 0.45], [0.6, 0.45], [0.6, 0.55], [0.4, 0.55]], filled ? 'opaque-outline' : 'filled');
    drawUV(circle(0.5, 0.5, 0.04), 'filled');
}
