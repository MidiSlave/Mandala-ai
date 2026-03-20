// Golden Wattle (Acacia) — Australia's national flower, fluffy yellow ball flowers
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // Main branch — arching
    drawUV([[0.15, 0.80], [0.30, 0.60], [0.50, 0.45], [0.70, 0.40], [0.85, 0.42]], 'line');

    // Sub-branches
    drawUV([[0.35, 0.56], [0.30, 0.42]], 'line');
    drawUV([[0.50, 0.45], [0.48, 0.30]], 'line');
    drawUV([[0.65, 0.42], [0.68, 0.28]], 'line');

    // Fluffy ball flowers — clusters of tiny round pom-poms
    const blossoms: [number, number, number][] = [
        [0.30, 0.40, 0.04], [0.26, 0.44, 0.03], [0.34, 0.38, 0.03],
        [0.48, 0.28, 0.04], [0.44, 0.32, 0.03], [0.52, 0.30, 0.035],
        [0.68, 0.26, 0.04], [0.64, 0.30, 0.03], [0.72, 0.28, 0.03],
        [0.55, 0.42, 0.035], [0.75, 0.38, 0.03], [0.40, 0.50, 0.03]
    ];

    for (const [bx, by, br] of blossoms) {
        // Fluffy outline
        const fluff: [number, number][] = [];
        const npts = 12;
        for (let i = 0; i <= npts; i++) {
            const t = (i / npts) * Math.PI * 2;
            const wobble = 1 + (r() - 0.5) * 0.4;
            fluff.push([bx + Math.cos(t) * br * wobble, by + Math.sin(t) * br * wobble]);
        }
        drawUV(fluff, mainStyle);

        // Inner detail — radiating lines (individual flower stems)
        for (let j = 0; j < 6; j++) {
            const angle = (j / 6) * Math.PI * 2 + r() * 0.3;
            drawUV([
                [bx, by],
                [bx + Math.cos(angle) * br * 0.7, by + Math.sin(angle) * br * 0.7]
            ], 'line');
        }
    }

    // Phyllode leaves (flat leaf-like stems, typical of Acacia)
    const leaves: [number, number, number, number][] = [
        [0.20, 0.72, -0.3, 0.12], [0.38, 0.55, -0.2, 0.10],
        [0.55, 0.50, 0.1, 0.10], [0.72, 0.44, 0.2, 0.10],
        [0.82, 0.45, 0.3, 0.08]
    ];

    for (const [lx, ly, angle, len] of leaves) {
        const dx = Math.cos(angle) * len;
        const dy = Math.sin(angle) * len;
        const perpX = -dy * 0.15;
        const perpY = dx * 0.15;
        drawUV([
            [lx, ly],
            [lx + dx * 0.5 + perpX, ly + dy * 0.5 + perpY],
            [lx + dx, ly + dy],
            [lx + dx * 0.5 - perpX, ly + dy * 0.5 - perpY]
        ], mainStyle);
        // Midrib
        drawUV([[lx, ly], [lx + dx, ly + dy]], 'line');
    }
}
