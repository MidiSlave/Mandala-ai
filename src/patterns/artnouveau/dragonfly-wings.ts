// Dragonfly wings — veined, organic
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const wingCx = 0.5, wingCy = 0.5;
    // Four wings
    for (let w = 0; w < 4; w++) {
        const baseAngle = (w / 4) * Math.PI * 2 + Math.PI / 4;
        const wingLen = 0.3 + r() * 0.08;
        const wingWidth = 0.1;
        const pts: [number, number][] = [];
        // Wing outline
        pts.push([wingCx, wingCy]);
        for (let s = 0; s <= 10; s++) {
            const t = s / 10;
            const width = Math.sin(t * Math.PI) * wingWidth;
            const perpA = baseAngle + Math.PI / 2;
            const mainX = wingCx + Math.cos(baseAngle) * t * wingLen;
            const mainY = wingCy + Math.sin(baseAngle) * t * wingLen;
            pts.push([mainX + Math.cos(perpA) * width, mainY + Math.sin(perpA) * width]);
        }
        for (let s = 10; s >= 0; s--) {
            const t = s / 10;
            const width = Math.sin(t * Math.PI) * wingWidth;
            const perpA = baseAngle - Math.PI / 2;
            const mainX = wingCx + Math.cos(baseAngle) * t * wingLen;
            const mainY = wingCy + Math.sin(baseAngle) * t * wingLen;
            pts.push([mainX + Math.cos(perpA) * width, mainY + Math.sin(perpA) * width]);
        }
        drawUV(pts, w % 2 === 0 ? baseStyle : 'outline');
        // Wing veins
        for (let v = 0; v < 3; v++) {
            const t = (v + 1) / 4;
            const mx = wingCx + Math.cos(baseAngle) * t * wingLen;
            const my = wingCy + Math.sin(baseAngle) * t * wingLen;
            const perpA = baseAngle + Math.PI / 2;
            const veinHalf = Math.sin(t * Math.PI) * wingWidth * 0.8;
            drawUV([
                [mx + Math.cos(perpA) * veinHalf, my + Math.sin(perpA) * veinHalf],
                [mx - Math.cos(perpA) * veinHalf, my - Math.sin(perpA) * veinHalf]
            ], 'line');
        }
    }
}
