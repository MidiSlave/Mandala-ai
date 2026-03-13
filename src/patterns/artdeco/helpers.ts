// Helper: rectangle as [number, number][]
export function filledRect(u1: number, v1: number, u2: number, v2: number): [number, number][] {
    return [[u1, v1], [u2, v1], [u2, v2], [u1, v2]];
}

// Helper: arc band (filled region between inner and outer arc)
export function arcBand(
    centerU: number, centerV: number,
    innerR: number, outerR: number,
    startAngle: number, endAngle: number,
    numPoints: number
): [number, number][] {
    const outerPts: [number, number][] = [];
    const innerPts: [number, number][] = [];
    for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        const angle = startAngle + t * (endAngle - startAngle);
        outerPts.push([centerU + outerR * Math.cos(angle), centerV + outerR * Math.sin(angle)]);
        innerPts.push([centerU + innerR * Math.cos(angle), centerV + innerR * Math.sin(angle)]);
    }
    // Outer arc forward, inner arc reversed
    return [...outerPts, ...innerPts.reverse()];
}

// Helper: filled band that looks like a thick line (rectangle between two points with width)
export function thickBand(u1: number, v1: number, u2: number, v2: number, width: number): [number, number][] {
    const dx = u2 - u1;
    const dy = v2 - v1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return [[u1, v1]];
    const nx = (-dy / len) * width * 0.5;
    const ny = (dx / len) * width * 0.5;
    return [
        [u1 + nx, v1 + ny],
        [u2 + nx, v2 + ny],
        [u2 - nx, v2 - ny],
        [u1 - nx, v1 - ny],
    ];
}
