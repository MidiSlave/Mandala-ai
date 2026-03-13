// Helper: generate points along a circular arc as [u, v] pairs
export function arcPoints(
    cx: number, cy: number, r: number,
    startAngle: number, endAngle: number, n: number
): [number, number][] {
    const pts: [number, number][] = [];
    for (let i = 0; i <= n; i++) {
        const t = i / n;
        const a = startAngle + t * (endAngle - startAngle);
        pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    return pts;
}

// Helper: create a thick band (filled polygon) along a path by offsetting both sides
export function thickBand(
    centerPoints: [number, number][],
    width: number
): [number, number][] {
    const half = width / 2;
    const left: [number, number][] = [];
    const right: [number, number][] = [];

    for (let i = 0; i < centerPoints.length; i++) {
        const [cu, cv] = centerPoints[i];
        // Compute normal direction from neighboring points
        let dx: number, dy: number;
        if (i === 0) {
            dx = centerPoints[1][0] - cu;
            dy = centerPoints[1][1] - cv;
        } else if (i === centerPoints.length - 1) {
            dx = cu - centerPoints[i - 1][0];
            dy = cv - centerPoints[i - 1][1];
        } else {
            dx = centerPoints[i + 1][0] - centerPoints[i - 1][0];
            dy = centerPoints[i + 1][1] - centerPoints[i - 1][1];
        }
        const len = Math.sqrt(dx * dx + dy * dy) || 1e-6;
        const nx = -dy / len;
        const ny = dx / len;

        left.push([cu + nx * half, cv + ny * half]);
        right.push([cu - nx * half, cv - ny * half]);
    }

    // Combine into a closed polygon: left forward, right reversed
    return [...left, ...right.reverse()];
}

// Helper: generate arc center points
export function arcCenterPoints(
    cx: number, cy: number, r: number,
    startAngle: number, endAngle: number, n: number
): [number, number][] {
    const pts: [number, number][] = [];
    for (let i = 0; i <= n; i++) {
        const t = i / n;
        const a = startAngle + t * (endAngle - startAngle);
        pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    return pts;
}
