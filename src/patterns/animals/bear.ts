// Bear — standing bear silhouette
import type { PatternContext } from '../types';

export function draw({ drawUV, filled }: PatternContext): void {
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // Body — large oval
    drawUV([
        [0.25, 0.35], [0.70, 0.35], [0.75, 0.40],
        [0.75, 0.65], [0.70, 0.70], [0.25, 0.70],
        [0.20, 0.65], [0.20, 0.40]
    ], mainStyle);

    // Head
    const headPts: [number, number][] = [];
    for (let i = 0; i <= 14; i++) {
        const t = (i / 14) * Math.PI * 2;
        headPts.push([0.75 + Math.cos(t) * 0.11, 0.38 + Math.sin(t) * 0.12]);
    }
    drawUV(headPts, mainStyle);

    // Ears — round
    const leftEar: [number, number][] = [];
    const rightEar: [number, number][] = [];
    for (let i = 0; i <= 8; i++) {
        const t = (i / 8) * Math.PI * 2;
        leftEar.push([0.68 + Math.cos(t) * 0.035, 0.25 + Math.sin(t) * 0.035]);
        rightEar.push([0.82 + Math.cos(t) * 0.035, 0.25 + Math.sin(t) * 0.035]);
    }
    drawUV(leftEar, mainStyle);
    drawUV(rightEar, mainStyle);

    // Inner ears
    const leftInner: [number, number][] = [];
    const rightInner: [number, number][] = [];
    for (let i = 0; i <= 6; i++) {
        const t = (i / 6) * Math.PI * 2;
        leftInner.push([0.68 + Math.cos(t) * 0.02, 0.25 + Math.sin(t) * 0.02]);
        rightInner.push([0.82 + Math.cos(t) * 0.02, 0.25 + Math.sin(t) * 0.02]);
    }
    drawUV(leftInner, detailStyle);
    drawUV(rightInner, detailStyle);

    // Eyes
    drawUV([[0.71, 0.35], [0.73, 0.35], [0.73, 0.37], [0.71, 0.37]], detailStyle);
    drawUV([[0.77, 0.35], [0.79, 0.35], [0.79, 0.37], [0.77, 0.37]], detailStyle);

    // Nose — triangular
    drawUV([[0.74, 0.40], [0.76, 0.40], [0.75, 0.42]], detailStyle);

    // Snout
    const snoutPts: [number, number][] = [];
    for (let i = 0; i <= 8; i++) {
        const t = (i / 8) * Math.PI * 2;
        snoutPts.push([0.75 + Math.cos(t) * 0.04, 0.42 + Math.sin(t) * 0.03]);
    }
    drawUV(snoutPts, detailStyle);

    // Front legs — thick
    drawUV([[0.58, 0.70], [0.58, 0.92], [0.64, 0.92], [0.64, 0.70]], mainStyle);
    drawUV([[0.50, 0.70], [0.50, 0.90], [0.56, 0.90], [0.56, 0.70]], mainStyle);

    // Back legs
    drawUV([[0.30, 0.70], [0.30, 0.92], [0.36, 0.92], [0.36, 0.70]], mainStyle);
    drawUV([[0.24, 0.70], [0.24, 0.90], [0.30, 0.90], [0.30, 0.70]], mainStyle);

    // Paw claws
    for (let i = 0; i < 3; i++) {
        drawUV([[0.59 + i * 0.02, 0.92], [0.59 + i * 0.02, 0.95]], 'line');
        drawUV([[0.31 + i * 0.02, 0.92], [0.31 + i * 0.02, 0.95]], 'line');
    }

    // Tail — small bump
    drawUV([[0.20, 0.42], [0.17, 0.40], [0.16, 0.42], [0.18, 0.44]], mainStyle);
}
