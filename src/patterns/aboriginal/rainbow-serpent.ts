import type { PatternContext } from '../types';
import { dotCircle } from './helpers';

export function draw({ drawUV, filled, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const amplitude = 0.1 + r() * 0.05;
    const freq = 2 + r();
    const nSegments = 16;
    // Snake body
    for (let s = 0; s < nSegments; s++) {
        const t = s / nSegments;
        const t2 = (s + 1) / nSegments;
        const u1 = t;
        const v1 = 0.5 + Math.sin(t * Math.PI * freq) * amplitude;
        const u2 = t2;
        const v2 = 0.5 + Math.sin(t2 * Math.PI * freq) * amplitude;
        const bodyWidth = 0.02 * (1 - t * 0.4);
        // Body segment as thick line
        const perpA = Math.atan2(v2 - v1, u2 - u1) + Math.PI / 2;
        drawUV([
            [u1 + Math.cos(perpA) * bodyWidth, v1 + Math.sin(perpA) * bodyWidth],
            [u2 + Math.cos(perpA) * bodyWidth, v2 + Math.sin(perpA) * bodyWidth],
            [u2 - Math.cos(perpA) * bodyWidth, v2 - Math.sin(perpA) * bodyWidth],
            [u1 - Math.cos(perpA) * bodyWidth, v1 - Math.sin(perpA) * bodyWidth],
        ], s % 3 === 0 ? baseStyle : 'outline');
    }
    // Dot scales along body
    for (let s = 0; s < nSegments; s += 2) {
        const t = (s + 0.5) / nSegments;
        const u = t;
        const v = 0.5 + Math.sin(t * Math.PI * freq) * amplitude;
        drawUV(dotCircle(u, v, 0.006, 5), 'filled');
    }
}
