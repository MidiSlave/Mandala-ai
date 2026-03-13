// Rosette guilloche — overlapping circular arcs
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const nPetals = 3 + Math.floor(r() * 4);
    for (let j = 0; j < nPetals; j++) {
        const cx = (j + 0.5) / nPetals;
        const pts: [number, number][] = [];
        const radius = 0.12 + r() * 0.06;
        for (let s = 0; s <= 16; s++) {
            const a = (s / 16) * Math.PI * 2;
            pts.push([
                cx + Math.cos(a) * radius * 0.8,
                0.5 + Math.sin(a) * radius
            ]);
        }
        drawUV(pts, j % 2 === 0 ? baseStyle : 'outline');
    }
    // Connecting sine ribbon
    const ribbon: [number, number][] = [];
    for (let s = 0; s <= 30; s++) {
        const u = s / 30;
        ribbon.push([u, 0.5 + Math.sin(u * Math.PI * nPetals * 2) * 0.08]);
    }
    drawUV(ribbon, 'line');
}
