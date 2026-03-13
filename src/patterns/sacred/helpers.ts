// Helper: filled circle polygon
export function circle(cx: number, cy: number, r: number, n: number = 28): [number, number][] {
    const pts: [number, number][] = [];
    for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    return pts;
}

// Helper: thick band between two points
export function band(u1: number, v1: number, u2: number, v2: number, width: number): [number, number][] {
    const dx = u2 - u1;
    const dy = v2 - v1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return [[u1, v1]];
    const nx = (-dy / len) * width * 0.5;
    const ny = (dx / len) * width * 0.5;
    return [
        [u1 + nx, v1 + ny], [u2 + nx, v2 + ny],
        [u2 - nx, v2 - ny], [u1 - nx, v1 - ny],
    ];
}

// Helper: filled diamond
export function diamond(cx: number, cy: number, rx: number, ry: number): [number, number][] {
    return [[cx, cy - ry], [cx + rx, cy], [cx, cy + ry], [cx - rx, cy]];
}

// Helper: arc band (thick arc segment)
export function arcBand(cx: number, cy: number, innerR: number, outerR: number,
    startA: number, endA: number, n: number = 24): [number, number][] {
    const pts: [number, number][] = [];
    for (let i = 0; i <= n; i++) {
        const a = startA + (i / n) * (endA - startA);
        pts.push([cx + outerR * Math.cos(a), cy + outerR * Math.sin(a)]);
    }
    for (let i = n; i >= 0; i--) {
        const a = startA + (i / n) * (endA - startA);
        pts.push([cx + innerR * Math.cos(a), cy + innerR * Math.sin(a)]);
    }
    return pts;
}

// Helper: vesica/almond shape between two circle centers
export function vesica(cx1: number, cy1: number, cx2: number, cy2: number, r: number, n: number = 20): [number, number][] {
    const dx = cx2 - cx1;
    const dy = cy2 - cy1;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d >= 2 * r || d === 0) return [];
    const baseAngle = Math.atan2(dy, dx);
    const halfAngle = Math.acos(d / (2 * r));
    const pts: [number, number][] = [];
    // Arc from circle 1
    for (let i = 0; i <= n; i++) {
        const a = baseAngle - halfAngle + (i / n) * 2 * halfAngle;
        pts.push([cx1 + r * Math.cos(a), cy1 + r * Math.sin(a)]);
    }
    // Arc from circle 2 (return)
    for (let i = 0; i <= n; i++) {
        const a = baseAngle + Math.PI + halfAngle - (i / n) * 2 * halfAngle;
        pts.push([cx2 + r * Math.cos(a), cy2 + r * Math.sin(a)]);
    }
    return pts;
}
