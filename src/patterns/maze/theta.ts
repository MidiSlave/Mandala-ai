// Theta maze — concentric rings with radial walls and gaps
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const rings = 3 + Math.floor(r() * 3);
    const segs = 3 + Math.floor(r() * 3);
    const ringH = 1.0 / rings;
    const segW = 1.0 / segs;
    const wallThick = filled ? 0.025 : 0;

    for (let ri = 0; ri <= rings; ri++) {
        const v = ri * ringH;
        if (ri === 0 || ri === rings) {
            if (filled) {
                const t = wallThick * 0.5;
                drawUV([[0, Math.max(0, v - t)], [1, Math.max(0, v - t)], [1, Math.min(1, v + t)], [0, Math.min(1, v + t)]], 'filled');
            } else {
                drawUV([[0, v], [1, v]], 'line');
            }
            continue;
        }
        for (let si = 0; si < segs; si++) {
            const u0 = si * segW;
            const u1 = (si + 1) * segW;
            const gapCenter = u0 + segW * (0.2 + r() * 0.6);
            const gapHalf = segW * 0.15;
            const gapStart = Math.max(u0, gapCenter - gapHalf);
            const gapEnd = Math.min(u1, gapCenter + gapHalf);

            if (filled) {
                const t = wallThick * 0.5;
                if (gapStart > u0 + 0.01)
                    drawUV([[u0, v - t], [gapStart, v - t], [gapStart, v + t], [u0, v + t]], 'filled');
                if (u1 > gapEnd + 0.01)
                    drawUV([[gapEnd, v - t], [u1, v - t], [u1, v + t], [gapEnd, v + t]], 'filled');
            } else {
                if (gapStart > u0 + 0.01) drawUV([[u0, v], [gapStart, v]], 'line');
                if (u1 > gapEnd + 0.01) drawUV([[gapEnd, v], [u1, v]], 'line');
            }
        }
    }

    for (let si = 0; si < segs; si++) {
        const u = si * segW;
        if (u < 0.01) continue;
        for (let ri = 0; ri < rings; ri++) {
            if (r() > 0.65) continue;
            const v0 = ri * ringH;
            const v1 = (ri + 1) * ringH;
            if (filled) {
                const t = wallThick * 0.5;
                drawUV([[u - t, v0], [u + t, v0], [u + t, v1], [u - t, v1]], 'filled');
            } else {
                drawUV([[u, v0], [u, v1]], 'line');
            }
        }
    }

    if (filled) {
        for (let ri = 1; ri < rings; ri++) {
            for (let si = 0; si < segs; si++) {
                if (r() > 0.3) continue;
                const cu = si * segW;
                const cv = ri * ringH;
                const dotR = 0.015;
                const pts: [number, number][] = [];
                for (let j = 0; j <= 6; j++) {
                    const a = (j / 6) * Math.PI * 2;
                    pts.push([cu + Math.cos(a) * dotR, cv + Math.sin(a) * dotR]);
                }
                drawUV(pts, 'opaque-outline');
            }
        }
    }
}
