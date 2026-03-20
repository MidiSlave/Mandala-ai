// Rat — side view with long tail
import type { PatternContext } from '../types';

export function draw({ drawUV, filled }: PatternContext): void {
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // Body — plump oval
    const bodyPts: [number, number][] = [];
    for (let i = 0; i <= 14; i++) {
        const t = (i / 14) * Math.PI * 2;
        bodyPts.push([0.50 + Math.cos(t) * 0.18, 0.50 + Math.sin(t) * 0.13]);
    }
    drawUV(bodyPts, mainStyle);

    // Head — pointed snout
    drawUV([
        [0.68, 0.44], [0.75, 0.40], [0.82, 0.38],
        [0.88, 0.40], [0.90, 0.44], [0.88, 0.48],
        [0.82, 0.50], [0.75, 0.50], [0.68, 0.48]
    ], mainStyle);

    // Ear — large round
    const earPts: [number, number][] = [];
    for (let i = 0; i <= 10; i++) {
        const t = (i / 10) * Math.PI * 2;
        earPts.push([0.76 + Math.cos(t) * 0.04, 0.35 + Math.sin(t) * 0.05]);
    }
    drawUV(earPts, mainStyle);

    // Inner ear
    const innerEarPts: [number, number][] = [];
    for (let i = 0; i <= 8; i++) {
        const t = (i / 8) * Math.PI * 2;
        innerEarPts.push([0.76 + Math.cos(t) * 0.025, 0.35 + Math.sin(t) * 0.032]);
    }
    drawUV(innerEarPts, detailStyle);

    // Eye
    drawUV([[0.82, 0.41], [0.83, 0.40], [0.84, 0.41], [0.83, 0.42]], detailStyle);

    // Nose
    drawUV([[0.89, 0.43], [0.90, 0.42], [0.91, 0.43], [0.90, 0.44]], detailStyle);

    // Whiskers
    drawUV([[0.86, 0.43], [0.94, 0.40]], 'line');
    drawUV([[0.86, 0.45], [0.94, 0.44]], 'line');
    drawUV([[0.86, 0.47], [0.94, 0.48]], 'line');

    // Front legs — small
    drawUV([[0.58, 0.60], [0.58, 0.72], [0.61, 0.72], [0.61, 0.60]], mainStyle);
    drawUV([[0.63, 0.58], [0.63, 0.70], [0.66, 0.70], [0.66, 0.58]], mainStyle);

    // Back legs — larger haunches
    drawUV([[0.36, 0.58], [0.34, 0.72], [0.38, 0.74], [0.41, 0.72], [0.40, 0.58]], mainStyle);

    // Paws
    drawUV([[0.57, 0.71], [0.57, 0.74], [0.62, 0.74], [0.62, 0.71]], detailStyle);
    drawUV([[0.33, 0.72], [0.33, 0.76], [0.39, 0.76], [0.39, 0.72]], detailStyle);

    // Tail — long curving line
    drawUV([
        [0.32, 0.50], [0.22, 0.48], [0.14, 0.42],
        [0.08, 0.38], [0.05, 0.35], [0.04, 0.30]
    ], 'line');
}
