// Sitting cat silhouette — upright cat with pointed ears and curled tail
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // Body — oval torso
    const bodyPts: [number, number][] = [];
    for (let i = 0; i <= 16; i++) {
        const t = (i / 16) * Math.PI * 2;
        bodyPts.push([0.5 + Math.cos(t) * 0.15, 0.55 + Math.sin(t) * 0.22]);
    }
    drawUV(bodyPts, mainStyle);

    // Head — circle
    const headPts: [number, number][] = [];
    for (let i = 0; i <= 16; i++) {
        const t = (i / 16) * Math.PI * 2;
        headPts.push([0.5 + Math.cos(t) * 0.1, 0.22 + Math.sin(t) * 0.09]);
    }
    drawUV(headPts, mainStyle);

    // Left ear
    drawUV([[0.42, 0.18], [0.38, 0.06], [0.45, 0.14]], mainStyle);
    // Right ear
    drawUV([[0.58, 0.18], [0.62, 0.06], [0.55, 0.14]], mainStyle);

    // Inner ears
    drawUV([[0.43, 0.16], [0.40, 0.09], [0.45, 0.15]], detailStyle);
    drawUV([[0.57, 0.16], [0.60, 0.09], [0.55, 0.15]], detailStyle);

    // Eyes
    drawUV([[0.45, 0.20], [0.44, 0.22], [0.46, 0.22]], detailStyle);
    drawUV([[0.55, 0.20], [0.54, 0.22], [0.56, 0.22]], detailStyle);

    // Nose
    drawUV([[0.49, 0.25], [0.50, 0.27], [0.51, 0.25]], detailStyle);

    // Whiskers
    drawUV([[0.42, 0.24], [0.30, 0.22]], 'line');
    drawUV([[0.42, 0.25], [0.30, 0.26]], 'line');
    drawUV([[0.58, 0.24], [0.70, 0.22]], 'line');
    drawUV([[0.58, 0.25], [0.70, 0.26]], 'line');

    // Front legs
    drawUV([[0.42, 0.70], [0.42, 0.88], [0.46, 0.88], [0.46, 0.70]], mainStyle);
    drawUV([[0.54, 0.70], [0.54, 0.88], [0.58, 0.88], [0.58, 0.70]], mainStyle);

    // Paws
    drawUV([[0.41, 0.86], [0.41, 0.90], [0.47, 0.90], [0.47, 0.86]], mainStyle);
    drawUV([[0.53, 0.86], [0.53, 0.90], [0.59, 0.90], [0.59, 0.86]], mainStyle);

    // Tail — curving to the right
    drawUV([
        [0.62, 0.65], [0.70, 0.55], [0.75, 0.40],
        [0.72, 0.30], [0.68, 0.28]
    ], 'line');
}
