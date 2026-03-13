// Bobbin Lace Eye
import type { PatternContext } from '../types';
import { circlePoints, teardrop, lineToBand, arcToBand } from './helpers';

export function draw({ drawUV, filled }: PatternContext): void {
    const cx = 0.5;
    const cy = 0.5;
    const segs = 24;

    const vesica = (
        leftU: number, rightU: number,
        topBulge: number, botBulge: number, n: number
    ): [number, number][] => {
        const pts: [number, number][] = [];
        for (let i = 0; i <= n; i++) {
            const t = i / n;
            const u = leftU + (rightU - leftU) * t;
            const b = Math.sin(Math.PI * t);
            pts.push([u, cy - topBulge * b]);
        }
        for (let i = n; i >= 0; i--) {
            const t = i / n;
            const u = leftU + (rightU - leftU) * t;
            const b = Math.sin(Math.PI * t);
            pts.push([u, cy + botBulge * b]);
        }
        return pts;
    };

    const outerEye = vesica(0.03, 0.97, 0.40, 0.40, segs);
    const innerEye = vesica(0.08, 0.92, 0.32, 0.32, segs);

    if (filled) {
        drawUV(outerEye, 'filled');
        drawUV(innerEye, 'opaque-outline');
    } else {
        drawUV(outerEye, 'filled');
        drawUV(innerEye, 'opaque-outline');
    }

    const midEye = vesica(0.14, 0.86, 0.25, 0.25, segs);
    drawUV(midEye, 'filled');

    const innerLayer = vesica(0.22, 0.78, 0.17, 0.17, segs);
    drawUV(innerLayer, 'filled');

    const innermostLayer = vesica(0.28, 0.72, 0.12, 0.12, segs);
    if (filled) {
        drawUV(innermostLayer, 'opaque-outline');
    } else {
        drawUV(innermostLayer, 'opaque-outline');
    }

    const spokeCount = 12;
    for (let i = 0; i < spokeCount; i++) {
        const angle = (2 * Math.PI * i) / spokeCount;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const reach = 0.32;
        const endU = cx + reach * cosA;
        const endV = cy + reach * sinA;
        const band = lineToBand(cx, cy, endU, endV, 0.012);
        drawUV(band, 'filled');
    }

    const starPetals = 8;
    const starR = 0.10;
    for (let i = 0; i < starPetals; i++) {
        const angle = (2 * Math.PI * i) / starPetals;
        const tipU = cx + starR * Math.cos(angle);
        const tipV = cy + starR * Math.sin(angle);
        const petal = teardrop(cx, cy, tipU, tipV, 0.035, 5);
        if (filled) {
            drawUV(petal, i % 2 === 0 ? 'filled' : 'opaque-outline');
        } else {
            drawUV(petal, 'filled');
        }
    }

    drawUV(circlePoints(cx, cy, 0.03, 8), 'filled');
    drawUV(circlePoints(cx, cy, 0.13, 20), 'filled');

    const scallopN = 7;
    for (let i = 0; i < scallopN; i++) {
        const t0 = (i + 0.5) / (scallopN + 1);
        const u0 = 0.03 + 0.94 * t0;
        const bulge0 = Math.sin(Math.PI * t0);
        const sv = cy - 0.40 * bulge0;
        const arcPts: [number, number][] = [];
        for (let j = 0; j <= 6; j++) {
            const a = Math.PI * (j / 6);
            arcPts.push([u0 + 0.045 * Math.cos(a), sv - 0.04 * Math.sin(a)]);
        }
        drawUV(arcToBand(arcPts, 0.012), 'filled');
    }

    for (let i = 0; i < scallopN; i++) {
        const t0 = (i + 0.5) / (scallopN + 1);
        const u0 = 0.03 + 0.94 * t0;
        const bulge0 = Math.sin(Math.PI * t0);
        const sv = cy + 0.40 * bulge0;
        const arcPts: [number, number][] = [];
        for (let j = 0; j <= 6; j++) {
            const a = Math.PI * (j / 6);
            arcPts.push([u0 + 0.045 * Math.cos(a), sv + 0.04 * Math.sin(a)]);
        }
        drawUV(arcToBand(arcPts, 0.012), 'filled');
    }

    drawUV(circlePoints(0.03, cy, 0.025, 6), 'filled');
    drawUV(circlePoints(0.97, cy, 0.025, 6), 'filled');

    const cornerPositions: [number, number][] = [
        [0.08, 0.08], [0.92, 0.08], [0.08, 0.92], [0.92, 0.92],
    ];
    for (const [cu, cv] of cornerPositions) {
        drawUV(circlePoints(cu, cv, 0.05, 8), 'filled');
        drawUV(circlePoints(cu, cv, 0.02, 6), 'filled');
    }
}
