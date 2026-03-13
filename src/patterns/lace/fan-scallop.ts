// Fan Scallop
import type { PatternContext } from '../types';
import { circlePoints, arcToBand, lineToWedge } from './helpers';

export function draw({ drawUV }: PatternContext): void {
    const numRibs = 9;
    const base: [number, number] = [0.5, 0.0];
    const fanRadius = 0.82;
    const ribWidth = 0.018;

    for (let i = 0; i < numRibs; i++) {
        const t = (i + 0.5) / numRibs;
        const angle = Math.PI * t;
        const outerU = 0.5 - 0.48 * Math.cos(angle);
        const outerV = fanRadius * Math.sin(angle);
        const dx = outerU - base[0];
        const dy = outerV - base[1];
        const len = Math.sqrt(dx * dx + dy * dy);
        const nx = -dy / len;
        const ny = dx / len;

        const rib: [number, number][] = [
            [base[0], base[1]],
            [base[0] + dx * 0.15 + nx * ribWidth * 0.5, base[1] + dy * 0.15 + ny * ribWidth * 0.5],
            [outerU + nx * ribWidth, outerV + ny * ribWidth],
            [outerU, outerV],
            [outerU - nx * ribWidth, outerV - ny * ribWidth],
            [base[0] + dx * 0.15 - nx * ribWidth * 0.5, base[1] + dy * 0.15 - ny * ribWidth * 0.5],
        ];
        drawUV(rib, 'filled');
    }

    for (let i = 0; i <= numRibs; i++) {
        const t = i / numRibs;
        const angle = Math.PI * t;
        const outerU = 0.5 - 0.48 * Math.cos(angle);
        const outerV = fanRadius * Math.sin(angle);
        const wedge = lineToWedge(base[0], base[1], outerU, outerV, 0.003, 0.015);
        drawUV(wedge, 'filled');
    }

    const innerArc: [number, number][] = [];
    for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        const angle = Math.PI * t;
        innerArc.push([0.5 - 0.18 * Math.cos(angle), 0.28 * Math.sin(angle)]);
    }
    drawUV(arcToBand(innerArc, 0.012), 'filled');

    const midArc: [number, number][] = [];
    for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        const angle = Math.PI * t;
        midArc.push([0.5 - 0.30 * Math.cos(angle), 0.48 * Math.sin(angle)]);
    }
    drawUV(arcToBand(midArc, 0.012), 'filled');

    const outerArc: [number, number][] = [];
    for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        const angle = Math.PI * t;
        outerArc.push([0.5 - 0.42 * Math.cos(angle), 0.68 * Math.sin(angle)]);
    }
    drawUV(arcToBand(outerArc, 0.012), 'filled');

    const scallopCount = 8;
    for (let i = 0; i < scallopCount; i++) {
        const t0 = i / scallopCount;
        const t1 = (i + 1) / scallopCount;
        const miniArc: [number, number][] = [];
        for (let j = 0; j <= 5; j++) {
            const t = t0 + (t1 - t0) * (j / 5);
            const angle = Math.PI * t;
            const u = 0.5 - 0.48 * Math.cos(angle);
            const v = fanRadius * Math.sin(angle);
            const nudge = 0.035 * Math.sin(Math.PI * (j / 5));
            miniArc.push([u, v + nudge]);
        }
        drawUV(arcToBand(miniArc, 0.012), 'filled');
    }

    for (let i = 0; i < numRibs; i++) {
        const t = (i + 0.5) / numRibs;
        const angle = Math.PI * t;
        const u = 0.5 - 0.48 * Math.cos(angle);
        const v = fanRadius * Math.sin(angle);
        drawUV(circlePoints(u, v, 0.015, 6), 'filled');
    }

    drawUV(circlePoints(0.5, 0.0, 0.025, 8), 'filled');
}
