// Lily stem — vertical organic form
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const stemU = 0.5;
    // Main stem
    const stem: [number, number][] = [];
    for (let s = 0; s <= 16; s++) {
        const v = s / 16;
        const sway = Math.sin(v * Math.PI * 1.5) * 0.06;
        stem.push([stemU + sway, v]);
    }
    drawUV(stem, baseStyle);

    // Branching leaves
    const nLeaves = 3 + Math.floor(r() * 3);
    for (let lf = 0; lf < nLeaves; lf++) {
        const attachV = 0.2 + (lf / nLeaves) * 0.6;
        const attachSway = Math.sin(attachV * Math.PI * 1.5) * 0.06;
        const attachU = stemU + attachSway;
        const side = lf % 2 === 0 ? 1 : -1;
        const leafLen = 0.12 + r() * 0.06;
        const pts: [number, number][] = [];
        pts.push([attachU, attachV]);
        for (let s = 1; s <= 8; s++) {
            const t = s / 8;
            const curl = Math.sin(t * Math.PI) * 0.04;
            pts.push([
                attachU + side * t * leafLen,
                attachV - t * leafLen * 0.5 + curl
            ]);
        }
        drawUV(pts, 'line');
        // Leaf body
        const body: [number, number][] = [];
        body.push([attachU, attachV]);
        for (let s = 0; s <= 6; s++) {
            const t = s / 6;
            const width = Math.sin(t * Math.PI) * 0.025;
            body.push([
                attachU + side * t * leafLen,
                attachV - t * leafLen * 0.5 + width
            ]);
        }
        for (let s = 6; s >= 0; s--) {
            const t = s / 6;
            const width = Math.sin(t * Math.PI) * 0.025;
            body.push([
                attachU + side * t * leafLen,
                attachV - t * leafLen * 0.5 - width
            ]);
        }
        drawUV(body, lf % 3 === 0 ? baseStyle : 'outline');
    }
}
