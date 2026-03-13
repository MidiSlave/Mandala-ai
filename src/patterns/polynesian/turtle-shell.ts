// Turtle shell (honu) — hexagonal pattern
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle }: PatternContext): void {
    const cx = 0.5, cy = 0.5;
    // Central hexagon
    const mainR = 0.25;
    const hex: [number, number][] = [];
    for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
        hex.push([cx + Math.cos(a) * mainR, cy + Math.sin(a) * mainR]);
    }
    drawUV(hex, baseStyle);
    // Inner subdivisions
    for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
        // Line from center to each vertex
        drawUV([
            [cx, cy],
            [cx + Math.cos(a) * mainR, cy + Math.sin(a) * mainR]
        ], 'line');
        // Scale pattern in each triangle
        const a2 = ((i + 1) / 6) * Math.PI * 2 - Math.PI / 6;
        const midR = mainR * 0.55;
        const midA = (a + a2) / 2;
        const scaleR = mainR * 0.12;
        const scalePts: [number, number][] = [];
        for (let s = 0; s <= 6; s++) {
            const sa = (s / 6) * Math.PI * 2;
            scalePts.push([
                cx + Math.cos(midA) * midR + Math.cos(sa) * scaleR,
                cy + Math.sin(midA) * midR + Math.sin(sa) * scaleR
            ]);
        }
        drawUV(scalePts, i % 2 === 0 ? 'outline' : baseStyle);
    }
}
