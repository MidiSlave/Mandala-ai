import type { PatternSet, PatternContext } from './types';

function circle(cx: number, cy: number, r: number, n: number = 12): [number, number][] {
    const pts: [number, number][] = [];
    for (let i = 0; i <= n; i++) {
        const a = (i / n) * Math.PI * 2;
        pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    return pts;
}

const mesoamericanPatterns: PatternSet = {
    name: 'Mesoamerican',
    count: 8,
    draw: (type: number, { drawUV, filled, baseStyle }: PatternContext) => {
        switch (type) {
            case 0: { // Stepped Pyramid (Chakana)
                drawUV([
                    [0, 0], [0.15, 0], [0.15, 0.15], [0.3, 0.15],
                    [0.3, 0.35], [0.45, 0.35], [0.45, 0.55],
                    [0.55, 0.55], [0.55, 0.75], [0.7, 0.75],
                    [0.7, 0.85], [0.85, 0.85], [0.85, 1], [1, 1], [1, 0]
                ], baseStyle);
                if (!filled) {
                    drawUV([[0.25, 0.2], [0.4, 0.2], [0.4, 0.4], [0.55, 0.4]], 'line');
                }
                break;
            }
            case 1: { // Mayan Glyph Block
                drawUV([[0.03, 0.03], [0.97, 0.03], [0.97, 0.97], [0.03, 0.97]], baseStyle);
                if (!filled) {
                    drawUV([[0.15, 0.15], [0.85, 0.15], [0.85, 0.85], [0.15, 0.85]], 'outline');
                    drawUV([[0.3, 0.3], [0.7, 0.3], [0.7, 0.7], [0.3, 0.7]], 'filled');
                    drawUV(circle(0.5, 0.5, 0.06), 'opaque-outline');
                } else {
                    drawUV([[0.2, 0.2], [0.8, 0.2], [0.8, 0.8], [0.2, 0.8]], 'opaque-outline');
                    drawUV([[0.35, 0.35], [0.65, 0.35], [0.65, 0.65], [0.35, 0.65]], 'opaque-outline');
                }
                break;
            }
            case 2: { // Sun Rays
                drawUV([[0.05, 0], [0.95, 0], [0.5, 0.92]], baseStyle);
                if (!filled) {
                    const hatchCount = 5;
                    for (let h = 0; h < hatchCount; h++) {
                        const t = (h + 1) / (hatchCount + 1);
                        const left = 0.05 + (0.5 - 0.05) * t;
                        const right = 0.95 - (0.95 - 0.5) * t;
                        const v = t * 0.92;
                        drawUV([[left, v], [right, v]], 'line');
                    }
                } else {
                    drawUV([[0.25, 0.15], [0.75, 0.15], [0.5, 0.65]], 'opaque-outline');
                }
                break;
            }
            case 3: { // Aztec Fret
                if (filled) {
                    drawUV([
                        [0, 0], [0.85, 0], [0.85, 0.85], [0.15, 0.85],
                        [0.15, 0.3], [0.55, 0.3], [0.55, 0.55], [0.35, 0.55],
                        [0.35, 0.15], [1.0, 0.15], [1.0, 1.0], [0, 1.0]
                    ], 'filled');
                    drawUV([[0.4, 0.38], [0.5, 0.38], [0.5, 0.48], [0.4, 0.48]], 'opaque-outline');
                } else {
                    drawUV([
                        [0.05, 0.05], [0.95, 0.05], [0.95, 0.95],
                        [0.25, 0.95], [0.25, 0.35], [0.75, 0.35],
                        [0.75, 0.65], [0.45, 0.65]
                    ], 'line');
                    drawUV([[0.05, 0.05], [0.05, 0.95]], 'line');
                }
                break;
            }
            case 4: { // Interlocking Teeth
                drawUV([[0, 0], [0.5, 0.75], [1, 0]], baseStyle);
                drawUV([[0, 1], [0.5, 0.25], [1, 1]], filled ? 'opaque-outline' : 'filled');
                if (!filled) {
                    drawUV([[0.2, 0.3], [0.5, 0.55], [0.8, 0.3]], 'line');
                    drawUV([[0.2, 0.7], [0.5, 0.45], [0.8, 0.7]], 'line');
                }
                break;
            }
            case 5: { // Serpent Scales
                const cols = 3, rows = 2;
                for (let row = 0; row < rows; row++) {
                    for (let col = 0; col < cols; col++) {
                        const cx = (col + 0.5 + (row % 2) * 0.5) / (cols + 1);
                        const cy = (row + 0.5) / (rows + 0.5);
                        const w = 0.3 / cols;
                        const h = 0.35 / rows;
                        const pts: [number, number][] = [];
                        for (let t = 0; t <= 12; t++) {
                            const angle = (t / 12) * Math.PI;
                            pts.push([cx + Math.cos(angle) * w, cy - Math.sin(angle) * h]);
                        }
                        drawUV(pts, row % 2 === 0 ? baseStyle : (filled ? 'opaque-outline' : 'outline'));
                    }
                }
                break;
            }
            case 6: { // Quetzalcoatl Feather
                drawUV([[0.5, 0.0], [0.5, 1.0]], 'line');
                const nBarbs = 5;
                for (let j = 0; j < nBarbs; j++) {
                    const v = (j + 0.5) / nBarbs;
                    const side = j % 2 === 0 ? 1 : -1;
                    drawUV([
                        [0.5, v],
                        [0.5 + side * 0.15, v - 0.04],
                        [0.5 + side * 0.35, v - 0.06],
                        [0.5 + side * 0.45, v - 0.02]
                    ], j % 3 === 0 ? baseStyle : 'line');
                }
                break;
            }
            case 7: { // Ollin (Movement)
                drawUV([
                    [0.5, 0.1], [0.7, 0.2], [0.9, 0.5], [0.7, 0.45], [0.55, 0.4]
                ], baseStyle);
                drawUV([
                    [0.5, 0.9], [0.3, 0.8], [0.1, 0.5], [0.3, 0.55], [0.45, 0.6]
                ], baseStyle);
                drawUV([[0.4, 0.45], [0.6, 0.45], [0.6, 0.55], [0.4, 0.55]], filled ? 'opaque-outline' : 'filled');
                drawUV(circle(0.5, 0.5, 0.04), 'filled');
                break;
            }
        }
    }
};

export default mesoamericanPatterns;
