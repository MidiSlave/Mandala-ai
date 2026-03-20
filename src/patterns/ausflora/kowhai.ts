// Kowhai — New Zealand native, drooping yellow bell flowers
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // Branch — arching
    drawUV([[0.20, 0.30], [0.35, 0.25], [0.50, 0.22], [0.65, 0.25], [0.80, 0.30]], 'line');

    // Drooping flower clusters hanging from branch
    const flowers: [number, number, number][] = [
        [0.30, 0.28, -0.1], [0.42, 0.24, 0.05],
        [0.55, 0.23, -0.05], [0.68, 0.26, 0.1]
    ];

    for (const [fx, fy, lean] of flowers) {
        // Flower stem — drooping down
        const stemEnd = fy + 0.15;
        drawUV([[fx, fy], [fx + lean * 0.3, stemEnd]], 'line');

        const bx = fx + lean * 0.3;
        const by = stemEnd;

        // Bell-shaped flower — tube narrowing at base, flaring at opening
        drawUV([
            [bx - 0.02, by], [bx - 0.01, by + 0.04],
            [bx - 0.03, by + 0.08], [bx - 0.05, by + 0.12],
            [bx - 0.06, by + 0.14],
            [bx + 0.06, by + 0.14],
            [bx + 0.05, by + 0.12], [bx + 0.03, by + 0.08],
            [bx + 0.01, by + 0.04], [bx + 0.02, by]
        ], mainStyle);

        // Petal flare / lip detail
        drawUV([
            [bx - 0.06, by + 0.14], [bx - 0.04, by + 0.16],
            [bx, by + 0.15], [bx + 0.04, by + 0.16],
            [bx + 0.06, by + 0.14]
        ], detailStyle);

        // Stamen poking out
        drawUV([
            [bx, by + 0.14], [bx + lean * 0.1, by + 0.18]
        ], 'line');

        // Calyx at top
        drawUV([
            [bx - 0.025, by], [bx - 0.015, by - 0.02],
            [bx + 0.015, by - 0.02], [bx + 0.025, by]
        ], detailStyle);
    }

    // Compound leaves — pinnate with many small leaflets
    // Left leaf cluster
    const leafStem1: [number, number][] = [[0.25, 0.30]];
    for (let i = 1; i <= 6; i++) {
        const lx = 0.25 - i * 0.04;
        const ly = 0.30 + i * 0.06;
        leafStem1.push([lx, ly]);
        // Leaflet pair
        drawUV([
            [lx, ly], [lx - 0.03, ly - 0.015],
            [lx - 0.04, ly + 0.005], [lx - 0.02, ly + 0.01]
        ], mainStyle);
        drawUV([
            [lx, ly], [lx + 0.03, ly - 0.015],
            [lx + 0.04, ly + 0.005], [lx + 0.02, ly + 0.01]
        ], mainStyle);
    }
    drawUV(leafStem1, 'line');

    // Right leaf cluster
    const leafStem2: [number, number][] = [[0.75, 0.30]];
    for (let i = 1; i <= 6; i++) {
        const lx = 0.75 + i * 0.03;
        const ly = 0.30 + i * 0.06;
        leafStem2.push([lx, ly]);
        drawUV([
            [lx, ly], [lx - 0.03, ly - 0.015],
            [lx - 0.04, ly + 0.005], [lx - 0.02, ly + 0.01]
        ], mainStyle);
        drawUV([
            [lx, ly], [lx + 0.03, ly - 0.015],
            [lx + 0.04, ly + 0.005], [lx + 0.02, ly + 0.01]
        ], mainStyle);
    }
    drawUV(leafStem2, 'line');
}
