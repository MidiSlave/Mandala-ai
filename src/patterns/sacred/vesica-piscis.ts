import type { PatternContext } from '../types';
import { circle, band, diamond, vesica } from './helpers';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    const mainStyle = filled ? 'filled' as const : 'outline' as const;
    const detailStyle = filled ? 'opaque-outline' as const : 'filled' as const;

    const cx = 0.5, cy = 0.5;
    const sep = 0.12;
    const r = 0.30;
    const ringW = 0.05;

    // Left circle (thick ring)
    drawUV(circle(cx - sep, cy, r, 32), baseStyle);
    drawUV(circle(cx - sep, cy, r - ringW, 28), detailStyle);

    // Right circle (thick ring)
    drawUV(circle(cx + sep, cy, r, 32), baseStyle);
    drawUV(circle(cx + sep, cy, r - ringW, 28), detailStyle);

    // Vesica piscis (almond intersection) — bold filled
    const vPts = vesica(cx - sep, cy, cx + sep, cy, r, 20);
    if (vPts.length > 0) {
        drawUV(vPts, filled ? baseStyle : 'filled');

        // Inner vesica cutout
        const innerV = vesica(cx - sep, cy, cx + sep, cy, r * 0.75, 16);
        if (innerV.length > 0) drawUV(innerV, detailStyle);
    }

    // Central eye diamond
    drawUV(diamond(cx, cy, 0.08, 0.18), filled ? baseStyle : 'filled');
    drawUV(diamond(cx, cy, 0.04, 0.10), detailStyle);

    // Bold axis cross
    drawUV(band(0.05, cy, 0.95, cy, 0.03), baseStyle);
    drawUV(band(cx, 0.10, cx, 0.90, 0.03), baseStyle);

    // Filled crescents at top and bottom
    for (let sign = -1; sign <= 1; sign += 2) {
        const tipY = cy + sign * 0.26;
        drawUV(circle(cx, tipY, 0.04, 12), 'filled');
    }

    // Corner accent triangles
    const triSize = 0.06;
    drawUV([[0.04, 0.04], [0.04 + triSize, 0.04], [0.04, 0.04 + triSize]], 'filled');
    drawUV([[0.96, 0.04], [0.96 - triSize, 0.04], [0.96, 0.04 + triSize]], 'filled');
    drawUV([[0.04, 0.96], [0.04 + triSize, 0.96], [0.04, 0.96 - triSize]], 'filled');
    drawUV([[0.96, 0.96], [0.96 - triSize, 0.96], [0.96, 0.96 - triSize]], 'filled');
}
