import type { PatternSet, PatternContext } from './types';

const nordicPatterns: PatternSet = {
    name: 'Nordic / Fair Isle',
    count: 5,
    draw: (type: number, { drawUV, filled, baseStyle }: PatternContext) => {
        switch (type) {
            case 0: { // Diamond lattice with nested diamonds, corner fills, dotted borders, cross-hatch
                const mainStyle = filled ? 'filled' : 'outline';
                const detailStyle = filled ? 'opaque-outline' : 'filled';
                const lineStyle = filled ? 'opaque-outline' : 'outline';

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

                // === Cross-hatch lines inside middle diamond ring ===
                // Diagonal lines going top-left to bottom-right
                drawUV([[0.35, 0.25], [0.75, 0.65]], lineStyle === 'opaque-outline' ? 'line' : 'line');
                drawUV([[0.25, 0.35], [0.65, 0.75]], 'line');
                drawUV([[0.45, 0.20], [0.82, 0.55]], 'line');
                drawUV([[0.20, 0.45], [0.55, 0.82]], 'line');
                // Diagonal lines going top-right to bottom-left
                drawUV([[0.65, 0.25], [0.25, 0.65]], 'line');
                drawUV([[0.75, 0.35], [0.35, 0.75]], 'line');
                drawUV([[0.55, 0.20], [0.18, 0.55]], 'line');
                drawUV([[0.80, 0.45], [0.45, 0.82]], 'line');

                // === Small filled diamonds at 4 corners of tile ===
                const cd = 0.08;
                // Top-left corner
                drawUV([
                    [0.08, 0.0], [0.16, 0.08], [0.08, 0.16], [0.0, 0.08]
                ], mainStyle);
                // Top-right corner
                drawUV([
                    [0.92, 0.0], [1.0, 0.08], [0.92, 0.16], [0.84, 0.08]
                ], mainStyle);
                // Bottom-left corner
                drawUV([
                    [0.08, 0.84], [0.16, 0.92], [0.08, 1.0], [0.0, 0.92]
                ], mainStyle);
                // Bottom-right corner
                drawUV([
                    [0.92, 0.84], [1.0, 0.92], [0.92, 1.0], [0.84, 0.92]
                ], mainStyle);

                // === Dotted border band along top edge ===
                const dotR = 0.025;
                for (let i = 0; i < 7; i++) {
                    const dx = 0.2 + i * 0.1;
                    drawUV([
                        [dx, 0.0], [dx + dotR, 0.025], [dx, 0.05], [dx - dotR, 0.025]
                    ], mainStyle);
                }
                // === Dotted border band along bottom edge ===
                for (let i = 0; i < 7; i++) {
                    const dx = 0.2 + i * 0.1;
                    drawUV([
                        [dx, 0.95], [dx + dotR, 0.975], [dx, 1.0], [dx - dotR, 0.975]
                    ], mainStyle);
                }

                // === Additional small diamonds on left and right edges ===
                drawUV([
                    [0.0, 0.42], [0.06, 0.5], [0.0, 0.58], [-0.04, 0.5]
                ], mainStyle);
                drawUV([
                    [1.0, 0.42], [1.04, 0.5], [1.0, 0.58], [0.94, 0.5]
                ], mainStyle);

                break;
            }

            case 1: { // Snowflake crystal - thick arms with branches
                const cx = 0.5;
                const cy = 0.5;
                const armLen = 0.42;
                const armW = 0.035; // half-width of arm rectangles
                const mainStyle = filled ? 'filled' : 'outline';
                const detailStyle = filled ? 'opaque-outline' : 'filled';

                // === Hexagonal center ===
                const hr = 0.12;
                drawUV([
                    [cx, cy - hr],
                    [cx + hr * 0.866, cy - hr * 0.5],
                    [cx + hr * 0.866, cy + hr * 0.5],
                    [cx, cy + hr],
                    [cx - hr * 0.866, cy + hr * 0.5],
                    [cx - hr * 0.866, cy - hr * 0.5],
                ], mainStyle);

                // Inner hexagon (detail)
                const hr2 = 0.065;
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

                // === 4 diagonal arms as thick rectangles ===
                const da = armLen * 0.707;
                const dw = armW * 1.2;
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

                // === Branch forks on vertical/horizontal arms ===
                const branchLen = 0.09;
                const branchW = 0.02;
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

                // === Diamond tips at end of each cardinal arm ===
                const td = 0.045;
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

                break;
            }

            case 2: { // Reindeer - much bigger, thicker, with ground zigzag and pine trees
                const mainStyle = filled ? 'filled' : 'outline';
                const detailStyle = filled ? 'opaque-outline' : 'filled';

                // === Border bands top and bottom ===
                drawUV([
                    [0.0, 0.0], [1.0, 0.0], [1.0, 0.06], [0.0, 0.06]
                ], mainStyle);
                drawUV([
                    [0.0, 0.94], [1.0, 0.94], [1.0, 1.0], [0.0, 1.0]
                ], mainStyle);

                // === Deer body (large, filling tile) ===
                drawUV([
                    [0.18, 0.38], [0.78, 0.38],
                    [0.78, 0.60], [0.18, 0.60]
                ], mainStyle);

                // === Neck (connects body to head, angled up) ===
                drawUV([
                    [0.72, 0.28], [0.82, 0.28],
                    [0.82, 0.42], [0.72, 0.42]
                ], mainStyle);

                // === Head ===
                drawUV([
                    [0.74, 0.22], [0.90, 0.22],
                    [0.92, 0.30], [0.90, 0.38],
                    [0.74, 0.38]
                ], mainStyle);

                // === Tail ===
                drawUV([
                    [0.10, 0.36], [0.18, 0.38],
                    [0.18, 0.44], [0.10, 0.42]
                ], mainStyle);

                // === 4 thick legs ===
                const legW = 0.04;
                const legTop = 0.60;
                const legBot = 0.80;
                const legXs = [0.24, 0.38, 0.56, 0.70];
                for (const lx of legXs) {
                    drawUV([
                        [lx - legW, legTop], [lx + legW, legTop],
                        [lx + legW, legBot], [lx - legW, legBot]
                    ], mainStyle);
                    // Hooves (small wider rectangle at bottom)
                    drawUV([
                        [lx - legW - 0.015, legBot], [lx + legW + 0.015, legBot],
                        [lx + legW + 0.015, legBot + 0.04], [lx - legW - 0.015, legBot + 0.04]
                    ], mainStyle);
                }

                // === Antlers (thick, branching) ===
                // Left antler main beam
                drawUV([
                    [0.76, 0.22], [0.79, 0.22],
                    [0.77, 0.08], [0.74, 0.08]
                ], mainStyle);
                // Left antler tines
                drawUV([
                    [0.74, 0.08], [0.69, 0.04], [0.71, 0.02], [0.76, 0.06]
                ], mainStyle);
                drawUV([
                    [0.75, 0.14], [0.70, 0.10], [0.72, 0.08], [0.76, 0.12]
                ], mainStyle);

                // Right antler main beam
                drawUV([
                    [0.82, 0.22], [0.85, 0.22],
                    [0.87, 0.08], [0.84, 0.08]
                ], mainStyle);
                // Right antler tines
                drawUV([
                    [0.87, 0.08], [0.92, 0.04], [0.90, 0.02], [0.85, 0.06]
                ], mainStyle);
                drawUV([
                    [0.86, 0.14], [0.91, 0.10], [0.89, 0.08], [0.85, 0.12]
                ], mainStyle);

                // === Eye ===
                const ed = 0.02;
                drawUV([
                    [0.86, 0.28], [0.88, 0.30], [0.86, 0.32], [0.84, 0.30]
                ], detailStyle);

                // === Body detail: diamond pattern on body ===
                const bd = 0.03;
                for (const [bx, by] of [[0.35, 0.49], [0.50, 0.49], [0.65, 0.49]] as [number, number][]) {
                    drawUV([
                        [bx, by - bd], [bx + bd, by], [bx, by + bd], [bx - bd, by]
                    ], detailStyle);
                }

                // === Ground band with zigzag ===
                drawUV([
                    [0.0, 0.86], [1.0, 0.86], [1.0, 0.94], [0.0, 0.94]
                ], mainStyle);
                // Zigzag cutouts in ground band
                for (let i = 0; i < 10; i++) {
                    const zx = 0.05 + i * 0.1;
                    drawUV([
                        [zx, 0.86], [zx + 0.05, 0.90], [zx + 0.10, 0.86]
                    ], detailStyle);
                }

                // === Small pine tree on left ===
                drawUV([
                    [0.06, 0.55], [0.14, 0.80], [-0.02, 0.80]
                ], mainStyle);
                drawUV([
                    [0.04, 0.80], [0.08, 0.80], [0.08, 0.86], [0.04, 0.86]
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

                // Trunk
                drawUV([
                    [0.36, 0.72], [0.48, 0.72],
                    [0.48, 0.86], [0.36, 0.86]
                ], mainStyle);

                // === Large star at top ===
                const sx = 0.42, sy = 0.02;
                const sr = 0.06;
                const sr2 = 0.025;
                // 4-pointed star as two overlapping diamonds
                drawUV([
                    [sx, sy - sr], [sx + sr2, sy - sr2],
                    [sx + sr, sy], [sx + sr2, sy + sr2],
                    [sx, sy + sr], [sx - sr2, sy + sr2],
                    [sx - sr, sy], [sx - sr2, sy - sr2]
                ], mainStyle);

                // === Ornament diamonds on tiers ===
                const od = 0.03;
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
                // Small trunk
                drawUV([
                    [0.77, 0.72], [0.83, 0.72],
                    [0.83, 0.82], [0.77, 0.82]
                ], mainStyle);
                // Small star
                const s2d = 0.035;
                drawUV([
                    [0.80, 0.30 - s2d], [0.80 + s2d, 0.30],
                    [0.80, 0.30 + s2d], [0.80 - s2d, 0.30]
                ], mainStyle);

                // === Snow dots scattered around trees ===
                const snowR = 0.018;
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

                // === Decorative border band at bottom with diamond motifs ===
                drawUV([
                    [0.0, 0.88], [1.0, 0.88], [1.0, 1.0], [0.0, 1.0]
                ], mainStyle);
                // Diamonds inside the border band
                const bdd = 0.04;
                for (let i = 0; i < 5; i++) {
                    const bx = 0.1 + i * 0.2;
                    const by = 0.94;
                    drawUV([
                        [bx, by - bdd], [bx + bdd, by],
                        [bx, by + bdd], [bx - bdd, by]
                    ], detailStyle);
                }

                // === Ground line ===
                drawUV([
                    [0.0, 0.86], [1.0, 0.86], [1.0, 0.88], [0.0, 0.88]
                ], mainStyle);

                break;
            }

            case 4: { // Interlocking diamond chain - COMPLETE REWRITE
                const mainStyle = filled ? 'filled' : 'outline';
                const detailStyle = filled ? 'opaque-outline' : 'filled';
                const altStyle = filled ? 'opaque-outline' : 'outline';

                // === Zigzag border band TOP ===
                drawUV([
                    [0.0, 0.0], [1.0, 0.0], [1.0, 0.12], [0.0, 0.12]
                ], mainStyle);
                // Zigzag cutouts in top band
                for (let i = 0; i < 8; i++) {
                    const zx = i * 0.125;
                    drawUV([
                        [zx, 0.12], [zx + 0.0625, 0.05], [zx + 0.125, 0.12]
                    ], detailStyle);
                }

                // === Zigzag border band BOTTOM ===
                drawUV([
                    [0.0, 0.88], [1.0, 0.88], [1.0, 1.0], [0.0, 1.0]
                ], mainStyle);
                // Zigzag cutouts in bottom band
                for (let i = 0; i < 8; i++) {
                    const zx = i * 0.125;
                    drawUV([
                        [zx, 0.88], [zx + 0.0625, 0.95], [zx + 0.125, 0.88]
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

                // === Small dots between diamonds ===
                const dotR = 0.022;
                const betweenXs = [0.335, 0.665]; // midpoints between diamond centers
                for (const bx of betweenXs) {
                    // Vertical column of dots between each pair
                    for (const dy of [-0.20, -0.10, 0.0, 0.10, 0.20]) {
                        drawUV([
                            [bx, cy + dy - dotR], [bx + dotR, cy + dy],
                            [bx, cy + dy + dotR], [bx - dotR, cy + dy]
                        ], mainStyle);
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

                // === Horizontal connecting bars between diamonds ===
                const barH = 0.025;
                drawUV([
                    [0.0, cy - barH], [1.0, cy - barH],
                    [1.0, cy + barH], [0.0, cy + barH]
                ], mainStyle);

                // === Small diamonds in the zigzag band gaps ===
                const zbd = 0.02;
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

                break;
            }
        }
    }
};

export default nordicPatterns;
