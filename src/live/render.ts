/**
 * Isolated live mode renderer for the mandala canvas.
 *
 * Completely separate from the hand-drawn pattern pipeline.
 * Renders sharp Lucide icons in adaptive grid motif blocks on mandala rings.
 * Each headline maps to a set of theme-relevant icons via the icon-index.
 */

import type { ClassifiedHeadline } from './types';
import type { ColorTheme } from '../config/types';
import { drawCanvasIcon } from './lucide-canvas';
import { getIcon, ensureIconsLoaded } from './icon-loader';
import { getHeadlineIcons } from './icon-index';

/** Minimum band width to render anything */
const MIN_BAND = 4;

/** A resolved live layer: headline + its icon names */
export interface LiveLayer {
    headline: ClassifiedHeadline;
    iconNames: string[];
}

/**
 * Precompute live layers from headlines.
 * Call this when headlines change, not every frame.
 * Optional `onIconsReady` fires once all icons have loaded (for triggering redraws).
 */
export function buildLiveLayers(headlines: ClassifiedHeadline[], onIconsReady?: () => void): LiveLayer[] {
    const layers: LiveLayer[] = [];
    const allIconNames = new Set<string>();

    for (const headline of headlines) {
        const iconNames = getHeadlineIcons(headline.title, headline.theme, 16);
        layers.push({ headline, iconNames });
        iconNames.forEach(n => allIconNames.add(n));
    }

    // Trigger async loading of all needed icons
    ensureIconsLoaded([...allIconNames], onIconsReady);

    return layers;
}

/**
 * Draw densely-packed icon motif blocks that repeat around the ring.
 *
 * Adaptive grid: thick bands use a 4×4 grid with mixed block sizes,
 * thin bands use fewer rows so icons stay dense and tiny (not sparse).
 * The primary (theme) icon occupies 2×2 or 3×3 blocks; secondaries fill 1×1 to 2×2.
 * All icons are oriented with "up" pointing toward the center.
 *
 * @param density 0..1 — controls how many cells are filled and how large the primary is.
 */
