// Filet Crochet Grid
import type { PatternContext } from '../types';
import { circlePoints, lineToBand } from './helpers';

export function draw({ drawUV, filled }: PatternContext): void {
    const gridN = 4;
    const margin = 0.04;
    const cellW = (1 - 2 * margin) / gridN;
    const bandW = 0.025;

    const outerFrame: [number, number][] = [
        [margin - bandW, margin - bandW],
        [1 - margin + bandW, margin - bandW],
        [1 - margin + bandW, 1 - margin + bandW],
        [margin - bandW, 1 - margin + bandW],
    ];
    const innerFrame: [number, number][] = [
        [margin, margin],
        [1 - margin, margin],
        [1 - margin, 1 - margin],
        [margin, 1 - margin],
    ];
    if (filled) {
        drawUV(outerFrame, 'filled');
        drawUV(innerFrame, 'opaque-outline');
    } else {
        drawUV(outerFrame, 'filled');
        drawUV(innerFrame, 'opaque-outline');
    }

    for (let row = 1; row < gridN; row++) {
        const v0 = margin + row * cellW - bandW * 0.5;
        const v1 = margin + row * cellW + bandW * 0.5;
        drawUV([[margin, v0], [1 - margin, v0], [1 - margin, v1], [margin, v1]], 'filled');
    }

    for (let col = 1; col < gridN; col++) {
        const u0 = margin + col * cellW - bandW * 0.5;
        const u1 = margin + col * cellW + bandW * 0.5;
        drawUV([[u0, margin], [u1, margin], [u1, 1 - margin], [u0, 1 - margin]], 'filled');
    }

    for (let row = 0; row < gridN; row++) {
        for (let col = 0; col < gridN; col++) {
            const cellU = margin + col * cellW;
            const cellV = margin + row * cellW;
            const ccx = cellU + cellW * 0.5;
            const ccy = cellV + cellW * 0.5;
            const isChecked = (row + col) % 2 === 0;

            if (isChecked) {
                if (filled) {
                    const sq: [number, number][] = [
                        [cellU + bandW * 0.6, cellV + bandW * 0.6],
                        [cellU + cellW - bandW * 0.6, cellV + bandW * 0.6],
                        [cellU + cellW - bandW * 0.6, cellV + cellW - bandW * 0.6],
                        [cellU + bandW * 0.6, cellV + cellW - bandW * 0.6],
                    ];
                    drawUV(sq, 'filled');
                    drawUV(circlePoints(ccx, ccy, cellW * 0.22, 12), 'opaque-outline');
                    drawUV(circlePoints(ccx, ccy, cellW * 0.08, 8), 'filled');
                } else {
                    const xHalfW = 0.012;
                    const x0 = cellU + bandW;
                    const y0 = cellV + bandW;
                    const x1 = cellU + cellW - bandW;
                    const y1 = cellV + cellW - bandW;
                    drawUV(lineToBand(x0, y0, x1, y1, xHalfW), 'filled');
                    drawUV(lineToBand(x1, y0, x0, y1, xHalfW), 'filled');
                    drawUV(circlePoints(ccx, ccy, cellW * 0.22, 12), 'filled');
                }
            } else {
                const r = cellW * 0.28;
                drawUV(circlePoints(ccx, ccy, r, 12), 'filled');
                drawUV(circlePoints(ccx, ccy, r * 0.4, 8), 'filled');
                const dotR = cellW * 0.06;
                drawUV(circlePoints(ccx, ccy - r * 0.7, dotR, 6), 'filled');
                drawUV(circlePoints(ccx, ccy + r * 0.7, dotR, 6), 'filled');
                drawUV(circlePoints(ccx - r * 0.7, ccy, dotR, 6), 'filled');
                drawUV(circlePoints(ccx + r * 0.7, ccy, dotR, 6), 'filled');
            }
        }
    }

    for (let row = 0; row <= gridN; row++) {
        for (let col = 0; col <= gridN; col++) {
            const iu = margin + col * cellW;
            const iv = margin + row * cellW;
            drawUV(circlePoints(iu, iv, bandW * 0.7, 6), 'filled');
        }
    }
}
