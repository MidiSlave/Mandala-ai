// Asanoha (Hemp Leaf) — six-pointed star from triangular wedges
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    const mainStyle = filled ? 'filled' as const : 'outline' as const;
    const detailStyle = filled ? 'opaque-outline' as const : 'filled' as const;

    const cx = 0.5, cy = 0.5;

    // Six bold triangular wedges radiating from center forming the star
    const numPoints = 6;
    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2 - Math.PI / 2;
        const nextAngle = ((i + 1) / numPoints) * Math.PI * 2 - Math.PI / 2;
        const midAngle = (angle + nextAngle) / 2;

        // Outer tip of the wedge
        const tipU = cx + 0.46 * Math.cos(angle);
        const tipV = cy + 0.46 * Math.sin(angle);

        // Sides of the wedge at the base
        const leftU = cx + 0.16 * Math.cos(angle - 0.35);
        const leftV = cy + 0.16 * Math.sin(angle - 0.35);
        const rightU = cx + 0.16 * Math.cos(angle + 0.35);
        const rightV = cy + 0.16 * Math.sin(angle + 0.35);

        // Main wedge — bold filled triangle
        drawUV([
            [tipU, tipV],
            [leftU, leftV],
            [rightU, rightV],
        ], baseStyle);

        // Secondary diamond between wedges for the star lattice effect
        const outerMidU = cx + 0.38 * Math.cos(midAngle);
        const outerMidV = cy + 0.38 * Math.sin(midAngle);
        const innerMidU = cx + 0.18 * Math.cos(midAngle);
        const innerMidV = cy + 0.18 * Math.sin(midAngle);
        const sideAU = cx + 0.28 * Math.cos(midAngle - 0.28);
        const sideAV = cy + 0.28 * Math.sin(midAngle - 0.28);
        const sideBU = cx + 0.28 * Math.cos(midAngle + 0.28);
        const sideBV = cy + 0.28 * Math.sin(midAngle + 0.28);

        drawUV([
            [outerMidU, outerMidV],
            [sideAU, sideAV],
            [innerMidU, innerMidV],
            [sideBU, sideBV],
        ], detailStyle);
    }

    // Central hexagon
    const hexInner: [number, number][] = [];
    const hexOuter: [number, number][] = [];
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
        hexInner.push([cx + 0.08 * Math.cos(angle), cy + 0.08 * Math.sin(angle)]);
        hexOuter.push([cx + 0.14 * Math.cos(angle), cy + 0.14 * Math.sin(angle)]);
    }
    drawUV(hexOuter, mainStyle);
    drawUV(hexInner, detailStyle);

    // Outer connecting bands between star tips (thick bands)
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
        const nextAngle = ((i + 1) / 6) * Math.PI * 2 - Math.PI / 2;
        const bw = 0.03; // band half-width

        const u1 = cx + 0.44 * Math.cos(angle);
        const v1 = cy + 0.44 * Math.sin(angle);
        const u2 = cx + 0.44 * Math.cos(nextAngle);
        const v2 = cy + 0.44 * Math.sin(nextAngle);

        // Perpendicular offset for band width
        const dx = u2 - u1;
        const dy = v2 - v1;
        const len = Math.sqrt(dx * dx + dy * dy);
        const nx = -dy / len * bw;
        const ny = dx / len * bw;

        drawUV([
            [u1 + nx, v1 + ny],
            [u2 + nx, v2 + ny],
            [u2 - nx, v2 - ny],
            [u1 - nx, v1 - ny],
        ], mainStyle);
    }

    // Corner fill squares
    const corners: [number, number][] = [[0.05, 0.05], [0.95, 0.05], [0.05, 0.95], [0.95, 0.95]];
    for (const [cu, cv] of corners) {
        drawUV([
            [cu - 0.04, cv - 0.04], [cu + 0.04, cv - 0.04],
            [cu + 0.04, cv + 0.04], [cu - 0.04, cv + 0.04],
        ], mainStyle);
    }
}
