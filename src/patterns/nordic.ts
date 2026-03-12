import type { PatternSet, PatternContext } from './types';

const nordicPatterns: PatternSet = {
    name: 'Nordic / Fair Isle',
    count: 5,
    draw: (type: number, { drawUV, filled, baseStyle }: PatternContext) => {
        switch (type) {
            case 0: { // Diamond lattice with nested diamonds, corner fills, solid infill sections
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
                // Instead of crosshatch lines, fill alternating triangular wedges

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

                break;
            }

            case 1: { // Snowflake crystal - thick arms with branches
                const cx = 0.5;
                const cy = 0.5;
                const armLen = 0.42;
                const armW = 0.045; // half-width of arm rectangles (wider than before)
                const mainStyle = filled ? 'filled' : 'outline';
                const detailStyle = filled ? 'opaque-outline' : 'filled';

                // === Hexagonal center ===
                const hr = 0.14;
                drawUV([
                    [cx, cy - hr],
                    [cx + hr * 0.866, cy - hr * 0.5],
                    [cx + hr * 0.866, cy + hr * 0.5],
                    [cx, cy + hr],
                    [cx - hr * 0.866, cy + hr * 0.5],
                    [cx - hr * 0.866, cy - hr * 0.5],
                ], mainStyle);

                // Inner hexagon (detail)
                const hr2 = 0.075;
                drawUV([
                    [cx, cy - hr2],
                    [cx + hr2 * 0.866, cy - hr2 * 0.5],
                    [cx + hr2 * 0.866, cy + hr2 * 0.5],
                    [cx, cy + hr2],
                    [cx - hr2 * 0.866, cy + hr2 * 0.5],
                    [cx - hr2 * 0.866, cy - hr2 * 0.5],
                ], detailStyle);

                // === 4 main arms as thick rectangles ===
                // Vertical arm UP
                drawUV([
                    [cx - armW, cy - hr], [cx + armW, cy - hr],
                    [cx + armW, cy - armLen], [cx - armW, cy - armLen]
                ], mainStyle);
                // Vertical arm DOWN
                drawUV([
                    [cx - armW, cy + hr], [cx + armW, cy + hr],
                    [cx + armW, cy + armLen], [cx - armW, cy + armLen]
                ], mainStyle);
                // Horizontal arm LEFT
                drawUV([
                    [cx - hr, cy - armW], [cx - hr, cy + armW],
                    [cx - armLen, cy + armW], [cx - armLen, cy - armW]
                ], mainStyle);
                // Horizontal arm RIGHT
                drawUV([
                    [cx + hr, cy - armW], [cx + hr, cy + armW],
                    [cx + armLen, cy + armW], [cx + armLen, cy - armW]
                ], mainStyle);

                // === 4 diagonal arms as thick parallelograms ===
                const da = armLen * 0.707;
                const dw = armW * 1.4; // wider diagonal arms
                // Top-left diagonal arm
                drawUV([
                    [cx - da + dw, cy - da - dw], [cx - da - dw, cy - da + dw],
                    [cx - dw, cy - dw], [cx + dw, cy + dw]
                ], mainStyle);
                // Top-right diagonal arm
                drawUV([
                    [cx + da - dw, cy - da - dw], [cx + da + dw, cy - da + dw],
                    [cx + dw, cy - dw], [cx - dw, cy + dw]
                ], mainStyle);
                // Bottom-left diagonal arm
                drawUV([
                    [cx - da + dw, cy + da + dw], [cx - da - dw, cy + da - dw],
                    [cx - dw, cy + dw], [cx + dw, cy - dw]
                ], mainStyle);
                // Bottom-right diagonal arm
                drawUV([
                    [cx + da - dw, cy + da + dw], [cx + da + dw, cy + da - dw],
                    [cx + dw, cy + dw], [cx - dw, cy - dw]
                ], mainStyle);

                // === Branch forks on vertical/horizontal arms (wider) ===
                const branchLen = 0.11;
                const branchW = 0.03;
                // Branches on UP arm at 1/3 and 2/3
                for (const frac of [0.33, 0.66]) {
                    const by = cy - hr - (armLen - hr) * frac;
                    // Left branch
                    drawUV([
                        [cx, by - branchW], [cx, by + branchW],
                        [cx - branchLen, by + branchW], [cx - branchLen, by - branchW]
                    ], mainStyle);
                    // Right branch
                    drawUV([
                        [cx, by - branchW], [cx, by + branchW],
                        [cx + branchLen, by + branchW], [cx + branchLen, by - branchW]
                    ], mainStyle);
                }
                // Branches on DOWN arm at 1/3 and 2/3
                for (const frac of [0.33, 0.66]) {
                    const by = cy + hr + (armLen - hr) * frac;
                    drawUV([
                        [cx, by - branchW], [cx, by + branchW],
                        [cx - branchLen, by + branchW], [cx - branchLen, by - branchW]
                    ], mainStyle);
                    drawUV([
                        [cx, by - branchW], [cx, by + branchW],
                        [cx + branchLen, by + branchW], [cx + branchLen, by - branchW]
                    ], mainStyle);
                }
                // Branches on LEFT arm
                for (const frac of [0.33, 0.66]) {
                    const bx = cx - hr - (armLen - hr) * frac;
                    drawUV([
                        [bx - branchW, cy], [bx + branchW, cy],
                        [bx + branchW, cy - branchLen], [bx - branchW, cy - branchLen]
                    ], mainStyle);
                    drawUV([
                        [bx - branchW, cy], [bx + branchW, cy],
                        [bx + branchW, cy + branchLen], [bx - branchW, cy + branchLen]
                    ], mainStyle);
                }
                // Branches on RIGHT arm
                for (const frac of [0.33, 0.66]) {
                    const bx = cx + hr + (armLen - hr) * frac;
                    drawUV([
                        [bx - branchW, cy], [bx + branchW, cy],
                        [bx + branchW, cy - branchLen], [bx - branchW, cy - branchLen]
                    ], mainStyle);
                    drawUV([
                        [bx - branchW, cy], [bx + branchW, cy],
                        [bx + branchW, cy + branchLen], [bx - branchW, cy + branchLen]
                    ], mainStyle);
                }

                // === Diamond tips at end of each cardinal arm (larger) ===
                const td = 0.055;
                // Top
                drawUV([
                    [cx, cy - armLen - td], [cx + td, cy - armLen],
                    [cx, cy - armLen + td], [cx - td, cy - armLen]
                ], mainStyle);
                // Bottom
                drawUV([
                    [cx, cy + armLen - td], [cx + td, cy + armLen],
                    [cx, cy + armLen + td], [cx - td, cy + armLen]
                ], mainStyle);
                // Left
                drawUV([
                    [cx - armLen, cy - td], [cx - armLen + td, cy],
                    [cx - armLen, cy + td], [cx - armLen - td, cy]
                ], mainStyle);
                // Right
                drawUV([
                    [cx + armLen, cy - td], [cx + armLen + td, cy],
                    [cx + armLen, cy + td], [cx + armLen - td, cy]
                ], mainStyle);

                // === Filled corner squares to add solidity ===
                const cs = 0.08;
                drawUV([
                    [0.0, 0.0], [cs, 0.0], [cs, cs], [0.0, cs]
                ], mainStyle);
                drawUV([
                    [1.0 - cs, 0.0], [1.0, 0.0], [1.0, cs], [1.0 - cs, cs]
                ], mainStyle);
                drawUV([
                    [0.0, 1.0 - cs], [cs, 1.0 - cs], [cs, 1.0], [0.0, 1.0]
                ], mainStyle);
                drawUV([
                    [1.0 - cs, 1.0 - cs], [1.0, 1.0 - cs], [1.0, 1.0], [1.0 - cs, 1.0]
                ], mainStyle);

                break;
            }

            case 2: { // Reindeer - much bigger, thicker, with ground zigzag and pine trees
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
                const ed = 0.025;
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

                break;
            }

            case 3: { // Pine tree - bigger, with second tree, snow dots, border band
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

                break;
            }

            case 4: { // Interlocking diamond chain
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

                break;
            }
        }
    }
};

export default nordicPatterns;
