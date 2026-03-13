// Swirl flow — rotating vector field traces
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const numTraces = 8 + Math.floor(r() * 6);
    const cx = 0.5, cy = 0.5;

    for (let i = 0; i < numTraces; i++) {
        const startAngle = (i / numTraces) * Math.PI * 2;
        const startR = 0.05 + r() * 0.1;
        let x = cx + Math.cos(startAngle) * startR;
        let y = cy + Math.sin(startAngle) * startR;
        const pts: [number, number][] = [[x, y]];
        const steps = 20 + Math.floor(r() * 15);

        for (let s = 0; s < steps; s++) {
            const dx = x - cx;
            const dy = y - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            // Swirl: perpendicular to radial + slight outward push
            const angle = Math.atan2(dy, dx) + Math.PI / 2 * (1 + 0.3 / (dist + 0.1));
            const speed = 0.015 + dist * 0.01;
            x += Math.cos(angle) * speed;
            y += Math.sin(angle) * speed;
            if (x < 0 || x > 1 || y < 0 || y > 1) break;
            pts.push([Math.min(1, Math.max(0, x)), Math.min(1, Math.max(0, y))]);
        }
        if (pts.length > 2) {
            drawUV(pts, i % 3 === 0 ? baseStyle : 'line');
        }
    }
}
