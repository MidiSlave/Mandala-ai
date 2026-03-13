import type { PatternContext } from '../types';
import { circle } from './helpers';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    const mainStyle = filled ? 'filled' as const : 'outline' as const;
    const detailStyle = filled ? 'opaque-outline' as const : 'filled' as const;

    const cx = 0.5, cy = 0.5;
    const r = 0.24;
    const spacing = 0.22;

    // Background frame
    drawUV(circle(cx, cy, 0.46, 32), baseStyle);
    drawUV(circle(cx, cy, 0.40, 32), detailStyle);

    // 6 bold petal shapes radiating from center
    for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const px = cx + spacing * 0.5 * Math.cos(a);
        const py = cy + spacing * 0.5 * Math.sin(a);

        // Each petal is an almond/lens shape
        const petalPts: [number, number][] = [];
        const n = 16;
        const perpA = a + Math.PI / 2;
        const petalLen = 0.28;
        const petalW = 0.12;

        // One side of petal
        for (let j = 0; j <= n; j++) {
            const t = j / n;
            const along = (t - 0.5) * petalLen;
            const across = petalW * Math.sin(t * Math.PI);
            petalPts.push([
                cx + along * Math.cos(a) + across * Math.cos(perpA),
                cy + along * Math.sin(a) + across * Math.sin(perpA),
            ]);
        }
        // Other side (return)
        for (let j = n; j >= 0; j--) {
            const t = j / n;
            const along = (t - 0.5) * petalLen;
            const across = -petalW * Math.sin(t * Math.PI);
            petalPts.push([
                cx + along * Math.cos(a) + across * Math.cos(perpA),
                cy + along * Math.sin(a) + across * Math.sin(perpA),
            ]);
        }

        drawUV(petalPts, baseStyle);

        // Inner petal (smaller, for detail)
        const innerPetalPts: [number, number][] = [];
        const iLen = petalLen * 0.6;
        const iW = petalW * 0.5;
        for (let j = 0; j <= n; j++) {
            const t = j / n;
            const along = (t - 0.5) * iLen;
            const across = iW * Math.sin(t * Math.PI);
            innerPetalPts.push([
                cx + along * Math.cos(a) + across * Math.cos(perpA),
                cy + along * Math.sin(a) + across * Math.sin(perpA),
            ]);
        }
        for (let j = n; j >= 0; j--) {
            const t = j / n;
            const along = (t - 0.5) * iLen;
            const across = -iW * Math.sin(t * Math.PI);
            innerPetalPts.push([
                cx + along * Math.cos(a) + across * Math.cos(perpA),
                cy + along * Math.sin(a) + across * Math.sin(perpA),
            ]);
        }
        drawUV(innerPetalPts, detailStyle);
    }

    // Center: bold hexagonal rosette
    const hexOuter: [number, number][] = [];
    const hexInner: [number, number][] = [];
    for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        hexOuter.push([cx + 0.10 * Math.cos(a), cy + 0.10 * Math.sin(a)]);
        hexInner.push([cx + 0.05 * Math.cos(a), cy + 0.05 * Math.sin(a)]);
    }
    drawUV(hexOuter, filled ? detailStyle : baseStyle);
    drawUV(hexInner, filled ? baseStyle : 'filled');

    // Dots at petal tips
    for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        drawUV(circle(cx + 0.32 * Math.cos(a), cy + 0.32 * Math.sin(a), 0.025, 10), 'filled');
    }
}
