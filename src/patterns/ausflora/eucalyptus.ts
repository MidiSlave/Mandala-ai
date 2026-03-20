// Eucalyptus — gum blossom with cap and hanging leaves
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // Branch
    drawUV([[0.30, 0.90], [0.40, 0.70], [0.50, 0.55], [0.55, 0.48]], 'line');
    drawUV([[0.50, 0.55], [0.65, 0.45]], 'line');

    // Main gum blossom — fluffy stamen explosion
    const cx = 0.55, cy = 0.30;
    const numStamens = 20;
    for (let i = 0; i < numStamens; i++) {
        const angle = (i / numStamens) * Math.PI * 2;
        const len = 0.10 + r() * 0.06;
        const ex = cx + Math.cos(angle) * len;
        const ey = cy + Math.sin(angle) * len * 0.9;
        drawUV([[cx, cy], [ex, ey]], 'line');
    }

    // Gum nut base (operculum)
    drawUV([
        [0.50, 0.35], [0.48, 0.40], [0.50, 0.44],
        [0.55, 0.45], [0.60, 0.44], [0.62, 0.40],
        [0.60, 0.35]
    ], mainStyle);

    // Cap / operculum detail
    drawUV([
        [0.50, 0.36], [0.60, 0.36], [0.60, 0.38], [0.50, 0.38]
    ], detailStyle);

    // Second blossom (smaller, budding)
    const cx2 = 0.68, cy2 = 0.30;
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const len = 0.06 + r() * 0.04;
        drawUV([
            [cx2, cy2],
            [cx2 + Math.cos(angle) * len, cy2 + Math.sin(angle) * len]
        ], 'line');
    }

    // Bud — still capped
    drawUV([
        [0.36, 0.62], [0.34, 0.66], [0.36, 0.70],
        [0.40, 0.70], [0.42, 0.66], [0.40, 0.62]
    ], mainStyle);
    // Cap on bud
    drawUV([
        [0.35, 0.62], [0.38, 0.58], [0.41, 0.62]
    ], detailStyle);

    // Hanging sickle-shaped leaves (eucalyptus signature)
    drawUV([
        [0.40, 0.70], [0.35, 0.76], [0.30, 0.84],
        [0.28, 0.90], [0.30, 0.88], [0.34, 0.82],
        [0.38, 0.74]
    ], mainStyle);
    drawUV([[0.40, 0.70], [0.30, 0.88]], 'line'); // midrib

    drawUV([
        [0.55, 0.55], [0.60, 0.60], [0.66, 0.68],
        [0.70, 0.76], [0.68, 0.74], [0.62, 0.66],
        [0.56, 0.58]
    ], mainStyle);

    drawUV([
        [0.50, 0.55], [0.44, 0.52], [0.38, 0.48],
        [0.34, 0.44], [0.36, 0.46], [0.42, 0.50],
        [0.48, 0.54]
    ], mainStyle);

    // Gum nuts (seed pods) hanging
    const nut: [number, number][] = [];
    for (let i = 0; i <= 8; i++) {
        const t = (i / 8) * Math.PI * 2;
        nut.push([0.44 + Math.cos(t) * 0.02, 0.80 + Math.sin(t) * 0.025]);
    }
    drawUV(nut, detailStyle);
}
