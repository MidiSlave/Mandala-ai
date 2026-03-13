import type { PatternSet, PatternContext } from './types';

const aztecPatterns: PatternSet = {
    name: 'Aztec / Mayan',
    count: 5,
    draw: (type: number, { drawUV, filled, baseStyle }: PatternContext) => {
        switch (type) {
            case 0: { // Stepped pyramid — centered symmetric zigzag steps with internal details
                // Main pyramid body with stepped outline
                drawUV([
                    [0.05, 0.0], [0.95, 0.0],    // base
                    [0.95, 0.15], [0.80, 0.15],   // step 1 right
                    [0.80, 0.30], [0.70, 0.30],   // step 2 right
                    [0.70, 0.48], [0.62, 0.48],   // step 3 right
                    [0.62, 0.65], [0.56, 0.65],   // step 4 right
                    [0.56, 0.80], [0.44, 0.80],   // peak plateau
                    [0.44, 0.65], [0.38, 0.65],   // step 4 left
                    [0.38, 0.48], [0.30, 0.48],   // step 3 left
                    [0.30, 0.30], [0.20, 0.30],   // step 2 left
                    [0.20, 0.15], [0.05, 0.15],   // step 1 left
                ], baseStyle);

                // Temple capstone on top
                drawUV([
                    [0.42, 0.80], [0.58, 0.80],
                    [0.58, 0.92], [0.42, 0.92],
                ], filled ? 'opaque-outline' : 'outline');

                // Capstone inner diamond
                drawUV([
                    [0.50, 0.82], [0.55, 0.86],
                    [0.50, 0.90], [0.45, 0.86],
                ], filled ? baseStyle : 'filled');

                // Horizontal step accent lines
                drawUV([[0.08, 0.07], [0.92, 0.07]], 'line');
                drawUV([[0.23, 0.22], [0.77, 0.22]], 'line');
                drawUV([[0.33, 0.39], [0.67, 0.39]], 'line');
                drawUV([[0.40, 0.56], [0.60, 0.56]], 'line');
                drawUV([[0.46, 0.72], [0.54, 0.72]], 'line');

                // Vertical center spine
                drawUV([[0.50, 0.0], [0.50, 0.80]], 'line');

                if (filled) {
                    // Doorway cutout at base center
                    drawUV([
                        [0.40, 0.0], [0.60, 0.0],
                        [0.60, 0.12], [0.40, 0.12],
                    ], 'opaque-outline');
                    // Window cutouts on step 2
                    drawUV([
                        [0.24, 0.32], [0.32, 0.32],
                        [0.32, 0.44], [0.24, 0.44],
                    ], 'opaque-outline');
                    drawUV([
                        [0.68, 0.32], [0.76, 0.32],
                        [0.76, 0.44], [0.68, 0.44],
                    ], 'opaque-outline');
                    // Small diamond cutouts on step 1
                    drawUV([
                        [0.14, 0.04], [0.18, 0.08],
                        [0.14, 0.12], [0.10, 0.08],
                    ], 'opaque-outline');
                    drawUV([
                        [0.86, 0.04], [0.90, 0.08],
                        [0.86, 0.12], [0.82, 0.08],
                    ], 'opaque-outline');
                } else {
                    // In outline mode, add filled accent shapes for visibility
                    drawUV([
                        [0.14, 0.04], [0.18, 0.08],
                        [0.14, 0.12], [0.10, 0.08],
                    ], 'filled');
                    drawUV([
                        [0.86, 0.04], [0.90, 0.08],
                        [0.86, 0.12], [0.82, 0.08],
                    ], 'filled');
                    // Filled squares at step corners
                    drawUV([
                        [0.24, 0.32], [0.32, 0.32],
                        [0.32, 0.44], [0.24, 0.44],
                    ], 'filled');
                    drawUV([
                        [0.68, 0.32], [0.76, 0.32],
                        [0.76, 0.44], [0.68, 0.44],
                    ], 'filled');
                    // Filled doorway block at base
                    drawUV([
                        [0.40, 0.0], [0.60, 0.0],
                        [0.60, 0.12], [0.40, 0.12],
                    ], 'filled');
                    // Step fill bands for outline visibility
                    drawUV([
                        [0.34, 0.50], [0.66, 0.50],
                        [0.66, 0.56], [0.34, 0.56],
                    ], 'filled');
                }

                // Stair-edge dots (small filled squares on each step edge)
                const dotSize = 0.025;
                const stepEdges: [number, number][] = [
                    [0.80, 0.15], [0.20, 0.15],
                    [0.70, 0.30], [0.30, 0.30],
                    [0.62, 0.48], [0.38, 0.48],
                ];
                for (const [su, sv] of stepEdges) {
                    drawUV([
                        [su - dotSize, sv - dotSize], [su + dotSize, sv - dotSize],
                        [su + dotSize, sv + dotSize], [su - dotSize, sv + dotSize],
                    ], 'filled');
                }
                break;
            }

            case 1: { // Sun disk — concentric rings with radiating triangular rays
                const cx = 0.5, cy = 0.5;

                // Outer ray ring: 10 triangular rays
                const numRays = 10;
                for (let i = 0; i < numRays; i++) {
                    const angle = (i / numRays) * Math.PI * 2;
                    const halfAngle = (0.3 / numRays) * Math.PI * 2;
                    const tipU = cx + 0.47 * Math.cos(angle);
                    const tipV = cy + 0.47 * Math.sin(angle);
                    const baseU1 = cx + 0.30 * Math.cos(angle - halfAngle);
                    const baseV1 = cy + 0.30 * Math.sin(angle - halfAngle);
                    const baseU2 = cx + 0.30 * Math.cos(angle + halfAngle);
                    const baseV2 = cy + 0.30 * Math.sin(angle + halfAngle);
                    drawUV([
                        [tipU, tipV],
                        [baseU1, baseV1],
                        [baseU2, baseV2],
                    ], baseStyle);
                }

                // Outer ring band (ring between r=0.26 and r=0.32)
                const outerBandOuter: [number, number][] = [];
                const outerBandInner: [number, number][] = [];
                const segments = 20;
                for (let i = 0; i < segments; i++) {
                    const angle = (i / segments) * Math.PI * 2;
                    outerBandOuter.push([cx + 0.32 * Math.cos(angle), cy + 0.32 * Math.sin(angle)]);
                    outerBandInner.push([cx + 0.26 * Math.cos(angle), cy + 0.26 * Math.sin(angle)]);
                }
                drawUV(outerBandOuter, filled ? 'opaque-outline' : 'outline');
                drawUV(outerBandInner, filled ? baseStyle : 'outline');

                // Middle ring (r=0.18)
                const middleRing: [number, number][] = [];
                for (let i = 0; i < 16; i++) {
                    const angle = (i / 16) * Math.PI * 2;
                    middleRing.push([cx + 0.18 * Math.cos(angle), cy + 0.18 * Math.sin(angle)]);
                }
                drawUV(middleRing, filled ? 'opaque-outline' : 'outline');

                // Central filled circle (r=0.10)
                const centerCircle: [number, number][] = [];
                for (let i = 0; i < 12; i++) {
                    const angle = (i / 12) * Math.PI * 2;
                    centerCircle.push([cx + 0.10 * Math.cos(angle), cy + 0.10 * Math.sin(angle)]);
                }
                drawUV(centerCircle, filled ? 'opaque-outline' : 'filled');

                // Inner cross detail (4-pointed star through center)
                drawUV([[cx, cy - 0.18], [cx, cy + 0.18]], 'line');
                drawUV([[cx - 0.18, cy], [cx + 0.18, cy]], 'line');

                // Diagonal accent lines between rings
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    const u1 = cx + 0.19 * Math.cos(angle);
                    const v1 = cy + 0.19 * Math.sin(angle);
                    const u2 = cx + 0.25 * Math.cos(angle);
                    const v2 = cy + 0.25 * Math.sin(angle);
                    drawUV([[u1, v1], [u2, v2]], 'line');
                }

                // Corner accent squares (fills corners that the circle doesn't reach)
                const cornerDots: [number, number][] = [
                    [0.06, 0.06], [0.94, 0.06], [0.06, 0.94], [0.94, 0.94]
                ];
                const cdot = 0.04;
                for (const [du, dv] of cornerDots) {
                    drawUV([
                        [du - cdot, dv - cdot], [du + cdot, dv - cdot],
                        [du + cdot, dv + cdot], [du - cdot, dv + cdot],
                    ], 'filled');
                }

                break;
            }

            case 2: { // Jaguar eye — oval eye with diamond pupil and decorative marks
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

                break;
            }

            case 3: { // Serpent coil — S-curved body with overlapping scale segments
                // Upper S-curve body (thick band)
                drawUV([
                    [0.08, 0.0], [0.22, 0.0],
                    [0.38, 0.06], [0.55, 0.14],
                    [0.72, 0.20], [0.88, 0.18],
                    [0.96, 0.12], [0.98, 0.20],
                    [0.96, 0.30], [0.88, 0.36],
                    [0.72, 0.38], [0.55, 0.34],
                    [0.38, 0.24], [0.22, 0.16],
                    [0.08, 0.14],
                ], baseStyle);

                // Middle connecting band (left side)
                drawUV([
                    [0.08, 0.14], [0.04, 0.20],
                    [0.02, 0.32], [0.02, 0.44],
                    [0.04, 0.52], [0.08, 0.54],
                    [0.16, 0.54], [0.16, 0.42],
                    [0.14, 0.32], [0.12, 0.22],
                ], baseStyle);

                // Lower S-curve body (reversed)
                drawUV([
                    [0.08, 0.54], [0.22, 0.56],
                    [0.38, 0.64], [0.55, 0.72],
                    [0.72, 0.76], [0.88, 0.74],
                    [0.96, 0.68], [0.98, 0.76],
                    [0.96, 0.86], [0.88, 0.92],
                    [0.72, 0.94], [0.55, 0.90],
                    [0.38, 0.96], [0.22, 1.0],
                    [0.08, 1.0], [0.08, 0.86],
                    [0.22, 0.86], [0.38, 0.80],
                    [0.55, 0.74], [0.55, 0.66],
                    [0.38, 0.58], [0.22, 0.54],
                ], baseStyle);

                // Serpent head (top-left, visible)
                drawUV([
                    [0.0, 0.0], [0.10, 0.0],
                    [0.14, 0.05], [0.12, 0.10],
                    [0.06, 0.12], [0.0, 0.08],
                ], baseStyle);
                // Eye on head
                drawUV([
                    [0.04, 0.03], [0.08, 0.03],
                    [0.08, 0.07], [0.04, 0.07],
                ], filled ? 'opaque-outline' : 'filled');

                // Scale marks along upper body
                for (let i = 0; i < 6; i++) {
                    const t = (i + 1) / 7;
                    const su = 0.15 + t * 0.70;
                    const sv = 0.04 + 0.18 * Math.sin(t * Math.PI);
                    const ss = 0.04;
                    drawUV([
                        [su, sv], [su + ss, sv + ss * 1.5],
                        [su + ss * 2, sv], [su + ss, sv - ss * 0.5],
                    ], filled ? 'opaque-outline' : 'filled');
                }

                // Scale marks along lower body
                for (let i = 0; i < 6; i++) {
                    const t = (i + 1) / 7;
                    const su = 0.15 + t * 0.70;
                    const sv = 0.58 + 0.20 * Math.sin(t * Math.PI);
                    const ss = 0.04;
                    drawUV([
                        [su, sv], [su + ss, sv + ss * 1.5],
                        [su + ss * 2, sv], [su + ss, sv - ss * 0.5],
                    ], filled ? 'opaque-outline' : 'filled');
                }

                // Center spine lines following the S-curve
                drawUV([
                    [0.08, 0.07], [0.30, 0.13], [0.55, 0.22],
                    [0.75, 0.27], [0.92, 0.24],
                ], 'line');
                drawUV([
                    [0.08, 0.48], [0.10, 0.38], [0.08, 0.28],
                ], 'line');
                drawUV([
                    [0.08, 0.70], [0.30, 0.68], [0.55, 0.78],
                    [0.75, 0.84], [0.92, 0.80],
                ], 'line');

                if (filled) {
                    // Cut channel between upper and lower curves
                    drawUV([
                        [0.20, 0.38], [0.50, 0.44],
                        [0.80, 0.48], [0.80, 0.52],
                        [0.50, 0.50], [0.20, 0.44],
                    ], 'opaque-outline');
                } else {
                    // In outline mode, add filled middle band for visual weight
                    drawUV([
                        [0.20, 0.40], [0.50, 0.44],
                        [0.80, 0.46], [0.80, 0.52],
                        [0.50, 0.50], [0.20, 0.46],
                    ], 'filled');
                    // Tail tip filled
                    drawUV([
                        [0.08, 0.90], [0.22, 0.92],
                        [0.22, 1.0], [0.08, 1.0],
                    ], 'filled');
                }

                break;
            }

            case 4: { // Temple glyph — abstract face/mask with geometric features
                // Outer face border (rectangular frame with stepped top)
                drawUV([
                    [0.10, 0.05], [0.35, 0.05],
                    [0.35, 0.0], [0.65, 0.0],
                    [0.65, 0.05], [0.90, 0.05],
                    [0.90, 0.95], [0.10, 0.95],
                ], baseStyle);

                if (filled) {
                    // Inner face cutout
                    drawUV([
                        [0.18, 0.12], [0.82, 0.12],
                        [0.82, 0.88], [0.18, 0.88],
                    ], 'opaque-outline');
                }

                // Left eye (stepped rectangle)
                drawUV([
                    [0.20, 0.18], [0.30, 0.18],
                    [0.32, 0.20], [0.40, 0.20],
                    [0.40, 0.38], [0.32, 0.38],
                    [0.30, 0.40], [0.20, 0.40],
                ], baseStyle);

                // Right eye (stepped rectangle, mirrored)
                drawUV([
                    [0.60, 0.20], [0.68, 0.20],
                    [0.70, 0.18], [0.80, 0.18],
                    [0.80, 0.40], [0.70, 0.40],
                    [0.68, 0.38], [0.60, 0.38],
                ], baseStyle);

                // Left pupil
                drawUV([
                    [0.26, 0.26], [0.34, 0.26],
                    [0.34, 0.34], [0.26, 0.34],
                ], filled ? 'opaque-outline' : 'filled');

                // Right pupil
                drawUV([
                    [0.66, 0.26], [0.74, 0.26],
                    [0.74, 0.34], [0.66, 0.34],
                ], filled ? 'opaque-outline' : 'filled');

                // Triangular nose
                drawUV([
                    [0.50, 0.34],
                    [0.58, 0.54],
                    [0.42, 0.54],
                ], baseStyle);
                if (filled) {
                    drawUV([
                        [0.50, 0.40],
                        [0.54, 0.50],
                        [0.46, 0.50],
                    ], 'opaque-outline');
                }
                // Nose bridge line
                drawUV([[0.50, 0.20], [0.50, 0.34]], 'line');

                // Step-pattern mouth
                drawUV([
                    [0.22, 0.60], [0.32, 0.60],
                    [0.32, 0.64], [0.40, 0.64],
                    [0.40, 0.68], [0.60, 0.68],
                    [0.60, 0.64], [0.68, 0.64],
                    [0.68, 0.60], [0.78, 0.60],
                    [0.78, 0.78], [0.22, 0.78],
                ], baseStyle);

                if (filled) {
                    // Teeth gaps
                    drawUV([
                        [0.30, 0.70], [0.38, 0.70],
                        [0.38, 0.76], [0.30, 0.76],
                    ], 'opaque-outline');
                    drawUV([
                        [0.46, 0.70], [0.54, 0.70],
                        [0.54, 0.76], [0.46, 0.76],
                    ], 'opaque-outline');
                    drawUV([
                        [0.62, 0.70], [0.70, 0.70],
                        [0.70, 0.76], [0.62, 0.76],
                    ], 'opaque-outline');
                }

                // Horizontal mouth accent
                drawUV([[0.26, 0.69], [0.74, 0.69]], 'line');

                // Forehead band with glyphs
                drawUV([
                    [0.10, 0.05], [0.90, 0.05],
                    [0.90, 0.14], [0.10, 0.14],
                ], baseStyle);
                // Forehead triangular glyphs
                drawUV([[0.25, 0.06], [0.30, 0.12], [0.20, 0.12]], filled ? 'opaque-outline' : 'outline');
                drawUV([[0.50, 0.06], [0.55, 0.12], [0.45, 0.12]], filled ? 'opaque-outline' : 'outline');
                drawUV([[0.75, 0.06], [0.80, 0.12], [0.70, 0.12]], filled ? 'opaque-outline' : 'outline');

                // Ear decorations (stepped shapes)
                drawUV([
                    [0.04, 0.22], [0.10, 0.18],
                    [0.10, 0.44], [0.04, 0.40],
                ], baseStyle);
                drawUV([
                    [0.90, 0.18], [0.96, 0.22],
                    [0.96, 0.40], [0.90, 0.44],
                ], baseStyle);

                // Ear inner dots
                drawUV([
                    [0.05, 0.28], [0.09, 0.28],
                    [0.09, 0.34], [0.05, 0.34],
                ], filled ? 'opaque-outline' : 'filled');
                drawUV([
                    [0.91, 0.28], [0.95, 0.28],
                    [0.95, 0.34], [0.91, 0.34],
                ], filled ? 'opaque-outline' : 'filled');

                // Chin pendant
                drawUV([
                    [0.40, 0.88], [0.50, 0.98],
                    [0.60, 0.88],
                ], baseStyle);
                // Chin dots
                drawUV([
                    [0.32, 0.90], [0.36, 0.90],
                    [0.36, 0.94], [0.32, 0.94],
                ], 'filled');
                drawUV([
                    [0.64, 0.90], [0.68, 0.90],
                    [0.68, 0.94], [0.64, 0.94],
                ], 'filled');

                // Cheek accent lines
                drawUV([[0.18, 0.46], [0.18, 0.56]], 'line');
                drawUV([[0.82, 0.46], [0.82, 0.56]], 'line');

                break;
            }
        }
    }
};

export default aztecPatterns;
