// Helper: generate a small diamond/dot at (cx, cy) with radius r
export function dot(cx: number, cy: number, r: number): [number, number][] {
    return [[cx, cy - r], [cx + r, cy], [cx, cy + r], [cx - r, cy]];
}

// Helper: generate a small square at (cx, cy) with half-size s
export function sq(cx: number, cy: number, s: number): [number, number][] {
    return [[cx - s, cy - s], [cx + s, cy - s], [cx + s, cy + s], [cx - s, cy + s]];
}

// Helper: generate an oval approximation centered at (cx, cy) with radii rx, ry
export function oval(cx: number, cy: number, rx: number, ry: number, n = 10): [number, number][] {
    const pts: [number, number][] = [];
    for (let i = 0; i < n; i++) {
        const a = (2 * Math.PI * i) / n;
        pts.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]);
    }
    return pts;
}
