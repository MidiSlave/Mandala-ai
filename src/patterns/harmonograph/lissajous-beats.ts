import type { PatternContext } from '../types';

export function draw({ drawUV, filled, baseStyle, rng }: PatternContext): void {
    const r = rng ?? (() => Math.random());
    const a = Math.floor(r() * 3) + 2;
    const b = a + 1;
    const delta = r() * Math.PI;
    const pts: [number, number][] = [];
    const steps = 60;
    // Two slightly detuned lissajous creating beat pattern
    for (let pass = 0; pass < 2; pass++) {
        const detune = pass * 0.1;
        const passPts: [number, number][] = [];
        for (let j = 0; j <= steps; j++) {
            const t = (j / steps) * Math.PI * 6;
            const u = 0.5 + 0.38 * Math.sin((a + detune) * t + delta);
            const v = 0.5 + 0.38 * Math.sin(b * t);
            passPts.push([
                Math.min(1, Math.max(0, u)),
                Math.min(1, Math.max(0, v))
            ]);
        }
        drawUV(passPts, pass === 0 ? baseStyle : 'line');
    }
}
