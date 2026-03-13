// Quaternary Knot (four interlaced loops)
import type { PatternContext } from '../types';
import { arcCenterPoints, thickBand } from './helpers';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    const mainStyle = filled ? 'filled' as const : 'outline' as const;
    const detailStyle = filled ? 'opaque-outline' as const : 'filled' as const;

    const cx = 0.50, cy = 0.50;
    const lobeR = 0.17;
    const bandW = 0.045;
    const n = 24;

    // Four lobe centers arranged in a diamond
    const lobeCenters: [number, number][] = [
        [cx, cy - 0.20],     // top
        [cx + 0.20, cy],     // right
        [cx, cy + 0.20],     // bottom
        [cx - 0.20, cy],     // left
    ];

    // Draw each lobe as a full circle band
    for (let i = 0; i < 4; i++) {
        const [lx, ly] = lobeCenters[i];
        const lobeCircle = arcCenterPoints(lx, ly, lobeR, 0, Math.PI * 2, n);
        drawUV(thickBand(lobeCircle, bandW), baseStyle);
    }

    // Create crossings between adjacent lobes (8 crossing points)
    // Each pair of adjacent lobes has 2 crossing points
    const pairs: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 0]];
    for (let p = 0; p < pairs.length; p++) {
        const [a, b] = pairs[p];
        const [ax, ay] = lobeCenters[a];
        const [bx, by] = lobeCenters[b];

        // Midpoint between the two lobe centers
        const midX = (ax + bx) / 2;
        const midY = (ay + by) / 2;

        // Mask at crossing
        const ms = 0.055;
        drawUV([
            [midX - ms, midY - ms], [midX + ms, midY - ms],
            [midX + ms, midY + ms], [midX - ms, midY + ms],
        ], 'opaque-outline');

        // Determine which lobe passes over (alternate)
        const overIdx = p % 2 === 0 ? a : b;
        const [ox, oy] = lobeCenters[overIdx];

        // Compute angle from the over-lobe center to the midpoint
        const angleToMid = Math.atan2(midY - oy, midX - ox);
        const spanAngle = 0.5;
        const overSeg = arcCenterPoints(ox, oy, lobeR,
            angleToMid - spanAngle, angleToMid + spanAngle, 10);
        drawUV(thickBand(overSeg, bandW), baseStyle);
    }

    // Central diamond detail
    const ds = 0.06;
    drawUV([
        [cx, cy - ds], [cx + ds, cy],
        [cx, cy + ds], [cx - ds, cy],
    ], detailStyle);

    // Smaller inner diamond
    const ds2 = 0.03;
    drawUV([
        [cx, cy - ds2], [cx + ds2, cy],
        [cx, cy + ds2], [cx - ds2, cy],
    ], mainStyle);

    // Outer border: thick square frame
    const frameW = 0.03;
    // Top
    drawUV([
        [0.02, 0.02], [0.98, 0.02],
        [0.98, 0.02 + frameW], [0.02, 0.02 + frameW],
    ], baseStyle);
    // Bottom
    drawUV([
        [0.02, 0.98 - frameW], [0.98, 0.98 - frameW],
        [0.98, 0.98], [0.02, 0.98],
    ], baseStyle);
    // Left
    drawUV([
        [0.02, 0.02], [0.02 + frameW, 0.02],
        [0.02 + frameW, 0.98], [0.02, 0.98],
    ], baseStyle);
    // Right
    drawUV([
        [0.98 - frameW, 0.02], [0.98, 0.02],
        [0.98, 0.98], [0.98 - frameW, 0.98],
    ], baseStyle);

    // Corner knot dots
    const cdot = 0.03;
    const cornerPts: [number, number][] = [
        [0.08, 0.08], [0.92, 0.08], [0.08, 0.92], [0.92, 0.92]
    ];
    for (const [du, dv] of cornerPts) {
        const cornerCircle = arcCenterPoints(du, dv, cdot, 0, Math.PI * 2, 10);
        drawUV(cornerCircle, mainStyle);
    }

    // Diagonal accent bands connecting corners to lobes
    if (filled) {
        // Small triangular fills in the gaps between lobes
        drawUV([
            [cx - 0.08, cy - 0.08],
            [cx, cy - 0.04],
            [cx - 0.04, cy],
        ], 'opaque-outline');
        drawUV([
            [cx + 0.08, cy - 0.08],
            [cx, cy - 0.04],
            [cx + 0.04, cy],
        ], 'opaque-outline');
        drawUV([
            [cx + 0.08, cy + 0.08],
            [cx, cy + 0.04],
            [cx + 0.04, cy],
        ], 'opaque-outline');
        drawUV([
            [cx - 0.08, cy + 0.08],
            [cx, cy + 0.04],
            [cx - 0.04, cy],
        ], 'opaque-outline');
    } else {
        // In outline mode, fill the center area for visual weight
        drawUV([
            [cx - 0.08, cy - 0.08],
            [cx + 0.08, cy - 0.08],
            [cx + 0.08, cy + 0.08],
            [cx - 0.08, cy + 0.08],
        ], 'filled');
    }
}
