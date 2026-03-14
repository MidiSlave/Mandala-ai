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
 * Draw composed icon motif blocks that repeat around the ring.
 *
 * Each motif is a radial block containing a larger primary icon (the headline's
 * theme icon) surrounded by smaller secondary icons. The block repeats around
 * the circumference. All icons are oriented with "up" pointing toward center.
 */
/**
 * @param density 0..1 — how densely packed the motif should be.
 *   0 = sparse (just primary + a couple secondaries)
 *   1 = maximum density (all secondaries, tight packing)
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

    // Primary icon (first = most relevant to headline theme) is larger
    const primaryName = iconNames[0];
    const secondaryNames = iconNames.slice(1);

    const primaryIcon = getIcon(primaryName);

    // Sizing scales with density: denser → slightly smaller primary, more room for secondaries
    const primaryScale = 0.60 - density * 0.1;  // 0.60 → 0.50
    const secondaryScale = 0.25 + density * 0.08; // 0.25 → 0.33
    const primarySize = band * primaryScale;
    const secondarySize = band * secondaryScale;
    if (primarySize < 6) return;

    const primaryStroke = Math.max(0.8, Math.min(2.5, primarySize / 12));
    const secondaryStroke = Math.max(0.6, Math.min(1.5, secondarySize / 14));

    // Number of secondaries scales with density: 2 at sparse, up to 8 at max
    const maxSec = Math.min(secondaryNames.length, Math.round(2 + density * 6));

    // Motif angular width
    const primaryAngle = (primarySize * 1.05) / midR;
    const secAngleWidth = (secondarySize * 1.05) / midR;
    // Tighter packing at higher density
    const packFactor = 0.65 - density * 0.15; // 0.65 → 0.50
    const motifAngle = primaryAngle + maxSec * secAngleWidth * packFactor;

    // Gap between motifs shrinks with density
    const gapFactor = 1.15 - density * 0.12; // 1.15 → 1.03
    const numMotifs = Math.max(1, Math.floor((Math.PI * 2) / (motifAngle * gapFactor)));
    const motifAngleSpan = (Math.PI * 2) / numMotifs;

    // Radial row positions for secondary icons
    const rowPositions = [
        r1 + secondarySize * 0.55,       // inner row
        r2 - secondarySize * 0.55,       // outer row
        r1 + band * 0.35,                // inner-mid
        r2 - band * 0.35,                // outer-mid
    ];

    for (let m = 0; m < numMotifs; m++) {
        const baseAngle = m * motifAngleSpan + twist;

        // Draw primary icon at center of motif (on midR)
        if (primaryIcon) {
            ctx.save();
            ctx.rotate(baseAngle);
            ctx.translate(midR, 0);
            ctx.rotate(-Math.PI / 2); // orient toward center
            drawCanvasIcon(ctx, primaryIcon, 0, 0, primarySize, color, primaryStroke);
            ctx.restore();
        }

        // Pack secondary icons densely around the primary
        for (let s = 0; s < maxSec; s++) {
            const secIcon = getIcon(secondaryNames[s % secondaryNames.length]);
            if (!secIcon) continue;

            const side = s % 2 === 0 ? -1 : 1;
            const rank = Math.floor(s / 2) + 1;
            const angularSpread = 0.95 - density * 0.1; // tighter at high density
            const angularOffset = side * rank * secAngleWidth * angularSpread;
            const secR = rowPositions[s % rowPositions.length];

            ctx.save();
            ctx.rotate(baseAngle + angularOffset);
            ctx.translate(secR, 0);
            ctx.rotate(-Math.PI / 2); // orient toward center
            drawCanvasIcon(ctx, secIcon, 0, 0, secondarySize, color, secondaryStroke);
            ctx.restore();
        }
    }
}

/** Innermost layers (0-based) that show pure text with no icon substitutions */
const PURE_TEXT_LAYERS = 5;

/**
 * Render a single live layer ring.
 * ringIndex 0..PURE_TEXT_LAYERS-1: pure text (no inline icons)
 * ringIndex PURE_TEXT_LAYERS+: text with keyword→icon substitutions
 * Outer half of viewport: dense icon motif blocks
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
    ringIndex: number,
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

    // Smooth transition zone between text and icon motifs.
    // Instead of a hard cutoff, blend over a transition band so there's
    // no visible pop when zooming/scrolling moves rings across the boundary.
    const midR = (r1 + r2) / 2;
    const transitionStart = maxR * 0.38;  // text fully visible below here
    const transitionEnd = maxR * 0.55;    // icons fully visible above here
    const transitionWidth = transitionEnd - transitionStart;

    // iconBlend: 0 = pure text, 1 = pure icons
    const iconBlend = transitionWidth > 0
        ? Math.max(0, Math.min(1, (midR - transitionStart) / transitionWidth))
        : (midR >= transitionStart ? 1 : 0);

    // Density increases from transition zone to edge (0→1)
    const density = maxR > 0 ? Math.max(0, Math.min(1, (midR - transitionEnd) / (maxR - transitionEnd))) : 0;

    const savedAlpha = ctx.globalAlpha;

    if (iconBlend < 1) {
        // Draw text layer (fading out as iconBlend increases)
        ctx.globalAlpha = savedAlpha * (1 - iconBlend);
        const useIcons = ringIndex >= PURE_TEXT_LAYERS;
        const matches = useIcons ? layer.keywordMatches : [];
        drawTextRing(ctx, layer.headline.title, matches, r1, r2, color, twist);
    }

    if (iconBlend > 0) {
        // Draw icon motifs (fading in as iconBlend increases)
        ctx.globalAlpha = savedAlpha * iconBlend;
        drawIconMotifRing(ctx, layer.iconNames, r1, r2, color, twist, density);
    }

    ctx.globalAlpha = savedAlpha;

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
