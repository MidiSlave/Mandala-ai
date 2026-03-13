// Ring Knot
import type { PatternContext } from '../types';
import { arcCenterPoints, thickBand } from './helpers';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    const mainStyle = filled ? 'filled' as const : 'outline' as const;
    const detailStyle = filled ? 'opaque-outline' as const : 'filled' as const;

    const cx = 0.50, cy = 0.50;
    const bandW = 0.05;
    const n = 28;

    // Main circular band
    const mainCircle = arcCenterPoints(cx, cy, 0.30, 0, Math.PI * 2, n);
    drawUV(thickBand(mainCircle, bandW), baseStyle);

    // Inner circular band (smaller, offset slightly)
    const innerCircle = arcCenterPoints(cx, cy, 0.16, 0, Math.PI * 2, n);
    drawUV(thickBand(innerCircle, bandW), baseStyle);

    // Four connecting bridges between inner and outer rings (creating the knot)
    const bridgeAngles = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];
    for (let i = 0; i < 4; i++) {
        const a = bridgeAngles[i];

        // Bridge: straight band from inner ring to outer ring
        const innerU = cx + 0.16 * Math.cos(a);
        const innerV = cy + 0.16 * Math.sin(a);
        const outerU = cx + 0.30 * Math.cos(a);
        const outerV = cy + 0.30 * Math.sin(a);

        const bridgePts: [number, number][] = [];
        for (let j = 0; j <= 8; j++) {
            const t = j / 8;
            bridgePts.push([
                innerU + t * (outerU - innerU),
                innerV + t * (outerV - innerV),
            ]);
        }
        drawUV(thickBand(bridgePts, bandW * 0.9), baseStyle);
    }

    // Create over-under crossings at the 4 points where bridges meet the rings
    // Mask and redraw alternating ring segments over bridges
    for (let i = 0; i < 4; i++) {
        const a = bridgeAngles[i];
        const crossR = i % 2 === 0 ? 0.30 : 0.16; // alternate inner/outer
        const mx = cx + crossR * Math.cos(a);
        const my = cy + crossR * Math.sin(a);
        const ms = 0.055;

        drawUV([
            [mx - ms, my - ms], [mx + ms, my - ms],
            [mx + ms, my + ms], [mx - ms, my + ms],
        ], 'opaque-outline');

        // Redraw ring segment over the bridge
        const spanAngle = 0.4;
        const segPts = arcCenterPoints(cx, cy, crossR, a - spanAngle, a + spanAngle, 10);
        drawUV(thickBand(segPts, bandW), baseStyle);
    }

    // For the other 4 crossings (where the ring passes under)
    for (let i = 0; i < 4; i++) {
        const a = bridgeAngles[i];
        const crossR = i % 2 === 0 ? 0.16 : 0.30;
        const mx = cx + crossR * Math.cos(a);
        const my = cy + crossR * Math.sin(a);
        const ms = 0.055;

        drawUV([
            [mx - ms, my - ms], [mx + ms, my - ms],
            [mx + ms, my + ms], [mx - ms, my + ms],
        ], 'opaque-outline');

        // Redraw bridge segment over the ring
        const innerU = cx + 0.16 * Math.cos(a);
        const innerV = cy + 0.16 * Math.sin(a);
        const outerU = cx + 0.30 * Math.cos(a);
        const outerV = cy + 0.30 * Math.sin(a);

        const tStart = crossR === 0.16 ? 0.0 : 0.5;
        const tEnd = crossR === 0.16 ? 0.5 : 1.0;
        const segPts: [number, number][] = [];
        for (let j = 0; j <= 6; j++) {
            const t = tStart + (j / 6) * (tEnd - tStart);
            segPts.push([
                innerU + t * (outerU - innerU),
                innerV + t * (outerV - innerV),
            ]);
        }
        drawUV(thickBand(segPts, bandW * 0.9), baseStyle);
    }

    // Central detail: small filled circle
    const centerDot = arcCenterPoints(cx, cy, 0.05, 0, Math.PI * 2, 12);
    drawUV(centerDot, detailStyle);

    // Outer decorative ring
    const outerDeco = arcCenterPoints(cx, cy, 0.42, 0, Math.PI * 2, 30);
    drawUV(thickBand(outerDeco, 0.025), baseStyle);

    // Small diamond accents between bridges on outer ring
    for (let i = 0; i < 4; i++) {
        const a = bridgeAngles[i] + Math.PI / 4;
        const dx = cx + 0.37 * Math.cos(a);
        const dy = cy + 0.37 * Math.sin(a);
        const ds = 0.03;
        drawUV([
            [dx, dy - ds], [dx + ds, dy],
            [dx, dy + ds], [dx - ds, dy],
        ], mainStyle);
    }
}
