// Triangle Teeth & Zigzag — bold horizontal bands
import type { PatternContext } from '../types';
import { rect, diamond, circle, eyeShape } from './helpers';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    const mainStyle = filled ? 'filled' as const : 'outline' as const;
    const detailStyle = filled ? 'opaque-outline' as const : 'filled' as const;

    // Top thick band
    drawUV(rect(0.0, 0.0, 1.0, 0.06), baseStyle);

    // Row of downward-pointing triangles
    for (let i = 0; i < 6; i++) {
        const x = (i + 0.5) / 6;
        drawUV([
            [x - 0.07, 0.06], [x + 0.07, 0.06], [x, 0.18]
        ], baseStyle);
    }

    // Thin separator
    drawUV(rect(0.0, 0.19, 1.0, 0.22), mainStyle);

    // Zigzag band (thick)
    {
        const zigW = 0.05;
        const zigPeaks = 5;
        const topV = 0.24;
        const botV = 0.38;
        const midV = (topV + botV) / 2;

        for (let i = 0; i < zigPeaks; i++) {
            const x1 = i / zigPeaks;
            const x2 = (i + 0.5) / zigPeaks;
            const x3 = (i + 1) / zigPeaks;

            drawUV([
                [x1, midV - zigW], [x2, topV], [x2 + 0.01, topV],
                [x1 + 0.02, midV],
            ], baseStyle);
            drawUV([
                [x2, topV], [x3, midV - zigW], [x3, midV + zigW],
                [x2, topV + zigW * 2],
            ], baseStyle);
            drawUV([
                [x1, midV + zigW], [x2, botV], [x2 + 0.02, botV],
                [x1 + 0.02, midV],
            ], baseStyle);
            drawUV([
                [x2, botV], [x3, midV + zigW], [x3, midV - zigW],
                [x2, botV - zigW * 2],
            ], baseStyle);
        }
    }

    // Separator
    drawUV(rect(0.0, 0.40, 1.0, 0.43), mainStyle);

    // Row of upward-pointing triangles (alternating filled/detail)
    for (let i = 0; i < 6; i++) {
        const x = (i + 0.5) / 6;
        drawUV([
            [x - 0.07, 0.56], [x + 0.07, 0.56], [x, 0.43]
        ], i % 2 === 0 ? baseStyle : detailStyle);
    }

    // Diamond chain row
    drawUV(rect(0.0, 0.57, 1.0, 0.60), mainStyle);
    for (let i = 0; i < 5; i++) {
        const x = 0.1 + i * 0.2;
        drawUV(diamond(x, 0.68, 0.08, 0.07), baseStyle);
        drawUV(diamond(x, 0.68, 0.04, 0.035), detailStyle);
    }
    drawUV(rect(0.0, 0.76, 1.0, 0.79), mainStyle);

    // Bottom row: bold oval eye shapes
    for (let i = 0; i < 4; i++) {
        const x = 0.125 + i * 0.25;
        const eye = eyeShape(x, 0.87, 0.18, 0.055, 12);
        drawUV(eye, baseStyle);
        drawUV(circle(x, 0.87, 0.025, 10), detailStyle);
    }

    // Bottom band
    drawUV(rect(0.0, 0.94, 1.0, 1.0), baseStyle);
}
