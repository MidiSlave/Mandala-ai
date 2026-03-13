import type { DrawUV, PathStyle } from '../types';

/** Convert a 2-point line into a filled band with given width */
export function filledLine(
    drawUV: DrawUV,
    baseStyle: PathStyle,
    x1: number, y1: number, x2: number, y2: number, w: number = 0.025
): void {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return;
    const nx = (-dy / len) * w * 0.5;
    const ny = (dx / len) * w * 0.5;
    drawUV([
        [x1 + nx, y1 + ny], [x2 + nx, y2 + ny],
        [x2 - nx, y2 - ny], [x1 - nx, y1 - ny],
    ], baseStyle);
}

/** Convert a multi-point polyline into a filled band */
export function filledBand(
    drawUV: DrawUV,
    baseStyle: PathStyle,
    pts: [number, number][], w: number = 0.025
): void {
    const half = w * 0.5;
    const left: [number, number][] = [];
    const right: [number, number][] = [];
    for (let i = 0; i < pts.length; i++) {
        let nx: number, ny: number;
        if (i === 0) {
            const dx = pts[1][0] - pts[0][0];
            const dy = pts[1][1] - pts[0][1];
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            nx = -dy / len; ny = dx / len;
        } else if (i === pts.length - 1) {
            const dx = pts[i][0] - pts[i - 1][0];
            const dy = pts[i][1] - pts[i - 1][1];
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            nx = -dy / len; ny = dx / len;
        } else {
            const dx1 = pts[i][0] - pts[i - 1][0];
            const dy1 = pts[i][1] - pts[i - 1][1];
            const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1) || 1;
            const dx2 = pts[i + 1][0] - pts[i][0];
            const dy2 = pts[i + 1][1] - pts[i][1];
            const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2) || 1;
            nx = (-dy1 / len1 + -dy2 / len2) * 0.5;
            ny = (dx1 / len1 + dx2 / len2) * 0.5;
            const nlen = Math.sqrt(nx * nx + ny * ny) || 1;
            nx /= nlen; ny /= nlen;
        }
        left.push([pts[i][0] + nx * half, pts[i][1] + ny * half]);
        right.push([pts[i][0] - nx * half, pts[i][1] - ny * half]);
    }
    right.reverse();
    drawUV([...left, ...right], baseStyle);
}

/** Tapered vein — wider at base (first point), thinner at tip (last point) */
export function taperedVein(
    drawUV: DrawUV,
    baseStyle: PathStyle,
    pts: [number, number][], baseW: number = 0.03, tipW: number = 0.008
): void {
    const left: [number, number][] = [];
    const right: [number, number][] = [];
    for (let i = 0; i < pts.length; i++) {
        const t = pts.length > 1 ? i / (pts.length - 1) : 0;
        const w = (baseW * (1 - t) + tipW * t) * 0.5;
        let nx: number, ny: number;
        if (i === 0) {
            const dx = pts[1][0] - pts[0][0];
            const dy = pts[1][1] - pts[0][1];
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            nx = -dy / len; ny = dx / len;
        } else if (i === pts.length - 1) {
            const dx = pts[i][0] - pts[i - 1][0];
            const dy = pts[i][1] - pts[i - 1][1];
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            nx = -dy / len; ny = dx / len;
        } else {
            const dx1 = pts[i][0] - pts[i - 1][0];
            const dy1 = pts[i][1] - pts[i - 1][1];
            const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1) || 1;
            const dx2 = pts[i + 1][0] - pts[i][0];
            const dy2 = pts[i + 1][1] - pts[i][1];
            const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2) || 1;
            nx = (-dy1 / len1 + -dy2 / len2) * 0.5;
            ny = (dx1 / len1 + dx2 / len2) * 0.5;
            const nlen = Math.sqrt(nx * nx + ny * ny) || 1;
            nx /= nlen; ny /= nlen;
        }
        left.push([pts[i][0] + nx * w, pts[i][1] + ny * w]);
        right.push([pts[i][0] - nx * w, pts[i][1] - ny * w]);
    }
    right.reverse();
    drawUV([...left, ...right], baseStyle);
}
