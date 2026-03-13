// Mayan Glyph Block
import type { PatternContext } from '../types';
import { circle } from './helpers';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    drawUV([[0.03, 0.03], [0.97, 0.03], [0.97, 0.97], [0.03, 0.97]], baseStyle);
    if (!filled) {
        drawUV([[0.15, 0.15], [0.85, 0.15], [0.85, 0.85], [0.15, 0.85]], 'outline');
        drawUV([[0.3, 0.3], [0.7, 0.3], [0.7, 0.7], [0.3, 0.7]], 'filled');
        drawUV(circle(0.5, 0.5, 0.06), 'opaque-outline');
    } else {
        drawUV([[0.2, 0.2], [0.8, 0.2], [0.8, 0.8], [0.2, 0.8]], 'opaque-outline');
        drawUV([[0.35, 0.35], [0.65, 0.35], [0.65, 0.65], [0.35, 0.65]], 'opaque-outline');
    }
}
