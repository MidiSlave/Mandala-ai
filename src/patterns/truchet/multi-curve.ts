// Multi-curve Truchet — three arcs per tile
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const cols = 3, rows = 2;
    const cellW = 1 / cols, cellH = 1 / rows;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = col * cellW, y = row * cellH;
            const rot = Math.floor(r() * 4);
            for (let ring = 0; ring < 3; ring++) {
                const radius = cellW * (0.15 + ring * 0.12);
                const pts: [number, number][] = [];
                const corners = [[x, y], [x + cellW, y], [x + cellW, y + cellH], [x, y + cellH]];
                const corner = corners[(rot + ring) % 4];
                for (let s = 0; s <= 8; s++) {
                    const a = ((rot + ring) % 4) * Math.PI / 2 + (s / 8) * Math.PI / 2;
                    pts.push([corner[0] + Math.cos(a) * radius, corner[1] + Math.sin(a) * radius]);
                }
                drawUV(pts, ring === 1 ? baseStyle : 'line');
            }
        }
    }
}
