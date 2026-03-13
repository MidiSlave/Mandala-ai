// Fountain / Chevron Stack — nested V-shapes with decorative cap
import type { PatternContext } from '../types';
import { filledRect } from './helpers';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    const mainStyle = filled ? 'filled' as const : 'outline' as const;
    const detailStyle = filled ? 'opaque-outline' as const : 'filled' as const;

    const cx = 0.5;
    const bandWidth = 0.04; // thickness of each chevron band

    // 6 nested chevrons from bottom to top, decreasing in size
    const chevrons = [
        { width: 0.46, tipV: 0.12, armV: 0.0 },
        { width: 0.40, tipV: 0.26, armV: 0.14 },
        { width: 0.34, tipV: 0.40, armV: 0.28 },
        { width: 0.28, tipV: 0.52, armV: 0.40 },
        { width: 0.22, tipV: 0.62, armV: 0.52 },
        { width: 0.16, tipV: 0.72, armV: 0.62 },
    ];

    for (let i = 0; i < chevrons.length; i++) {
        const { width, tipV, armV } = chevrons[i];
        const style = i % 2 === 0 ? baseStyle : detailStyle;

        // Each chevron is a filled V-band shape
        // Outer V
        const outerLeft = cx - width;
        const outerRight = cx + width;

        // Draw as a single polygon: outer V clockwise, then inner V counterclockwise
        drawUV([
            [outerLeft, armV],          // outer left arm top
            [cx, tipV],                 // outer tip (bottom center)
            [outerRight, armV],         // outer right arm top
            [outerRight, armV + bandWidth], // outer right arm bottom
            [cx, tipV + bandWidth],     // outer tip bottom
            [outerLeft, armV + bandWidth],  // outer left arm bottom
        ], style);

        // Inner fill for visual depth (solid inner area)
        if (i % 2 === 0) {
            // Inner V (smaller, creating the band)
            const innerWidth = width - bandWidth * 1.8;
            const innerTipV = tipV - bandWidth * 1.2;
            const innerLeft = cx - innerWidth;
            const innerRight = cx + innerWidth;

            drawUV([
                [innerLeft, armV + bandWidth * 0.5],
                [cx, innerTipV + bandWidth],
                [innerRight, armV + bandWidth * 0.5],
            ], detailStyle);
        }
    }

    // Decorative cap on top — a filled circle/diamond
    const capPts: [number, number][] = [];
    const capR = 0.08;
    const capCY = 0.78;
    for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        capPts.push([cx + capR * Math.cos(a), capCY + capR * 0.8 * Math.sin(a)]);
    }
    drawUV(capPts, baseStyle);

    // Inner cap detail
    const innerCapPts: [number, number][] = [];
    const innerCapR = 0.04;
    for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        innerCapPts.push([cx + innerCapR * Math.cos(a), capCY + innerCapR * 0.8 * Math.sin(a)]);
    }
    drawUV(innerCapPts, detailStyle);

    // Vertical spine through center
    drawUV(filledRect(0.48, 0.0, 0.52, 0.70), filled ? 'opaque-outline' : 'filled');

    // Topmost decorative finial — small triangle above cap
    drawUV([
        [0.45, 0.86], [0.55, 0.86],
        [0.50, 0.96],
    ], baseStyle);

    // Side border columns
    drawUV(filledRect(0.0, 0.0, 0.05, 0.96), mainStyle);
    drawUV(filledRect(0.95, 0.0, 1.0, 0.96), mainStyle);

    // Horizontal base band
    drawUV(filledRect(0.0, 0.0, 1.0, 0.03), 'filled');

    // Small squares on side columns
    for (let i = 0; i < 5; i++) {
        const v = 0.08 + i * 0.17;
        drawUV(filledRect(0.01, v, 0.04, v + 0.04), detailStyle);
        drawUV(filledRect(0.96, v, 0.99, v + 0.04), detailStyle);
    }
}
