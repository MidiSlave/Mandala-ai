import type { PatternSet, PatternContext } from './types';

const aztecPatterns: PatternSet = {
    name: 'Aztec / Mayan',
    count: 5,
    draw: (type: number, { drawUV, filled, baseStyle }: PatternContext) => {
        switch (type) {
            case 0: // Stepped pyramid / ziggurat
                drawUV([
                    [0, 0], [0.2, 0], [0.2, 0.25], [0.4, 0.25],
                    [0.4, 0.5], [0.6, 0.5], [0.6, 0.75], [0.8, 0.75],
                    [0.8, 1], [1, 1], [1, 0]
                ], baseStyle);
                break;

            case 1: // Nested squares
                drawUV([[0.05, 0.05], [0.95, 0.05], [0.95, 0.95], [0.05, 0.95]], baseStyle);
                if (!filled) {
                    drawUV([[0.3, 0.3], [0.7, 0.3], [0.7, 0.7], [0.3, 0.7]], 'filled');
                } else {
                    drawUV([[0.4, 0.4], [0.6, 0.4], [0.6, 0.6], [0.4, 0.6]], 'opaque-outline');
                }
                break;

            case 2: // Triangle with internal lines
                drawUV([[0.1, 0], [0.9, 0], [0.5, 0.9]], baseStyle);
                if (!filled) {
                    drawUV([[0.3, 0.2], [0.7, 0.2]], 'line');
                    drawUV([[0.4, 0.4], [0.6, 0.4]], 'line');
                    drawUV([[0.45, 0.6], [0.55, 0.6]], 'line');
                }
                break;

            case 3: // Spiral key / labyrinth
                if (filled) {
                    drawUV([
                        [0, 0], [0.8, 0], [0.8, 0.8], [0.2, 0.8],
                        [0.2, 0.4], [0.6, 0.4], [0.6, 0.6], [0.4, 0.6],
                        [0.4, 0.2], [1.0, 0.2], [1.0, 1.0], [0, 1.0]
                    ], 'filled');
                } else {
                    drawUV([
                        [0.1, 0.1], [0.9, 0.1], [0.9, 0.9], [0.3, 0.9], [0.3, 0.5], [0.7, 0.5]
                    ], 'line');
                }
                break;

            case 4: // Interlocked triangles
                drawUV([[0, 0], [0.5, 0.8], [1, 0]], baseStyle);
                drawUV([[0, 1], [0.5, 0.2], [1, 1]], filled ? 'opaque-outline' : 'filled');
                break;
        }
    }
};

export default aztecPatterns;