function drawIconMotifRing(
    ctx: CanvasRenderingContext2D,
    iconNames: string[],
    r1: number,
    r2: number,
    color: string,
    twist: number,
    density: number,
): void {
    const band = r2 - r1;
    if (band < 4 || iconNames.length === 0) return;

    const midR = (r1 + r2) / 2;
    if (midR < 1) return;

    const primaryName = iconNames[0];
    const secondaryNames = iconNames.slice(1);
    const primaryIcon = getIcon(primaryName);

    // ── Adaptive grid size ──
    // Thick bands (≥28px): 4×4 grid with mixed block sizes
    // Medium bands (≥14px): 3×3 grid
    // Thin bands (≥7px): 2×2 grid
    // Very thin (<7px): 1 row of repeating tiny icons
    const G = band >= 28 ? 4 : band >= 14 ? 3 : band >= 7 ? 2 : 1;
    const cellH = band / G;                       // radial height of one cell
    const cellA = (cellH * 1.05) / midR;          // angular width ≈ square
    const motifAngle = cellA * G;                  // total angular span of tile

    if (motifAngle <= 0) return;

    // ── Single-row mode for very thin bands ──
    if (G === 1) {
        const iconSize = band * 0.82;
        const stroke = Math.max(0.4, Math.min(1.2, iconSize / 14));
        const slotAngle = (iconSize * 1.05) / midR;
        const count = Math.max(1, Math.floor((Math.PI * 2) / slotAngle));
        const step = (Math.PI * 2) / count;
        const secN = secondaryNames.length || 1;
        for (let i = 0; i < count; i++) {
            const name = i % 3 === 0 ? primaryName : secondaryNames[(i - 1) % secN];
            const ic = getIcon(name);
            if (!ic) continue;
            const a = i * step + twist;
            ctx.save();
            ctx.rotate(a);
            ctx.translate(midR, 0);
            ctx.rotate(-Math.PI / 2);
            drawCanvasIcon(ctx, ic, 0, 0, iconSize, color, stroke);
            ctx.restore();
        }
        return;
    }

    // ── Grid mode (G = 2, 3, or 4) ──
    const gapScale = 1.06 - density * 0.04;       // tighter packing at high density
    const numMotifs = Math.max(1, Math.floor((Math.PI * 2) / (motifAngle * gapScale)));
    const motifSpan = (Math.PI * 2) / numMotifs;
    const angularPad = (motifSpan - motifAngle) / 2;

    const strokeBig = Math.max(0.5, Math.min(2.5, cellH * 2 / 12));
    const strokeSmall = Math.max(0.4, Math.min(1.8, cellH / 12));

    for (let m = 0; m < numMotifs; m++) {
        const mBase = m * motifSpan + twist + angularPad;

        // Occupancy grid (row=radial, col=angular)
        const occ: boolean[][] = Array.from({ length: G }, () => Array(G).fill(false));

        // Deterministic hash for this motif
        const h = ((m * 2654435761) >>> 0) & 0xffff;

        // ── Place primary icon ──
        // For G=2: primary is 1×1 or 2×2; G=3: 2×2; G=4: 2×2 or 3×3
        const maxPri = G >= 4 ? 3 : 2;
        const minPri = G >= 3 ? 2 : 1;
        const pSz = (h % 5 < 2 && density > 0.15 && G >= 3) ? maxPri : minPri;
        const maxOff = G - pSz;
        const pRow = maxOff > 0 ? h % (maxOff + 1) : 0;
        const pCol = maxOff > 0 ? ((h >> 4) % (maxOff + 1)) : 0;

        for (let dr = 0; dr < pSz; dr++)
            for (let dc = 0; dc < pSz; dc++)
                occ[pRow + dr][pCol + dc] = true;

        if (primaryIcon) {
            const sz = cellH * pSz * 0.88;
            const pr = r1 + (pRow + pSz / 2) * cellH;
            const pa = mBase + (pCol + pSz / 2) * cellA;
            ctx.save();
            ctx.rotate(pa);
            ctx.translate(pr, 0);
            ctx.rotate(-Math.PI / 2);
            drawCanvasIcon(ctx, primaryIcon, 0, 0, sz, color, strokeBig);
            ctx.restore();
        }

        if (secondaryNames.length === 0) continue;
        const secN = secondaryNames.length;
        let si = 0;

        // ── Pass 1: fill 2×2 secondary blocks (only for G ≥ 3) ──
        if (density > 0.3 && G >= 3) {
            for (let r = 0; r <= G - 2; r++) {
                for (let c = 0; c <= G - 2; c++) {
                    if (occ[r][c] || occ[r][c + 1] || occ[r + 1][c] || occ[r + 1][c + 1]) continue;
                    if (density < 0.6 && ((r + c + m) % 3 !== 0)) continue;
                    occ[r][c] = occ[r][c + 1] = occ[r + 1][c] = occ[r + 1][c + 1] = true;
                    const ic = getIcon(secondaryNames[si % secN]);
                    si++;
                    if (!ic) continue;
                    const sz = cellH * 2 * 0.82;
                    ctx.save();
                    ctx.rotate(mBase + (c + 1) * cellA);
                    ctx.translate(r1 + (r + 1) * cellH, 0);
                    ctx.rotate(-Math.PI / 2);
                    drawCanvasIcon(ctx, ic, 0, 0, sz, color, strokeSmall);
                    ctx.restore();
                }
            }
        }

        // ── Pass 2: fill remaining 1×1 cells ──
        for (let r = 0; r < G; r++) {
            for (let c = 0; c < G; c++) {
                if (occ[r][c]) continue;
                if (density < 0.5 && ((r * 3 + c * 7 + m) % 4 === 0)) continue;
                occ[r][c] = true;
                const ic = getIcon(secondaryNames[si % secN]);
                si++;
                if (!ic) continue;
                const sz = cellH * 0.82;
                ctx.save();
                ctx.rotate(mBase + (c + 0.5) * cellA);
                ctx.translate(r1 + (r + 0.5) * cellH, 0);
                ctx.rotate(-Math.PI / 2);
                drawCanvasIcon(ctx, ic, 0, 0, sz, color, strokeSmall);
                ctx.restore();
            }
        }
    }
}

