import type { PatternSet, PatternContext } from './types';

// Art Nouveau patterns — organic whiplash curves, floral motifs, flowing lines
const artNouveauPatterns: PatternSet = {
    name: 'Art Nouveau',
    count: 6,
    draw: (type: number, { drawUV, filled, baseStyle, rng }: PatternContext) => {
        const r = rng ?? (() => Math.random());

        switch (type) {
            case 0: { // Whiplash curve — signature Art Nouveau S-curve
                const nCurves = 2 + Math.floor(r() * 2);
                for (let c = 0; c < nCurves; c++) {
                    const offset = (c + 1) / (nCurves + 1);
                    const pts: [number, number][] = [];
                    for (let s = 0; s <= 24; s++) {
                        const t = s / 24;
                        const u = t;
                        // Double S-curve with varying amplitude
                        const amp1 = 0.1 * Math.sin(t * Math.PI);
                        const amp2 = 0.05 * Math.sin(t * Math.PI * 2);
                        const v = offset + amp1 * Math.sin(t * Math.PI * 2) + amp2 * Math.cos(t * Math.PI * 3);
                        pts.push([u, v]);
                    }
                    drawUV(pts, c === 0 ? baseStyle : 'line');

                    // Organic leaf forms along the curve
                    const nLeaves = 3 + Math.floor(r() * 2);
                    for (let lf = 0; lf < nLeaves; lf++) {
                        const lt = (lf + 0.5) / nLeaves;
                        const lu = lt;
                        const amp1 = 0.1 * Math.sin(lt * Math.PI);
                        const lv = offset + amp1 * Math.sin(lt * Math.PI * 2);
                        const leafSize = 0.03 + r() * 0.02;
                        const dir = lf % 2 === 0 ? 1 : -1;
                        const leaf: [number, number][] = [];
                        for (let s = 0; s <= 8; s++) {
                            const a = (s / 8) * Math.PI;
                            const leafR = leafSize * Math.sin(a);
                            leaf.push([lu + Math.cos(a) * leafSize, lv + dir * leafR]);
                        }
                        drawUV(leaf, lf % 2 === 0 ? baseStyle : 'outline');
                    }
                }
                break;
            }

            case 1: { // Mucha-style floral medallion
                const cx = 0.5, cy = 0.5;
                const nPetals = 5 + Math.floor(r() * 3);
                const petalR = 0.3;
                const petalWidth = 0.1;
                for (let p = 0; p < nPetals; p++) {
                    const baseA = (p / nPetals) * Math.PI * 2;
                    const pts: [number, number][] = [];
                    pts.push([cx, cy]);
                    for (let s = 0; s <= 10; s++) {
                        const t = s / 10;
                        const spread = Math.sin(t * Math.PI) * petalWidth;
                        const a = baseA - spread;
                        const rad = t * petalR;
                        pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]);
                    }
                    for (let s = 10; s >= 0; s--) {
                        const t = s / 10;
                        const spread = Math.sin(t * Math.PI) * petalWidth;
                        const a = baseA + spread;
                        const rad = t * petalR;
                        pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]);
                    }
                    drawUV(pts, p % 2 === 0 ? baseStyle : 'outline');
                }
                // Center circle
                const centerPts: [number, number][] = [];
                for (let s = 0; s <= 12; s++) {
                    const a = (s / 12) * Math.PI * 2;
                    centerPts.push([cx + Math.cos(a) * 0.04, cy + Math.sin(a) * 0.04]);
                }
                drawUV(centerPts, 'filled');
                break;
            }

            case 2: { // Tiffany glass segments — stained glass with organic borders
                const nSegments = 4 + Math.floor(r() * 3);
                for (let seg = 0; seg < nSegments; seg++) {
                    const baseU = (seg + 0.5) / nSegments;
                    const width = 0.8 / nSegments;
                    const pts: [number, number][] = [];
                    // Left border (wavy)
                    for (let s = 0; s <= 8; s++) {
                        const v = s / 8;
                        const wobble = Math.sin(v * Math.PI * 2 + seg) * 0.015;
                        pts.push([baseU - width / 2 + wobble, v]);
                    }
                    // Right border (wavy, reverse)
                    for (let s = 8; s >= 0; s--) {
                        const v = s / 8;
                        const wobble = Math.sin(v * Math.PI * 2 + seg + 1) * 0.015;
                        pts.push([baseU + width / 2 + wobble, v]);
                    }
                    drawUV(pts, seg % 2 === 0 ? baseStyle : 'outline');
                }
                break;
            }

            case 3: { // Lily stem — vertical organic form
                const stemU = 0.5;
                // Main stem
                const stem: [number, number][] = [];
                for (let s = 0; s <= 16; s++) {
                    const v = s / 16;
                    const sway = Math.sin(v * Math.PI * 1.5) * 0.06;
                    stem.push([stemU + sway, v]);
                }
                drawUV(stem, baseStyle);

                // Branching leaves
                const nLeaves = 3 + Math.floor(r() * 3);
                for (let lf = 0; lf < nLeaves; lf++) {
                    const attachV = 0.2 + (lf / nLeaves) * 0.6;
                    const attachSway = Math.sin(attachV * Math.PI * 1.5) * 0.06;
                    const attachU = stemU + attachSway;
                    const side = lf % 2 === 0 ? 1 : -1;
                    const leafLen = 0.12 + r() * 0.06;
                    const pts: [number, number][] = [];
                    pts.push([attachU, attachV]);
                    for (let s = 1; s <= 8; s++) {
                        const t = s / 8;
                        const curl = Math.sin(t * Math.PI) * 0.04;
                        pts.push([
                            attachU + side * t * leafLen,
                            attachV - t * leafLen * 0.5 + curl
                        ]);
                    }
                    drawUV(pts, 'line');
                    // Leaf body
                    const body: [number, number][] = [];
                    body.push([attachU, attachV]);
                    for (let s = 0; s <= 6; s++) {
                        const t = s / 6;
                        const width = Math.sin(t * Math.PI) * 0.025;
                        body.push([
                            attachU + side * t * leafLen,
                            attachV - t * leafLen * 0.5 + width
                        ]);
                    }
                    for (let s = 6; s >= 0; s--) {
                        const t = s / 6;
                        const width = Math.sin(t * Math.PI) * 0.025;
                        body.push([
                            attachU + side * t * leafLen,
                            attachV - t * leafLen * 0.5 - width
                        ]);
                    }
                    drawUV(body, lf % 3 === 0 ? baseStyle : 'outline');
                }
                break;
            }

            case 4: { // Peacock feather eye
                const cx = 0.5, cy = 0.45;
                // Outer eye shape
                const nRings = 3;
                for (let ring = nRings - 1; ring >= 0; ring--) {
                    const rad = 0.12 + ring * 0.08;
                    const stretch = 1.6 - ring * 0.15;
                    const pts: [number, number][] = [];
                    for (let s = 0; s <= 16; s++) {
                        const a = (s / 16) * Math.PI * 2;
                        pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad * stretch]);
                    }
                    drawUV(pts, ring === 0 ? baseStyle : (ring === 1 ? 'outline' : baseStyle));
                }
                // Feather barbs radiating outward
                const nBarbs = 8 + Math.floor(r() * 4);
                for (let b = 0; b < nBarbs; b++) {
                    const a = (b / nBarbs) * Math.PI * 2;
                    const startR = 0.28;
                    const endR = 0.42;
                    const wobble = Math.sin(a * 3) * 0.02;
                    drawUV([
                        [cx + Math.cos(a) * startR + wobble, cy + Math.sin(a) * startR * 1.4],
                        [cx + Math.cos(a) * endR + wobble, cy + Math.sin(a) * endR * 1.4]
                    ], 'line');
                }
                break;
            }

            case 5: { // Dragonfly wings — veined, organic
                const wingCx = 0.5, wingCy = 0.5;
                // Four wings
                for (let w = 0; w < 4; w++) {
                    const baseAngle = (w / 4) * Math.PI * 2 + Math.PI / 4;
                    const wingLen = 0.3 + r() * 0.08;
                    const wingWidth = 0.1;
                    const pts: [number, number][] = [];
                    // Wing outline
                    pts.push([wingCx, wingCy]);
                    for (let s = 0; s <= 10; s++) {
                        const t = s / 10;
                        const width = Math.sin(t * Math.PI) * wingWidth;
                        const perpA = baseAngle + Math.PI / 2;
                        const mainX = wingCx + Math.cos(baseAngle) * t * wingLen;
                        const mainY = wingCy + Math.sin(baseAngle) * t * wingLen;
                        pts.push([mainX + Math.cos(perpA) * width, mainY + Math.sin(perpA) * width]);
                    }
                    for (let s = 10; s >= 0; s--) {
                        const t = s / 10;
                        const width = Math.sin(t * Math.PI) * wingWidth;
                        const perpA = baseAngle - Math.PI / 2;
                        const mainX = wingCx + Math.cos(baseAngle) * t * wingLen;
                        const mainY = wingCy + Math.sin(baseAngle) * t * wingLen;
                        pts.push([mainX + Math.cos(perpA) * width, mainY + Math.sin(perpA) * width]);
                    }
                    drawUV(pts, w % 2 === 0 ? baseStyle : 'outline');
                    // Wing veins
                    for (let v = 0; v < 3; v++) {
                        const t = (v + 1) / 4;
                        const mx = wingCx + Math.cos(baseAngle) * t * wingLen;
                        const my = wingCy + Math.sin(baseAngle) * t * wingLen;
                        const perpA = baseAngle + Math.PI / 2;
                        const veinHalf = Math.sin(t * Math.PI) * wingWidth * 0.8;
                        drawUV([
                            [mx + Math.cos(perpA) * veinHalf, my + Math.sin(perpA) * veinHalf],
                            [mx - Math.cos(perpA) * veinHalf, my - Math.sin(perpA) * veinHalf]
                        ], 'line');
                    }
                }
                break;
            }
        }
    }
};

export default artNouveauPatterns;
