import type { PatternSet, PatternContext } from './types';

const greekkeyPatterns: PatternSet = {
    name: 'Greek Key / Meander',
    count: 5,
    draw: (type: number, { drawUV, filled, baseStyle }: PatternContext) => {
        switch (type) {
            case 0: { // Classic Greek key meander — interlocking rectangular spirals as filled bars with cutouts
                // Top horizontal bar
                drawUV([
                    [0.0, 0.78], [1.0, 0.78],
                    [1.0, 0.92], [0.0, 0.92],
                ], baseStyle);
                // Bottom horizontal bar
                drawUV([
                    [0.0, 0.08], [1.0, 0.08],
                    [1.0, 0.22], [0.0, 0.22],
                ], baseStyle);

                // Left spiral arm: vertical drop from top bar
                drawUV([
                    [0.08, 0.22], [0.22, 0.22],
                    [0.22, 0.78], [0.08, 0.78],
                ], baseStyle);
                // Left spiral: horizontal bar inward at top
                drawUV([
                    [0.22, 0.62], [0.52, 0.62],
                    [0.52, 0.78], [0.22, 0.78],
                ], baseStyle);
                // Left spiral: inner vertical drop
                drawUV([
                    [0.38, 0.34], [0.52, 0.34],
                    [0.52, 0.62], [0.38, 0.62],
                ], baseStyle);
                // Left spiral: inner horizontal stub
                drawUV([
                    [0.22, 0.22], [0.38, 0.22],
                    [0.38, 0.34], [0.22, 0.34],
                ], baseStyle);

                // Right spiral arm: vertical rise from bottom bar
                drawUV([
                    [0.78, 0.22], [0.92, 0.22],
                    [0.92, 0.78], [0.78, 0.78],
                ], baseStyle);
                // Right spiral: horizontal bar inward at bottom
                drawUV([
                    [0.48, 0.22], [0.78, 0.22],
                    [0.78, 0.38], [0.48, 0.38],
                ], baseStyle);
                // Right spiral: inner vertical rise
                drawUV([
                    [0.48, 0.38], [0.62, 0.38],
                    [0.62, 0.66], [0.48, 0.66],
                ], baseStyle);
                // Right spiral: inner horizontal stub
                drawUV([
                    [0.62, 0.66], [0.78, 0.66],
                    [0.78, 0.78], [0.62, 0.78],
                ], baseStyle);

                if (filled) {
                    // Cutouts to reveal the spiral negative space
                    drawUV([
                        [0.24, 0.36], [0.36, 0.36],
                        [0.36, 0.60], [0.24, 0.60],
                    ], 'opaque-outline');
                    drawUV([
                        [0.64, 0.40], [0.76, 0.40],
                        [0.76, 0.64], [0.64, 0.64],
                    ], 'opaque-outline');
                }

                // Detail lines on bars
                drawUV([[0.0, 0.85], [1.0, 0.85]], 'line');
                drawUV([[0.0, 0.15], [1.0, 0.15]], 'line');
                break;
            }

            case 1: { // Labyrinth cross — cross shape with spiral arms curling inward
                // Central square
                drawUV([
                    [0.35, 0.35], [0.65, 0.35],
                    [0.65, 0.65], [0.35, 0.65],
                ], baseStyle);

                // Top arm
                drawUV([
                    [0.38, 0.65], [0.62, 0.65],
                    [0.62, 0.95], [0.38, 0.95],
                ], baseStyle);
                // Top arm curl right
                drawUV([
                    [0.62, 0.82], [0.82, 0.82],
                    [0.82, 0.95], [0.62, 0.95],
                ], baseStyle);

                // Bottom arm
                drawUV([
                    [0.38, 0.05], [0.62, 0.05],
                    [0.62, 0.35], [0.38, 0.35],
                ], baseStyle);
                // Bottom arm curl left
                drawUV([
                    [0.18, 0.05], [0.38, 0.05],
                    [0.38, 0.18], [0.18, 0.18],
                ], baseStyle);

                // Right arm
                drawUV([
                    [0.65, 0.38], [0.95, 0.38],
                    [0.95, 0.62], [0.65, 0.62],
                ], baseStyle);
                // Right arm curl down
                drawUV([
                    [0.82, 0.18], [0.95, 0.18],
                    [0.95, 0.38], [0.82, 0.38],
                ], baseStyle);

                // Left arm
                drawUV([
                    [0.05, 0.38], [0.35, 0.38],
                    [0.35, 0.62], [0.05, 0.62],
                ], baseStyle);
                // Left arm curl up
                drawUV([
                    [0.05, 0.62], [0.18, 0.62],
                    [0.18, 0.82], [0.05, 0.82],
                ], baseStyle);

                if (filled) {
                    // Inner cutout in center
                    drawUV([
                        [0.42, 0.42], [0.58, 0.42],
                        [0.58, 0.58], [0.42, 0.58],
                    ], 'opaque-outline');
                    // Small cutouts in each arm
                    drawUV([
                        [0.44, 0.72], [0.56, 0.72],
                        [0.56, 0.80], [0.44, 0.80],
                    ], 'opaque-outline');
                    drawUV([
                        [0.44, 0.20], [0.56, 0.20],
                        [0.56, 0.28], [0.44, 0.28],
                    ], 'opaque-outline');
                    drawUV([
                        [0.72, 0.44], [0.80, 0.44],
                        [0.80, 0.56], [0.72, 0.56],
                    ], 'opaque-outline');
                    drawUV([
                        [0.20, 0.44], [0.28, 0.44],
                        [0.28, 0.56], [0.20, 0.56],
                    ], 'opaque-outline');
                }

                // Cross-hatch detail lines in center
                drawUV([[0.42, 0.50], [0.58, 0.50]], 'line');
                drawUV([[0.50, 0.42], [0.50, 0.58]], 'line');

                // Detail lines along arm edges
                drawUV([[0.50, 0.68], [0.50, 0.92]], 'line');
                drawUV([[0.50, 0.08], [0.50, 0.32]], 'line');
                drawUV([[0.68, 0.50], [0.92, 0.50]], 'line');
                drawUV([[0.08, 0.50], [0.32, 0.50]], 'line');
                break;
            }

            case 2: { // Wave scroll / running dog — continuous S-curves with filled bands
                // Upper wave band
                drawUV([
                    [0.0, 0.52], [0.08, 0.65], [0.16, 0.72],
                    [0.28, 0.75], [0.38, 0.72], [0.46, 0.65],
                    [0.50, 0.55], [0.54, 0.65], [0.62, 0.72],
                    [0.72, 0.75], [0.82, 0.72], [0.90, 0.65],
                    [1.0, 0.52],
                    [1.0, 0.66], [0.90, 0.80], [0.82, 0.86],
                    [0.72, 0.88], [0.62, 0.86], [0.54, 0.80],
                    [0.50, 0.70], [0.46, 0.80], [0.38, 0.86],
                    [0.28, 0.88], [0.16, 0.86], [0.08, 0.80],
                    [0.0, 0.66],
                ], baseStyle);

                // Lower wave band
                drawUV([
                    [0.0, 0.34], [0.08, 0.20], [0.16, 0.14],
                    [0.28, 0.12], [0.38, 0.14], [0.46, 0.20],
                    [0.50, 0.30], [0.54, 0.20], [0.62, 0.14],
                    [0.72, 0.12], [0.82, 0.14], [0.90, 0.20],
                    [1.0, 0.34],
                    [1.0, 0.48], [0.90, 0.35], [0.82, 0.28],
                    [0.72, 0.26], [0.62, 0.28], [0.54, 0.35],
                    [0.50, 0.45], [0.46, 0.35], [0.38, 0.28],
                    [0.28, 0.26], [0.16, 0.28], [0.08, 0.35],
                    [0.0, 0.48],
                ], baseStyle);

                // Top border strip
                drawUV([
                    [0.0, 0.92], [1.0, 0.92],
                    [1.0, 1.0], [0.0, 1.0],
                ], baseStyle);
                // Bottom border strip
                drawUV([
                    [0.0, 0.0], [1.0, 0.0],
                    [1.0, 0.08], [0.0, 0.08],
                ], baseStyle);

                // Spiral curls inside waves
                drawUV([
                    [0.22, 0.60], [0.28, 0.64], [0.30, 0.68],
                    [0.28, 0.70], [0.24, 0.68], [0.22, 0.64],
                ], filled ? 'opaque-outline' : 'outline');
                drawUV([
                    [0.72, 0.60], [0.78, 0.64], [0.80, 0.68],
                    [0.78, 0.70], [0.74, 0.68], [0.72, 0.64],
                ], filled ? 'opaque-outline' : 'outline');
                drawUV([
                    [0.22, 0.36], [0.28, 0.32], [0.30, 0.28],
                    [0.28, 0.26], [0.24, 0.28], [0.22, 0.32],
                ], filled ? 'opaque-outline' : 'outline');
                drawUV([
                    [0.72, 0.36], [0.78, 0.32], [0.80, 0.28],
                    [0.78, 0.26], [0.74, 0.28], [0.72, 0.32],
                ], filled ? 'opaque-outline' : 'outline');

                // Center detail lines
                drawUV([[0.0, 0.50], [1.0, 0.50]], 'line');
                drawUV([[0.0, 0.96], [1.0, 0.96]], 'line');
                drawUV([[0.0, 0.04], [1.0, 0.04]], 'line');
                break;
            }

            case 3: { // Double meander border — two rows of Greek key steps with connector
                // Upper meander row - top bar
                drawUV([
                    [0.0, 0.88], [1.0, 0.88],
                    [1.0, 0.96], [0.0, 0.96],
                ], baseStyle);
                // Upper meander row - bottom bar
                drawUV([
                    [0.0, 0.58], [1.0, 0.58],
                    [1.0, 0.66], [0.0, 0.66],
                ], baseStyle);
                // Upper meander vertical steps
                drawUV([
                    [0.06, 0.66], [0.18, 0.66],
                    [0.18, 0.88], [0.06, 0.88],
                ], baseStyle);
                drawUV([
                    [0.30, 0.66], [0.42, 0.66],
                    [0.42, 0.80], [0.30, 0.80],
                ], baseStyle);
                drawUV([
                    [0.18, 0.74], [0.30, 0.74],
                    [0.30, 0.88], [0.18, 0.88],
                ], baseStyle);
                drawUV([
                    [0.54, 0.66], [0.66, 0.66],
                    [0.66, 0.88], [0.54, 0.88],
                ], baseStyle);
                drawUV([
                    [0.78, 0.66], [0.90, 0.66],
                    [0.90, 0.80], [0.78, 0.80],
                ], baseStyle);
                drawUV([
                    [0.66, 0.74], [0.78, 0.74],
                    [0.78, 0.88], [0.66, 0.88],
                ], baseStyle);

                // Lower meander row - top bar
                drawUV([
                    [0.0, 0.34], [1.0, 0.34],
                    [1.0, 0.42], [0.0, 0.42],
                ], baseStyle);
                // Lower meander row - bottom bar
                drawUV([
                    [0.0, 0.04], [1.0, 0.04],
                    [1.0, 0.12], [0.0, 0.12],
                ], baseStyle);
                // Lower meander vertical steps (offset from upper)
                drawUV([
                    [0.12, 0.12], [0.24, 0.12],
                    [0.24, 0.34], [0.12, 0.34],
                ], baseStyle);
                drawUV([
                    [0.36, 0.12], [0.48, 0.12],
                    [0.48, 0.26], [0.36, 0.26],
                ], baseStyle);
                drawUV([
                    [0.24, 0.20], [0.36, 0.20],
                    [0.36, 0.34], [0.24, 0.34],
                ], baseStyle);
                drawUV([
                    [0.60, 0.12], [0.72, 0.12],
                    [0.72, 0.34], [0.60, 0.34],
                ], baseStyle);
                drawUV([
                    [0.84, 0.12], [0.96, 0.12],
                    [0.96, 0.26], [0.84, 0.26],
                ], baseStyle);
                drawUV([
                    [0.72, 0.20], [0.84, 0.20],
                    [0.84, 0.34], [0.72, 0.34],
                ], baseStyle);

                // Middle connector band
                drawUV([
                    [0.0, 0.46], [1.0, 0.46],
                    [1.0, 0.54], [0.0, 0.54],
                ], baseStyle);

                if (filled) {
                    // Cutout windows in upper steps
                    drawUV([
                        [0.08, 0.68], [0.16, 0.68],
                        [0.16, 0.74], [0.08, 0.74],
                    ], 'opaque-outline');
                    drawUV([
                        [0.56, 0.68], [0.64, 0.68],
                        [0.64, 0.74], [0.56, 0.74],
                    ], 'opaque-outline');
                    // Cutout windows in lower steps
                    drawUV([
                        [0.14, 0.14], [0.22, 0.14],
                        [0.22, 0.20], [0.14, 0.20],
                    ], 'opaque-outline');
                    drawUV([
                        [0.62, 0.14], [0.70, 0.14],
                        [0.70, 0.20], [0.62, 0.20],
                    ], 'opaque-outline');
                    // Connector band cutout
                    drawUV([
                        [0.20, 0.48], [0.36, 0.48],
                        [0.36, 0.52], [0.20, 0.52],
                    ], 'opaque-outline');
                    drawUV([
                        [0.64, 0.48], [0.80, 0.48],
                        [0.80, 0.52], [0.64, 0.52],
                    ], 'opaque-outline');
                }

                // Detail lines
                drawUV([[0.0, 0.50], [1.0, 0.50]], 'line');
                drawUV([[0.0, 0.92], [1.0, 0.92]], 'line');
                drawUV([[0.0, 0.08], [1.0, 0.08]], 'line');
                break;
            }

            case 4: { // Greek fret mosaic — tessellating L-shapes and T-shapes in alternating fill
                // Large L-shape top-left
                drawUV([
                    [0.04, 0.50], [0.28, 0.50],
                    [0.28, 0.64], [0.16, 0.64],
                    [0.16, 0.92], [0.04, 0.92],
                ], baseStyle);

                // Large L-shape bottom-right (mirrored)
                drawUV([
                    [0.72, 0.08], [0.96, 0.08],
                    [0.96, 0.50], [0.84, 0.50],
                    [0.84, 0.36], [0.72, 0.36],
                ], baseStyle);

                // T-shape center-top
                drawUV([
                    [0.30, 0.76], [0.70, 0.76],
                    [0.70, 0.88], [0.56, 0.88],
                    [0.56, 0.96], [0.44, 0.96],
                    [0.44, 0.88], [0.30, 0.88],
                ], baseStyle);

                // T-shape center-bottom
                drawUV([
                    [0.30, 0.12], [0.70, 0.12],
                    [0.70, 0.24], [0.56, 0.24],
                    [0.56, 0.34], [0.44, 0.34],
                    [0.44, 0.24], [0.30, 0.24],
                ], baseStyle);

                // Small L-shape top-right
                drawUV([
                    [0.72, 0.58], [0.96, 0.58],
                    [0.96, 0.92], [0.84, 0.92],
                    [0.84, 0.70], [0.72, 0.70],
                ], baseStyle);

                // Small L-shape bottom-left
                drawUV([
                    [0.04, 0.08], [0.16, 0.08],
                    [0.16, 0.30], [0.28, 0.30],
                    [0.28, 0.42], [0.04, 0.42],
                ], baseStyle);

                // Center square connector
                drawUV([
                    [0.38, 0.40], [0.62, 0.40],
                    [0.62, 0.60], [0.38, 0.60],
                ], baseStyle);

                if (filled) {
                    // Cutout in center square
                    drawUV([
                        [0.44, 0.45], [0.56, 0.45],
                        [0.56, 0.55], [0.44, 0.55],
                    ], 'opaque-outline');
                    // Cutout in T-shapes
                    drawUV([
                        [0.40, 0.78], [0.60, 0.78],
                        [0.60, 0.86], [0.40, 0.86],
                    ], 'opaque-outline');
                    drawUV([
                        [0.40, 0.14], [0.60, 0.14],
                        [0.60, 0.22], [0.40, 0.22],
                    ], 'opaque-outline');
                    // Cutout in L-shapes
                    drawUV([
                        [0.06, 0.70], [0.14, 0.70],
                        [0.14, 0.84], [0.06, 0.84],
                    ], 'opaque-outline');
                    drawUV([
                        [0.86, 0.16], [0.94, 0.16],
                        [0.94, 0.30], [0.86, 0.30],
                    ], 'opaque-outline');
                }

                // Grid detail lines
                drawUV([[0.0, 0.50], [1.0, 0.50]], 'line');
                drawUV([[0.50, 0.0], [0.50, 1.0]], 'line');
                // Diagonal detail lines in empty areas
                drawUV([[0.30, 0.50], [0.38, 0.60]], 'line');
                drawUV([[0.62, 0.40], [0.70, 0.50]], 'line');
                drawUV([[0.30, 0.50], [0.38, 0.40]], 'line');
                drawUV([[0.62, 0.60], [0.70, 0.50]], 'line');
                break;
            }
        }
    }
};

export default greekkeyPatterns;
