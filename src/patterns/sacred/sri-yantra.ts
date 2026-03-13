import type { PatternContext } from '../types';
import { circle, arcBand } from './helpers';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    const mainStyle = filled ? 'filled' as const : 'outline' as const;
    const detailStyle = filled ? 'opaque-outline' as const : 'filled' as const;

    const cx = 0.5, cy = 0.5;

    // Outer boundary thick ring
    drawUV(arcBand(cx, cy, 0.42, 0.47, 0, Math.PI * 2, 32), baseStyle);

    // Square bhupura frame
    const bw = 0.04;
    drawUV([[0.02, 0.02], [0.98, 0.02], [0.98, 0.02 + bw], [0.02, 0.02 + bw]], baseStyle);
    drawUV([[0.02, 0.98 - bw], [0.98, 0.98 - bw], [0.98, 0.98], [0.02, 0.98]], baseStyle);
    drawUV([[0.02, 0.02], [0.02 + bw, 0.02], [0.02 + bw, 0.98], [0.02, 0.98]], baseStyle);
    drawUV([[0.98 - bw, 0.02], [0.98, 0.02], [0.98, 0.98], [0.98 - bw, 0.98]], baseStyle);

    // Gate openings (opaque-outline cutouts at midpoints)
    drawUV([[0.40, 0.01], [0.60, 0.01], [0.60, 0.07], [0.40, 0.07]], detailStyle);
    drawUV([[0.40, 0.93], [0.60, 0.93], [0.60, 0.99], [0.40, 0.99]], detailStyle);
    drawUV([[0.01, 0.40], [0.07, 0.40], [0.07, 0.60], [0.01, 0.60]], detailStyle);
    drawUV([[0.93, 0.40], [0.99, 0.40], [0.99, 0.60], [0.93, 0.60]], detailStyle);

    // 4 upward triangles (bold, getting smaller)
    const upSizes = [0.40, 0.30, 0.20, 0.12];
    const tw = 0.035; // triangle band width
    for (const sz of upSizes) {
        const apex: [number, number] = [cx, cy - sz * 0.85];
        const left: [number, number] = [cx - sz, cy + sz * 0.55];
        const right: [number, number] = [cx + sz, cy + sz * 0.55];
        drawUV([apex, left, right], baseStyle);

        const isz = sz - tw * 2;
        if (isz > 0.03) {
            const iApex: [number, number] = [cx, cy - isz * 0.85];
            const iLeft: [number, number] = [cx - isz, cy + isz * 0.55];
            const iRight: [number, number] = [cx + isz, cy + isz * 0.55];
            drawUV([iApex, iLeft, iRight], detailStyle);
        }
    }

    // 4 downward triangles (inverted)
    const downSizes = [0.38, 0.28, 0.18, 0.10];
    for (const sz of downSizes) {
        const apex: [number, number] = [cx, cy + sz * 0.85];
        const left: [number, number] = [cx - sz, cy - sz * 0.55];
        const right: [number, number] = [cx + sz, cy - sz * 0.55];
        drawUV([apex, left, right], baseStyle);

        const isz = sz - tw * 2;
        if (isz > 0.03) {
            const iApex: [number, number] = [cx, cy + isz * 0.85];
            const iLeft: [number, number] = [cx - isz, cy - isz * 0.55];
            const iRight: [number, number] = [cx + isz, cy - isz * 0.55];
            drawUV([iApex, iLeft, iRight], detailStyle);
        }
    }

    // Central bindu — bold filled dot
    drawUV(circle(cx, cy, 0.05, 16), filled ? baseStyle : 'filled');
    drawUV(circle(cx, cy, 0.025, 12), detailStyle);
}
