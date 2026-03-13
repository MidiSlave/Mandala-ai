// Circle packing — non-overlapping circles filling space
import type { PatternContext } from '../types';
import { circleUV } from './helpers';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const maxCircles = 12 + Math.floor(r() * 8);
    const circles: { cx: number; cy: number; rad: number }[] = [];
    let attempts = 0;

    while (circles.length < maxCircles && attempts < 200) {
        attempts++;
        const cx = 0.1 + r() * 0.8;
        const cy = 0.1 + r() * 0.8;
        const maxRad = 0.15;
        const minRad = 0.02;
        let rad = minRad + r() * (maxRad - minRad);

        // Check for overlap with existing circles
        let valid = true;
        for (const c of circles) {
            const dx = cx - c.cx;
            const dy = cy - c.cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < rad + c.rad + 0.01) {
                rad = Math.max(minRad, dist - c.rad - 0.01);
                if (rad < minRad) { valid = false; break; }
            }
        }
        // Check bounds
        if (cx - rad < 0.02 || cx + rad > 0.98 || cy - rad < 0.02 || cy + rad > 0.98) {
            valid = false;
        }

        if (valid && rad >= minRad) {
            circles.push({ cx, cy, rad });
        }
    }

    for (let i = 0; i < circles.length; i++) {
        const c = circles[i];
        const n = c.rad > 0.06 ? 14 : 8;
        const style = filled
            ? (i % 3 === 0 ? 'filled' : (i % 3 === 1 ? 'opaque-outline' : 'outline'))
            : (i % 2 === 0 ? 'outline' : 'line');
        drawUV(circleUV(c.cx, c.cy, c.rad, n), style);

        // Inner circle for larger circles
        if (c.rad > 0.05) {
            drawUV(circleUV(c.cx, c.cy, c.rad * 0.5, 8), filled ? 'opaque-outline' : 'outline');
        }
    }
}
