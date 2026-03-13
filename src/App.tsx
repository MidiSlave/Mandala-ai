import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Settings2, X, Hand, Maximize, Shuffle, Download, Play, Pause, Layers, Palette, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { aztecPatterns, lacePatterns, nordicPatterns, chevronPatterns, lotusPatterns, greekkeyPatterns, tribalPatterns, artDecoPatterns, sacredPatterns, japanesePatterns, celticPatterns, egyptianPatterns, mesoamericanPatterns, generativePatterns, guillochePatterns, fractalPatterns, spiralPatterns, harmonographPatterns, truchetPatterns, islamicPatterns, opArtPatterns, artNouveauPatterns, aboriginalPatterns, polynesianPatterns } from './patterns';
import type { PathStyle, PatternSet } from './patterns';
import type { ColorTheme, AppConfig } from './config/types';
import { DEFAULT_CONFIG, COLOR_THEMES } from './config/defaults';
import { mulberry32 } from './utils/rng';
import { getFullscreenElement, requestFullscreen, exitFullscreen } from './utils/fullscreen';

const ALL_PATTERN_SETS: PatternSet[] = [
    aztecPatterns, lacePatterns, nordicPatterns, chevronPatterns,
    lotusPatterns, greekkeyPatterns, tribalPatterns, artDecoPatterns,
    sacredPatterns, japanesePatterns, celticPatterns, egyptianPatterns,
    mesoamericanPatterns, generativePatterns, guillochePatterns,
    fractalPatterns, spiralPatterns, harmonographPatterns, truchetPatterns,
    islamicPatterns, opArtPatterns, artNouveauPatterns, aboriginalPatterns,
    polynesianPatterns
];

