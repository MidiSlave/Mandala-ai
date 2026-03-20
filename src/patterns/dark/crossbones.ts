// Crossbones — crossed femur bones (classic Jolly Roger element)
import type { PatternContext } from '../types';

export function draw({ drawUV, filled, rng }: PatternContext): void {
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    // Bone 1 — diagonal from top-left to bottom-right
    drawUV([
        [0.18, 0.18], [0.22, 0.15], [0.24, 0.18],
        [0.78, 0.72], [0.82, 0.75], [0.82, 0.80],
        [0.78, 0.82], [0.76, 0.80],
        [0.22, 0.24], [0.18, 0.22]
    ], mainStyle);

    // Bone 1 — knob at top-left end
    const knob1: [number, number][] = [];
    for (let i = 0; i <= 8; i++) {
        const t = (i / 8) * Math.PI * 2;
        knob1.push([0.18 + Math.cos(t) * 0.04, 0.17 + Math.sin(t) * 0.04]);
    }
    drawUV(knob1, mainStyle);

    // Bone 1 — knob at bottom-right end
    const knob2: [number, number][] = [];
    for (let i = 0; i <= 8; i++) {
        const t = (i / 8) * Math.PI * 2;
        knob2.push([0.82 + Math.cos(t) * 0.04, 0.79 + Math.sin(t) * 0.04]);
    }
    drawUV(knob2, mainStyle);

    // Bone 2 — diagonal from top-right to bottom-left
    drawUV([
        [0.78, 0.18], [0.82, 0.15], [0.84, 0.18],
        [0.24, 0.72], [0.22, 0.75], [0.18, 0.80],
        [0.16, 0.82], [0.18, 0.78],
        [0.78, 0.24], [0.80, 0.22]
    ], mainStyle);

    // Bone 2 — knob at top-right end
    const knob3: [number, number][] = [];
    for (let i = 0; i <= 8; i++) {
        const t = (i / 8) * Math.PI * 2;
        knob3.push([0.82 + Math.cos(t) * 0.04, 0.17 + Math.sin(t) * 0.04]);
    }
    drawUV(knob3, mainStyle);

    // Bone 2 — knob at bottom-left end
    const knob4: [number, number][] = [];
    for (let i = 0; i <= 8; i++) {
        const t = (i / 8) * Math.PI * 2;
        knob4.push([0.18 + Math.cos(t) * 0.04, 0.79 + Math.sin(t) * 0.04]);
    }
    drawUV(knob4, mainStyle);

    // Center cross detail
    drawUV([
        [0.46, 0.46], [0.54, 0.46], [0.54, 0.54], [0.46, 0.54]
    ], detailStyle);
}
