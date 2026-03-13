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

                // Center bridge / connector block
                drawUV([
                    [0.40, 0.46], [0.60, 0.46],
                    [0.60, 0.54], [0.40, 0.54],
                ], baseStyle);

                // Detail lines along rails (converted to filled rects)
                drawUV([
                    [0.0, 0.885], [1.0, 0.885],
                    [1.0, 0.915], [0.0, 0.915],
                ], baseStyle);
                drawUV([
                    [0.0, 0.085], [1.0, 0.085],
                    [1.0, 0.115], [0.0, 0.115],
                ], baseStyle);
                // Detail tick marks on vertical bars (converted to filled rects)
                drawUV([
                    [0.06, 0.485], [0.16, 0.485],
                    [0.16, 0.515], [0.06, 0.515],
                ], baseStyle);
                drawUV([
                    [0.84, 0.485], [0.94, 0.485],
                    [0.94, 0.515], [0.84, 0.515],
                ], baseStyle);

                // Additional filled background shapes to reduce empty areas
                // Fill between spirals at top
                drawUV([
                    [0.40, 0.82], [0.70, 0.82],
                    [0.70, 0.85], [0.40, 0.85],
                ], baseStyle);
                // Fill between spirals at bottom
                drawUV([
                    [0.30, 0.15], [0.60, 0.15],
                    [0.60, 0.18], [0.30, 0.18],
                ], baseStyle);
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

                // Corner fill blocks to reduce empty space
                drawUV([
                    [0.06, 0.80], [0.22, 0.80],
                    [0.22, 0.94], [0.06, 0.94],
                ], baseStyle);
                drawUV([
                    [0.78, 0.06], [0.94, 0.06],
                    [0.94, 0.20], [0.78, 0.20],
                ], baseStyle);
                drawUV([
                    [0.06, 0.06], [0.20, 0.06],
                    [0.20, 0.22], [0.06, 0.22],
                ], baseStyle);
                drawUV([
                    [0.80, 0.78], [0.94, 0.78],
                    [0.94, 0.94], [0.80, 0.94],
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
                    // Cutouts in corner fill blocks
                    drawUV([
                        [0.09, 0.84], [0.19, 0.84],
                        [0.19, 0.91], [0.09, 0.91],
                    ], 'opaque-outline');
                    drawUV([
                        [0.81, 0.09], [0.91, 0.09],
                        [0.91, 0.17], [0.81, 0.17],
                    ], 'opaque-outline');
                    drawUV([
                        [0.09, 0.09], [0.17, 0.09],
                        [0.17, 0.19], [0.09, 0.19],
                    ], 'opaque-outline');
                    drawUV([
                        [0.83, 0.81], [0.91, 0.81],
                        [0.91, 0.91], [0.83, 0.91],
                    ], 'opaque-outline');
                }

                // Cross-hair detail lines through center (converted to filled rects)
                // Vertical center line
                drawUV([
                    [0.485, 0.06], [0.515, 0.06],
                    [0.515, 0.94], [0.485, 0.94],
                ], baseStyle);
                // Horizontal center line
                drawUV([
                    [0.06, 0.485], [0.94, 0.485],
                    [0.94, 0.515], [0.06, 0.515],
                ], baseStyle);
                // Diagonal detail at corners (converted to filled parallelograms)
                drawUV([
                    [0.06, 0.04], [0.08, 0.06],
                    [0.22, 0.20], [0.20, 0.18],
                ], baseStyle);
                drawUV([
                    [0.80, 0.78], [0.82, 0.80],
                    [0.96, 0.94], [0.94, 0.92],
                ], baseStyle);
                drawUV([
                    [0.80, 0.08], [0.82, 0.06],
                    [0.96, 0.20], [0.94, 0.22],
                ], baseStyle);
                drawUV([
                    [0.06, 0.82], [0.08, 0.80],
                    [0.22, 0.94], [0.20, 0.96],
                ], baseStyle);
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
                    [0.0, 0.90], [1.0, 0.90],
                    [1.0, 0.98], [0.0, 0.98],
                ], baseStyle);
                // Bottom border rail
                drawUV([
                    [0.0, 0.02], [1.0, 0.02],
                    [1.0, 0.08], [0.0, 0.08],
                ], baseStyle);

                // Fill between upper wave and top rail
                drawUV([
                    [0.0, 0.86], [1.0, 0.86],
                    [1.0, 0.90], [0.0, 0.90],
                ], baseStyle);
                // Fill between lower wave and bottom rail
                drawUV([
                    [0.0, 0.08], [1.0, 0.08],
                    [1.0, 0.14], [0.0, 0.14],
                ], baseStyle);

                // Center horizontal band between waves
                drawUV([
                    [0.0, 0.46], [1.0, 0.46],
                    [1.0, 0.54], [0.0, 0.54],
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
                    // Center band cutout
                    drawUV([
                        [0.22, 0.48], [0.34, 0.48],
                        [0.34, 0.52], [0.22, 0.52],
                    ], 'opaque-outline');
                    drawUV([
                        [0.66, 0.48], [0.78, 0.48],
                        [0.78, 0.52], [0.66, 0.52],
                    ], 'opaque-outline');
                }

                // Detail lines on borders (converted to filled rects)
                drawUV([
                    [0.0, 0.935], [1.0, 0.935],
                    [1.0, 0.965], [0.0, 0.965],
                ], baseStyle);
                drawUV([
                    [0.0, 0.035], [1.0, 0.035],
                    [1.0, 0.065], [0.0, 0.065],
                ], baseStyle);
                // Vertical connector bars between waves (converted to filled rects)
                drawUV([
                    [0.235, 0.44], [0.265, 0.44],
                    [0.265, 0.56], [0.235, 0.56],
                ], baseStyle);
                drawUV([
                    [0.735, 0.44], [0.765, 0.44],
                    [0.765, 0.56], [0.735, 0.56],
                ], baseStyle);
                drawUV([
                    [0.485, 0.44], [0.515, 0.44],
                    [0.515, 0.56], [0.485, 0.56],
                ], baseStyle);
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

                // Upper row: fill gaps between keys
                drawUV([
                    [0.28, 0.67], [0.36, 0.67],
                    [0.36, 0.76], [0.28, 0.76],
                ], baseStyle);
                drawUV([
                    [0.55, 0.67], [0.64, 0.67],
                    [0.64, 0.76], [0.55, 0.76],
                ], baseStyle);
                drawUV([
                    [0.86, 0.67], [0.95, 0.67],
                    [0.95, 0.76], [0.86, 0.76],
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

                // Lower row: fill gaps between keys
                drawUV([
                    [0.05, 0.10], [0.18, 0.10],
                    [0.18, 0.20], [0.05, 0.20],
                ], baseStyle);
                drawUV([
                    [0.41, 0.10], [0.50, 0.10],
                    [0.50, 0.20], [0.41, 0.20],
                ], baseStyle);
                drawUV([
                    [0.73, 0.10], [0.82, 0.10],
                    [0.82, 0.20], [0.73, 0.20],
                ], baseStyle);

                // Center connector band with notches
                drawUV([
                    [0.0, 0.44], [1.0, 0.44],
                    [1.0, 0.56], [0.0, 0.56],
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
                        [0.15, 0.46], [0.30, 0.46],
                        [0.30, 0.54], [0.15, 0.54],
                    ], 'opaque-outline');
                    drawUV([
                        [0.55, 0.46], [0.70, 0.46],
                        [0.70, 0.54], [0.55, 0.54],
                    ], 'opaque-outline');
                }

                // Detail lines on rails (converted to filled rects)
                drawUV([
                    [0.0, 0.915], [1.0, 0.915],
                    [1.0, 0.945], [0.0, 0.945],
                ], baseStyle);
                drawUV([
                    [0.0, 0.615], [1.0, 0.615],
                    [1.0, 0.645], [0.0, 0.645],
                ], baseStyle);
                drawUV([
                    [0.0, 0.355], [1.0, 0.355],
                    [1.0, 0.385], [0.0, 0.385],
                ], baseStyle);
                drawUV([
                    [0.0, 0.055], [1.0, 0.055],
                    [1.0, 0.085], [0.0, 0.085],
                ], baseStyle);
                drawUV([
                    [0.0, 0.485], [1.0, 0.485],
                    [1.0, 0.515], [0.0, 0.515],
                ], baseStyle);
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

                // Additional filled areas to reduce empty space
                // Fill between top L-shapes and T-shape
                drawUV([
                    [0.20, 0.68], [0.28, 0.68],
                    [0.28, 0.72], [0.20, 0.72],
                ], baseStyle);
                drawUV([
                    [0.72, 0.68], [0.80, 0.68],
                    [0.80, 0.72], [0.72, 0.72],
                ], baseStyle);
                // Fill between bottom L-shapes and T-shape
                drawUV([
                    [0.20, 0.28], [0.28, 0.28],
                    [0.28, 0.32], [0.20, 0.32],
                ], baseStyle);
                drawUV([
                    [0.72, 0.28], [0.80, 0.28],
                    [0.80, 0.32], [0.72, 0.32],
                ], baseStyle);
                // Fill vertical gaps beside center block
                drawUV([
                    [0.20, 0.54], [0.36, 0.54],
                    [0.36, 0.60], [0.20, 0.60],
                ], baseStyle);
                drawUV([
                    [0.64, 0.54], [0.80, 0.54],
                    [0.80, 0.60], [0.64, 0.60],
                ], baseStyle);
                drawUV([
                    [0.20, 0.40], [0.36, 0.40],
                    [0.36, 0.46], [0.20, 0.46],
                ], baseStyle);
                drawUV([
                    [0.64, 0.40], [0.80, 0.40],
                    [0.80, 0.46], [0.64, 0.46],
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

                // Grid detail lines (converted to filled rects)
                // Horizontal center line
                drawUV([
                    [0.0, 0.485], [1.0, 0.485],
                    [1.0, 0.515], [0.0, 0.515],
                ], baseStyle);
                // Vertical center line
                drawUV([
                    [0.485, 0.0], [0.515, 0.0],
                    [0.515, 1.0], [0.485, 1.0],
                ], baseStyle);
                // Corner accent diagonals (converted to filled parallelograms)
                drawUV([
                    [0.20, 0.54], [0.22, 0.56],
                    [0.30, 0.60], [0.28, 0.58],
                ], baseStyle);
                drawUV([
                    [0.72, 0.54], [0.74, 0.56],
                    [0.82, 0.60], [0.80, 0.58],
                ], baseStyle);
                drawUV([
                    [0.20, 0.46], [0.22, 0.44],
                    [0.30, 0.40], [0.28, 0.42],
                ], baseStyle);
                drawUV([
                    [0.72, 0.46], [0.74, 0.44],
                    [0.82, 0.40], [0.80, 0.42],
                ], baseStyle);
                break;
            }
        }
    }
};

export default greekkeyPatterns;
