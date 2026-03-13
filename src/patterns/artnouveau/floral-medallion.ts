// Mucha-style floral medallion
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const cx = 0.5, cy = 0.5;
    const nPetals = 5 + Math.floor(r() * 3);
    const petalR = 0.3;
    const petalWidth = 0.1;
    for (let p = 0; p < nPetals; p++) {
        const baseA = (p / nPetals) * Math.PI * 2;
        const pts: [number, number][] = [];
        pts.push([cx, cy]);
        for (let s = 0; s <= 10; s++) {
            const t = s / 10;
            const spread = Math.sin(t * Math.PI) * petalWidth;
            const a = baseA - spread;
            const rad = t * petalR;
            pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]);
        }
        for (let s = 10; s >= 0; s--) {
            const t = s / 10;
            const spread = Math.sin(t * Math.PI) * petalWidth;
            const a = baseA + spread;
            const rad = t * petalR;
            pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]);
        }
        drawUV(pts, p % 2 === 0 ? baseStyle : 'outline');
    }
    // Center circle
    const centerPts: [number, number][] = [];
    for (let s = 0; s <= 12; s++) {
        const a = (s / 12) * Math.PI * 2;
        centerPts.push([cx + Math.cos(a) * 0.04, cy + Math.sin(a) * 0.04]);
    }
    drawUV(centerPts, 'filled');
}
