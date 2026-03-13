import type { PatternSet, PatternContext } from './types';

// Guilloche patterns — banknote-style interlocking sinusoidal curves
const guillochePatterns: PatternSet = {
    name: 'Guilloche',
    count: 6,
    draw: (type: number, { drawUV, filled, baseStyle, rng }: PatternContext) => {
        const r = rng ?? (() => Math.random());

        switch (type) {
            case 0: { // Classic guilloche — two interleaved sine waves
                const freq = 3 + Math.floor(r() * 5);
                const amp = 0.06 + r() * 0.08;
                const nLines = 4 + Math.floor(r() * 3);
                for (let j = 0; j < nLines; j++) {
                    const baseV = (j + 1) / (nLines + 1);
                    const phase = j * Math.PI * 0.3;
                    const pts1: [number, number][] = [];
                    const pts2: [number, number][] = [];
                    for (let s = 0; s <= 24; s++) {
                        const u = s / 24;
                        const w1 = Math.sin(u * Math.PI * freq + phase) * amp;
                        const w2 = Math.sin(u * Math.PI * freq + phase + Math.PI) * amp;
                        pts1.push([u, baseV + w1]);
                        pts2.push([u, baseV + w2]);
                    }
                    drawUV(pts1, j % 2 === 0 ? baseStyle : 'line');
                    drawUV(pts2, 'line');
                }
                break;
            }

            case 1: { // Rosette guilloche — overlapping circular arcs
                const nPetals = 3 + Math.floor(r() * 4);
                for (let j = 0; j < nPetals; j++) {
                    const cx = (j + 0.5) / nPetals;
                    const pts: [number, number][] = [];
                    const radius = 0.12 + r() * 0.06;
                    for (let s = 0; s <= 16; s++) {
                        const a = (s / 16) * Math.PI * 2;
                        pts.push([
                            cx + Math.cos(a) * radius * 0.8,
                            0.5 + Math.sin(a) * radius
                        ]);
                    }
                    drawUV(pts, j % 2 === 0 ? baseStyle : 'outline');
                }
                // Connecting sine ribbon
                const ribbon: [number, number][] = [];
                for (let s = 0; s <= 30; s++) {
                    const u = s / 30;
                    ribbon.push([u, 0.5 + Math.sin(u * Math.PI * nPetals * 2) * 0.08]);
                }
                drawUV(ribbon, 'line');
                break;
            }

            case 2: { // Engine-turned wave lattice
                const nH = 3 + Math.floor(r() * 3);
                const nV = 3 + Math.floor(r() * 2);
                const waveAmp = 0.03 + r() * 0.04;
                const freq = 4 + Math.floor(r() * 4);
                // Horizontal wavy lines
                for (let j = 0; j < nH; j++) {
                    const baseV = (j + 1) / (nH + 1);
                    const pts: [number, number][] = [];
                    for (let s = 0; s <= 20; s++) {
                        const u = s / 20;
                        pts.push([u, baseV + Math.sin(u * Math.PI * freq) * waveAmp]);
                    }
                    drawUV(pts, 'line');
                }
                // Vertical wavy lines
                for (let j = 0; j < nV; j++) {
                    const baseU = (j + 1) / (nV + 1);
                    const pts: [number, number][] = [];
                    for (let s = 0; s <= 20; s++) {
                        const v = s / 20;
                        pts.push([baseU + Math.sin(v * Math.PI * freq) * waveAmp, v]);
                    }
                    drawUV(pts, 'line');
                }
                break;
            }

            case 3: { // Spirograph envelope — multiple offset epitrochoids
                const nCurves = 2 + Math.floor(r() * 2);
                for (let c = 0; c < nCurves; c++) {
                    const R = 0.35 + c * 0.03;
                    const rr = 0.08 + r() * 0.1;
                    const d = 0.06 + r() * 0.15;
                    const pts: [number, number][] = [];
                    for (let j = 0; j <= 50; j++) {
                        const t = (j / 50) * Math.PI * 4;
                        const x = (R - rr) * Math.cos(t) + d * Math.cos(((R - rr) / rr) * t);
                        const y = (R - rr) * Math.sin(t) + d * Math.sin(((R - rr) / rr) * t);
                        pts.push([
                            Math.min(1, Math.max(0, 0.5 + x)),
                            Math.min(1, Math.max(0, 0.5 + y))
                        ]);
                    }
                    drawUV(pts, c === 0 ? baseStyle : 'line');
                }
                break;
            }

            case 4: { // Moire diamond mesh
                const nDiag = 4 + Math.floor(r() * 4);
                const waveAmp = 0.02 + r() * 0.03;
                const freq = 3 + Math.floor(r() * 4);
                // Diagonal lines going one way
                for (let j = 0; j < nDiag; j++) {
                    const offset = (j + 0.5) / nDiag;
                    const pts: [number, number][] = [];
                    for (let s = 0; s <= 16; s++) {
                        const t = s / 16;
                        const u = t;
                        const v = offset + t * 0.5 - 0.25 + Math.sin(t * Math.PI * freq) * waveAmp;
                        pts.push([u, Math.min(1, Math.max(0, v))]);
                    }
                    drawUV(pts, 'line');
                }
                // Diagonal lines going the other way
                for (let j = 0; j < nDiag; j++) {
                    const offset = (j + 0.5) / nDiag;
                    const pts: [number, number][] = [];
                    for (let s = 0; s <= 16; s++) {
                        const t = s / 16;
                        const u = t;
                        const v = offset - t * 0.5 + 0.25 + Math.sin(t * Math.PI * freq) * waveAmp;
                        pts.push([u, Math.min(1, Math.max(0, v))]);
                    }
                    drawUV(pts, 'line');
                }
                break;
            }

            case 5: { // Cycloidal band — trochoid curves filling the cell
                const nBands = 2 + Math.floor(r() * 3);
                const cusp = Math.floor(r() * 3) + 3;
                for (let b = 0; b < nBands; b++) {
                    const bandV = (b + 0.5) / nBands;
                    const amp = 0.08 + r() * 0.06;
                    const pts: [number, number][] = [];
                    for (let s = 0; s <= 36; s++) {
                        const t = (s / 36) * Math.PI * 2;
                        const u = s / 36;
                        const v = bandV + (Math.cos(t) - Math.cos(cusp * t) / cusp) * amp;
                        pts.push([u, Math.min(1, Math.max(0, v))]);
                    }
                    drawUV(pts, b === 0 ? baseStyle : 'line');
                }
                break;
            }
        }
    }
};

export default guillochePatterns;
