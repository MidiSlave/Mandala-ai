// Skull — front-facing human skull with jaw
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // Cranium — dome shape
    const cranium: [number, number][] = [];
    for (let i = 0; i <= 14; i++) {
        const t = Math.PI + (i / 14) * Math.PI;
        cranium.push([0.50 + Math.cos(t) * 0.28, 0.38 + Math.sin(t) * 0.30]);
    }
    // Jaw line connecting bottom
    cranium.push([0.78, 0.38], [0.75, 0.55], [0.70, 0.60],
        [0.58, 0.62], [0.42, 0.62], [0.30, 0.60],
        [0.25, 0.55], [0.22, 0.38]);
    drawUV(cranium, mainStyle);

    // Left eye socket — large dark oval
    const leftEye: [number, number][] = [];
    for (let i = 0; i <= 10; i++) {
        const t = (i / 10) * Math.PI * 2;
        leftEye.push([0.38 + Math.cos(t) * 0.07, 0.35 + Math.sin(t) * 0.08]);
    }
    drawUV(leftEye, detailStyle);

    // Right eye socket
    const rightEye: [number, number][] = [];
    for (let i = 0; i <= 10; i++) {
        const t = (i / 10) * Math.PI * 2;
        rightEye.push([0.62 + Math.cos(t) * 0.07, 0.35 + Math.sin(t) * 0.08]);
    }
    drawUV(rightEye, detailStyle);

    // Nasal cavity — inverted heart/triangle
    drawUV([
        [0.50, 0.42], [0.44, 0.52], [0.47, 0.54],
        [0.50, 0.52], [0.53, 0.54], [0.56, 0.52]
    ], detailStyle);

    // Teeth — row of rectangles along jaw
    for (let i = 0; i < 8; i++) {
        const tx = 0.36 + i * 0.035;
        const tw = 0.013;
        drawUV([
            [tx, 0.60], [tx + tw * 2, 0.60],
            [tx + tw * 2, 0.67], [tx, 0.67]
        ], mainStyle);
    }

    // Jaw separator line
    drawUV([[0.34, 0.60], [0.66, 0.60]], 'line');

    // Cheekbone lines
    drawUV([[0.25, 0.42], [0.30, 0.48], [0.34, 0.52]], 'line');
    drawUV([[0.75, 0.42], [0.70, 0.48], [0.66, 0.52]], 'line');

    // Cracks for aged look
    if (r() > 0.4) {
        drawUV([[0.45, 0.12], [0.43, 0.20], [0.40, 0.28]], 'line');
        drawUV([[0.58, 0.14], [0.60, 0.22], [0.62, 0.26]], 'line');
    }
}
