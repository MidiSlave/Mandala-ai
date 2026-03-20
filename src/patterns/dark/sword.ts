// Sword — medieval broadsword
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // Blade — long tapered
    drawUV([
        [0.48, 0.02], [0.50, 0.00], [0.52, 0.02],
        [0.53, 0.55], [0.47, 0.55]
    ], mainStyle);

    // Fuller (groove in blade)
    drawUV([
        [0.49, 0.08], [0.51, 0.08], [0.51, 0.50], [0.49, 0.50]
    ], detailStyle);

    // Cross-guard
    drawUV([
        [0.32, 0.55], [0.68, 0.55], [0.70, 0.57],
        [0.68, 0.60], [0.32, 0.60], [0.30, 0.57]
    ], mainStyle);

    // Cross-guard decorations
    drawUV([[0.34, 0.56], [0.36, 0.56], [0.36, 0.59], [0.34, 0.59]], detailStyle);
    drawUV([[0.64, 0.56], [0.66, 0.56], [0.66, 0.59], [0.64, 0.59]], detailStyle);

    // Grip / handle — wrapped with leather
    drawUV([
        [0.46, 0.60], [0.54, 0.60], [0.54, 0.80], [0.46, 0.80]
    ], mainStyle);

    // Grip wrapping lines
    for (let i = 0; i < 5; i++) {
        const gy = 0.63 + i * 0.035;
        drawUV([[0.46, gy], [0.54, gy + 0.02]], 'line');
    }

    // Pommel — round end piece
    const pommel: [number, number][] = [];
    for (let i = 0; i <= 10; i++) {
        const t = (i / 10) * Math.PI * 2;
        pommel.push([0.50 + Math.cos(t) * 0.05, 0.84 + Math.sin(t) * 0.04]);
    }
    drawUV(pommel, mainStyle);

    // Pommel gem
    const gem: [number, number][] = [];
    for (let i = 0; i <= 8; i++) {
        const t = (i / 8) * Math.PI * 2;
        gem.push([0.50 + Math.cos(t) * 0.02, 0.84 + Math.sin(t) * 0.015]);
    }
    drawUV(gem, detailStyle);
}
