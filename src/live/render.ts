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
 */
export function buildLiveLayers(headlines: ClassifiedHeadline[]): LiveLayer[] {
    const layers: LiveLayer[] = [];
    const allIconNames = new Set<string>();

    for (const headline of headlines) {
        const iconNames = getHeadlineIcons(headline.title, headline.theme, 16);
        layers.push({ headline, iconNames });
        iconNames.forEach(n => allIconNames.add(n));
    }

    // Trigger async loading of all needed icons
    ensureIconsLoaded([...allIconNames]);

    return layers;
}

/**
 * Draw headline text filling the full band height, wrapping around the ring.
 * Text is placed along multiple concentric rows if the band is tall enough.
 */
function drawTextRing(
    ctx: CanvasRenderingContext2D,
    text: string,
    r1: number,
    r2: number,
    color: string,
    startAngle: number,
): void {
    const band = r2 - r1;
    if (band < MIN_BAND) return;

    // Font fills the full band height, with padding
    const fontSize = Math.max(3, band * 0.75);
    const midR = (r1 + r2) / 2;

    ctx.save();
    ctx.font = `bold ${fontSize}px "SF Mono", "Fira Code", "Cascadia Code", "Courier New", monospace`;
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    // Measure characters
    const upper = text.toUpperCase();
    const chars = upper.split('');
    const spaceWidth = ctx.measureText('M').width; // em-width for spacing

    // Calculate how many characters fit around the circumference
    const circumference = 2 * Math.PI * midR;
    const charAngleWidth = spaceWidth / midR; // approximate angle per char

    // Repeat text to fill the full circle, with bullet separators
    let angle = startAngle;
    const endAngle = startAngle + Math.PI * 2;
    let charIdx = 0;
    let inSeparator = false;

    while (angle < endAngle - 0.01) {
        let ch: string;
        if (charIdx >= chars.length) {
            // Separator between repeats
            if (!inSeparator) {
                angle += charAngleWidth * 1.5; // gap
                inSeparator = true;
            }
            charIdx = 0;
            inSeparator = false;
            continue;
        }

        ch = chars[charIdx];
        charIdx++;

        const charW = ctx.measureText(ch).width;
        const halfAngle = (charW / midR) / 2;
        angle += halfAngle;

        if (angle >= endAngle) break;

        ctx.save();
        ctx.rotate(angle);
        ctx.translate(0, -midR);
        // Counter-rotate so text reads outward (tangent to circle)
        ctx.fillText(ch, 0, 0);
        ctx.restore();

        angle += halfAngle;
    }

    ctx.restore();
}

/**
 * Draw densely packed upright icons tiling a ring.
 * Icons are placed in a grid pattern around the circumference.
 * Each icon is counter-rotated to stay upright (readable).
 */
function drawIconRingDense(
    ctx: CanvasRenderingContext2D,
    iconNames: string[],
    r1: number,
    r2: number,
    color: string,
    twist: number,
): void {
    const band = r2 - r1;
    if (band < 8 || iconNames.length === 0) return;

    // Icon size based on band, with padding
    const padding = 0.15;
    const iconSize = band * (1 - padding * 2);
    if (iconSize < 6) return;

    const strokeWidth = Math.max(0.8, Math.min(2, iconSize / 14));

    // How many rows of icons fit radially in the band
    const rowHeight = iconSize * 1.2;
    const numRows = Math.max(1, Math.floor(band / rowHeight));
    const actualRowHeight = band / numRows;
    const actualIconSize = actualRowHeight * (1 - padding * 2);

    for (let row = 0; row < numRows; row++) {
        const rowR = r1 + actualRowHeight * (row + 0.5);

        // How many icons fit around this circumference
        const circumference = 2 * Math.PI * rowR;
        const iconSpacing = actualIconSize * 1.15; // slight gap between icons
        const numIcons = Math.max(1, Math.floor(circumference / iconSpacing));
        const angleStep = (Math.PI * 2) / numIcons;

        for (let i = 0; i < numIcons; i++) {
            const iconIdx = (row * numIcons + i) % iconNames.length;
            const iconName = iconNames[iconIdx];
            const icon = getIcon(iconName);
            if (!icon) continue;

            const angle = i * angleStep + twist + row * angleStep * 0.5; // offset rows

            ctx.save();
            ctx.rotate(angle);
            // Translate to the icon position on the ring
            ctx.translate(rowR, 0);
            // Counter-rotate to keep icon upright
            ctx.rotate(-angle);

            drawCanvasIcon(ctx, icon, 0, 0, actualIconSize, color, strokeWidth);
            ctx.restore();
        }
    }
}

/**
 * Render a single live layer ring.
 * Inner rings (< halfway to edge) → text
 * Outer rings (>= halfway) → dense upright icons
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

    // Transition: text for inner half, icons for outer half
    const midScreen = maxR * 0.5;
    const midR = (r1 + r2) / 2;

    if (midR >= midScreen) {
        // Outer rings → dense upright icons
        drawIconRingDense(ctx, layer.iconNames, r1, r2, color, twist);
    } else {
        // Inner rings → headline text
        drawTextRing(ctx, layer.headline.title, r1, r2, color, twist);
    }

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

    const { layers, spread, zoom, twist, seed, spinVariance } = config;
    const offset = zoom % 1;
    const shift = Math.floor(zoom);

    for (let l = layers; l >= -1; l--) {
        const absL = l - shift;
        const layerIdx = l >= 0 ? l % liveLayers.length : 0;
        const layer = liveLayers[layerIdx];

        // Base radii
        let r1 = Math.max(0, (l + offset) * spread);
        let r2 = Math.max(0, (l + 1 + offset) * spread);

        if (r2 <= 0) continue;
        if (r1 > maxR) continue;

        // Bulge effect
        const midR = (r1 + r2) / 2;
        const distToLayer = Math.abs(activePointerDist - midR);
        let bulge = 0;
        if (isBulgeActive && distToLayer < spread * 1.5) {
            bulge = (1 - distToLayer / (spread * 1.5)) * (spread * 0.4);
        }
        r2 += bulge;
        if (r1 > 1) r1 = Math.max(0, r1 - bulge * 0.3);

        // Per-layer twist
        const layerSpinVar = 1 + (Math.sin(seed + absL * 777) * 0.5) * spinVariance;
        const layerTwist = twist * (1 / (Math.abs(absL) + 1)) * layerSpinVar;

        renderLiveLayer(ctx, layer, r1, r2, theme, absL, layerTwist, maxR);
    }
}
