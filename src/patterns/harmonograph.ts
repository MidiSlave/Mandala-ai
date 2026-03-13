import type { PatternSet, PatternContext } from './types';

// Harmonograph patterns — pendulum figures, wave superposition, cymatics
const harmonographPatterns: PatternSet = {
    name: 'Harmonograph',
    count: 6,
    draw: (type: number, { drawUV, filled, baseStyle, rng }: PatternContext) => {
        const r = rng ?? (() => Math.random());

        switch (type) {
            case 0: { // Lateral harmonograph (two pendulums)
                const f1 = Math.floor(r() * 3) + 1;
                const f2 = Math.floor(r() * 3) + 2;
                const p1 = r() * Math.PI;
                const p2 = r() * Math.PI;
                const decay = 0.005 + r() * 0.01;
                const pts: [number, number][] = [];
                const steps = 80;
                for (let j = 0; j <= steps; j++) {
                    const t = (j / steps) * Math.PI * 8;
                    const d = Math.exp(-decay * t);
                    const u = 0.5 + 0.4 * d * Math.sin(f1 * t + p1);
                    const v = 0.5 + 0.4 * d * Math.sin(f2 * t + p2);
                    pts.push([Math.min(1, Math.max(0, u)), Math.min(1, Math.max(0, v))]);
                }
                drawUV(pts, baseStyle);
                break;
            }

            case 1: { // Rotary harmonograph
                const f1 = Math.floor(r() * 3) + 2;
                const f2 = f1 + (r() > 0.5 ? 1 : -1);
                const p = r() * Math.PI * 2;
                const pts: [number, number][] = [];
                const steps = 100;
                for (let j = 0; j <= steps; j++) {
                    const t = (j / steps) * Math.PI * 10;
                    const d = Math.exp(-0.008 * t);
                    const x = d * (Math.sin(f1 * t) + Math.sin(f2 * t + p));
                    const y = d * (Math.cos(f1 * t) + Math.cos(f2 * t + p));
                    pts.push([
                        Math.min(1, Math.max(0, 0.5 + x * 0.22)),
                        Math.min(1, Math.max(0, 0.5 + y * 0.22))
                    ]);
                }
                drawUV(pts, baseStyle);
                break;
            }

            case 2: { // Chladni plate pattern — nodal lines
                const m = Math.floor(r() * 3) + 1;
                const n = Math.floor(r() * 3) + 2;
                // Draw the zero-crossings as contours
                const gridN = 12;
                for (let gy = 0; gy < gridN; gy++) {
                    const pts: [number, number][] = [];
                    for (let gx = 0; gx <= gridN; gx++) {
                        const u = (gx + 0.5) / (gridN + 1);
                        const v = (gy + 0.5) / (gridN + 1);
                        const val = Math.cos(m * Math.PI * u) * Math.cos(n * Math.PI * v)
                                  - Math.cos(n * Math.PI * u) * Math.cos(m * Math.PI * v);
                        // Offset v by the Chladni value to create topographic lines
                        const offsetV = v + val * 0.06;
                        pts.push([u, Math.min(1, Math.max(0, offsetV))]);
                    }
                    drawUV(pts, gy % 3 === 0 ? baseStyle : 'line');
                }
                break;
            }

            case 3: { // Standing wave pattern
                const nWaves = 3 + Math.floor(r() * 3);
                const baseFreq = 2 + Math.floor(r() * 3);
                for (let w = 0; w < nWaves; w++) {
                    const freq = baseFreq + w;
                    const baseV = (w + 1) / (nWaves + 1);
                    const amp = 0.06 + r() * 0.04;
                    // Envelope
                    const pts1: [number, number][] = [];
                    const pts2: [number, number][] = [];
                    for (let s = 0; s <= 24; s++) {
                        const u = s / 24;
                        const envelope = Math.sin(u * Math.PI);
                        const wave = Math.sin(u * Math.PI * freq) * envelope * amp;
                        pts1.push([u, baseV + wave]);
                        pts2.push([u, baseV - wave]);
                    }
                    drawUV(pts1, w === 0 ? baseStyle : 'line');
                    drawUV(pts2, 'line');
                    // Node points
                    for (let n = 0; n <= freq; n++) {
                        const nodeU = n / freq;
                        drawUV([
                            [nodeU - 0.008, baseV - 0.008],
                            [nodeU + 0.008, baseV - 0.008],
                            [nodeU + 0.008, baseV + 0.008],
                            [nodeU - 0.008, baseV + 0.008]
                        ], 'filled');
                    }
                }
                break;
            }

            case 4: { // Lissajous with damping and beats
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
                break;
            }

            case 5: { // Cymatics ring pattern
                const nRings = 4 + Math.floor(r() * 3);
                const mode = Math.floor(r() * 4) + 3;
                for (let ring = 0; ring < nRings; ring++) {
                    const ringFrac = (ring + 1) / (nRings + 1);
                    const baseR = ringFrac * 0.4;
                    const wobble = 0.02 + r() * 0.03;
                    const pts: [number, number][] = [];
                    for (let s = 0; s <= 24; s++) {
                        const a = (s / 24) * Math.PI * 2;
                        const mod = 1 + Math.cos(mode * a) * wobble / baseR;
                        const rad = baseR * mod;
                        pts.push([
                            0.5 + Math.cos(a) * rad,
                            0.5 + Math.sin(a) * rad
                        ]);
                    }
                    drawUV(pts, ring % 2 === 0 ? baseStyle : 'outline');
                }
                break;
            }
        }
    }
};

export default harmonographPatterns;
