// Sun Rays
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    drawUV([[0.05, 0], [0.95, 0], [0.5, 0.92]], baseStyle);
    if (!filled) {
        const hatchCount = 5;
        for (let h = 0; h < hatchCount; h++) {
            const t = (h + 1) / (hatchCount + 1);
            const left = 0.05 + (0.5 - 0.05) * t;
            const right = 0.95 - (0.95 - 0.5) * t;
            const v = t * 0.92;
            drawUV([[left, v], [right, v]], 'line');
        }
    } else {
        drawUV([[0.25, 0.15], [0.75, 0.15], [0.5, 0.65]], 'opaque-outline');
    }
}
