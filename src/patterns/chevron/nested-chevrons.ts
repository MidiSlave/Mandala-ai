// Thick nested chevrons — 3 nested V-bands with alternating fill
import type { PatternContext } from '../types';
import { bandFromPolyline } from './helpers';

export function draw({ drawUV }: PatternContext): void {
    drawUV([
        [0, 0.05], [0.5, 0.95], [1, 0.05],
        [1, 0.17], [0.5, 0.83], [0, 0.17]
    ], 'filled');

    drawUV([
        [0.15, 0.15], [0.5, 0.80], [0.85, 0.15],
        [0.85, 0.27], [0.5, 0.68], [0.15, 0.27]
    ], 'opaque-outline');

    drawUV([
        [0.30, 0.25], [0.5, 0.65], [0.70, 0.25],
        [0.70, 0.37], [0.5, 0.53], [0.30, 0.37]
    ], 'filled');

    drawUV(bandFromPolyline([
        [0.08, 0.12], [0.5, 0.88], [0.92, 0.12]
    ], 0.015), 'filled');
    drawUV(bandFromPolyline([
        [0.22, 0.22], [0.5, 0.73], [0.78, 0.22]
    ], 0.015), 'filled');

    drawUV(bandFromPolyline([
        [0.38, 0.30], [0.5, 0.48], [0.62, 0.30]
    ], 0.012), 'filled');
}
