// Snowflake crystal - thick arms with branches
import type { PatternContext } from '../types';

export function draw({ drawUV, filled }: PatternContext): void {
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
}
