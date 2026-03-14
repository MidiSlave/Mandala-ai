/**
 * Isolated live mode renderer for the mandala canvas.
 *
 * Completely separate from the hand-drawn pattern pipeline.
 * Renders sharp (no wobble) text and icons on mandala rings.
 *
 * Inner rings: RSS headline text fills the full band height, wrapping around the arc
 * Outer rings (past midscreen): Dense, upright Lucide icons tiling the ring
 */

import type { ClassifiedHeadline } from './types';
import type { ColorTheme } from '../config/types';
import { drawCanvasIcon } from './lucide-canvas';
import { getIcon, ensureIconsLoaded } from './icon-loader';
import { getHeadlineIcons, findKeywordMatches, type KeywordMatch } from './icon-index';

/** Minimum band width to render anything */
const MIN_BAND = 4;

/** A resolved live layer: headline + its icon names + keyword matches */
export interface LiveLayer {
    headline: ClassifiedHeadline;
    iconNames: string[];
    /** Keyword→icon matches with positions in the title text */
    keywordMatches: KeywordMatch[];
}

/**
 * Precompute live layers from headlines.
 * Call this when headlines change, not every frame.
 */
export function buildLiveLayers(headlines: ClassifiedHeadline[]): LiveLayer[] {
    const layers: LiveLayer[] = [];
    const allIconNames = new Set<string>();

    for (const headline of headlines) {
        const iconNames = getHeadlineIcons(headline.title, headline.theme, 16);
        const keywordMatches = findKeywordMatches(headline.title);
        layers.push({ headline, iconNames, keywordMatches });
        iconNames.forEach(n => allIconNames.add(n));
        keywordMatches.forEach(m => allIconNames.add(m.icon));
    }

    // Trigger async loading of all needed icons
    ensureIconsLoaded([...allIconNames]);

    return layers;
}

/**
 * A segment of text or an inline icon to render around the ring.
 */
interface TextSegment {
    type: 'text';
    text: string;
}
interface IconSegment {
    type: 'icon';
    iconName: string;
}
type RingSegment = TextSegment | IconSegment;

/**
 * Build display segments from headline text, replacing matched keywords with icons.
 */
function buildSegments(text: string, matches: KeywordMatch[]): RingSegment[] {
    const segments: RingSegment[] = [];
    let cursor = 0;

    for (const m of matches) {
        if (m.pos > cursor) {
            segments.push({ type: 'text', text: text.slice(cursor, m.pos).toUpperCase() });
        }
        segments.push({ type: 'icon', iconName: m.icon });
        cursor = m.pos + m.length;
    }

    if (cursor < text.length) {
        segments.push({ type: 'text', text: text.slice(cursor).toUpperCase() });
    }

    return segments;
}

/**
 * Draw headline text filling the full band height, wrapping around the ring.
 * Keyword matches are replaced with inline icons oriented toward center.
 */
function drawTextRing(
    ctx: CanvasRenderingContext2D,
    text: string,
    matches: KeywordMatch[],
    r1: number,
    r2: number,
    color: string,
    startAngle: number,
): void {
    const band = r2 - r1;
    if (band < MIN_BAND) return;

    const midR = (r1 + r2) / 2;
    const circumference = 2 * Math.PI * midR;
    const separator = ' \u2022 ';

    // Build segments with icon replacements
    const baseSegments = buildSegments(text, matches);

    // Size the font so the full headline fits around the ring
    const maxFontSize = band * 0.92;
    let fontSize = maxFontSize;

    ctx.save();
    ctx.font = `900 ${fontSize}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    // Measure total width of one pass (text + icon slots)
    const iconSlotWidth = fontSize * 1.1; // icon takes ~1 em of horizontal space
    let onePassWidth = 0;
    for (const seg of baseSegments) {
        if (seg.type === 'text') {
            onePassWidth += ctx.measureText(seg.text).width;
        } else {
            onePassWidth += iconSlotWidth;
        }
    }
    const sepWidth = ctx.measureText(separator).width;
    onePassWidth += sepWidth;

    // If one pass is wider than circumference, shrink font
    if (onePassWidth > circumference && circumference > 0) {
        fontSize = Math.max(3, fontSize * (circumference / onePassWidth));
        ctx.font = `900 ${fontSize}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
    }

    // Recalculate after font change
    const iconSlot = fontSize * 1.1;
    let recalcWidth = 0;
    for (const seg of baseSegments) {
        if (seg.type === 'text') {
            recalcWidth += ctx.measureText(seg.text).width;
        } else {
            recalcWidth += iconSlot;
        }
    }
    recalcWidth += ctx.measureText(separator).width;

    // How many repeats to fill the circle
    const repeats = Math.max(1, Math.ceil(circumference / Math.max(recalcWidth, 1)));

    // Build full segment list with separators
    const fullSegments: RingSegment[] = [];
    for (let r = 0; r < repeats; r++) {
        if (r > 0) fullSegments.push({ type: 'text', text: separator });
        fullSegments.push(...baseSegments);
    }

    // Measure text metrics for vertical stretching
    const metrics = ctx.measureText('M');
    const actualHeight = (metrics.actualBoundingBoxAscent ?? fontSize * 0.7) +
                         (metrics.actualBoundingBoxDescent ?? fontSize * 0.15);
    const stretchY = actualHeight > 0 ? band / actualHeight : 1;

    const iconSize = band * 0.82;
    const iconStroke = Math.max(0.8, Math.min(2, iconSize / 14));

    // Render segments around the arc
    let angle = startAngle;
    const endAngle = startAngle + Math.PI * 2;

    for (const seg of fullSegments) {
        if (angle >= endAngle) break;

        if (seg.type === 'icon') {
            const icon = getIcon(seg.iconName);
            const slotAngle = iconSlot / midR;
            if (icon && angle + slotAngle <= endAngle) {
                const iconAngle = angle + slotAngle / 2;
                ctx.save();
                ctx.rotate(iconAngle);
                ctx.translate(0, -midR);
                // Rotate so icon "up" points toward center
                ctx.rotate(Math.PI);
                drawCanvasIcon(ctx, icon, 0, 0, iconSize, color, iconStroke);
                ctx.restore();
            }
            angle += slotAngle;
        } else {
            const chars = seg.text.split('');
            for (const ch of chars) {
                if (angle >= endAngle) break;
                const charW = ctx.measureText(ch).width;
                const halfAngle = (charW / midR) / 2;
                angle += halfAngle;
                if (angle >= endAngle) break;

                ctx.save();
                ctx.rotate(angle);
                ctx.translate(0, -midR);
                ctx.scale(1, stretchY);
                ctx.fillText(ch, 0, 0);
                ctx.restore();

                angle += halfAngle;
            }
        }
    }

    ctx.restore();
}

