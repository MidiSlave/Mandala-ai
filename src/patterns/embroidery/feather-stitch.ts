// Feather stitch — alternating V-branches from spine
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const branches = 6 + Math.floor(r() * 6);
    const branchW = 0.15 + r() * 0.15;
    const spineU = 0.5;
    // Draw spine
    drawUV([[spineU, 0.02], [spineU, 0.98]], 'line');
    for (let i = 0; i < branches; i++) {
        const v = 0.06 + (i / branches) * 0.88;
        const vEnd = v + 0.85 / branches * 0.5;
        const side = i % 2 === 0 ? -1 : 1;
        // Branch line
        drawUV([[spineU, v], [spineU + side * branchW, vEnd]], 'line');
        // Secondary branch
        if (r() > 0.3) {
            const midU = spineU + side * branchW * 0.6;
            const midV = (v + vEnd) / 2;
            drawUV([[midU, midV], [midU + side * branchW * 0.4, midV + 0.03]], 'line');
        }
        // Small leaf/dot at branch tip
        if (filled && r() > 0.4) {
            const tipU = spineU + side * branchW;
            const ds = 0.012;
            drawUV([
                [tipU - ds, vEnd], [tipU, vEnd - ds],
                [tipU + ds, vEnd], [tipU, vEnd + ds]
            ], 'filled');
        }
    }
}
