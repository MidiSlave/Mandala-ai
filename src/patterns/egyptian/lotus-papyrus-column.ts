// Lotus/Papyrus Column — scalloped petal shapes
import type { PatternContext } from '../types';
import { rect } from './helpers';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    const mainStyle = filled ? 'filled' as const : 'outline' as const;
    const detailStyle = filled ? 'opaque-outline' as const : 'filled' as const;

    const cx = 0.5;

    // Base pedestal
    drawUV(rect(0.15, 0.80, 0.85, 0.88), baseStyle);
    drawUV(rect(0.20, 0.88, 0.80, 0.94), detailStyle);
    drawUV(rect(0.10, 0.94, 0.90, 1.0), baseStyle);

    // Central stem
    drawUV(rect(0.42, 0.30, 0.58, 0.80), baseStyle);
    drawUV(rect(0.45, 0.35, 0.55, 0.78), detailStyle);

    // Lotus flower head — multiple overlapping petals
    for (let i = -2; i <= 2; i++) {
        const angle = i * 0.28;
        const petalW = 0.10;
        const petalH = 0.28;
        const basePtY = 0.34;
        const petalCx = cx + Math.sin(angle) * 0.18;

        const pts: [number, number][] = [];
        const n = 12;
        for (let j = 0; j <= n; j++) {
            const t = j / n;
            const y = basePtY - t * petalH;
            const bulge = petalW * Math.sin(t * Math.PI) * (1 - t * 0.3);
            pts.push([petalCx - bulge, y]);
        }
        for (let j = n; j >= 0; j--) {
            const t = j / n;
            const y = basePtY - t * petalH;
            const bulge = petalW * Math.sin(t * Math.PI) * (1 - t * 0.3);
            pts.push([petalCx + bulge, y]);
        }
        drawUV(pts, i % 2 === 0 ? baseStyle : detailStyle);
    }

    // Central petal (tallest, on top)
    {
        const pts: [number, number][] = [];
        const n = 14;
        for (let j = 0; j <= n; j++) {
            const t = j / n;
            const y = 0.34 - t * 0.32;
            const bulge = 0.08 * Math.sin(t * Math.PI) * (1 - t * 0.4);
            pts.push([cx - bulge, y]);
        }
        for (let j = n; j >= 0; j--) {
            const t = j / n;
            const y = 0.34 - t * 0.32;
            const bulge = 0.08 * Math.sin(t * Math.PI) * (1 - t * 0.4);
            pts.push([cx + bulge, y]);
        }
        drawUV(pts, filled ? baseStyle : 'filled');
    }

    // Top border band
    drawUV(rect(0.0, 0.0, 1.0, 0.04), baseStyle);

    // Side decorative bands
    drawUV(rect(0.0, 0.0, 0.06, 1.0), mainStyle);
    drawUV(rect(0.94, 0.0, 1.0, 1.0), mainStyle);
}
