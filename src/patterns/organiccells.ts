import type { PatternSet, PatternContext } from './types';

function circleUV(cx: number, cy: number, rad: number, n: number = 12): [number, number][] {
    const pts: [number, number][] = [];
    for (let i = 0; i <= n; i++) {
        const a = (i / n) * Math.PI * 2;
        pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]);
    }
    return pts;
}

const organicCellPatterns: PatternSet = {
    name: 'Organic Cells',
    count: 6,
    draw: (type: number, { drawUV, filled, baseStyle, rng }: PatternContext) => {
        const r = rng ?? (() => Math.random());

        switch (type) {
            case 0: { // Circle packing — non-overlapping circles filling space
                const maxCircles = 12 + Math.floor(r() * 8);
                const circles: { cx: number; cy: number; rad: number }[] = [];
                let attempts = 0;

                while (circles.length < maxCircles && attempts < 200) {
                    attempts++;
                    const cx = 0.1 + r() * 0.8;
                    const cy = 0.1 + r() * 0.8;
                    const maxRad = 0.15;
                    const minRad = 0.02;
                    let rad = minRad + r() * (maxRad - minRad);

                    // Check for overlap with existing circles
                    let valid = true;
                    for (const c of circles) {
                        const dx = cx - c.cx;
                        const dy = cy - c.cy;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < rad + c.rad + 0.01) {
                            rad = Math.max(minRad, dist - c.rad - 0.01);
                            if (rad < minRad) { valid = false; break; }
                        }
                    }
                    // Check bounds
                    if (cx - rad < 0.02 || cx + rad > 0.98 || cy - rad < 0.02 || cy + rad > 0.98) {
                        valid = false;
                    }

                    if (valid && rad >= minRad) {
                        circles.push({ cx, cy, rad });
                    }
                }

                for (let i = 0; i < circles.length; i++) {
                    const c = circles[i];
                    const n = c.rad > 0.06 ? 14 : 8;
                    const style = filled
                        ? (i % 3 === 0 ? 'filled' : (i % 3 === 1 ? 'opaque-outline' : 'outline'))
                        : (i % 2 === 0 ? 'outline' : 'line');
                    drawUV(circleUV(c.cx, c.cy, c.rad, n), style);

                    // Inner circle for larger circles
                    if (c.rad > 0.05) {
                        drawUV(circleUV(c.cx, c.cy, c.rad * 0.5, 8), filled ? 'opaque-outline' : 'outline');
                    }
                }
                break;
            }

            case 1: { // Metaballs — organic merging blobs
                const numBlobs = 3 + Math.floor(r() * 3);
                const blobs: [number, number][] = [];
                for (let i = 0; i < numBlobs; i++) {
                    blobs.push([0.2 + r() * 0.6, 0.2 + r() * 0.6]);
                }

                // Sample field and draw contours at threshold
                const gridSize = 16;
                const threshold = 1.2 + r() * 0.6;
                const cellW = 1.0 / gridSize;
                const cellH = 1.0 / gridSize;

                const field = (u: number, v: number): number => {
                    let sum = 0;
                    for (const b of blobs) {
                        const dx = u - b[0];
                        const dy = v - b[1];
                        sum += 1 / (dx * dx + dy * dy + 0.001);
                    }
                    return sum;
                };

                // Simple marching squares - draw edges where field crosses threshold
                for (let row = 0; row < gridSize; row++) {
                    for (let col = 0; col < gridSize; col++) {
                        const u0 = col * cellW;
                        const v0 = row * cellH;
                        const u1 = u0 + cellW;
                        const v1 = v0 + cellH;

                        const f00 = field(u0, v0) > threshold ? 1 : 0;
                        const f10 = field(u1, v0) > threshold ? 1 : 0;
                        const f01 = field(u0, v1) > threshold ? 1 : 0;
                        const f11 = field(u1, v1) > threshold ? 1 : 0;
                        const config = f00 | (f10 << 1) | (f01 << 2) | (f11 << 3);

                        if (config === 0 || config === 15) continue;

                        // Draw cell interior when all corners inside (filled mode)
                        if (filled && config === 15) {
                            drawUV([[u0, v0], [u1, v0], [u1, v1], [u0, v1]], 'filled');
                        }

                        // Edge midpoints
                        const top: [number, number] = [(u0 + u1) / 2, v0];
                        const bot: [number, number] = [(u0 + u1) / 2, v1];
                        const left: [number, number] = [u0, (v0 + v1) / 2];
                        const right: [number, number] = [u1, (v0 + v1) / 2];

                        // Simplified contour edges
                        if (config === 1 || config === 14) drawUV([top, left], 'line');
                        else if (config === 2 || config === 13) drawUV([top, right], 'line');
                        else if (config === 4 || config === 11) drawUV([left, bot], 'line');
                        else if (config === 8 || config === 7) drawUV([right, bot], 'line');
                        else if (config === 3 || config === 12) drawUV([left, right], 'line');
                        else if (config === 5 || config === 10) drawUV([top, bot], 'line');
                        else if (config === 6 || config === 9) {
                            drawUV([top, left], 'line');
                            drawUV([right, bot], 'line');
                        }
                    }
                }

                // Draw blob centers
                for (const b of blobs) {
                    drawUV(circleUV(b[0], b[1], 0.02, 8), filled ? 'filled' : 'outline');
                }
                break;
            }

            case 2: { // Reaction-diffusion spots — organic dot clusters
                const numSpots = 8 + Math.floor(r() * 10);
                const spots: { cx: number; cy: number; r: number }[] = [];

                for (let i = 0; i < numSpots; i++) {
                    const cx = 0.05 + r() * 0.9;
                    const cy = 0.05 + r() * 0.9;
                    const rad = 0.02 + r() * 0.06;
                    spots.push({ cx, cy, r: rad });
                }

                // Draw spots with bridges
                for (let i = 0; i < spots.length; i++) {
                    const s = spots[i];
                    const n = s.r > 0.04 ? 12 : 8;
                    // Organic blob shape (slightly irregular circle)
                    const pts: [number, number][] = [];
                    for (let j = 0; j <= n; j++) {
                        const a = (j / n) * Math.PI * 2;
                        const wobble = 1 + (r() - 0.5) * 0.3;
                        pts.push([
                            Math.min(1, Math.max(0, s.cx + Math.cos(a) * s.r * wobble)),
                            Math.min(1, Math.max(0, s.cy + Math.sin(a) * s.r * wobble))
                        ]);
                    }
                    drawUV(pts, i % 2 === 0 ? baseStyle : 'outline');

                    // Connect nearby spots with bridges
                    for (let j = i + 1; j < spots.length; j++) {
                        const s2 = spots[j];
                        const dx = s.cx - s2.cx;
                        const dy = s.cy - s2.cy;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 0.2) {
                            drawUV([[s.cx, s.cy], [s2.cx, s2.cy]], 'line');
                        }
                    }
                }
                break;
            }

            case 3: { // Voronoi / crack cells — irregular tessellation
                const numPoints = 6 + Math.floor(r() * 5);
                const pts: [number, number][] = [];
                for (let i = 0; i < numPoints; i++) {
                    pts.push([0.1 + r() * 0.8, 0.1 + r() * 0.8]);
                }

                // Approximate Voronoi by checking which region each grid point belongs to
                const gridSize = 20;
                const regions: number[][] = [];
                for (let gy = 0; gy < gridSize; gy++) {
                    regions[gy] = [];
                    for (let gx = 0; gx < gridSize; gx++) {
                        const u = (gx + 0.5) / gridSize;
                        const v = (gy + 0.5) / gridSize;
                        let minDist = Infinity;
                        let minIdx = 0;
                        for (let i = 0; i < pts.length; i++) {
                            const dx = u - pts[i][0];
                            const dy = v - pts[i][1];
                            const d = dx * dx + dy * dy;
                            if (d < minDist) { minDist = d; minIdx = i; }
                        }
                        regions[gy][gx] = minIdx;
                    }
                }

                // Draw edges where regions differ
                const cellW = 1.0 / gridSize;
                const cellH = 1.0 / gridSize;
                for (let gy = 0; gy < gridSize; gy++) {
                    for (let gx = 0; gx < gridSize; gx++) {
                        const u = gx * cellW;
                        const v = gy * cellH;
                        if (gx < gridSize - 1 && regions[gy][gx] !== regions[gy][gx + 1]) {
                            drawUV([[u + cellW, v], [u + cellW, v + cellH]], 'line');
                        }
                        if (gy < gridSize - 1 && regions[gy][gx] !== regions[gy + 1][gx]) {
                            drawUV([[u, v + cellH], [u + cellW, v + cellH]], 'line');
                        }
                    }
                }

                // Fill some cells and draw center points
                if (filled) {
                    for (let i = 0; i < pts.length; i++) {
                        drawUV(circleUV(pts[i][0], pts[i][1], 0.015, 6), i % 2 === 0 ? 'filled' : 'outline');
                    }
                }
                break;
            }

            case 4: { // Mycelium network — branching vein-like paths
                const numTraces = 5 + Math.floor(r() * 4);

                for (let t = 0; t < numTraces; t++) {
                    // Start from random positions
                    let x = 0.1 + r() * 0.8;
                    let y = 0.1 + r() * 0.8;
                    const angle = r() * Math.PI * 2;
                    const pts: [number, number][] = [[x, y]];

                    // Main trunk
                    const trunkLen = 8 + Math.floor(r() * 8);
                    let dir = angle;
                    for (let s = 0; s < trunkLen; s++) {
                        dir += (r() - 0.5) * 0.8;
                        x += Math.cos(dir) * 0.04;
                        y += Math.sin(dir) * 0.04;
                        if (x < 0 || x > 1 || y < 0 || y > 1) break;
                        pts.push([x, y]);

                        // Branch at some points
                        if (r() > 0.6 && s > 1) {
                            const branchDir = dir + (r() > 0.5 ? 1 : -1) * (0.4 + r() * 0.8);
                            let bx = x, by = y;
                            const branchPts: [number, number][] = [[bx, by]];
                            const branchLen = 2 + Math.floor(r() * 4);
                            for (let b = 0; b < branchLen; b++) {
                                bx += Math.cos(branchDir + (r() - 0.5) * 0.3) * 0.03;
                                by += Math.sin(branchDir + (r() - 0.5) * 0.3) * 0.03;
                                if (bx < 0 || bx > 1 || by < 0 || by > 1) break;
                                branchPts.push([bx, by]);
                            }
                            if (branchPts.length > 1) {
                                drawUV(branchPts, 'line');
                                // Terminal node
                                if (filled) {
                                    const last = branchPts[branchPts.length - 1];
                                    drawUV(circleUV(last[0], last[1], 0.008, 6), 'filled');
                                }
                            }
                        }
                    }
                    if (pts.length > 2) {
                        drawUV(pts, t % 2 === 0 ? baseStyle : 'line');
                    }
                }
                break;
            }

            case 5: { // Patchwork — recursive clustering with convex-ish regions
                const numRegions = 4 + Math.floor(r() * 3);

                // Generate region centers and approximate convex shapes
                for (let i = 0; i < numRegions; i++) {
                    const cx = 0.15 + r() * 0.7;
                    const cy = 0.15 + r() * 0.7;
                    const numVerts = 4 + Math.floor(r() * 4);
                    const baseR = 0.08 + r() * 0.12;

                    // Generate vertices sorted by angle for convex shape
                    const angles: number[] = [];
                    for (let j = 0; j < numVerts; j++) {
                        angles.push((j / numVerts) * Math.PI * 2 + (r() - 0.5) * 0.5);
                    }
                    angles.sort((a, b) => a - b);

                    const pts: [number, number][] = [];
                    for (let j = 0; j < numVerts; j++) {
                        const rr = baseR * (0.7 + r() * 0.6);
                        pts.push([
                            Math.min(1, Math.max(0, cx + Math.cos(angles[j]) * rr)),
                            Math.min(1, Math.max(0, cy + Math.sin(angles[j]) * rr))
                        ]);
                    }

                    drawUV(pts, i % 2 === 0 ? baseStyle : 'outline');

                    // Sub-divisions inside larger regions
                    if (baseR > 0.1 && filled) {
                        const subCount = 2 + Math.floor(r() * 2);
                        for (let s = 0; s < subCount; s++) {
                            const sx = cx + (r() - 0.5) * baseR * 0.8;
                            const sy = cy + (r() - 0.5) * baseR * 0.8;
                            const sr = baseR * 0.2 + r() * baseR * 0.15;
                            const subPts: [number, number][] = [];
                            const subVerts = 3 + Math.floor(r() * 3);
                            for (let j = 0; j <= subVerts; j++) {
                                const a = (j / subVerts) * Math.PI * 2;
                                subPts.push([
                                    Math.min(1, Math.max(0, sx + Math.cos(a) * sr)),
                                    Math.min(1, Math.max(0, sy + Math.sin(a) * sr))
                                ]);
                            }
                            drawUV(subPts, 'opaque-outline');
                        }
                    }
                }
                break;
            }
        }
    }
};

export default organicCellPatterns;
