// Hexagonal subdivision
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const drawHex = (cx: number, cy: number, size: number, depth: number) => {
        const pts: [number, number][] = [];
        for (let i = 0; i <= 6; i++) {
            const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
            pts.push([cx + Math.cos(a) * size, cy + Math.sin(a) * size * 0.8]);
        }
        drawUV(pts, depth === 0 ? baseStyle : 'outline');
        if (depth <= 0) return;
        const childSize = size * 0.45;
        // Center hex
        drawHex(cx, cy, childSize, depth - 1);
        // Surrounding hexes
        for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2;
            const nx = cx + Math.cos(a) * size * 0.58;
            const ny = cy + Math.sin(a) * size * 0.58 * 0.8;
            if (nx > 0 && nx < 1 && ny > 0 && ny < 1) {
                drawHex(nx, ny, childSize * 0.6, depth - 1);
            }
        }
    };
    drawHex(0.5, 0.5, 0.35, 1 + Math.floor(r() * 2));
}
