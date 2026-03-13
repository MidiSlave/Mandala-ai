// Shark teeth (niho mano) — row of triangles
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const nRows = 2 + Math.floor(r() * 2);
    const rowH = 1 / nRows;
    for (let row = 0; row < nRows; row++) {
        const y0 = row * rowH;
        const y1 = y0 + rowH;
        const yMid = (y0 + y1) / 2;
        const nTeeth = 5 + Math.floor(r() * 4);
        const toothW = 1 / nTeeth;
        for (let t = 0; t < nTeeth; t++) {
            const x0 = t * toothW;
            const x1 = x0 + toothW;
            const xMid = (x0 + x1) / 2;
            // Upper tooth
            drawUV([[x0, yMid], [xMid, y0], [x1, yMid]],
                (t + row) % 2 === 0 ? baseStyle : 'outline');
            // Lower tooth
            drawUV([[x0, yMid], [xMid, y1], [x1, yMid]],
                (t + row) % 2 === 0 ? 'outline' : baseStyle);
        }
    }
}
