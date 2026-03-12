import type { PatternSet, PatternContext } from './types';

const greekkeyPatterns: PatternSet = {
    name: 'Greek Key / Meander',
    count: 5,
    draw: (type: number, { drawUV, filled, baseStyle }: PatternContext) => {
        switch (type) {
            case 0: { // Classic Greek key meander — interlocking rectangular spirals with cutouts
                // Top rail
                drawUV([
                    [0.0, 0.85], [1.0, 0.85],
                    [1.0, 0.94], [0.0, 0.94],
                ], baseStyle);
                // Bottom rail
                drawUV([
                    [0.0, 0.06], [1.0, 0.06],
                    [1.0, 0.15], [0.0, 0.15],
                ], baseStyle);

                // Left spiral: vertical bar
                drawUV([
                    [0.06, 0.15], [0.16, 0.15],
                    [0.16, 0.85], [0.06, 0.85],
                ], baseStyle);
                // Left spiral: top horizontal hook
                drawUV([
                    [0.16, 0.72], [0.40, 0.72],
                    [0.40, 0.82], [0.16, 0.82],
                ], baseStyle);
                // Left spiral: inner vertical
                drawUV([
                    [0.30, 0.32], [0.40, 0.32],
                    [0.40, 0.72], [0.30, 0.72],
                ], baseStyle);
                // Left spiral: inner bottom hook
                drawUV([
                    [0.16, 0.18], [0.30, 0.18],
                    [0.30, 0.28], [0.16, 0.28],
                ], baseStyle);

                // Right spiral: vertical bar
                drawUV([
                    [0.84, 0.15], [0.94, 0.15],
                    [0.94, 0.85], [0.84, 0.85],
                ], baseStyle);
                // Right spiral: bottom horizontal hook
                drawUV([
                    [0.60, 0.18], [0.84, 0.18],
                    [0.84, 0.28], [0.60, 0.28],
                ], baseStyle);
                // Right spiral: inner vertical
                drawUV([
                    [0.60, 0.28], [0.70, 0.28],
                    [0.70, 0.68], [0.60, 0.68],
                ], baseStyle);
                // Right spiral: inner top hook
                drawUV([
                    [0.70, 0.72], [0.84, 0.72],
                    [0.84, 0.82], [0.70, 0.82],
                ], baseStyle);

                if (filled) {
                    // Cutouts in spiral centers
                    drawUV([
                        [0.18, 0.34], [0.28, 0.34],
                        [0.28, 0.56], [0.18, 0.56],
                    ], 'opaque-outline');
                    drawUV([
                        [0.72, 0.44], [0.82, 0.44],
                        [0.82, 0.66], [0.72, 0.66],
                    ], 'opaque-outline');
                    // Small square cutouts in rails
                    drawUV([
                        [0.44, 0.87], [0.56, 0.87],
                        [0.56, 0.92], [0.44, 0.92],
                    ], 'opaque-outline');
                    drawUV([
                        [0.44, 0.08], [0.56, 0.08],
                        [0.56, 0.13], [0.44, 0.13],
                    ], 'opaque-outline');
                }

                // Center bridge / connector line
                drawUV([
                    [0.40, 0.46], [0.60, 0.46],
                    [0.60, 0.54], [0.40, 0.54],
                ], baseStyle);

                // Detail lines along rails
                drawUV([[0.0, 0.90], [1.0, 0.90]], 'line');
                drawUV([[0.0, 0.10], [1.0, 0.10]], 'line');
                // Detail tick marks on vertical bars
                drawUV([[0.06, 0.50], [0.16, 0.50]], 'line');
                drawUV([[0.84, 0.50], [0.94, 0.50]], 'line');
                break;
            }

            case 1: { // Labyrinth cross — cross with spiral arm tips curling inward
                // Vertical bar of cross
                drawUV([
                    [0.38, 0.06], [0.62, 0.06],
                    [0.62, 0.94], [0.38, 0.94],
                ], baseStyle);
                // Horizontal bar of cross
                drawUV([
                    [0.06, 0.38], [0.94, 0.38],
                    [0.94, 0.62], [0.06, 0.62],
                ], baseStyle);

                // Top-right curl
                drawUV([
                    [0.62, 0.78], [0.80, 0.78],
                    [0.80, 0.92], [0.62, 0.92],
                ], baseStyle);
                // Bottom-left curl
                drawUV([
                    [0.20, 0.08], [0.38, 0.08],
                    [0.38, 0.22], [0.20, 0.22],
                ], baseStyle);
                // Top-left curl
                drawUV([
                    [0.06, 0.62], [0.22, 0.62],
                    [0.22, 0.80], [0.06, 0.80],
                ], baseStyle);
                // Bottom-right curl
                drawUV([
                    [0.78, 0.20], [0.94, 0.20],
                    [0.94, 0.38], [0.78, 0.38],
                ], baseStyle);

                if (filled) {
                    // Central diamond cutout
                    drawUV([
                        [0.50, 0.40], [0.60, 0.50],
                        [0.50, 0.60], [0.40, 0.50],
                    ], 'opaque-outline');
                    // Cutouts in each arm
                    drawUV([
                        [0.44, 0.74], [0.56, 0.74],
                        [0.56, 0.84], [0.44, 0.84],
                    ], 'opaque-outline');
                    drawUV([
                        [0.44, 0.16], [0.56, 0.16],
                        [0.56, 0.26], [0.44, 0.26],
                    ], 'opaque-outline');
                    drawUV([
                        [0.14, 0.44], [0.24, 0.44],
                        [0.24, 0.56], [0.14, 0.56],
                    ], 'opaque-outline');
                    drawUV([
                        [0.76, 0.44], [0.86, 0.44],
                        [0.86, 0.56], [0.76, 0.56],
                    ], 'opaque-outline');
                    // Cutouts in curl blocks
                    drawUV([
                        [0.66, 0.82], [0.76, 0.82],
                        [0.76, 0.88], [0.66, 0.88],
                    ], 'opaque-outline');
                    drawUV([
                        [0.24, 0.12], [0.34, 0.12],
                        [0.34, 0.18], [0.24, 0.18],
                    ], 'opaque-outline');
                    drawUV([
                        [0.10, 0.66], [0.18, 0.66],
                        [0.18, 0.76], [0.10, 0.76],
                    ], 'opaque-outline');
                    drawUV([
                        [0.82, 0.24], [0.90, 0.24],
                        [0.90, 0.34], [0.82, 0.34],
                    ], 'opaque-outline');
                }

                // Cross-hair detail lines through center
                drawUV([[0.50, 0.06], [0.50, 0.94]], 'line');
                drawUV([[0.06, 0.50], [0.94, 0.50]], 'line');
                // Diagonal detail lines at corners
                drawUV([[0.06, 0.06], [0.20, 0.20]], 'line');
                drawUV([[0.80, 0.80], [0.94, 0.94]], 'line');
                drawUV([[0.80, 0.06], [0.94, 0.20]], 'line');
                drawUV([[0.06, 0.80], [0.20, 0.94]], 'line');
                break;
            }

            case 2: { // Wave scroll / running dog — S-curves with filled wave bands
                // Upper wave band (thick S-shape)
                drawUV([
                    [0.0, 0.56], [0.06, 0.62], [0.14, 0.70],
                    [0.22, 0.74], [0.32, 0.74], [0.40, 0.70],
                    [0.46, 0.62], [0.50, 0.56],
                    [0.54, 0.62], [0.60, 0.70],
                    [0.68, 0.74], [0.78, 0.74], [0.86, 0.70],
                    [0.94, 0.62], [1.0, 0.56],
                    [1.0, 0.68], [0.94, 0.76], [0.86, 0.82],
                    [0.78, 0.86], [0.68, 0.86], [0.60, 0.82],
                    [0.54, 0.76], [0.50, 0.68],
                    [0.46, 0.76], [0.40, 0.82],
                    [0.32, 0.86], [0.22, 0.86], [0.14, 0.82],
                    [0.06, 0.76], [0.0, 0.68],
                ], baseStyle);

                // Lower wave band (inverted S)
                drawUV([
                    [0.0, 0.32], [0.06, 0.24], [0.14, 0.18],
                    [0.22, 0.14], [0.32, 0.14], [0.40, 0.18],
                    [0.46, 0.24], [0.50, 0.32],
                    [0.54, 0.24], [0.60, 0.18],
                    [0.68, 0.14], [0.78, 0.14], [0.86, 0.18],
                    [0.94, 0.24], [1.0, 0.32],
                    [1.0, 0.44], [0.94, 0.38], [0.86, 0.30],
                    [0.78, 0.26], [0.68, 0.26], [0.60, 0.30],
                    [0.54, 0.38], [0.50, 0.44],
                    [0.46, 0.38], [0.40, 0.30],
                    [0.32, 0.26], [0.22, 0.26], [0.14, 0.30],
                    [0.06, 0.38], [0.0, 0.44],
                ], baseStyle);

                // Top border rail
                drawUV([
                    [0.0, 0.92], [1.0, 0.92],
                    [1.0, 0.98], [0.0, 0.98],
                ], baseStyle);
                // Bottom border rail
                drawUV([
                    [0.0, 0.02], [1.0, 0.02],
                    [1.0, 0.08], [0.0, 0.08],
                ], baseStyle);

                if (filled) {
                    // Spiral eye cutouts in upper waves
                    drawUV([
                        [0.24, 0.64], [0.30, 0.64],
                        [0.30, 0.72], [0.24, 0.72],
                    ], 'opaque-outline');
                    drawUV([
                        [0.70, 0.64], [0.76, 0.64],
                        [0.76, 0.72], [0.70, 0.72],
                    ], 'opaque-outline');
                    // Spiral eye cutouts in lower waves
                    drawUV([
                        [0.24, 0.16], [0.30, 0.16],
                        [0.30, 0.24], [0.24, 0.24],
                    ], 'opaque-outline');
                    drawUV([
                        [0.70, 0.16], [0.76, 0.16],
                        [0.76, 0.24], [0.70, 0.24],
                    ], 'opaque-outline');
                }

                // Center horizontal detail line
                drawUV([[0.0, 0.50], [1.0, 0.50]], 'line');
                // Detail dots on borders
                drawUV([[0.0, 0.95], [1.0, 0.95]], 'line');
                drawUV([[0.0, 0.05], [1.0, 0.05]], 'line');
                // Vertical connector lines between waves
                drawUV([[0.25, 0.44], [0.25, 0.56]], 'line');
                drawUV([[0.75, 0.44], [0.75, 0.56]], 'line');
                drawUV([[0.50, 0.44], [0.50, 0.56]], 'line');
                break;
            }

            case 3: { // Double meander border — two rows of stepped keys with connector band
                // Upper row: top rail
                drawUV([
                    [0.0, 0.90], [1.0, 0.90],
                    [1.0, 0.97], [0.0, 0.97],
                ], baseStyle);
                // Upper row: bottom rail
                drawUV([
                    [0.0, 0.60], [1.0, 0.60],
                    [1.0, 0.67], [0.0, 0.67],
                ], baseStyle);
                // Upper step: left key
                drawUV([
                    [0.05, 0.67], [0.14, 0.67],
                    [0.14, 0.90], [0.05, 0.90],
                ], baseStyle);
                drawUV([
                    [0.14, 0.76], [0.28, 0.76],
                    [0.28, 0.90], [0.14, 0.90],
                ], baseStyle);
                // Upper step: middle key
                drawUV([
                    [0.36, 0.67], [0.45, 0.67],
                    [0.45, 0.84], [0.36, 0.84],
                ], baseStyle);
                drawUV([
                    [0.45, 0.76], [0.55, 0.76],
                    [0.55, 0.90], [0.45, 0.90],
                ], baseStyle);
                // Upper step: right key
                drawUV([
                    [0.64, 0.67], [0.73, 0.67],
                    [0.73, 0.90], [0.64, 0.90],
                ], baseStyle);
                drawUV([
                    [0.73, 0.76], [0.86, 0.76],
                    [0.86, 0.90], [0.73, 0.90],
                ], baseStyle);

                // Lower row: top rail
                drawUV([
                    [0.0, 0.33], [1.0, 0.33],
                    [1.0, 0.40], [0.0, 0.40],
                ], baseStyle);
                // Lower row: bottom rail
                drawUV([
                    [0.0, 0.03], [1.0, 0.03],
                    [1.0, 0.10], [0.0, 0.10],
                ], baseStyle);
                // Lower step: keys offset by half
                drawUV([
                    [0.18, 0.10], [0.27, 0.10],
                    [0.27, 0.33], [0.18, 0.33],
                ], baseStyle);
                drawUV([
                    [0.27, 0.10], [0.41, 0.10],
                    [0.41, 0.20], [0.27, 0.20],
                ], baseStyle);
                drawUV([
                    [0.50, 0.10], [0.59, 0.10],
                    [0.59, 0.33], [0.50, 0.33],
                ], baseStyle);
                drawUV([
                    [0.59, 0.10], [0.73, 0.10],
                    [0.73, 0.20], [0.59, 0.20],
                ], baseStyle);
                drawUV([
                    [0.82, 0.10], [0.91, 0.10],
                    [0.91, 0.26], [0.82, 0.26],
                ], baseStyle);

                // Center connector band with notches
                drawUV([
                    [0.0, 0.47], [1.0, 0.47],
                    [1.0, 0.53], [0.0, 0.53],
                ], baseStyle);

                if (filled) {
                    // Cutouts in upper keys
                    drawUV([
                        [0.07, 0.78], [0.12, 0.78],
                        [0.12, 0.86], [0.07, 0.86],
                    ], 'opaque-outline');
                    drawUV([
                        [0.38, 0.69], [0.43, 0.69],
                        [0.43, 0.76], [0.38, 0.76],
                    ], 'opaque-outline');
                    drawUV([
                        [0.66, 0.78], [0.71, 0.78],
                        [0.71, 0.86], [0.66, 0.86],
                    ], 'opaque-outline');
                    // Cutouts in lower keys
                    drawUV([
                        [0.20, 0.22], [0.25, 0.22],
                        [0.25, 0.30], [0.20, 0.30],
                    ], 'opaque-outline');
                    drawUV([
                        [0.52, 0.22], [0.57, 0.22],
                        [0.57, 0.30], [0.52, 0.30],
                    ], 'opaque-outline');
                    // Connector band notches
                    drawUV([
                        [0.15, 0.48], [0.30, 0.48],
                        [0.30, 0.52], [0.15, 0.52],
                    ], 'opaque-outline');
                    drawUV([
                        [0.55, 0.48], [0.70, 0.48],
                        [0.70, 0.52], [0.55, 0.52],
                    ], 'opaque-outline');
                }

                // Detail lines on rails
                drawUV([[0.0, 0.93], [1.0, 0.93]], 'line');
                drawUV([[0.0, 0.63], [1.0, 0.63]], 'line');
                drawUV([[0.0, 0.37], [1.0, 0.37]], 'line');
                drawUV([[0.0, 0.07], [1.0, 0.07]], 'line');
                drawUV([[0.0, 0.50], [1.0, 0.50]], 'line');
                break;
            }

            case 4: { // Greek fret mosaic — tessellating L-shapes and T-shapes
                // Top-left L (facing down-right)
                drawUV([
                    [0.04, 0.56], [0.20, 0.56],
                    [0.20, 0.68], [0.14, 0.68],
                    [0.14, 0.94], [0.04, 0.94],
                ], baseStyle);

                // Top-right L (facing down-left, mirrored)
                drawUV([
                    [0.80, 0.56], [0.96, 0.56],
                    [0.96, 0.94], [0.86, 0.94],
                    [0.86, 0.68], [0.80, 0.68],
                ], baseStyle);

                // Bottom-left L (facing up-right)
                drawUV([
                    [0.04, 0.06], [0.14, 0.06],
                    [0.14, 0.32], [0.20, 0.32],
                    [0.20, 0.44], [0.04, 0.44],
                ], baseStyle);

                // Bottom-right L (facing up-left, mirrored)
                drawUV([
                    [0.86, 0.06], [0.96, 0.06],
                    [0.96, 0.44], [0.80, 0.44],
                    [0.80, 0.32], [0.86, 0.32],
                ], baseStyle);

                // Center T-shape top
                drawUV([
                    [0.28, 0.72], [0.72, 0.72],
                    [0.72, 0.82], [0.56, 0.82],
                    [0.56, 0.94], [0.44, 0.94],
                    [0.44, 0.82], [0.28, 0.82],
                ], baseStyle);

                // Center T-shape bottom (inverted)
                drawUV([
                    [0.28, 0.18], [0.44, 0.18],
                    [0.44, 0.06], [0.56, 0.06],
                    [0.56, 0.18], [0.72, 0.18],
                    [0.72, 0.28], [0.28, 0.28],
                ], baseStyle);

                // Center connector block
                drawUV([
                    [0.36, 0.40], [0.64, 0.40],
                    [0.64, 0.60], [0.36, 0.60],
                ], baseStyle);

                // Horizontal bridge bars
                drawUV([
                    [0.20, 0.46], [0.36, 0.46],
                    [0.36, 0.54], [0.20, 0.54],
                ], baseStyle);
                drawUV([
                    [0.64, 0.46], [0.80, 0.46],
                    [0.80, 0.54], [0.64, 0.54],
                ], baseStyle);

                if (filled) {
                    // Center block cutout
                    drawUV([
                        [0.42, 0.45], [0.58, 0.45],
                        [0.58, 0.55], [0.42, 0.55],
                    ], 'opaque-outline');
                    // T-shape cutouts
                    drawUV([
                        [0.38, 0.74], [0.62, 0.74],
                        [0.62, 0.80], [0.38, 0.80],
                    ], 'opaque-outline');
                    drawUV([
                        [0.38, 0.20], [0.62, 0.20],
                        [0.62, 0.26], [0.38, 0.26],
                    ], 'opaque-outline');
                    // L-shape cutouts
                    drawUV([
                        [0.06, 0.72], [0.12, 0.72],
                        [0.12, 0.86], [0.06, 0.86],
                    ], 'opaque-outline');
                    drawUV([
                        [0.88, 0.72], [0.94, 0.72],
                        [0.94, 0.86], [0.88, 0.86],
                    ], 'opaque-outline');
                    drawUV([
                        [0.06, 0.14], [0.12, 0.14],
                        [0.12, 0.28], [0.06, 0.28],
                    ], 'opaque-outline');
                    drawUV([
                        [0.88, 0.14], [0.94, 0.14],
                        [0.94, 0.28], [0.88, 0.28],
                    ], 'opaque-outline');
                }

                // Grid detail lines
                drawUV([[0.0, 0.50], [1.0, 0.50]], 'line');
                drawUV([[0.50, 0.0], [0.50, 1.0]], 'line');
                // Corner accent diagonals
                drawUV([[0.20, 0.56], [0.28, 0.60]], 'line');
                drawUV([[0.72, 0.56], [0.80, 0.60]], 'line');
                drawUV([[0.20, 0.44], [0.28, 0.40]], 'line');
                drawUV([[0.72, 0.44], [0.80, 0.40]], 'line');
                break;
            }
        }
    }
};

export default greekkeyPatterns;
