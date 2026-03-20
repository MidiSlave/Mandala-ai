// Pohutukawa — New Zealand Christmas tree with fluffy red stamens
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // Stem and branch
    drawUV([[0.50, 0.60], [0.50, 0.92], [0.52, 0.92], [0.52, 0.60]], mainStyle);
    drawUV([[0.50, 0.70], [0.40, 0.62]], 'line');
    drawUV([[0.52, 0.70], [0.62, 0.62]], 'line');

    // Main flower — burst of stamens radiating from center
    const cx = 0.50, cy = 0.35;
    const numStamens = 24;
    for (let i = 0; i < numStamens; i++) {
        const angle = (i / numStamens) * Math.PI * 2;
        const len = 0.14 + r() * 0.06;
        const ex = cx + Math.cos(angle) * len;
        const ey = cy + Math.sin(angle) * len;
        drawUV([[cx, cy], [ex, ey]], 'line');
        // Stamen tip — tiny ball
        const tipPts: [number, number][] = [];
        for (let j = 0; j <= 5; j++) {
            const ta = (j / 5) * Math.PI * 2;
            tipPts.push([ex + Math.cos(ta) * 0.008, ey + Math.sin(ta) * 0.008]);
        }
        drawUV(tipPts, mainStyle);
    }

    // Center — dark cluster of stigmas
    const center: [number, number][] = [];
    for (let i = 0; i <= 10; i++) {
        const t = (i / 10) * Math.PI * 2;
        center.push([cx + Math.cos(t) * 0.04, cy + Math.sin(t) * 0.04]);
    }
    drawUV(center, detailStyle);

    // Buds — rounded, about to open
    const bud1: [number, number][] = [];
    for (let i = 0; i <= 8; i++) {
        const t = (i / 8) * Math.PI * 2;
        bud1.push([0.32 + Math.cos(t) * 0.03, 0.45 + Math.sin(t) * 0.04]);
    }
    drawUV(bud1, mainStyle);

    const bud2: [number, number][] = [];
    for (let i = 0; i <= 8; i++) {
        const t = (i / 8) * Math.PI * 2;
        bud2.push([0.68 + Math.cos(t) * 0.03, 0.42 + Math.sin(t) * 0.04]);
    }
    drawUV(bud2, mainStyle);

    // Leaves — thick, oval, leathery
    drawUV([
        [0.38, 0.58], [0.32, 0.55], [0.26, 0.54],
        [0.22, 0.56], [0.24, 0.60], [0.30, 0.62],
        [0.36, 0.61]
    ], mainStyle);
    drawUV([[0.38, 0.58], [0.24, 0.57]], 'line'); // midrib

    drawUV([
        [0.62, 0.58], [0.68, 0.55], [0.74, 0.54],
        [0.78, 0.56], [0.76, 0.60], [0.70, 0.62],
        [0.64, 0.61]
    ], mainStyle);
    drawUV([[0.62, 0.58], [0.76, 0.57]], 'line'); // midrib

    // Lower leaf pair
    drawUV([
        [0.46, 0.78], [0.38, 0.76], [0.32, 0.78],
        [0.34, 0.82], [0.42, 0.83], [0.46, 0.82]
    ], mainStyle);
    drawUV([
        [0.54, 0.78], [0.62, 0.76], [0.68, 0.78],
        [0.66, 0.82], [0.58, 0.83], [0.54, 0.82]
    ], mainStyle);
}
