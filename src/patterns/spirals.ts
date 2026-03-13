import type { PatternSet, PatternContext } from './types';

function circleUV(cx: number, cy: number, r: number, n: number = 12): [number, number][] {
    const pts: [number, number][] = [];
    for (let i = 0; i <= n; i++) {
        const a = (i / n) * Math.PI * 2;
        pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    return pts;
}

// Spiral patterns — golden ratio, fibonacci, logarithmic spirals
const spiralPatterns: PatternSet = {
    name: 'Spirals',
    count: 6,
    draw: (type: number, { drawUV, filled, baseStyle, rng }: PatternContext) => {
        const r = rng ?? (() => Math.random());

        switch (type) {
            case 0: { // Fibonacci spiral segments
                const goldenRatio = (1 + Math.sqrt(5)) / 2;
                const nArcs = 5 + Math.floor(r() * 3);
                let size = 0.4;
                let cx = 0.5, cy = 0.5;
                for (let j = 0; j < nArcs; j++) {
                    const startAngle = (j * Math.PI) / 2;
                    const pts: [number, number][] = [];
                    for (let s = 0; s <= 10; s++) {
                        const a = startAngle + (s / 10) * (Math.PI / 2);
                        pts.push([
                            Math.min(1, Math.max(0, cx + Math.cos(a) * size)),
                            Math.min(1, Math.max(0, cy + Math.sin(a) * size))
                        ]);
                    }
                    drawUV(pts, j % 2 === 0 ? baseStyle : 'line');
                    // Move center for next arc
                    const nextAngle = startAngle + Math.PI / 2;
                    cx += Math.cos(nextAngle) * size * (1 - 1 / goldenRatio);
                    cy += Math.sin(nextAngle) * size * (1 - 1 / goldenRatio);
                    size /= goldenRatio;
                }
                break;
            }

            case 1: { // Archimedean spiral
                const turns = 2 + r() * 2;
                const pts: [number, number][] = [];
                const steps = 50 + Math.floor(r() * 20);
                for (let j = 0; j <= steps; j++) {
                    const t = (j / steps) * turns * Math.PI * 2;
                    const radius = (j / steps) * 0.4;
                    pts.push([
                        Math.min(1, Math.max(0, 0.5 + Math.cos(t) * radius)),
                        Math.min(1, Math.max(0, 0.5 + Math.sin(t) * radius))
                    ]);
                }
                drawUV(pts, baseStyle);
                // Second spiral offset by half turn
                const pts2: [number, number][] = [];
                for (let j = 0; j <= steps; j++) {
                    const t = (j / steps) * turns * Math.PI * 2 + Math.PI;
                    const radius = (j / steps) * 0.4;
                    pts2.push([
                        Math.min(1, Math.max(0, 0.5 + Math.cos(t) * radius)),
                        Math.min(1, Math.max(0, 0.5 + Math.sin(t) * radius))
                    ]);
                }
                drawUV(pts2, filled ? 'outline' : baseStyle);
                break;
            }

            case 2: { // Phyllotaxis sunflower
                const numSeeds = 20 + Math.floor(r() * 30);
                const goldenAngle = Math.PI * (3 - Math.sqrt(5));
                for (let j = 0; j < numSeeds; j++) {
                    const frac = j / numSeeds;
                    const theta = j * goldenAngle;
                    const radius = Math.sqrt(frac) * 0.4;
                    const cx = 0.5 + Math.cos(theta) * radius;
                    const cy = 0.5 + Math.sin(theta) * radius;
                    const dotSize = 0.008 + frac * 0.012;
                    drawUV(circleUV(cx, cy, dotSize, 6),
                        j % 5 === 0 ? baseStyle : (j % 3 === 0 ? 'filled' : 'outline'));
                }
                break;
            }

            case 3: { // Fermat spiral (parabolic)
                const direction = r() > 0.5 ? 1 : -1;
                const steps = 40;
                for (let arm = 0; arm < 2; arm++) {
                    const pts: [number, number][] = [];
                    const sign = arm === 0 ? 1 : -1;
                    for (let j = 0; j <= steps; j++) {
                        const t = (j / steps) * 4 * Math.PI;
                        const radius = Math.sqrt(t / (4 * Math.PI)) * 0.4 * sign;
                        pts.push([
                            Math.min(1, Math.max(0, 0.5 + Math.cos(t * direction) * Math.abs(radius))),
                            Math.min(1, Math.max(0, 0.5 + Math.sin(t * direction) * radius))
                        ]);
                    }
                    drawUV(pts, arm === 0 ? baseStyle : 'line');
                }
                break;
            }

            case 4: { // Spiral lattice — concentric rings with spiral connections
                const nRings = 3 + Math.floor(r() * 3);
                const nSpokes = 4 + Math.floor(r() * 4);
                // Concentric rings
                for (let j = 0; j < nRings; j++) {
                    const ringR = (j + 1) / (nRings + 1) * 0.4;
                    drawUV(circleUV(0.5, 0.5, ringR, 20),
                        j % 2 === 0 ? 'outline' : baseStyle);
                }
                // Spiral spokes connecting rings
                for (let j = 0; j < nSpokes; j++) {
                    const baseAngle = (j / nSpokes) * Math.PI * 2;
                    const pts: [number, number][] = [];
                    for (let s = 0; s <= 16; s++) {
                        const t = s / 16;
                        const a = baseAngle + t * Math.PI * 0.5;
                        const rad = t * 0.4;
                        pts.push([0.5 + Math.cos(a) * rad, 0.5 + Math.sin(a) * rad]);
                    }
                    drawUV(pts, 'line');
                }
                break;
            }

            case 5: { // Double helix
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
                break;
            }
        }
    }
};

export default spiralPatterns;
