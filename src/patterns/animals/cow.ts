// Cow — side view with spots and horns
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // Body
    drawUV([
        [0.18, 0.35], [0.72, 0.35], [0.75, 0.38],
        [0.75, 0.62], [0.72, 0.65], [0.18, 0.65],
        [0.15, 0.62], [0.15, 0.38]
    ], mainStyle);

    // Head
    drawUV([
        [0.72, 0.30], [0.72, 0.55], [0.88, 0.55],
        [0.90, 0.50], [0.90, 0.35], [0.88, 0.30]
    ], mainStyle);

    // Horns
    drawUV([[0.78, 0.30], [0.76, 0.22], [0.74, 0.18], [0.77, 0.20]], mainStyle);
    drawUV([[0.86, 0.30], [0.88, 0.22], [0.90, 0.18], [0.87, 0.20]], mainStyle);

    // Ear
    drawUV([[0.74, 0.32], [0.70, 0.28], [0.72, 0.35]], mainStyle);

    // Eye
    drawUV([[0.82, 0.37], [0.84, 0.37], [0.84, 0.39], [0.82, 0.39]], detailStyle);

    // Nostril
    drawUV([[0.88, 0.47], [0.89, 0.47], [0.89, 0.49], [0.88, 0.49]], detailStyle);

    // Snout patch
    drawUV([
        [0.85, 0.44], [0.90, 0.44], [0.91, 0.52],
        [0.85, 0.52]
    ], detailStyle);

    // Spots on body
    const spots: [number, number, number][] = [
        [0.30, 0.45, 0.06], [0.50, 0.42, 0.05],
        [0.40, 0.55, 0.07], [0.60, 0.52, 0.04],
        [0.25, 0.58, 0.04]
    ];
    for (const [su, sv, sz] of spots) {
        const spotPts: [number, number][] = [];
        const npts = 8;
        for (let i = 0; i <= npts; i++) {
            const t = (i / npts) * Math.PI * 2;
            const wobble = 1 + (r() - 0.5) * 0.3;
            spotPts.push([su + Math.cos(t) * sz * wobble, sv + Math.sin(t) * sz * 0.7 * wobble]);
        }
        drawUV(spotPts, detailStyle);
    }

    // Udder
    drawUV([
        [0.38, 0.65], [0.42, 0.72], [0.48, 0.72], [0.52, 0.65]
    ], mainStyle);

    // Front legs
    drawUV([[0.60, 0.65], [0.60, 0.90], [0.65, 0.90], [0.65, 0.65]], mainStyle);
    drawUV([[0.52, 0.65], [0.52, 0.88], [0.57, 0.88], [0.57, 0.65]], mainStyle);

    // Back legs
    drawUV([[0.25, 0.65], [0.25, 0.90], [0.30, 0.90], [0.30, 0.65]], mainStyle);
    drawUV([[0.18, 0.65], [0.18, 0.88], [0.23, 0.88], [0.23, 0.65]], mainStyle);

    // Hooves
    drawUV([[0.59, 0.88], [0.59, 0.92], [0.66, 0.92], [0.66, 0.88]], detailStyle);
    drawUV([[0.24, 0.88], [0.24, 0.92], [0.31, 0.92], [0.31, 0.88]], detailStyle);

    // Tail
    drawUV([[0.15, 0.40], [0.10, 0.35], [0.08, 0.30]], 'line');
    drawUV([[0.07, 0.28], [0.06, 0.31], [0.09, 0.31]], 'line');
}
