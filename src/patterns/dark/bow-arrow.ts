// Bow and Arrow — recurve bow with nocked arrow
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // Bow limb — curved D-shape
    const bowOuter: [number, number][] = [];
    const bowInner: [number, number][] = [];
    for (let i = 0; i <= 20; i++) {
        const t = -0.8 + (i / 20) * 1.6;
        const curve = Math.cos(t * 0.9) * 0.22;
        bowOuter.push([0.30 + curve, 0.10 + (i / 20) * 0.80]);
        bowInner.push([0.30 + curve + 0.03, 0.10 + (i / 20) * 0.80]);
    }
    // Combine into closed shape for the bow limb
    drawUV([...bowOuter, ...bowInner.reverse()], mainStyle);

    // Bow grip — thicker middle section
    drawUV([
        [0.48, 0.44], [0.54, 0.44], [0.55, 0.46],
        [0.55, 0.54], [0.54, 0.56], [0.48, 0.56],
        [0.47, 0.54], [0.47, 0.46]
    ], mainStyle);

    // Grip wrapping
    drawUV([[0.48, 0.46], [0.54, 0.48]], 'line');
    drawUV([[0.48, 0.49], [0.54, 0.51]], 'line');
    drawUV([[0.48, 0.52], [0.54, 0.54]], 'line');

    // Bowstring — taut line from tip to tip
    drawUV([
        [0.38, 0.10], [0.48, 0.50], [0.38, 0.90]
    ], 'line');

    // Recurve tips
    drawUV([[0.36, 0.10], [0.32, 0.06], [0.30, 0.04], [0.34, 0.08]], mainStyle);
    drawUV([[0.36, 0.90], [0.32, 0.94], [0.30, 0.96], [0.34, 0.92]], mainStyle);

    // Arrow shaft — horizontal through the bow
    drawUV([[0.20, 0.498], [0.82, 0.498]], 'line');
    drawUV([[0.20, 0.502], [0.82, 0.502]], 'line');

    // Arrowhead — broadhead style
    drawUV([
        [0.82, 0.50], [0.88, 0.46], [0.92, 0.50],
        [0.88, 0.54]
    ], mainStyle);

    // Arrowhead detail
    drawUV([[0.84, 0.50], [0.88, 0.48], [0.90, 0.50]], detailStyle);
    drawUV([[0.84, 0.50], [0.88, 0.52], [0.90, 0.50]], detailStyle);

    // Fletching — feather vanes at back
    drawUV([
        [0.20, 0.50], [0.16, 0.46], [0.22, 0.48], [0.24, 0.50]
    ], mainStyle);
    drawUV([
        [0.20, 0.50], [0.16, 0.54], [0.22, 0.52], [0.24, 0.50]
    ], mainStyle);

    // Nock
    drawUV([[0.18, 0.49], [0.18, 0.51], [0.20, 0.505], [0.20, 0.495]], detailStyle);
}
