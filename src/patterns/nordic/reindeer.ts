// Reindeer - much bigger, thicker, with ground zigzag and pine trees
import type { PatternContext } from '../types';

export function draw({ drawUV, filled }: PatternContext): void {
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // === Border bands top and bottom (thicker) ===
    drawUV([
        [0.0, 0.0], [1.0, 0.0], [1.0, 0.08], [0.0, 0.08]
    ], mainStyle);
    drawUV([
        [0.0, 0.92], [1.0, 0.92], [1.0, 1.0], [0.0, 1.0]
    ], mainStyle);

    // === Deer body (large, filling tile) ===
    drawUV([
        [0.18, 0.36], [0.78, 0.36],
        [0.78, 0.62], [0.18, 0.62]
    ], mainStyle);

    // === Chest/shoulder bulk ===
    drawUV([
        [0.68, 0.30], [0.82, 0.30],
        [0.82, 0.44], [0.68, 0.44]
    ], mainStyle);

    // === Neck (connects body to head, angled up) ===
    drawUV([
        [0.70, 0.24], [0.84, 0.24],
        [0.84, 0.40], [0.70, 0.40]
    ], mainStyle);

    // === Head ===
    drawUV([
        [0.74, 0.20], [0.92, 0.20],
        [0.94, 0.30], [0.92, 0.40],
        [0.74, 0.40]
    ], mainStyle);

    // === Snout detail ===
    drawUV([
        [0.90, 0.26], [0.96, 0.28], [0.96, 0.34], [0.90, 0.36]
    ], mainStyle);

    // === Tail (thicker) ===
    drawUV([
        [0.08, 0.34], [0.18, 0.36],
        [0.18, 0.46], [0.08, 0.44]
    ], mainStyle);
    // Tail flare
    drawUV([
        [0.04, 0.32], [0.10, 0.34],
        [0.10, 0.40], [0.04, 0.38]
    ], mainStyle);

    // === 4 thick legs ===
    const legW = 0.05;
    const legTop = 0.62;
    const legBot = 0.80;
    const legXs = [0.24, 0.38, 0.56, 0.70];
    for (const lx of legXs) {
        drawUV([
            [lx - legW, legTop], [lx + legW, legTop],
            [lx + legW, legBot], [lx - legW, legBot]
        ], mainStyle);
        // Hooves (wider filled rectangle at bottom)
        drawUV([
            [lx - legW - 0.02, legBot], [lx + legW + 0.02, legBot],
            [lx + legW + 0.02, legBot + 0.05], [lx - legW - 0.02, legBot + 0.05]
        ], mainStyle);
    }

    // === Antlers (thick, branching) ===
    // Left antler main beam
    drawUV([
        [0.74, 0.20], [0.79, 0.20],
        [0.77, 0.06], [0.72, 0.06]
    ], mainStyle);
    // Left antler tines (wider parallelograms)
    drawUV([
        [0.72, 0.06], [0.66, 0.01], [0.69, -0.01], [0.75, 0.04]
    ], mainStyle);
    drawUV([
        [0.73, 0.13], [0.67, 0.08], [0.70, 0.06], [0.75, 0.11]
    ], mainStyle);

    // Right antler main beam
    drawUV([
        [0.82, 0.20], [0.87, 0.20],
        [0.89, 0.06], [0.84, 0.06]
    ], mainStyle);
    // Right antler tines
    drawUV([
        [0.89, 0.06], [0.94, 0.01], [0.92, -0.01], [0.87, 0.04]
    ], mainStyle);
    drawUV([
        [0.88, 0.13], [0.93, 0.08], [0.91, 0.06], [0.86, 0.11]
    ], mainStyle);

    // === Eye ===
    drawUV([
        [0.86, 0.27], [0.885, 0.295], [0.86, 0.32], [0.835, 0.295]
    ], detailStyle);

    // === Body detail: filled diamond pattern on body ===
    const bd = 0.04;
    for (const [bx, by] of [[0.30, 0.49], [0.42, 0.49], [0.54, 0.49], [0.66, 0.49]] as [number, number][]) {
        drawUV([
            [bx, by - bd], [bx + bd, by], [bx, by + bd], [bx - bd, by]
        ], detailStyle);
    }

    // === Belly band detail ===
    drawUV([
        [0.20, 0.56], [0.76, 0.56], [0.76, 0.60], [0.20, 0.60]
    ], detailStyle);

    // === Ground band with zigzag (thicker) ===
    drawUV([
        [0.0, 0.84], [1.0, 0.84], [1.0, 0.92], [0.0, 0.92]
    ], mainStyle);
    // Zigzag cutouts in ground band
    for (let i = 0; i < 10; i++) {
        const zx = 0.05 + i * 0.1;
        drawUV([
            [zx, 0.84], [zx + 0.05, 0.88], [zx + 0.10, 0.84]
        ], detailStyle);
    }

    // === Small pine tree on left (larger) ===
    drawUV([
        [0.06, 0.50], [0.16, 0.80], [-0.04, 0.80]
    ], mainStyle);
    // Trunk (wider)
    drawUV([
        [0.03, 0.80], [0.09, 0.80], [0.09, 0.86], [0.03, 0.86]
    ], mainStyle);
}
