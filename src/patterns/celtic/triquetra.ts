// Triquetra (Trinity Knot)
import type { PatternContext } from '../types';
import { arcCenterPoints, thickBand } from './helpers';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    const mainStyle = filled ? 'filled' as const : 'outline' as const;
    const detailStyle = filled ? 'opaque-outline' as const : 'filled' as const;

    const cx = 0.50, cy = 0.50;
    const lobeR = 0.22;
    const bandW = 0.05;
    const n = 24;

    // Three lobe centers arranged in a triangle
    const lobeCenters: [number, number][] = [
        [cx, cy - 0.18],                                    // top
        [cx - 0.16, cy + 0.10],                             // bottom-left
        [cx + 0.16, cy + 0.10],                             // bottom-right
    ];

    // Draw each lobe as a thick circular band
    const lobeAngles: [number, number][] = [
        [-Math.PI * 0.15, Math.PI * 1.15],   // top lobe
        [Math.PI * 0.52, Math.PI * 1.82],     // bottom-left
        [-Math.PI * 0.82, Math.PI * 0.48],    // bottom-right
    ];

    // Layer 1: Draw all three lobes as filled bands (the "under" parts)
    for (let i = 0; i < 3; i++) {
        const [lx, ly] = lobeCenters[i];
        const [sa, ea] = lobeAngles[i];
        const center = arcCenterPoints(lx, ly, lobeR, sa, ea, n);
        const band = thickBand(center, bandW);
        drawUV(band, baseStyle);
    }

    // Layer 2: Create crossing illusions with opaque-outline masks then filled overlays
    // Crossing 1: top lobe passes OVER bottom-right lobe at top-right
    {
        const maskPts: [number, number][] = [
            [cx + 0.06, cy - 0.10],
            [cx + 0.16, cy - 0.10],
            [cx + 0.16, cy + 0.00],
            [cx + 0.06, cy + 0.00],
        ];
        drawUV(maskPts, 'opaque-outline');
        // Redraw top lobe segment over the mask
        const topSeg = arcCenterPoints(lobeCenters[0][0], lobeCenters[0][1], lobeR,
            Math.PI * 0.15, Math.PI * 0.55, 10);
        drawUV(thickBand(topSeg, bandW), baseStyle);
    }

    // Crossing 2: bottom-right lobe passes OVER bottom-left lobe at bottom
    {
        const maskPts: [number, number][] = [
            [cx - 0.05, cy + 0.14],
            [cx + 0.05, cy + 0.14],
            [cx + 0.05, cy + 0.26],
            [cx - 0.05, cy + 0.26],
        ];
        drawUV(maskPts, 'opaque-outline');
        const brSeg = arcCenterPoints(lobeCenters[2][0], lobeCenters[2][1], lobeR,
            Math.PI * 0.48, Math.PI * 0.95, 10);
        drawUV(thickBand(brSeg, bandW), baseStyle);
    }

    // Crossing 3: bottom-left lobe passes OVER top lobe at top-left
    {
        const maskPts: [number, number][] = [
            [cx - 0.16, cy - 0.10],
            [cx - 0.06, cy - 0.10],
            [cx - 0.06, cy + 0.00],
            [cx - 0.16, cy + 0.00],
        ];
        drawUV(maskPts, 'opaque-outline');
        const blSeg = arcCenterPoints(lobeCenters[1][0], lobeCenters[1][1], lobeR,
            Math.PI * 1.45, Math.PI * 1.82, 10);
        drawUV(thickBand(blSeg, bandW), baseStyle);
    }

    // Central triangle detail
    drawUV([
        [cx, cy - 0.06],
        [cx + 0.05, cy + 0.04],
        [cx - 0.05, cy + 0.04],
    ], detailStyle);

    // Outer circle border
    const outerCircle = arcCenterPoints(cx, cy, 0.44, 0, Math.PI * 2, 30);
    drawUV(thickBand(outerCircle, 0.03), baseStyle);

    // Corner accent dots
    const dotS = 0.03;
    const corners: [number, number][] = [[0.06, 0.06], [0.94, 0.06], [0.06, 0.94], [0.94, 0.94]];
    for (const [du, dv] of corners) {
        drawUV([
            [du - dotS, dv - dotS], [du + dotS, dv - dotS],
            [du + dotS, dv + dotS], [du - dotS, dv + dotS],
        ], mainStyle);
    }
}
