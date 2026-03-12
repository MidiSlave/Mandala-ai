import type { PatternSet, PatternContext } from './types';

const chevronPatterns: PatternSet = {
    name: 'Chevron / Herringbone',
    count: 5,
    draw: (type: number, { drawUV, filled, baseStyle }: PatternContext) => {
        switch (type) {
            case 0: // Single chevron — thick V band
                drawUV([
                    [0, 0.15], [0.5, 0.85], [1, 0.15],
                    [1, 0.35], [0.5, 0.65], [0, 0.35]
                ], baseStyle);
                break;

            case 1: // Double chevron — two nested V outlines
                drawUV([[0, 0.1], [0.5, 0.7], [1, 0.1]], 'line');
                drawUV([[0, 0.3], [0.5, 0.9], [1, 0.3]], 'line');
                break;

            case 2: // Herringbone — two diagonal parallelograms
                drawUV([
                    [0, 0], [0.5, 0.5], [0.5, 1], [0, 0.5]
                ], baseStyle);
                drawUV([
                    [0.5, 0.5], [1, 0], [1, 0.5], [0.5, 1]
                ], baseStyle);
                break;

            case 3: // Arrow / pointed chevron
                if (filled) {
                    drawUV([
                        [0, 0.2], [0.7, 0.5], [0, 0.8], [0.3, 0.5]
                    ], 'filled');
                } else {
                    drawUV([
                        [0, 0.2], [0.7, 0.5], [0, 0.8], [0.3, 0.5]
                    ], 'outline');
                    drawUV([[0.3, 0.5], [0.7, 0.5]], 'line');
                }
                break;

            case 4: // Stacked chevron bands — three thin V-lines
                drawUV([[0, 0.05], [0.5, 0.35], [1, 0.05]], 'line');
                drawUV([[0, 0.35], [0.5, 0.65], [1, 0.35]], 'line');
                drawUV([[0, 0.65], [0.5, 0.95], [1, 0.65]], 'line');
                break;
        }
    }
};

export default chevronPatterns;
