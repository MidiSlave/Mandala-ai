import type { PatternSet, PatternContext } from './types';

const flowFieldPatterns: PatternSet = {
    name: 'Flow Field',
    count: 6,
    draw: (type: number, { drawUV, filled, baseStyle, rng }: PatternContext) => {
        const r = rng ?? (() => Math.random());

        // Simple seeded noise function using rng
        const noise2d = (x: number, y: number): number => {
            // Hash-based pseudo-noise using rng seed
            const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
            return n - Math.floor(n);
        };

        // Smooth noise with interpolation
        const smoothNoise = (x: number, y: number): number => {
            const ix = Math.floor(x);
            const iy = Math.floor(y);
            const fx = x - ix;
            const fy = y - iy;
            const sx = fx * fx * (3 - 2 * fx); // smoothstep
            const sy = fy * fy * (3 - 2 * fy);
            const a = noise2d(ix, iy);
            const b = noise2d(ix + 1, iy);
            const c = noise2d(ix, iy + 1);
            const d = noise2d(ix + 1, iy + 1);
            return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
        };

        switch (type) {
            case 0: { // Sinusoidal flow — wavy parallel streamlines
                const numLines = 6 + Math.floor(r() * 5);
                const freq = 1.5 + r() * 2;
                const amp = 0.06 + r() * 0.06;
                const phase = r() * Math.PI * 2;

                for (let i = 0; i < numLines; i++) {
                    const baseV = (i + 0.5) / numLines;
                    const pts: [number, number][] = [];
                    const steps = 24;
                    for (let s = 0; s <= steps; s++) {
                        const u = s / steps;
                        const wave = Math.sin(u * Math.PI * freq + phase + i * 0.5) * amp;
                        const wave2 = Math.sin(u * Math.PI * freq * 1.7 + phase) * amp * 0.4;
                        pts.push([u, Math.min(1, Math.max(0, baseV + wave + wave2))]);
                    }
                    drawUV(pts, 'line');
                }

                // Fill between adjacent lines in filled mode
                if (filled) {
                    for (let i = 0; i < numLines - 1; i += 2) {
                        const v0 = (i + 0.5) / numLines;
                        const v1 = (i + 1.5) / numLines;
                        const poly: [number, number][] = [];
                        for (let s = 0; s <= 12; s++) {
                            const u = s / 12;
                            const w0 = Math.sin(u * Math.PI * freq + phase + i * 0.5) * amp;
                            poly.push([u, v0 + w0]);
                        }
                        for (let s = 12; s >= 0; s--) {
                            const u = s / 12;
                            const w1 = Math.sin(u * Math.PI * freq + phase + (i + 1) * 0.5) * amp;
                            poly.push([u, v1 + w1]);
                        }
                        drawUV(poly, 'filled');
                    }
                }
                break;
            }

            case 1: { // Swirl flow — rotating vector field traces
                const numTraces = 8 + Math.floor(r() * 6);
                const swirlStrength = 2 + r() * 3;
                const cx = 0.5, cy = 0.5;

                for (let i = 0; i < numTraces; i++) {
                    const startAngle = (i / numTraces) * Math.PI * 2;
                    const startR = 0.05 + r() * 0.1;
                    let x = cx + Math.cos(startAngle) * startR;
                    let y = cy + Math.sin(startAngle) * startR;
                    const pts: [number, number][] = [[x, y]];
                    const steps = 20 + Math.floor(r() * 15);

                    for (let s = 0; s < steps; s++) {
                        const dx = x - cx;
                        const dy = y - cy;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        // Swirl: perpendicular to radial + slight outward push
                        const angle = Math.atan2(dy, dx) + Math.PI / 2 * (1 + 0.3 / (dist + 0.1));
                        const speed = 0.015 + dist * 0.01;
                        x += Math.cos(angle) * speed;
                        y += Math.sin(angle) * speed;
                        if (x < 0 || x > 1 || y < 0 || y > 1) break;
                        pts.push([Math.min(1, Math.max(0, x)), Math.min(1, Math.max(0, y))]);
                    }
                    if (pts.length > 2) {
                        drawUV(pts, i % 3 === 0 ? baseStyle : 'line');
                    }
                }
                break;
            }

            case 2: { // Noise traces — particle paths following noise field
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
                break;
            }

            case 3: { // Distorted grid — displaced grid with interpolation
                const gridCols = 5 + Math.floor(r() * 3);
                const gridRows = 6 + Math.floor(r() * 4);
                const displacement = 0.03 + r() * 0.04;

                // Generate displaced grid points
                const grid: [number, number][][] = [];
                for (let col = 0; col <= gridCols; col++) {
                    grid[col] = [];
                    for (let row = 0; row <= gridRows; row++) {
                        grid[col][row] = [
                            col / gridCols + (r() - 0.5) * displacement * 2,
                            row / gridRows + (r() - 0.5) * displacement * 2
                        ];
                    }
                }

                // Draw interpolated lines between adjacent columns
                const interpSteps = 2 + Math.floor(r() * 2);
                for (let col = 0; col < gridCols; col++) {
                    for (let step = 0; step <= interpSteps; step++) {
                        const t = step / interpSteps;
                        const pts: [number, number][] = [];
                        for (let row = 0; row <= gridRows; row++) {
                            const p0 = grid[col][row];
                            const p1 = grid[col + 1][row];
                            pts.push([
                                Math.min(1, Math.max(0, p0[0] + (p1[0] - p0[0]) * t)),
                                Math.min(1, Math.max(0, p0[1] + (p1[1] - p0[1]) * t))
                            ]);
                        }
                        drawUV(pts, step === 0 || step === interpSteps ? baseStyle : 'line');
                    }
                }
                break;
            }

            case 4: { // Convergence — lines converging to focal points
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
                break;
            }

            case 5: { // Turbulence — chaotic overlapping flow lines
                const numLines = 10 + Math.floor(r() * 8);
                const turbFreq = 3 + r() * 3;
                const turbAmp = 0.08 + r() * 0.06;

                for (let i = 0; i < numLines; i++) {
                    const baseV = (i + 0.5) / numLines;
                    const pts: [number, number][] = [];
                    const steps = 30;
                    const phaseA = r() * Math.PI * 2;
                    const phaseB = r() * Math.PI * 2;
                    const freqA = turbFreq + r() * 1.5;
                    const freqB = turbFreq * 1.3 + r();
                    for (let s = 0; s <= steps; s++) {
                        const u = s / steps;
                        const wave1 = Math.sin(u * Math.PI * freqA + phaseA) * turbAmp;
                        const wave2 = Math.sin(u * Math.PI * freqB + phaseB) * turbAmp * 0.6;
                        const wave3 = Math.sin(u * Math.PI * freqA * 2.3 + phaseA + phaseB) * turbAmp * 0.3;
                        pts.push([u, Math.min(1, Math.max(0, baseV + wave1 + wave2 + wave3))]);
                    }
                    drawUV(pts, 'line');
                }

                // Fill some turbulent bands
                if (filled) {
                    for (let i = 0; i < 3; i++) {
                        const v0 = r() * 0.8;
                        const v1 = v0 + 0.05 + r() * 0.1;
                        drawUV([
                            [0, v0], [1, v0], [1, Math.min(1, v1)], [0, Math.min(1, v1)]
                        ], 'filled');
                    }
                }
                break;
            }
        }
    }
};

export default flowFieldPatterns;
