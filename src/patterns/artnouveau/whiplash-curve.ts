// Whiplash curve — signature Art Nouveau S-curve
import type { PatternContext } from '../types';

export function draw({ drawUV, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const nCurves = 2 + Math.floor(r() * 2);
    for (let c = 0; c < nCurves; c++) {
        const offset = (c + 1) / (nCurves + 1);
        const pts: [number, number][] = [];
        for (let s = 0; s <= 24; s++) {
            const t = s / 24;
            const u = t;
            // Double S-curve with varying amplitude
            const amp1 = 0.1 * Math.sin(t * Math.PI);
            const amp2 = 0.05 * Math.sin(t * Math.PI * 2);
            const v = offset + amp1 * Math.sin(t * Math.PI * 2) + amp2 * Math.cos(t * Math.PI * 3);
            pts.push([u, v]);
        }
        drawUV(pts, c === 0 ? baseStyle : 'line');

        // Organic leaf forms along the curve
        const nLeaves = 3 + Math.floor(r() * 2);
        for (let lf = 0; lf < nLeaves; lf++) {
            const lt = (lf + 0.5) / nLeaves;
            const lu = lt;
            const lfAmp1 = 0.1 * Math.sin(lt * Math.PI);
            const lv = offset + lfAmp1 * Math.sin(lt * Math.PI * 2);
            const leafSize = 0.03 + r() * 0.02;
            const dir = lf % 2 === 0 ? 1 : -1;
            const leaf: [number, number][] = [];
            for (let s = 0; s <= 8; s++) {
                const a = (s / 8) * Math.PI;
                const leafR = leafSize * Math.sin(a);
                leaf.push([lu + Math.cos(a) * leafSize, lv + dir * leafR]);
            }
            drawUV(leaf, lf % 2 === 0 ? baseStyle : 'outline');
        }
    }
}
