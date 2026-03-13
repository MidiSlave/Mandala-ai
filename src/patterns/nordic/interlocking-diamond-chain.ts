// Interlocking diamond chain
import type { PatternContext } from '../types';

export function draw({ drawUV, filled }: PatternContext): void {
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';
    const altStyle = filled ? 'opaque-outline' : 'outline';

    // === Zigzag border band TOP (thicker) ===
    drawUV([
        [0.0, 0.0], [1.0, 0.0], [1.0, 0.14], [0.0, 0.14]
    ], mainStyle);
    // Zigzag cutouts in top band
    for (let i = 0; i < 8; i++) {
        const zx = i * 0.125;
        drawUV([
            [zx, 0.14], [zx + 0.0625, 0.06], [zx + 0.125, 0.14]
        ], detailStyle);
    }

    // === Zigzag border band BOTTOM (thicker) ===
    drawUV([
        [0.0, 0.86], [1.0, 0.86], [1.0, 1.0], [0.0, 1.0]
    ], mainStyle);
    // Zigzag cutouts in bottom band
    for (let i = 0; i < 8; i++) {
        const zx = i * 0.125;
        drawUV([
            [zx, 0.86], [zx + 0.0625, 0.94], [zx + 0.125, 0.86]
        ], detailStyle);
    }

    // === 3 large interlocking diamonds spanning full width ===
    const dh = 0.32; // diamond half-height
    const dw = 0.19; // diamond half-width (so 3 fit across)
    const cy = 0.50;

    // Diamond centers at u = 0.17, 0.50, 0.83
    const centers = [0.17, 0.50, 0.83];

    for (let idx = 0; idx < 3; idx++) {
        const dcx = centers[idx];
        const isFilled = idx % 2 === 0; // Alternate fill: 0 and 2 filled, 1 cutout

        // Outer diamond
        drawUV([
            [dcx, cy - dh], [dcx + dw, cy],
            [dcx, cy + dh], [dcx - dw, cy]
        ], isFilled ? mainStyle : altStyle);

        // First inner concentric diamond
        const s1 = 0.75;
        drawUV([
            [dcx, cy - dh * s1], [dcx + dw * s1, cy],
            [dcx, cy + dh * s1], [dcx - dw * s1, cy]
        ], isFilled ? detailStyle : mainStyle);

        // Second inner concentric diamond
        const s2 = 0.50;
        drawUV([
            [dcx, cy - dh * s2], [dcx + dw * s2, cy],
            [dcx, cy + dh * s2], [dcx - dw * s2, cy]
        ], isFilled ? mainStyle : altStyle);

        // Third innermost diamond (core)
        const s3 = 0.25;
        drawUV([
            [dcx, cy - dh * s3], [dcx + dw * s3, cy],
            [dcx, cy + dh * s3], [dcx - dw * s3, cy]
        ], isFilled ? detailStyle : mainStyle);
    }

    // === Filled triangular sections between diamonds ===
    // Fill the gaps between adjacent diamonds with solid shapes
    for (let i = 0; i < 2; i++) {
        const lx = centers[i];
        const rx = centers[i + 1];
        const mid = (lx + rx) / 2;
        // Top triangle between diamonds
        drawUV([
            [lx + dw, cy], [rx - dw, cy], [mid, cy - 0.18]
        ], mainStyle);
        // Bottom triangle between diamonds
        drawUV([
            [lx + dw, cy], [rx - dw, cy], [mid, cy + 0.18]
        ], mainStyle);
    }

    // === Small dots between diamonds (larger) ===
    const dotR = 0.028;
    const betweenXs = [0.335, 0.665]; // midpoints between diamond centers
    for (const bx of betweenXs) {
        // Vertical column of dots between each pair
        for (const dy of [-0.20, -0.10, 0.0, 0.10, 0.20]) {
            drawUV([
                [bx, cy + dy - dotR], [bx + dotR, cy + dy],
                [bx, cy + dy + dotR], [bx - dotR, cy + dy]
            ], detailStyle);
        }
    }

    // === Edge dots (where chain would continue) ===
    for (const dy of [-0.15, 0.0, 0.15]) {
        // Left edge
        drawUV([
            [0.01, cy + dy - dotR], [0.01 + dotR, cy + dy],
            [0.01, cy + dy + dotR], [0.01 - dotR, cy + dy]
        ], mainStyle);
        // Right edge
        drawUV([
            [0.99, cy + dy - dotR], [0.99 + dotR, cy + dy],
            [0.99, cy + dy + dotR], [0.99 - dotR, cy + dy]
        ], mainStyle);
    }

    // === Horizontal connecting bars between diamonds (thicker) ===
    const barH = 0.035;
    drawUV([
        [0.0, cy - barH], [1.0, cy - barH],
        [1.0, cy + barH], [0.0, cy + barH]
    ], mainStyle);

    // === Small diamonds in the zigzag band gaps (larger) ===
    const zbd = 0.025;
    for (let i = 0; i < 8; i++) {
        const zx = 0.0625 + i * 0.125;
        // Top band
        drawUV([
            [zx, 0.03 - zbd], [zx + zbd, 0.03],
            [zx, 0.03 + zbd], [zx - zbd, 0.03]
        ], detailStyle);
        // Bottom band
        drawUV([
            [zx, 0.97 - zbd], [zx + zbd, 0.97],
            [zx, 0.97 + zbd], [zx - zbd, 0.97]
        ], detailStyle);
    }

    // === Filled side panels ===
    drawUV([
        [0.0, cy - dh], [centers[0] - dw, cy], [0.0, cy + dh]
    ], mainStyle);
    drawUV([
        [1.0, cy - dh], [centers[2] + dw, cy], [1.0, cy + dh]
    ], mainStyle);
}
