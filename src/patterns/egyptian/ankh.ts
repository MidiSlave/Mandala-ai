// Ankh / Hieroglyph — bold ankh symbol with decorative borders
import type { PatternContext } from '../types';
import { rect, diamond } from './helpers';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    const mainStyle = filled ? 'filled' as const : 'outline' as const;
    const detailStyle = filled ? 'opaque-outline' as const : 'filled' as const;

    const cx = 0.5;

    // Side border bands
    drawUV(rect(0.0, 0.0, 0.06, 1.0), baseStyle);
    drawUV(rect(0.94, 0.0, 1.0, 1.0), baseStyle);

    // Top border with small diamonds
    drawUV(rect(0.0, 0.0, 1.0, 0.05), baseStyle);
    for (let i = 0; i < 6; i++) {
        const x = 0.10 + i * 0.16;
        drawUV(diamond(x, 0.10, 0.03, 0.04), 'filled');
    }

    // Ankh loop (teardrop/oval at top)
    const loopPts: [number, number][] = [];
    const loopN = 24;
    for (let i = 0; i <= loopN; i++) {
        const a = (i / loopN) * Math.PI * 2;
        const rx = 0.14;
        const ry = 0.16;
        loopPts.push([cx + rx * Math.cos(a), 0.30 + ry * Math.sin(a)]);
    }
    drawUV(loopPts, baseStyle);

    // Loop hole (inner)
    const holeN = 20;
    const holePts: [number, number][] = [];
    for (let i = 0; i <= holeN; i++) {
        const a = (i / holeN) * Math.PI * 2;
        holePts.push([cx + 0.07 * Math.cos(a), 0.30 + 0.09 * Math.sin(a)]);
    }
    drawUV(holePts, detailStyle);

    // Crossbar (horizontal arms)
    drawUV(rect(0.18, 0.44, 0.82, 0.52), baseStyle);
    drawUV(rect(0.22, 0.46, 0.78, 0.50), detailStyle);

    // Vertical staff (below crossbar)
    drawUV(rect(0.40, 0.52, 0.60, 0.88), baseStyle);
    drawUV(rect(0.44, 0.55, 0.56, 0.85), detailStyle);

    // Staff base
    drawUV(rect(0.32, 0.88, 0.68, 0.94), baseStyle);

    // Bottom border
    drawUV(rect(0.0, 0.95, 1.0, 1.0), baseStyle);

    // Decorative wings flanking the ankh
    // Left wing
    for (let i = 0; i < 4; i++) {
        const baseX = 0.18 - i * 0.02;
        const y = 0.38 + i * 0.03;
        const featherPts: [number, number][] = [];
        const fn = 8;
        for (let j = 0; j <= fn; j++) {
            const t = j / fn;
            featherPts.push([baseX - t * 0.10, y - 0.02 * Math.sin(t * Math.PI)]);
        }
        for (let j = fn; j >= 0; j--) {
            const t = j / fn;
            featherPts.push([baseX - t * 0.10, y + 0.015 * Math.sin(t * Math.PI)]);
        }
        drawUV(featherPts, i % 2 === 0 ? baseStyle : mainStyle);
    }
    // Right wing (mirror)
    for (let i = 0; i < 4; i++) {
        const baseX = 0.82 + i * 0.02;
        const y = 0.38 + i * 0.03;
        const featherPts: [number, number][] = [];
        const fn = 8;
        for (let j = 0; j <= fn; j++) {
            const t = j / fn;
            featherPts.push([baseX + t * 0.10, y - 0.02 * Math.sin(t * Math.PI)]);
        }
        for (let j = fn; j >= 0; j--) {
            const t = j / fn;
            featherPts.push([baseX + t * 0.10, y + 0.015 * Math.sin(t * Math.PI)]);
        }
        drawUV(featherPts, i % 2 === 0 ? baseStyle : mainStyle);
    }

    // Small ankh symbols at bottom corners
    for (const sx of [0.18, 0.82]) {
        // Mini loop
        const miniLoop: [number, number][] = [];
        for (let i = 0; i < 12; i++) {
            const a = (i / 12) * Math.PI * 2;
            miniLoop.push([sx + 0.04 * Math.cos(a), 0.78 + 0.05 * Math.sin(a)]);
        }
        drawUV(miniLoop, 'filled');
        // Mini crossbar
        drawUV(rect(sx - 0.06, 0.82, sx + 0.06, 0.84), 'filled');
        // Mini staff
        drawUV(rect(sx - 0.02, 0.84, sx + 0.02, 0.92), 'filled');
    }
}
