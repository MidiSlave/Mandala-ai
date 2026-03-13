// Phyllotaxis / sunflower spiral dots
import type { PatternContext } from '../types';
import { circleUV } from './helpers';

export function draw({ drawUV, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const numDots = 12 + Math.floor(r() * 20);
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let j = 0; j < numDots; j++) {
        const frac = j / numDots;
        const theta = j * goldenAngle;
        const u = ((theta % (Math.PI * 2)) / (Math.PI * 2));
        const v = 0.1 + frac * 0.8;
        const dotR = 0.01 + frac * 0.015;
        drawUV(circleUV(u, v, dotR, 8), j % 3 === 0 ? 'filled' : 'outline');
    }
}
