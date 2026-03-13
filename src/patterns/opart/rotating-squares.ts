// Rotating squares (nested rotation)
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const nSquares = 5 + Math.floor(r() * 3);
    const rotStep = 0.08 + r() * 0.06;
    for (let sq = 0; sq < nSquares; sq++) {
        const frac = (sq + 1) / (nSquares + 1);
        const half = frac * 0.42;
        const rot = sq * rotStep;
        const pts: [number, number][] = [];
        for (let c = 0; c < 4; c++) {
            const a = (c / 4) * Math.PI * 2 + Math.PI / 4 + rot;
            pts.push([0.5 + Math.cos(a) * half, 0.5 + Math.sin(a) * half]);
        }
        drawUV(pts, sq % 2 === 0 ? baseStyle : 'outline');
    }
}
