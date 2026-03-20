// Banksia — iconic Australian flower with cylindrical spike inflorescence
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // Stem
    drawUV([[0.48, 0.55], [0.48, 0.95], [0.52, 0.95], [0.52, 0.55]], mainStyle);

    // Flower spike — large cylindrical inflorescence
    drawUV([
        [0.38, 0.15], [0.40, 0.10], [0.45, 0.06],
        [0.50, 0.04], [0.55, 0.06], [0.60, 0.10],
        [0.62, 0.15], [0.62, 0.50], [0.60, 0.55],
        [0.55, 0.57], [0.45, 0.57], [0.40, 0.55],
        [0.38, 0.50]
    ], mainStyle);

    // Spike texture — horizontal rows of tiny hook-like styles
    for (let row = 0; row < 10; row++) {
        const ry = 0.10 + row * 0.045;
        const width = row < 2 ? 0.06 + row * 0.03 : 0.10;
        const cx = 0.50;
        // Tiny protruding hooks
        for (let h = 0; h < 5; h++) {
            const hx = cx - width + (h / 4) * width * 2;
            const hookLen = 0.015 + r() * 0.008;
            drawUV([
                [hx, ry], [hx - hookLen, ry - 0.008],
                [hx - hookLen * 0.5, ry + 0.005]
            ], 'line');
        }
    }

    // Serrated leaves — stiff, saw-toothed edges
    // Left leaf
    const leftLeaf: [number, number][] = [[0.48, 0.65]];
    for (let i = 0; i < 8; i++) {
        const ly = 0.62 - i * 0.06;
        const lx = 0.40 - i * 0.03;
        leftLeaf.push([lx, ly]);
        // Serration
        leftLeaf.push([lx - 0.02, ly - 0.02]);
        leftLeaf.push([lx - 0.01, ly - 0.03]);
    }
    leftLeaf.push([0.15, 0.18]);
    drawUV(leftLeaf, mainStyle);

    // Right leaf
    const rightLeaf: [number, number][] = [[0.52, 0.65]];
    for (let i = 0; i < 8; i++) {
        const ly = 0.62 - i * 0.06;
        const lx = 0.60 + i * 0.03;
        rightLeaf.push([lx, ly]);
        rightLeaf.push([lx + 0.02, ly - 0.02]);
        rightLeaf.push([lx + 0.01, ly - 0.03]);
    }
    rightLeaf.push([0.85, 0.18]);
    drawUV(rightLeaf, mainStyle);

    // Leaf midrib lines
    drawUV([[0.48, 0.65], [0.20, 0.22]], 'line');
    drawUV([[0.52, 0.65], [0.80, 0.22]], 'line');
}
