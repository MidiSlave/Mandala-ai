import type { PatternSet, PatternContext } from './types';

const aztecPatterns: PatternSet = {
    name: 'Aztec / Mayan',
    count: 5,
    draw: (type: number, { drawUV, filled, baseStyle }: PatternContext) => {
        switch (type) {
            case 0: { // Stepped pyramid — symmetric zigzag steps with internal details
                // Left half of pyramid steps (mirrored)
                drawUV([
                    [0.08, 0.0], [0.92, 0.0],   // base
                    [0.92, 0.12], [0.78, 0.12],  // first step right
                    [0.78, 0.28], [0.68, 0.28],  // second step right
                    [0.68, 0.45], [0.58, 0.45],  // third step right
                    [0.58, 0.62], [0.54, 0.62],  // fourth step right
                    [0.54, 0.82], [0.46, 0.82],  // peak
                    [0.46, 0.62], [0.42, 0.62],  // fourth step left
                    [0.42, 0.45], [0.32, 0.45],  // third step left
                    [0.32, 0.28], [0.22, 0.28],  // second step left
                    [0.22, 0.12], [0.08, 0.12],  // first step left
                ], baseStyle);

                // Temple top / capstone
                drawUV([
                    [0.44, 0.82], [0.56, 0.82],
                    [0.56, 0.92], [0.44, 0.92],
                ], filled ? 'opaque-outline' : 'outline');

                // Horizontal decorative lines on steps
                drawUV([[0.12, 0.06], [0.88, 0.06]], 'line');
                drawUV([[0.25, 0.2], [0.75, 0.2]], 'line');
                drawUV([[0.35, 0.36], [0.65, 0.36]], 'line');
                drawUV([[0.44, 0.53], [0.56, 0.53]], 'line');

                if (filled) {
                    // Cut out doorway at base center
                    drawUV([
                        [0.42, 0.0], [0.58, 0.0],
                        [0.58, 0.1], [0.42, 0.1],
                    ], 'opaque-outline');
                    // Cut out windows on second step
                    drawUV([
                        [0.3, 0.3], [0.38, 0.3],
                        [0.38, 0.42], [0.3, 0.42],
                    ], 'opaque-outline');
                    drawUV([
                        [0.62, 0.3], [0.7, 0.3],
                        [0.7, 0.42], [0.62, 0.42],
                    ], 'opaque-outline');
                }
                break;
            }

            case 1: { // Sun disk — concentric rings with triangular rays
                // Outer sun rays (8 triangular rays around the edge)
                const numRays = 8;
                for (let i = 0; i < numRays; i++) {
                    const angle = (i / numRays) * Math.PI * 2;
                    const nextAngle = ((i + 0.5) / numRays) * Math.PI * 2;
                    const prevAngle = ((i - 0.5) / numRays) * Math.PI * 2;
                    // Ray tip
                    const tipU = 0.5 + 0.46 * Math.cos(angle);
                    const tipV = 0.5 + 0.46 * Math.sin(angle);
                    // Ray base points
                    const baseU1 = 0.5 + 0.28 * Math.cos(prevAngle);
                    const baseV1 = 0.5 + 0.28 * Math.sin(prevAngle);
                    const baseU2 = 0.5 + 0.28 * Math.cos(nextAngle);
                    const baseV2 = 0.5 + 0.28 * Math.sin(nextAngle);
                    drawUV([
                        [tipU, tipV],
                        [baseU1, baseV1],
                        [baseU2, baseV2],
                    ], baseStyle);
                }

                // Outer ring
                const outerRing: [number, number][] = [];
                const innerRingOuter: [number, number][] = [];
                for (let i = 0; i < 16; i++) {
                    const angle = (i / 16) * Math.PI * 2;
                    outerRing.push([0.5 + 0.3 * Math.cos(angle), 0.5 + 0.3 * Math.sin(angle)]);
                    innerRingOuter.push([0.5 + 0.22 * Math.cos(angle), 0.5 + 0.22 * Math.sin(angle)]);
                }
                drawUV(outerRing, filled ? 'opaque-outline' : 'outline');
                drawUV(innerRingOuter, filled ? baseStyle : 'outline');

                // Center filled circle
                const center: [number, number][] = [];
                for (let i = 0; i < 12; i++) {
                    const angle = (i / 12) * Math.PI * 2;
                    center.push([0.5 + 0.1 * Math.cos(angle), 0.5 + 0.1 * Math.sin(angle)]);
                }
                drawUV(center, filled ? 'opaque-outline' : 'filled');

                // Inner cross lines for detail
                drawUV([[0.5, 0.3], [0.5, 0.7]], 'line');
                drawUV([[0.3, 0.5], [0.7, 0.5]], 'line');
                drawUV([[0.36, 0.36], [0.64, 0.64]], 'line');
                drawUV([[0.64, 0.36], [0.36, 0.64]], 'line');
                break;
            }

            case 2: { // Jaguar eye — oval eye with diamond pupil and decorative marks
                // Outer eye shape (almond/oval)
                drawUV([
                    [0.02, 0.5],
                    [0.12, 0.35],
                    [0.25, 0.25],
                    [0.4, 0.2],
                    [0.5, 0.18],
                    [0.6, 0.2],
                    [0.75, 0.25],
                    [0.88, 0.35],
                    [0.98, 0.5],
                    [0.88, 0.65],
                    [0.75, 0.75],
                    [0.6, 0.8],
                    [0.5, 0.82],
                    [0.4, 0.8],
                    [0.25, 0.75],
                    [0.12, 0.65],
                ], baseStyle);

                // Iris circle
                const iris: [number, number][] = [];
                for (let i = 0; i < 12; i++) {
                    const angle = (i / 12) * Math.PI * 2;
                    iris.push([0.5 + 0.15 * Math.cos(angle), 0.5 + 0.18 * Math.sin(angle)]);
                }
                drawUV(iris, filled ? 'opaque-outline' : 'outline');

                // Diamond pupil
                drawUV([
                    [0.5, 0.38],
                    [0.58, 0.5],
                    [0.5, 0.62],
                    [0.42, 0.5],
                ], filled ? baseStyle : 'filled');

                // Brow lines above eye (decorative)
                drawUV([
                    [0.15, 0.12], [0.3, 0.08], [0.5, 0.06],
                    [0.7, 0.08], [0.85, 0.12],
                ], 'line');
                drawUV([
                    [0.2, 0.04], [0.4, 0.0], [0.6, 0.0], [0.8, 0.04],
                ], 'line');

                // Cheek marks below eye
                drawUV([[0.3, 0.88], [0.3, 0.96]], 'line');
                drawUV([[0.5, 0.88], [0.5, 0.98]], 'line');
                drawUV([[0.7, 0.88], [0.7, 0.96]], 'line');
                // Cheek dots
                drawUV([
                    [0.18, 0.9], [0.22, 0.9],
                    [0.22, 0.94], [0.18, 0.94],
                ], baseStyle);
                drawUV([
                    [0.78, 0.9], [0.82, 0.9],
                    [0.82, 0.94], [0.78, 0.94],
                ], baseStyle);
                break;
            }

            case 3: { // Serpent coil — S-curved body with scale segments
                // Upper S-curve body
                drawUV([
                    [0.1, 0.0],
                    [0.25, 0.0],
                    [0.4, 0.08],
                    [0.55, 0.18],
                    [0.7, 0.22],
                    [0.85, 0.2],
                    [0.95, 0.15],
                    [0.95, 0.28],
                    [0.85, 0.35],
                    [0.7, 0.38],
                    [0.55, 0.34],
                    [0.4, 0.24],
                    [0.25, 0.16],
                    [0.1, 0.14],
                ], baseStyle);

                // Middle connector
                drawUV([
                    [0.1, 0.14],
                    [0.05, 0.22],
                    [0.05, 0.38],
                    [0.1, 0.46],
                    [0.1, 0.52],
                    [0.05, 0.6],
                    [0.05, 0.76],
                    [0.1, 0.84],
                ], 'line');

                // Lower S-curve body (reversed)
                drawUV([
                    [0.1, 0.84],
                    [0.25, 0.84],
                    [0.4, 0.76],
                    [0.55, 0.66],
                    [0.7, 0.62],
                    [0.85, 0.64],
                    [0.95, 0.7],
                    [0.95, 0.84],
                    [0.85, 0.9],
                    [0.7, 0.92],
                    [0.55, 0.88],
                    [0.4, 0.92],
                    [0.25, 0.98],
                    [0.1, 1.0],
                ], baseStyle);

                // Scale markings on upper body
                for (let i = 0; i < 5; i++) {
                    const t = 0.2 + i * 0.15;
                    const u = 0.2 + t * 0.6;
                    const v = 0.06 + 0.12 * Math.sin(t * Math.PI);
                    drawUV([
                        [u, v + 0.02],
                        [u + 0.04, v + 0.06],
                        [u + 0.08, v + 0.02],
                    ], filled ? 'opaque-outline' : 'outline');
                }

                // Scale markings on lower body
                for (let i = 0; i < 5; i++) {
                    const t = 0.2 + i * 0.15;
                    const u = 0.2 + t * 0.6;
                    const v = 0.68 + 0.1 * Math.sin(t * Math.PI);
                    drawUV([
                        [u, v + 0.02],
                        [u + 0.04, v + 0.08],
                        [u + 0.08, v + 0.02],
                    ], filled ? 'opaque-outline' : 'outline');
                }

                // Serpent head (top-left)
                drawUV([
                    [0.02, 0.0], [0.1, 0.0],
                    [0.12, 0.06], [0.08, 0.1],
                    [0.0, 0.08],
                ], baseStyle);
                // Eye dot on head
                drawUV([
                    [0.05, 0.02], [0.08, 0.02],
                    [0.08, 0.05], [0.05, 0.05],
                ], filled ? 'opaque-outline' : 'filled');

                // Middle body fill section
                drawUV([
                    [0.1, 0.38], [0.25, 0.42],
                    [0.4, 0.48], [0.55, 0.52],
                    [0.7, 0.48], [0.85, 0.5],
                    [0.95, 0.55], [0.95, 0.62],
                    [0.85, 0.64], [0.7, 0.62],
                    [0.55, 0.58], [0.4, 0.56],
                    [0.25, 0.58], [0.1, 0.52],
                ], baseStyle);
                break;
            }

            case 4: { // Temple glyph — abstract face/mask with geometric features
                // Outer face rectangle
                drawUV([
                    [0.12, 0.05], [0.88, 0.05],
                    [0.88, 0.92], [0.12, 0.92],
                ], baseStyle);

                // Cut out / inner face area
                if (filled) {
                    drawUV([
                        [0.2, 0.12], [0.8, 0.12],
                        [0.8, 0.85], [0.2, 0.85],
                    ], 'opaque-outline');
                }

                // Left eye (rectangular with inner detail)
                drawUV([
                    [0.22, 0.2], [0.42, 0.2],
                    [0.42, 0.38], [0.22, 0.38],
                ], baseStyle);
                // Left pupil
                drawUV([
                    [0.28, 0.25], [0.36, 0.25],
                    [0.36, 0.33], [0.28, 0.33],
                ], filled ? 'opaque-outline' : 'filled');

                // Right eye (rectangular with inner detail)
                drawUV([
                    [0.58, 0.2], [0.78, 0.2],
                    [0.78, 0.38], [0.58, 0.38],
                ], baseStyle);
                // Right pupil
                drawUV([
                    [0.64, 0.25], [0.72, 0.25],
                    [0.72, 0.33], [0.64, 0.33],
                ], filled ? 'opaque-outline' : 'filled');

                // Triangular nose
                drawUV([
                    [0.5, 0.32],
                    [0.56, 0.52],
                    [0.44, 0.52],
                ], baseStyle);
                // Nose cutout
                if (filled) {
                    drawUV([
                        [0.5, 0.38],
                        [0.53, 0.48],
                        [0.47, 0.48],
                    ], 'opaque-outline');
                }

                // Step-pattern mouth
                drawUV([
                    [0.25, 0.58], [0.35, 0.58],
                    [0.35, 0.64], [0.42, 0.64],
                    [0.42, 0.7], [0.58, 0.7],
                    [0.58, 0.64], [0.65, 0.64],
                    [0.65, 0.58], [0.75, 0.58],
                    [0.75, 0.76], [0.25, 0.76],
                ], baseStyle);
                if (filled) {
                    // Teeth gap cutouts
                    drawUV([
                        [0.35, 0.7], [0.42, 0.7],
                        [0.42, 0.74], [0.35, 0.74],
                    ], 'opaque-outline');
                    drawUV([
                        [0.58, 0.7], [0.65, 0.7],
                        [0.65, 0.74], [0.58, 0.74],
                    ], 'opaque-outline');
                }

                // Forehead band
                drawUV([
                    [0.12, 0.05], [0.88, 0.05],
                    [0.88, 0.14], [0.12, 0.14],
                ], baseStyle);
                // Forehead glyphs
                drawUV([[0.3, 0.07], [0.35, 0.12], [0.25, 0.12]], filled ? 'opaque-outline' : 'outline');
                drawUV([[0.5, 0.07], [0.55, 0.12], [0.45, 0.12]], filled ? 'opaque-outline' : 'outline');
                drawUV([[0.7, 0.07], [0.75, 0.12], [0.65, 0.12]], filled ? 'opaque-outline' : 'outline');

                // Ear decorations
                drawUV([
                    [0.05, 0.25], [0.12, 0.2],
                    [0.12, 0.4], [0.05, 0.35],
                ], baseStyle);
                drawUV([
                    [0.88, 0.2], [0.95, 0.25],
                    [0.95, 0.35], [0.88, 0.4],
                ], baseStyle);

                // Chin decoration
                drawUV([[0.4, 0.92], [0.5, 0.98], [0.6, 0.92]], baseStyle);
                break;
            }
        }
    }
};

export default aztecPatterns;
