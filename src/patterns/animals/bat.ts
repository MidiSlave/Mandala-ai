// Bat — spread wings silhouette
import type { PatternContext } from '../types';

export function draw({ drawUV, filled }: PatternContext): void {
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // Left wing
    drawUV([
        [0.45, 0.40], [0.35, 0.30], [0.20, 0.25],
        [0.08, 0.28], [0.05, 0.35], [0.10, 0.42],
        [0.15, 0.38], [0.22, 0.45], [0.18, 0.50],
        [0.25, 0.52], [0.30, 0.48], [0.35, 0.55],
        [0.40, 0.52], [0.45, 0.50]
    ], mainStyle);

    // Right wing
    drawUV([
        [0.55, 0.40], [0.65, 0.30], [0.80, 0.25],
        [0.92, 0.28], [0.95, 0.35], [0.90, 0.42],
        [0.85, 0.38], [0.78, 0.45], [0.82, 0.50],
        [0.75, 0.52], [0.70, 0.48], [0.65, 0.55],
        [0.60, 0.52], [0.55, 0.50]
    ], mainStyle);

    // Body
    const bodyPts: [number, number][] = [];
    for (let i = 0; i <= 12; i++) {
        const t = (i / 12) * Math.PI * 2;
        bodyPts.push([0.50 + Math.cos(t) * 0.06, 0.45 + Math.sin(t) * 0.10]);
    }
    drawUV(bodyPts, mainStyle);

    // Head
    const headPts: [number, number][] = [];
    for (let i = 0; i <= 10; i++) {
        const t = (i / 10) * Math.PI * 2;
        headPts.push([0.50 + Math.cos(t) * 0.05, 0.32 + Math.sin(t) * 0.05]);
    }
    drawUV(headPts, mainStyle);

    // Ears — pointed
    drawUV([[0.46, 0.30], [0.44, 0.20], [0.48, 0.28]], mainStyle);
    drawUV([[0.54, 0.30], [0.56, 0.20], [0.52, 0.28]], mainStyle);

    // Eyes — glowing dots
    drawUV([[0.47, 0.31], [0.48, 0.30], [0.49, 0.31], [0.48, 0.32]], detailStyle);
    drawUV([[0.51, 0.31], [0.52, 0.30], [0.53, 0.31], [0.52, 0.32]], detailStyle);

    // Wing bone lines
    drawUV([[0.45, 0.40], [0.25, 0.30]], 'line');
    drawUV([[0.45, 0.42], [0.22, 0.42]], 'line');
    drawUV([[0.45, 0.45], [0.28, 0.50]], 'line');
    drawUV([[0.55, 0.40], [0.75, 0.30]], 'line');
    drawUV([[0.55, 0.42], [0.78, 0.42]], 'line');
    drawUV([[0.55, 0.45], [0.72, 0.50]], 'line');

    // Feet dangling
    drawUV([[0.47, 0.55], [0.46, 0.62], [0.45, 0.64]], 'line');
    drawUV([[0.53, 0.55], [0.54, 0.62], [0.55, 0.64]], 'line');
}
