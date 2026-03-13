import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const turns = 1.5 + r();
    const steps = 30;
    const amplitude = 0.15 + r() * 0.1;
    for (let strand = 0; strand < 2; strand++) {
        const phase = strand * Math.PI;
        const pts: [number, number][] = [];
        for (let j = 0; j <= steps; j++) {
            const t = j / steps;
            const angle = t * turns * Math.PI * 2 + phase;
            const u = t;
            const v = 0.5 + Math.sin(angle) * amplitude;
            pts.push([u, v]);
        }
        drawUV(pts, strand === 0 ? baseStyle : 'line');
    }
    // Cross-rungs between strands
    const nRungs = 4 + Math.floor(r() * 4);
    for (let j = 0; j < nRungs; j++) {
        const t = (j + 0.5) / nRungs;
        const angle = t * turns * Math.PI * 2;
        const v1 = 0.5 + Math.sin(angle) * amplitude;
        const v2 = 0.5 + Math.sin(angle + Math.PI) * amplitude;
        drawUV([[t, v1], [t, v2]], 'line');
    }
}
