// Silver Fern / Ponga — New Zealand iconic curling fern frond (koru)
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // Main rachis (stem) — gentle S-curve
    const rachis: [number, number][] = [];
    const numPts = 20;
    for (let i = 0; i <= numPts; i++) {
        const t = i / numPts;
        const x = 0.50 + Math.sin(t * Math.PI * 0.4) * 0.08;
        const y = 0.90 - t * 0.82;
        rachis.push([x, y]);
    }
    // Draw rachis as thick line
    drawUV(rachis, 'line');

    // Koru — spiral unfurling tip
    const koru: [number, number][] = [];
    for (let i = 0; i <= 12; i++) {
        const t = (i / 12) * Math.PI * 1.8;
        const spiralR = 0.06 - (i / 12) * 0.04;
        koru.push([
            0.52 + Math.cos(t + Math.PI) * spiralR,
            0.10 + Math.sin(t + Math.PI) * spiralR
        ]);
    }
    drawUV(koru, mainStyle);

    // Pinnae (leaflets) — pairs along the rachis
    const numPinnae = 10;
    for (let i = 1; i < numPinnae; i++) {
        const t = i / numPinnae;
        const stemX = 0.50 + Math.sin(t * Math.PI * 0.4) * 0.08;
        const stemY = 0.90 - t * 0.82;
        const pinnaLen = 0.08 + (1 - Math.abs(t - 0.5) * 2) * 0.10;
        const angle = 0.3 + t * 0.3;

        // Right pinna
        const rPinna: [number, number][] = [[stemX, stemY]];
        for (let j = 1; j <= 5; j++) {
            const pf = j / 5;
            const px = stemX + Math.cos(-angle) * pinnaLen * pf;
            const py = stemY - Math.sin(angle) * pinnaLen * pf * 0.5;
            rPinna.push([px, py]);
        }
        drawUV(rPinna, mainStyle);

        // Right sub-pinnae (tiny leaflets)
        for (let j = 1; j <= 3; j++) {
            const pf = j / 4;
            const px = stemX + Math.cos(-angle) * pinnaLen * pf;
            const py = stemY - Math.sin(angle) * pinnaLen * pf * 0.5;
            drawUV([
                [px, py],
                [px + 0.015, py - 0.02],
                [px + 0.025, py - 0.01]
            ], detailStyle);
        }

        // Left pinna
        const lPinna: [number, number][] = [[stemX, stemY]];
        for (let j = 1; j <= 5; j++) {
            const pf = j / 5;
            const px = stemX - Math.cos(angle) * pinnaLen * pf;
            const py = stemY - Math.sin(angle) * pinnaLen * pf * 0.5;
            lPinna.push([px, py]);
        }
        drawUV(lPinna, mainStyle);

        // Left sub-pinnae
        for (let j = 1; j <= 3; j++) {
            const pf = j / 4;
            const px = stemX - Math.cos(angle) * pinnaLen * pf;
            const py = stemY - Math.sin(angle) * pinnaLen * pf * 0.5;
            drawUV([
                [px, py],
                [px - 0.015, py - 0.02],
                [px - 0.025, py - 0.01]
            ], detailStyle);
        }
    }
}
