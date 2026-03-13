// Spiral Triskelion
import type { PatternContext } from '../types';
import { arcCenterPoints, thickBand } from './helpers';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    const mainStyle = filled ? 'filled' as const : 'outline' as const;
    const detailStyle = filled ? 'opaque-outline' as const : 'filled' as const;

    const cx = 0.50, cy = 0.50;
    const bandW = 0.05;
    const n = 30;

    // Three spiral arms, each rotated 120 degrees apart
    for (let arm = 0; arm < 3; arm++) {
        const baseAngle = (arm / 3) * Math.PI * 2 - Math.PI / 2;
        const pts: [number, number][] = [];

        // Spiral from center outward: r increases, angle sweeps ~270 degrees
        for (let i = 0; i <= n; i++) {
            const t = i / n;
            const r = 0.04 + t * 0.36;
            const a = baseAngle + t * Math.PI * 1.5;
            pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
        }

        const band = thickBand(pts, bandW);
        drawUV(band, baseStyle);

        // Spiral end cap (small filled circle)
        const endPt = pts[pts.length - 1];
        const capR = 0.035;
        const cap = arcCenterPoints(endPt[0], endPt[1], capR, 0, Math.PI * 2, 12);
        drawUV(cap, mainStyle);
    }

    // Central hub circle
    const hubOuter = arcCenterPoints(cx, cy, 0.08, 0, Math.PI * 2, 16);
    drawUV(hubOuter, detailStyle);

    const hubInner = arcCenterPoints(cx, cy, 0.04, 0, Math.PI * 2, 12);
    drawUV(hubInner, mainStyle);

    // Three crossing masks at the center where spirals overlap
    for (let arm = 0; arm < 3; arm++) {
        const baseAngle = (arm / 3) * Math.PI * 2 - Math.PI / 2;
        const maskAngle = baseAngle + Math.PI * 0.6;
        const mr = 0.16;
        const mx = cx + mr * Math.cos(maskAngle);
        const my = cy + mr * Math.sin(maskAngle);
        const ms = 0.05;
        drawUV([
            [mx - ms, my - ms], [mx + ms, my - ms],
            [mx + ms, my + ms], [mx - ms, my + ms],
        ], 'opaque-outline');

        // Redraw the arm segment over the mask
        const pts: [number, number][] = [];
        const nextArm = (arm + 1) % 3;
        const nextBase = (nextArm / 3) * Math.PI * 2 - Math.PI / 2;
        for (let i = 0; i <= 10; i++) {
            const t = 0.25 + (i / 10) * 0.25;
            const r = 0.04 + t * 0.36;
            const a = nextBase + t * Math.PI * 1.5;
            pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
        }
        drawUV(thickBand(pts, bandW), baseStyle);
    }

    // Outer border ring
    const outerRing = arcCenterPoints(cx, cy, 0.46, 0, Math.PI * 2, 30);
    drawUV(thickBand(outerRing, 0.025), baseStyle);
}
