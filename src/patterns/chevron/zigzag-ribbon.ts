// Zigzag ribbon — wide zigzag filling the cell with center band and diamonds
import type { PatternContext } from '../types';
import { bandFromPolyline } from './helpers';

export function draw({ drawUV, baseStyle }: PatternContext): void {
    const ribbonHalf = 0.12;

    const outerEdge: [number, number][] = [
        [0, 0.5 + ribbonHalf], [0.1, 0.85 + ribbonHalf], [0.3, 0.15 + ribbonHalf],
        [0.5, 0.85 + ribbonHalf], [0.7, 0.15 + ribbonHalf], [0.9, 0.85 + ribbonHalf],
        [1, 0.5 + ribbonHalf]
    ];
    const innerEdge: [number, number][] = [
        [1, 0.5 - ribbonHalf], [0.9, 0.85 - ribbonHalf], [0.7, 0.15 - ribbonHalf],
        [0.5, 0.85 - ribbonHalf], [0.3, 0.15 - ribbonHalf], [0.1, 0.85 - ribbonHalf],
        [0, 0.5 - ribbonHalf]
    ];

    drawUV([...outerEdge, ...innerEdge], baseStyle);

    drawUV(bandFromPolyline([
        [0, 0.5], [0.1, 0.85], [0.3, 0.15], [0.5, 0.85], [0.7, 0.15], [0.9, 0.85], [1, 0.5]
    ], 0.02), 'filled');

    drawUV(bandFromPolyline(outerEdge, 0.015), 'filled');
    drawUV(bandFromPolyline([...innerEdge].reverse(), 0.015), 'filled');

    const diamondSize = 0.03;
    const peaksAndValleys: [number, number][] = [
        [0.1, 0.85], [0.3, 0.15], [0.5, 0.85], [0.7, 0.15], [0.9, 0.85]
    ];
    for (const [pu, pv] of peaksAndValleys) {
        drawUV([
            [pu, pv - diamondSize], [pu + diamondSize, pv],
            [pu, pv + diamondSize], [pu - diamondSize, pv]
        ], 'filled');
    }
}
