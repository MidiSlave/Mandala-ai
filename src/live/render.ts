/**
 * Isolated live mode renderer for the mandala canvas.
 *
 * Completely separate from the hand-drawn pattern pipeline.
 * Renders sharp (no wobble) text and icons on mandala rings.
 *
 * Small rings: RSS headline text wraps along the circular arc
 * Large rings: Text transitions to Lucide icons representing the story
 */

import type { ClassifiedHeadline } from './types';
import type { ColorTheme } from '../config/types';
import { drawCanvasIcon, type CanvasIcon } from './lucide-canvas';
import { getIcon, ensureIconsLoaded } from './icon-loader';
import { getHeadlineIcons } from './icon-index';

/** Threshold in pixels: rings wider than this show icons instead of text */
const ICON_THRESHOLD = 35;

/** Minimum band width to render anything */
const MIN_BAND = 5;

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
        const iconNames = getHeadlineIcons(headline.title, headline.theme, 12);
        layers.push({ headline, iconNames });
        iconNames.forEach(n => allIconNames.add(n));
    }

    // Trigger async loading of all needed icons
    ensureIconsLoaded([...allIconNames]);

    return layers;
}

/**
 * Draw circular text along a ring arc.
 * Text follows the curve of the ring at the specified radius.
 */
function drawCircularText(
    ctx: CanvasRenderingContext2D,
    text: string,
    radius: number,
    band: number,
    color: string,
    startAngle: number,
): void {
    const fontSize = Math.min(band * 0.55, 14);
    if (fontSize < 4) return;

    ctx.save();
    ctx.font = `${fontSize}px "SF Mono", "Fira Code", "Cascadia Code", monospace`;
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    // Measure total text angle
    const chars = text.split('');
    const charWidths = chars.map(c => ctx.measureText(c).width);
    const totalWidth = charWidths.reduce((a, b) => a + b, 0);
    const totalAngle = totalWidth / radius;

    // Start at the given angle, centering text if it doesn't fill the circle
    let angle = startAngle;
    const fullCircle = Math.PI * 2;
    const repeats = Math.ceil(fullCircle / (totalAngle + fontSize / radius));

    for (let rep = 0; rep < repeats; rep++) {
        // Add a separator between repeats
        if (rep > 0) {
            angle += (fontSize * 1.5) / radius;
        }

        for (let i = 0; i < chars.length; i++) {
            const charAngle = charWidths[i] / radius;
            angle += charAngle / 2;

            if (angle > startAngle + fullCircle + 0.1) break;

            ctx.save();
            ctx.rotate(angle);
            ctx.translate(0, -radius);
            ctx.fillText(chars[i], 0, 0);
            ctx.restore();

            angle += charAngle / 2;
        }
    }

    ctx.restore();
}

/**
 * Draw icons arranged radially around a ring.
 * Each symmetry slice gets a different icon from the sequence.
 */
function drawIconRing(
    ctx: CanvasRenderingContext2D,
    iconNames: string[],
    r1: number,
    r2: number,
    symmetry: number,
    color: string,
    twist: number,
): void {
    const band = r2 - r1;
    const midR = (r1 + r2) / 2;
    const iconSize = band * 0.7;
    const strokeWidth = Math.max(1, iconSize / 12);
    const angleStep = (Math.PI * 2) / symmetry;

    for (let i = 0; i < symmetry; i++) {
        const iconName = iconNames[i % iconNames.length];
        const icon = getIcon(iconName);
        if (!icon) continue;

        ctx.save();
        ctx.rotate(i * angleStep + twist);
        drawCanvasIcon(ctx, icon, midR, 0, iconSize, color, strokeWidth);
        ctx.restore();
    }
}

/**
 * Render a single live layer ring.
 * Small rings → text, large rings → icons.
 * Returns true if something was drawn.
 */
function renderLiveLayer(
    ctx: CanvasRenderingContext2D,
    layer: LiveLayer,
    r1: number,
    r2: number,
    symmetry: number,
    theme: ColorTheme,
    layerIndex: number,
    twist: number,
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
    ctx.lineWidth = Math.max(0.5, band * 0.02);
    ctx.stroke();

    if (band >= ICON_THRESHOLD) {
        // Large ring → icons
        drawIconRing(ctx, layer.iconNames, r1, r2, symmetry, color, twist);
    } else {
        // Small ring → text
        const midR = (r1 + r2) / 2;
        drawCircularText(
            ctx,
            layer.headline.title.toUpperCase(),
            midR,
            band,
            color,
            twist,
        );
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

    const { layers, spread, symmetry, zoom, twist, seed, spinVariance } = config;
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

        renderLiveLayer(ctx, layer, r1, r2, symmetry, theme, absL, layerTwist);
    }
}
