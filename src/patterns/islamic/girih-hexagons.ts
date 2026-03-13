import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const cols = 3, rows = 2;
    const cellW = 1 / cols, cellH = 1 / rows;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cx = (col + 0.5) * cellW;
            const cy = (row + 0.5) * cellH;
            const rad = cellW * 0.4;
            const hex: [number, number][] = [];
            for (let i = 0; i < 6; i++) {
                const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
                hex.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]);
            }
            drawUV(hex, (row + col) % 2 === 0 ? baseStyle : 'outline');
            // Connector lines to neighbors
            for (let i = 0; i < 6; i++) {
                const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
                drawUV([
                    [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad],
                    [cx + Math.cos(a) * rad * 1.5, cy + Math.sin(a) * rad * 1.5]
                ], 'line');
            }
        }
    }
}
