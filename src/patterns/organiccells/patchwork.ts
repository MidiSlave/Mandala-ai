// Patchwork — recursive clustering with convex-ish regions
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const numRegions = 4 + Math.floor(r() * 3);

    // Generate region centers and approximate convex shapes
    for (let i = 0; i < numRegions; i++) {
        const cx = 0.15 + r() * 0.7;
        const cy = 0.15 + r() * 0.7;
        const numVerts = 4 + Math.floor(r() * 4);
        const baseR = 0.08 + r() * 0.12;

        // Generate vertices sorted by angle for convex shape
        const angles: number[] = [];
        for (let j = 0; j < numVerts; j++) {
            angles.push((j / numVerts) * Math.PI * 2 + (r() - 0.5) * 0.5);
        }
        angles.sort((a, b) => a - b);

        const pts: [number, number][] = [];
        for (let j = 0; j < numVerts; j++) {
            const rr = baseR * (0.7 + r() * 0.6);
            pts.push([
                Math.min(1, Math.max(0, cx + Math.cos(angles[j]) * rr)),
                Math.min(1, Math.max(0, cy + Math.sin(angles[j]) * rr))
            ]);
        }

        drawUV(pts, i % 2 === 0 ? baseStyle : 'outline');

        // Sub-divisions inside larger regions
        if (baseR > 0.1 && filled) {
            const subCount = 2 + Math.floor(r() * 2);
            for (let s = 0; s < subCount; s++) {
                const sx = cx + (r() - 0.5) * baseR * 0.8;
                const sy = cy + (r() - 0.5) * baseR * 0.8;
                const sr = baseR * 0.2 + r() * baseR * 0.15;
                const subPts: [number, number][] = [];
                const subVerts = 3 + Math.floor(r() * 3);
                for (let j = 0; j <= subVerts; j++) {
                    const a = (j / subVerts) * Math.PI * 2;
                    subPts.push([
                        Math.min(1, Math.max(0, sx + Math.cos(a) * sr)),
                        Math.min(1, Math.max(0, sy + Math.sin(a) * sr))
                    ]);
                }
                drawUV(subPts, 'opaque-outline');
            }
        }
    }
}
