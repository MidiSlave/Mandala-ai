// Stepped Ziggurat — terraced pyramid with bold horizontal steps
import type { PatternContext } from '../types';
import { filledRect } from './helpers';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    const detailStyle = filled ? 'opaque-outline' as const : 'filled' as const;

    // Main ziggurat silhouette — 6 terraces
    const steps: { left: number; right: number; bottom: number; top: number }[] = [
        { left: 0.02, right: 0.98, bottom: 0.00, top: 0.14 },
        { left: 0.10, right: 0.90, bottom: 0.14, top: 0.30 },
        { left: 0.18, right: 0.82, bottom: 0.30, top: 0.46 },
        { left: 0.26, right: 0.74, bottom: 0.46, top: 0.60 },
        { left: 0.34, right: 0.66, bottom: 0.60, top: 0.74 },
        { left: 0.40, right: 0.60, bottom: 0.74, top: 0.86 },
    ];

    for (let i = 0; i < steps.length; i++) {
        const s = steps[i];
        const style = i % 2 === 0 ? baseStyle : detailStyle;
        drawUV(filledRect(s.left, s.bottom, s.right, s.top), style);
    }

    // Crown / capstone on top
    drawUV([
        [0.44, 0.86], [0.56, 0.86],
        [0.50, 0.98],
    ], baseStyle);

    // Horizontal accent bands at each step transition
    for (let i = 0; i < steps.length; i++) {
        const s = steps[i];
        drawUV(filledRect(s.left - 0.01, s.top - 0.02, s.right + 0.01, s.top), 'filled');
    }

    // Vertical center pillar accent
    drawUV(filledRect(0.47, 0.0, 0.53, 0.86), filled ? 'opaque-outline' : 'filled');

    // Decorative elements on alternating steps
    if (filled) {
        // Diamond cutouts on even steps
        for (let i = 0; i < steps.length; i += 2) {
            const s = steps[i];
            const midV = (s.bottom + s.top) / 2;
            // Left diamond
            const leftU = (s.left + 0.47) / 2;
            drawUV([
                [leftU, midV - 0.04], [leftU + 0.04, midV],
                [leftU, midV + 0.04], [leftU - 0.04, midV],
            ], 'opaque-outline');
            // Right diamond
            const rightU = (0.53 + s.right) / 2;
            drawUV([
                [rightU, midV - 0.04], [rightU + 0.04, midV],
                [rightU, midV + 0.04], [rightU - 0.04, midV],
            ], 'opaque-outline');
        }
    } else {
        // Filled diamond accents in outline mode
        for (let i = 0; i < steps.length; i += 2) {
            const s = steps[i];
            const midV = (s.bottom + s.top) / 2;
            const leftU = (s.left + 0.47) / 2;
            drawUV([
                [leftU, midV - 0.04], [leftU + 0.04, midV],
                [leftU, midV + 0.04], [leftU - 0.04, midV],
            ], 'filled');
            const rightU = (0.53 + s.right) / 2;
            drawUV([
                [rightU, midV - 0.04], [rightU + 0.04, midV],
                [rightU, midV + 0.04], [rightU - 0.04, midV],
            ], 'filled');
        }
    }

    // Small square dots at step corners
    const dotSize = 0.02;
    for (const s of steps) {
        drawUV(filledRect(s.left, s.bottom, s.left + dotSize * 2, s.bottom + dotSize * 2), 'filled');
        drawUV(filledRect(s.right - dotSize * 2, s.bottom, s.right, s.bottom + dotSize * 2), 'filled');
    }
}
