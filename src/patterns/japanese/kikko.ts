// Kikko (Tortoiseshell) — hexagonal tessellation with nested hexagons
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    const mainStyle = filled ? 'filled' as const : 'outline' as const;
    const detailStyle = filled ? 'opaque-outline' as const : 'filled' as const;

    const cx = 0.5, cy = 0.5;

    // Outer hexagonal frame (thick band)
    const outerR = 0.46;
    const innerR = 0.36;
    const outerHex: [number, number][] = [];
    const innerHex: [number, number][] = [];

    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 - Math.PI / 6;
        outerHex.push([cx + outerR * Math.cos(angle), cy + outerR * Math.sin(angle)]);
        innerHex.push([cx + innerR * Math.cos(angle), cy + innerR * Math.sin(angle)]);
    }

    // Draw outer hex frame as 6 trapezoids for bold look
    for (let i = 0; i < 6; i++) {
        const next = (i + 1) % 6;
        drawUV([
            outerHex[i],
            outerHex[next],
            innerHex[next],
            innerHex[i],
        ], baseStyle);
    }

    // Middle hexagon (outline/detail)
    const midR = 0.28;
    const midHex: [number, number][] = [];
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 - Math.PI / 6;
        midHex.push([cx + midR * Math.cos(angle), cy + midR * Math.sin(angle)]);
    }
    drawUV(midHex, detailStyle);

    // Inner hexagonal frame
    const innerFrameOuterR = 0.22;
    const innerFrameInnerR = 0.14;
    const ifo: [number, number][] = [];
    const ifi: [number, number][] = [];
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 - Math.PI / 6;
        ifo.push([cx + innerFrameOuterR * Math.cos(angle), cy + innerFrameOuterR * Math.sin(angle)]);
        ifi.push([cx + innerFrameInnerR * Math.cos(angle), cy + innerFrameInnerR * Math.sin(angle)]);
    }

    for (let i = 0; i < 6; i++) {
        const next = (i + 1) % 6;
        drawUV([
            ifo[i], ifo[next],
            ifi[next], ifi[i],
        ], mainStyle);
    }

    // Innermost hexagon (solid)
    const coreR = 0.08;
    const coreHex: [number, number][] = [];
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 - Math.PI / 6;
        coreHex.push([cx + coreR * Math.cos(angle), cy + coreR * Math.sin(angle)]);
    }
    drawUV(coreHex, detailStyle);

    // Decorative triangles at each vertex of the outer hex
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 - Math.PI / 6;

        const vu = cx + outerR * Math.cos(angle);
        const vv = cy + outerR * Math.sin(angle);
        const lu = cx + (outerR - 0.08) * Math.cos(angle - 0.15);
        const lv = cy + (outerR - 0.08) * Math.sin(angle - 0.15);
        const ru = cx + (outerR - 0.08) * Math.cos(angle + 0.15);
        const rv = cy + (outerR - 0.08) * Math.sin(angle + 0.15);

        drawUV([[vu, vv], [lu, lv], [ru, rv]], detailStyle);
    }

    // Radial connector bands from inner to outer hex (thick bars)
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 - Math.PI / 6;
        const bw = 0.025;
        const perpAngle = angle + Math.PI / 2;

        const u1 = cx + innerFrameOuterR * Math.cos(angle);
        const v1 = cy + innerFrameOuterR * Math.sin(angle);
        const u2 = cx + innerR * Math.cos(angle);
        const v2 = cy + innerR * Math.sin(angle);

        drawUV([
            [u1 + bw * Math.cos(perpAngle), v1 + bw * Math.sin(perpAngle)],
            [u2 + bw * Math.cos(perpAngle), v2 + bw * Math.sin(perpAngle)],
            [u2 - bw * Math.cos(perpAngle), v2 - bw * Math.sin(perpAngle)],
            [u1 - bw * Math.cos(perpAngle), v1 - bw * Math.sin(perpAngle)],
        ], mainStyle);
    }
}
