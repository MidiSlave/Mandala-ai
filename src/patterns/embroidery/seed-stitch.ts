// Seed stitch — scattered short marks
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const numSeeds = 20 + Math.floor(r() * 20);
    const seedLen = 0.025 + r() * 0.015;
    for (let i = 0; i < numSeeds; i++) {
        const cx = 0.05 + r() * 0.9;
        const cy = 0.05 + r() * 0.9;
        const angle = r() * Math.PI;
        const dx = Math.cos(angle) * seedLen;
        const dy = Math.sin(angle) * seedLen;
        drawUV([[cx - dx, cy - dy], [cx + dx, cy + dy]], 'line');
    }
    // Larger accent stitches
    if (filled) {
        const accents = 3 + Math.floor(r() * 3);
        for (let i = 0; i < accents; i++) {
            const cx = 0.15 + r() * 0.7;
            const cy = 0.15 + r() * 0.7;
            const ds = 0.02;
            drawUV([
                [cx - ds, cy], [cx, cy - ds],
                [cx + ds, cy], [cx, cy + ds]
            ], 'filled');
        }
    }
}
