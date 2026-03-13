// Mycelium network — branching vein-like paths
import type { PatternContext } from '../types';
import { circleUV } from './helpers';

export function draw({ drawUV, filled, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const numTraces = 5 + Math.floor(r() * 4);

    for (let t = 0; t < numTraces; t++) {
        // Start from random positions
        let x = 0.1 + r() * 0.8;
        let y = 0.1 + r() * 0.8;
        const angle = r() * Math.PI * 2;
        const pts: [number, number][] = [[x, y]];

        // Main trunk
        const trunkLen = 8 + Math.floor(r() * 8);
        let dir = angle;
        for (let s = 0; s < trunkLen; s++) {
            dir += (r() - 0.5) * 0.8;
            x += Math.cos(dir) * 0.04;
            y += Math.sin(dir) * 0.04;
            if (x < 0 || x > 1 || y < 0 || y > 1) break;
            pts.push([x, y]);

            // Branch at some points
            if (r() > 0.6 && s > 1) {
                const branchDir = dir + (r() > 0.5 ? 1 : -1) * (0.4 + r() * 0.8);
                let bx = x, by = y;
                const branchPts: [number, number][] = [[bx, by]];
                const branchLen = 2 + Math.floor(r() * 4);
                for (let b = 0; b < branchLen; b++) {
                    bx += Math.cos(branchDir + (r() - 0.5) * 0.3) * 0.03;
                    by += Math.sin(branchDir + (r() - 0.5) * 0.3) * 0.03;
                    if (bx < 0 || bx > 1 || by < 0 || by > 1) break;
                    branchPts.push([bx, by]);
                }
                if (branchPts.length > 1) {
                    drawUV(branchPts, 'line');
                    // Terminal node
                    if (filled) {
                        const last = branchPts[branchPts.length - 1];
                        drawUV(circleUV(last[0], last[1], 0.008, 6), 'filled');
                    }
                }
            }
        }
        if (pts.length > 2) {
            drawUV(pts, t % 2 === 0 ? baseStyle : 'line');
        }
    }
}
