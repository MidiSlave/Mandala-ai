// Fan / Palmette — concentric arc bands like a hand fan
import type { PatternContext } from '../types';
import { filledRect, arcBand, thickBand } from './helpers';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    const mainStyle = filled ? 'filled' as const : 'outline' as const;
    const detailStyle = filled ? 'opaque-outline' as const : 'filled' as const;

    const cx = 0.5;
    const cy = 0.0; // fan opens upward from bottom

    // Concentric arc bands from inner to outer
    const bandRadii = [
        { inner: 0.06, outer: 0.16 },
        { inner: 0.20, outer: 0.30 },
        { inner: 0.34, outer: 0.44 },
        { inner: 0.48, outer: 0.56 },
        { inner: 0.60, outer: 0.70 },
        { inner: 0.74, outer: 0.82 },
    ];

    for (let i = 0; i < bandRadii.length; i++) {
        const { inner, outer } = bandRadii[i];
        const band = arcBand(cx, cy, inner, outer, 0.12, Math.PI - 0.12, 30);
        const style = i % 2 === 0 ? baseStyle : detailStyle;
        drawUV(band, style);
    }

    // Thin separator bands between main bands
    const separators = [0.17, 0.31, 0.45, 0.57, 0.71];
    for (const r of separators) {
        const sep = arcBand(cx, cy, r, r + 0.025, 0.15, Math.PI - 0.15, 26);
        drawUV(sep, filled ? 'filled' : 'outline');
    }

    // Decorative base pedestal
    drawUV(filledRect(0.32, 0.0, 0.68, 0.06), baseStyle);
    drawUV(filledRect(0.38, 0.0, 0.62, 0.02), detailStyle);

    // Radial spine lines (as filled bands for boldness)
    const numSpines = 7;
    for (let i = 0; i < numSpines; i++) {
        const angle = 0.25 + (i / (numSpines - 1)) * (Math.PI - 0.50);
        const u1 = cx + 0.08 * Math.cos(angle);
        const v1 = cy + 0.08 * Math.sin(angle);
        const u2 = cx + 0.80 * Math.cos(angle);
        const v2 = cy + 0.80 * Math.sin(angle);
        drawUV(thickBand(u1, v1, u2, v2, 0.02), filled ? 'opaque-outline' : 'filled');
    }

    // Top decorative arc
    drawUV(arcBand(cx, cy, 0.84, 0.90, 0.2, Math.PI - 0.2, 28), mainStyle);

    // Small filled circles at fan tips
    const tipAngles = [0.3, 0.7, Math.PI / 2, Math.PI - 0.7, Math.PI - 0.3];
    for (const angle of tipAngles) {
        const tu = cx + 0.87 * Math.cos(angle);
        const tv = cy + 0.87 * Math.sin(angle);
        const dotR = 0.025;
        const dot: [number, number][] = [];
        for (let j = 0; j < 8; j++) {
            const a = (j / 8) * Math.PI * 2;
            dot.push([tu + dotR * Math.cos(a), tv + dotR * Math.sin(a)]);
        }
        drawUV(dot, 'filled');
    }

    // Outermost border band
    drawUV(arcBand(cx, cy, 0.91, 0.96, 0.25, Math.PI - 0.25, 24), baseStyle);
}
