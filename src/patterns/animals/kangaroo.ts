// Kangaroo — side view with powerful hind legs, small arms, long tail, joey pouch
import type { PatternContext } from '../types';

export function draw({ drawUV, filled }: PatternContext): void {
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // Body — large oval torso, upright posture
    drawUV([
        [0.42, 0.30], [0.48, 0.26], [0.54, 0.24], [0.60, 0.26],
        [0.64, 0.32], [0.66, 0.40], [0.66, 0.50], [0.64, 0.58],
        [0.60, 0.64], [0.54, 0.66], [0.48, 0.66], [0.42, 0.64],
        [0.38, 0.58], [0.36, 0.50], [0.36, 0.40], [0.38, 0.34]
    ], mainStyle);

    // Head — small relative to body
    const headPts: [number, number][] = [];
    for (let i = 0; i <= 12; i++) {
        const t = (i / 12) * Math.PI * 2;
        headPts.push([0.56 + Math.cos(t) * 0.06, 0.16 + Math.sin(t) * 0.05]);
    }
    drawUV(headPts, mainStyle);

    // Neck connecting head to body
    drawUV([
        [0.52, 0.20], [0.50, 0.24], [0.48, 0.26],
        [0.54, 0.26], [0.56, 0.24], [0.58, 0.20]
    ], mainStyle);

    // Snout / muzzle — elongated
    drawUV([
        [0.62, 0.15], [0.68, 0.14], [0.72, 0.15],
        [0.72, 0.18], [0.68, 0.19], [0.62, 0.18]
    ], mainStyle);

    // Ears — tall, pointed
    drawUV([
        [0.52, 0.12], [0.53, 0.04], [0.55, 0.03], [0.57, 0.05], [0.56, 0.12]
    ], mainStyle);
    drawUV([
        [0.57, 0.11], [0.59, 0.03], [0.61, 0.02], [0.63, 0.04], [0.62, 0.11]
    ], mainStyle);

    // Inner ears
    drawUV([
        [0.53, 0.10], [0.54, 0.05], [0.55, 0.05], [0.56, 0.10]
    ], detailStyle);
    drawUV([
        [0.58, 0.09], [0.60, 0.04], [0.61, 0.04], [0.62, 0.09]
    ], detailStyle);

    // Eye
    drawUV([[0.60, 0.14], [0.61, 0.13], [0.62, 0.14], [0.61, 0.15]], detailStyle);

    // Nose
    drawUV([[0.71, 0.15], [0.73, 0.16], [0.71, 0.17]], detailStyle);

    // Pouch — curved line on belly
    drawUV([
        [0.48, 0.48], [0.50, 0.54], [0.54, 0.56],
        [0.58, 0.54], [0.60, 0.48]
    ], 'line');

    // Joey head peeking out of pouch
    const joeyPts: [number, number][] = [];
    for (let i = 0; i <= 8; i++) {
        const t = (i / 8) * Math.PI * 2;
        joeyPts.push([0.54 + Math.cos(t) * 0.03, 0.48 + Math.sin(t) * 0.025]);
    }
    drawUV(joeyPts, detailStyle);

    // Joey ears — tiny
    drawUV([[0.52, 0.46], [0.52, 0.44], [0.53, 0.44], [0.53, 0.46]], detailStyle);
    drawUV([[0.55, 0.46], [0.55, 0.44], [0.56, 0.44], [0.56, 0.46]], detailStyle);

    // Joey eye
    drawUV([[0.54, 0.47], [0.55, 0.47]], 'line');

    // Small front arms — short, T-rex-like
    drawUV([
        [0.60, 0.34], [0.64, 0.36], [0.68, 0.38],
        [0.70, 0.40], [0.68, 0.42], [0.64, 0.40], [0.60, 0.38]
    ], mainStyle);

    // Tiny paw on arm
    drawUV([[0.69, 0.39], [0.72, 0.40], [0.70, 0.42]], detailStyle);

    // Powerful hind legs — large thigh, long foot
    // Right hind leg (front-facing)
    drawUV([
        [0.50, 0.62], [0.52, 0.68], [0.54, 0.74],
        [0.56, 0.80], [0.60, 0.82], [0.68, 0.82],
        [0.70, 0.80], [0.68, 0.78], [0.60, 0.78],
        [0.56, 0.76], [0.52, 0.70], [0.48, 0.64]
    ], mainStyle);

    // Left hind leg (behind)
    drawUV([
        [0.46, 0.64], [0.44, 0.70], [0.44, 0.76],
        [0.46, 0.82], [0.50, 0.84], [0.58, 0.84],
        [0.60, 0.82], [0.58, 0.80], [0.50, 0.80],
        [0.46, 0.78], [0.42, 0.72], [0.42, 0.66]
    ], mainStyle);

    // Big feet — elongated
    drawUV([
        [0.60, 0.78], [0.68, 0.78], [0.72, 0.80], [0.70, 0.82], [0.60, 0.82]
    ], detailStyle);
    drawUV([
        [0.50, 0.80], [0.58, 0.80], [0.62, 0.82], [0.60, 0.84], [0.50, 0.84]
    ], detailStyle);

    // Tail — long, thick, tapering, used for balance
    drawUV([
        [0.40, 0.58], [0.34, 0.62], [0.28, 0.68],
        [0.22, 0.74], [0.16, 0.78], [0.12, 0.80],
        [0.10, 0.78], [0.14, 0.74], [0.20, 0.68],
        [0.26, 0.62], [0.32, 0.56], [0.38, 0.54]
    ], mainStyle);
}
