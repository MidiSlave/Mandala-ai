import type { PatternSet, PatternContext } from '../types';
import { ALL_ICONS, THEME_ICONS, type IconShape } from './data';

/**
 * Draw a single icon shape into the UV cell.
 * Each subpath is drawn as a separate drawUV call.
 * Paths with <= 2 points are drawn as 'line', others as filled/outline shapes.
 */
function drawIcon(icon: IconShape, { drawUV, filled, baseStyle }: PatternContext): void {
    const mainStyle = filled ? 'filled' : 'outline';
    const detailStyle = filled ? 'opaque-outline' : 'filled';

    for (let i = 0; i < icon.paths.length; i++) {
        const path = icon.paths[i];
        if (path.length <= 2) {
            // Short paths are lines (stems, rays, veins, etc.)
            drawUV(path, 'line');
        } else if (i === 0) {
            // First/main path gets the primary style
            drawUV(path, mainStyle);
        } else {
            // Secondary paths get detail style for contrast
            drawUV(path, detailStyle);
        }
    }
}

/**
 * Icon pattern set — renders pre-defined SVG-derived icon shapes.
 *
 * In non-live mode: cycles through all 48 icons.
 * In live mode: the theme mapping in src/live/themes.ts selects
 * this pattern set and the motif number maps to a themed icon.
 *
 * count = ALL_ICONS.length (48 icons total, 3 per theme × 16 themes)
 */
const iconPatterns: PatternSet = {
    name: 'News Icons',
    count: ALL_ICONS.length,
    draw: (type: number, ctx: PatternContext) => {
        const icon = ALL_ICONS[type % ALL_ICONS.length];
        drawIcon(icon, ctx);
    },
};

export default iconPatterns;

/**
 * Get a themed icon for live mode.
 * Returns an icon shape for the given theme and variant index.
 */
export function getThemedIcon(theme: string, variant: number): IconShape {
    const icons = THEME_ICONS[theme] ?? THEME_ICONS.general;
    return icons[Math.abs(variant) % icons.length];
}

/**
 * Draw a themed icon directly (for live mode integration).
 * This bypasses the PatternSet index and draws theme-specific icons.
 */
export function drawThemedIcon(
    theme: string,
    variant: number,
    ctx: PatternContext,
): void {
    const icon = getThemedIcon(theme, variant);
    drawIcon(icon, ctx);
}