export default function App() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [uiVisible, setUiVisible] = useState(true);
    const [isAutoAnimating, setIsAutoAnimating] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [layerCount, setLayerCount] = useState(DEFAULT_CONFIG.layers);
    const [spinSpeed, setSpinSpeed] = useState(DEFAULT_CONFIG.spinSpeed);
    const [spinVariance, setSpinVariance] = useState(DEFAULT_CONFIG.spinVariance);
    const [waveSpeed, setWaveSpeed] = useState(DEFAULT_CONFIG.waveSpeed);
    const [zoomSpeed, setZoomSpeed] = useState(DEFAULT_CONFIG.zoomSpeed);
    const [patternSetIndex, setPatternSetIndex] = useState(0);
    const patternSetRef = useRef<PatternSet | null>(ALL_PATTERN_SETS[0]);
    const [themeIndex, setThemeIndex] = useState(0);
    const themeRef = useRef<ColorTheme>(COLOR_THEMES[0]);
    const [roughness, setRoughness] = useState(DEFAULT_CONFIG.roughness);

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
    const initialConfigRef = useRef<AppConfig | null>(null);

    // Pointer reactivity
    const pointerRef = useRef({ x: -1000, y: -1000, active: false });
    const easedPointerRef = useRef({ x: -1000, y: -1000 });

    // Offscreen grain canvas (pre-rendered, reused across frames)
    const grainCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const grainSeedRef = useRef<number>(-1);
    const grainDimsRef = useRef({ w: 0, h: 0 });

    // Pre-allocated buffers for drawSmoothPath (avoid GC pressure)
    const smoothBufRef = useRef({
        ox: new Float64Array(200),
        oy: new Float64Array(200),
        px: new Float64Array(200),
        py: new Float64Array(200),
    });
    // Pre-allocated buffer for mapUV point results
    const uvBufRef = useRef<{ x: number, y: number }[]>(
        Array.from({ length: 200 }, () => ({ x: 0, y: 0 }))
    );


    // --- Drawing Logic ---
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = window.innerWidth;
        const height = window.innerHeight;

        // Ease pointer for smooth reactive bulging (snap when close to stop redraws)
        let dx = pointerRef.current.x - easedPointerRef.current.x;
        let dy = pointerRef.current.y - easedPointerRef.current.y;
        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
            easedPointerRef.current.x = pointerRef.current.x;
            easedPointerRef.current.y = pointerRef.current.y;
            dx = 0;
            dy = 0;
        } else {
            easedPointerRef.current.x += dx * 0.1;
            easedPointerRef.current.y += dy * 0.1;
        }

        const now = performance.now();
        const dt = (now - lastTimeRef.current) / 1000;
        lastTimeRef.current = now;

        if (autoAnimateRef.current) {
            configRef.current.twist += 0.3 * dt * configRef.current.spinSpeed;
            wavePhaseRef.current += 250 * dt * configRef.current.waveSpeed;
            configRef.current.zoom += dt * configRef.current.zoomSpeed;
            isDirtyRef.current = true;
        }

        // If pointer is moving or config is dirty, we need to draw
        const isPointerMoving = Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5;
        if (!isDirtyRef.current && !isPointerMoving && !pointerRef.current.active) return;

        // Quality: Set line rendering properties for smooth strokes
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.miterLimit = 2;

        const theme = themeRef.current;

        // Clear with theme background color
        ctx.fillStyle = theme.background;
        ctx.fillRect(0, 0, width, height);

        ctx.save();
        ctx.translate(width / 2, height / 2);

        const config = configRef.current;
        const sym = Math.max(4, Math.floor(config.symmetry));
        const layers = Math.max(1, Math.floor(config.layers));
        const angleStep = (Math.PI * 2) / sym;

        // Max radius covers the screen diagonal
        const maxR = Math.hypot(width, height) / 2 + 50;

        let activePointerDist = Math.hypot(easedPointerRef.current.x - width/2, easedPointerRef.current.y - height/2);
        let isBulgeActive = pointerRef.current.active;

        if (autoAnimateRef.current && !pointerRef.current.active) {
            const maxDist = maxR;
            wavePhaseRef.current = wavePhaseRef.current % maxDist;
            if (wavePhaseRef.current < 0) wavePhaseRef.current += maxDist;
            activePointerDist = wavePhaseRef.current;
            isBulgeActive = true;
        }

        // --- Infinite tunnel: continuous conveyor belt ---
        // Each layer has a unique `id`. Position t = (id - zoom) / N is continuous in zoom.
        // As zoom increases, layers slide inward. New layers appear at the outer edge,
        // old layers vanish into the center. Pattern identity is tied to `id`, never changes.
        const zoom = config.zoom;
        const shift = Math.floor(zoom);
        const offset = zoom - shift; // [0, 1)

        const startAbs = -1 - shift;
        const count = layers + 2; // l from -1 to layers

        // Calculate types — use the active pattern set's count
        const activePatternSet = patternSetRef.current ?? ALL_PATTERN_SETS[0];
        const numTypes = activePatternSet.count;
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
        // Writes directly into target object to avoid allocations
        const mapUVInto = (u: number, v: number, r1: number, r2: number, layerTwist: number, out: {x: number, y: number}) => {
            const r = r1 + v * (r2 - r1);
            const a = (u * angleStep) + layerTwist;
            out.x = r * Math.cos(a);
            out.y = r * Math.sin(a);
        };
        const uvBuf = uvBufRef.current;

        const patternSet = patternSetRef.current;

        let layerColor = theme.colors[0]; // updated per-layer

        // Adaptive line width based on layer band thickness
        const getLineWidth = (r1: number, r2: number) => {
            const band = r2 - r1;
            return Math.max(0.8, Math.min(2.5, band * 0.02));
        };

        // Helper: Draw a smooth bezier curve through points
        // Use pre-allocated ref buffers to avoid GC pressure
        const { ox: _ox, oy: _oy, px: _px, py: _py } = smoothBufRef.current;

        const drawSmoothPath = (points: {x: number, y: number}[], style: PathStyle, rng: () => number, lw?: number, count?: number) => {
            const n = count ?? points.length;
            if (n < 2) return;
            const lineWidth = lw ?? 1.5;
            const rough = config.roughness;

            // Compute offsets and perturbed coords into pre-allocated buffers
            for (let i = 0; i < n; i++) {
                const odx = (rng() - 0.5) * rough;
                const ody = (rng() - 0.5) * rough;
                _ox[i] = odx;
                _oy[i] = ody;
                _px[i] = points[i].x + odx;
                _py[i] = points[i].y + ody;
            }

            const traceBuf = (bx: Float64Array, by: Float64Array, len: number, close: boolean) => {
                ctx.beginPath();
                ctx.moveTo(bx[0], by[0]);
                if (len === 2) {
                    ctx.lineTo(bx[1], by[1]);
                } else {
                    for (let i = 0; i < len - 1; i++) {
                        const i0 = i > 0 ? i - 1 : 0;
                        const i2 = i + 1 < len ? i + 1 : len - 1;
                        const i3 = i + 2 < len ? i + 2 : len - 1;
                        const cp1x = bx[i] + (bx[i2] - bx[i0]) * 0.3;
                        const cp1y = by[i] + (by[i2] - by[i0]) * 0.3;
                        const cp2x = bx[i2] - (bx[i3] - bx[i]) * 0.3;
                        const cp2y = by[i2] - (by[i3] - by[i]) * 0.3;
                        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, bx[i2], by[i2]);
                    }
                }
                if (close) ctx.closePath();
            };

            if (style === 'filled' || style === 'opaque-outline') {
                ctx.fillStyle = style === 'filled' ? layerColor : theme.background;
                traceBuf(_px, _py, n, true);
                ctx.fill();
            }

            ctx.strokeStyle = style === 'filled' ? theme.stroke : theme.strokeLight;
            ctx.lineWidth = lineWidth;

            // First stroke pass
            traceBuf(_px, _py, n, style !== 'line');
            ctx.stroke();

            // Second pass with slight offset for hand-drawn feel (non-filled only)
            if (style !== 'filled') {
                for (let i = 0; i < n; i++) {
                    _px[i] = points[i].x + _ox[i] * 1.3;
                    _py[i] = points[i].y + _oy[i] * 1.3;
                }
                traceBuf(_px, _py, n, style !== 'line');
                ctx.stroke();
            }
        };

        // Draw Layers from outside in
        for (let l = layers; l >= -1; l--) {
            const absL = l - shift;
            const type = layerTypes[l + 1];
            const filled = layerFilled[l + 1];
            const layerRng = mulberry32(config.seed + absL * 999);

            // Pick a color for this layer from the theme palette
            layerColor = theme.colors[((absL % theme.colors.length) + theme.colors.length) % theme.colors.length];

            // Base radii
            let r1 = Math.max(0, (l + offset) * config.spread);
            let r2 = Math.max(0, (l + 1 + offset) * config.spread);

            if (r2 <= 0) continue;
            if (r1 > maxR) continue; // Skip layers entirely outside viewport

            // Reactive Bulge: if pointer is near this layer, expand it slightly
            const midR = (r1 + r2) / 2;
            const distToLayer = Math.abs(activePointerDist - midR);
            let bulge = 0;
            if (isBulgeActive && distToLayer < config.spread * 1.5) {
                bulge = (1 - distToLayer / (config.spread * 1.5)) * (config.spread * 0.4);
            }
            r2 += bulge;
            if (r1 > 1) r1 = Math.max(0, r1 - bulge * 0.3);

            const lw = getLineWidth(r1, r2);

            // Proper clipping: clip to annular ring
            ctx.save();
            ctx.beginPath();
            ctx.arc(0, 0, r2, 0, Math.PI * 2);
            ctx.arc(0, 0, Math.max(0, r1 - 1), 0, Math.PI * 2, true);
            ctx.clip();

            // Fill the band background
            ctx.fillStyle = theme.background;
            ctx.beginPath();
            ctx.arc(0, 0, r2, 0, Math.PI * 2);
            ctx.fill();

            // Twist: Inner layers twist more than outer layers
            // spinVariance adds per-layer speed variation (seeded so it's stable)
            const layerSpinFactor = 1 + (mulberry32(config.seed + absL * 777)() - 0.5) * config.spinVariance;
            const layerTwist = config.twist * (1 / (Math.abs(absL) + 1)) * layerSpinFactor;

            // Draw separator ring at outer boundary
            ctx.beginPath();
            ctx.arc(0, 0, r2, 0, Math.PI * 2);
            ctx.strokeStyle = theme.strokeLight;
            ctx.lineWidth = lw * 0.8;
            ctx.stroke();

            // Draw pattern cells
            for (let i = 0; i < sym; i++) {
                ctx.save();
                ctx.rotate(i * angleStep);

                const activeSet = patternSet
                    ? patternSet
                    : ALL_PATTERN_SETS[Math.abs(absL) % ALL_PATTERN_SETS.length];
                const drawUV = (uvPoints: [number, number][], style: PathStyle) => {
                    const len = uvPoints.length;
                    for (let j = 0; j < len; j++) {
                        mapUVInto(uvPoints[j][0], uvPoints[j][1], r1, r2, layerTwist, uvBuf[j]);
                    }
                    drawSmoothPath(uvBuf, style, layerRng, lw, len);
                };
                const cellBaseStyle: PathStyle = filled ? 'filled' : 'opaque-outline';
                activeSet.draw(type % activeSet.count, { drawUV, filled, baseStyle: cellBaseStyle, rng: layerRng });

                ctx.restore();
            }

            ctx.restore(); // Restore clipping
        }

        // Dense center vanishing point — inside the innermost visible layer
        const innerCoreR = Math.max(0, offset * config.spread);
        if (innerCoreR > 2) {
            const cd = theme.centerDark;
            const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, innerCoreR);
            grad.addColorStop(0, `rgba(${cd}, 0.85)`);
            grad.addColorStop(0.4, `rgba(${cd}, 0.5)`);
            grad.addColorStop(0.8, `rgba(${cd}, 0.15)`);
            grad.addColorStop(1, `rgba(${cd}, 0)`);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(0, 0, innerCoreR, 0, Math.PI * 2);
            ctx.fill();

            const coreRng = mulberry32(config.seed + shift * 7);
            ctx.strokeStyle = `rgba(${cd}, 0.3)`;
            ctx.lineWidth = 0.5;
            for (let i = 0; i < 6; i++) {
                const rr = innerCoreR * (0.1 + coreRng() * 0.8);
                ctx.beginPath();
                ctx.arc(0, 0, rr, 0, Math.PI * 2);
                ctx.stroke();
            }
        }

        // Draw inner circle cap
        const innerR = Math.max(0, offset * config.spread);
        if (innerR > 0) {
            ctx.beginPath();
            ctx.arc(0, 0, innerR, 0, Math.PI * 2);
            ctx.fillStyle = theme.background;
            ctx.fill();
            ctx.strokeStyle = theme.strokeLight;
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        ctx.restore();

        // Add subtle grain overlay using offscreen canvas (pre-rendered)
        const grainSeed = Math.floor(now * 0.001);
        const grainDims = grainDimsRef.current;
        const needsGrainResize = grainDims.w !== width || grainDims.h !== height;
        if (!grainCanvasRef.current || grainSeedRef.current !== grainSeed || needsGrainResize) {
            if (!grainCanvasRef.current) {
                grainCanvasRef.current = document.createElement('canvas');
            }
            const gc = grainCanvasRef.current;
            if (needsGrainResize) {
                gc.width = width;
                gc.height = height;
                grainDims.w = width;
                grainDims.h = height;
            }
            const gctx = gc.getContext('2d');
            if (gctx) {
                gctx.clearRect(0, 0, width, height);
                gctx.fillStyle = theme.grain;
                const grainRng = mulberry32(grainSeed);
                for (let i = 0; i < 800; i++) {
                    gctx.fillRect(grainRng() * width, grainRng() * height, 1.5, 1.5);
                }
            }
            grainSeedRef.current = grainSeed;
        }
        ctx.drawImage(grainCanvasRef.current, 0, 0);

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

    // --- Fullscreen Change Listener (standard + webkit) ---
    useEffect(() => {
        const onFullscreenChange = () => {
            setIsFullscreen(!!getFullscreenElement());
        };
        document.addEventListener('fullscreenchange', onFullscreenChange);
        document.addEventListener('webkitfullscreenchange', onFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', onFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
        };
    }, []);

    // --- Gesture Handlers ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const getDistance = (p1: {x: number, y: number}, p2: {x: number, y: number}) => Math.hypot(p2.x - p1.x, p2.y - p1.y);

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
                initialConfigRef.current = { ...configRef.current };
                pointerRef.current.active = false;
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
                const touch = e.touches[0];
                const startTouch = touchesRef.current.get(touch.identifier);
                if (startTouch) {
                    const tdx = touch.clientX - startTouch.x;
                    const tdy = touch.clientY - startTouch.y;

                    configRef.current.twist = initialConfigRef.current.twist + tdx * 0.01;
                    configRef.current.symmetry = Math.max(4, Math.min(48, initialConfigRef.current.symmetry - tdy * 0.05));
                    isDirtyRef.current = true;
                }
            } else if (e.touches.length === 2) {
                const t1 = e.touches[0];
                const t2 = e.touches[1];
                const currentDist = getDistance({x: t1.clientX, y: t1.clientY}, {x: t2.clientX, y: t2.clientY});

                if (initialPinchDistRef.current) {
                    const scale = currentDist / initialPinchDistRef.current;
                    configRef.current.zoom = initialConfigRef.current.zoom - Math.log2(scale) * 2;
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
                const mdx = e.clientX - startTouch.x;
                const mdy = e.clientY - startTouch.y;
                configRef.current.twist = initialConfigRef.current.twist + mdx * 0.01;
                configRef.current.symmetry = Math.max(4, Math.min(48, initialConfigRef.current.symmetry - mdy * 0.05));
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
            configRef.current.zoom += e.deltaY * 0.003;
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
        link.download = `mandala-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    const handleRandomize = () => {
        configRef.current.seed = Math.random() * 10000;
        isDirtyRef.current = true;
    };

    const toggleAutoAnimate = () => {
        const next = !isAutoAnimating;
        setIsAutoAnimating(next);
        autoAnimateRef.current = next;
    };

    // Use onClick (not onPointerDown) — fullscreen API requires a trusted
    // user activation event, and onClick is the most reliable across browsers
    const toggleFullscreen = () => {
        if (getFullscreenElement()) {
            exitFullscreen().catch(() => {});
        } else {
            const el = containerRef.current || document.documentElement;
            requestFullscreen(el).catch(() => {});
        }
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

    const handleSpinVarianceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setSpinVariance(val);
        configRef.current.spinVariance = val;
    };

    const handleWaveSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setWaveSpeed(val);
        configRef.current.waveSpeed = val;
    };

    const handleZoomSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setZoomSpeed(val);
        configRef.current.zoomSpeed = val;
    };

    const handleRoughnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setRoughness(val);
        configRef.current.roughness = val;
        isDirtyRef.current = true;
    };

    return (
        <div ref={containerRef} className="relative w-screen h-screen overflow-hidden font-sans selection:bg-black/10" style={{ background: COLOR_THEMES[themeIndex].background, color: COLOR_THEMES[themeIndex].colors[0] }}>
            <canvas ref={canvasRef} className="block w-full h-full cursor-crosshair touch-none" />

            <button
                onPointerDown={(e) => { e.stopPropagation(); setUiVisible(v => !v); }}
                className="absolute top-6 left-6 z-50 p-3 rounded-full bg-white/80 backdrop-blur-md border border-black/10 text-black hover:bg-black hover:text-white transition-all duration-300 shadow-lg shadow-black/5 pointer-events-auto touch-auto"
                title="Toggle Controls"
            >
                {uiVisible ? <X size={24} /> : <Settings2 size={24} />}
            </button>

            <div className="absolute top-6 right-6 z-50 flex gap-2 pointer-events-auto touch-auto">
                <button
                    onClick={toggleFullscreen}
                    className="p-3 rounded-full bg-white/80 backdrop-blur-md border border-black/10 text-black hover:bg-black hover:text-white transition-all duration-300 shadow-lg shadow-black/5"
                    title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                >
                    {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
                </button>
                <button
                    onPointerDown={(e) => { e.stopPropagation(); handleSave(); }}
                    className="p-3 rounded-full bg-white/80 backdrop-blur-md border border-black/10 text-black hover:bg-black hover:text-white transition-all duration-300 shadow-lg shadow-black/5 pointer-events-auto touch-auto"
                    title="Save Image"
                >
                    <Download size={24} />
                </button>
            </div>

            <AnimatePresence>
                {uiVisible && (
                    <motion.div
                        drag
                        dragMomentum={false}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="absolute top-4 sm:top-20 left-1/2 -translate-x-1/2 w-[95%] sm:w-[90%] max-w-md max-h-[calc(100vh-2rem)] sm:max-h-[70vh] overflow-y-auto overscroll-contain bg-white/90 backdrop-blur-xl border border-black/10 rounded-3xl p-4 sm:p-6 shadow-2xl shadow-black/10 pointer-events-auto touch-auto cursor-grab active:cursor-grabbing"
                        style={{ zIndex: 40 }}
                    >
                        <button
                            onPointerDown={(e) => { e.stopPropagation(); setUiVisible(false); }}
                            className="absolute top-4 right-4 p-2 text-black/40 hover:text-black transition-colors pointer-events-auto touch-auto"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center mb-4">
                            <h2 className="text-xl font-bold tracking-tight text-black uppercase mb-1">Mandala Generator</h2>
                            <p className="text-xs text-black/50 uppercase tracking-widest font-medium">Interactive Pattern Explorer</p>
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
                                <Shuffle className="mb-2 text-black/70" size={24} />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-black/70">Double Tap</span>
                                <span className="text-[10px] text-black/50 text-center mt-1">Randomize Pattern</span>
                            </div>
                        </div>

                        <div className="text-center mb-4">
                            <p className="text-[10px] text-black/60 uppercase tracking-widest font-bold">Hover / Touch to expand layers</p>
                        </div>

                        <div className="flex gap-4 mb-4 pointer-events-auto touch-auto">
                            <div className="flex-1">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-black/70 flex items-center gap-1 mb-1">
                                    <Layers size={12} />
                                    Layers: {layerCount}
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="30"
                                    value={layerCount}
                                    onChange={handleLayerChange}
                                    className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer accent-black"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-black/70 flex items-center gap-1 mb-1">
                                    Roughness: {roughness.toFixed(1)}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="6"
                                    step="0.1"
                                    value={roughness}
                                    onChange={handleRoughnessChange}
                                    className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer accent-black"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mb-4 pointer-events-auto touch-auto">
                            <div className="flex-1">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-black/70 flex items-center gap-1 mb-1">
                                    Pattern
                                </label>
                                <select
                                    value={patternSetIndex}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        setPatternSetIndex(val);
                                        patternSetRef.current = val === -1 ? null : ALL_PATTERN_SETS[val];
                                        isDirtyRef.current = true;
                                    }}
                                    className="w-full px-2 py-1.5 text-xs font-bold bg-black/5 border border-black/10 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-black/20"
                                >
                                    <option value={-1}>Mix (All)</option>
                                    {ALL_PATTERN_SETS.map((ps, i) => (
                                        <option key={ps.name} value={i}>{ps.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-black/70 flex items-center gap-1 mb-1">
                                    <Palette size={12} />
                                    Color
                                </label>
                                <select
                                    value={themeIndex}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        setThemeIndex(val);
                                        themeRef.current = COLOR_THEMES[val];
                                        isDirtyRef.current = true;
                                    }}
                                    className="w-full px-2 py-1.5 text-xs font-bold bg-black/5 border border-black/10 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-black/20"
                                >
                                    {COLOR_THEMES.map((t, i) => (
                                        <option key={t.name} value={i}>{t.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {isAutoAnimating && (
                            <div className="space-y-4 mb-6 pointer-events-auto touch-auto">
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-black/70 flex items-center gap-2 mb-2">
                                            Spin Speed
                                        </label>
                                        <input
                                            type="range" min="-10" max="10" step="0.1"
                                            value={spinSpeed} onChange={handleSpinSpeedChange}
                                            className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer accent-black"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-black/70 flex items-center gap-2 mb-2">
                                            Spin Variance
                                        </label>
                                        <input
                                            type="range" min="0" max="3" step="0.05"
                                            value={spinVariance} onChange={handleSpinVarianceChange}
                                            className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer accent-black"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-black/70 flex items-center gap-2 mb-2">
                                            Wave Speed
                                        </label>
                                        <input
                                            type="range" min="0" max="10" step="0.1"
                                            value={waveSpeed} onChange={handleWaveSpeedChange}
                                            className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer accent-black"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-black/70 flex items-center gap-2 mb-2">
                                            Zoom Speed
                                        </label>
                                        <input
                                            type="range" min="-2" max="2" step="0.05"
                                            value={zoomSpeed} onChange={handleZoomSpeedChange}
                                            className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer accent-black"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="pointer-events-auto flex justify-center gap-2 sm:gap-3 sticky bottom-0 pt-3 pb-1 bg-white/90 backdrop-blur-xl -mx-4 sm:-mx-6 px-4 sm:px-6">
                            <button
                                onPointerDown={(e) => { e.stopPropagation(); toggleAutoAnimate(); }}
                                className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors shadow-lg active:scale-95 pointer-events-auto touch-auto ${isAutoAnimating ? 'bg-black/10 text-black shadow-black/5' : 'bg-black text-white shadow-black/20 hover:bg-black/80'}`}
                            >
                                {isAutoAnimating ? <Pause size={16} /> : <Play size={16} />}
                                {isAutoAnimating ? 'Stop' : 'Animate'}
                            </button>
                            <button
                                onPointerDown={(e) => { e.stopPropagation(); handleRandomize(); }}
                                className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-black text-white rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-black/80 transition-colors shadow-lg shadow-black/20 active:scale-95 pointer-events-auto touch-auto"
                            >
                                <Shuffle size={16} />
                                Randomize
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
