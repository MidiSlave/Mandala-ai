import type { PatternSet, PatternContext } from './types';

const nordicPatterns: PatternSet = {
    name: 'Nordic / Fair Isle',
    count: 5,
    draw: (type: number, { drawUV, filled, baseStyle }: PatternContext) => {
        switch (type) {
            case 0: { // Diamond lattice with seeds
                // Large diamond outline
                drawUV([
                    [0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]
                ], 'outline');

                // 4 small filled diamonds at cardinal points of the large diamond
                const sd = 0.06;
                // Top (near v=0)
                drawUV([
                    [0.5, 0.12 - sd], [0.5 + sd, 0.12],
                    [0.5, 0.12 + sd], [0.5 - sd, 0.12]
                ], 'filled');
                // Bottom (near v=1)
                drawUV([
                    [0.5, 0.88 - sd], [0.5 + sd, 0.88],
                    [0.5, 0.88 + sd], [0.5 - sd, 0.88]
                ], 'filled');
                // Left (near u=0)
                drawUV([
                    [0.12, 0.5 - sd], [0.12 + sd, 0.5],
                    [0.12, 0.5 + sd], [0.12 - sd, 0.5]
                ], 'filled');
                // Right (near u=1)
                drawUV([
                    [0.88, 0.5 - sd], [0.88 + sd, 0.5],
                    [0.88, 0.5 + sd], [0.88 - sd, 0.5]
                ], 'filled');

                // Small filled square at dead center
                const cs = 0.05;
                drawUV([
                    [0.5 - cs, 0.5 - cs], [0.5 + cs, 0.5 - cs],
                    [0.5 + cs, 0.5 + cs], [0.5 - cs, 0.5 + cs]
                ], 'filled');

                // Border lines at v=0 and v=1
                drawUV([[0, 0], [1, 0]], 'line');
                drawUV([[0, 1], [1, 1]], 'line');
                break;
            }

            case 1: { // Snowflake crystal
                const cx = 0.5;
                const cy = 0.5;
                const armLen = 0.4;
                const tickLen = 0.08;
                const tickOff = 0.07; // perpendicular offset for ticks

                // 4 radiating lines: diagonals + cross
                // Vertical line
                drawUV([[cx, cy - armLen], [cx, cy + armLen]], 'line');
                // Horizontal line
                drawUV([[cx - armLen, cy], [cx + armLen, cy]], 'line');
                // Diagonal top-left to bottom-right
                const da = armLen * 0.707;
                drawUV([[cx - da, cy - da], [cx + da, cy + da]], 'line');
                // Diagonal top-right to bottom-left
                drawUV([[cx + da, cy - da], [cx - da, cy + da]], 'line');

                // Tick marks at midpoints of each arm (8 arms)
                const mid = armLen * 0.5;
                const midD = da * 0.5;
                // Vertical arm ticks
                drawUV([[cx - tickOff, cy - mid], [cx + tickOff, cy - mid]], 'line');
                drawUV([[cx - tickOff, cy + mid], [cx + tickOff, cy + mid]], 'line');
                // Horizontal arm ticks
                drawUV([[cx - mid, cy - tickOff], [cx - mid, cy + tickOff]], 'line');
                drawUV([[cx + mid, cy - tickOff], [cx + mid, cy + tickOff]], 'line');
                // Diagonal arm ticks (perpendicular to diagonal)
                const tp = tickLen * 0.707;
                drawUV([[cx - midD - tp, cy - midD + tp], [cx - midD + tp, cy - midD - tp]], 'line');
                drawUV([[cx + midD - tp, cy + midD + tp], [cx + midD + tp, cy + midD - tp]], 'line');
                drawUV([[cx + midD - tp, cy - midD - tp], [cx + midD + tp, cy - midD + tp]], 'line');
                drawUV([[cx - midD - tp, cy + midD - tp], [cx - midD + tp, cy + midD + tp]], 'line');

                // Filled diamond at center
                const cd = 0.08;
                drawUV([
                    [cx, cy - cd], [cx + cd, cy],
                    [cx, cy + cd], [cx - cd, cy]
                ], 'filled');

                // Small dots (tiny filled diamonds) at the 4 main tips
                const td = 0.035;
                // Top
                drawUV([
                    [cx, cy - armLen - td], [cx + td, cy - armLen],
                    [cx, cy - armLen + td], [cx - td, cy - armLen]
                ], 'filled');
                // Bottom
                drawUV([
                    [cx, cy + armLen - td], [cx + td, cy + armLen],
                    [cx, cy + armLen + td], [cx - td, cy + armLen]
                ], 'filled');
                // Left
                drawUV([
                    [cx - armLen, cy - td], [cx - armLen + td, cy],
                    [cx - armLen, cy + td], [cx - armLen - td, cy]
                ], 'filled');
                // Right
                drawUV([
                    [cx + armLen, cy - td], [cx + armLen + td, cy],
                    [cx + armLen, cy + td], [cx + armLen - td, cy]
                ], 'filled');

                break;
            }

            case 2: { // Deer / reindeer silhouette
                // Body: blocky rectangle
                const body: [number, number][] = [
                    [0.20, 0.45], [0.65, 0.45],
                    [0.65, 0.65], [0.20, 0.65]
                ];
                // Head: triangle pointing right-up from front of body
                const head: [number, number][] = [
                    [0.65, 0.45], [0.80, 0.30],
                    [0.80, 0.50], [0.65, 0.50]
                ];
                // Tail: small triangle at back
                const tail: [number, number][] = [
                    [0.20, 0.45], [0.12, 0.40], [0.20, 0.50]
                ];

                const deerStyle = filled ? 'filled' : 'outline';

                // Draw body
                drawUV(body, deerStyle);
                // Draw head
                drawUV(head, deerStyle);
                // Draw tail
                drawUV(tail, deerStyle);

                // Legs: 4 short downward rectangles
                const legW = 0.03;
                const legH = 0.18;
                const legTops = [0.28, 0.38, 0.48, 0.58];
                for (const lx of legTops) {
                    drawUV([
                        [lx - legW, 0.65], [lx + legW, 0.65],
                        [lx + legW, 0.65 + legH], [lx - legW, 0.65 + legH]
                    ], deerStyle);
                }

                // Antlers: 2 upward forking lines from head
                // Left antler
                drawUV([[0.72, 0.35], [0.70, 0.18]], 'line');
                drawUV([[0.70, 0.18], [0.64, 0.10]], 'line');
                drawUV([[0.70, 0.18], [0.72, 0.08]], 'line');
                // Right antler
                drawUV([[0.76, 0.32], [0.78, 0.15]], 'line');
                drawUV([[0.78, 0.15], [0.74, 0.06]], 'line');
                drawUV([[0.78, 0.15], [0.84, 0.08]], 'line');

                // Eye: tiny diamond
                const ed = 0.02;
                const ex = 0.75, ey = 0.40;
                drawUV([
                    [ex, ey - ed], [ex + ed, ey],
                    [ex, ey + ed], [ex - ed, ey]
                ], filled ? 'opaque-outline' : 'filled');

                break;
            }

            case 3: { // Pine tree / fir
                const treeStyle = filled ? 'filled' : 'outline';

                // 3 stacked triangles, bottom to top, each smaller
                // Bottom triangle (widest)
                drawUV([
                    [0.50, 0.28], [0.82, 0.72], [0.18, 0.72]
                ], treeStyle);
                // Middle triangle
                drawUV([
                    [0.50, 0.18], [0.74, 0.55], [0.26, 0.55]
                ], treeStyle);
                // Top triangle (smallest)
                drawUV([
                    [0.50, 0.06], [0.66, 0.38], [0.34, 0.38]
                ], treeStyle);

                // Trunk: small rectangle at bottom
                drawUV([
                    [0.44, 0.72], [0.56, 0.72],
                    [0.56, 0.88], [0.44, 0.88]
                ], treeStyle);

                // Diamond ornaments on each tier (left and right)
                const od = 0.03;
                const ornaments: [number, number][] = [
                    // Bottom tier ornaments
                    [0.34, 0.60], [0.66, 0.60],
                    // Middle tier ornaments
                    [0.38, 0.44], [0.62, 0.44],
                    // Top tier ornaments
                    [0.44, 0.30], [0.56, 0.30],
                ];
                for (const [ox, oy] of ornaments) {
                    drawUV([
                        [ox, oy - od], [ox + od, oy],
                        [ox, oy + od], [ox - od, oy]
                    ], filled ? 'opaque-outline' : 'filled');
                }

                // Star/diamond at top
                const sd = 0.04;
                drawUV([
                    [0.50, 0.06 - sd], [0.50 + sd, 0.06],
                    [0.50, 0.06 + sd], [0.50 - sd, 0.06]
                ], 'filled');

                // Ground line
                drawUV([[0.10, 0.90], [0.90, 0.90]], 'line');

                break;
            }

            case 4: { // Interlocking diamond chain
                const dd = 0.22; // diamond half-size

                // First row: two diamonds at u=0.25 and u=0.75
                // Left diamond (outline — appears "behind")
                drawUV([
                    [0.25, 0.5 - dd], [0.25 + dd, 0.5],
                    [0.25, 0.5 + dd], [0.25 - dd, 0.5]
                ], 'outline');
                // Right diamond (outline — appears "behind")
                drawUV([
                    [0.75, 0.5 - dd], [0.75 + dd, 0.5],
                    [0.75, 0.5 + dd], [0.75 - dd, 0.5]
                ], 'outline');

                // Second row (offset): center diamond at u=0.5 that overlaps both
                // This one is filled to create the over-under illusion
                drawUV([
                    [0.5, 0.5 - dd], [0.5 + dd, 0.5],
                    [0.5, 0.5 + dd], [0.5 - dd, 0.5]
                ], filled ? 'opaque-outline' : 'filled');

                // Re-draw portions of the side diamonds on top of the center
                // to complete the weave effect — small diamonds at the overlap corners
                const sd = 0.06;
                // Where left diamond and center overlap (right side of left, left side of center)
                const overlapX1 = 0.375;
                drawUV([
                    [overlapX1, 0.5 - sd], [overlapX1 + sd, 0.5],
                    [overlapX1, 0.5 + sd], [overlapX1 - sd, 0.5]
                ], 'filled');
                // Where right diamond and center overlap
                const overlapX2 = 0.625;
                drawUV([
                    [overlapX2, 0.5 - sd], [overlapX2 + sd, 0.5],
                    [overlapX2, 0.5 + sd], [overlapX2 - sd, 0.5]
                ], 'filled');

                // Border accents: small diamonds at edges for chain continuity
                const bd = 0.05;
                drawUV([
                    [0.0, 0.5 - bd], [bd, 0.5],
                    [0.0, 0.5 + bd], [-bd, 0.5]
                ], 'filled');
                drawUV([
                    [1.0, 0.5 - bd], [1.0 + bd, 0.5],
                    [1.0, 0.5 + bd], [1.0 - bd, 0.5]
                ], 'filled');

                // Horizontal border lines
                drawUV([[0, 0], [1, 0]], 'line');
                drawUV([[0, 1], [1, 1]], 'line');

                break;
            }
        }
    }
};

export default nordicPatterns;
