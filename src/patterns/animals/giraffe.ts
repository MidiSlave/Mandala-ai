// Giraffe — tall with distinctive spotted pattern, long neck, and ossicones
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // Body — larger, rounder barrel shape
    drawUV([
        [0.20, 0.50], [0.22, 0.47], [0.35, 0.44],
        [0.55, 0.44], [0.65, 0.47], [0.68, 0.50],
        [0.68, 0.65], [0.65, 0.70], [0.55, 0.72],
        [0.35, 0.72], [0.22, 0.70], [0.20, 0.65]
    ], mainStyle);

    // Neck — long, slightly curved, tapering upward
    drawUV([
        [0.56, 0.47], [0.54, 0.30], [0.53, 0.18],
        [0.54, 0.10], [0.58, 0.08], [0.64, 0.08],
        [0.68, 0.10], [0.69, 0.18], [0.68, 0.30],
        [0.67, 0.47]
    ], mainStyle);

    // Head — elongated muzzle shape
    drawUV([
        [0.52, 0.08], [0.52, 0.02], [0.56, 0.00],
        [0.66, 0.00], [0.72, 0.02], [0.74, 0.06],
        [0.74, 0.10], [0.70, 0.12], [0.56, 0.12]
    ], mainStyle);

    // Muzzle detail
    drawUV([
        [0.70, 0.04], [0.74, 0.06], [0.74, 0.09],
        [0.71, 0.10]
    ], detailStyle);

    // Ossicones (horn-like bumps with round tips)
    drawUV([[0.58, 0.02], [0.56, -0.03], [0.58, -0.04], [0.60, -0.03], [0.60, 0.02]], mainStyle);
    drawUV([[0.65, 0.02], [0.63, -0.03], [0.65, -0.04], [0.67, -0.03], [0.67, 0.02]], mainStyle);

    // Ears — leaf-shaped
    drawUV([[0.52, 0.04], [0.48, 0.01], [0.47, 0.05], [0.50, 0.08]], mainStyle);
    drawUV([[0.72, 0.04], [0.76, 0.01], [0.77, 0.05], [0.74, 0.08]], mainStyle);

    // Eye — almond shaped
    drawUV([[0.66, 0.05], [0.68, 0.04], [0.70, 0.05], [0.68, 0.07]], detailStyle);

    // Mane — short ridge along back of neck
    for (let i = 0; i < 6; i++) {
        const nv = 0.12 + i * 0.06;
        const nx = 0.54 - i * 0.002;
        drawUV([[nx, nv], [nx - 0.03, nv - 0.01], [nx - 0.02, nv + 0.01]], mainStyle);
    }

    // Irregular patch spots on body (giraffe's distinctive pattern)
    const bodySpots: [number, number, number, number][] = [
        [0.30, 0.53, 0.05, 0.04], [0.42, 0.50, 0.06, 0.05],
        [0.55, 0.53, 0.04, 0.04], [0.35, 0.62, 0.05, 0.05],
        [0.48, 0.62, 0.06, 0.04], [0.60, 0.60, 0.04, 0.05],
        [0.25, 0.58, 0.04, 0.03], [0.42, 0.68, 0.04, 0.03]
    ];
    for (const [su, sv, sw, sh] of bodySpots) {
        const npts = 8;
        const spotPts: [number, number][] = [];
        for (let i = 0; i <= npts; i++) {
            const t = (i / npts) * Math.PI * 2;
            const wobble = 1 + (r() - 0.5) * 0.4;
            spotPts.push([
                su + Math.cos(t) * sw * wobble,
                sv + Math.sin(t) * sh * wobble
            ]);
        }
        drawUV(spotPts, detailStyle);
    }

    // Spots on neck — smaller, following the neck contour
    for (let i = 0; i < 5; i++) {
        const nv = 0.14 + i * 0.07;
        const nu = 0.60 + (r() - 0.5) * 0.04;
        const spotPts: [number, number][] = [];
        for (let j = 0; j <= 7; j++) {
            const t = (j / 7) * Math.PI * 2;
            const wobble = 1 + (r() - 0.5) * 0.3;
            spotPts.push([
                nu + Math.cos(t) * 0.025 * wobble,
                nv + Math.sin(t) * 0.02 * wobble
            ]);
        }
        drawUV(spotPts, detailStyle);
    }

    // Front legs — longer, slightly tapered
    drawUV([[0.56, 0.72], [0.55, 0.88], [0.58, 0.90], [0.61, 0.90], [0.62, 0.88], [0.60, 0.72]], mainStyle);
    drawUV([[0.48, 0.72], [0.47, 0.86], [0.50, 0.88], [0.53, 0.88], [0.54, 0.86], [0.52, 0.72]], mainStyle);

    // Back legs — with slight hock angle
    drawUV([[0.30, 0.72], [0.29, 0.82], [0.28, 0.88], [0.31, 0.90], [0.34, 0.90], [0.34, 0.82], [0.33, 0.72]], mainStyle);
    drawUV([[0.22, 0.72], [0.21, 0.80], [0.20, 0.86], [0.23, 0.88], [0.26, 0.88], [0.26, 0.80], [0.25, 0.72]], mainStyle);

    // Hooves — darker patches at feet
    drawUV([[0.55, 0.88], [0.55, 0.92], [0.62, 0.92], [0.62, 0.88]], detailStyle);
    drawUV([[0.47, 0.86], [0.47, 0.90], [0.54, 0.90], [0.54, 0.86]], detailStyle);
    drawUV([[0.28, 0.88], [0.28, 0.92], [0.35, 0.92], [0.35, 0.88]], detailStyle);
    drawUV([[0.20, 0.86], [0.20, 0.90], [0.27, 0.90], [0.27, 0.86]], detailStyle);

    // Tail — long with tuft at end
    drawUV([[0.20, 0.55], [0.15, 0.48], [0.12, 0.43], [0.10, 0.40]], 'line');
    // Tail tuft — bushy end
    drawUV([[0.10, 0.38], [0.08, 0.40], [0.09, 0.43], [0.12, 0.42]], mainStyle);
}
