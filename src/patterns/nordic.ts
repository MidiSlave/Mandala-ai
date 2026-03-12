import type { PatternSet, PatternContext } from './types';

const nordicPatterns: PatternSet = {
    name: 'Nordic / Fair Isle',
    count: 5,
    draw: (type: number, { drawUV, filled, baseStyle }: PatternContext) => {
        switch (type) {
            case 0: { // Diamond chain
                // Outer diamond
                drawUV([
                    [0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]
                ], baseStyle);
                // Inner diamond (~60% scale, centered)
                const s = 0.2; // offset from center (0.5 * 0.6 * 0.5 ≈ 0.2 for 60%)
                drawUV([
                    [0.5, 0.5 - s], [0.5 + s, 0.5],
                    [0.5, 0.5 + s], [0.5 - s, 0.5]
                ], filled ? 'opaque-outline' : 'filled');
                break;
            }

            case 1: { // Snowflake / 8-point star
                const cx = 0.5;
                const cy = 0.5;
                const outerR = 0.45;
                const innerR = 0.2;
                const points: [number, number][] = [];
                for (let i = 0; i < 8; i++) {
                    const outerAngle = (i * Math.PI) / 4;
                    const innerAngle = ((i + 0.5) * Math.PI) / 4;
                    points.push([
                        cx + outerR * Math.cos(outerAngle),
                        cy + outerR * Math.sin(outerAngle)
                    ]);
                    points.push([
                        cx + innerR * Math.cos(innerAngle),
                        cy + innerR * Math.sin(innerAngle)
                    ]);
                }
                drawUV(points, baseStyle);
                // When not filled, add a dot in center
                if (!filled) {
                    const d = 0.04;
                    drawUV([
                        [cx, cy - d], [cx + d, cy],
                        [cx, cy + d], [cx - d, cy]
                    ], 'filled');
                }
                break;
            }

            case 2: { // X-cross stitch
                if (filled) {
                    // Thick X as two thin parallelograms
                    const t = 0.06;
                    drawUV([
                        [0.05, 0.05 + t], [0.05 + t, 0.05],
                        [0.95, 0.95 - t], [0.95 - t, 0.95]
                    ], 'filled');
                    drawUV([
                        [0.95 - t, 0.05], [0.95, 0.05 + t],
                        [0.05 + t, 0.95], [0.05, 0.95 - t]
                    ], 'filled');
                } else {
                    // Two diagonal lines
                    drawUV([[0.05, 0.05], [0.95, 0.95]], 'line');
                    drawUV([[0.95, 0.05], [0.05, 0.95]], 'line');
                    // Small diamond at center
                    const d = 0.08;
                    drawUV([
                        [0.5, 0.5 - d], [0.5 + d, 0.5],
                        [0.5, 0.5 + d], [0.5 - d, 0.5]
                    ], 'outline');
                }
                break;
            }

            case 3: { // Zigzag / sawtooth
                // Zigzag wave
                drawUV([
                    [0, 0.15], [0.25, 0.85], [0.5, 0.15],
                    [0.75, 0.85], [1.0, 0.15]
                ], 'line');
                // Horizontal border lines
                drawUV([[0, 0], [1, 0]], 'line');
                drawUV([[0, 1], [1, 1]], 'line');
                break;
            }

            case 4: { // Stacked triangles
                // Two upward-pointing triangles (bottom half)
                drawUV([[0, 1], [0.25, 0.5], [0.5, 1]], baseStyle);
                drawUV([[0.5, 1], [0.75, 0.5], [1, 1]], baseStyle);
                // Two downward-pointing triangles (top half)
                drawUV([[0, 0], [0.25, 0.5], [0.5, 0]], baseStyle);
                drawUV([[0.5, 0], [0.75, 0.5], [1, 0]], baseStyle);
                break;
            }
        }
    }
};

export default nordicPatterns;
