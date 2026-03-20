// Flannel Flower — Australian native with soft flannel-textured white petals
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // Stem
    drawUV([[0.49, 0.60], [0.49, 0.92], [0.51, 0.92], [0.51, 0.60]], mainStyle);

    // Petals — soft, slightly pointed, arranged in a star
    const cx = 0.50, cy = 0.35;
    const numPetals = 10;
    for (let i = 0; i < numPetals; i++) {
        const angle = (i / numPetals) * Math.PI * 2;
        const nextAngle = ((i + 1) / numPetals) * Math.PI * 2;
        const midAngle = (angle + nextAngle) / 2;

        const innerR = 0.06;
        const outerR = 0.20 + r() * 0.02;
        const midR = outerR * 0.6;

        // Petal shape — elongated with soft tip
        drawUV([
            [cx + Math.cos(angle) * innerR, cy + Math.sin(angle) * innerR],
            [cx + Math.cos(angle - 0.1) * midR, cy + Math.sin(angle - 0.1) * midR],
            [cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR],
            [cx + Math.cos(angle + 0.1) * midR, cy + Math.sin(angle + 0.1) * midR],
        ], mainStyle);

        // Petal tip — slightly green/dark (flannel flower characteristic)
        drawUV([
            [cx + Math.cos(angle) * (outerR - 0.03), cy + Math.sin(angle) * (outerR - 0.03)],
            [cx + Math.cos(angle - 0.06) * outerR, cy + Math.sin(angle - 0.06) * outerR],
            [cx + Math.cos(angle) * (outerR + 0.01), cy + Math.sin(angle) * (outerR + 0.01)],
            [cx + Math.cos(angle + 0.06) * outerR, cy + Math.sin(angle + 0.06) * outerR],
        ], detailStyle);
    }

    // Center — fluffy dome of tiny florets
    const center: [number, number][] = [];
    for (let i = 0; i <= 12; i++) {
        const t = (i / 12) * Math.PI * 2;
        const wobble = 1 + (r() - 0.5) * 0.3;
        center.push([cx + Math.cos(t) * 0.05 * wobble, cy + Math.sin(t) * 0.05 * wobble]);
    }
    drawUV(center, detailStyle);

    // Center dot pattern
    for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        drawUV([
            [cx + Math.cos(angle) * 0.025 - 0.005, cy + Math.sin(angle) * 0.025 - 0.005],
            [cx + Math.cos(angle) * 0.025 + 0.005, cy + Math.sin(angle) * 0.025 - 0.005],
            [cx + Math.cos(angle) * 0.025 + 0.005, cy + Math.sin(angle) * 0.025 + 0.005],
            [cx + Math.cos(angle) * 0.025 - 0.005, cy + Math.sin(angle) * 0.025 + 0.005]
        ], mainStyle);
    }

    // Soft, deeply-divided leaves
    drawUV([
        [0.49, 0.65], [0.42, 0.62], [0.36, 0.60],
        [0.30, 0.62], [0.32, 0.58], [0.28, 0.55],
        [0.32, 0.56], [0.36, 0.58], [0.34, 0.54],
        [0.38, 0.56], [0.44, 0.60], [0.49, 0.63]
    ], mainStyle);

    drawUV([
        [0.51, 0.65], [0.58, 0.62], [0.64, 0.60],
        [0.70, 0.62], [0.68, 0.58], [0.72, 0.55],
        [0.68, 0.56], [0.64, 0.58], [0.66, 0.54],
        [0.62, 0.56], [0.56, 0.60], [0.51, 0.63]
    ], mainStyle);
}
