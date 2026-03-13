// Knotwork Band
import type { PatternContext } from '../types';
import { dot, sq } from './helpers';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    // Top border line
    drawUV([
        [0.0, 0.82], [1.0, 0.82], [1.0, 0.85], [0.0, 0.85],
    ], baseStyle);
    // Bottom border line
    drawUV([
        [0.0, 0.15], [1.0, 0.15], [1.0, 0.18], [0.0, 0.18],
    ], baseStyle);

    // Band A — weaving sinusoid (upper strand)
    const bandW = 0.06;
    const strandA: [number, number][] = [];
    const strandAbot: [number, number][] = [];
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const u = t;
        const v = 0.5 + 0.18 * Math.sin(t * 4 * Math.PI);
        strandA.push([u, v + bandW]);
        strandAbot.unshift([u, v - bandW]);
    }
    drawUV([...strandA, ...strandAbot], baseStyle);

    // Band B — weaving sinusoid (lower strand, phase-shifted)
    const strandB: [number, number][] = [];
    const strandBbot: [number, number][] = [];
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const u = t;
        const v = 0.5 + 0.18 * Math.sin(t * 4 * Math.PI + Math.PI);
        strandB.push([u, v + bandW]);
        strandBbot.unshift([u, v - bandW]);
    }
    drawUV([...strandB, ...strandBbot], baseStyle);

    // Crossover cover patches — opaque rectangles at crossing points
    // where strand A should appear "over" strand B
    if (filled) {
        // At each crossing, place an opaque patch over the strand that goes "under"
        for (let k = 0; k < 4; k++) {
            const crossU = (k + 0.5) * 0.25;
            const crossV = 0.5;
            // Alternating which strand is on top
            if (k % 2 === 0) {
                // Strand A on top: cover B with opaque, then redraw A
                drawUV(sq(crossU, crossV, 0.06), 'opaque-outline');
                // Re-draw small piece of strand A at crossing
                const va = 0.5 + 0.18 * Math.sin(crossU * 4 * Math.PI);
                drawUV([
                    [crossU - 0.05, va + bandW], [crossU + 0.05, va + bandW],
                    [crossU + 0.05, va - bandW], [crossU - 0.05, va - bandW],
                ], 'filled');
            } else {
                drawUV(sq(crossU, crossV, 0.06), 'opaque-outline');
                const vb = 0.5 + 0.18 * Math.sin(crossU * 4 * Math.PI + Math.PI);
                drawUV([
                    [crossU - 0.05, vb + bandW], [crossU + 0.05, vb + bandW],
                    [crossU + 0.05, vb - bandW], [crossU - 0.05, vb - bandW],
                ], 'filled');
            }
        }
    } else {
        // In outline mode, draw crossing squares as filled
        for (let k = 0; k < 4; k++) {
            const crossU = (k + 0.5) * 0.25;
            drawUV(sq(crossU, 0.5, 0.05), 'filled');
        }
    }

    // Decorative dots between borders and bands — use 'filled' not 'outline'
    for (let i = 0; i < 6; i++) {
        const u = 0.1 + i * 0.16;
        drawUV(dot(u, 0.88, 0.015), filled ? baseStyle : 'filled');
        drawUV(dot(u, 0.12, 0.015), filled ? baseStyle : 'filled');
    }
}
