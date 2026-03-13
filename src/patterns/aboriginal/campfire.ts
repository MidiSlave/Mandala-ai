import type { PatternContext } from '../types';
import { dotCircle } from './helpers';

export function draw({ drawUV, filled, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const cx = 0.5, cy = 0.5;
    // Central fire: U-shapes
    for (let f = 0; f < 4; f++) {
        const a = (f / 4) * Math.PI * 2;
        const dist = 0.08;
        const fx = cx + Math.cos(a) * dist;
        const fy = cy + Math.sin(a) * dist;
        // U-shape (person sitting)
        const uPts: [number, number][] = [];
        for (let s = 0; s <= 6; s++) {
            const sa = Math.PI + (s / 6) * Math.PI;
            uPts.push([
                fx + Math.cos(a + sa) * 0.02,
                fy + Math.sin(a + sa) * 0.02
            ]);
        }
        drawUV(uPts, baseStyle);
    }
    // Radiating dot circles
    for (let ring = 0; ring < 3; ring++) {
        const ringR = 0.15 + ring * 0.1;
        const nDots = 12 + ring * 6;
        for (let d = 0; d < nDots; d++) {
            const a = (d / nDots) * Math.PI * 2;
            drawUV(dotCircle(
                cx + Math.cos(a) * ringR,
                cy + Math.sin(a) * ringR,
                0.007, 5
            ), ring === 0 ? baseStyle : 'filled');
        }
    }
}
