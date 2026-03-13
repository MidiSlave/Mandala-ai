// Lace Medallion
import type { PatternContext } from '../types';
import { circlePoints, diamond, teardrop, lineToBand } from './helpers';

export function draw({ drawUV, filled }: PatternContext): void {
    const cx = 0.5;
    const cy = 0.5;
    const outerR = 0.46;
    const ringSegs = 32;

    const outerRing = circlePoints(cx, cy, outerR, ringSegs);
    const outerRingInner = circlePoints(cx, cy, outerR - 0.04, ringSegs);
    if (filled) {
        drawUV(outerRing, 'filled');
        drawUV(outerRingInner, 'opaque-outline');
    } else {
        drawUV(outerRing, 'filled');
        drawUV(outerRingInner, 'opaque-outline');
    }

    const scallopN = 12;
    for (let i = 0; i < scallopN; i++) {
        const angle = (2 * Math.PI * i) / scallopN;
        const su = cx + (outerR + 0.04) * Math.cos(angle);
        const sv = cy + (outerR + 0.04) * Math.sin(angle);
        drawUV(circlePoints(su, sv, 0.035, 8), 'filled');
    }

    const ring2R = 0.35;
    drawUV(circlePoints(cx, cy, ring2R, ringSegs), 'filled');

    const petalCount = 12;
    for (let i = 0; i < petalCount; i++) {
        const angle = (2 * Math.PI * i) / petalCount;
        const innerU = cx + ring2R * Math.cos(angle);
        const innerV = cy + ring2R * Math.sin(angle);
        const outerU = cx + (outerR - 0.05) * Math.cos(angle);
        const outerV = cy + (outerR - 0.05) * Math.sin(angle);
        const petal = teardrop(innerU, innerV, outerU, outerV, 0.05, 5);
        if (filled) {
            drawUV(petal, i % 2 === 0 ? 'filled' : 'opaque-outline');
        } else {
            drawUV(petal, 'filled');
        }
    }

    const ring3R = 0.24;
    const ring3 = circlePoints(cx, cy, ring3R, ringSegs);
    const ring3inner = circlePoints(cx, cy, ring3R - 0.03, ringSegs);
    if (filled) {
        drawUV(ring3, 'filled');
        drawUV(ring3inner, 'opaque-outline');
    } else {
        drawUV(ring3, 'filled');
        drawUV(ring3inner, 'opaque-outline');
    }

    const dotCount = 12;
    for (let i = 0; i < dotCount; i++) {
        const angle = (2 * Math.PI * i) / dotCount + Math.PI / dotCount;
        const du = cx + ring2R * Math.cos(angle);
        const dv = cy + ring2R * Math.sin(angle);
        drawUV(circlePoints(du, dv, 0.02, 6), 'filled');
    }

    const spokeCount = 8;
    for (let i = 0; i < spokeCount; i++) {
        const angle = (2 * Math.PI * i) / spokeCount;
        const eu = cx + (ring3R - 0.04) * Math.cos(angle);
        const ev = cy + (ring3R - 0.04) * Math.sin(angle);
        const band = lineToBand(cx, cy, eu, ev, 0.012);
        drawUV(band, 'filled');
    }

    const starPoints = 8;
    const starOuterR = 0.12;
    const starInnerR = 0.06;
    const starShape: [number, number][] = [];
    for (let i = 0; i < starPoints * 2; i++) {
        const angle = (Math.PI * i) / starPoints - Math.PI / 2;
        const r = i % 2 === 0 ? starOuterR : starInnerR;
        starShape.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
    }
    drawUV(starShape, 'filled');

    drawUV(circlePoints(cx, cy, 0.03, 8), 'filled');
    drawUV(circlePoints(cx, cy, 0.15, 16), 'filled');

    const cornerR = 0.09;
    const corners: [number, number][] = [
        [0.04, 0.04], [0.96, 0.04], [0.04, 0.96], [0.96, 0.96],
    ];
    for (const [cu, cv] of corners) {
        const fan: [number, number][] = [[cu, cv]];
        const startAngle = cu < 0.5
            ? (cv < 0.5 ? 0 : -Math.PI / 2)
            : (cv < 0.5 ? Math.PI / 2 : Math.PI);
        for (let i = 0; i <= 8; i++) {
            const a = startAngle + (Math.PI / 2) * (i / 8);
            fan.push([cu + cornerR * Math.cos(a), cv + cornerR * Math.sin(a)]);
        }
        drawUV(fan, 'filled');
    }

    const edgeMids: [number, number][] = [
        [0.5, 0.02], [0.5, 0.98], [0.02, 0.5], [0.98, 0.5],
    ];
    for (const [eu, ev] of edgeMids) {
        drawUV(diamond(eu, ev, 0.04), 'filled');
    }
}
