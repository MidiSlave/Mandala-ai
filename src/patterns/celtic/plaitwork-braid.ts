// Plaitwork / Braid
import type { PatternContext } from '../types';
import { thickBand } from './helpers';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    const detailStyle = filled ? 'opaque-outline' as const : 'filled' as const;

    const bandW = 0.055;
    const n = 20;

    // Two diagonal ribbon paths weaving across the tile
    // Ribbon A: goes from bottom-left to top-right in a sinusoidal path
    const ribbonA: [number, number][] = [];
    for (let i = 0; i <= n; i++) {
        const t = i / n;
        const u = 0.05 + t * 0.90;
        const v = 0.25 + 0.50 * t + 0.12 * Math.sin(t * Math.PI * 3);
        ribbonA.push([u, Math.min(0.95, Math.max(0.05, v))]);
    }

    // Ribbon B: goes from top-left to bottom-right in opposite sinusoidal
    const ribbonB: [number, number][] = [];
    for (let i = 0; i <= n; i++) {
        const t = i / n;
        const u = 0.05 + t * 0.90;
        const v = 0.75 - 0.50 * t + 0.12 * Math.sin(t * Math.PI * 3 + Math.PI);
        ribbonB.push([u, Math.min(0.95, Math.max(0.05, v))]);
    }

    // Draw ribbon A (under layer)
    drawUV(thickBand(ribbonA, bandW), baseStyle);
    // Draw ribbon B (under layer)
    drawUV(thickBand(ribbonB, bandW), baseStyle);

    // Create crossings: ribbons cross ~3 times
    // At each crossing, mask and redraw the "over" ribbon
    for (let cross = 0; cross < 3; cross++) {
        const t = (cross + 0.5) / 3;
        const idx = Math.round(t * n);
        const crossU = ribbonA[idx][0];
        const crossV = (ribbonA[idx][1] + ribbonB[idx][1]) / 2;
        const ms = 0.06;

        // Mask the crossing area
        drawUV([
            [crossU - ms, crossV - ms], [crossU + ms, crossV - ms],
            [crossU + ms, crossV + ms], [crossU - ms, crossV + ms],
        ], 'opaque-outline');

        // Alternating: ribbon A over at even crossings, ribbon B over at odd
        const overRibbon = cross % 2 === 0 ? ribbonA : ribbonB;
        const startI = Math.max(0, idx - 3);
        const endI = Math.min(n, idx + 3);
        const seg = overRibbon.slice(startI, endI + 1);
        drawUV(thickBand(seg, bandW), baseStyle);
    }

    // Border frame (thick rectangular border)
    // Top edge
    drawUV([
        [0.0, 0.0], [1.0, 0.0],
        [1.0, 0.04], [0.0, 0.04],
    ], baseStyle);
    // Bottom edge
    drawUV([
        [0.0, 0.96], [1.0, 0.96],
        [1.0, 1.0], [0.0, 1.0],
    ], baseStyle);
    // Left edge
    drawUV([
        [0.0, 0.0], [0.04, 0.0],
        [0.04, 1.0], [0.0, 1.0],
    ], baseStyle);
    // Right edge
    drawUV([
        [0.96, 0.0], [1.0, 0.0],
        [1.0, 1.0], [0.96, 1.0],
    ], baseStyle);

    // Diamond accents at crossing points
    for (let cross = 0; cross < 3; cross++) {
        const t = (cross + 0.5) / 3;
        const idx = Math.round(t * n);
        const cu = ribbonA[idx][0];
        const cv = (ribbonA[idx][1] + ribbonB[idx][1]) / 2;
        const ds = 0.025;
        drawUV([
            [cu, cv - ds], [cu + ds, cv],
            [cu, cv + ds], [cu - ds, cv],
        ], detailStyle);
    }
}
