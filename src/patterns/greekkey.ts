import type { PatternSet, PatternContext } from './types';

const greekkeyPatterns: PatternSet = {
    name: 'Greek Key / Meander',
    count: 5,
    draw: (type: number, { drawUV, filled, baseStyle }: PatternContext) => {
        switch (type) {
            case 0: // Classic Greek key
                drawUV([
                    [0, 0.8], [0.8, 0.8], [0.8, 0.2], [0.4, 0.2],
                    [0.4, 0.6], [0.6, 0.6], [0.6, 0.4], [0, 0.4]
                ], 'line');
                // Border lines
                drawUV([[0, 0], [1, 0]], 'line');
                drawUV([[0, 1], [1, 1]], 'line');
                break;

            case 1: // Spiral meander
                drawUV([
                    [0, 0.5], [0.9, 0.5], [0.9, 0.1], [0.1, 0.1],
                    [0.1, 0.9], [0.7, 0.9], [0.7, 0.3], [0.3, 0.3],
                    [0.3, 0.7], [0.5, 0.7]
                ], 'line');
                break;

            case 2: // Interlocking T / labyrinth
                if (filled) {
                    drawUV([
                        [0, 0], [0.6, 0], [0.6, 0.5], [0.3, 0.5],
                        [0.3, 1], [0, 1]
                    ], 'filled');
                } else {
                    drawUV([
                        [0, 0], [0.6, 0], [0.6, 0.5], [0.3, 0.5],
                        [0.3, 1], [0, 1]
                    ], 'outline');
                    drawUV([[0.6, 0.5], [1, 0.5]], 'line');
                }
                break;

            case 3: // Wave key / running scroll
                drawUV([
                    [0, 0.3], [0.15, 0.1], [0.35, 0.1], [0.5, 0.3],
                    [0.5, 0.7], [0.65, 0.9], [0.85, 0.9], [1, 0.7]
                ], 'line');
                drawUV([
                    [0, 0.7], [0.15, 0.9], [0.35, 0.9], [0.5, 0.7]
                ], 'line');
                break;

            case 4: // Battlement / crenellation
                if (filled) {
                    drawUV([
                        [0, 0], [0, 0.6], [0.2, 0.6], [0.2, 1],
                        [0.4, 1], [0.4, 0.6], [0.6, 0.6], [0.6, 1],
                        [0.8, 1], [0.8, 0.6], [1, 0.6], [1, 0]
                    ], baseStyle);
                } else {
                    drawUV([
                        [0, 0], [0, 0.6], [0.2, 0.6], [0.2, 1],
                        [0.4, 1], [0.4, 0.6], [0.6, 0.6], [0.6, 1],
                        [0.8, 1], [0.8, 0.6], [1, 0.6], [1, 0]
                    ], 'outline');
                }
                break;
        }
    }
};

export default greekkeyPatterns;
