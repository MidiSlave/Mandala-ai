// Tapa cross / star motif
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle }: PatternContext): void {
    const cx = 0.5, cy = 0.5;
    const armLen = 0.35;
    const armWidth = 0.06;
    // Four arms of the cross with serrated edges
    for (let arm = 0; arm < 4; arm++) {
        const a = (arm / 4) * Math.PI * 2;
        const perpA = a + Math.PI / 2;
        const nSeg = 4;
        const pts: [number, number][] = [];
        // One side
        for (let s = 0; s <= nSeg; s++) {
            const t = s / nSeg;
            const serr = (s % 2 === 0 ? 1 : 0.6) * armWidth;
            pts.push([
                cx + Math.cos(a) * t * armLen + Math.cos(perpA) * serr,
                cy + Math.sin(a) * t * armLen + Math.sin(perpA) * serr
            ]);
        }
        // Tip
        pts.push([
            cx + Math.cos(a) * armLen,
            cy + Math.sin(a) * armLen
        ]);
        // Other side (reverse)
        for (let s = nSeg; s >= 0; s--) {
            const t = s / nSeg;
            const serr = (s % 2 === 0 ? 1 : 0.6) * armWidth;
            pts.push([
                cx + Math.cos(a) * t * armLen - Math.cos(perpA) * serr,
                cy + Math.sin(a) * t * armLen - Math.sin(perpA) * serr
            ]);
        }
        drawUV(pts, arm % 2 === 0 ? baseStyle : 'outline');
    }
    // Center square
    const sq = armWidth * 1.2;
    drawUV([
        [cx - sq, cy - sq], [cx + sq, cy - sq],
        [cx + sq, cy + sq], [cx - sq, cy + sq]
    ], baseStyle);
}
