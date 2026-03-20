// Explosion — starburst with debris and smoke
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    const cx = 0.50, cy = 0.48;

    // Central fireball — irregular jagged starburst
    const spikes = 12;
    const fireball: [number, number][] = [];
    for (let i = 0; i <= spikes; i++) {
        const t = (i / spikes) * Math.PI * 2;
        const isSpike = i % 2 === 0;
        const radius = isSpike ? 0.20 + r() * 0.12 : 0.08 + r() * 0.05;
        fireball.push([cx + Math.cos(t) * radius, cy + Math.sin(t) * radius]);
    }
    drawUV(fireball, mainStyle);

    // Inner core — hot center
    const core: [number, number][] = [];
    for (let i = 0; i <= 10; i++) {
        const t = (i / 10) * Math.PI * 2;
        core.push([cx + Math.cos(t) * 0.06, cy + Math.sin(t) * 0.06]);
    }
    drawUV(core, detailStyle);

    // Debris rays — radiating outward
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + r() * 0.3;
        const len = 0.15 + r() * 0.18;
        const startR = 0.12 + r() * 0.06;
        drawUV([
            [cx + Math.cos(angle) * startR, cy + Math.sin(angle) * startR],
            [cx + Math.cos(angle) * (startR + len), cy + Math.sin(angle) * (startR + len)]
        ], 'line');
    }

    // Shrapnel pieces — small flying debris
    for (let i = 0; i < 6; i++) {
        const angle = r() * Math.PI * 2;
        const dist = 0.28 + r() * 0.15;
        const sx = cx + Math.cos(angle) * dist;
        const sy = cy + Math.sin(angle) * dist;
        const sz = 0.01 + r() * 0.02;
        drawUV([
            [sx - sz, sy], [sx, sy - sz],
            [sx + sz, sy], [sx, sy + sz]
        ], mainStyle);
    }

    // Smoke clouds — irregular blobs around edges
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 + r() * 0.5;
        const dist = 0.25 + r() * 0.10;
        const sx = cx + Math.cos(angle) * dist;
        const sy = cy + Math.sin(angle) * dist;
        const cloudPts: [number, number][] = [];
        for (let j = 0; j <= 8; j++) {
            const ct = (j / 8) * Math.PI * 2;
            const wobble = 1 + (r() - 0.5) * 0.6;
            cloudPts.push([
                sx + Math.cos(ct) * 0.05 * wobble,
                sy + Math.sin(ct) * 0.04 * wobble
            ]);
        }
        drawUV(cloudPts, detailStyle);
    }

    // Ground impact lines
    drawUV([[0.15, 0.80], [0.30, 0.72], [0.45, 0.68]], 'line');
    drawUV([[0.85, 0.80], [0.70, 0.72], [0.55, 0.68]], 'line');
}
