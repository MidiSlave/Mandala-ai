import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const turns = 2 + r() * 2;
    const pts: [number, number][] = [];
    const steps = 50 + Math.floor(r() * 20);
    for (let j = 0; j <= steps; j++) {
        const t = (j / steps) * turns * Math.PI * 2;
        const radius = (j / steps) * 0.4;
        pts.push([
            Math.min(1, Math.max(0, 0.5 + Math.cos(t) * radius)),
            Math.min(1, Math.max(0, 0.5 + Math.sin(t) * radius))
        ]);
    }
    drawUV(pts, baseStyle);
    // Second spiral offset by half turn
    const pts2: [number, number][] = [];
    for (let j = 0; j <= steps; j++) {
        const t = (j / steps) * turns * Math.PI * 2 + Math.PI;
        const radius = (j / steps) * 0.4;
        pts2.push([
            Math.min(1, Math.max(0, 0.5 + Math.cos(t) * radius)),
            Math.min(1, Math.max(0, 0.5 + Math.sin(t) * radius))
        ]);
    }
    drawUV(pts2, filled ? 'outline' : baseStyle);
}
