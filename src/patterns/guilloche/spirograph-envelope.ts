// Spirograph envelope — multiple offset epitrochoids
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const nCurves = 2 + Math.floor(r() * 2);
    for (let c = 0; c < nCurves; c++) {
        const R = 0.35 + c * 0.03;
        const rr = 0.08 + r() * 0.1;
        const d = 0.06 + r() * 0.15;
        const pts: [number, number][] = [];
        for (let j = 0; j <= 50; j++) {
            const t = (j / 50) * Math.PI * 4;
            const x = (R - rr) * Math.cos(t) + d * Math.cos(((R - rr) / rr) * t);
            const y = (R - rr) * Math.sin(t) + d * Math.sin(((R - rr) / rr) * t);
            pts.push([
                Math.min(1, Math.max(0, 0.5 + x)),
                Math.min(1, Math.max(0, 0.5 + y))
            ]);
        }
        drawUV(pts, c === 0 ? baseStyle : 'line');
    }
}
