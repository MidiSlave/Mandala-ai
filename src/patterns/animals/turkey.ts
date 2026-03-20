// Turkey — with fanned tail feathers
import type { PatternContext } from '../types';

export function draw({ drawUV, filled }: PatternContext): void {
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // Tail fan — large semicircle of feathers
    const fanCenter: [number, number] = [0.35, 0.45];
    const numFeathers = 9;
    for (let i = 0; i < numFeathers; i++) {
        const angle = -Math.PI * 0.75 + (i / (numFeathers - 1)) * Math.PI * 0.65;
        const r1 = 0.28;
        const r2 = 0.32;
        const tipU = fanCenter[0] + Math.cos(angle) * r2;
        const tipV = fanCenter[1] + Math.sin(angle) * r2;
        const baseU1 = fanCenter[0] + Math.cos(angle - 0.08) * 0.08;
        const baseV1 = fanCenter[1] + Math.sin(angle - 0.08) * 0.08;
        const baseU2 = fanCenter[0] + Math.cos(angle + 0.08) * 0.08;
        const baseV2 = fanCenter[1] + Math.sin(angle + 0.08) * 0.08;
        drawUV([[baseU1, baseV1], [tipU, tipV], [baseU2, baseV2]], i % 2 === 0 ? mainStyle : detailStyle);

        // Feather eye spots
        const eyeU = fanCenter[0] + Math.cos(angle) * r1;
        const eyeV = fanCenter[1] + Math.sin(angle) * r1;
        const eyePts: [number, number][] = [];
        for (let j = 0; j <= 6; j++) {
            const t = (j / 6) * Math.PI * 2;
            eyePts.push([eyeU + Math.cos(t) * 0.015, eyeV + Math.sin(t) * 0.012]);
        }
        drawUV(eyePts, i % 2 === 0 ? detailStyle : mainStyle);
    }

    // Body — round
    const bodyPts: [number, number][] = [];
    for (let i = 0; i <= 14; i++) {
        const t = (i / 14) * Math.PI * 2;
        bodyPts.push([0.55 + Math.cos(t) * 0.12, 0.52 + Math.sin(t) * 0.14]);
    }
    drawUV(bodyPts, mainStyle);

    // Neck
    drawUV([
        [0.62, 0.42], [0.66, 0.30], [0.72, 0.25],
        [0.75, 0.25], [0.72, 0.30], [0.68, 0.42]
    ], mainStyle);

    // Head
    const headPts: [number, number][] = [];
    for (let i = 0; i <= 10; i++) {
        const t = (i / 10) * Math.PI * 2;
        headPts.push([0.73, 0.22].map((v, j) => v + [Math.cos(t) * 0.04, Math.sin(t) * 0.04][j]) as [number, number]);
    }
    drawUV(headPts, mainStyle);

    // Snood (wattle)
    drawUV([[0.76, 0.22], [0.78, 0.28], [0.76, 0.30], [0.75, 0.26]], detailStyle);

    // Beak
    drawUV([[0.76, 0.20], [0.80, 0.21], [0.76, 0.23]], mainStyle);

    // Eye
    drawUV([[0.74, 0.20], [0.75, 0.20], [0.75, 0.21], [0.74, 0.21]], detailStyle);

    // Legs
    drawUV([[0.52, 0.66], [0.52, 0.85], [0.54, 0.85], [0.54, 0.66]], mainStyle);
    drawUV([[0.58, 0.66], [0.58, 0.85], [0.60, 0.85], [0.60, 0.66]], mainStyle);

    // Feet — three toes each
    drawUV([[0.48, 0.88], [0.53, 0.85], [0.53, 0.88]], 'line');
    drawUV([[0.53, 0.85], [0.53, 0.90]], 'line');
    drawUV([[0.53, 0.85], [0.56, 0.88]], 'line');

    drawUV([[0.56, 0.88], [0.59, 0.85], [0.59, 0.88]], 'line');
    drawUV([[0.59, 0.85], [0.59, 0.90]], 'line');
    drawUV([[0.59, 0.85], [0.62, 0.88]], 'line');
}
