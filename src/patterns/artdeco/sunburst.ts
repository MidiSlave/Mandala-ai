// Sunburst / Starburst — radiating wedge shapes from bottom-center
import type { PatternContext } from '../types';
import { filledRect, arcBand } from './helpers';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    const detailStyle = filled ? 'opaque-outline' as const : 'filled' as const;

    const cx = 0.5;
    const cy = 0.05; // sun rises from bottom of cell
    const numRays = 9;

    // Alternating filled and opaque-outline wedge rays
    for (let i = 0; i < numRays; i++) {
        const angleStart = -Math.PI * 0.08 + (i / numRays) * Math.PI * 1.16;
        const angleEnd = -Math.PI * 0.08 + ((i + 0.85) / numRays) * Math.PI * 1.16;
        const innerR = 0.08;
        const outerR = 0.55 + (i % 2 === 0 ? 0.08 : 0.0);

        const pts: [number, number][] = [];
        // Inner arc (just a small number of points since it's tiny)
        for (let j = 0; j <= 3; j++) {
            const t = j / 3;
            const a = angleStart + t * (angleEnd - angleStart);
            pts.push([cx + innerR * Math.cos(a), cy + innerR * Math.sin(a)]);
        }
        // Outer arc (reversed)
        for (let j = 3; j >= 0; j--) {
            const t = j / 3;
            const a = angleStart + t * (angleEnd - angleStart);
            pts.push([cx + outerR * Math.cos(a), cy + outerR * Math.sin(a)]);
        }

        const style = i % 2 === 0 ? baseStyle : detailStyle;
        drawUV(pts, style);
    }

    // Semicircular sun body at bottom
    const sunBody = arcBand(cx, cy, 0.0, 0.10, -Math.PI * 0.05, Math.PI * 1.05, 24);
    drawUV(sunBody, baseStyle);

    const mainStyle = filled ? 'filled' as const : 'outline' as const;

    // Decorative arc bands across the top portion
    drawUV(arcBand(cx, cy, 0.56, 0.62, 0.05, Math.PI * 0.95, 30), mainStyle);
    drawUV(arcBand(cx, cy, 0.66, 0.70, 0.1, Math.PI * 0.9, 28), detailStyle);
    drawUV(arcBand(cx, cy, 0.74, 0.80, 0.15, Math.PI * 0.85, 26), mainStyle);

    // Bold horizontal band at very top
    drawUV(filledRect(0.02, 0.88, 0.98, 0.95), baseStyle);
    if (filled) {
        // Cutout diamonds in the top band
        for (let i = 0; i < 5; i++) {
            const bu = 0.15 + i * 0.175;
            drawUV([
                [bu, 0.895], [bu + 0.025, 0.915],
                [bu, 0.935], [bu - 0.025, 0.915],
            ], 'opaque-outline');
        }
    } else {
        for (let i = 0; i < 5; i++) {
            const bu = 0.15 + i * 0.175;
            drawUV([
                [bu, 0.895], [bu + 0.025, 0.915],
                [bu, 0.935], [bu - 0.025, 0.915],
            ], 'filled');
        }
    }

    // Corner decorative squares
    drawUV(filledRect(0.02, 0.02, 0.10, 0.06), 'filled');
    drawUV(filledRect(0.90, 0.02, 0.98, 0.06), 'filled');
}
