// Herringbone stitch — criss-crossing zigzag band
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const rows = 2 + Math.floor(r() * 2);
    const stitchesPerRow = 4 + Math.floor(r() * 4);
    const rowH = 1.0 / (rows + 1);
    for (let row = 0; row < rows; row++) {
        const baseV = (row + 0.5) * rowH;
        const halfH = rowH * 0.35;
        // Forward slanting stitches
        const fwdPts: [number, number][] = [];
        for (let i = 0; i <= stitchesPerRow; i++) {
            const u = i / stitchesPerRow;
            const v = i % 2 === 0 ? baseV - halfH : baseV + halfH;
            fwdPts.push([u, v]);
        }
        drawUV(fwdPts, 'line');
        // Back slanting stitches (offset by half)
        const backPts: [number, number][] = [];
        for (let i = 0; i <= stitchesPerRow; i++) {
            const u = (i + 0.5) / (stitchesPerRow + 1);
            const v = i % 2 === 0 ? baseV + halfH : baseV - halfH;
            backPts.push([u, v]);
        }
        drawUV(backPts, 'line');
        // Diamond fills at intersections when filled
        if (filled) {
            for (let i = 0; i < stitchesPerRow; i++) {
                const cx = (i + 0.5) / stitchesPerRow;
                const ds = rowH * 0.08;
                drawUV([
                    [cx, baseV - ds], [cx + ds, baseV],
                    [cx, baseV + ds], [cx - ds, baseV]
                ], 'filled');
            }
        }
    }
}
