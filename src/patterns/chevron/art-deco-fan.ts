// Art Deco fan chevron — sunburst radiating from bottom center
import type { PatternContext } from '../types';
import { arcBand } from './helpers';

export function draw({ drawUV, filled }: PatternContext): void {
    const cx = 0.5;
    const cy = 0;
    const numRays = 7;
    const arcV = 0.9;
    const fanHalfAngle = Math.PI * 0.42;
    const arcSegments = 24;
    const bandHalf = 0.025;

    const rayTips: [number, number][] = [];
    for (let i = 0; i < numRays; i++) {
        const t = i / (numRays - 1);
        const angle = -fanHalfAngle + t * 2 * fanHalfAngle;
        const tipU = cx + Math.sin(angle) * arcV;
        const tipV = cy + Math.cos(angle) * arcV;
        rayTips.push([tipU, tipV]);

        const perpU = Math.cos(angle) * bandHalf;
        const perpV = -Math.sin(angle) * bandHalf;
        drawUV([
            [cx - perpU, cy - perpV], [tipU - perpU, tipV - perpV],
            [tipU + perpU, tipV + perpV], [cx + perpU, cy + perpV]
        ], 'filled');
    }

    for (let i = 0; i < numRays - 1; i++) {
        if (i % 2 === 0) {
            drawUV([[cx, cy], rayTips[i], rayTips[i + 1]], filled ? 'filled' : 'outline');
        }
    }

    drawUV(arcBand(cx, cy, arcV - 0.025, arcV + 0.025, -fanHalfAngle, fanHalfAngle, arcSegments), 'filled');

    const innerArcV = 0.6;
    drawUV(arcBand(cx, cy, innerArcV - 0.02, innerArcV + 0.02, -fanHalfAngle, fanHalfAngle, arcSegments), 'filled');

    const baseArcV = 0.3;
    drawUV(arcBand(cx, cy, baseArcV - 0.018, baseArcV + 0.018, -fanHalfAngle, fanHalfAngle, arcSegments), 'filled');

    drawUV([[0.43, 0], [0.45, 0.08], [0.50, 0.11], [0.55, 0.08], [0.57, 0]], 'filled');
}
