// Flower Rosette
import type { PatternContext } from '../types';
import { circlePoints, teardrop } from './helpers';

export function draw({ drawUV, filled }: PatternContext): void {
    const cx = 0.5;
    const cy = 0.5;
    const petalCount = 6;
    const petalLength = 0.35;
    const petalWidth = 0.1;

    for (let i = 0; i < petalCount; i++) {
        const angle = (2 * Math.PI * i) / petalCount - Math.PI / 2;
        const tipX = cx + petalLength * Math.cos(angle);
        const tipY = cy + petalLength * Math.sin(angle);

        const petal = teardrop(cx, cy, tipX, tipY, petalWidth, 6);

        if (filled) {
            if (i % 2 === 0) {
                drawUV(petal, 'filled');
            } else {
                drawUV(petal, 'opaque-outline');
            }
        } else {
            drawUV(petal, 'filled');
        }
    }

    drawUV(circlePoints(cx, cy, 0.06, 8), 'filled');
    drawUV(circlePoints(cx, cy, 0.42, 24), 'filled');

    for (let i = 0; i < petalCount; i++) {
        const angle = (2 * Math.PI * (i + 0.5)) / petalCount - Math.PI / 2;
        const dotX = cx + 0.2 * Math.cos(angle);
        const dotY = cy + 0.2 * Math.sin(angle);
        drawUV(circlePoints(dotX, dotY, 0.025, 6), 'filled');
    }
}
