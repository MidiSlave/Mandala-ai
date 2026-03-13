// Pine tree - bigger, with second tree, snow dots, border band
import type { PatternContext } from '../types';

export function draw({ drawUV, filled }: PatternContext): void {
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // === Main tree (larger, filling more tile) ===
    // Bottom tier (widest)
    drawUV([
        [0.42, 0.25], [0.84, 0.72], [0.0, 0.72]
    ], mainStyle);
    // Middle tier
    drawUV([
        [0.42, 0.14], [0.76, 0.52], [0.08, 0.52]
    ], mainStyle);
    // Top tier
    drawUV([
        [0.42, 0.04], [0.64, 0.32], [0.20, 0.32]
    ], mainStyle);

    // Trunk (wider)
    drawUV([
        [0.34, 0.72], [0.50, 0.72],
        [0.50, 0.86], [0.34, 0.86]
    ], mainStyle);

    // === Large star at top ===
    const sx = 0.42, sy = 0.02;
    const sr = 0.07;
    const sr2 = 0.03;
    // 4-pointed star as two overlapping diamonds
    drawUV([
        [sx, sy - sr], [sx + sr2, sy - sr2],
        [sx + sr, sy], [sx + sr2, sy + sr2],
        [sx, sy + sr], [sx - sr2, sy + sr2],
        [sx - sr, sy], [sx - sr2, sy - sr2]
    ], mainStyle);

    // === Ornament diamonds on tiers (larger) ===
    const od = 0.04;
    const ornaments: [number, number][] = [
        [0.24, 0.60], [0.60, 0.60], [0.42, 0.62],
        [0.30, 0.44], [0.54, 0.44],
        [0.36, 0.28], [0.48, 0.28],
    ];
    for (const [ox, oy] of ornaments) {
        drawUV([
            [ox, oy - od], [ox + od, oy],
            [ox, oy + od], [ox - od, oy]
        ], detailStyle);
    }

    // === Second smaller tree on the right ===
    // Bottom tier
    drawUV([
        [0.80, 0.42], [0.96, 0.72], [0.64, 0.72]
    ], mainStyle);
    // Top tier
    drawUV([
        [0.80, 0.30], [0.92, 0.55], [0.68, 0.55]
    ], mainStyle);
    // Small trunk (wider)
    drawUV([
        [0.76, 0.72], [0.84, 0.72],
        [0.84, 0.82], [0.76, 0.82]
    ], mainStyle);
    // Small star (larger)
    const s2d = 0.045;
    drawUV([
        [0.80, 0.30 - s2d], [0.80 + s2d, 0.30],
        [0.80, 0.30 + s2d], [0.80 - s2d, 0.30]
    ], mainStyle);

    // === Snow dots scattered around trees (larger) ===
    const snowR = 0.025;
    const snowDots: [number, number][] = [
        [0.08, 0.18], [0.18, 0.10], [0.68, 0.12],
        [0.90, 0.18], [0.96, 0.38], [0.04, 0.36],
        [0.14, 0.82], [0.58, 0.78], [0.92, 0.80],
        [0.62, 0.18], [0.06, 0.52],
    ];
    for (const [sx, sy] of snowDots) {
        drawUV([
            [sx, sy - snowR], [sx + snowR, sy],
            [sx, sy + snowR], [sx - snowR, sy]
        ], mainStyle);
    }

    // === Decorative border band at bottom with diamond motifs (thicker) ===
    drawUV([
        [0.0, 0.86], [1.0, 0.86], [1.0, 1.0], [0.0, 1.0]
    ], mainStyle);
    // Diamonds inside the border band (larger)
    const bdd = 0.05;
    for (let i = 0; i < 5; i++) {
        const bx = 0.1 + i * 0.2;
        const by = 0.93;
        drawUV([
            [bx, by - bdd], [bx + bdd, by],
            [bx, by + bdd], [bx - bdd, by]
        ], detailStyle);
    }

    // === Filled ground area around trunks ===
    drawUV([
        [0.0, 0.82], [1.0, 0.82], [1.0, 0.86], [0.0, 0.86]
    ], mainStyle);
}
