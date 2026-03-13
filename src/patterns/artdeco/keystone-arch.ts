// Keystone Arch — pointed arch with internal nested bands
import type { PatternContext } from '../types';
import { filledRect } from './helpers';

export function draw({ drawUV, filled, baseStyle }: PatternContext): void {
    const mainStyle = filled ? 'filled' as const : 'outline' as const;
    const detailStyle = filled ? 'opaque-outline' as const : 'filled' as const;

    // Outer arch shape (pointed/ogee arch)
    const archPts = (inset: number, topV: number): [number, number][] => {
        const pts: [number, number][] = [];
        const leftBase = 0.05 + inset;
        const rightBase = 0.95 - inset;
        const cx = 0.5;
        const baseV = 0.0 + inset * 0.3;
        const peakV = topV;

        // Left column base
        pts.push([leftBase, baseV]);

        // Left side of arch — curve up to peak
        const numArcPts = 20;
        for (let i = 0; i <= numArcPts; i++) {
            const t = i / numArcPts;
            // Ogival (pointed) arch: two arcs meeting at a point
            const u = leftBase + t * (cx - leftBase);
            // Parabolic rise with a pointed peak
            const v = baseV + (peakV - baseV) * Math.pow(t, 0.6);
            pts.push([u, v]);
        }
        // Right side of arch — curve down from peak
        for (let i = numArcPts; i >= 0; i--) {
            const t = i / numArcPts;
            const u = rightBase - t * (rightBase - cx);
            const v = baseV + (peakV - baseV) * Math.pow(t, 0.6);
            pts.push([u, v]);
        }

        // Right column base
        pts.push([rightBase, baseV]);

        return pts;
    };

    // Main outer arch body
    const outerArch = archPts(0, 0.92);
    drawUV(outerArch, baseStyle);

    // Nested inner arches (cutouts or outlines)
    const nestInsets = [0.08, 0.16, 0.24, 0.32];
    const nestTops = [0.82, 0.72, 0.60, 0.46];
    for (let i = 0; i < nestInsets.length; i++) {
        const inner = archPts(nestInsets[i], nestTops[i]);
        const style = i % 2 === 0 ? detailStyle : mainStyle;
        drawUV(inner, style);
    }

    // Bold pillar columns on each side
    drawUV(filledRect(0.02, 0.0, 0.12, 0.50), baseStyle);
    drawUV(filledRect(0.88, 0.0, 0.98, 0.50), baseStyle);

    // Column capital details
    if (filled) {
        drawUV(filledRect(0.04, 0.42, 0.10, 0.48), 'opaque-outline');
        drawUV(filledRect(0.90, 0.42, 0.96, 0.48), 'opaque-outline');
    } else {
        drawUV(filledRect(0.04, 0.42, 0.10, 0.48), 'filled');
        drawUV(filledRect(0.90, 0.42, 0.96, 0.48), 'filled');
    }

    // Keystone at the apex
    drawUV([
        [0.44, 0.84], [0.56, 0.84],
        [0.52, 0.94], [0.48, 0.94],
    ], detailStyle);

    // Decorative band across base
    drawUV(filledRect(0.02, 0.0, 0.98, 0.04), 'filled');

    // Small accent squares along pillar faces
    for (let i = 0; i < 4; i++) {
        const v = 0.08 + i * 0.09;
        drawUV(filledRect(0.04, v, 0.10, v + 0.04), detailStyle);
        drawUV(filledRect(0.90, v, 0.96, v + 0.04), detailStyle);
    }
}
