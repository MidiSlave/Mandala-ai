export function circleUV(cx: number, cy: number, rad: number, n: number = 12): [number, number][] {
    const pts: [number, number][] = [];
    for (let i = 0; i <= n; i++) {
        const a = (i / n) * Math.PI * 2;
        pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]);
    }
    return pts;
}
