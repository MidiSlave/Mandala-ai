import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const cx = 0.5, cy = 0.5;
    const outerR = 0.38;
    const innerR = outerR * 0.42;
    const pts: [number, number][] = [];
    for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        const rad = i % 2 === 0 ? outerR : innerR;
        pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]);
    }
    drawUV(pts, baseStyle);
    // Inner octagon
    const inner: [number, number][] = [];
    for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
        inner.push([cx + Math.cos(a) * innerR * 0.9, cy + Math.sin(a) * innerR * 0.9]);
    }
    drawUV(inner, filled ? 'opaque-outline' : 'outline');
}
