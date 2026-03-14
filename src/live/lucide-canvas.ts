/**
 * Renders Lucide icons directly on Canvas2D using Path2D.
 * Sharp rendering — no hand-drawn wobble.
 *
 * Lucide icons use a 24×24 viewBox with stroke-based rendering.
 * We extract the SVG element data (path d, circle, rect, line, etc.)
 * and convert to Path2D objects for crisp canvas drawing.
 */

/** Raw icon node as stored by Lucide: [elementType, attributes][] */
export type IconNode = [string, Record<string, string>][];

/** Pre-parsed icon ready for canvas rendering */
export interface CanvasIcon {
    name: string;
    paths: Path2D[];      // All elements combined into Path2D objects
    hasCircles: boolean;  // Whether icon contains circles (need arc rendering)
    circleData: { cx: number; cy: number; r: number }[];
    rectData: { x: number; y: number; w: number; h: number; rx: number }[];
}

/** Cache of parsed icons */
const iconCache = new Map<string, CanvasIcon>();

/**
 * Convert a Lucide icon node to a CanvasIcon with Path2D objects.
 * Handles: path, circle, rect, line, polyline, polygon, ellipse
 */
export function parseIconNode(name: string, node: IconNode): CanvasIcon {
    const cached = iconCache.get(name);
    if (cached) return cached;

    const paths: Path2D[] = [];
    const circleData: { cx: number; cy: number; r: number }[] = [];
    const rectData: { x: number; y: number; w: number; h: number; rx: number }[] = [];
    let hasCircles = false;

    for (const [tag, attrs] of node) {
        switch (tag) {
            case 'path': {
                if (attrs.d) {
                    paths.push(new Path2D(attrs.d));
                }
                break;
            }
            case 'circle': {
                const cx = parseFloat(attrs.cx ?? '0');
                const cy = parseFloat(attrs.cy ?? '0');
                const r = parseFloat(attrs.r ?? '0');
                hasCircles = true;
                circleData.push({ cx, cy, r });
                // Also create a Path2D for the circle
                const p = new Path2D();
                p.arc(cx, cy, r, 0, Math.PI * 2);
                paths.push(p);
                break;
            }
            case 'ellipse': {
                const cx = parseFloat(attrs.cx ?? '0');
                const cy = parseFloat(attrs.cy ?? '0');
                const rx = parseFloat(attrs.rx ?? '0');
                const ry = parseFloat(attrs.ry ?? '0');
                const p = new Path2D();
                p.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
                paths.push(p);
                break;
            }
            case 'rect': {
                const x = parseFloat(attrs.x ?? '0');
                const y = parseFloat(attrs.y ?? '0');
                const w = parseFloat(attrs.width ?? '0');
                const h = parseFloat(attrs.height ?? '0');
                const rx = parseFloat(attrs.rx ?? '0');
                rectData.push({ x, y, w, h, rx });
                const p = new Path2D();
                if (rx > 0) {
                    p.roundRect(x, y, w, h, rx);
                } else {
                    p.rect(x, y, w, h);
                }
                paths.push(p);
                break;
            }
            case 'line': {
                const x1 = parseFloat(attrs.x1 ?? '0');
                const y1 = parseFloat(attrs.y1 ?? '0');
                const x2 = parseFloat(attrs.x2 ?? '0');
                const y2 = parseFloat(attrs.y2 ?? '0');
                const p = new Path2D();
                p.moveTo(x1, y1);
                p.lineTo(x2, y2);
                paths.push(p);
                break;
            }
            case 'polyline':
            case 'polygon': {
                const pointsStr = attrs.points ?? '';
                const nums = pointsStr.trim().split(/[\s,]+/).map(Number);
                if (nums.length >= 4) {
                    const p = new Path2D();
                    p.moveTo(nums[0], nums[1]);
                    for (let i = 2; i < nums.length; i += 2) {
                        p.lineTo(nums[i], nums[i + 1]);
                    }
                    if (tag === 'polygon') p.closePath();
                    paths.push(p);
                }
                break;
            }
        }
    }

    const icon: CanvasIcon = { name, paths, hasCircles, circleData, rectData };
    iconCache.set(name, icon);
    return icon;
}

/**
 * Draw a CanvasIcon on a 2D context.
 * The icon is rendered centered at (cx, cy) with the given size.
 * Sharp stroke-based rendering matching Lucide's default style.
 */
export function drawCanvasIcon(
    ctx: CanvasRenderingContext2D,
    icon: CanvasIcon,
    cx: number,
    cy: number,
    size: number,
    color: string,
    strokeWidth = 1.5,
): void {
    const scale = size / 24; // Lucide icons are 24x24

    ctx.save();
    ctx.translate(cx - size / 2, cy - size / 2);
    ctx.scale(scale, scale);

    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth / scale; // Keep consistent stroke width
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = 'none';

    for (const path of icon.paths) {
        ctx.stroke(path);
    }

    ctx.restore();
}

/**
 * Draw a CanvasIcon radially oriented (rotated to follow the mandala slice).
 * The icon is drawn at distance `r` from origin, sized to `size`,
 * with the canvas already rotated to the correct slice angle.
 */
export function drawCanvasIconRadial(
    ctx: CanvasRenderingContext2D,
    icon: CanvasIcon,
    r: number,
    size: number,
    color: string,
    strokeWidth = 1.5,
): void {
    drawCanvasIcon(ctx, icon, r, 0, size, color, strokeWidth);
}
