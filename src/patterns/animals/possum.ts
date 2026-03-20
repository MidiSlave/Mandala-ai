// Possum (opossum) — side view with pointy face and prehensile tail
import type { PatternContext } from '../types';

export function draw({ drawUV, filled }: PatternContext): void {
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // Body — rounded
    const bodyPts: [number, number][] = [];
    for (let i = 0; i <= 14; i++) {
        const t = (i / 14) * Math.PI * 2;
        bodyPts.push([0.48 + Math.cos(t) * 0.20, 0.50 + Math.sin(t) * 0.14]);
    }
    drawUV(bodyPts, mainStyle);

    // Head — pointed snout
    drawUV([
        [0.68, 0.42], [0.74, 0.38], [0.82, 0.36],
        [0.88, 0.38], [0.92, 0.42], [0.92, 0.46],
        [0.88, 0.50], [0.82, 0.52], [0.74, 0.50],
        [0.68, 0.48]
    ], mainStyle);

    // Ears — large, rounded, naked
    const leftEar: [number, number][] = [];
    const rightEar: [number, number][] = [];
    for (let i = 0; i <= 8; i++) {
        const t = (i / 8) * Math.PI * 2;
        leftEar.push([0.77 + Math.cos(t) * 0.03, 0.32 + Math.sin(t) * 0.04]);
        rightEar.push([0.85 + Math.cos(t) * 0.03, 0.30 + Math.sin(t) * 0.04]);
    }
    drawUV(leftEar, mainStyle);
    drawUV(rightEar, mainStyle);

    // Inner ears
    const leftInner: [number, number][] = [];
    const rightInner: [number, number][] = [];
    for (let i = 0; i <= 6; i++) {
        const t = (i / 6) * Math.PI * 2;
        leftInner.push([0.77 + Math.cos(t) * 0.018, 0.32 + Math.sin(t) * 0.025]);
        rightInner.push([0.85 + Math.cos(t) * 0.018, 0.30 + Math.sin(t) * 0.025]);
    }
    drawUV(leftInner, detailStyle);
    drawUV(rightInner, detailStyle);

    // Eye — beady
    drawUV([[0.83, 0.40], [0.84, 0.39], [0.85, 0.40], [0.84, 0.41]], detailStyle);

    // Pink nose
    drawUV([[0.91, 0.42], [0.93, 0.43], [0.91, 0.44]], detailStyle);

    // Mouth line
    drawUV([[0.88, 0.46], [0.92, 0.44]], 'line');

    // Whiskers
    drawUV([[0.88, 0.42], [0.96, 0.39]], 'line');
    drawUV([[0.88, 0.44], [0.96, 0.43]], 'line');
    drawUV([[0.88, 0.46], [0.96, 0.47]], 'line');

    // Fur texture on body — short strokes
    for (let i = 0; i < 8; i++) {
        const u = 0.35 + i * 0.04;
        const v = 0.44 + (i % 3) * 0.04;
        drawUV([[u, v], [u + 0.02, v - 0.01]], 'line');
    }

    // Front legs — short
    drawUV([[0.56, 0.62], [0.56, 0.76], [0.60, 0.76], [0.60, 0.62]], mainStyle);
    drawUV([[0.62, 0.60], [0.62, 0.74], [0.66, 0.74], [0.66, 0.60]], mainStyle);

    // Back legs
    drawUV([[0.34, 0.60], [0.34, 0.76], [0.38, 0.76], [0.38, 0.60]], mainStyle);
    drawUV([[0.28, 0.62], [0.28, 0.74], [0.32, 0.74], [0.32, 0.62]], mainStyle);

    // Paws with tiny fingers
    drawUV([[0.55, 0.75], [0.55, 0.78], [0.61, 0.78], [0.61, 0.75]], detailStyle);
    drawUV([[0.33, 0.75], [0.33, 0.78], [0.39, 0.78], [0.39, 0.75]], detailStyle);

    // Tail — long, prehensile, curling
    drawUV([
        [0.28, 0.50], [0.18, 0.48], [0.12, 0.42],
        [0.08, 0.38], [0.06, 0.35], [0.08, 0.30],
        [0.12, 0.28], [0.14, 0.30]
    ], 'line');
}
