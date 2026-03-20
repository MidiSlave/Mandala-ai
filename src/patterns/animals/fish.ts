// Fish — tropical fish with fins and scales
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // Body — fish-shaped oval
    drawUV([
        [0.20, 0.50], [0.25, 0.38], [0.35, 0.32],
        [0.50, 0.30], [0.65, 0.32], [0.75, 0.38],
        [0.80, 0.45], [0.80, 0.55], [0.75, 0.62],
        [0.65, 0.68], [0.50, 0.70], [0.35, 0.68],
        [0.25, 0.62]
    ], mainStyle);

    // Tail fin
    drawUV([
        [0.20, 0.50], [0.10, 0.32], [0.05, 0.28],
        [0.08, 0.38], [0.06, 0.50], [0.08, 0.62],
        [0.05, 0.72], [0.10, 0.68]
    ], mainStyle);

    // Top fin (dorsal)
    drawUV([
        [0.40, 0.32], [0.42, 0.22], [0.48, 0.18],
        [0.55, 0.20], [0.60, 0.25], [0.62, 0.32]
    ], mainStyle);

    // Bottom fin
    drawUV([
        [0.45, 0.68], [0.48, 0.76], [0.52, 0.78],
        [0.56, 0.76], [0.55, 0.68]
    ], mainStyle);

    // Pectoral fin
    drawUV([
        [0.60, 0.48], [0.68, 0.52], [0.70, 0.58],
        [0.66, 0.56], [0.60, 0.54]
    ], detailStyle);

    // Eye — large
    const eyePts: [number, number][] = [];
    for (let i = 0; i <= 10; i++) {
        const t = (i / 10) * Math.PI * 2;
        eyePts.push([0.68 + Math.cos(t) * 0.03, 0.45 + Math.sin(t) * 0.03]);
    }
    drawUV(eyePts, detailStyle);
    // Pupil
    const pupilPts: [number, number][] = [];
    for (let i = 0; i <= 8; i++) {
        const t = (i / 8) * Math.PI * 2;
        pupilPts.push([0.69 + Math.cos(t) * 0.012, 0.45 + Math.sin(t) * 0.012]);
    }
    drawUV(pupilPts, mainStyle);

    // Mouth
    drawUV([[0.78, 0.48], [0.80, 0.50], [0.78, 0.52]], 'line');

    // Scale pattern — arced lines
    for (let row = 0; row < 4; row++) {
        const v = 0.38 + row * 0.08;
        for (let col = 0; col < 5; col++) {
            const u = 0.30 + col * 0.09 + (row % 2) * 0.045;
            const pts: [number, number][] = [];
            for (let j = 0; j <= 5; j++) {
                const t = -Math.PI * 0.5 + (j / 5) * Math.PI;
                pts.push([u + Math.cos(t) * 0.03, v + Math.sin(t) * 0.02]);
            }
            drawUV(pts, 'line');
        }
    }

    // Tail fin rays
    drawUV([[0.18, 0.50], [0.08, 0.35]], 'line');
    drawUV([[0.18, 0.50], [0.06, 0.50]], 'line');
    drawUV([[0.18, 0.50], [0.08, 0.65]], 'line');
}
