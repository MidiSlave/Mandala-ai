// Jaguar eye — oval eye with diamond pupil and decorative marks
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    // Upper eyelid curve
    drawUV([
        [0.02, 0.50],
        [0.10, 0.38], [0.20, 0.28], [0.32, 0.22],
        [0.50, 0.18],
        [0.68, 0.22], [0.80, 0.28], [0.90, 0.38],
        [0.98, 0.50],
        [0.90, 0.62], [0.80, 0.72], [0.68, 0.78],
        [0.50, 0.82],
        [0.32, 0.78], [0.20, 0.72], [0.10, 0.62],
    ], baseStyle);

    // Iris ring (polygon approximation of ellipse)
    const irisPoints: [number, number][] = [];
    for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        irisPoints.push([0.50 + 0.16 * Math.cos(angle), 0.50 + 0.18 * Math.sin(angle)]);
    }
    drawUV(irisPoints, filled ? 'opaque-outline' : 'outline');

    // Diamond pupil
    drawUV([
        [0.50, 0.36],
        [0.60, 0.50],
        [0.50, 0.64],
        [0.40, 0.50],
    ], filled ? baseStyle : 'filled');

    // Inner pupil highlight (tiny cutout)
    if (filled) {
        drawUV([
            [0.50, 0.44], [0.54, 0.50],
            [0.50, 0.56], [0.46, 0.50],
        ], 'opaque-outline');
    }

    // Decorative brow arches (double line for thickness)
    drawUV([
        [0.10, 0.14], [0.25, 0.08], [0.40, 0.04],
        [0.60, 0.04], [0.75, 0.08], [0.90, 0.14],
    ], 'line');
    drawUV([
        [0.12, 0.10], [0.27, 0.05], [0.42, 0.01],
        [0.58, 0.01], [0.73, 0.05], [0.88, 0.10],
    ], 'line');

    // Stepped brow marks (small filled triangles along brow)
    drawUV([[0.22, 0.06], [0.26, 0.12], [0.18, 0.12]], 'filled');
    drawUV([[0.50, 0.02], [0.54, 0.08], [0.46, 0.08]], 'filled');
    drawUV([[0.78, 0.06], [0.82, 0.12], [0.74, 0.12]], 'filled');

    // Cheek marks below eye (vertical lines with end dots)
    drawUV([[0.25, 0.86], [0.25, 0.96]], 'line');
    drawUV([[0.40, 0.86], [0.40, 0.98]], 'line');
    drawUV([[0.50, 0.86], [0.50, 0.98]], 'line');
    drawUV([[0.60, 0.86], [0.60, 0.98]], 'line');
    drawUV([[0.75, 0.86], [0.75, 0.96]], 'line');

    // Cheek dots (symmetric)
    const cheekDot = 0.025;
    const cheekPositions: [number, number][] = [
        [0.15, 0.92], [0.85, 0.92],
        [0.25, 0.97], [0.75, 0.97],
    ];
    for (const [cu, cv] of cheekPositions) {
        drawUV([
            [cu - cheekDot, cv - cheekDot], [cu + cheekDot, cv - cheekDot],
            [cu + cheekDot, cv + cheekDot], [cu - cheekDot, cv + cheekDot],
        ], 'filled');
    }

    // Corner accents (wing marks at eye tips)
    drawUV([[0.0, 0.48], [0.06, 0.42], [0.06, 0.58]], 'filled');
    drawUV([[1.0, 0.48], [0.94, 0.42], [0.94, 0.58]], 'filled');
}
