import type { PatternSet, PatternContext } from './types';

// Op Art patterns — optical illusions, moire effects, geometric distortions
const opArtPatterns: PatternSet = {
    name: 'Op Art',
    count: 6,
    draw: (type: number, { drawUV, filled, baseStyle, rng }: PatternContext) => {
        const r = rng ?? (() => Math.random());

        switch (type) {
            case 0: { // Concentric warped squares (Vasarely-style)
                const nRings = 4 + Math.floor(r() * 3);
                const wobbleAmt = 0.02 + r() * 0.03;
                const wobbleFreq = 3 + Math.floor(r() * 3);
                for (let ring = 0; ring < nRings; ring++) {
                    const frac = (ring + 1) / (nRings + 1);
                    const half = frac * 0.45;
                    const cx = 0.5, cy = 0.5;
                    const pts: [number, number][] = [];
                    const sides = 16;
                    for (let s = 0; s <= sides; s++) {
                        const a = (s / sides) * Math.PI * 2;
                        // Square shape with sinusoidal wobble
                        const t = a / (Math.PI * 2);
                        const squareR = half / Math.max(Math.abs(Math.cos(a)), Math.abs(Math.sin(a)));
                        const wobble = Math.sin(a * wobbleFreq + ring * 0.8) * wobbleAmt;
                        const rad = Math.min(0.49, squareR + wobble);
                        pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]);
                    }
                    drawUV(pts, ring % 2 === 0 ? baseStyle : 'outline');
                }
                break;
            }

            case 1: { // Bridget Riley parallel lines with bulge
                const nLines = 8 + Math.floor(r() * 5);
                const bulgeCx = 0.3 + r() * 0.4;
                const bulgeCy = 0.3 + r() * 0.4;
                const bulgeR = 0.15 + r() * 0.1;
                for (let i = 0; i < nLines; i++) {
                    const baseU = (i + 0.5) / nLines;
                    const pts: [number, number][] = [];
                    for (let s = 0; s <= 16; s++) {
                        const v = s / 16;
                        const distX = baseU - bulgeCx;
                        const distY = v - bulgeCy;
                        const dist = Math.sqrt(distX * distX + distY * distY);
                        const displacement = dist < bulgeR
                            ? (1 - dist / bulgeR) * 0.06
                            : 0;
                        pts.push([baseU + displacement * (distX / (dist || 1)), v]);
                    }
                    drawUV(pts, i % 3 === 0 ? baseStyle : 'line');
                }
                break;
            }

            case 2: { // Checkerboard with spherical distortion
                const n = 4;
                const cellSize = 1 / n;
                for (let row = 0; row < n; row++) {
                    for (let col = 0; col < n; col++) {
                        if ((row + col) % 2 !== 0) continue;
                        const x = col * cellSize, y = row * cellSize;
                        // Distort corners toward center for sphere illusion
                        const warp = (px: number, py: number): [number, number] => {
                            const dx = px - 0.5, dy = py - 0.5;
                            const dist = Math.sqrt(dx * dx + dy * dy);
                            const scale = 1 + dist * 0.4;
                            return [0.5 + dx * scale, 0.5 + dy * scale];
                        };
                        drawUV([
                            warp(x, y), warp(x + cellSize, y),
                            warp(x + cellSize, y + cellSize), warp(x, y + cellSize)
                        ], baseStyle);
                    }
                }
                break;
            }

            case 3: { // Rotating squares (nested rotation)
                const nSquares = 5 + Math.floor(r() * 3);
                const rotStep = 0.08 + r() * 0.06;
                for (let sq = 0; sq < nSquares; sq++) {
                    const frac = (sq + 1) / (nSquares + 1);
                    const half = frac * 0.42;
                    const rot = sq * rotStep;
                    const pts: [number, number][] = [];
                    for (let c = 0; c < 4; c++) {
                        const a = (c / 4) * Math.PI * 2 + Math.PI / 4 + rot;
                        pts.push([0.5 + Math.cos(a) * half, 0.5 + Math.sin(a) * half]);
                    }
                    drawUV(pts, sq % 2 === 0 ? baseStyle : 'outline');
                }
                break;
            }

            case 4: { // Moire circles
                const nCircles = 5 + Math.floor(r() * 3);
                const off1x = 0.48, off1y = 0.5;
                const off2x = 0.52, off2y = 0.5;
                for (let c = 0; c < nCircles; c++) {
                    const rad = (c + 1) / (nCircles + 1) * 0.4;
                    // First set centered at off1
                    const pts1: [number, number][] = [];
                    const pts2: [number, number][] = [];
                    for (let s = 0; s <= 20; s++) {
                        const a = (s / 20) * Math.PI * 2;
                        pts1.push([off1x + Math.cos(a) * rad, off1y + Math.sin(a) * rad]);
                        pts2.push([off2x + Math.cos(a) * rad, off2y + Math.sin(a) * rad]);
                    }
                    drawUV(pts1, c % 2 === 0 ? baseStyle : 'line');
                    drawUV(pts2, 'line');
                }
                break;
            }

            case 5: { // Zigzag wave field
                const nWaves = 6 + Math.floor(r() * 4);
                const amplitude = 0.03 + r() * 0.02;
                const zigFreq = 6 + Math.floor(r() * 6);
                for (let w = 0; w < nWaves; w++) {
                    const baseV = (w + 1) / (nWaves + 1);
                    const pts: [number, number][] = [];
                    for (let s = 0; s <= zigFreq * 2; s++) {
                        const u = s / (zigFreq * 2);
                        const zigzag = (s % 2 === 0 ? 1 : -1) * amplitude;
                        pts.push([u, baseV + zigzag]);
                    }
                    drawUV(pts, w % 3 === 0 ? baseStyle : 'line');
                }
                break;
            }
        }
    }
};

export default opArtPatterns;
