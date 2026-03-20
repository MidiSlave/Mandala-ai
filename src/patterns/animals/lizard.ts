// Lizard — gecko-like with splayed legs and long tail
import type { PatternContext } from '../types';

export function draw({ drawUV, filled }: PatternContext): void {
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // Body — elongated
    const bodyPts: [number, number][] = [];
    for (let i = 0; i <= 14; i++) {
        const t = (i / 14) * Math.PI * 2;
        bodyPts.push([0.50 + Math.cos(t) * 0.20, 0.45 + Math.sin(t) * 0.08]);
    }
    drawUV(bodyPts, mainStyle);

    // Head — triangular/rounded
    drawUV([
        [0.70, 0.42], [0.78, 0.40], [0.82, 0.42],
        [0.84, 0.45], [0.82, 0.48], [0.78, 0.50],
        [0.70, 0.48]
    ], mainStyle);

    // Eyes — on sides of head
    drawUV([[0.79, 0.40], [0.80, 0.39], [0.81, 0.40], [0.80, 0.41]], detailStyle);
    drawUV([[0.79, 0.50], [0.80, 0.49], [0.81, 0.50], [0.80, 0.51]], detailStyle);

    // Front right leg — splayed
    drawUV([
        [0.62, 0.38], [0.65, 0.28], [0.70, 0.22],
        [0.72, 0.22], [0.68, 0.28], [0.65, 0.36]
    ], mainStyle);
    // Toes
    drawUV([[0.70, 0.22], [0.72, 0.19]], 'line');
    drawUV([[0.70, 0.22], [0.74, 0.21]], 'line');
    drawUV([[0.70, 0.22], [0.73, 0.24]], 'line');

    // Front left leg
    drawUV([
        [0.62, 0.52], [0.65, 0.62], [0.70, 0.68],
        [0.72, 0.68], [0.68, 0.62], [0.65, 0.54]
    ], mainStyle);
    drawUV([[0.70, 0.68], [0.72, 0.71]], 'line');
    drawUV([[0.70, 0.68], [0.74, 0.69]], 'line');
    drawUV([[0.70, 0.68], [0.73, 0.66]], 'line');

    // Back right leg
    drawUV([
        [0.38, 0.38], [0.35, 0.28], [0.30, 0.22],
        [0.28, 0.22], [0.32, 0.28], [0.35, 0.36]
    ], mainStyle);
    drawUV([[0.30, 0.22], [0.28, 0.19]], 'line');
    drawUV([[0.30, 0.22], [0.26, 0.21]], 'line');
    drawUV([[0.30, 0.22], [0.27, 0.24]], 'line');

    // Back left leg
    drawUV([
        [0.38, 0.52], [0.35, 0.62], [0.30, 0.68],
        [0.28, 0.68], [0.32, 0.62], [0.35, 0.54]
    ], mainStyle);
    drawUV([[0.30, 0.68], [0.28, 0.71]], 'line');
    drawUV([[0.30, 0.68], [0.26, 0.69]], 'line');
    drawUV([[0.30, 0.68], [0.27, 0.66]], 'line');

    // Tail — long tapering curve
    drawUV([
        [0.30, 0.44], [0.22, 0.42], [0.15, 0.38],
        [0.10, 0.35], [0.06, 0.38], [0.04, 0.42]
    ], 'line');
    // Tail thickness at base
    drawUV([
        [0.30, 0.46], [0.22, 0.48], [0.15, 0.44],
        [0.10, 0.40]
    ], 'line');

    // Spine ridge marks
    for (let i = 0; i < 5; i++) {
        const u = 0.40 + i * 0.06;
        drawUV([[u, 0.38], [u + 0.015, 0.36], [u + 0.03, 0.38]], 'line');
    }
}
