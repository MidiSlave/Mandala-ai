import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const m = Math.floor(r() * 3) + 1;
    const n = Math.floor(r() * 3) + 2;
    // Draw the zero-crossings as contours
    const gridN = 12;
    for (let gy = 0; gy < gridN; gy++) {
        const pts: [number, number][] = [];
        for (let gx = 0; gx <= gridN; gx++) {
            const u = (gx + 0.5) / (gridN + 1);
            const v = (gy + 0.5) / (gridN + 1);
            const val = Math.cos(m * Math.PI * u) * Math.cos(n * Math.PI * v)
                      - Math.cos(n * Math.PI * u) * Math.cos(m * Math.PI * v);
            // Offset v by the Chladni value to create topographic lines
            const offsetV = v + val * 0.06;
            pts.push([u, Math.min(1, Math.max(0, offsetV))]);
        }
        drawUV(pts, gy % 3 === 0 ? baseStyle : 'line');
    }
}
