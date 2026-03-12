import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Settings2, X, Hand, Maximize, RotateCw, Shuffle, Download, Play, Pause, Layers, Maximize2, Minimize2 } from 'lucide-react';
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

// --- Fullscreen helpers (cross-browser + iPad Safari) ---
function getFullscreenElement(): Element | null {
    return document.fullscreenElement
        || (document as any).webkitFullscreenElement
        || null;
}

function requestFullscreen(el: HTMLElement): Promise<void> {
    if (el.requestFullscreen) return el.requestFullscreen();
    if ((el as any).webkitRequestFullscreen) return (el as any).webkitRequestFullscreen();
    return Promise.reject(new Error('Fullscreen API not supported'));
}

function exitFullscreen(): Promise<void> {
    if (document.exitFullscreen) return document.exitFullscreen();
    if ((document as any).webkitExitFullscreen) return (document as any).webkitExitFullscreen();
    return Promise.reject(new Error('Fullscreen API not supported'));
}

// --- Types & Config ---
interface AppConfig {
    symmetry: number;
    layers: number;
    spread: number;
    roughness: number;
    twist: number;
    seed: number;
    spinSpeed: number;
    spinVariance: number;
    waveSpeed: number;
    zoomSpeed: number;
    zoom: number;
}

const DEFAULT_CONFIG: AppConfig = {
    symmetry: 12,
    layers: 12,
    spread: 70,
    roughness: 2.0,
    twist: 0,
    seed: 42,
    spinSpeed: 1,
    spinVariance: 0.8,
    waveSpeed: 1,
    zoomSpeed: 0.3,
    zoom: 0
};

// Exponential radius mapping: maps normalized t in [0,1] to radius
// power > 1 compresses inner rings together (tunnel effect)
const TUNNEL_POWER = 2.5;

