// Herringbone weave — interlocking parallelograms with seam bands
import type { PatternContext } from '../types';
import { bandFromPolyline } from './helpers';

export function draw({ drawUV, filled }: PatternContext): void {
    drawUV([
        [0, 0], [0.5, 0.5], [0.5, 1], [0, 0.5]
    ], filled ? 'filled' : 'outline');

    drawUV([
        [0.5, 0.5], [1, 0], [1, 0.5], [0.5, 1]
    ], filled ? 'opaque-outline' : 'outline');

    const sw = 0.015;
    drawUV(bandFromPolyline([[0, 0.5], [0.5, 1]], sw), 'filled');
    drawUV(bandFromPolyline([[0.5, 0], [0, 0.5]], sw), 'filled');
    drawUV(bandFromPolyline([[0.5, 0.5], [1, 0]], sw), 'filled');
    drawUV(bandFromPolyline([[1, 0.5], [0.5, 1]], sw), 'filled');

    drawUV([
        [0.5 - sw, 0], [0.5 + sw, 0],
        [0.5 + sw, 1], [0.5 - sw, 1]
    ], 'filled');

    drawUV([
        [0, 0.5 - sw], [1, 0.5 - sw],
        [1, 0.5 + sw], [0, 0.5 + sw]
    ], 'filled');

    drawUV(bandFromPolyline([[0.1, 0.15], [0.4, 0.65]], 0.02), 'filled');
    drawUV(bandFromPolyline([[0.1, 0.35], [0.3, 0.75]], 0.02), 'filled');

    drawUV(bandFromPolyline([[0.6, 0.65], [0.9, 0.15]], 0.02), 'filled');
    drawUV(bandFromPolyline([[0.7, 0.75], [0.9, 0.35]], 0.02), 'filled');
}
