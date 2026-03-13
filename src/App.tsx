import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Settings2, X, Hand, Maximize, Minimize, RotateCw, Shuffle, Download, Play, Pause, Layers, Sparkles, Palette, GripHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Seeded RNG ---
function mulberry32(a: number) {
    return function() {
      let t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

// --- Types & Config ---
type PatternMode = 'cultural' | 'generative';

interface AppConfig {
    symmetry: number;
    layers: number;
    spread: number;
    roughness: number;
    twist: number;
    seed: number;
    spinSpeed: number;
    waveSpeed: number;
    zoom: number;
    mode: PatternMode;
}

const DEFAULT_CONFIG: AppConfig = {
    symmetry: 12,
    layers: 6,
    spread: 70,
    roughness: 2.0,
    twist: 0,
    seed: 42,
    spinSpeed: 1,
    waveSpeed: 1,
    zoom: 0,
    mode: 'cultural'
};

export default function App() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [uiVisible, setUiVisible] = useState(true);
    const [isAutoAnimating, setIsAutoAnimating] = useState(false);
    const [layerCount, setLayerCount] = useState(DEFAULT_CONFIG.layers);
    const [spinSpeed, setSpinSpeed] = useState(DEFAULT_CONFIG.spinSpeed);
    const [waveSpeed, setWaveSpeed] = useState(DEFAULT_CONFIG.waveSpeed);
    const [patternMode, setPatternMode] = useState<PatternMode>(DEFAULT_CONFIG.mode);

    // High-frequency refs
    const configRef = useRef<AppConfig>({ ...DEFAULT_CONFIG });
    const isDirtyRef = useRef(true);
    const autoAnimateRef = useRef(false);
    const wavePhaseRef = useRef(0);
    const lastTimeRef = useRef(performance.now());
    
    // Interaction refs
    const touchesRef = useRef<Map<number, {x: number, y: number}>>(new Map());
    const lastTapRef = useRef<number>(0);
    const initialPinchDistRef = useRef<number | null>(null);
    const initialPinchAngleRef = useRef<number | null>(null);
    const initialConfigRef = useRef<AppConfig | null>(null);
    
    // Pointer reactivity
    const pointerRef = useRef({ x: -1000, y: -1000, active: false });
    const easedPointerRef = useRef({ x: -1000, y: -1000 });

    // Panel drag state
    const [panelPos, setPanelPos] = useState<{x: number, y: number} | null>(null);
    const panelDragRef = useRef<{dragging: boolean, startX: number, startY: number, origX: number, origY: number}>({dragging: false, startX: 0, startY: 0, origX: 0, origY: 0});
    const panelRef = useRef<HTMLDivElement>(null);

    // --- Drawing Logic ---
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = window.innerWidth;
        const height = window.innerHeight;
        const dpr = window.devicePixelRatio || 1;

        // Ease pointer for smooth reactive bulging
        const dx = pointerRef.current.x - easedPointerRef.current.x;
        const dy = pointerRef.current.y - easedPointerRef.current.y;
        easedPointerRef.current.x += dx * 0.1;
        easedPointerRef.current.y += dy * 0.1;

        const now = performance.now();
        const dt = (now - lastTimeRef.current) / 1000;
        lastTimeRef.current = now;

        if (autoAnimateRef.current) {
            configRef.current.twist += 0.3 * dt * configRef.current.spinSpeed;
            wavePhaseRef.current += 250 * dt * configRef.current.waveSpeed;
            isDirtyRef.current = true;
        }

        // If pointer is moving or config is dirty, we need to draw
        const isPointerMoving = Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5;
        if (!isDirtyRef.current && !isPointerMoving && !pointerRef.current.active) return;

        // Quality: Set line rendering properties for smooth strokes
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.miterLimit = 2;

        // Clear with warm stone/paper texture color
        ctx.fillStyle = '#EBE7E0';
        ctx.fillRect(0, 0, width, height);

        ctx.save();
        ctx.translate(width / 2, height / 2);

        const config = configRef.current;
        const sym = Math.max(4, Math.floor(config.symmetry));
        const layers = Math.max(1, Math.floor(config.layers));
        const angleStep = (Math.PI * 2) / sym;

        let activePointerDist = Math.hypot(easedPointerRef.current.x - width/2, easedPointerRef.current.y - height/2);
        let isBulgeActive = pointerRef.current.active;

        if (autoAnimateRef.current && !pointerRef.current.active) {
            const maxDist = Math.max(width, height) / 2 + config.spread * 2;
            wavePhaseRef.current = wavePhaseRef.current % maxDist;
            if (wavePhaseRef.current < 0) wavePhaseRef.current += maxDist;
            activePointerDist = wavePhaseRef.current;
            isBulgeActive = true;
        }

        const zoom = config.zoom;
        const shift = Math.floor(zoom);
        const offset = zoom - shift; // [0, 1)

        const startAbs = -1 - shift;
        const count = layers + 2; // l from -1 to layers

        const isGenerative = config.mode === 'generative';
        const numTypes = isGenerative ? 8 : 8; // Both modes now have 8 types

        // Calculate types
        const getStep = (absL: number) => Math.floor(mulberry32(config.seed + absL * 999)() * (numTypes - 1)) + 1;
        let currentType = Math.floor(mulberry32(config.seed)() * numTypes);
        if (startAbs > 0) {
            for (let i = 1; i <= startAbs; i++) currentType = (currentType + getStep(i)) % numTypes;
        } else if (startAbs < 0) {
            for (let i = 0; i > startAbs; i--) currentType = (currentType - getStep(i) + numTypes) % numTypes;
        }

        const layerTypes: number[] = [];
        const layerFilled: boolean[] = [];
        for (let i = 0; i < count; i++) {
            const absL = startAbs + i;
            if (i > 0) {
                currentType = (currentType + getStep(absL)) % numTypes;
            }
            layerTypes.push(currentType);
            layerFilled.push(mulberry32(config.seed + absL * 999 + 1)() > 0.5);
        }

        // Helper: Map (u, v) in [0,1]x[0,1] to Polar Cartesian
        const mapUV = (u: number, v: number, r1: number, r2: number, layerTwist: number) => {
            const r = r1 + v * (r2 - r1);
            const a = (u * angleStep) + layerTwist;
            return { x: r * Math.cos(a), y: r * Math.sin(a) };
        };

        type PathStyle = 'filled' | 'opaque-outline' | 'outline' | 'line';

        // Adaptive line width based on layer band thickness
        const getLineWidth = (r1: number, r2: number) => {
            const band = r2 - r1;
            return Math.max(0.8, Math.min(2.5, band * 0.02));
        };

        // Helper: Draw a smooth bezier curve through points
        const drawSmoothPath = (points: {x: number, y: number}[], style: PathStyle, rng: () => number, lw?: number) => {
            if (points.length < 2) return;
            const lineWidth = lw ?? 1.5;

            // Apply consistent roughness to both fill and stroke using same offsets
            const offsets = points.map(() => ({
                dx: (rng() - 0.5) * config.roughness,
                dy: (rng() - 0.5) * config.roughness
            }));

            const perturbedPoints = points.map((p, i) => ({
                x: p.x + offsets[i].dx,
                y: p.y + offsets[i].dy
            }));

            const tracePath = (pts: {x: number, y: number}[], close: boolean) => {
                ctx.beginPath();
                ctx.moveTo(pts[0].x, pts[0].y);
                if (pts.length === 2) {
                    ctx.lineTo(pts[1].x, pts[1].y);
                } else {
                    // Catmull-Rom to Bezier for smooth curves through all points
                    for (let i = 0; i < pts.length - 1; i++) {
                        const p0 = pts[Math.max(0, i - 1)];
                        const p1 = pts[i];
                        const p2 = pts[Math.min(pts.length - 1, i + 1)];
                        const p3 = pts[Math.min(pts.length - 1, i + 2)];

                        const tension = 0.3;
                        const cp1x = p1.x + (p2.x - p0.x) * tension;
                        const cp1y = p1.y + (p2.y - p0.y) * tension;
                        const cp2x = p2.x - (p3.x - p1.x) * tension;
                        const cp2y = p2.y - (p3.y - p1.y) * tension;

                        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
                    }
                }
                if (close) ctx.closePath();
            };

            if (style === 'filled' || style === 'opaque-outline') {
                ctx.fillStyle = style === 'filled' ? '#1A1818' : '#EBE7E0';
                tracePath(perturbedPoints, true);
                ctx.fill();
            }

            ctx.strokeStyle = style === 'filled' ? 'rgba(26, 24, 24, 0.9)' : 'rgba(26, 24, 24, 0.6)';
            ctx.lineWidth = lineWidth;

            // Single clean stroke pass (second pass with slight offset for hand-drawn feel)
            const passes = style === 'filled' ? 1 : 2;
            for (let pass = 0; pass < passes; pass++) {
                const passPoints = pass === 0 ? perturbedPoints : perturbedPoints.map((p, i) => ({
                    x: p.x + offsets[i].dx * 0.3,
                    y: p.y + offsets[i].dy * 0.3
                }));
                tracePath(passPoints, style !== 'line');
                ctx.stroke();
            }
        };

        // Helper: Draw a circle (arc) properly
        const drawCircle = (cx: number, cy: number, radius: number, style: PathStyle, rng: () => number, lw?: number) => {
            const lineWidth = lw ?? 1.5;
            const rx = (rng() - 0.5) * config.roughness * 0.5;
            const ry = (rng() - 0.5) * config.roughness * 0.5;
            ctx.beginPath();
            ctx.arc(cx + rx, cy + ry, Math.max(0.5, radius), 0, Math.PI * 2);
            if (style === 'filled' || style === 'opaque-outline') {
                ctx.fillStyle = style === 'filled' ? '#1A1818' : '#EBE7E0';
                ctx.fill();
            }
            ctx.strokeStyle = style === 'filled' ? 'rgba(26, 24, 24, 0.9)' : 'rgba(26, 24, 24, 0.6)';
            ctx.lineWidth = lineWidth;
            ctx.stroke();
        };

        // ==========================================
        // GENERATIVE MODE: Procedural pattern generators
        // ==========================================
        const drawGenerativeCell = (
            type: number, r1: number, r2: number,
            layerTwist: number, filled: boolean, rng: () => number, lw: number
        ) => {
            const band = r2 - r1;
            const midR = (r1 + r2) / 2;
            const baseStyle: PathStyle = filled ? 'filled' : 'opaque-outline';

            switch (type) {
                case 0: { // Rose curve / rhodonea
                    const k = Math.floor(rng() * 4) + 2; // petals parameter
                    const n = 24 + Math.floor(rng() * 16);
                    const pts: {x: number, y: number}[] = [];
                    for (let j = 0; j <= n; j++) {
                        const t = (j / n) * Math.PI * 2;
                        const rho = Math.cos(k * t) * band * 0.45;
                        const u = (t / angleStep);
                        const v = 0.5 + rho / band;
                        pts.push(mapUV(
                            Math.min(1, Math.max(0, u * 0.8 + 0.1)),
                            Math.min(1, Math.max(0, v)),
                            r1, r2, layerTwist
                        ));
                    }
                    drawSmoothPath(pts, baseStyle, rng, lw);
                    break;
                }

                case 1: { // Phyllotaxis / sunflower spiral dots
                    const numDots = 12 + Math.floor(rng() * 20);
                    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
                    for (let j = 0; j < numDots; j++) {
                        const frac = j / numDots;
                        const theta = j * goldenAngle;
                        const u = ((theta % angleStep) / angleStep);
                        const v = 0.1 + frac * 0.8;
                        const pt = mapUV(u, v, r1, r2, layerTwist);
                        const dotR = Math.max(1, band * 0.015 * (1 + frac));
                        drawCircle(pt.x, pt.y, dotR, j % 3 === 0 ? 'filled' : 'outline', rng, lw * 0.7);
                    }
                    break;
                }

                case 2: { // Lissajous figure
                    const a = Math.floor(rng() * 3) + 1;
                    const b = Math.floor(rng() * 3) + 2;
                    const delta = rng() * Math.PI;
                    const n = 40;
                    const pts: {x: number, y: number}[] = [];
                    for (let j = 0; j <= n; j++) {
                        const t = (j / n) * Math.PI * 2;
                        const u = 0.1 + 0.8 * (0.5 + 0.5 * Math.sin(a * t + delta));
                        const v = 0.1 + 0.8 * (0.5 + 0.5 * Math.sin(b * t));
                        pts.push(mapUV(u, v, r1, r2, layerTwist));
                    }
                    drawSmoothPath(pts, baseStyle, rng, lw);
                    break;
                }

                case 3: { // Concentric arcs with varying radii
                    const nArcs = 3 + Math.floor(rng() * 4);
                    for (let j = 0; j < nArcs; j++) {
                        const frac = (j + 0.5) / nArcs;
                        const arcR = r1 + frac * band;
                        const arcSpan = angleStep * (0.3 + rng() * 0.6);
                        const arcStart = layerTwist + (angleStep - arcSpan) * 0.5;
                        const pts: {x: number, y: number}[] = [];
                        const steps = 16;
                        for (let s = 0; s <= steps; s++) {
                            const a = arcStart + (s / steps) * arcSpan;
                            pts.push({ x: arcR * Math.cos(a), y: arcR * Math.sin(a) });
                        }
                        drawSmoothPath(pts, j % 2 === 0 ? baseStyle : 'line', rng, lw);
                    }
                    break;
                }

                case 4: { // Wave interference / moire pattern
                    const freq1 = 2 + Math.floor(rng() * 4);
                    const freq2 = 3 + Math.floor(rng() * 5);
                    const nLines = 5 + Math.floor(rng() * 4);
                    for (let j = 0; j < nLines; j++) {
                        const baseV = (j + 1) / (nLines + 1);
                        const pts: {x: number, y: number}[] = [];
                        const steps = 20;
                        for (let s = 0; s <= steps; s++) {
                            const u = s / steps;
                            const wave = Math.sin(u * Math.PI * freq1) * 0.06 +
                                         Math.sin(u * Math.PI * freq2 + baseV * Math.PI) * 0.04;
                            pts.push(mapUV(u, baseV + wave, r1, r2, layerTwist));
                        }
                        drawSmoothPath(pts, 'line', rng, lw * 0.8);
                    }
                    break;
                }

                case 5: { // Spirograph / epitrochoid
                    const R = 0.4;
                    const rr = 0.1 + rng() * 0.15;
                    const d = 0.05 + rng() * 0.2;
                    const n = 60;
                    const pts: {x: number, y: number}[] = [];
                    for (let j = 0; j <= n; j++) {
                        const t = (j / n) * Math.PI * 6;
                        const x = (R - rr) * Math.cos(t) + d * Math.cos(((R - rr) / rr) * t);
                        const y = (R - rr) * Math.sin(t) + d * Math.sin(((R - rr) / rr) * t);
                        const u = 0.5 + x;
                        const v = 0.5 + y;
                        pts.push(mapUV(
                            Math.min(1, Math.max(0, u)),
                            Math.min(1, Math.max(0, v)),
                            r1, r2, layerTwist
                        ));
                    }
                    drawSmoothPath(pts, baseStyle, rng, lw);
                    break;
                }

                case 6: { // Recursive triangular subdivision
                    const subdivide = (
                        ax: number, ay: number, bx: number, by: number,
                        cx: number, cy: number, depth: number
                    ) => {
                        if (depth <= 0) {
                            const pts = [
                                mapUV(ax, ay, r1, r2, layerTwist),
                                mapUV(bx, by, r1, r2, layerTwist),
                                mapUV(cx, cy, r1, r2, layerTwist)
                            ];
                            drawSmoothPath(pts, rng() > 0.6 ? 'filled' : 'outline', rng, lw * 0.7);
                            return;
                        }
                        const mx1 = (ax + bx) / 2, my1 = (ay + by) / 2;
                        const mx2 = (bx + cx) / 2, my2 = (by + cy) / 2;
                        const mx3 = (ax + cx) / 2, my3 = (ay + cy) / 2;
                        subdivide(ax, ay, mx1, my1, mx3, my3, depth - 1);
                        subdivide(mx1, my1, bx, by, mx2, my2, depth - 1);
                        subdivide(mx3, my3, mx2, my2, cx, cy, depth - 1);
                    };
                    const depth = 2 + Math.floor(rng() * 2);
                    subdivide(0.05, 0.05, 0.95, 0.05, 0.5, 0.95, depth);
                    break;
                }

                case 7: { // Radial spokes with terminal ornaments
                    const nSpokes = 3 + Math.floor(rng() * 5);
                    const hasOrnament = rng() > 0.4;
                    for (let j = 0; j < nSpokes; j++) {
                        const u = (j + 0.5) / nSpokes;
                        // Spoke line
                        const p1 = mapUV(u, 0.05, r1, r2, layerTwist);
                        const p2 = mapUV(u, 0.95, r1, r2, layerTwist);
                        drawSmoothPath([p1, p2], 'line', rng, lw);
                        // Terminal diamond or circle
                        if (hasOrnament) {
                            const ornR = band * 0.04;
                            if (j % 2 === 0) {
                                drawCircle(p2.x, p2.y, ornR, 'filled', rng, lw * 0.7);
                            } else {
                                const d = ornR;
                                const pts = [
                                    { x: p2.x, y: p2.y - d },
                                    { x: p2.x + d, y: p2.y },
                                    { x: p2.x, y: p2.y + d },
                                    { x: p2.x - d, y: p2.y }
                                ];
                                drawSmoothPath(pts, 'filled', rng, lw * 0.7);
                            }
                        }
                    }
                    // Midline arc
                    const midPts: {x: number, y: number}[] = [];
                    for (let s = 0; s <= 12; s++) {
                        midPts.push(mapUV(s / 12, 0.5, r1, r2, layerTwist));
                    }
                    drawSmoothPath(midPts, filled ? 'filled' : 'outline', rng, lw * 0.6);
                    break;
                }
            }
        };

        // ==========================================
        // CULTURAL MODE: Improved Mesoamerican patterns
        // ==========================================
        const drawCulturalCell = (
            type: number, r1: number, r2: number,
            layerTwist: number, filled: boolean, rng: () => number, lw: number
        ) => {
            const band = r2 - r1;
            const baseStyle: PathStyle = filled ? 'filled' : 'opaque-outline';

            const drawUV = (uvPoints: [number, number][], style: PathStyle) => {
                const pts = uvPoints.map(p => mapUV(p[0], p[1], r1, r2, layerTwist));
                drawSmoothPath(pts, style, rng, lw);
            };

            switch (type) {
                case 0: { // Stepped Pyramid (Chakana) - refined with more steps
                    drawUV([
                        [0, 0], [0.15, 0], [0.15, 0.15], [0.3, 0.15],
                        [0.3, 0.35], [0.45, 0.35], [0.45, 0.55],
                        [0.55, 0.55], [0.55, 0.75], [0.7, 0.75],
                        [0.7, 0.85], [0.85, 0.85], [0.85, 1], [1, 1], [1, 0]
                    ], baseStyle);
                    // Inner step accent
                    if (!filled) {
                        drawUV([[0.25, 0.2], [0.4, 0.2], [0.4, 0.4], [0.55, 0.4]], 'line');
                    }
                    break;
                }

                case 1: { // Mayan Glyph Block - nested frames with eye motif
                    drawUV([[0.03, 0.03], [0.97, 0.03], [0.97, 0.97], [0.03, 0.97]], baseStyle);
                    if (!filled) {
                        drawUV([[0.15, 0.15], [0.85, 0.15], [0.85, 0.85], [0.15, 0.85]], 'outline');
                        drawUV([[0.3, 0.3], [0.7, 0.3], [0.7, 0.7], [0.3, 0.7]], 'filled');
                        // Center dot
                        const center = mapUV(0.5, 0.5, r1, r2, layerTwist);
                        drawCircle(center.x, center.y, band * 0.04, 'opaque-outline', rng, lw);
                    } else {
                        drawUV([[0.2, 0.2], [0.8, 0.2], [0.8, 0.8], [0.2, 0.8]], 'opaque-outline');
                        drawUV([[0.35, 0.35], [0.65, 0.35], [0.65, 0.65], [0.35, 0.65]], 'opaque-outline');
                    }
                    break;
                }

                case 2: { // Sun Rays - proper triangular rays with graduated hatching
                    drawUV([[0.05, 0], [0.95, 0], [0.5, 0.92]], baseStyle);
                    if (!filled) {
                        const hatchCount = 5;
                        for (let h = 0; h < hatchCount; h++) {
                            const t = (h + 1) / (hatchCount + 1);
                            const left = 0.05 + (0.5 - 0.05) * t;
                            const right = 0.95 - (0.95 - 0.5) * t;
                            const v = t * 0.92;
                            drawUV([[left, v], [right, v]], 'line');
                        }
                    } else {
                        // Inner triangle cutout
                        drawUV([[0.25, 0.15], [0.75, 0.15], [0.5, 0.65]], 'opaque-outline');
                    }
                    break;
                }

                case 3: { // Aztec Fret (Meander) - more detailed spiral fret
                    if (filled) {
                        drawUV([
                            [0, 0], [0.85, 0], [0.85, 0.85], [0.15, 0.85],
                            [0.15, 0.3], [0.55, 0.3], [0.55, 0.55], [0.35, 0.55],
                            [0.35, 0.15], [1.0, 0.15], [1.0, 1.0], [0, 1.0]
                        ], 'filled');
                        // Inner accent
                        drawUV([[0.4, 0.38], [0.5, 0.38], [0.5, 0.48], [0.4, 0.48]], 'opaque-outline');
                    } else {
                        // Open fret path with more detail
                        drawUV([
                            [0.05, 0.05], [0.95, 0.05], [0.95, 0.95],
                            [0.25, 0.95], [0.25, 0.35], [0.75, 0.35],
                            [0.75, 0.65], [0.45, 0.65]
                        ], 'line');
                        drawUV([[0.05, 0.05], [0.05, 0.95]], 'line');
                    }
                    break;
                }

                case 4: { // Interlocking Teeth - with serrated edges
                    drawUV([[0, 0], [0.5, 0.75], [1, 0]], baseStyle);
                    drawUV([[0, 1], [0.5, 0.25], [1, 1]], filled ? 'opaque-outline' : 'filled');
                    // Serration detail
                    if (!filled) {
                        drawUV([[0.2, 0.3], [0.5, 0.55], [0.8, 0.3]], 'line');
                        drawUV([[0.2, 0.7], [0.5, 0.45], [0.8, 0.7]], 'line');
                    }
                    break;
                }

                case 5: { // Serpent scales - overlapping curved scales
                    const cols = 3;
                    const rows = 2;
                    for (let row = 0; row < rows; row++) {
                        for (let col = 0; col < cols; col++) {
                            const cx = (col + 0.5 + (row % 2) * 0.5) / (cols + 1);
                            const cy = (row + 0.5) / (rows + 0.5);
                            const w = 0.3 / cols;
                            const h = 0.35 / rows;
                            const pts: [number, number][] = [];
                            for (let t = 0; t <= 12; t++) {
                                const angle = (t / 12) * Math.PI;
                                pts.push([
                                    cx + Math.cos(angle) * w,
                                    cy - Math.sin(angle) * h
                                ]);
                            }
                            drawUV(pts, row % 2 === 0 ? baseStyle : (filled ? 'opaque-outline' : 'outline'));
                        }
                    }
                    break;
                }

                case 6: { // Quetzalcoatl feather - flowing curves with spine
                    // Central spine
                    drawUV([[0.5, 0.0], [0.5, 1.0]], 'line');
                    // Feather barbs - alternating left/right curves
                    const nBarbs = 5;
                    for (let j = 0; j < nBarbs; j++) {
                        const v = (j + 0.5) / nBarbs;
                        const side = j % 2 === 0 ? 1 : -1;
                        const pts: [number, number][] = [
                            [0.5, v],
                            [0.5 + side * 0.15, v - 0.04],
                            [0.5 + side * 0.35, v - 0.06],
                            [0.5 + side * 0.45, v - 0.02]
                        ];
                        drawUV(pts, j % 3 === 0 ? baseStyle : 'line');
                    }
                    break;
                }

                case 7: { // Ollin (movement) - interlocking curved wings
                    // Four-part rotational motif
                    drawUV([
                        [0.5, 0.1], [0.7, 0.2], [0.9, 0.5],
                        [0.7, 0.45], [0.55, 0.4]
                    ], baseStyle);
                    drawUV([
                        [0.5, 0.9], [0.3, 0.8], [0.1, 0.5],
                        [0.3, 0.55], [0.45, 0.6]
                    ], baseStyle);
                    // Center cross
                    drawUV([[0.4, 0.45], [0.6, 0.45], [0.6, 0.55], [0.4, 0.55]], filled ? 'opaque-outline' : 'filled');
                    // Corner accents
                    const c = mapUV(0.5, 0.5, r1, r2, layerTwist);
                    drawCircle(c.x, c.y, band * 0.025, 'filled', rng, lw);
                    break;
                }
            }
        };

        // Draw Layers from outside in
        for (let l = layers; l >= -1; l--) {
            const absL = l - shift;
            const type = layerTypes[l + 1];
            const filled = layerFilled[l + 1];
            const layerRng = mulberry32(config.seed + absL * 999);

            // Base radii
            let r1 = Math.max(0, (l + offset) * config.spread);
            let r2 = Math.max(0, (l + 1 + offset) * config.spread);

            if (r2 <= 0) continue;

            // Reactive Bulge: if pointer is near this layer, expand it slightly
            const midR = (r1 + r2) / 2;
            const distToLayer = Math.abs(activePointerDist - midR);
            let bulge = 0;
            if (isBulgeActive && distToLayer < config.spread * 1.5) {
                bulge = (1 - distToLayer / (config.spread * 1.5)) * (config.spread * 0.4);
            }
            r2 += bulge;
            if (r1 > 0) r1 += bulge * 0.5;

            const lw = getLineWidth(r1, r2);

            // Proper clipping: clip to annular ring
            ctx.save();
            ctx.beginPath();
            ctx.arc(0, 0, r2, 0, Math.PI * 2);
            ctx.arc(0, 0, Math.max(0, r1 - 1), 0, Math.PI * 2, true);
            ctx.clip();

            // Fill the band background
            ctx.fillStyle = '#EBE7E0';
            ctx.beginPath();
            ctx.arc(0, 0, r2, 0, Math.PI * 2);
            ctx.fill();

            // Twist: Inner layers twist more than outer layers
            const layerTwist = config.twist * (1 / (Math.abs(absL) + 1));

            // Draw separator ring at outer boundary
            ctx.beginPath();
            ctx.arc(0, 0, r2, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(26, 24, 24, 0.5)';
            ctx.lineWidth = lw * 0.8;
            ctx.stroke();

            // Draw pattern cells
            for (let i = 0; i < sym; i++) {
                ctx.save();
                ctx.rotate(i * angleStep);

                if (isGenerative) {
                    drawGenerativeCell(type, r1, r2, layerTwist, filled, layerRng, lw);
                } else {
                    drawCulturalCell(type, r1, r2, layerTwist, filled, layerRng, lw);
                }

                ctx.restore();
            }

            ctx.restore(); // Restore clipping
        }

        // Draw inner circle cap
        const innerR = Math.max(0, offset * config.spread);
        if (innerR > 0) {
            ctx.beginPath();
            ctx.arc(0, 0, innerR, 0, Math.PI * 2);
            ctx.fillStyle = '#EBE7E0';
            ctx.fill();
            ctx.strokeStyle = 'rgba(26, 24, 24, 0.5)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        ctx.restore();

        // Add subtle grain overlay (seeded for stability)
        const grainRng = mulberry32(Math.floor(now * 0.001));
        ctx.fillStyle = 'rgba(0,0,0,0.025)';
        for(let i = 0; i < 1200; i++) {
            ctx.fillRect(grainRng() * width, grainRng() * height, 1.5, 1.5);
        }

        isDirtyRef.current = false;
    }, []);

    // --- Animation Loop ---
    useEffect(() => {
        let animationFrameId: number;
        const renderLoop = () => {
            draw();
            animationFrameId = requestAnimationFrame(renderLoop);
        };
        renderLoop();
        return () => cancelAnimationFrame(animationFrameId);
    }, [draw]);

    // --- Resize Handler ---
    useEffect(() => {
        const handleResize = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            const ctx = canvas.getContext('2d');
            if (ctx) ctx.scale(dpr, dpr);
            isDirtyRef.current = true;
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // --- Gesture Handlers ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const getDistance = (p1: {x: number, y: number}, p2: {x: number, y: number}) => Math.hypot(p2.x - p1.x, p2.y - p1.y);
        const getAngle = (p1: {x: number, y: number}, p2: {x: number, y: number}) => Math.atan2(p2.y - p1.y, p2.x - p1.x);

        const onTouchStart = (e: TouchEvent) => {
            e.preventDefault();
            const now = Date.now();
            
            if (e.touches.length === 1) {
                if (now - lastTapRef.current < 300) {
                    configRef.current.seed = Math.random() * 10000;
                    isDirtyRef.current = true;
                }
                lastTapRef.current = now;
                
                pointerRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, active: true };
                easedPointerRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }

            for (let i = 0; i < e.touches.length; i++) {
                touchesRef.current.set(e.touches[i].identifier, {
                    x: e.touches[i].clientX,
                    y: e.touches[i].clientY
                });
            }

            if (e.touches.length === 2) {
                const t1 = e.touches[0];
                const t2 = e.touches[1];
                initialPinchDistRef.current = getDistance({x: t1.clientX, y: t1.clientY}, {x: t2.clientX, y: t2.clientY});
                initialPinchAngleRef.current = getAngle({x: t1.clientX, y: t1.clientY}, {x: t2.clientX, y: t2.clientY});
                initialConfigRef.current = { ...configRef.current };
                pointerRef.current.active = false; // Disable single-pointer bulge during pinch
            } else if (e.touches.length === 1) {
                initialConfigRef.current = { ...configRef.current };
            }
        };

        const onTouchMove = (e: TouchEvent) => {
            e.preventDefault();
            
            if (e.touches.length === 1) {
                pointerRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, active: true };
            }

            if (!initialConfigRef.current) return;

            if (e.touches.length === 1) {
                // 1 Finger Pan -> Twist (X) and Symmetry (Y)
                const touch = e.touches[0];
                const startTouch = touchesRef.current.get(touch.identifier);
                if (startTouch) {
                    const dx = touch.clientX - startTouch.x;
                    const dy = touch.clientY - startTouch.y;
                    
                    configRef.current.twist = initialConfigRef.current.twist + dx * 0.01;
                    configRef.current.symmetry = Math.max(4, Math.min(48, initialConfigRef.current.symmetry - dy * 0.05));
                    isDirtyRef.current = true;
                }
            } else if (e.touches.length === 2) {
                // 2 Fingers -> Pinch (Spread) and Rotate (Roughness)
                const t1 = e.touches[0];
                const t2 = e.touches[1];
                const currentDist = getDistance({x: t1.clientX, y: t1.clientY}, {x: t2.clientX, y: t2.clientY});
                const currentAngle = getAngle({x: t1.clientX, y: t1.clientY}, {x: t2.clientX, y: t2.clientY});

                if (initialPinchDistRef.current && initialPinchAngleRef.current) {
                    const scale = currentDist / initialPinchDistRef.current;
                    configRef.current.zoom = initialConfigRef.current.zoom + Math.log2(scale);

                    let angleDiff = currentAngle - initialPinchAngleRef.current;
                    if (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
                    if (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
                    
                    configRef.current.roughness = Math.max(0, Math.min(10, initialConfigRef.current.roughness + angleDiff * 5));
                    isDirtyRef.current = true;
                }
            }
        };

        const onTouchEnd = (e: TouchEvent) => {
            e.preventDefault();
            const activeIds = Array.from(e.touches).map(t => t.identifier);
            for (const key of Array.from(touchesRef.current.keys())) {
                if (!activeIds.includes(key as number)) {
                    touchesRef.current.delete(key as number);
                }
            }
            if (e.touches.length < 2) {
                initialPinchDistRef.current = null;
                initialPinchAngleRef.current = null;
            }
            if (e.touches.length === 0) {
                initialConfigRef.current = null;
                pointerRef.current.active = false;
                isDirtyRef.current = true; 
            }
        };

        // Mouse fallbacks
        let isMouseDown = false;
        const onMouseDown = (e: MouseEvent) => {
            isMouseDown = true;
            touchesRef.current.set(0, { x: e.clientX, y: e.clientY });
            initialConfigRef.current = { ...configRef.current };
            pointerRef.current = { x: e.clientX, y: e.clientY, active: true };
            easedPointerRef.current = { x: e.clientX, y: e.clientY };
        };
        const onMouseMove = (e: MouseEvent) => {
            pointerRef.current = { x: e.clientX, y: e.clientY, active: true };
            
            if (!isMouseDown || !initialConfigRef.current) return;
            const startTouch = touchesRef.current.get(0);
            if (startTouch) {
                const dx = e.clientX - startTouch.x;
                const dy = e.clientY - startTouch.y;
                configRef.current.twist = initialConfigRef.current.twist + dx * 0.01;
                configRef.current.symmetry = Math.max(4, Math.min(48, initialConfigRef.current.symmetry - dy * 0.05));
                isDirtyRef.current = true;
            }
        };
        const onMouseUp = () => {
            isMouseDown = false;
            touchesRef.current.clear();
            initialConfigRef.current = null;
            pointerRef.current.active = false;
            isDirtyRef.current = true;
        };
        const onWheel = (e: WheelEvent) => {
            configRef.current.zoom -= e.deltaY * 0.002;
            isDirtyRef.current = true;
        };

        canvas.addEventListener('touchstart', onTouchStart, { passive: false });
        canvas.addEventListener('touchmove', onTouchMove, { passive: false });
        canvas.addEventListener('touchend', onTouchEnd, { passive: false });
        canvas.addEventListener('touchcancel', onTouchEnd, { passive: false });
        
        canvas.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mouseleave', onMouseUp);
        canvas.addEventListener('wheel', onWheel, { passive: false });

        return () => {
            canvas.removeEventListener('touchstart', onTouchStart);
            canvas.removeEventListener('touchmove', onTouchMove);
            canvas.removeEventListener('touchend', onTouchEnd);
            canvas.removeEventListener('touchcancel', onTouchEnd);
            
            canvas.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('mouseleave', onMouseUp);
            canvas.removeEventListener('wheel', onWheel);
        };
    }, []);

    const handleSave = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `aztec-mandala-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    const handleRandomize = () => {
        configRef.current.seed = Math.random() * 10000;
        // Keep the user's selected layer count instead of randomizing it
        isDirtyRef.current = true;
    };

    const toggleAutoAnimate = () => {
        const next = !isAutoAnimating;
        setIsAutoAnimating(next);
        autoAnimateRef.current = next;
    };

    const handleLayerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value, 10);
        setLayerCount(val);
        configRef.current.layers = val;
        isDirtyRef.current = true;
    };

    const handleSpinSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setSpinSpeed(val);
        configRef.current.spinSpeed = val;
    };

    const handleWaveSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setWaveSpeed(val);
        configRef.current.waveSpeed = val;
    };

    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', onFsChange);
        document.addEventListener('webkitfullscreenchange', onFsChange);
        return () => {
            document.removeEventListener('fullscreenchange', onFsChange);
            document.removeEventListener('webkitfullscreenchange', onFsChange);
        };
    }, []);

    const toggleFullscreen = () => {
        const el = document.documentElement as HTMLElement & { webkitRequestFullscreen?: () => void };
        const doc = document as Document & { webkitExitFullscreen?: () => void };
        if (!document.fullscreenElement) {
            if (el.requestFullscreen) el.requestFullscreen();
            else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
        } else {
            if (doc.exitFullscreen) doc.exitFullscreen();
            else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
        }
    };

    // Panel drag handlers
    const onPanelDragStart = (e: React.PointerEvent) => {
        e.stopPropagation();
        e.preventDefault();
        const panel = panelRef.current;
        if (!panel) return;
        const rect = panel.getBoundingClientRect();
        const currentX = panelPos ? panelPos.x : rect.left + rect.width / 2;
        const currentY = panelPos ? panelPos.y : rect.top;
        panelDragRef.current = { dragging: true, startX: e.clientX, startY: e.clientY, origX: currentX, origY: currentY };
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const onPanelDragMove = (e: React.PointerEvent) => {
        if (!panelDragRef.current.dragging) return;
        e.stopPropagation();
        const dx = e.clientX - panelDragRef.current.startX;
        const dy = e.clientY - panelDragRef.current.startY;
        setPanelPos({ x: panelDragRef.current.origX + dx, y: panelDragRef.current.origY + dy });
    };

    const onPanelDragEnd = (e: React.PointerEvent) => {
        e.stopPropagation();
        panelDragRef.current.dragging = false;
    };

    const panelStyle: React.CSSProperties = panelPos ? {
        position: 'fixed',
        left: `${panelPos.x}px`,
        top: `${panelPos.y}px`,
        transform: 'translateX(-50%)',
        bottom: 'auto',
    } : {};

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-[#EBE7E0] text-[#1A1818] font-sans selection:bg-black/10 touch-none">
            <canvas ref={canvasRef} className="block w-full h-full cursor-crosshair" />

            <button 
                onPointerDown={(e) => { e.stopPropagation(); setPanelPos(null); setUiVisible(v => !v); }}
                className="absolute top-6 left-6 z-50 p-3 rounded-full bg-white/80 backdrop-blur-md border border-black/10 text-black hover:bg-black hover:text-white transition-all duration-300 shadow-lg shadow-black/5 pointer-events-auto touch-auto"
                title="Toggle Controls"
            >
                {uiVisible ? <X size={24} /> : <Settings2 size={24} />}
            </button>

            <div className="absolute top-6 right-6 z-50 flex gap-2 pointer-events-auto touch-auto">
                <button
                    onPointerDown={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                    className="p-3 rounded-full bg-white/80 backdrop-blur-md border border-black/10 text-black hover:bg-black hover:text-white transition-all duration-300 shadow-lg shadow-black/5"
                    title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                >
                    {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
                </button>
                <button
                    onPointerDown={(e) => { e.stopPropagation(); handleSave(); }}
                    className="p-3 rounded-full bg-white/80 backdrop-blur-md border border-black/10 text-black hover:bg-black hover:text-white transition-all duration-300 shadow-lg shadow-black/5"
                    title="Save Image"
                >
                    <Download size={24} />
                </button>
            </div>

            <AnimatePresence>
                {uiVisible && (
                    <motion.div
                        ref={panelRef}
                        initial={{ y: 50, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 50, opacity: 0, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        style={panelStyle}
                        className={`${panelPos ? 'fixed' : 'absolute bottom-4 left-1/2 -translate-x-1/2'} w-[90%] max-w-md max-h-[75vh] overflow-y-auto overscroll-contain bg-white/90 backdrop-blur-xl border border-black/10 rounded-3xl p-6 shadow-2xl shadow-black/10 pointer-events-auto touch-auto z-40`}
                    >
                        {/* Drag handle */}
                        <div
                            onPointerDown={onPanelDragStart}
                            onPointerMove={onPanelDragMove}
                            onPointerUp={onPanelDragEnd}
                            className="flex justify-center items-center cursor-grab active:cursor-grabbing py-1 -mt-2 mb-2 touch-none"
                        >
                            <GripHorizontal size={20} className="text-black/30" />
                        </div>

                        <button
                            onPointerDown={(e) => { e.stopPropagation(); setUiVisible(false); }}
                            className="absolute top-4 right-4 p-2 text-black/40 hover:text-black transition-colors pointer-events-auto touch-auto"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center mb-4">
                            <h2 className="text-xl font-bold tracking-tight text-black uppercase mb-1">Mesoamerican Mandala</h2>
                            <p className="text-xs text-black/50 uppercase tracking-widest font-medium">Interactive Aztec/Mayan Textures</p>
                        </div>

                        <div className="flex justify-center gap-2 mb-5 pointer-events-auto touch-auto">
                            <button
                                onPointerDown={(e) => {
                                    e.stopPropagation();
                                    setPatternMode('cultural');
                                    configRef.current.mode = 'cultural';
                                    isDirtyRef.current = true;
                                }}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${patternMode === 'cultural' ? 'bg-black text-white shadow-md' : 'bg-black/5 text-black/60 hover:bg-black/10'}`}
                            >
                                <Palette size={14} />
                                Cultural
                            </button>
                            <button
                                onPointerDown={(e) => {
                                    e.stopPropagation();
                                    setPatternMode('generative');
                                    configRef.current.mode = 'generative';
                                    isDirtyRef.current = true;
                                }}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${patternMode === 'generative' ? 'bg-black text-white shadow-md' : 'bg-black/5 text-black/60 hover:bg-black/10'}`}
                            >
                                <Sparkles size={14} />
                                Generative
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-black/5">
                                <Hand className="mb-2 text-black/70" size={24} />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-black/70">Pan 1 Finger</span>
                                <span className="text-[10px] text-black/50 text-center mt-1">Twist (X)<br/>Symmetry (Y)</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-black/5">
                                <Maximize className="mb-2 text-black/70" size={24} />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-black/70">Pinch / Scroll</span>
                                <span className="text-[10px] text-black/50 text-center mt-1">Infinite Zoom</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-black/5">
                                <RotateCw className="mb-2 text-black/70" size={24} />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-black/70">Rotate 2 Fingers</span>
                                <span className="text-[10px] text-black/50 text-center mt-1">Roughness</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-black/5">
                                <Shuffle className="mb-2 text-black/70" size={24} />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-black/70">Double Tap</span>
                                <span className="text-[10px] text-black/50 text-center mt-1">Randomize Pattern</span>
                            </div>
                        </div>
                        
                        <div className="text-center mb-4">
                            <p className="text-[10px] text-black/60 uppercase tracking-widest font-bold">Hover / Touch to expand layers</p>
                        </div>

                        <div className="mb-6 pointer-events-auto touch-auto">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-black/70 flex items-center gap-2">
                                    <Layers size={14} />
                                    Layers: {layerCount}
                                </label>
                            </div>
                            <input 
                                type="range" 
                                min="1" 
                                max="30" 
                                value={layerCount} 
                                onChange={handleLayerChange}
                                className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer accent-black"
                            />
                        </div>

                        {isAutoAnimating && (
                            <div className="flex gap-4 mb-6 pointer-events-auto touch-auto">
                                <div className="flex-1">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-black/70 flex items-center gap-2 mb-2">
                                        Spin Speed
                                    </label>
                                    <input 
                                        type="range" min="-3" max="3" step="0.1" 
                                        value={spinSpeed} onChange={handleSpinSpeedChange}
                                        className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer accent-black"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-black/70 flex items-center gap-2 mb-2">
                                        Wave Speed
                                    </label>
                                    <input 
                                        type="range" min="0" max="3" step="0.1" 
                                        value={waveSpeed} onChange={handleWaveSpeedChange}
                                        className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer accent-black"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="pointer-events-auto flex justify-center gap-3">
                            <button 
                                onPointerDown={(e) => { e.stopPropagation(); toggleAutoAnimate(); }}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-colors shadow-lg active:scale-95 pointer-events-auto touch-auto ${isAutoAnimating ? 'bg-black/10 text-black shadow-black/5' : 'bg-black text-white shadow-black/20 hover:bg-black/80'}`}
                            >
                                {isAutoAnimating ? <Pause size={18} /> : <Play size={18} />}
                                {isAutoAnimating ? 'Stop' : 'Animate'}
                            </button>
                            <button 
                                onPointerDown={(e) => { e.stopPropagation(); handleRandomize(); }}
                                className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full text-sm font-bold uppercase tracking-wider hover:bg-black/80 transition-colors shadow-lg shadow-black/20 active:scale-95 pointer-events-auto touch-auto"
                            >
                                <Shuffle size={18} />
                                Randomize Now
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
