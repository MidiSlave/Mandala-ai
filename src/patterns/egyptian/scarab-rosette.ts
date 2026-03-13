// Scarab/Rosette — circular flower with radiating petals
import type { PatternContext } from '../types';
import { circle } from './helpers';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    const mainStyle = filled ? 'filled' as const : 'outline' as const;
    const detailStyle = filled ? 'opaque-outline' as const : 'filled' as const;

    const cx = 0.5, cy = 0.5;

    // Outer ring
    drawUV(circle(cx, cy, 0.46, 28), baseStyle);
    drawUV(circle(cx, cy, 0.40, 24), detailStyle);

    // Radiating petals (like a lotus rosette / scarab wings)
    const numPetals = 8;
    for (let i = 0; i < numPetals; i++) {
        const angle = (i / numPetals) * Math.PI * 2;
        const perpA = angle + Math.PI / 2;
        const petalLen = 0.30;
        const petalW = 0.07;

        const pts: [number, number][] = [];
        const n = 12;
        for (let j = 0; j <= n; j++) {
            const t = j / n;
            const r = 0.08 + t * petalLen;
            const bulge = petalW * Math.sin(t * Math.PI);
            pts.push([
                cx + r * Math.cos(angle) + bulge * Math.cos(perpA),
                cy + r * Math.sin(angle) + bulge * Math.sin(perpA),
            ]);
        }
        for (let j = n; j >= 0; j--) {
            const t = j / n;
            const r = 0.08 + t * petalLen;
            const bulge = petalW * Math.sin(t * Math.PI);
            pts.push([
                cx + r * Math.cos(angle) - bulge * Math.cos(perpA),
                cy + r * Math.sin(angle) - bulge * Math.sin(perpA),
            ]);
        }
        drawUV(pts, i % 2 === 0 ? baseStyle : mainStyle);
    }

    // Inner ring between petals
    drawUV(circle(cx, cy, 0.14, 20), baseStyle);
    drawUV(circle(cx, cy, 0.10, 16), detailStyle);

    // Center dot
    drawUV(circle(cx, cy, 0.06, 12), filled ? baseStyle : 'filled');
    drawUV(circle(cx, cy, 0.025, 10), detailStyle);

    // Small triangles between petals at the outer ring
    for (let i = 0; i < numPetals; i++) {
        const angle = ((i + 0.5) / numPetals) * Math.PI * 2;
        drawUV([
            [cx + 0.36 * Math.cos(angle), cy + 0.36 * Math.sin(angle)],
            [cx + 0.42 * Math.cos(angle - 0.12), cy + 0.42 * Math.sin(angle - 0.12)],
            [cx + 0.42 * Math.cos(angle + 0.12), cy + 0.42 * Math.sin(angle + 0.12)],
        ], detailStyle);
    }

    // Corner accent dots
    drawUV(circle(0.08, 0.08, 0.04, 10), 'filled');
    drawUV(circle(0.92, 0.08, 0.04, 10), 'filled');
    drawUV(circle(0.08, 0.92, 0.04, 10), 'filled');
    drawUV(circle(0.92, 0.92, 0.04, 10), 'filled');
}
