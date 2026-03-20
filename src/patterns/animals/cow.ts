// Cow — side view with Holstein-style spots, udder, and curved horns
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // Body — large barrel-shaped torso
    drawUV([
        [0.14, 0.35], [0.18, 0.30], [0.40, 0.28],
        [0.60, 0.28], [0.70, 0.30], [0.73, 0.35],
        [0.73, 0.58], [0.70, 0.64], [0.60, 0.66],
        [0.40, 0.66], [0.18, 0.64], [0.14, 0.58]
    ], mainStyle);

    // Head — boxy cow head attached to body
    drawUV([
        [0.70, 0.26], [0.72, 0.22], [0.78, 0.20],
        [0.86, 0.22], [0.90, 0.26], [0.92, 0.32],
        [0.92, 0.44], [0.90, 0.50], [0.86, 0.52],
        [0.78, 0.52], [0.72, 0.50], [0.70, 0.44]
    ], mainStyle);

    // Snout / muzzle — lighter colored area
    drawUV([
        [0.84, 0.42], [0.88, 0.40], [0.92, 0.42],
        [0.93, 0.46], [0.92, 0.50], [0.88, 0.52],
        [0.84, 0.50], [0.83, 0.46]
    ], detailStyle);

    // Nostrils
    drawUV([[0.87, 0.46], [0.88, 0.45], [0.89, 0.46], [0.88, 0.47]], detailStyle);
    drawUV([[0.90, 0.46], [0.91, 0.45], [0.92, 0.46], [0.91, 0.47]], detailStyle);

    // Horns — curved upward and outward
    drawUV([
        [0.78, 0.22], [0.76, 0.16], [0.74, 0.11],
        [0.73, 0.08], [0.75, 0.08], [0.77, 0.12],
        [0.79, 0.18]
    ], mainStyle);
    drawUV([
        [0.86, 0.22], [0.88, 0.16], [0.90, 0.11],
        [0.91, 0.08], [0.89, 0.08], [0.87, 0.12],
        [0.85, 0.18]
    ], mainStyle);

    // Ears — floppy
    drawUV([[0.74, 0.24], [0.70, 0.20], [0.68, 0.22], [0.70, 0.28]], mainStyle);
    drawUV([[0.90, 0.24], [0.94, 0.20], [0.96, 0.22], [0.94, 0.28]], mainStyle);

    // Eye — expressive with lash line
    drawUV([[0.80, 0.30], [0.82, 0.29], [0.84, 0.30], [0.82, 0.32]], detailStyle);

    // Holstein-style irregular spots on body
    const spots: [number, number, number, number][] = [
        [0.28, 0.38, 0.07, 0.06], [0.45, 0.35, 0.06, 0.05],
        [0.58, 0.40, 0.05, 0.06], [0.35, 0.52, 0.08, 0.05],
        [0.52, 0.55, 0.06, 0.04], [0.22, 0.48, 0.05, 0.04],
        [0.65, 0.50, 0.04, 0.05]
    ];
    for (const [su, sv, sw, sh] of spots) {
        const spotPts: [number, number][] = [];
        const npts = 10;
        for (let i = 0; i <= npts; i++) {
            const t = (i / npts) * Math.PI * 2;
            const wobble = 1 + (r() - 0.5) * 0.5;
            spotPts.push([
                su + Math.cos(t) * sw * wobble,
                sv + Math.sin(t) * sh * wobble
            ]);
        }
        drawUV(spotPts, detailStyle);
    }

    // Udder — prominent with teats
    drawUV([
        [0.38, 0.66], [0.40, 0.70], [0.42, 0.74],
        [0.46, 0.75], [0.50, 0.74], [0.52, 0.70],
        [0.54, 0.66]
    ], mainStyle);
    // Teats
    drawUV([[0.43, 0.74], [0.43, 0.78], [0.45, 0.78], [0.45, 0.74]], detailStyle);
    drawUV([[0.48, 0.74], [0.48, 0.78], [0.50, 0.78], [0.50, 0.74]], detailStyle);

    // Front legs — sturdy
    drawUV([
        [0.58, 0.66], [0.57, 0.78], [0.57, 0.88],
        [0.60, 0.90], [0.64, 0.90], [0.65, 0.88],
        [0.65, 0.78], [0.64, 0.66]
    ], mainStyle);
    drawUV([
        [0.50, 0.66], [0.49, 0.76], [0.49, 0.86],
        [0.52, 0.88], [0.55, 0.88], [0.56, 0.86],
        [0.56, 0.76], [0.55, 0.66]
    ], mainStyle);

    // Back legs — with hock angle
    drawUV([
        [0.28, 0.66], [0.27, 0.74], [0.26, 0.82],
        [0.25, 0.88], [0.28, 0.90], [0.32, 0.90],
        [0.33, 0.88], [0.33, 0.78], [0.32, 0.66]
    ], mainStyle);
    drawUV([
        [0.18, 0.66], [0.17, 0.74], [0.16, 0.80],
        [0.15, 0.86], [0.18, 0.88], [0.22, 0.88],
        [0.23, 0.86], [0.23, 0.76], [0.22, 0.66]
    ], mainStyle);

    // Hooves — dark at bottom of legs
    drawUV([[0.56, 0.88], [0.56, 0.93], [0.66, 0.93], [0.66, 0.88]], detailStyle);
    drawUV([[0.48, 0.86], [0.48, 0.91], [0.57, 0.91], [0.57, 0.86]], detailStyle);
    drawUV([[0.24, 0.88], [0.24, 0.93], [0.34, 0.93], [0.34, 0.88]], detailStyle);
    drawUV([[0.14, 0.86], [0.14, 0.91], [0.24, 0.91], [0.24, 0.86]], detailStyle);

    // Tail — hanging down with bushy end
    drawUV([[0.14, 0.40], [0.10, 0.45], [0.08, 0.52], [0.07, 0.58]], 'line');
    // Tail tuft
    drawUV([[0.06, 0.56], [0.05, 0.60], [0.08, 0.62], [0.09, 0.58]], mainStyle);

    // Bell on neck (optional detail)
    drawUV([
        [0.72, 0.42], [0.73, 0.44], [0.74, 0.48],
        [0.72, 0.50], [0.70, 0.48], [0.71, 0.44]
    ], detailStyle);
}
