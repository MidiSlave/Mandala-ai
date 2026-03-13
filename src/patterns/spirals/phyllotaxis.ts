import type { PatternContext } from '../types';
import { circleUV } from './helpers';

export function draw({ drawUV, filled, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const numSeeds = 20 + Math.floor(r() * 30);
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let j = 0; j < numSeeds; j++) {
        const frac = j / numSeeds;
        const theta = j * goldenAngle;
        const radius = Math.sqrt(frac) * 0.4;
        const cx = 0.5 + Math.cos(theta) * radius;
        const cy = 0.5 + Math.sin(theta) * radius;
        const dotSize = 0.008 + frac * 0.012;
        drawUV(circleUV(cx, cy, dotSize, 6),
            j % 5 === 0 ? baseStyle : (j % 3 === 0 ? 'filled' : 'outline'));
    }
}
