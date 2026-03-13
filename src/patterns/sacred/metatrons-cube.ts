import type { PatternContext } from '../types';
import { circle, band, diamond, arcBand } from './helpers';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    const mainStyle = filled ? 'filled' as const : 'outline' as const;
    const detailStyle = filled ? 'opaque-outline' as const : 'filled' as const;

    const cx = 0.5, cy = 0.5;
    const bandW = 0.04;
    const nodeR = 0.055;

    // 13 nodes
    const nodes: [number, number][] = [[cx, cy]];
    const innerHex = 0.17;
    const outerHex = 0.34;
    for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        nodes.push([cx + innerHex * Math.cos(a), cy + innerHex * Math.sin(a)]);
    }
    for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        nodes.push([cx + outerHex * Math.cos(a), cy + outerHex * Math.sin(a)]);
    }

    // Outer boundary
    drawUV(arcBand(cx, cy, 0.43, 0.47, 0, Math.PI * 2, 32), baseStyle);

    // All connections as thick bands
    // Center to inner ring
    for (let i = 1; i <= 6; i++) {
        drawUV(band(nodes[0][0], nodes[0][1], nodes[i][0], nodes[i][1], bandW), baseStyle);
    }
    // Inner ring connections
    for (let i = 0; i < 6; i++) {
        const j = (i + 1) % 6;
        drawUV(band(nodes[1 + i][0], nodes[1 + i][1], nodes[1 + j][0], nodes[1 + j][1], bandW), baseStyle);
    }
    // Inner to outer (radial)
    for (let i = 0; i < 6; i++) {
        drawUV(band(nodes[1 + i][0], nodes[1 + i][1], nodes[7 + i][0], nodes[7 + i][1], bandW), baseStyle);
    }
    // Outer ring connections
    for (let i = 0; i < 6; i++) {
        const j = (i + 1) % 6;
        drawUV(band(nodes[7 + i][0], nodes[7 + i][1], nodes[7 + j][0], nodes[7 + j][1], bandW), baseStyle);
    }
    // Cross connections (inner to adjacent outer) — for cube projection
    for (let i = 0; i < 6; i++) {
        const j = (i + 1) % 6;
        drawUV(band(nodes[1 + i][0], nodes[1 + i][1], nodes[7 + j][0], nodes[7 + j][1], bandW * 0.7), mainStyle);
    }

    // Bold node circles on top
    for (const [nx, ny] of nodes) {
        drawUV(circle(nx, ny, nodeR, 16), baseStyle);
        drawUV(circle(nx, ny, nodeR * 0.45, 12), detailStyle);
    }

    // Extra: hexagonal fill between inner and outer rings
    for (let i = 0; i < 6; i++) {
        const a = ((i + 0.5) / 6) * Math.PI * 2;
        drawUV(diamond(
            cx + 0.26 * Math.cos(a), cy + 0.26 * Math.sin(a),
            0.03, 0.03
        ), 'filled');
    }
}
