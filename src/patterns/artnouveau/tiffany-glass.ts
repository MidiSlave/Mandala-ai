// Tiffany glass segments — stained glass with organic borders
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const nSegments = 4 + Math.floor(r() * 3);
    for (let seg = 0; seg < nSegments; seg++) {
        const baseU = (seg + 0.5) / nSegments;
        const width = 0.8 / nSegments;
        const pts: [number, number][] = [];
        // Left border (wavy)
        for (let s = 0; s <= 8; s++) {
            const v = s / 8;
            const wobble = Math.sin(v * Math.PI * 2 + seg) * 0.015;
            pts.push([baseU - width / 2 + wobble, v]);
        }
        // Right border (wavy, reverse)
        for (let s = 8; s >= 0; s--) {
            const v = s / 8;
            const wobble = Math.sin(v * Math.PI * 2 + seg + 1) * 0.015;
            pts.push([baseU + width / 2 + wobble, v]);
        }
        drawUV(pts, seg % 2 === 0 ? baseStyle : 'outline');
    }
}
