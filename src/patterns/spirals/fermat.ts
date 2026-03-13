import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const direction = r() > 0.5 ? 1 : -1;
    const steps = 40;
    for (let arm = 0; arm < 2; arm++) {
        const pts: [number, number][] = [];
        const sign = arm === 0 ? 1 : -1;
        for (let j = 0; j <= steps; j++) {
            const t = (j / steps) * 4 * Math.PI;
            const radius = Math.sqrt(t / (4 * Math.PI)) * 0.4 * sign;
            pts.push([
                Math.min(1, Math.max(0, 0.5 + Math.cos(t * direction) * Math.abs(radius))),
                Math.min(1, Math.max(0, 0.5 + Math.sin(t * direction) * radius))
            ]);
        }
        drawUV(pts, arm === 0 ? baseStyle : 'line');
    }
}
