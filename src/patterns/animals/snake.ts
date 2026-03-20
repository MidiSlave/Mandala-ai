// Snake — sinuous S-curve with diamond pattern
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // Snake body — S-curve, built as thick ribbon
    const segments = 24;
    const thickness = 0.04;
    const topEdge: [number, number][] = [];
    const bottomEdge: [number, number][] = [];

    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const u = 0.08 + t * 0.84;
        const wave = Math.sin(t * Math.PI * 2.5) * 0.18;
        const v = 0.50 + wave;
        // Taper at tail end
        const taper = Math.min(1, (1 - t) * 4, t * 6);
        const w = thickness * taper;
        topEdge.push([u, v - w]);
        bottomEdge.push([u, v + w]);
    }

    // Combine into closed body shape
    const bodyPts: [number, number][] = [...topEdge, ...bottomEdge.reverse()];
    drawUV(bodyPts, mainStyle);

    // Diamond scale pattern along body
    for (let i = 1; i < segments - 1; i += 2) {
        const t = i / segments;
        const u = 0.08 + t * 0.84;
        const wave = Math.sin(t * Math.PI * 2.5) * 0.18;
        const v = 0.50 + wave;
        const taper = Math.min(1, (1 - t) * 4, t * 6);
        const sz = 0.025 * taper;
        if (sz > 0.008) {
            drawUV([
                [u, v - sz], [u + sz * 0.8, v],
                [u, v + sz], [u - sz * 0.8, v]
            ], detailStyle);
        }
    }

    // Head — triangular
    drawUV([
        [0.08, 0.46], [0.03, 0.48], [0.02, 0.50],
        [0.03, 0.52], [0.08, 0.54], [0.10, 0.50]
    ], mainStyle);

    // Eyes
    drawUV([[0.05, 0.48], [0.06, 0.47], [0.07, 0.48], [0.06, 0.49]], detailStyle);

    // Tongue — forked
    drawUV([[0.03, 0.50], [0.00, 0.49]], 'line');
    drawUV([[0.03, 0.50], [0.00, 0.51]], 'line');
}
