// Knife — combat/bowie knife with curved blade
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // Blade — curved single-edge with clip point
    drawUV([
        [0.50, 0.04],  // tip
        [0.55, 0.10], [0.56, 0.18], [0.56, 0.30],
        [0.55, 0.42], [0.54, 0.48],  // blade edge (sharp side)
        [0.46, 0.48], [0.46, 0.30],
        [0.46, 0.18], [0.46, 0.10],  // spine (blunt side)
        [0.48, 0.06]
    ], mainStyle);

    // Blade edge highlight / bevel
    drawUV([
        [0.54, 0.12], [0.55, 0.18], [0.55, 0.30],
        [0.54, 0.42], [0.53, 0.42], [0.53, 0.30],
        [0.53, 0.18], [0.53, 0.12]
    ], detailStyle);

    // Blood groove / fuller
    drawUV([
        [0.49, 0.14], [0.51, 0.14], [0.51, 0.40], [0.49, 0.40]
    ], detailStyle);

    // Guard / bolster
    drawUV([
        [0.40, 0.48], [0.60, 0.48], [0.61, 0.50],
        [0.60, 0.53], [0.40, 0.53], [0.39, 0.50]
    ], mainStyle);

    // Handle — ergonomic shape
    drawUV([
        [0.43, 0.53], [0.57, 0.53], [0.58, 0.56],
        [0.57, 0.72], [0.56, 0.78], [0.55, 0.80],
        [0.45, 0.80], [0.44, 0.78], [0.43, 0.72],
        [0.42, 0.56]
    ], mainStyle);

    // Handle rivets
    const rivets: [number, number][] = [[0.50, 0.58], [0.50, 0.65], [0.50, 0.72]];
    for (const [rx, ry] of rivets) {
        drawUV([
            [rx - 0.012, ry], [rx, ry - 0.012],
            [rx + 0.012, ry], [rx, ry + 0.012]
        ], detailStyle);
    }

    // Handle grip texture lines
    for (let i = 0; i < 4; i++) {
        const gy = 0.56 + i * 0.05;
        drawUV([[0.44, gy], [0.56, gy + 0.02]], 'line');
    }

    // Lanyard hole at pommel
    const hole: [number, number][] = [];
    for (let i = 0; i <= 8; i++) {
        const t = (i / 8) * Math.PI * 2;
        hole.push([0.50 + Math.cos(t) * 0.015, 0.82 + Math.sin(t) * 0.012]);
    }
    drawUV(hole, detailStyle);
}
