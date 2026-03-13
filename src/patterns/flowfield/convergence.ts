// Convergence — lines converging to focal points
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const foci = 2 + Math.floor(r() * 2);
    const focalPoints: [number, number][] = [];
    for (let i = 0; i < foci; i++) {
        focalPoints.push([0.2 + r() * 0.6, 0.2 + r() * 0.6]);
    }

    const numLines = 10 + Math.floor(r() * 8);
    for (let i = 0; i < numLines; i++) {
        // Start from edges
        let startU: number, startV: number;
        const edge = Math.floor(r() * 4);
        if (edge === 0) { startU = r(); startV = 0; }
        else if (edge === 1) { startU = 1; startV = r(); }
        else if (edge === 2) { startU = r(); startV = 1; }
        else { startU = 0; startV = r(); }

        // Find nearest focal point
        let nearestIdx = 0;
        let nearestDist = Infinity;
        for (let f = 0; f < foci; f++) {
            const du = focalPoints[f][0] - startU;
            const dv = focalPoints[f][1] - startV;
            const d = du * du + dv * dv;
            if (d < nearestDist) {
                nearestDist = d;
                nearestIdx = f;
            }
        }

        const target = focalPoints[nearestIdx];
        const pts: [number, number][] = [];
        const steps = 12;
        for (let s = 0; s <= steps; s++) {
            const t = s / steps;
            const bend = Math.sin(t * Math.PI) * (r() - 0.5) * 0.15;
            pts.push([
                startU + (target[0] - startU) * t + bend,
                startV + (target[1] - startV) * t + bend
            ]);
        }
        drawUV(pts, i % 3 === 0 ? baseStyle : 'line');
    }

    // Draw focal points
    if (filled) {
        for (const fp of focalPoints) {
            const dotPts: [number, number][] = [];
            for (let j = 0; j <= 10; j++) {
                const a = (j / 10) * Math.PI * 2;
                dotPts.push([fp[0] + Math.cos(a) * 0.025, fp[1] + Math.sin(a) * 0.025]);
            }
            drawUV(dotPts, 'filled');
        }
    }
}
