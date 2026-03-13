import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const nArcs = 5 + Math.floor(r() * 3);
    let size = 0.4;
    let cx = 0.5, cy = 0.5;
    for (let j = 0; j < nArcs; j++) {
        const startAngle = (j * Math.PI) / 2;
        const pts: [number, number][] = [];
        for (let s = 0; s <= 10; s++) {
            const a = startAngle + (s / 10) * (Math.PI / 2);
            pts.push([
                Math.min(1, Math.max(0, cx + Math.cos(a) * size)),
                Math.min(1, Math.max(0, cy + Math.sin(a) * size))
            ]);
        }
        drawUV(pts, j % 2 === 0 ? baseStyle : 'line');
        // Move center for next arc
        const nextAngle = startAngle + Math.PI / 2;
        cx += Math.cos(nextAngle) * size * (1 - 1 / goldenRatio);
        cy += Math.sin(nextAngle) * size * (1 - 1 / goldenRatio);
        size /= goldenRatio;
    }
}
