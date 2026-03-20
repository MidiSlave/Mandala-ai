// Elephant — side view with trunk and tusks
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // Body — large rounded rectangle
    drawUV([
        [0.20, 0.30], [0.75, 0.30], [0.78, 0.35],
        [0.78, 0.60], [0.75, 0.65], [0.20, 0.65],
        [0.17, 0.60], [0.17, 0.35]
    ], mainStyle);

    // Head — front bulge
    const headPts: [number, number][] = [];
    for (let i = 0; i <= 12; i++) {
        const t = -Math.PI / 2 + (i / 12) * Math.PI;
        headPts.push([0.78 + Math.cos(t) * 0.12, 0.40 + Math.sin(t) * 0.15]);
    }
    drawUV(headPts, mainStyle);

    // Ear — large fan shape
    drawUV([
        [0.72, 0.28], [0.68, 0.22], [0.62, 0.20],
        [0.58, 0.24], [0.60, 0.35], [0.65, 0.42],
        [0.70, 0.40]
    ], mainStyle);

    // Inner ear
    drawUV([
        [0.70, 0.30], [0.66, 0.26], [0.63, 0.28],
        [0.64, 0.36], [0.68, 0.38]
    ], detailStyle);

    // Eye
    const eyePts: [number, number][] = [];
    for (let i = 0; i <= 10; i++) {
        const t = (i / 10) * Math.PI * 2;
        eyePts.push([0.82, 0.35].map((v, j) => v + Math.cos(t + j * Math.PI / 2) * 0.015) as [number, number]);
    }
    drawUV([[0.81, 0.34], [0.83, 0.34], [0.83, 0.36], [0.81, 0.36]], detailStyle);

    // Trunk — curving down and forward
    drawUV([
        [0.88, 0.45], [0.90, 0.52], [0.88, 0.62],
        [0.84, 0.72], [0.78, 0.78], [0.74, 0.80],
        [0.72, 0.78], [0.76, 0.74], [0.80, 0.68],
        [0.84, 0.58], [0.86, 0.48], [0.85, 0.43]
    ], mainStyle);

    // Tusk
    drawUV([
        [0.84, 0.50], [0.87, 0.56], [0.86, 0.60], [0.83, 0.55]
    ], detailStyle);

    // Front legs
    drawUV([[0.62, 0.65], [0.62, 0.90], [0.68, 0.90], [0.68, 0.65]], mainStyle);
    drawUV([[0.52, 0.65], [0.52, 0.88], [0.58, 0.88], [0.58, 0.65]], mainStyle);

    // Back legs
    drawUV([[0.28, 0.65], [0.28, 0.90], [0.34, 0.90], [0.34, 0.65]], mainStyle);
    drawUV([[0.20, 0.65], [0.20, 0.88], [0.26, 0.88], [0.26, 0.65]], mainStyle);

    // Tail
    drawUV([[0.17, 0.38], [0.12, 0.32], [0.10, 0.28]], 'line');
    drawUV([[0.10, 0.26], [0.08, 0.28], [0.12, 0.30]], 'line'); // tuft
}
