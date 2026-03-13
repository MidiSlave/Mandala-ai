// Seigaiha (Ocean Waves) — overlapping concentric arc bands
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    const mainStyle = filled ? 'filled' as const : 'outline' as const;
    const detailStyle = filled ? 'opaque-outline' as const : 'filled' as const;

    const numWaves = 3;
    const numArcs = 3;
    const arcSegments = 24;

    for (let w = 0; w < numWaves; w++) {
        const baseCy = 0.15 + w * 0.30;
        const offsetX = (w % 2 === 0) ? 0.0 : 0.30;

        for (let col = -1; col < 3; col++) {
            const baseCx = offsetX + col * 0.60;

            for (let a = 0; a < numArcs; a++) {
                const outerR = 0.28 - a * 0.07;
                const innerR = outerR - 0.05;
                if (innerR < 0.02) continue;

                // Build arc band as closed polygon (semicircle on top)
                const points: [number, number][] = [];

                // Outer arc (left to right)
                for (let s = 0; s <= arcSegments; s++) {
                    const angle = Math.PI + (s / arcSegments) * Math.PI;
                    const u = baseCx + outerR * Math.cos(angle);
                    const v = baseCy + outerR * Math.sin(angle);
                    if (u >= -0.1 && u <= 1.1) {
                        points.push([Math.max(0, Math.min(1, u)), Math.max(0, Math.min(1, v))]);
                    }
                }

                // Inner arc (right to left, reversed)
                for (let s = arcSegments; s >= 0; s--) {
                    const angle = Math.PI + (s / arcSegments) * Math.PI;
                    const u = baseCx + innerR * Math.cos(angle);
                    const v = baseCy + innerR * Math.sin(angle);
                    if (u >= -0.1 && u <= 1.1) {
                        points.push([Math.max(0, Math.min(1, u)), Math.max(0, Math.min(1, v))]);
                    }
                }

                if (points.length >= 3) {
                    const style = a === 0 ? baseStyle : (a === 1 ? detailStyle : mainStyle);
                    drawUV(points, style);
                }
            }
        }
    }

    // Bottom decorative band
    drawUV([
        [0.0, 0.88], [1.0, 0.88],
        [1.0, 0.92], [0.0, 0.92],
    ], mainStyle);

    // Top decorative band
    drawUV([
        [0.0, 0.0], [1.0, 0.0],
        [1.0, 0.04], [0.0, 0.04],
    ], mainStyle);

    // Small accent squares along bottom
    for (let i = 0; i < 5; i++) {
        const u = 0.1 + i * 0.2;
        drawUV([
            [u - 0.02, 0.94], [u + 0.02, 0.94],
            [u + 0.02, 0.98], [u - 0.02, 0.98],
        ], detailStyle);
    }
}
