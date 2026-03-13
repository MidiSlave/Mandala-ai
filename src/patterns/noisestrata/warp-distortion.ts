// Warp distortion — concentric rings warped by noise
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const numRings = 5 + Math.floor(r() * 4);
    const warpAmp = 0.05 + r() * 0.05;
    const warpFreq = 2 + r() * 3;
    const warpPhase = r() * 100;

    for (let i = 0; i < numRings; i++) {
        const baseR = (i + 0.5) / numRings * 0.45;
        const pts: [number, number][] = [];
        const steps = 24;
        for (let s = 0; s <= steps; s++) {
            const a = (s / steps) * Math.PI * 2;
            // Warp radius using noise
            const warp = Math.sin(a * warpFreq + warpPhase + i * 1.7) * warpAmp;
            const rr = baseR + warp;
            const u = 0.5 + Math.cos(a) * rr;
            const v = 0.5 + Math.sin(a) * rr;
            pts.push([Math.min(1, Math.max(0, u)), Math.min(1, Math.max(0, v))]);
        }
        drawUV(pts, i % 2 === 0 ? baseStyle : 'outline');
    }
}
