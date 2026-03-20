// Battle Axe — double-headed war axe
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // Handle — long vertical shaft
    drawUV([
        [0.48, 0.05], [0.52, 0.05], [0.52, 0.90], [0.48, 0.90]
    ], mainStyle);

    // Handle grip wrapping at bottom
    for (let i = 0; i < 5; i++) {
        const gy = 0.70 + i * 0.04;
        drawUV([[0.47, gy], [0.53, gy + 0.02]], 'line');
    }

    // Left axe head — sweeping blade
    drawUV([
        [0.48, 0.15], [0.42, 0.10], [0.30, 0.08],
        [0.22, 0.12], [0.18, 0.20], [0.18, 0.30],
        [0.22, 0.38], [0.30, 0.42], [0.42, 0.40],
        [0.48, 0.35]
    ], mainStyle);

    // Left blade edge highlight
    drawUV([
        [0.22, 0.14], [0.20, 0.20], [0.20, 0.30],
        [0.22, 0.36], [0.24, 0.30], [0.24, 0.20]
    ], detailStyle);

    // Right axe head — mirror blade
    drawUV([
        [0.52, 0.15], [0.58, 0.10], [0.70, 0.08],
        [0.78, 0.12], [0.82, 0.20], [0.82, 0.30],
        [0.78, 0.38], [0.70, 0.42], [0.58, 0.40],
        [0.52, 0.35]
    ], mainStyle);

    // Right blade edge highlight
    drawUV([
        [0.78, 0.14], [0.80, 0.20], [0.80, 0.30],
        [0.78, 0.36], [0.76, 0.30], [0.76, 0.20]
    ], detailStyle);

    // Axe head collar / binding
    drawUV([
        [0.45, 0.12], [0.55, 0.12], [0.55, 0.16], [0.45, 0.16]
    ], detailStyle);
    drawUV([
        [0.45, 0.34], [0.55, 0.34], [0.55, 0.38], [0.45, 0.38]
    ], detailStyle);

    // Pommel at bottom
    drawUV([
        [0.46, 0.90], [0.44, 0.92], [0.44, 0.95],
        [0.50, 0.97], [0.56, 0.95], [0.56, 0.92], [0.54, 0.90]
    ], mainStyle);
}
