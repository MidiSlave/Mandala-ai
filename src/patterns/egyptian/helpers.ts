// Helper: filled rectangle
export function rect(u1: number, v1: number, u2: number, v2: number): [number, number][] {
    return [[u1, v1], [u2, v1], [u2, v2], [u1, v2]];
}

// Helper: diamond
export function diamond(cx: number, cy: number, rx: number, ry: number): [number, number][] {
    return [[cx, cy - ry], [cx + rx, cy], [cx, cy + ry], [cx - rx, cy]];
}

// Helper: circle polygon
export function circle(cx: number, cy: number, r: number, n: number = 20): [number, number][] {
    const pts: [number, number][] = [];
    for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    return pts;
}

// Helper: lens/eye shape — pointed at ends, bulging in middle
export function eyeShape(cx: number, cy: number, width: number, height: number, n: number = 16): [number, number][] {
    const pts: [number, number][] = [];
    for (let i = 0; i <= n; i++) {
        const t = i / n;
        const u = cx - width / 2 + t * width;
        const v = cy - height * Math.sin(t * Math.PI);
        pts.push([u, v]);
    }
    for (let i = n; i >= 0; i--) {
        const t = i / n;
        const u = cx - width / 2 + t * width;
        const v = cy + height * Math.sin(t * Math.PI);
        pts.push([u, v]);
    }
    return pts;
}

// Helper: thick band between two points
export function band(u1: number, v1: number, u2: number, v2: number, w: number): [number, number][] {
    const dx = u2 - u1;
    const dy = v2 - v1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return [[u1, v1]];
    const nx = (-dy / len) * w * 0.5;
    const ny = (dx / len) * w * 0.5;
    return [[u1 + nx, v1 + ny], [u2 + nx, v2 + ny], [u2 - nx, v2 - ny], [u1 - nx, v1 - ny]];
}