function tunnelRadius(t: number, maxR: number): number {
    return maxR * Math.pow(Math.max(0, t), TUNNEL_POWER);
}

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

    // --- Drawing Logic ---
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = window.innerWidth;
        const height = window.innerHeight;

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
            configRef.current.zoom += dt * configRef.current.zoomSpeed;
            isDirtyRef.current = true;
        }

        // If pointer is moving or config is dirty, we need to draw
        const isPointerMoving = Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5;
        if (!isDirtyRef.current && !isPointerMoving && !pointerRef.current.active) return;

        // Clear with warm stone/paper texture color
        ctx.fillStyle = '#EBE7E0';
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
        const N = layers + 1; // normalization factor
        // Visible ids: those where outer edge t > 0 and inner edge t < 1
        // t_outer(id) = (id + 1 - zoom) / N > 0  =>  id > zoom - 1
        // t_inner(id) = (id - zoom) / N < 1       =>  id < zoom + N
        const firstId = Math.ceil(zoom);           // innermost visible
        const lastId = Math.floor(zoom + N - 1);   // outermost visible

        // Helper: Map (u, v) in [0,1]x[0,1] to Polar Cartesian
        const mapUV = (u: number, v: number, r1: number, r2: number, layerTwist: number) => {
            const r = r1 + v * (r2 - r1);
            const a = (u * angleStep) + layerTwist;
            return { x: r * Math.cos(a), y: r * Math.sin(a) };
        };

        type PathStyle = 'filled' | 'opaque-outline' | 'outline' | 'line';

        // Helper: Draw a rough path
        const drawRoughPath = (points: {x: number, y: number}[], style: PathStyle, rng: () => number) => {
            const passes = style === 'filled' ? 1 : 2;

            if (style === 'filled' || style === 'opaque-outline') {
                ctx.fillStyle = style === 'filled' ? '#1A1818' : '#EBE7E0';
                ctx.beginPath();
                points.forEach((p, i) => {
                    const nx = p.x + (rng() - 0.5) * config.roughness;
                    const ny = p.y + (rng() - 0.5) * config.roughness;
                    if (i === 0) ctx.moveTo(nx, ny);
                    else ctx.lineTo(nx, ny);
                });
                ctx.closePath();
                ctx.fill();
            }

            ctx.strokeStyle = style === 'filled' ? 'rgba(26, 24, 24, 0.9)' : 'rgba(26, 24, 24, 0.6)';
            ctx.lineWidth = 1.5;

            for (let pass = 0; pass < passes; pass++) {
                ctx.beginPath();
                points.forEach((p, i) => {
                    const nx = p.x + (rng() - 0.5) * config.roughness * 1.5;
                    const ny = p.y + (rng() - 0.5) * config.roughness * 1.5;
                    if (i === 0) ctx.moveTo(nx, ny);
                    else ctx.lineTo(nx, ny);
                });
                if (style !== 'line') ctx.closePath();
                ctx.stroke();
            }
        };

        // Draw layers from outside in
        for (let id = lastId; id >= firstId; id--) {
            const layerRng = mulberry32(config.seed + id * 999);
            // Pick pattern type — dedup against outer neighbor independently (stable per id)
            let type = Math.floor(layerRng() * 5);
            const neighborRaw = Math.floor(mulberry32(config.seed + (id + 1) * 999)() * 5);
            if (type === neighborRaw) type = (type + 1) % 5;
            const filled = layerRng() > 0.5;
            // Per-layer spin: direction + random speed offset
            const spinDir = layerRng() > 0.5 ? 1 : -1;
            const speedOffset = (layerRng() - 0.5) * 2; // [-1, 1]

            // Continuous positions: t = (id - zoom) / N
            const t1 = Math.max(0, (id - zoom) / N);
            const t2 = Math.min(1, (id + 1 - zoom) / N);

            // Exponential radii
            let r1 = tunnelRadius(t1, maxR);
            let r2 = tunnelRadius(t2, maxR);

            if (r2 <= 0.5) continue; // too small to see
            if (r1 > maxR * 1.2) continue; // off-screen

            // Ring thickness — skip drawing motifs if too thin
            const thickness = r2 - r1;
            const tooThin = thickness < 3;

            // Reactive Bulge
            const midR = (r1 + r2) / 2;
            const distToLayer = Math.abs(activePointerDist - midR);
            let bulge = 0;
            if (isBulgeActive && distToLayer < thickness * 2) {
                bulge = (1 - distToLayer / (thickness * 2)) * (thickness * 0.5);
            }
            r2 += bulge;
            if (r1 > 1) r1 = Math.max(0, r1 - bulge * 0.3);

            // Mask interior
            ctx.fillStyle = '#EBE7E0';
            ctx.beginPath();
            ctx.arc(0, 0, r2, 0, Math.PI * 2);
            ctx.fill();

            // Per-layer twist with variance:
            // Each layer spins at its own speed = base * direction * (1 + variance * offset)
            const twistMag = 1 / (t2 * 3 + 0.3);
            const layerSpeedMul = spinDir * (1.0 + config.spinVariance * speedOffset);
            const layerTwist = config.twist * twistMag * layerSpeedMul;

            // Draw separator ring
            ctx.save();
            const alpha = Math.min(1, thickness / 8);
            ctx.globalAlpha = alpha;

            const ringPts = [];
            for(let a=0; a<=Math.PI*2; a+=0.1) {
                ringPts.push({ x: r2 * Math.cos(a), y: r2 * Math.sin(a) });
            }
            drawRoughPath(ringPts, 'outline', layerRng);

            if (!tooThin) {
                const baseStyle: PathStyle = filled ? 'filled' : 'opaque-outline';

                for (let i = 0; i < sym; i++) {
                    ctx.save();
                    ctx.rotate(i * angleStep);

                    const drawUV = (uvPoints: [number, number][], style: PathStyle) => {
                        const pts = uvPoints.map(p => mapUV(p[0], p[1], r1, r2, layerTwist));
                        drawRoughPath(pts, style, layerRng);
                    };

                    switch (type) {
                        case 0:
                            drawUV([
                                [0, 0], [0.2, 0], [0.2, 0.25], [0.4, 0.25],
                                [0.4, 0.5], [0.6, 0.5], [0.6, 0.75], [0.8, 0.75],
                                [0.8, 1], [1, 1], [1, 0]
                            ], baseStyle);
                            break;

                        case 1:
                            drawUV([[0.05, 0.05], [0.95, 0.05], [0.95, 0.95], [0.05, 0.95]], baseStyle);
                            if (!filled) {
                                drawUV([[0.3, 0.3], [0.7, 0.3], [0.7, 0.7], [0.3, 0.7]], 'filled');
                            } else {
                                drawUV([[0.4, 0.4], [0.6, 0.4], [0.6, 0.6], [0.4, 0.6]], 'opaque-outline');
                            }
                            break;

                        case 2:
                            drawUV([[0.1, 0], [0.9, 0], [0.5, 0.9]], baseStyle);
                            if (!filled) {
                                drawUV([[0.3, 0.2], [0.7, 0.2]], 'line');
                                drawUV([[0.4, 0.4], [0.6, 0.4]], 'line');
                                drawUV([[0.45, 0.6], [0.55, 0.6]], 'line');
                            }
                            break;

                        case 3:
                            if (filled) {
                                drawUV([
                                    [0, 0], [0.8, 0], [0.8, 0.8], [0.2, 0.8],
                                    [0.2, 0.4], [0.6, 0.4], [0.6, 0.6], [0.4, 0.6],
                                    [0.4, 0.2], [1.0, 0.2], [1.0, 1.0], [0, 1.0]
                                ], 'filled');
                            } else {
                                drawUV([
                                    [0.1, 0.1], [0.9, 0.1], [0.9, 0.9], [0.3, 0.9], [0.3, 0.5], [0.7, 0.5]
                                ], 'line');
                            }
                            break;

                        case 4:
                            drawUV([[0, 0], [0.5, 0.8], [1, 0]], baseStyle);
                            drawUV([[0, 1], [0.5, 0.2], [1, 1]], filled ? 'opaque-outline' : 'filled');
                            break;
                    }

                    ctx.restore();
                }
            }

            ctx.restore();
        }

        // Dense center vanishing point — inside the innermost visible layer
        const innermostT = Math.max(0, (firstId - zoom) / N);
        const coreR = tunnelRadius(innermostT, maxR);
        if (coreR > 0.5) {
            const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, coreR);
            grad.addColorStop(0, 'rgba(26, 24, 24, 0.85)');
            grad.addColorStop(0.4, 'rgba(26, 24, 24, 0.5)');
            grad.addColorStop(0.8, 'rgba(26, 24, 24, 0.15)');
            grad.addColorStop(1, 'rgba(235, 231, 224, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(0, 0, coreR, 0, Math.PI * 2);
            ctx.fill();

            const coreRng = mulberry32(config.seed + firstId * 7);
            ctx.strokeStyle = 'rgba(26, 24, 24, 0.3)';
            ctx.lineWidth = 0.5;
            for (let i = 0; i < 6; i++) {
                const rr = coreR * (0.1 + coreRng() * 0.8);
                ctx.beginPath();
                ctx.arc(0, 0, rr, 0, Math.PI * 2);
                ctx.stroke();
            }
        }

        ctx.restore();

        // Grain overlay
        ctx.fillStyle = 'rgba(0,0,0,0.03)';
        for(let i=0; i<1500; i++) {
            ctx.fillRect(Math.random()*width, Math.random()*height, 1.5, 1.5);
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
                    configRef.current.zoom = initialConfigRef.current.zoom + Math.log2(scale) * 2;
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
            configRef.current.zoom -= e.deltaY * 0.003;
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

    return (
        <div ref={containerRef} className="relative w-screen h-screen overflow-hidden bg-[#EBE7E0] text-[#1A1818] font-sans selection:bg-black/10">
            <canvas ref={canvasRef} className="block w-full h-full cursor-crosshair touch-none" />

            <button
                onPointerDown={(e) => { e.stopPropagation(); setUiVisible(v => !v); }}
                className="absolute top-6 left-6 z-50 p-3 rounded-full bg-white/80 backdrop-blur-md border border-black/10 text-black hover:bg-black hover:text-white transition-all duration-300 shadow-lg shadow-black/5 pointer-events-auto touch-auto"
                title="Toggle Controls"
            >
                {uiVisible ? <X size={24} /> : <Settings2 size={24} />}
            </button>

            <div className="absolute top-6 right-6 z-50 flex gap-2">
                <button
                    onClick={toggleFullscreen}
                    className="p-3 rounded-full bg-white/80 backdrop-blur-md border border-black/10 text-black hover:bg-black hover:text-white transition-all duration-300 shadow-lg shadow-black/5 pointer-events-auto touch-auto"
                    title="Toggle Fullscreen"
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
                        className="absolute top-20 left-1/2 -translate-x-1/2 w-[90%] max-w-md max-h-[70vh] overflow-y-auto bg-white/90 backdrop-blur-xl border border-black/10 rounded-3xl p-6 shadow-2xl shadow-black/10 pointer-events-auto touch-auto cursor-grab active:cursor-grabbing"
                        style={{ zIndex: 40 }}
                    >
                        <button
                            onPointerDown={(e) => { e.stopPropagation(); setUiVisible(false); }}
                            className="absolute top-4 right-4 p-2 text-black/40 hover:text-black transition-colors pointer-events-auto touch-auto"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center mb-6">
                            <h2 className="text-xl font-bold tracking-tight text-black uppercase mb-1">Mandala Generator</h2>
                            <p className="text-xs text-black/50 uppercase tracking-widest font-medium">Interactive Aztec/Mayan Textures</p>
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
