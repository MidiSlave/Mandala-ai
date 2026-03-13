import type { PatternSet, PatternContext } from './types';

const noiseStrataPatterns: PatternSet = {
    name: 'Noise Strata',
    count: 6,
    draw: (type: number, { drawUV, filled, baseStyle, rng }: PatternContext) => {
        const r = rng ?? (() => Math.random());

        switch (type) {
            case 0: { // Topographic contour lines — wavy horizontal strata
                const numLines = 5 + Math.floor(r() * 4);
                const freq1 = 2 + r() * 3;
                const freq2 = 3 + r() * 4;
                const amp = 0.04 + r() * 0.04;

                const generateLine = (baseV: number, seed: number): [number, number][] => {
                    const pts: [number, number][] = [];
                    const steps = 24;
                    for (let s = 0; s <= steps; s++) {
                        const u = s / steps;
                        const w1 = Math.sin(u * Math.PI * freq1 + seed * 3.7) * amp;
                        const w2 = Math.sin(u * Math.PI * freq2 + seed * 7.3) * amp * 0.5;
                        const w3 = Math.sin(u * Math.PI * (freq1 + freq2) + seed) * amp * 0.25;
                        pts.push([u, Math.min(1, Math.max(0, baseV + w1 + w2 + w3))]);
                    }
                    return pts;
                };

                const lines: [number, number][][] = [];
                for (let i = 0; i < numLines; i++) {
                    const baseV = (i + 0.5) / numLines;
                    const line = generateLine(baseV, i + r() * 10);
                    lines.push(line);
                    drawUV(line, 'line');
                }

                // Fill between alternate lines
                if (filled) {
                    for (let i = 0; i < lines.length - 1; i += 2) {
                        const poly: [number, number][] = [...lines[i]];
                        for (let j = lines[i + 1].length - 1; j >= 0; j--) {
                            poly.push(lines[i + 1][j]);
                        }
                        drawUV(poly, 'filled');
                    }
                }
                break;
            }

            case 1: { // Fragmented grid — noise-displaced rectangular cells
                const cols = 3 + Math.floor(r() * 2);
                const rows = 3 + Math.floor(r() * 2);
                const cellW = 1.0 / cols;
                const cellH = 1.0 / rows;
                const maxDisp = 0.04 + r() * 0.06;

                for (let row = 0; row < rows; row++) {
                    for (let col = 0; col < cols; col++) {
                        const u0 = col * cellW;
                        const v0 = row * cellH;
                        const isHuge = r() > 0.7; // 30% chance of large displacement
                        const disp = isHuge ? maxDisp * 3 : maxDisp;

                        // Displace each corner independently
                        const corners: [number, number][] = [
                            [u0 + (r() - 0.5) * disp, v0 + (r() - 0.5) * disp],
                            [u0 + cellW + (r() - 0.5) * disp, v0 + (r() - 0.5) * disp],
                            [u0 + cellW + (r() - 0.5) * disp, v0 + cellH + (r() - 0.5) * disp],
                            [u0 + (r() - 0.5) * disp, v0 + cellH + (r() - 0.5) * disp]
                        ];

                        // Clamp to bounds
                        const clamped = corners.map(([u, v]) => [
                            Math.min(1, Math.max(0, u)),
                            Math.min(1, Math.max(0, v))
                        ] as [number, number]);

                        const style = isHuge ? 'line' : (filled ? baseStyle : 'outline');
                        drawUV(clamped, style);

                        // Inner quad for non-huge cells
                        if (!isHuge && filled) {
                            const inset = 0.15;
                            const inner: [number, number][] = [
                                [u0 + cellW * inset, v0 + cellH * inset],
                                [u0 + cellW * (1 - inset), v0 + cellH * inset],
                                [u0 + cellW * (1 - inset), v0 + cellH * (1 - inset)],
                                [u0 + cellW * inset, v0 + cellH * (1 - inset)]
                            ];
                            drawUV(inner, 'opaque-outline');
                        }
                    }
                }
                break;
            }

            case 2: { // Ridge lines — absolute-value folded noise creating sharp ridges
                const numLines = 6 + Math.floor(r() * 4);
                const freq = 2 + r() * 2;
                const ridgeAmp = 0.06 + r() * 0.04;

                for (let i = 0; i < numLines; i++) {
                    const baseV = (i + 0.5) / numLines;
                    const pts: [number, number][] = [];
                    const steps = 28;
                    const phase = r() * Math.PI * 2;
                    for (let s = 0; s <= steps; s++) {
                        const u = s / steps;
                        // Ridged noise: absolute value creates sharp peaks
                        const n1 = Math.abs(Math.sin(u * Math.PI * freq + phase)) * ridgeAmp;
                        const n2 = Math.abs(Math.sin(u * Math.PI * freq * 2.1 + phase * 1.3)) * ridgeAmp * 0.5;
                        const v = baseV + n1 + n2 - ridgeAmp * 0.5;
                        pts.push([u, Math.min(1, Math.max(0, v))]);
                    }
                    drawUV(pts, i % 2 === 0 ? baseStyle : 'line');
                }
                break;
            }

            case 3: { // Terrain bands — filled noise-modulated horizontal bands
                const numBands = 4 + Math.floor(r() * 3);
                const freq = 1.5 + r() * 2.5;

                for (let i = 0; i < numBands; i++) {
                    const v0 = i / numBands;
                    const v1 = (i + 1) / numBands;
                    const phase = r() * Math.PI * 2;

                    // Top edge
                    const topPts: [number, number][] = [];
                    const botPts: [number, number][] = [];
                    const steps = 16;
                    for (let s = 0; s <= steps; s++) {
                        const u = s / steps;
                        const w = Math.sin(u * Math.PI * freq + phase) * 0.03;
                        topPts.push([u, Math.min(1, Math.max(0, v0 + w))]);
                        botPts.push([u, Math.min(1, Math.max(0, v1 + w * 0.7))]);
                    }

                    if (filled && i % 2 === 0) {
                        // Fill band
                        const poly: [number, number][] = [...topPts];
                        for (let j = botPts.length - 1; j >= 0; j--) {
                            poly.push(botPts[j]);
                        }
                        drawUV(poly, 'filled');
                    }

                    // Draw edges
                    drawUV(topPts, 'line');
                    if (i === numBands - 1) {
                        drawUV(botPts, 'line');
                    }
                }
                break;
            }

            case 4: { // Warp distortion — concentric rings warped by noise
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
                break;
            }

            case 5: { // Noise columns — vertical striations with noise displacement
                const numCols = 8 + Math.floor(r() * 6);
                const amp = 0.04 + r() * 0.04;

                for (let i = 0; i < numCols; i++) {
                    const baseU = (i + 0.5) / numCols;
                    const pts: [number, number][] = [];
                    const steps = 20;
                    const phase = r() * Math.PI * 2;
                    const freq = 2 + r() * 3;
                    for (let s = 0; s <= steps; s++) {
                        const v = s / steps;
                        const wave = Math.sin(v * Math.PI * freq + phase) * amp;
                        pts.push([Math.min(1, Math.max(0, baseU + wave)), v]);
                    }
                    drawUV(pts, i % 3 === 0 ? baseStyle : 'line');
                }

                // Horizontal tie lines
                if (filled) {
                    const ties = 3 + Math.floor(r() * 3);
                    for (let i = 0; i < ties; i++) {
                        const v = (i + 0.5) / ties;
                        drawUV([[0, v], [1, v]], 'line');
                    }
                }
                break;
            }
        }
    }
};

export default noiseStrataPatterns;