/**
 * Draw densely-packed icon motif blocks that repeat around the ring.
 *
 * Each motif tile is divided into a 4×4 grid (16 blocks).
 * The primary (theme) icon occupies 2×2 or 3×3 blocks (4–9 cells).
 * Secondary icons fill remaining cells at 1×1 to 2×2 sizes (1–4 cells).
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
    if (band < 8 || iconNames.length === 0) return;

    const midR = (r1 + r2) / 2;
    const primaryName = iconNames[0];
    const secondaryNames = iconNames.slice(1);
    const primaryIcon = getIcon(primaryName);

    // ── Grid-based block layout ──
    // Each motif tile = 4×4 grid of cells, approximately square in screen space.
    const G = 4;
    const cellH = band / G;                       // radial height of one cell
    const cellA = (cellH * 1.05) / midR;          // angular width ≈ square
    const motifAngle = cellA * G;                  // total angular span of tile

    if (cellH < 3) return;

    // How many motif tiles fit around the ring
    const gapScale = 1.06 - density * 0.04;       // tighter packing at high density
    const numMotifs = Math.max(1, Math.floor((Math.PI * 2) / (motifAngle * gapScale)));
    const motifSpan = (Math.PI * 2) / numMotifs;
    // Center the 4-column grid within each motif span
    const angularPad = (motifSpan - motifAngle) / 2;

    const strokeBig = Math.max(0.8, Math.min(2.5, cellH * 2 / 12));
    const strokeSmall = Math.max(0.6, Math.min(1.8, cellH / 12));

    for (let m = 0; m < numMotifs; m++) {
        const mBase = m * motifSpan + twist + angularPad;

        // Occupancy grid (row=radial, col=angular)
        const occ: boolean[][] = Array.from({ length: G }, () => Array(G).fill(false));

        // Deterministic hash for this motif
        const h = ((m * 2654435761) >>> 0) & 0xffff;

        // ── Place primary icon (2×2 or 3×3) ──
        const pSz = (h % 5 < 2 && density > 0.15) ? 3 : 2;
        const maxOff = G - pSz;
        const pRow = h % (maxOff + 1);
        const pCol = ((h >> 4) % (maxOff + 1));

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

        // ── Pass 1: fill 2×2 secondary blocks ──
        if (density > 0.3) {
            for (let r = 0; r <= G - 2; r++) {
                for (let c = 0; c <= G - 2; c++) {
                    if (occ[r][c] || occ[r][c + 1] || occ[r + 1][c] || occ[r + 1][c + 1]) continue;
                    // At low density skip some 2×2 opportunities
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
                // At low density, skip some cells for breathing room
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

/** Innermost layers (0-based) that show pure text with no icon substitutions */
const PURE_TEXT_LAYERS = 5;

/**
 * Render a single live layer ring.
 * All rings use icon motif blocks; density increases from center to edge.
 */
function renderLiveLayer(
    ctx: CanvasRenderingContext2D,
    layer: LiveLayer,
    r1: number,
    r2: number,
    theme: ColorTheme,
    layerIndex: number,
    twist: number,
    maxR: number,
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

    // Density increases from center to edge (0→1)
    const midR = (r1 + r2) / 2;
    const density = maxR > 0 ? Math.max(0, Math.min(1, midR / maxR)) : 0;

    drawIconMotifRing(ctx, layer.iconNames, r1, r2, color, twist, density);

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

    for (let l = liveLayers_count; l >= -1; l--) {
        const absL = l - shift;
        const layerIdx = l >= 0 ? l % headlineCount : 0;
        const layer = liveLayers[layerIdx];

        // Base radii
        let r1 = Math.max(0, (l + offset) * liveSpread);
        let r2 = Math.max(0, (l + 1 + offset) * liveSpread);

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
        const layerSpinVar = 1 + (Math.sin(seed + absL * 777) * 0.5) * spinVariance;
        const layerTwist = twist * (1 / (Math.abs(absL) + 1)) * layerSpinVar;

        renderLiveLayer(ctx, layer, r1, r2, theme, absL, layerTwist, maxR, l);
    }
}
