// Giraffe — tall with spotted pattern and long neck
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // Body
    drawUV([
        [0.25, 0.55], [0.65, 0.55], [0.68, 0.58],
        [0.68, 0.72], [0.65, 0.75], [0.25, 0.75],
        [0.22, 0.72], [0.22, 0.58]
    ], mainStyle);

    // Neck — long, angled
    drawUV([
        [0.55, 0.55], [0.58, 0.10], [0.68, 0.08],
        [0.70, 0.10], [0.68, 0.55]
    ], mainStyle);

    // Head
    drawUV([
        [0.56, 0.10], [0.56, 0.04], [0.72, 0.04],
        [0.72, 0.12], [0.68, 0.12]
    ], mainStyle);

    // Ossicones (horns)
    drawUV([[0.60, 0.04], [0.59, 0.00], [0.61, 0.00]], mainStyle);
    drawUV([[0.68, 0.04], [0.67, 0.00], [0.69, 0.00]], mainStyle);

    // Eye
    drawUV([[0.67, 0.07], [0.69, 0.07], [0.69, 0.09], [0.67, 0.09]], detailStyle);

    // Ear
    drawUV([[0.72, 0.06], [0.76, 0.04], [0.75, 0.09]], mainStyle);

    // Spots on body
    const spotPositions: [number, number][] = [
        [0.35, 0.62], [0.45, 0.60], [0.55, 0.63],
        [0.32, 0.70], [0.48, 0.70], [0.60, 0.68]
    ];
    for (const [su, sv] of spotPositions) {
        const sz = 0.02 + r() * 0.015;
        const spotPts: [number, number][] = [];
        for (let i = 0; i <= 8; i++) {
            const t = (i / 8) * Math.PI * 2;
            spotPts.push([su + Math.cos(t) * sz, sv + Math.sin(t) * sz * 0.8]);
        }
        drawUV(spotPts, detailStyle);
    }

    // Spots on neck
    for (let i = 0; i < 4; i++) {
        const nv = 0.18 + i * 0.10;
        const nu = 0.61 + r() * 0.04;
        const spotPts: [number, number][] = [];
        for (let j = 0; j <= 6; j++) {
            const t = (j / 6) * Math.PI * 2;
            spotPts.push([nu + Math.cos(t) * 0.02, nv + Math.sin(t) * 0.015]);
        }
        drawUV(spotPts, detailStyle);
    }

    // Front legs
    drawUV([[0.55, 0.75], [0.55, 0.95], [0.59, 0.95], [0.59, 0.75]], mainStyle);
    drawUV([[0.48, 0.75], [0.48, 0.93], [0.52, 0.93], [0.52, 0.75]], mainStyle);

    // Back legs
    drawUV([[0.30, 0.75], [0.30, 0.95], [0.34, 0.95], [0.34, 0.75]], mainStyle);
    drawUV([[0.25, 0.75], [0.25, 0.93], [0.29, 0.93], [0.29, 0.75]], mainStyle);

    // Tail
    drawUV([[0.22, 0.58], [0.18, 0.52], [0.16, 0.48]], 'line');
    drawUV([[0.15, 0.47], [0.14, 0.49], [0.17, 0.49]], 'line'); // tuft
}
