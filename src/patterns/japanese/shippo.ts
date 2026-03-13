// Shippo (Seven Treasures) — overlapping circles forming petal shapes
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    const mainStyle = filled ? 'filled' as const : 'outline' as const;
    const detailStyle = filled ? 'opaque-outline' as const : 'filled' as const;

    const cx = 0.5, cy = 0.5;
    const petalSegments = 24;

    // Four main petal shapes (formed by circle intersections)
    const petalDirs: [number, number][] = [
        [0, -1], [1, 0], [0, 1], [-1, 0]
    ];

    for (const [dx, dy] of petalDirs) {
        // Each petal is a lens/vesica shape
        const petalPoints: [number, number][] = [];
        const petalLen = 0.32;
        const petalWidth = 0.16;

        // Tip of petal (away from center)
        const tipU = cx + dx * petalLen;
        const tipV = cy + dy * petalLen;

        // Base of petal (at center)
        const baseU = cx + dx * 0.04;
        const baseV = cy + dy * 0.04;

        // Build petal as a smooth lens shape
        for (let s = 0; s <= petalSegments; s++) {
            const t = s / petalSegments;
            const along = baseU + (tipU - baseU) * t;
            const alongV = baseV + (tipV - baseV) * t;
            // Bulge perpendicular to petal direction
            const bulge = petalWidth * Math.sin(t * Math.PI);
            const perpU = -dy * bulge;
            const perpV = dx * bulge;
            petalPoints.push([along + perpU, alongV + perpV]);
        }
        // Return along the other side
        for (let s = petalSegments; s >= 0; s--) {
            const t = s / petalSegments;
            const along = baseU + (tipU - baseU) * t;
            const alongV = baseV + (tipV - baseV) * t;
            const bulge = petalWidth * Math.sin(t * Math.PI);
            const perpU = dy * bulge;
            const perpV = -dx * bulge;
            petalPoints.push([along + perpU, alongV + perpV]);
        }

        drawUV(petalPoints, baseStyle);

        // Inner detail petal (smaller, contrasting)
        const innerPoints: [number, number][] = [];
        const innerLen = 0.24;
        const innerWidth = 0.08;
        const innerTipU = cx + dx * innerLen;
        const innerTipV = cy + dy * innerLen;
        const innerBaseU = cx + dx * 0.08;
        const innerBaseV = cy + dy * 0.08;

        for (let s = 0; s <= petalSegments; s++) {
            const t = s / petalSegments;
            const along = innerBaseU + (innerTipU - innerBaseU) * t;
            const alongV = innerBaseV + (innerTipV - innerBaseV) * t;
            const bulge = innerWidth * Math.sin(t * Math.PI);
            innerPoints.push([along + (-dy) * bulge, alongV + dx * bulge]);
        }
        for (let s = petalSegments; s >= 0; s--) {
            const t = s / petalSegments;
            const along = innerBaseU + (innerTipU - innerBaseU) * t;
            const alongV = innerBaseV + (innerTipV - innerBaseV) * t;
            const bulge = innerWidth * Math.sin(t * Math.PI);
            innerPoints.push([along + dy * bulge, alongV + (-dx) * bulge]);
        }

        drawUV(innerPoints, detailStyle);
    }

    // Diagonal petals (4 more for 8-fold symmetry)
    const diagDirs: [number, number][] = [
        [0.707, -0.707], [0.707, 0.707], [-0.707, 0.707], [-0.707, -0.707]
    ];

    for (const [dx, dy] of diagDirs) {
        const petalPoints: [number, number][] = [];
        const petalLen = 0.26;
        const petalWidth = 0.10;
        const tipU = cx + dx * petalLen;
        const tipV = cy + dy * petalLen;
        const baseU = cx + dx * 0.06;
        const baseV = cy + dy * 0.06;

        for (let s = 0; s <= petalSegments; s++) {
            const t = s / petalSegments;
            const along = baseU + (tipU - baseU) * t;
            const alongV = baseV + (tipV - baseV) * t;
            const bulge = petalWidth * Math.sin(t * Math.PI);
            petalPoints.push([along + (-dy) * bulge, alongV + dx * bulge]);
        }
        for (let s = petalSegments; s >= 0; s--) {
            const t = s / petalSegments;
            const along = baseU + (tipU - baseU) * t;
            const alongV = baseV + (tipV - baseV) * t;
            const bulge = petalWidth * Math.sin(t * Math.PI);
            petalPoints.push([along + dy * bulge, alongV + (-dx) * bulge]);
        }

        drawUV(petalPoints, mainStyle);
    }

    // Central circle
    const centerPoints: [number, number][] = [];
    for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        centerPoints.push([cx + 0.07 * Math.cos(angle), cy + 0.07 * Math.sin(angle)]);
    }
    drawUV(centerPoints, detailStyle);

    // Tiny center dot
    const dotPoints: [number, number][] = [];
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        dotPoints.push([cx + 0.03 * Math.cos(angle), cy + 0.03 * Math.sin(angle)]);
    }
    drawUV(dotPoints, mainStyle);
}
