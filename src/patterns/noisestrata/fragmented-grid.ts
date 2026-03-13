// Fragmented grid — noise-displaced rectangular cells
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const cols = 3 + Math.floor(r() * 2);
    const rows = 3 + Math.floor(r() * 2);
    const cellW = 1.0 / cols;
    const cellH = 1.0 / rows;
    const maxDisp = 0.04 + r() * 0.06;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const u0 = col * cellW;
            const v0 = row * cellH;
            const isHuge = r() > 0.7; // 30% chance of large displacement
            const disp = isHuge ? maxDisp * 3 : maxDisp;

            // Displace each corner independently
            const corners: [number, number][] = [
                [u0 + (r() - 0.5) * disp, v0 + (r() - 0.5) * disp],
                [u0 + cellW + (r() - 0.5) * disp, v0 + (r() - 0.5) * disp],
                [u0 + cellW + (r() - 0.5) * disp, v0 + cellH + (r() - 0.5) * disp],
                [u0 + (r() - 0.5) * disp, v0 + cellH + (r() - 0.5) * disp]
            ];

            // Clamp to bounds
            const clamped = corners.map(([u, v]) => [
                Math.min(1, Math.max(0, u)),
                Math.min(1, Math.max(0, v))
            ] as [number, number]);

            const style = isHuge ? 'line' : (filled ? baseStyle : 'outline');
            drawUV(clamped, style);

            // Inner quad for non-huge cells
            if (!isHuge && filled) {
                const inset = 0.15;
                const inner: [number, number][] = [
                    [u0 + cellW * inset, v0 + cellH * inset],
                    [u0 + cellW * (1 - inset), v0 + cellH * inset],
                    [u0 + cellW * (1 - inset), v0 + cellH * (1 - inset)],
                    [u0 + cellW * inset, v0 + cellH * (1 - inset)]
                ];
                drawUV(inner, 'opaque-outline');
            }
        }
    }
}
