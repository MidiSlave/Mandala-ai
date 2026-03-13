// Aztec Fret
import type { PatternContext } from '../types';

export function draw({ drawUV, filled }: PatternContext): void {
    if (filled) {
        drawUV([
            [0, 0], [0.85, 0], [0.85, 0.85], [0.15, 0.85],
            [0.15, 0.3], [0.55, 0.3], [0.55, 0.55], [0.35, 0.55],
            [0.35, 0.15], [1.0, 0.15], [1.0, 1.0], [0, 1.0]
        ], 'filled');
        drawUV([[0.4, 0.38], [0.5, 0.38], [0.5, 0.48], [0.4, 0.48]], 'opaque-outline');
    } else {
        drawUV([
            [0.05, 0.05], [0.95, 0.05], [0.95, 0.95],
            [0.25, 0.95], [0.25, 0.35], [0.75, 0.35],
            [0.75, 0.65], [0.45, 0.65]
        ], 'line');
        drawUV([[0.05, 0.05], [0.05, 0.95]], 'line');
    }
}
