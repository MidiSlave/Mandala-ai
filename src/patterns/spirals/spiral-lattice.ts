import type { PatternContext } from '../types';
import { circleUV } from './helpers';

export function draw({ drawUV, filled, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const nRings = 3 + Math.floor(r() * 3);
    const nSpokes = 4 + Math.floor(r() * 4);
    // Concentric rings
    for (let j = 0; j < nRings; j++) {
        const ringR = (j + 1) / (nRings + 1) * 0.4;
        drawUV(circleUV(0.5, 0.5, ringR, 20),
            j % 2 === 0 ? 'outline' : baseStyle);
    }
    // Spiral spokes connecting rings
    for (let j = 0; j < nSpokes; j++) {
        const baseAngle = (j / nSpokes) * Math.PI * 2;
        const pts: [number, number][] = [];
        for (let s = 0; s <= 16; s++) {
            const t = s / 16;
            const a = baseAngle + t * Math.PI * 0.5;
            const rad = t * 0.4;
            pts.push([0.5 + Math.cos(a) * rad, 0.5 + Math.sin(a) * rad]);
        }
        drawUV(pts, 'line');
    }
}
