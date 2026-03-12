import type { PatternSet, PatternContext } from './types';

const tribalPatterns: PatternSet = {
    name: 'Tribal / Ethnic',
    count: 5,
    draw: (type: number, { drawUV, filled, baseStyle }: PatternContext) => {
        switch (type) {
            case 0: // Spear / elongated diamond
                drawUV([
                    [0.5, 0], [0.7, 0.5], [0.5, 1], [0.3, 0.5]
                ], baseStyle);
                if (!filled) {
                    drawUV([[0.5, 0.1], [0.5, 0.9]], 'line');
                }
                break;

            case 1: // Concentric rectangles
                if (filled) {
                    drawUV([[0.05, 0.05], [0.95, 0.05], [0.95, 0.95], [0.05, 0.95]], 'filled');
                    drawUV([[0.2, 0.2], [0.8, 0.2], [0.8, 0.8], [0.2, 0.8]], 'opaque-outline');
                    drawUV([[0.35, 0.35], [0.65, 0.35], [0.65, 0.65], [0.35, 0.65]], 'filled');
                } else {
                    drawUV([[0.05, 0.05], [0.95, 0.05], [0.95, 0.95], [0.05, 0.95]], 'line');
                    drawUV([[0.2, 0.2], [0.8, 0.2], [0.8, 0.8], [0.2, 0.8]], 'line');
                    drawUV([[0.35, 0.35], [0.65, 0.35], [0.65, 0.65], [0.35, 0.65]], 'line');
                }
                break;

            case 2: // Hourglass / bowtie
                if (filled) {
                    drawUV([[0.1, 0], [0.9, 0], [0.5, 0.5]], 'filled');
                    drawUV([[0.1, 1], [0.9, 1], [0.5, 0.5]], 'opaque-outline');
                } else {
                    drawUV([[0.1, 0], [0.9, 0], [0.5, 0.5]], 'outline');
                    drawUV([[0.1, 1], [0.9, 1], [0.5, 0.5]], 'outline');
                }
                break;

            case 3: // Zigzag band
                drawUV([
                    [0, 0.7], [0.25, 0.95], [0.5, 0.7], [0.75, 0.95], [1, 0.7],
                    [1, 0.3], [0.75, 0.05], [0.5, 0.3], [0.25, 0.05], [0, 0.3]
                ], baseStyle);
                break;

            case 4: // Shield / kite
                drawUV([
                    [0.5, 0], [0.85, 0.35], [0.5, 1], [0.15, 0.35]
                ], baseStyle);
                if (!filled) {
                    drawUV([[0.2, 0.35], [0.8, 0.35]], 'line');
                    drawUV([[0.5, 0.05], [0.5, 0.9]], 'line');
                }
                break;
        }
    }
};

export default tribalPatterns;
