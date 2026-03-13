// Tiki face — simplified
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    const cx = 0.5, cy = 0.4;
    // Head outline
    const headW = 0.3, headH = 0.5;
    const head: [number, number][] = [];
    for (let s = 0; s <= 12; s++) {
        const a = (s / 12) * Math.PI * 2;
        head.push([cx + Math.cos(a) * headW, cy + Math.sin(a) * headH]);
    }
    drawUV(head, baseStyle);
    // Eyes — rectangular
    for (let side = -1; side <= 1; side += 2) {
        const eyeX = cx + side * 0.1;
        const eyeY = cy - 0.08;
        drawUV([
            [eyeX - 0.05, eyeY - 0.04],
            [eyeX + 0.05, eyeY - 0.04],
            [eyeX + 0.05, eyeY + 0.04],
            [eyeX - 0.05, eyeY + 0.04]
        ], filled ? 'opaque-outline' : 'filled');
        // Pupil
        drawUV([
            [eyeX - 0.015, eyeY - 0.015],
            [eyeX + 0.015, eyeY - 0.015],
            [eyeX + 0.015, eyeY + 0.015],
            [eyeX - 0.015, eyeY + 0.015]
        ], 'filled');
    }
    // Mouth
    const mouth: [number, number][] = [];
    for (let s = 0; s <= 8; s++) {
        const u = cx - 0.1 + (s / 8) * 0.2;
        const v = cy + 0.2 + Math.sin((s / 8) * Math.PI) * 0.04;
        mouth.push([u, v]);
    }
    drawUV(mouth, baseStyle);
    // Nose
    drawUV([
        [cx, cy - 0.02], [cx + 0.03, cy + 0.08],
        [cx - 0.03, cy + 0.08]
    ], 'outline');
}
