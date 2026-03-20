// Walking cat — cat in stride with tail up
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // Body — horizontal oval
    const bodyPts: [number, number][] = [];
    for (let i = 0; i <= 16; i++) {
        const t = (i / 16) * Math.PI * 2;
        bodyPts.push([0.48 + Math.cos(t) * 0.25, 0.45 + Math.sin(t) * 0.12]);
    }
    drawUV(bodyPts, mainStyle);

    // Head
    const headPts: [number, number][] = [];
    for (let i = 0; i <= 14; i++) {
        const t = (i / 14) * Math.PI * 2;
        headPts.push([0.78 + Math.cos(t) * 0.09, 0.35 + Math.sin(t) * 0.08]);
    }
    drawUV(headPts, mainStyle);

    // Ears
    drawUV([[0.74, 0.30], [0.72, 0.20], [0.77, 0.28]], mainStyle);
    drawUV([[0.83, 0.30], [0.85, 0.20], [0.80, 0.28]], mainStyle);

    // Eye
    drawUV([[0.80, 0.33], [0.79, 0.35], [0.82, 0.35], [0.81, 0.33]], detailStyle);

    // Whiskers
    drawUV([[0.86, 0.35], [0.95, 0.32]], 'line');
    drawUV([[0.86, 0.37], [0.95, 0.38]], 'line');

    // Front legs — walking stride
    drawUV([[0.65, 0.55], [0.68, 0.78], [0.71, 0.78], [0.66, 0.55]], mainStyle);
    drawUV([[0.58, 0.55], [0.54, 0.75], [0.57, 0.75], [0.60, 0.55]], mainStyle);

    // Back legs
    drawUV([[0.32, 0.52], [0.28, 0.78], [0.31, 0.78], [0.35, 0.52]], mainStyle);
    drawUV([[0.38, 0.52], [0.42, 0.75], [0.45, 0.75], [0.40, 0.52]], mainStyle);

    // Tail — curving up
    drawUV([
        [0.23, 0.45], [0.16, 0.38], [0.12, 0.25],
        [0.14, 0.15], [0.18, 0.10]
    ], 'line');

    // Paw detail lines
    drawUV([[0.67, 0.77], [0.72, 0.77]], 'line');
    drawUV([[0.53, 0.74], [0.58, 0.74]], 'line');
    drawUV([[0.27, 0.77], [0.32, 0.77]], 'line');
    drawUV([[0.41, 0.74], [0.46, 0.74]], 'line');
}
