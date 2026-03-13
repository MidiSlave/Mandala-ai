import type { PatternSet, PatternContext } from './types';

// Polynesian / Tapa cloth patterns — ocean waves, tiki, shark teeth, turtle shells
const polynesianPatterns: PatternSet = {
    name: 'Polynesian',
    count: 6,
    draw: (type: number, { drawUV, filled, baseStyle, rng }: PatternContext) => {
        const r = rng ?? (() => Math.random());

        switch (type) {
            case 0: { // Shark teeth (niho mano) — row of triangles
                const nRows = 2 + Math.floor(r() * 2);
                const rowH = 1 / nRows;
                for (let row = 0; row < nRows; row++) {
                    const y0 = row * rowH;
                    const y1 = y0 + rowH;
                    const yMid = (y0 + y1) / 2;
                    const nTeeth = 5 + Math.floor(r() * 4);
                    const toothW = 1 / nTeeth;
                    for (let t = 0; t < nTeeth; t++) {
                        const x0 = t * toothW;
                        const x1 = x0 + toothW;
                        const xMid = (x0 + x1) / 2;
                        // Upper tooth
                        drawUV([[x0, yMid], [xMid, y0], [x1, yMid]],
                            (t + row) % 2 === 0 ? baseStyle : 'outline');
                        // Lower tooth
                        drawUV([[x0, yMid], [xMid, y1], [x1, yMid]],
                            (t + row) % 2 === 0 ? 'outline' : baseStyle);
                    }
                }
                break;
            }

            case 1: { // Ocean waves (moana)
                const nWaves = 4 + Math.floor(r() * 3);
                for (let w = 0; w < nWaves; w++) {
                    const baseV = (w + 1) / (nWaves + 1);
                    const amp = 0.04 + r() * 0.03;
                    const freq = 3 + Math.floor(r() * 2);
                    const pts: [number, number][] = [];
                    for (let s = 0; s <= 20; s++) {
                        const u = s / 20;
                        const v = baseV + amp * Math.sin(u * Math.PI * freq + w * 0.5);
                        pts.push([u, v]);
                    }
                    drawUV(pts, w % 2 === 0 ? baseStyle : 'line');
                    // Wave crests — small spirals
                    for (let c = 0; c < freq; c++) {
                        const cu = (c * 2 + 1) / (freq * 2);
                        const cv = baseV - amp;
                        const spiral: [number, number][] = [];
                        for (let s = 0; s <= 8; s++) {
                            const t = s / 8;
                            const a = t * Math.PI * 1.5;
                            const sr = t * 0.015;
                            spiral.push([cu + Math.cos(a) * sr, cv - Math.sin(a) * sr]);
                        }
                        drawUV(spiral, 'line');
                    }
                }
                break;
            }

            case 2: { // Turtle shell (honu) — hexagonal pattern
                const cx = 0.5, cy = 0.5;
                // Central hexagon
                const mainR = 0.25;
                const hex: [number, number][] = [];
                for (let i = 0; i < 6; i++) {
                    const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
                    hex.push([cx + Math.cos(a) * mainR, cy + Math.sin(a) * mainR]);
                }
                drawUV(hex, baseStyle);
                // Inner subdivisions
                for (let i = 0; i < 6; i++) {
                    const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
                    // Line from center to each vertex
                    drawUV([
                        [cx, cy],
                        [cx + Math.cos(a) * mainR, cy + Math.sin(a) * mainR]
                    ], 'line');
                    // Scale pattern in each triangle
                    const a2 = ((i + 1) / 6) * Math.PI * 2 - Math.PI / 6;
                    const midR = mainR * 0.55;
                    const midA = (a + a2) / 2;
                    const scaleR = mainR * 0.12;
                    const scalePts: [number, number][] = [];
                    for (let s = 0; s <= 6; s++) {
                        const sa = (s / 6) * Math.PI * 2;
                        scalePts.push([
                            cx + Math.cos(midA) * midR + Math.cos(sa) * scaleR,
                            cy + Math.sin(midA) * midR + Math.sin(sa) * scaleR
                        ]);
                    }
                    drawUV(scalePts, i % 2 === 0 ? 'outline' : baseStyle);
                }
                break;
            }

            case 3: { // Spearhead pattern (mata)
                const cols = 3 + Math.floor(r() * 2);
                const rows = 2 + Math.floor(r() * 2);
                const cellW = 1 / cols, cellH = 1 / rows;
                for (let row = 0; row < rows; row++) {
                    for (let col = 0; col < cols; col++) {
                        const x = col * cellW, y = row * cellH;
                        const cx = x + cellW / 2;
                        // Spearhead pointing up
                        drawUV([
                            [cx, y],
                            [x + cellW, y + cellH * 0.6],
                            [cx, y + cellH],
                            [x, y + cellH * 0.6]
                        ], (row + col) % 2 === 0 ? baseStyle : 'outline');
                        // Central spine line
                        drawUV([[cx, y], [cx, y + cellH]], 'line');
                    }
                }
                break;
            }

            case 4: { // Tiki face — simplified
                const cx = 0.5, cy = 0.4;
                // Head outline
                const headW = 0.3, headH = 0.5;
                const head: [number, number][] = [];
                for (let s = 0; s <= 12; s++) {
                    const a = (s / 12) * Math.PI * 2;
                    head.push([cx + Math.cos(a) * headW, cy + Math.sin(a) * headH]);
                }
                drawUV(head, baseStyle);
                // Eyes — rectangular
                for (let side = -1; side <= 1; side += 2) {
                    const eyeX = cx + side * 0.1;
                    const eyeY = cy - 0.08;
                    drawUV([
                        [eyeX - 0.05, eyeY - 0.04],
                        [eyeX + 0.05, eyeY - 0.04],
                        [eyeX + 0.05, eyeY + 0.04],
                        [eyeX - 0.05, eyeY + 0.04]
                    ], filled ? 'opaque-outline' : 'filled');
                    // Pupil
                    drawUV([
                        [eyeX - 0.015, eyeY - 0.015],
                        [eyeX + 0.015, eyeY - 0.015],
                        [eyeX + 0.015, eyeY + 0.015],
                        [eyeX - 0.015, eyeY + 0.015]
                    ], 'filled');
                }
                // Mouth
                const mouth: [number, number][] = [];
                for (let s = 0; s <= 8; s++) {
                    const u = cx - 0.1 + (s / 8) * 0.2;
                    const v = cy + 0.2 + Math.sin((s / 8) * Math.PI) * 0.04;
                    mouth.push([u, v]);
                }
                drawUV(mouth, baseStyle);
                // Nose
                drawUV([
                    [cx, cy - 0.02], [cx + 0.03, cy + 0.08],
                    [cx - 0.03, cy + 0.08]
                ], 'outline');
                break;
            }

            case 5: { // Tapa cross / star motif
                const cx = 0.5, cy = 0.5;
                const armLen = 0.35;
                const armWidth = 0.06;
                // Four arms of the cross with serrated edges
                for (let arm = 0; arm < 4; arm++) {
                    const a = (arm / 4) * Math.PI * 2;
                    const perpA = a + Math.PI / 2;
                    const nSeg = 4;
                    const pts: [number, number][] = [];
                    // One side
                    for (let s = 0; s <= nSeg; s++) {
                        const t = s / nSeg;
                        const serr = (s % 2 === 0 ? 1 : 0.6) * armWidth;
                        pts.push([
                            cx + Math.cos(a) * t * armLen + Math.cos(perpA) * serr,
                            cy + Math.sin(a) * t * armLen + Math.sin(perpA) * serr
                        ]);
                    }
                    // Tip
                    pts.push([
                        cx + Math.cos(a) * armLen,
                        cy + Math.sin(a) * armLen
                    ]);
                    // Other side (reverse)
                    for (let s = nSeg; s >= 0; s--) {
                        const t = s / nSeg;
                        const serr = (s % 2 === 0 ? 1 : 0.6) * armWidth;
                        pts.push([
                            cx + Math.cos(a) * t * armLen - Math.cos(perpA) * serr,
                            cy + Math.sin(a) * t * armLen - Math.sin(perpA) * serr
                        ]);
                    }
                    drawUV(pts, arm % 2 === 0 ? baseStyle : 'outline');
                }
                // Center square
                const sq = armWidth * 1.2;
                drawUV([
                    [cx - sq, cy - sq], [cx + sq, cy - sq],
                    [cx + sq, cy + sq], [cx - sq, cy + sq]
                ], baseStyle);
                break;
            }
        }
    }
};

export default polynesianPatterns;
