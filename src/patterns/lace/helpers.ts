/** Approximate a circle as an N-point polygon. */
export function circlePoints(cx: number, cy: number, r: number, n: number): [number, number][] {
    const pts: [number, number][] = [];
    for (let i = 0; i < n; i++) {
        const angle = (2 * Math.PI * i) / n;
        pts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
    }
    return pts;
}

/** Small diamond centered at (cx, cy). */
export function diamond(cx: number, cy: number, s: number): [number, number][] {
    return [
        [cx, cy - s],
        [cx + s, cy],
        [cx, cy + s],
        [cx - s, cy],
    ];
}

/** Generate a teardrop shape: pointed at (px, py), bulging toward (bx, by) with given width. */
export function teardrop(
    px: number, py: number,
    bx: number, by: number,
    width: number, segments: number
): [number, number][] {
    const pts: [number, number][] = [];
    const dx = bx - px;
    const dy = by - py;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = -dy / len;
    const ny = dx / len;

    pts.push([px, py]);

    const count = segments;
    for (let i = 1; i <= count; i++) {
        const t = i / count;
        const w = width * Math.sin(Math.PI * Math.pow(t, 0.7));
        const cx = px + dx * t;
        const cy = py + dy * t;
        pts.push([cx + nx * w, cy + ny * w]);
    }
    for (let i = count - 1; i >= 1; i--) {
        const t = i / count;
        const w = width * Math.sin(Math.PI * Math.pow(t, 0.7));
        const cx = px + dx * t;
        const cy = py + dy * t;
        pts.push([cx - nx * w, cy - ny * w]);
    }

    return pts;
}

/**
 * Build a thin filled band (quad strip) from a 2-point line.
 * Returns a 4-point polygon with the given half-width perpendicular to the line direction.
 */
export function lineToBand(
    u0: number, v0: number,
    u1: number, v1: number,
    halfW: number
): [number, number][] {
    const dx = u1 - u0;
    const dy = v1 - v0;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 1e-9) return [[u0, v0], [u1, v1], [u1, v1], [u0, v0]];
    const nx = -dy / len * halfW;
    const ny = dx / len * halfW;
    return [
        [u0 + nx, v0 + ny],
        [u1 + nx, v1 + ny],
        [u1 - nx, v1 - ny],
        [u0 - nx, v0 - ny],
    ];
}

/**
 * Build a thin filled arc band from a polyline (open curve).
 * Offsets each point by +/- halfW along the approximate normal.
 */
export function arcToBand(
    pts: [number, number][],
    halfW: number
): [number, number][] {
    const n = pts.length;
    if (n < 2) return pts;
    const left: [number, number][] = [];
    const right: [number, number][] = [];
    for (let i = 0; i < n; i++) {
        let tx: number, ty: number;
        if (i === 0) {
            tx = pts[1][0] - pts[0][0];
            ty = pts[1][1] - pts[0][1];
        } else if (i === n - 1) {
            tx = pts[n - 1][0] - pts[n - 2][0];
            ty = pts[n - 1][1] - pts[n - 2][1];
        } else {
            tx = pts[i + 1][0] - pts[i - 1][0];
            ty = pts[i + 1][1] - pts[i - 1][1];
        }
        const len = Math.sqrt(tx * tx + ty * ty);
        if (len < 1e-9) {
            left.push(pts[i]);
            right.push(pts[i]);
            continue;
        }
        const nx = -ty / len * halfW;
        const ny = tx / len * halfW;
        left.push([pts[i][0] + nx, pts[i][1] + ny]);
        right.push([pts[i][0] - nx, pts[i][1] - ny]);
    }
    return [...left, ...right.reverse()];
}

/**
 * Build a thin filled wedge from a base point to an outer point.
 * The wedge starts very narrow at base and widens to `tipHalfW` at the outer end.
 */
export function lineToWedge(
    u0: number, v0: number,
    u1: number, v1: number,
    baseHalfW: number,
    tipHalfW: number
): [number, number][] {
    const dx = u1 - u0;
    const dy = v1 - v0;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 1e-9) return [[u0, v0], [u1, v1], [u1, v1], [u0, v0]];
    const nx = -dy / len;
    const ny = dx / len;
    return [
        [u0 + nx * baseHalfW, v0 + ny * baseHalfW],
        [u1 + nx * tipHalfW, v1 + ny * tipHalfW],
        [u1 - nx * tipHalfW, v1 - ny * tipHalfW],
        [u0 - nx * baseHalfW, v0 - ny * baseHalfW],
    ];
}
