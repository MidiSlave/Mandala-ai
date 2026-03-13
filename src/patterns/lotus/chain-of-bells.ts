// Chain of bells — two bells connected by chain
import type { PatternContext } from '../types';
import { filledLine, filledBand } from './helpers';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    // Background fill
    drawUV([
        [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0],
    ], 'opaque-outline');

    // Left bell dome
    const leftBell: [number, number][] = [[0.12, 0.35]];
    for (let i = 0; i <= 6; i++) {
        const t = Math.PI * (i / 6);
        leftBell.push([0.25 + 0.13 * Math.cos(t), 0.6 + 0.2 * Math.sin(t)]);
    }
    leftBell.push([0.38, 0.35]);
    leftBell.push([0.4, 0.3]);
    leftBell.push([0.4, 0.2]);
    leftBell.push([0.38, 0.15]);
    leftBell.push([0.12, 0.15]);
    leftBell.push([0.1, 0.2]);
    leftBell.push([0.1, 0.3]);
    drawUV(leftBell, baseStyle);

    // Left bell clapper — filled
    drawUV([
        [0.23, 0.2], [0.27, 0.2],
        [0.28, 0.27], [0.25, 0.33],
        [0.22, 0.27],
    ], baseStyle);
    filledLine(drawUV, baseStyle, 0.25, 0.33, 0.25, 0.5, 0.025);

    // Right bell dome
    const rightBell: [number, number][] = [[0.62, 0.35]];
    for (let i = 0; i <= 6; i++) {
        const t = Math.PI * (i / 6);
        rightBell.push([0.75 + 0.13 * Math.cos(t), 0.6 + 0.2 * Math.sin(t)]);
    }
    rightBell.push([0.88, 0.35]);
    rightBell.push([0.9, 0.3]);
    rightBell.push([0.9, 0.2]);
    rightBell.push([0.88, 0.15]);
    rightBell.push([0.62, 0.15]);
    rightBell.push([0.6, 0.2]);
    rightBell.push([0.6, 0.3]);
    drawUV(rightBell, baseStyle);

    // Right bell clapper — filled
    drawUV([
        [0.73, 0.2], [0.77, 0.2],
        [0.78, 0.27], [0.75, 0.33],
        [0.72, 0.27],
    ], baseStyle);
    filledLine(drawUV, baseStyle, 0.75, 0.33, 0.75, 0.5, 0.025);

    // Decorative bands around bell bodies
    drawUV([[0.12, 0.3], [0.38, 0.3], [0.38, 0.33], [0.12, 0.33]], baseStyle);
    drawUV([[0.14, 0.4], [0.36, 0.4], [0.36, 0.43], [0.14, 0.43]], baseStyle);
    drawUV([[0.17, 0.5], [0.33, 0.5], [0.33, 0.53], [0.17, 0.53]], baseStyle);
    drawUV([[0.62, 0.3], [0.88, 0.3], [0.88, 0.33], [0.62, 0.33]], baseStyle);
    drawUV([[0.64, 0.4], [0.86, 0.4], [0.86, 0.43], [0.64, 0.43]], baseStyle);
    drawUV([[0.67, 0.5], [0.83, 0.5], [0.83, 0.53], [0.67, 0.53]], baseStyle);

    // Chain links connecting the bells at top
    for (let i = 0; i < 5; i++) {
        const cx = 0.4 + i * 0.045;
        drawUV([[cx, 0.72], [cx + 0.035, 0.72], [cx + 0.035, 0.78], [cx, 0.78]], baseStyle);
    }
    for (let i = 0; i < 4; i++) {
        const cx = 0.4 + i * 0.045;
        filledLine(drawUV, baseStyle, cx + 0.035, 0.75, cx + 0.045, 0.75, 0.025);
    }

    // Decorative finials on top of each bell
    drawUV([[0.25, 0.8], [0.23, 0.85], [0.27, 0.85]], baseStyle);
    drawUV([[0.75, 0.8], [0.73, 0.85], [0.77, 0.85]], baseStyle);

    // Sound lines radiating from bells
    filledLine(drawUV, baseStyle, 0.06, 0.25, 0.02, 0.22, 0.02);
    filledLine(drawUV, baseStyle, 0.06, 0.3, 0.01, 0.3, 0.02);
    filledLine(drawUV, baseStyle, 0.06, 0.35, 0.02, 0.38, 0.02);
    filledLine(drawUV, baseStyle, 0.08, 0.22, 0.05, 0.18, 0.02);
    filledLine(drawUV, baseStyle, 0.08, 0.38, 0.05, 0.42, 0.02);
    filledLine(drawUV, baseStyle, 0.94, 0.25, 0.98, 0.22, 0.02);
    filledLine(drawUV, baseStyle, 0.94, 0.3, 0.99, 0.3, 0.02);
    filledLine(drawUV, baseStyle, 0.94, 0.35, 0.98, 0.38, 0.02);
    filledLine(drawUV, baseStyle, 0.92, 0.22, 0.95, 0.18, 0.02);
    filledLine(drawUV, baseStyle, 0.92, 0.38, 0.95, 0.42, 0.02);

    // Hanging tassels below bells
    filledLine(drawUV, baseStyle, 0.25, 0.15, 0.25, 0.06, 0.025);
    drawUV([[0.22, 0.06], [0.28, 0.06], [0.27, 0.02], [0.23, 0.02]], baseStyle);
    filledLine(drawUV, baseStyle, 0.23, 0.02, 0.22, 0.0, 0.02);
    filledLine(drawUV, baseStyle, 0.25, 0.02, 0.25, 0.0, 0.02);
    filledLine(drawUV, baseStyle, 0.27, 0.02, 0.28, 0.0, 0.02);
    filledLine(drawUV, baseStyle, 0.75, 0.15, 0.75, 0.06, 0.025);
    drawUV([[0.72, 0.06], [0.78, 0.06], [0.77, 0.02], [0.73, 0.02]], baseStyle);
    filledLine(drawUV, baseStyle, 0.73, 0.02, 0.72, 0.0, 0.02);
    filledLine(drawUV, baseStyle, 0.75, 0.02, 0.75, 0.0, 0.02);
    filledLine(drawUV, baseStyle, 0.77, 0.02, 0.78, 0.0, 0.02);

    if (!filled) {
        filledLine(drawUV, baseStyle, 0.15, 0.25, 0.35, 0.25, 0.025);
        filledLine(drawUV, baseStyle, 0.19, 0.46, 0.31, 0.46, 0.025);
        filledLine(drawUV, baseStyle, 0.65, 0.25, 0.85, 0.25, 0.025);
        filledLine(drawUV, baseStyle, 0.69, 0.46, 0.81, 0.46, 0.025);

        filledBand(drawUV, baseStyle, [
            [0.04, 0.2], [0.02, 0.25], [0.01, 0.3],
            [0.02, 0.35], [0.04, 0.4],
        ], 0.025);
        filledBand(drawUV, baseStyle, [
            [0.96, 0.2], [0.98, 0.25], [0.99, 0.3],
            [0.98, 0.35], [0.96, 0.4],
        ], 0.025);

        for (let i = 0; i < 3; i++) {
            const dv = 0.35 + i * 0.06;
            const spread = 0.06 - i * 0.015;
            drawUV([[0.25 - 0.013, dv], [0.25 + 0.013, dv], [0.25 + 0.013, dv + 0.025], [0.25 - 0.013, dv + 0.025]], baseStyle);
            drawUV([[0.25 - spread - 0.013, dv], [0.25 - spread + 0.013, dv], [0.25 - spread + 0.013, dv + 0.025], [0.25 - spread - 0.013, dv + 0.025]], baseStyle);
            drawUV([[0.25 + spread - 0.013, dv], [0.25 + spread + 0.013, dv], [0.25 + spread + 0.013, dv + 0.025], [0.25 + spread - 0.013, dv + 0.025]], baseStyle);
            drawUV([[0.75 - 0.013, dv], [0.75 + 0.013, dv], [0.75 + 0.013, dv + 0.025], [0.75 - 0.013, dv + 0.025]], baseStyle);
            drawUV([[0.75 - spread - 0.013, dv], [0.75 - spread + 0.013, dv], [0.75 - spread + 0.013, dv + 0.025], [0.75 - spread - 0.013, dv + 0.025]], baseStyle);
            drawUV([[0.75 + spread - 0.013, dv], [0.75 + spread + 0.013, dv], [0.75 + spread + 0.013, dv + 0.025], [0.75 + spread - 0.013, dv + 0.025]], baseStyle);
        }

        const leftInner: [number, number][] = [[0.14, 0.33]];
        for (let i = 0; i <= 6; i++) {
            const t = Math.PI * (i / 6);
            leftInner.push([0.25 + 0.1 * Math.cos(t), 0.58 + 0.16 * Math.sin(t)]);
        }
        leftInner.push([0.36, 0.33]);
        drawUV(leftInner, baseStyle);

        const rightInner: [number, number][] = [[0.64, 0.33]];
        for (let i = 0; i <= 6; i++) {
            const t = Math.PI * (i / 6);
            rightInner.push([0.75 + 0.1 * Math.cos(t), 0.58 + 0.16 * Math.sin(t)]);
        }
        rightInner.push([0.86, 0.33]);
        drawUV(rightInner, baseStyle);

        for (let i = 0; i < 3; i++) {
            const bx = 0.2 + i * 0.05;
            drawUV([[bx, 0.26], [bx + 0.018, 0.28], [bx, 0.30], [bx - 0.018, 0.28]], 'filled');
        }
        for (let i = 0; i < 3; i++) {
            const bx = 0.7 + i * 0.05;
            drawUV([[bx, 0.26], [bx + 0.018, 0.28], [bx, 0.30], [bx - 0.018, 0.28]], 'filled');
        }

        drawUV([[0.11, 0.16], [0.39, 0.16], [0.39, 0.2], [0.11, 0.2]], baseStyle);
        drawUV([[0.61, 0.16], [0.89, 0.16], [0.89, 0.2], [0.61, 0.2]], baseStyle);

        for (let i = 0; i < 5; i++) {
            const cx = 0.4 + i * 0.045;
            drawUV([[cx + 0.005, 0.73], [cx + 0.03, 0.73], [cx + 0.03, 0.77], [cx + 0.005, 0.77]], baseStyle);
        }

        for (let i = 0; i < 6; i++) {
            const cx = 0.4 + i * 0.04;
            drawUV([[cx, 0.745], [cx + 0.012, 0.755], [cx, 0.765], [cx - 0.012, 0.755]], 'filled');
        }

        filledLine(drawUV, baseStyle, 0.2, 0.2, 0.2, 0.45, 0.025);
        filledLine(drawUV, baseStyle, 0.3, 0.2, 0.3, 0.45, 0.025);
        filledLine(drawUV, baseStyle, 0.7, 0.2, 0.7, 0.45, 0.025);
        filledLine(drawUV, baseStyle, 0.8, 0.2, 0.8, 0.45, 0.025);

        drawUV([[0.22, 0.82], [0.25, 0.88], [0.28, 0.82]], baseStyle);
        drawUV([[0.72, 0.82], [0.75, 0.88], [0.78, 0.82]], baseStyle);
    }
}
