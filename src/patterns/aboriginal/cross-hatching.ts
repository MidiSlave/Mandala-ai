import type { PatternContext } from '../types';
import { dotCircle } from './helpers';

export function draw({ drawUV, filled, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const nBands = 3 + Math.floor(r() * 2);
    const bandH = 1 / nBands;
    for (let band = 0; band < nBands; band++) {
        const y0 = band * bandH;
        const y1 = (band + 1) * bandH;
        if (band % 2 === 0) {
            // Diagonal hatching
            const nLines = 6 + Math.floor(r() * 4);
            for (let l = 0; l < nLines; l++) {
                const u = l / nLines;
                drawUV([[u, y0], [u + 0.08, y1]], 'line');
            }
        } else {
            // Dot fill
            const cols = 6 + Math.floor(r() * 4);
            const rows = 2;
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const du = (col + 0.5) / cols;
                    const dv = y0 + (row + 0.5) / rows * bandH;
                    drawUV(dotCircle(du, dv, 0.008, 6),
                        (row + col) % 2 === 0 ? baseStyle : 'filled');
                }
            }
        }
    }
}
