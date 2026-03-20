// Bird — songbird on a branch
import type { PatternContext } from '../types';

export function draw({ drawUV, filled }: PatternContext): void {
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // Body — oval
    const bodyPts: [number, number][] = [];
    for (let i = 0; i <= 14; i++) {
        const t = (i / 14) * Math.PI * 2;
        bodyPts.push([0.48 + Math.cos(t) * 0.16, 0.48 + Math.sin(t) * 0.13]);
    }
    drawUV(bodyPts, mainStyle);

    // Head
    const headPts: [number, number][] = [];
    for (let i = 0; i <= 12; i++) {
        const t = (i / 12) * Math.PI * 2;
        headPts.push([0.68 + Math.cos(t) * 0.08, 0.35 + Math.sin(t) * 0.08]);
    }
    drawUV(headPts, mainStyle);

    // Eye
    drawUV([[0.71, 0.33], [0.72, 0.32], [0.73, 0.33], [0.72, 0.34]], detailStyle);

    // Beak — pointed
    drawUV([[0.76, 0.34], [0.84, 0.36], [0.76, 0.38]], mainStyle);
    // Beak line
    drawUV([[0.76, 0.36], [0.83, 0.36]], 'line');

    // Wing — folded on body
    drawUV([
        [0.50, 0.40], [0.55, 0.36], [0.58, 0.38],
        [0.56, 0.45], [0.50, 0.55], [0.42, 0.58],
        [0.36, 0.55], [0.38, 0.48], [0.42, 0.42]
    ], detailStyle);

    // Wing feather lines
    drawUV([[0.50, 0.42], [0.42, 0.55]], 'line');
    drawUV([[0.52, 0.40], [0.44, 0.53]], 'line');
    drawUV([[0.54, 0.39], [0.46, 0.52]], 'line');

    // Tail feathers
    drawUV([
        [0.32, 0.48], [0.22, 0.52], [0.18, 0.56],
        [0.16, 0.54], [0.20, 0.48], [0.18, 0.44],
        [0.16, 0.42], [0.18, 0.40], [0.22, 0.44],
        [0.30, 0.45]
    ], mainStyle);

    // Tail feather lines
    drawUV([[0.30, 0.46], [0.18, 0.50]], 'line');
    drawUV([[0.30, 0.47], [0.18, 0.44]], 'line');

    // Legs
    drawUV([[0.46, 0.60], [0.46, 0.74]], 'line');
    drawUV([[0.52, 0.60], [0.52, 0.74]], 'line');

    // Feet — gripping branch
    drawUV([[0.42, 0.74], [0.46, 0.74], [0.48, 0.76]], 'line');
    drawUV([[0.46, 0.74], [0.44, 0.76]], 'line');
    drawUV([[0.48, 0.74], [0.52, 0.74], [0.54, 0.76]], 'line');
    drawUV([[0.52, 0.74], [0.50, 0.76]], 'line');

    // Branch
    drawUV([[0.30, 0.75], [0.70, 0.74]], 'line');

    // Breast detail
    const breastPts: [number, number][] = [];
    for (let i = 0; i <= 8; i++) {
        const t = (i / 8) * Math.PI * 2;
        breastPts.push([0.55 + Math.cos(t) * 0.05, 0.50 + Math.sin(t) * 0.06]);
    }
    drawUV(breastPts, detailStyle);
}
