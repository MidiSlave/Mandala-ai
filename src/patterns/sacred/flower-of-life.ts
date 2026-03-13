import type { PatternContext } from '../types';
import { circle, vesica } from './helpers';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    const mainStyle = filled ? 'filled' as const : 'outline' as const;
    const detailStyle = filled ? 'opaque-outline' as const : 'filled' as const;

    const cx = 0.5, cy = 0.5;
    const r = 0.22;
    const spacing = 0.20;

    // Background circle
    drawUV(circle(cx, cy, 0.46, 32), baseStyle);
    drawUV(circle(cx, cy, 0.42, 32), detailStyle);

    // 7 circle positions
    const positions: [number, number][] = [[cx, cy]];
    for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        positions.push([cx + spacing * Math.cos(a), cy + spacing * Math.sin(a)]);
    }

    // Draw the vesica/petal shapes at every intersection — these are the "flowers"
    for (let i = 0; i < 6; i++) {
        // Between center and each surrounding circle
        const v = vesica(cx, cy, positions[i + 1][0], positions[i + 1][1], r, 16);
        if (v.length > 0) drawUV(v, filled ? 'filled' : 'outline');
    }

    // Petals between adjacent surrounding circles
    for (let i = 0; i < 6; i++) {
        const j = (i + 1) % 6;
        const v = vesica(positions[i + 1][0], positions[i + 1][1], positions[j + 1][0], positions[j + 1][1], r, 16);
        if (v.length > 0) drawUV(v, detailStyle);
    }

    // Bold center flower
    drawUV(circle(cx, cy, 0.08, 16), filled ? baseStyle : 'filled');
    drawUV(circle(cx, cy, 0.04, 12), detailStyle);

    // Dots at surrounding circle centers
    for (let i = 1; i < 7; i++) {
        drawUV(circle(positions[i][0], positions[i][1], 0.03, 12), filled ? detailStyle : 'filled');
    }

    // Corner wedges filling the outer ring
    for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const a2 = ((i + 0.5) / 12) * Math.PI * 2;
        drawUV([
            [cx + 0.42 * Math.cos(a), cy + 0.42 * Math.sin(a)],
            [cx + 0.46 * Math.cos(a2), cy + 0.46 * Math.sin(a2)],
            [cx + 0.42 * Math.cos(a2 + (0.5 / 12) * Math.PI * 2), cy + 0.42 * Math.sin(a2 + (0.5 / 12) * Math.PI * 2)],
        ], 'filled');
    }
}
