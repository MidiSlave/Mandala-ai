// Eye of Horus — bold almond eye with decorative tearline
import type { PatternContext } from '../types';
import { rect, circle, eyeShape } from './helpers';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    const mainStyle = filled ? 'filled' as const : 'outline' as const;
    const detailStyle = filled ? 'opaque-outline' as const : 'filled' as const;

    const cx = 0.5, cy = 0.5;

    // Border bands top and bottom
    drawUV(rect(0.0, 0.0, 1.0, 0.06), baseStyle);
    drawUV(rect(0.0, 0.94, 1.0, 1.0), baseStyle);

    // Triangle teeth along top border
    for (let i = 0; i < 8; i++) {
        const x = 0.0625 + i * 0.125;
        drawUV([[x - 0.04, 0.06], [x + 0.04, 0.06], [x, 0.14]], baseStyle);
    }

    // Main eye shape — bold almond
    const eye = eyeShape(cx, cy, 0.70, 0.18, 20);
    drawUV(eye, baseStyle);

    // Inner eye cutout (white of the eye)
    const innerEye = eyeShape(cx, cy, 0.54, 0.12, 16);
    drawUV(innerEye, detailStyle);

    // Iris — filled circle
    drawUV(circle(cx, cy, 0.09, 16), filled ? baseStyle : 'filled');

    // Pupil — small contrasting circle
    drawUV(circle(cx, cy, 0.04, 12), detailStyle);

    // Highlight dot
    drawUV(circle(cx + 0.02, cy - 0.02, 0.015, 8), filled ? baseStyle : 'filled');

    // Decorative tear line dropping down from eye (Eye of Horus style)
    const tearPts: [number, number][] = [];
    const tearN = 12;
    for (let i = 0; i <= tearN; i++) {
        const t = i / tearN;
        const tx = cx - 0.05 - t * 0.10;
        const ty = cy + 0.12 + t * 0.25;
        tearPts.push([tx, ty]);
    }
    for (let i = tearN; i >= 0; i--) {
        const t = i / tearN;
        const tx = cx - 0.05 - t * 0.10 + 0.035;
        const ty = cy + 0.12 + t * 0.25;
        tearPts.push([tx, ty]);
    }
    drawUV(tearPts, baseStyle);

    // Spiral curl at tear bottom
    drawUV(circle(cx - 0.16, cy + 0.40, 0.035, 12), baseStyle);
    drawUV(circle(cx - 0.16, cy + 0.40, 0.015, 8), detailStyle);

    // Eyebrow line (thick arc above eye)
    const browPts: [number, number][] = [];
    for (let i = 0; i <= 16; i++) {
        const t = i / 16;
        const u = cx - 0.38 + t * 0.76;
        const v = cy - 0.22 - 0.06 * Math.sin(t * Math.PI);
        browPts.push([u, v]);
    }
    for (let i = 16; i >= 0; i--) {
        const t = i / 16;
        const u = cx - 0.38 + t * 0.76;
        const v = cy - 0.18 - 0.04 * Math.sin(t * Math.PI);
        browPts.push([u, v]);
    }
    drawUV(browPts, mainStyle);

    // Small triangles decorating the bottom border
    for (let i = 0; i < 8; i++) {
        const x = 0.0625 + i * 0.125;
        drawUV([[x - 0.04, 0.94], [x + 0.04, 0.94], [x, 0.86]], baseStyle);
    }
}
