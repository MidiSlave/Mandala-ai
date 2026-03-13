// Metaballs — organic merging blobs
import type { PatternContext } from '../types';
import { circleUV } from './helpers';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const numBlobs = 3 + Math.floor(r() * 3);
    const blobs: [number, number][] = [];
    for (let i = 0; i < numBlobs; i++) {
        blobs.push([0.2 + r() * 0.6, 0.2 + r() * 0.6]);
    }

    // Sample field and draw contours at threshold
    const gridSize = 16;
    const threshold = 1.2 + r() * 0.6;
    const cellW = 1.0 / gridSize;
    const cellH = 1.0 / gridSize;

    const field = (u: number, v: number): number => {
        let sum = 0;
        for (const b of blobs) {
            const dx = u - b[0];
            const dy = v - b[1];
            sum += 1 / (dx * dx + dy * dy + 0.001);
        }
        return sum;
    };

    // Simple marching squares - draw edges where field crosses threshold
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const u0 = col * cellW;
            const v0 = row * cellH;
            const u1 = u0 + cellW;
            const v1 = v0 + cellH;

            const f00 = field(u0, v0) > threshold ? 1 : 0;
            const f10 = field(u1, v0) > threshold ? 1 : 0;
            const f01 = field(u0, v1) > threshold ? 1 : 0;
            const f11 = field(u1, v1) > threshold ? 1 : 0;
            const config = f00 | (f10 << 1) | (f01 << 2) | (f11 << 3);

            if (config === 0 || config === 15) continue;

            // Draw cell interior when all corners inside (filled mode)
            if (filled && config === 15) {
                drawUV([[u0, v0], [u1, v0], [u1, v1], [u0, v1]], 'filled');
            }

            // Edge midpoints
            const top: [number, number] = [(u0 + u1) / 2, v0];
            const bot: [number, number] = [(u0 + u1) / 2, v1];
            const left: [number, number] = [u0, (v0 + v1) / 2];
            const right: [number, number] = [u1, (v0 + v1) / 2];

            // Simplified contour edges
            if (config === 1 || config === 14) drawUV([top, left], 'line');
            else if (config === 2 || config === 13) drawUV([top, right], 'line');
            else if (config === 4 || config === 11) drawUV([left, bot], 'line');
            else if (config === 8 || config === 7) drawUV([right, bot], 'line');
            else if (config === 3 || config === 12) drawUV([left, right], 'line');
            else if (config === 5 || config === 10) drawUV([top, bot], 'line');
            else if (config === 6 || config === 9) {
                drawUV([top, left], 'line');
                drawUV([right, bot], 'line');
            }
        }
    }

    // Draw blob centers
    for (const b of blobs) {
        drawUV(circleUV(b[0], b[1], 0.02, 8), filled ? 'filled' : 'outline');
    }
}
