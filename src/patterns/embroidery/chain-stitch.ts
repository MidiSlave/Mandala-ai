// Chain stitch — interlocking loops along paths
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const chains = 2 + Math.floor(r() * 2);
    const loopsPerChain = 5 + Math.floor(r() * 4);
    for (let c = 0; c < chains; c++) {
        const baseU = (c + 0.5) / chains;
        const loopH = 0.85 / loopsPerChain;
        const loopW = 0.06 + r() * 0.04;
        for (let i = 0; i < loopsPerChain; i++) {
            const cy = 0.08 + i * loopH;
            // Each loop is a small oval
            const pts: [number, number][] = [];
            const n = 10;
            for (let j = 0; j <= n; j++) {
                const a = (j / n) * Math.PI * 2;
                pts.push([
                    baseU + Math.cos(a) * loopW,
                    cy + Math.sin(a) * loopH * 0.4
                ]);
            }
            drawUV(pts, i % 2 === 0 ? baseStyle : 'outline');
        }
    }
}
