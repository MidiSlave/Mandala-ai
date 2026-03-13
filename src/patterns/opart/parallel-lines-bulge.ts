// Bridget Riley parallel lines with bulge
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const nLines = 8 + Math.floor(r() * 5);
    const bulgeCx = 0.3 + r() * 0.4;
    const bulgeCy = 0.3 + r() * 0.4;
    const bulgeR = 0.15 + r() * 0.1;
    for (let i = 0; i < nLines; i++) {
        const baseU = (i + 0.5) / nLines;
        const pts: [number, number][] = [];
        for (let s = 0; s <= 16; s++) {
            const v = s / 16;
            const distX = baseU - bulgeCx;
            const distY = v - bulgeCy;
            const dist = Math.sqrt(distX * distX + distY * distY);
            const displacement = dist < bulgeR
                ? (1 - dist / bulgeR) * 0.06
                : 0;
            pts.push([baseU + displacement * (distX / (dist || 1)), v]);
        }
        drawUV(pts, i % 3 === 0 ? baseStyle : 'line');
    }
}
