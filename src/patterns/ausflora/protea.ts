// Protea — large artichoke-like flower head (related to Banksia, found across Australasia)
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // Stem
    drawUV([[0.48, 0.62], [0.47, 0.92], [0.53, 0.92], [0.52, 0.62]], mainStyle);

    // Outer bracts — large overlapping pointed petals
    const numBracts = 12;
    for (let i = 0; i < numBracts; i++) {
        const angle = (i / numBracts) * Math.PI * 2;
        const baseX = 0.50 + Math.cos(angle) * 0.08;
        const baseY = 0.38 + Math.sin(angle) * 0.06;
        const tipX = 0.50 + Math.cos(angle) * 0.28;
        const tipY = 0.38 + Math.sin(angle) * 0.24;
        const perpAngle = angle + Math.PI / 2;
        const w = 0.04;
        drawUV([
            [baseX, baseY],
            [tipX + Math.cos(perpAngle) * w, tipY + Math.sin(perpAngle) * w],
            [tipX + Math.cos(angle) * 0.02, tipY + Math.sin(angle) * 0.02],
            [tipX - Math.cos(perpAngle) * w, tipY - Math.sin(perpAngle) * w]
        ], mainStyle);
    }

    // Inner bracts — shorter, denser ring
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + 0.2;
        const baseX = 0.50 + Math.cos(angle) * 0.04;
        const baseY = 0.38 + Math.sin(angle) * 0.03;
        const tipX = 0.50 + Math.cos(angle) * 0.14;
        const tipY = 0.38 + Math.sin(angle) * 0.12;
        const perpAngle = angle + Math.PI / 2;
        const w = 0.025;
        drawUV([
            [baseX, baseY],
            [tipX + Math.cos(perpAngle) * w, tipY + Math.sin(perpAngle) * w],
            [tipX + Math.cos(angle) * 0.015, tipY + Math.sin(angle) * 0.015],
            [tipX - Math.cos(perpAngle) * w, tipY - Math.sin(perpAngle) * w]
        ], detailStyle);
    }

    // Central fuzzy dome
    const dome: [number, number][] = [];
    for (let i = 0; i <= 12; i++) {
        const t = (i / 12) * Math.PI * 2;
        const wobble = 1 + (r() - 0.5) * 0.2;
        dome.push([
            0.50 + Math.cos(t) * 0.06 * wobble,
            0.38 + Math.sin(t) * 0.05 * wobble
        ]);
    }
    drawUV(dome, mainStyle);

    // Fuzzy center texture
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        drawUV([
            [0.50, 0.38],
            [0.50 + Math.cos(angle) * 0.04, 0.38 + Math.sin(angle) * 0.035]
        ], 'line');
    }

    // Large leathery leaves
    drawUV([
        [0.47, 0.68], [0.38, 0.65], [0.28, 0.64],
        [0.22, 0.66], [0.20, 0.70], [0.24, 0.74],
        [0.32, 0.75], [0.42, 0.73], [0.47, 0.72]
    ], mainStyle);
    drawUV([[0.47, 0.70], [0.22, 0.68]], 'line');

    drawUV([
        [0.53, 0.68], [0.62, 0.65], [0.72, 0.64],
        [0.78, 0.66], [0.80, 0.70], [0.76, 0.74],
        [0.68, 0.75], [0.58, 0.73], [0.53, 0.72]
    ], mainStyle);
    drawUV([[0.53, 0.70], [0.78, 0.68]], 'line');
}
