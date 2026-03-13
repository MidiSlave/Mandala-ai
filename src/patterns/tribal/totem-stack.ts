// Totem Stack — 3 stacked faces
import type { PatternContext } from '../types';
import { dot, oval } from './helpers';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    // === Top face (y: 0.68–0.97) — circular eyes ===
    // Face frame
    drawUV([
        [0.15, 0.68], [0.85, 0.68], [0.85, 0.97], [0.15, 0.97],
    ], baseStyle);
    // Circular eyes (approximated as octagons)
    drawUV(oval(0.35, 0.82, 0.07, 0.05, 8), filled ? 'opaque-outline' : 'filled');
    drawUV(oval(0.65, 0.82, 0.07, 0.05, 8), filled ? 'opaque-outline' : 'filled');
    // Pupils
    drawUV(dot(0.35, 0.82, 0.02), baseStyle);
    drawUV(dot(0.65, 0.82, 0.02), baseStyle);
    // Nose
    drawUV([[0.5, 0.78], [0.53, 0.74], [0.47, 0.74]], filled ? baseStyle : 'filled');
    // Mouth
    drawUV([[0.38, 0.9], [0.62, 0.9], [0.62, 0.94], [0.38, 0.94]], filled ? baseStyle : 'filled');

    // === Zigzag separator (y: 0.63–0.68) ===
    drawUV([
        [0.15, 0.68], [0.25, 0.63], [0.35, 0.68], [0.45, 0.63],
        [0.55, 0.68], [0.65, 0.63], [0.75, 0.68], [0.85, 0.63],
        [0.85, 0.68], [0.15, 0.68],
    ], baseStyle);

    // === Middle face (y: 0.35–0.63) — diamond eyes ===
    // Face frame
    drawUV([
        [0.15, 0.35], [0.85, 0.35], [0.85, 0.63], [0.15, 0.63],
    ], baseStyle);
    // Diamond eyes
    drawUV(dot(0.35, 0.49, 0.06), filled ? 'opaque-outline' : 'filled');
    drawUV(dot(0.65, 0.49, 0.06), filled ? 'opaque-outline' : 'filled');
    // Inner pupils
    drawUV(dot(0.35, 0.49, 0.02), baseStyle);
    drawUV(dot(0.65, 0.49, 0.02), baseStyle);
    // Wide nose
    drawUV([[0.46, 0.46], [0.54, 0.46], [0.52, 0.42], [0.48, 0.42]], filled ? baseStyle : 'filled');
    // Grimacing mouth
    drawUV([
        [0.32, 0.56], [0.40, 0.54], [0.50, 0.56],
        [0.60, 0.54], [0.68, 0.56],
        [0.60, 0.59], [0.50, 0.6], [0.40, 0.59],
    ], filled ? baseStyle : 'filled');

    // === Zigzag separator (y: 0.30–0.35) ===
    drawUV([
        [0.15, 0.35], [0.25, 0.30], [0.35, 0.35], [0.45, 0.30],
        [0.55, 0.35], [0.65, 0.30], [0.75, 0.35], [0.85, 0.30],
        [0.85, 0.35], [0.15, 0.35],
    ], baseStyle);

    // === Bottom face (y: 0.03–0.30) — slit eyes ===
    // Face frame
    drawUV([
        [0.15, 0.03], [0.85, 0.03], [0.85, 0.30], [0.15, 0.30],
    ], baseStyle);
    // Slit eyes — narrow horizontal shapes
    drawUV([
        [0.24, 0.18], [0.35, 0.16], [0.46, 0.18], [0.35, 0.20],
    ], filled ? 'opaque-outline' : 'filled');
    drawUV([
        [0.54, 0.18], [0.65, 0.16], [0.76, 0.18], [0.65, 0.20],
    ], filled ? 'opaque-outline' : 'filled');
    // Nose
    drawUV([[0.48, 0.15], [0.52, 0.15], [0.50, 0.10]], filled ? baseStyle : 'filled');
    // Mouth — wide thin slit
    drawUV([
        [0.3, 0.24], [0.7, 0.24], [0.7, 0.27], [0.3, 0.27],
    ], filled ? baseStyle : 'filled');

    if (!filled) {
        // Extra detail: vertical filled bars on side of each face (ears/decorations)
        drawUV([[0.17 - 0.015, 0.7], [0.17 + 0.015, 0.7], [0.17 + 0.015, 0.95], [0.17 - 0.015, 0.95]], baseStyle);
        drawUV([[0.83 - 0.015, 0.7], [0.83 + 0.015, 0.7], [0.83 + 0.015, 0.95], [0.83 - 0.015, 0.95]], baseStyle);
        drawUV([[0.17 - 0.015, 0.37], [0.17 + 0.015, 0.37], [0.17 + 0.015, 0.61], [0.17 - 0.015, 0.61]], baseStyle);
        drawUV([[0.83 - 0.015, 0.37], [0.83 + 0.015, 0.37], [0.83 + 0.015, 0.61], [0.83 - 0.015, 0.61]], baseStyle);
        drawUV([[0.17 - 0.015, 0.05], [0.17 + 0.015, 0.05], [0.17 + 0.015, 0.28], [0.17 - 0.015, 0.28]], baseStyle);
        drawUV([[0.83 - 0.015, 0.05], [0.83 + 0.015, 0.05], [0.83 + 0.015, 0.28], [0.83 - 0.015, 0.28]], baseStyle);
    }
}
