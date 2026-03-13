// Sun disk — concentric rings with radiating triangular rays
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    const cx = 0.5, cy = 0.5;

    // Outer ray ring: 10 triangular rays
    const numRays = 10;
    for (let i = 0; i < numRays; i++) {
        const angle = (i / numRays) * Math.PI * 2;
        const halfAngle = (0.3 / numRays) * Math.PI * 2;
        const tipU = cx + 0.47 * Math.cos(angle);
        const tipV = cy + 0.47 * Math.sin(angle);
        const baseU1 = cx + 0.30 * Math.cos(angle - halfAngle);
        const baseV1 = cy + 0.30 * Math.sin(angle - halfAngle);
        const baseU2 = cx + 0.30 * Math.cos(angle + halfAngle);
        const baseV2 = cy + 0.30 * Math.sin(angle + halfAngle);
        drawUV([
            [tipU, tipV],
            [baseU1, baseV1],
            [baseU2, baseV2],
        ], baseStyle);
    }

    // Outer ring band (ring between r=0.26 and r=0.32)
    const outerBandOuter: [number, number][] = [];
    const outerBandInner: [number, number][] = [];
    const segments = 20;
    for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        outerBandOuter.push([cx + 0.32 * Math.cos(angle), cy + 0.32 * Math.sin(angle)]);
        outerBandInner.push([cx + 0.26 * Math.cos(angle), cy + 0.26 * Math.sin(angle)]);
    }
    drawUV(outerBandOuter, filled ? 'opaque-outline' : 'outline');
    drawUV(outerBandInner, filled ? baseStyle : 'outline');

    // Middle ring (r=0.18)
    const middleRing: [number, number][] = [];
    for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        middleRing.push([cx + 0.18 * Math.cos(angle), cy + 0.18 * Math.sin(angle)]);
    }
    drawUV(middleRing, filled ? 'opaque-outline' : 'outline');

    // Central filled circle (r=0.10)
    const centerCircle: [number, number][] = [];
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        centerCircle.push([cx + 0.10 * Math.cos(angle), cy + 0.10 * Math.sin(angle)]);
    }
    drawUV(centerCircle, filled ? 'opaque-outline' : 'filled');

    // Inner cross detail (4-pointed star through center)
    drawUV([[cx, cy - 0.18], [cx, cy + 0.18]], 'line');
    drawUV([[cx - 0.18, cy], [cx + 0.18, cy]], 'line');

    // Diagonal accent lines between rings
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const u1 = cx + 0.19 * Math.cos(angle);
        const v1 = cy + 0.19 * Math.sin(angle);
        const u2 = cx + 0.25 * Math.cos(angle);
        const v2 = cy + 0.25 * Math.sin(angle);
        drawUV([[u1, v1], [u2, v2]], 'line');
    }

    // Corner accent squares (fills corners that the circle doesn't reach)
    const cornerDots: [number, number][] = [
        [0.06, 0.06], [0.94, 0.06], [0.06, 0.94], [0.94, 0.94]
    ];
    const cdot = 0.04;
    for (const [du, dv] of cornerDots) {
        drawUV([
            [du - cdot, dv - cdot], [du + cdot, dv - cdot],
            [du + cdot, dv + cdot], [du - cdot, dv + cdot],
        ], 'filled');
    }
}
