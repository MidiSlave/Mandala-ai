// Diamond lattice with nested diamonds, corner fills, solid infill sections
import type { PatternContext } from '../types';

export function draw({ drawUV, filled }: PatternContext): void {
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // === Outer diamond (large) ===
    drawUV([
        [0.5, 0.05], [0.95, 0.5], [0.5, 0.95], [0.05, 0.5]
    ], mainStyle);

    // === Middle diamond (concentric) ===
    drawUV([
        [0.5, 0.18], [0.82, 0.5], [0.5, 0.82], [0.18, 0.5]
    ], detailStyle);

    // === Inner diamond (concentric) ===
    drawUV([
        [0.5, 0.31], [0.69, 0.5], [0.5, 0.69], [0.31, 0.5]
    ], mainStyle);

    // === Innermost diamond (center jewel) ===
    drawUV([
        [0.5, 0.40], [0.60, 0.5], [0.5, 0.60], [0.40, 0.5]
    ], detailStyle);

    // === Solid filled sections between middle and inner diamond rings ===
    // Top wedge (between middle and inner diamond, top section)
    drawUV([
        [0.5, 0.18], [0.82, 0.5], [0.69, 0.5], [0.5, 0.31]
    ], mainStyle);

    // Bottom wedge
    drawUV([
        [0.5, 0.82], [0.18, 0.5], [0.31, 0.5], [0.5, 0.69]
    ], mainStyle);

    // Left wedge - solid fill
    drawUV([
        [0.18, 0.5], [0.5, 0.18], [0.5, 0.31], [0.31, 0.5]
    ], detailStyle);

    // Right wedge - solid fill
    drawUV([
        [0.82, 0.5], [0.5, 0.82], [0.5, 0.69], [0.69, 0.5]
    ], detailStyle);

    // === Solid corner triangles between outer diamond and tile edges ===
    // Top-left corner fill
    drawUV([
        [0.0, 0.0], [0.5, 0.05], [0.05, 0.5], [0.0, 0.5]
    ], mainStyle);
    drawUV([
        [0.0, 0.0], [0.5, 0.05], [0.5, 0.0]
    ], mainStyle);

    // Top-right corner fill
    drawUV([
        [1.0, 0.0], [0.95, 0.5], [0.5, 0.05], [0.5, 0.0]
    ], mainStyle);
    drawUV([
        [1.0, 0.0], [1.0, 0.5], [0.95, 0.5]
    ], mainStyle);

    // Bottom-left corner fill
    drawUV([
        [0.0, 1.0], [0.05, 0.5], [0.5, 0.95], [0.5, 1.0]
    ], mainStyle);
    drawUV([
        [0.0, 1.0], [0.0, 0.5], [0.05, 0.5]
    ], mainStyle);

    // Bottom-right corner fill
    drawUV([
        [1.0, 1.0], [0.5, 0.95], [0.95, 0.5], [1.0, 0.5]
    ], mainStyle);
    drawUV([
        [1.0, 1.0], [0.5, 1.0], [0.5, 0.95]
    ], mainStyle);

    // === Small filled diamonds at 4 corners of tile ===
    // Top-left corner
    drawUV([
        [0.08, 0.0], [0.16, 0.08], [0.08, 0.16], [0.0, 0.08]
    ], detailStyle);
    // Top-right corner
    drawUV([
        [0.92, 0.0], [1.0, 0.08], [0.92, 0.16], [0.84, 0.08]
    ], detailStyle);
    // Bottom-left corner
    drawUV([
        [0.08, 0.84], [0.16, 0.92], [0.08, 1.0], [0.0, 0.92]
    ], detailStyle);
    // Bottom-right corner
    drawUV([
        [0.92, 0.84], [1.0, 0.92], [0.92, 1.0], [0.84, 0.92]
    ], detailStyle);

    // === Dotted border band along top edge ===
    const dotR = 0.03;
    for (let i = 0; i < 7; i++) {
        const dx = 0.2 + i * 0.1;
        drawUV([
            [dx, 0.0], [dx + dotR, 0.03], [dx, 0.06], [dx - dotR, 0.03]
        ], detailStyle);
    }
    // === Dotted border band along bottom edge ===
    for (let i = 0; i < 7; i++) {
        const dx = 0.2 + i * 0.1;
        drawUV([
            [dx, 0.94], [dx + dotR, 0.97], [dx, 1.0], [dx - dotR, 0.97]
        ], detailStyle);
    }

    // === Additional filled diamonds on left and right edges ===
    drawUV([
        [0.0, 0.42], [0.06, 0.5], [0.0, 0.58], [-0.04, 0.5]
    ], detailStyle);
    drawUV([
        [1.0, 0.42], [1.04, 0.5], [1.0, 0.58], [0.94, 0.5]
    ], detailStyle);
}
