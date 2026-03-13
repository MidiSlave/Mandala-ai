import type { PatternContext } from '../types';
import { dotCircle } from './helpers';

export function draw({ drawUV, filled, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const cx = 0.5, cy = 0.5;
    const nRings = 4 + Math.floor(r() * 3);
    for (let ring = 0; ring < nRings; ring++) {
        const ringR = (ring + 1) / (nRings + 1) * 0.42;
        const nDots = 8 + ring * 4;
        for (let d = 0; d < nDots; d++) {
            const a = (d / nDots) * Math.PI * 2;
            const dx = cx + Math.cos(a) * ringR;
            const dy = cy + Math.sin(a) * ringR;
            const dotR = 0.012 - ring * 0.001;
            drawUV(dotCircle(dx, dy, Math.max(0.005, dotR), 6),
                ring % 2 === 0 ? baseStyle : 'filled');
        }
    }
    // Center dot
    drawUV(dotCircle(cx, cy, 0.02, 8), baseStyle);
}
