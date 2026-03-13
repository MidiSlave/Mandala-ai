import type { PatternSet, PatternContext } from './types';

function dotCircle(cx: number, cy: number, r: number, n: number = 8): [number, number][] {
    const pts: [number, number][] = [];
    for (let i = 0; i <= n; i++) {
        const a = (i / n) * Math.PI * 2;
        pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    return pts;
}

// Aboriginal dot painting patterns — concentric dot circles, journey lines, animal tracks
const aboriginalPatterns: PatternSet = {
    name: 'Aboriginal Dots',
    count: 6,
    draw: (type: number, { drawUV, filled, baseStyle, rng }: PatternContext) => {
        const r = rng ?? (() => Math.random());

        switch (type) {
            case 0: { // Concentric dot rings (waterhole)
                const cx = 0.5, cy = 0.5;
                const nRings = 4 + Math.floor(r() * 3);
                for (let ring = 0; ring < nRings; ring++) {
                    const ringR = (ring + 1) / (nRings + 1) * 0.42;
                    const nDots = 8 + ring * 4;
                    for (let d = 0; d < nDots; d++) {
                        const a = (d / nDots) * Math.PI * 2;
                        const dx = cx + Math.cos(a) * ringR;
                        const dy = cy + Math.sin(a) * ringR;
                        const dotR = 0.012 - ring * 0.001;
                        drawUV(dotCircle(dx, dy, Math.max(0.005, dotR), 6),
                            ring % 2 === 0 ? baseStyle : 'filled');
                    }
                }
                // Center dot
                drawUV(dotCircle(cx, cy, 0.02, 8), baseStyle);
                break;
            }

            case 1: { // Journey lines — dotted paths between places
                const nPaths = 2 + Math.floor(r() * 2);
                for (let p = 0; p < nPaths; p++) {
                    const startU = r() * 0.3;
                    const startV = 0.2 + r() * 0.6;
                    const endU = 0.7 + r() * 0.3;
                    const endV = 0.2 + r() * 0.6;
                    const midU = (startU + endU) / 2;
                    const midV = startV + (r() - 0.5) * 0.3;
                    const nDots = 10 + Math.floor(r() * 8);
                    for (let d = 0; d < nDots; d++) {
                        const t = d / (nDots - 1);
                        // Quadratic bezier interpolation
                        const u = (1 - t) * (1 - t) * startU + 2 * (1 - t) * t * midU + t * t * endU;
                        const v = (1 - t) * (1 - t) * startV + 2 * (1 - t) * t * midV + t * t * endV;
                        drawUV(dotCircle(u, v, 0.008, 6),
                            d % 3 === 0 ? baseStyle : 'filled');
                    }
                    // Place markers at start and end
                    drawUV(dotCircle(startU, startV, 0.025, 8), baseStyle);
                    drawUV(dotCircle(endU, endV, 0.025, 8), baseStyle);
                }
                break;
            }

            case 2: { // Kangaroo tracks
                const nTracks = 3 + Math.floor(r() * 3);
                const trackSpacing = 0.8 / nTracks;
                for (let t = 0; t < nTracks; t++) {
                    const baseV = (t + 0.5) / nTracks;
                    const nPrints = 4 + Math.floor(r() * 3);
                    for (let p = 0; p < nPrints; p++) {
                        const u = (p + 0.5) / nPrints;
                        const hop = (p % 2) * 0.015;
                        // Two rear feet (large)
                        drawUV(dotCircle(u - 0.015, baseV + hop, 0.012, 6), baseStyle);
                        drawUV(dotCircle(u + 0.015, baseV + hop, 0.012, 6), baseStyle);
                        // Tail drag
                        drawUV([
                            [u - 0.005, baseV + hop + 0.025],
                            [u + 0.005, baseV + hop + 0.035]
                        ], 'line');
                    }
                }
                break;
            }

            case 3: { // Cross-hatching with dots (body painting style)
                const nBands = 3 + Math.floor(r() * 2);
                const bandH = 1 / nBands;
                for (let band = 0; band < nBands; band++) {
                    const y0 = band * bandH;
                    const y1 = (band + 1) * bandH;
                    if (band % 2 === 0) {
                        // Diagonal hatching
                        const nLines = 6 + Math.floor(r() * 4);
                        for (let l = 0; l < nLines; l++) {
                            const u = l / nLines;
                            drawUV([[u, y0], [u + 0.08, y1]], 'line');
                        }
                    } else {
                        // Dot fill
                        const cols = 6 + Math.floor(r() * 4);
                        const rows = 2;
                        for (let row = 0; row < rows; row++) {
                            for (let col = 0; col < cols; col++) {
                                const du = (col + 0.5) / cols;
                                const dv = y0 + (row + 0.5) / rows * bandH;
                                drawUV(dotCircle(du, dv, 0.008, 6),
                                    (row + col) % 2 === 0 ? baseStyle : 'filled');
                            }
                        }
                    }
                }
                break;
            }

            case 4: { // Snake (rainbow serpent)
                const amplitude = 0.1 + r() * 0.05;
                const freq = 2 + r();
                const nSegments = 16;
                // Snake body
                for (let s = 0; s < nSegments; s++) {
                    const t = s / nSegments;
                    const t2 = (s + 1) / nSegments;
                    const u1 = t;
                    const v1 = 0.5 + Math.sin(t * Math.PI * freq) * amplitude;
                    const u2 = t2;
                    const v2 = 0.5 + Math.sin(t2 * Math.PI * freq) * amplitude;
                    const bodyWidth = 0.02 * (1 - t * 0.4);
                    // Body segment as thick line
                    const perpA = Math.atan2(v2 - v1, u2 - u1) + Math.PI / 2;
                    drawUV([
                        [u1 + Math.cos(perpA) * bodyWidth, v1 + Math.sin(perpA) * bodyWidth],
                        [u2 + Math.cos(perpA) * bodyWidth, v2 + Math.sin(perpA) * bodyWidth],
                        [u2 - Math.cos(perpA) * bodyWidth, v2 - Math.sin(perpA) * bodyWidth],
                        [u1 - Math.cos(perpA) * bodyWidth, v1 - Math.sin(perpA) * bodyWidth],
                    ], s % 3 === 0 ? baseStyle : 'outline');
                }
                // Dot scales along body
                for (let s = 0; s < nSegments; s += 2) {
                    const t = (s + 0.5) / nSegments;
                    const u = t;
                    const v = 0.5 + Math.sin(t * Math.PI * freq) * amplitude;
                    drawUV(dotCircle(u, v, 0.006, 5), 'filled');
                }
                break;
            }

            case 5: { // Campfire / meeting place — central fire with surrounding dots
                const cx = 0.5, cy = 0.5;
                // Central fire: U-shapes
                for (let f = 0; f < 4; f++) {
                    const a = (f / 4) * Math.PI * 2;
                    const dist = 0.08;
                    const fx = cx + Math.cos(a) * dist;
                    const fy = cy + Math.sin(a) * dist;
                    // U-shape (person sitting)
                    const uPts: [number, number][] = [];
                    for (let s = 0; s <= 6; s++) {
                        const sa = Math.PI + (s / 6) * Math.PI;
                        uPts.push([
                            fx + Math.cos(a + sa) * 0.02,
                            fy + Math.sin(a + sa) * 0.02
                        ]);
                    }
                    drawUV(uPts, baseStyle);
                }
                // Radiating dot circles
                for (let ring = 0; ring < 3; ring++) {
                    const ringR = 0.15 + ring * 0.1;
                    const nDots = 12 + ring * 6;
                    for (let d = 0; d < nDots; d++) {
                        const a = (d / nDots) * Math.PI * 2;
                        drawUV(dotCircle(
                            cx + Math.cos(a) * ringR,
                            cy + Math.sin(a) * ringR,
                            0.007, 5
                        ), ring === 0 ? baseStyle : 'filled');
                    }
                }
                break;
            }
        }
    }
};

export default aboriginalPatterns;