/**
 * Render a single live layer ring.
 * All rings use dense icon motif blocks at uniform density (like pattern mode).
 */
function renderLiveLayer(
    ctx: CanvasRenderingContext2D,
    layer: LiveLayer,
    r1: number,
    r2: number,
    theme: ColorTheme,
    layerIndex: number,
    twist: number,
    _maxR: number,
    _ringIndex: number,
): boolean {
    const band = r2 - r1;
    if (band < MIN_BAND) return false;

    const colorIdx = ((layerIndex % theme.colors.length) + theme.colors.length) % theme.colors.length;
    const color = theme.colors[colorIdx];

    // Clip to annular ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, r2, 0, Math.PI * 2);
    ctx.arc(0, 0, Math.max(0, r1 - 1), 0, Math.PI * 2, true);
    ctx.clip();

    // Fill ring background
    ctx.fillStyle = theme.background;
    ctx.beginPath();
    ctx.arc(0, 0, r2, 0, Math.PI * 2);
    ctx.fill();

    // Draw separator ring
    ctx.beginPath();
    ctx.arc(0, 0, r2, 0, Math.PI * 2);
    ctx.strokeStyle = theme.strokeLight;
    ctx.lineWidth = Math.max(0.5, band * 0.015);
    ctx.stroke();

    // Uniform high density across all rings
    drawIconMotifRing(ctx, layer.iconNames, r1, r2, color, twist, 0.85);

    ctx.restore();
    return true;
}

/**
 * Main entry point: render all live layers onto the canvas.
 *
 * This replaces the pattern rendering pipeline when live mode is active.
 * Called from the main render loop in App.tsx.
 */
export function renderLiveMode(
    ctx: CanvasRenderingContext2D,
    liveLayers: LiveLayer[],
    config: {
        layers: number;
        spread: number;
        symmetry: number;
        zoom: number;
        twist: number;
        seed: number;
        spinVariance: number;
    },
    theme: ColorTheme,
    maxR: number,
    activePointerDist: number,
    isBulgeActive: boolean,
): void {
    if (liveLayers.length === 0) return;

    const { zoom, twist, seed, spinVariance } = config;

    // Override layer count & spread for live mode:
    // Use enough layers so every headline gets its own ring in the visible area.
    // Thinner bands = more layers packed from center outward, less repetition.
    const headlineCount = liveLayers.length;
    const liveSpread = Math.max(20, Math.min(45, maxR / Math.max(headlineCount, 8)));
    const liveLayers_count = Math.ceil(maxR / liveSpread) + 2;

    const offset = zoom % 1;
    const shift = Math.floor(zoom);

    for (let l = liveLayers_count + 1; l >= 0; l--) {
        // Use stable layer ID (l + shift) for headline assignment so that
        // each ring keeps the same headline as zoom/animation shifts layers.
        const layerId = l + shift;
        const layerIdx = ((layerId % headlineCount) + headlineCount) % headlineCount;
        const layer = liveLayers[layerIdx];

        // Base radii — continuous: r = (layerId - zoom) * spread = (l - offset) * spread
        let r1 = Math.max(0, (l - offset) * liveSpread);
        let r2 = Math.max(0, (l + 1 - offset) * liveSpread);

        if (r2 <= 0) continue;
        if (r1 > maxR) continue;

        // Bulge effect
        const midR = (r1 + r2) / 2;
        const distToLayer = Math.abs(activePointerDist - midR);
        let bulge = 0;
        if (isBulgeActive && distToLayer < liveSpread * 1.5) {
            bulge = (1 - distToLayer / (liveSpread * 1.5)) * (liveSpread * 0.4);
        }
        r2 += bulge;
        if (r1 > 1) r1 = Math.max(0, r1 - bulge * 0.3);

        // Per-layer twist
        const layerSpinVar = 1 + (Math.sin(seed + layerId * 777) * 0.5) * spinVariance;
        const layerTwist = twist * (1 / (Math.abs(layerId) + 1)) * layerSpinVar;

        renderLiveLayer(ctx, layer, r1, r2, theme, layerId, layerTwist, maxR, l);
    }
}
