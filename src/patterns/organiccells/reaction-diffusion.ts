// Reaction-diffusion spots — organic dot clusters
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const numSpots = 8 + Math.floor(r() * 10);
    const spots: { cx: number; cy: number; r: number }[] = [];

    for (let i = 0; i < numSpots; i++) {
        const cx = 0.05 + r() * 0.9;
        const cy = 0.05 + r() * 0.9;
        const rad = 0.02 + r() * 0.06;
        spots.push({ cx, cy, r: rad });
    }

    // Draw spots with bridges
    for (let i = 0; i < spots.length; i++) {
        const s = spots[i];
        const n = s.r > 0.04 ? 12 : 8;
        // Organic blob shape (slightly irregular circle)
        const pts: [number, number][] = [];
        for (let j = 0; j <= n; j++) {
            const a = (j / n) * Math.PI * 2;
            const wobble = 1 + (r() - 0.5) * 0.3;
            pts.push([
                Math.min(1, Math.max(0, s.cx + Math.cos(a) * s.r * wobble)),
                Math.min(1, Math.max(0, s.cy + Math.sin(a) * s.r * wobble))
            ]);
        }
        drawUV(pts, i % 2 === 0 ? baseStyle : 'outline');

        // Connect nearby spots with bridges
        for (let j = i + 1; j < spots.length; j++) {
            const s2 = spots[j];
            const dx = s.cx - s2.cx;
            const dy = s.cy - s2.cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 0.2) {
                drawUV([[s.cx, s.cy], [s2.cx, s2.cy]], 'line');
            }
        }
    }
}
