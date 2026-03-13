// Serpent Scales
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    const cols = 3, rows = 2;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cx = (col + 0.5 + (row % 2) * 0.5) / (cols + 1);
            const cy = (row + 0.5) / (rows + 0.5);
            const w = 0.3 / cols;
            const h = 0.35 / rows;
            const pts: [number, number][] = [];
            for (let t = 0; t <= 12; t++) {
                const angle = (t / 12) * Math.PI;
                pts.push([cx + Math.cos(angle) * w, cy - Math.sin(angle) * h]);
            }
            drawUV(pts, row % 2 === 0 ? baseStyle : (filled ? 'opaque-outline' : 'outline'));
        }
    }
}
