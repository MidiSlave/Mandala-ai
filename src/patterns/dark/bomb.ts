// Bomb — classic round bomb with fuse and sparks
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // Main sphere
    const sphere: [number, number][] = [];
    for (let i = 0; i <= 16; i++) {
        const t = (i / 16) * Math.PI * 2;
        sphere.push([0.48 + Math.cos(t) * 0.22, 0.52 + Math.sin(t) * 0.24]);
    }
    drawUV(sphere, mainStyle);

    // Highlight on sphere
    const highlight: [number, number][] = [];
    for (let i = 0; i <= 8; i++) {
        const t = (i / 8) * Math.PI * 2;
        highlight.push([0.40 + Math.cos(t) * 0.05, 0.42 + Math.sin(t) * 0.06]);
    }
    drawUV(highlight, detailStyle);

    // Fuse collar — cylinder at top
    drawUV([
        [0.44, 0.28], [0.42, 0.24], [0.44, 0.22],
        [0.52, 0.22], [0.54, 0.24], [0.52, 0.28]
    ], mainStyle);

    // Fuse — curving line
    drawUV([
        [0.48, 0.22], [0.50, 0.16], [0.55, 0.12],
        [0.60, 0.10], [0.64, 0.08]
    ], 'line');

    // Spark / flame at tip
    drawUV([
        [0.64, 0.08], [0.66, 0.04], [0.68, 0.06],
        [0.70, 0.02], [0.68, 0.08], [0.66, 0.10],
        [0.64, 0.08]
    ], mainStyle);

    // Spark lines radiating from tip
    drawUV([[0.66, 0.04], [0.62, 0.00]], 'line');
    drawUV([[0.70, 0.02], [0.74, 0.00]], 'line');
    drawUV([[0.68, 0.06], [0.72, 0.04]], 'line');

    // "Caution" band around equator
    drawUV([
        [0.26, 0.50], [0.70, 0.50], [0.70, 0.54], [0.26, 0.54]
    ], detailStyle);

    // Cross-hatching on band
    for (let i = 0; i < 6; i++) {
        const bx = 0.30 + i * 0.07;
        drawUV([[bx, 0.50], [bx + 0.035, 0.54]], 'line');
        drawUV([[bx + 0.035, 0.50], [bx, 0.54]], 'line');
    }
}
