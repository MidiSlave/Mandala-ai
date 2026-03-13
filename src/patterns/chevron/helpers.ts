/** Approximate a circle as an N-point polygon. */
export function circlePoints(cx: number, cy: number, r: number, n: number): [number, number][] {
    const pts: [number, number][] = [];
    for (let i = 0; i < n; i++) {
        const angle = (2 * Math.PI * i) / n;
        pts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
    }
    return pts;
}

/**
 * Build a filled band (thin rectangle) from a multi-point polyline.
 * For each segment, we offset perpendicular to both sides by `half`.
 * Returns a closed polygon suitable for 'filled' drawUV.
 */
export function bandFromPolyline(pts: [number, number][], half: number): [number, number][] {
    const left: [number, number][] = [];
    const right: [number, number][] = [];
    for (let i = 0; i < pts.length - 1; i++) {
        const [x1, y1] = pts[i];
        const [x2, y2] = pts[i + 1];
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy) || 1e-9;
        const nx = -dy / len * half;
        const ny = dx / len * half;
        if (i === 0) {
            left.push([x1 + nx, y1 + ny]);
            right.push([x1 - nx, y1 - ny]);
        }
        left.push([x2 + nx, y2 + ny]);
        right.push([x2 - nx, y2 - ny]);
    }
    return [...left, ...right.reverse()];
}

/** Build a filled arc band between two radii from the same center. */
export function arcBand(
    cx: number, cy: number,
    rInner: number, rOuter: number,
    startAngle: number, endAngle: number,
    segments: number
): [number, number][] {
    const outer: [number, number][] = [];
    const inner: [number, number][] = [];
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const angle = startAngle + t * (endAngle - startAngle);
        const sinA = Math.sin(angle);
        const cosA = Math.cos(angle);
        outer.push([cx + sinA * rOuter, cy + cosA * rOuter]);
        inner.push([cx + sinA * rInner, cy + cosA * rInner]);
    }
    return [...outer, ...inner.reverse()];
}
