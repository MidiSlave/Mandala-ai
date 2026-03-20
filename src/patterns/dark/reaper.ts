// Grim Reaper scythe — curved blade with long handle
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // Long handle / shaft
    drawUV([
        [0.48, 0.20], [0.52, 0.20], [0.54, 0.92], [0.50, 0.92]
    ], mainStyle);

    // Handle grip wrapping
    for (let i = 0; i < 6; i++) {
        const gy = 0.55 + i * 0.05;
        drawUV([[0.47, gy], [0.55, gy + 0.03]], 'line');
    }

    // Scythe blade — large sweeping curve
    const blade: [number, number][] = [];
    for (let i = 0; i <= 16; i++) {
        const t = Math.PI * 0.6 + (i / 16) * Math.PI * 0.8;
        const radius = 0.28 + (i / 16) * 0.02;
        blade.push([0.48 + Math.cos(t) * radius, 0.20 + Math.sin(t) * radius * 0.7]);
    }
    // Inner edge (sharper curve, closer)
    for (let i = 16; i >= 0; i--) {
        const t = Math.PI * 0.6 + (i / 16) * Math.PI * 0.8;
        const radius = 0.22 + (i / 16) * 0.02;
        blade.push([0.48 + Math.cos(t) * radius, 0.20 + Math.sin(t) * radius * 0.7]);
    }
    drawUV(blade, mainStyle);

    // Blade edge gleam
    for (let i = 0; i <= 12; i++) {
        const t = Math.PI * 0.65 + (i / 12) * Math.PI * 0.7;
        const radius = 0.27 + (i / 12) * 0.02;
        if (i > 0 && i < 12 && i % 3 === 0) {
            const x1 = 0.48 + Math.cos(t) * (radius - 0.02);
            const y1 = 0.20 + Math.sin(t) * (radius - 0.02) * 0.7;
            const x2 = 0.48 + Math.cos(t) * radius;
            const y2 = 0.20 + Math.sin(t) * radius * 0.7;
            drawUV([[x1, y1], [x2, y2]], 'line');
        }
    }

    // Collar where blade meets handle
    drawUV([
        [0.44, 0.18], [0.56, 0.18], [0.56, 0.24], [0.44, 0.24]
    ], mainStyle);
    drawUV([
        [0.46, 0.19], [0.54, 0.19], [0.54, 0.23], [0.46, 0.23]
    ], detailStyle);

    // Pommel spike at bottom
    drawUV([
        [0.49, 0.92], [0.50, 0.98], [0.53, 0.92]
    ], mainStyle);
}
