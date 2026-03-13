// Noise traces — particle paths following noise field
import type { PatternContext } from '../types';
import { smoothNoise } from './helpers';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const numTraces = 8 + Math.floor(r() * 6);
    const noiseScale = 2 + r() * 2;
    const noiseOffset = r() * 100;

    for (let i = 0; i < numTraces; i++) {
        let x = r() * 0.3;
        let y = 0.05 + (i / numTraces) * 0.9;
        const pts: [number, number][] = [[x, y]];
        const steps = 25 + Math.floor(r() * 15);

        for (let s = 0; s < steps; s++) {
            const n = smoothNoise(x * noiseScale + noiseOffset, y * noiseScale + noiseOffset);
            const angle = n * Math.PI * 4;
            x += Math.cos(angle) * 0.025;
            y += Math.sin(angle) * 0.025;
            if (x < 0 || x > 1 || y < 0 || y > 1) break;
            pts.push([x, y]);
        }
        if (pts.length > 3) {
            drawUV(pts, 'line');
        }
    }

    // Accent dots at trace starts
    if (filled) {
        for (let i = 0; i < numTraces; i++) {
            const cx = r() * 0.3;
            const cy = 0.05 + (i / numTraces) * 0.9;
            const dotR = 0.012;
            const dotPts: [number, number][] = [];
            for (let j = 0; j <= 8; j++) {
                const a = (j / 8) * Math.PI * 2;
                dotPts.push([cx + Math.cos(a) * dotR, cy + Math.sin(a) * dotR]);
            }
            drawUV(dotPts, 'filled');
        }
    }
}
