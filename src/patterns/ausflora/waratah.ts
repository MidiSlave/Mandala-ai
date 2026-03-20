// Waratah — NSW state emblem, large red dome flower with bracts
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // Stem — sturdy
    drawUV([[0.47, 0.55], [0.47, 0.92], [0.53, 0.92], [0.53, 0.55]], mainStyle);

    // Bracts — large protective petal-like leaves surrounding the flower head
    const numBracts = 10;
    for (let i = 0; i < numBracts; i++) {
        const angle = (i / numBracts) * Math.PI + Math.PI;
        const bx = 0.50 + Math.cos(angle) * 0.22;
        const by = 0.38 + Math.sin(angle) * 0.18;
        const tx = 0.50 + Math.cos(angle) * 0.08;
        const ty = 0.38 + Math.sin(angle) * 0.06;
        const perpAngle = angle + Math.PI / 2;
        const pw = 0.04;
        drawUV([
            [tx, ty],
            [bx + Math.cos(perpAngle) * pw, by + Math.sin(perpAngle) * pw],
            [bx + Math.cos(angle) * 0.03, by + Math.sin(angle) * 0.03],
            [bx - Math.cos(perpAngle) * pw, by - Math.sin(perpAngle) * pw]
        ], mainStyle);
    }

    // Flower dome — dense rounded head
    const dome: [number, number][] = [];
    for (let i = 0; i <= 14; i++) {
        const t = Math.PI + (i / 14) * Math.PI;
        dome.push([0.50 + Math.cos(t) * 0.16, 0.35 + Math.sin(t) * 0.20]);
    }
    dome.push([0.66, 0.35], [0.66, 0.42], [0.34, 0.42], [0.34, 0.35]);
    drawUV(dome, mainStyle);

    // Individual florets — tiny protruding styles covering the dome
    for (let row = 0; row < 5; row++) {
        const ry = 0.20 + row * 0.04;
        const rowWidth = 0.14 - Math.abs(row - 2) * 0.03;
        for (let col = 0; col < 4 + row % 2; col++) {
            const fx = 0.50 - rowWidth + (col / (3 + row % 2)) * rowWidth * 2;
            drawUV([
                [fx, ry], [fx - 0.008, ry - 0.015],
                [fx + 0.008, ry - 0.015]
            ], detailStyle);
        }
    }

    // Large toothed leaves
    // Left leaf
    drawUV([
        [0.47, 0.70], [0.35, 0.60], [0.28, 0.55],
        [0.22, 0.52], [0.18, 0.55], [0.20, 0.58],
        [0.25, 0.60], [0.22, 0.63], [0.26, 0.65],
        [0.30, 0.64], [0.28, 0.68], [0.34, 0.68],
        [0.40, 0.72], [0.47, 0.74]
    ], mainStyle);

    // Right leaf
    drawUV([
        [0.53, 0.70], [0.65, 0.60], [0.72, 0.55],
        [0.78, 0.52], [0.82, 0.55], [0.80, 0.58],
        [0.75, 0.60], [0.78, 0.63], [0.74, 0.65],
        [0.70, 0.64], [0.72, 0.68], [0.66, 0.68],
        [0.60, 0.72], [0.53, 0.74]
    ], mainStyle);
}
