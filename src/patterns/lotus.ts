import type { PatternSet, PatternContext } from './types';

const lotusPatterns: PatternSet = {
    name: 'Lotus / Indian Floral',
    count: 5,
    draw: (type: number, { drawUV, filled, baseStyle }: PatternContext) => {
        switch (type) {
            case 0: { // Lotus petal — teardrop shape
                drawUV([
                    [0.5, 0.05],
                    [0.62, 0.15],
                    [0.73, 0.3],
                    [0.75, 0.4],
                    [0.68, 0.6],
                    [0.55, 0.85],
                    [0.5, 0.95],
                    [0.45, 0.85],
                    [0.32, 0.6],
                    [0.25, 0.4],
                    [0.27, 0.3],
                    [0.38, 0.15],
                ], baseStyle);
                if (!filled) {
                    // Center vein line
                    drawUV([[0.5, 0.1], [0.5, 0.85]], 'line');
                }
                break;
            }

            case 1: { // Paisley — curved teardrop
                drawUV([
                    [0.2, 0.1],
                    [0.4, 0.15],
                    [0.65, 0.3],
                    [0.8, 0.5],
                    [0.75, 0.7],
                    [0.6, 0.9],
                    [0.4, 0.85],
                    [0.2, 0.7],
                ], baseStyle);
                if (!filled) {
                    // Smaller concentric paisley inside
                    drawUV([
                        [0.3, 0.25],
                        [0.45, 0.3],
                        [0.6, 0.45],
                        [0.65, 0.55],
                        [0.55, 0.7],
                        [0.45, 0.75],
                        [0.35, 0.7],
                        [0.3, 0.55],
                    ], 'outline');
                }
                break;
            }

            case 2: { // Flower medallion — 5 petals radiating from center
                const cx = 0.5;
                const cy = 0.5;
                const radius = 0.3;
                const petalTall = 0.2;
                const petalWide = 0.1;
                const petalCount = 5;
                for (let i = 0; i < petalCount; i++) {
                    const angle = (i / petalCount) * Math.PI * 2 - Math.PI / 2;
                    const px = cx + radius * Math.cos(angle);
                    const py = cy + radius * Math.sin(angle);
                    // Diamond oriented along the radial direction
                    const dx = Math.cos(angle);
                    const dy = Math.sin(angle);
                    const nx = -Math.sin(angle);
                    const ny = Math.cos(angle);
                    drawUV([
                        [px - dx * petalTall, py - dy * petalTall],
                        [px + nx * petalWide, py + ny * petalWide],
                        [px + dx * petalTall, py + dy * petalTall],
                        [px - nx * petalWide, py - ny * petalWide],
                    ], baseStyle);
                }
                break;
            }

            case 3: { // Teardrop chain — two side-by-side teardrops pointing up
                // Left teardrop
                drawUV([
                    [0.25, 0.1],
                    [0.38, 0.3],
                    [0.35, 0.6],
                    [0.25, 0.9],
                    [0.15, 0.6],
                    [0.12, 0.3],
                ], baseStyle);
                // Right teardrop
                drawUV([
                    [0.75, 0.1],
                    [0.88, 0.3],
                    [0.85, 0.6],
                    [0.75, 0.9],
                    [0.65, 0.6],
                    [0.62, 0.3],
                ], baseStyle);
                break;
            }

            case 4: { // Ornate arch — doorway with arched top
                const archPoints: [number, number][] = [
                    [0.15, 0.0],
                    [0.15, 0.6],
                ];
                // Semicircular arch top approximated with 6 points
                const archSteps = 6;
                for (let i = 0; i <= archSteps; i++) {
                    const t = Math.PI * (1 - i / archSteps);
                    const u = 0.5 + 0.35 * Math.cos(t);
                    const v = 0.6 + 0.35 * Math.sin(t);
                    archPoints.push([u, v]);
                }
                archPoints.push([0.85, 0.6]);
                archPoints.push([0.85, 0.0]);
                drawUV(archPoints, baseStyle);

                if (!filled) {
                    // Smaller inner arch
                    const innerPoints: [number, number][] = [
                        [0.25, 0.0],
                        [0.25, 0.55],
                    ];
                    for (let i = 0; i <= archSteps; i++) {
                        const t = Math.PI * (1 - i / archSteps);
                        const u = 0.5 + 0.25 * Math.cos(t);
                        const v = 0.55 + 0.25 * Math.sin(t);
                        innerPoints.push([u, v]);
                    }
                    innerPoints.push([0.75, 0.55]);
                    innerPoints.push([0.75, 0.0]);
                    drawUV(innerPoints, 'outline');
                }
                break;
            }
        }
    }
};

export default lotusPatterns;
