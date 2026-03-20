# CLAUDE.md — AI Assistant Guide for Mandala-ai

> **Key principle:** This is a visual canvas application. Never make changes blindly — always validate your work by taking Playwright screenshots and reviewing the rendered output. See the "Validation & Auto-Testing Methodology" section for the full workflow and tooling setup.

## Project Overview

Interactive Mandala Generator — a browser-based app that renders procedural mandala patterns on an HTML5 Canvas using a hand-drawn / rough aesthetic. Users can interact via touch gestures or mouse to twist, zoom (infinite tunnel effect), randomize, and animate the mandala. 33 pattern sets are available across cultural, generative, artistic, research-inspired, figurative, and thematic categories, plus a "Mix" mode that combines them.

## Tech Stack

- **React 19** (single-component SPA in `src/App.tsx`)
- **TypeScript 5.8** (strict-ish, `noEmit` mode)
- **Vite 6** (dev server + build)
- **Tailwind CSS 4** (via `@tailwindcss/vite` plugin)
- **Canvas 2D API** — all rendering is done with a `<canvas>` element at full viewport size
- **Motion (Framer Motion)** — UI panel animations
- **Lucide React** — icon set for UI buttons
- Base path is `/Mandala-ai/` (configured in `vite.config.ts`)

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Production build to `dist/` |
| `npm run lint` | Type-check only (`tsc --noEmit`) |
| `npm run preview` | Preview production build |
| `npm run clean` | Remove `dist/` |

## Project Structure

```
src/
  App.tsx              # Main React component — rendering, UI, gesture handling
  main.tsx             # React entry point
  index.css            # Tailwind import + custom scrollbar/range slider styles
  config/
    types.ts           # AppConfig and ColorTheme interfaces
    defaults.ts        # DEFAULT_CONFIG, TUNNEL_POWER, COLOR_THEMES (10 themes)
  utils/
    rng.ts             # mulberry32 seeded RNG
    fullscreen.ts      # Cross-browser fullscreen API helpers
  patterns/
    types.ts           # Core types: PathStyle, DrawUV, PatternContext, PatternSet
    index.ts           # Re-exports all pattern sets
    # Cultural patterns (17):
    aztec.ts           # Aztec / Mayan (5 motifs)
    nordic.ts          # Nordic / Fair Isle (5 motifs)
    lace.ts            # Lace / Doily
    chevron.ts         # Chevron / Herringbone
    greekkey.ts        # Greek Key / Meander (5 motifs)
    tribal.ts          # Tribal / Ethnic
    lotus.ts           # Lotus / Indian Floral (5 motifs)
    artdeco.ts         # Art Deco
    japanese.ts        # Japanese
    sacred.ts          # Sacred / Mandala
    celtic.ts          # Celtic Knotwork
    egyptian.ts        # Egyptian / Hieroglyph
    mesoamerican.ts    # Mesoamerican (8 motifs)
    islamic.ts         # Islamic Geometric (6 motifs)
    aboriginal.ts      # Aboriginal Dots (6 motifs)
    polynesian.ts      # Polynesian / Tapa (6 motifs)
    # Generative / mathematical patterns (6):
    generative.ts      # Rose curves, phyllotaxis, lissajous, etc. (8 motifs)
    guilloche.ts       # Guilloche / banknote engraving (6 motifs)
    fractal.ts         # Sierpinski, Koch, tree branching (6 motifs)
    spirals.ts         # Fibonacci, Archimedean, double helix (6 motifs)
    harmonograph.ts    # Pendulum figures, cymatics (6 motifs)
    truchet.ts         # Truchet tiles (6 motifs)
    # Art movement patterns (2):
    opart.ts           # Op Art / optical illusions (6 motifs)
    artnouveau.ts      # Art Nouveau / organic curves (6 motifs)
    # Research-inspired patterns (5):
    embroidery.ts      # Embroidery / Stitch — herringbone, chain, blanket, feather, cross, seed (6 motifs)
    maze.ts            # Maze / Labyrinth — theta maze, recursive division, labyrinth, binary tree, Hilbert, braid (6 motifs)
    flowfield.ts       # Flow Field — sinusoidal, swirl, noise traces, distorted grid, convergence, turbulence (6 motifs)
    noisestrata.ts     # Noise Strata — topographic, fragmented grid, ridge, terrain, warp, columns (6 motifs)
    organiccells.ts    # Organic Cells — circle packing, metaballs, reaction-diffusion, Voronoi, mycelium, patchwork (6 motifs)
    # Figurative patterns (2):
    icons/             # Icons — dense Lucide icon grid motifs used by Live Mode
    animals/           # Animals — sitting cat, walking cat, elephant, giraffe, cow, turkey, bat, snake, rat, fish, bear, lizard, bird, possum (14 motifs)
    # Thematic patterns (2):
    dark/              # Death / Dark — skull, bomb, sword, explosion, knife, bow & arrow, crossbones, axe, reaper (9 motifs)
    ausflora/          # Australasian Flora — banksia, waratah, bottlebrush, silver fern, pohutukawa, eucalyptus, kowhai, protea, flannel flower, golden wattle (10 motifs)
tools/                 # Offline analysis/rendering utilities (not part of the web app)
index.html             # HTML shell
vite.config.ts         # Vite config (base path, Tailwind plugin, env vars)
tsconfig.json          # TypeScript config (ES2022, bundler resolution)
```

## Pattern System

### Core Types (`src/patterns/types.ts`)

```ts
type PathStyle = 'filled' | 'opaque-outline' | 'outline' | 'line';
type DrawUV = (uvPoints: [number, number][], style: PathStyle) => void;

interface PatternContext {
    drawUV: DrawUV;
    filled: boolean;       // randomly chosen per layer — true = dark fill, false = outline mode
    baseStyle: PathStyle;  // derived from `filled`: either 'filled' or 'opaque-outline'
    rng?: () => number;    // seeded RNG for deterministic randomness within patterns
}

interface PatternSet {
    name: string;
    count: number;         // number of distinct motifs in this set
    draw: (type: number, ctx: PatternContext) => void;
}
```

### UV Coordinate System

Each pattern draws inside a **unit cell** where `u` spans `[0, 1]` across one symmetry slice and `v` spans `[0, 1]` from inner ring edge to outer ring edge. The `drawUV` function maps these UV coordinates into polar-Cartesian screen space. Patterns never need to know about screen pixels, angles, or radii.

### PathStyle Meanings

| Style | Behavior |
|-------|----------|
| `filled` | Theme color fill + stroke |
| `opaque-outline` | Background-color fill + stroke — acts as a "cutout" |
| `outline` | Stroke only (no fill) |
| `line` | Open polyline stroke (no closePath) |

### Pattern Conventions

- Each pattern set has a `count` (typically 5-8) and a `draw(type, ctx)` switch statement.
- Patterns should look good in **both** filled and outline modes — use the `filled` boolean and `baseStyle` to adapt.
- Use `rng` (from PatternContext) instead of `Math.random()` for deterministic rendering.
- Common variable naming in patterns:
  - `mainStyle` = `filled ? 'filled' : 'outline'`
  - `detailStyle` = `filled ? 'opaque-outline' : 'filled'`
  - `baseStyle` is provided via `PatternContext`
- The rendering engine applies per-layer roughness (hand-drawn wobble), seeded RNG, and per-symmetry-slice rotation — patterns just define geometry.
- **Performance consideration:** Cultural patterns (Greek Key, Nordic, Tribal, etc.) generate 60-130+ `drawUV` calls per cell. Keep this in mind when adding complex patterns.

### Rendering Pipeline (App.tsx)

1. Layers are positioned via an infinite tunnel/conveyor belt system (`zoom` parameter shifts layer IDs).
2. Each layer gets a seeded RNG determining: pattern set (in Mix mode), motif type, filled/outline, spin direction/speed.
3. **LOD system** determines per-layer rendering quality based on band thickness:
   - `< 8px`: Skip pattern entirely, just draw separator ring
   - `< 20px`: Half symmetry slices (min 4), skip double-stroke
   - `< 30px`: Skip double-stroke pass
   - `< 40px`: 75% symmetry slices (min 6)
   - `≥ 40px`: Full quality
4. For each layer, the canvas rotates by `layerAngleStep` for each symmetry slice and calls `patternSet.draw()`.
5. `drawSmoothPath()` renders Catmull-Rom-to-Bezier curves with roughness perturbation using pre-allocated `Float64Array` buffers.
6. A grain overlay is applied from a cached offscreen canvas.
7. Animation is throttled to ~33fps; interactive mode runs at full refresh rate.

### Performance Architecture

The renderer uses several optimizations to maintain performance across 24 pattern sets:

- **Pre-allocated buffers** (`smoothBufRef`, `uvBufRef`): `Float64Array(200)` buffers and point object pools avoid per-frame GC pressure.
- **Zero-allocation hot path**: `mapUVInto()` writes directly into pre-allocated objects; `drawUV` passes explicit `count` instead of using `.length`.
- **Offscreen grain canvas** (`grainCanvasRef`): Grain overlay is pre-rendered and blitted with a single `drawImage()` call. Only re-rendered when seed changes (~1s intervals) or viewport resizes.
- **Layer culling**: Layers with `r1 > maxR` (outside viewport) or `r2 <= 0` are skipped entirely.
- **Adaptive symmetry**: Small inner layers use fewer symmetry slices since the detail is sub-pixel.
- **LOD double-stroke skip**: The hand-drawn second stroke pass is skipped for small layers.
- **Pointer easing snap**: Stops triggering redraws when the eased pointer is within 0.5px of target.
- **Frame throttle**: `requestAnimationFrame` loop skips frames during animation to cap at ~33fps.

### Color Themes

10 built-in themes defined in `src/config/defaults.ts`:
Monochrome, Pastel, Neon, Sepia, Sunset, Ocean, Forest, Royal, Vaporwave, Terracotta.

Each theme provides: `background`, `colors[]` (layer palette), `stroke`, `strokeLight`, `grain`, `centerDark`.

## Validation & Auto-Testing Methodology

**IMPORTANT: Do not make code changes blindly.** Every change to patterns or rendering must be visually validated using automated Playwright screenshots. Code review alone is insufficient for a visual canvas app — you must see the rendered output to confirm correctness.

### The Validation Loop

Follow this cycle for every change:

1. **Make changes** to pattern or rendering code.
2. **Type-check** — run `npx tsc --noEmit` to catch compile errors before proceeding.
3. **Take screenshots** of the running app using Playwright (see below).
4. **Review visually** — examine the screenshot to confirm the patterns render correctly, look balanced, and have no artifacts.
5. **Iterate** if needed — if the visual output is wrong, fix and re-screenshot.
6. **Commit immediately** after each successful build + visual validation pass. Do not batch multiple unrelated changes into one commit.

### Playwright Screenshot Setup

Use the system-installed Playwright (do **not** `npm install` playwright):

```ts
const playwrightCore = require('/opt/node22/lib/node_modules/playwright/node_modules/playwright-core');

const browser = await playwrightCore.chromium.launch({
    executablePath: '/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome',
    args: ['--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
```

The dev server URL (with the required base path) is:

```
http://localhost:3000/Mandala-ai/
```

Make sure the dev server is running (`npm run dev`) before taking screenshots.

### Taking Clean Screenshots

The UI control panel obscures the canvas. Close it before capturing:

```ts
// Navigate and wait for render
await page.goto('http://localhost:3000/Mandala-ai/');
await page.waitForTimeout(2000); // allow initial render + animations

// Close the control panel by clicking the Toggle Controls button
await page.click('button[title="Toggle Controls"]');
await page.waitForTimeout(500);

// Take the screenshot
await page.screenshot({ path: 'screenshot.png' });
```

### Switching Pattern Sets Programmatically

Pattern sets are now selected via a `<select>` dropdown (not buttons):

```ts
// Open panel first if closed
await page.click('button[title="Toggle Controls"]');
await page.waitForTimeout(300);

// Select a pattern set by name via the dropdown
await page.evaluate((name) => {
    const selects = document.querySelectorAll('select');
    for (const sel of selects) {
        for (const opt of sel.querySelectorAll('option')) {
            if (opt.textContent?.includes(name)) {
                sel.value = opt.value;
                sel.dispatchEvent(new Event('change', { bubbles: true }));
                break;
            }
        }
    }
}, 'Lotus / Indian Floral');

await page.waitForTimeout(500);

// Close panel again for clean screenshot
await page.click('button[title="Toggle Controls"]');
await page.waitForTimeout(300);
await page.screenshot({ path: 'lotus-pattern.png' });
```

### What to Validate Visually

- Patterns render without blank/empty layers
- Both filled and outline variants look correct (randomize seed a few times)
- No overlapping artifacts or clipping errors
- Pattern detail is visible (not too thin, not too dense)
- All pattern sets render (cycle through each one)
- Mix mode shows varied patterns across layers

### Quick Validation Script Example

```bash
# 1. Type-check
npx tsc --noEmit

# 2. Ensure dev server is running (in background if not already)
# npm run dev &

# 3. Screenshot via inline Node script
node -e "
const pw = require('/opt/node22/lib/node_modules/playwright/node_modules/playwright-core');
(async () => {
    const browser = await pw.chromium.launch({
        executablePath: '/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome',
        args: ['--no-sandbox'],
    });
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    await page.goto('http://localhost:3000/Mandala-ai/');
    await page.waitForTimeout(2000);
    await page.click('button[title=\"Toggle Controls\"]');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'validation-screenshot.png' });
    await browser.close();
    console.log('Screenshot saved to validation-screenshot.png');
})();
"
```

## Common Tasks

### Adding a New Pattern Set

1. Create `src/patterns/yourpattern.ts` implementing `PatternSet`:
   ```ts
   import type { PatternSet, PatternContext } from './types';

   const yourPatterns: PatternSet = {
       name: 'Your Pattern Name',
       count: 6,  // number of distinct motifs
       draw: (type: number, { drawUV, filled, baseStyle, rng }: PatternContext) => {
           const r = rng ?? (() => Math.random());
           switch (type) {
               case 0: { /* ... */ break; }
               // ...
           }
       }
   };

   export default yourPatterns;
   ```
2. Export it from `src/patterns/index.ts`.
3. Import and add it to the `ALL_PATTERN_SETS` array in `src/App.tsx`.

### Modifying an Existing Pattern

- Edit the relevant `case` in the pattern file's `draw` switch statement.
- All coordinates are in UV space `[0,1] x [0,1]`.
- Use `drawUV(points, style)` for all geometry — do not access the canvas context directly.
- Always handle both `filled === true` and `filled === false` branches for visual variety.

### Adjusting Rendering Behavior

- Tunnel effect power: `TUNNEL_POWER` constant in `src/config/defaults.ts`
- Default config values: `DEFAULT_CONFIG` object in `src/config/defaults.ts`
- Color themes: `COLOR_THEMES` array in `src/config/defaults.ts`
- LOD thresholds: Band size checks in the layer loop of `App.tsx` (`band < 8`, `< 20`, `< 30`, `< 40`)
- Frame throttle: `MIN_FRAME_MS` constant in the animation loop (~33fps cap)
- Roughness, symmetry, layers, spin, zoom — all in `AppConfig` interface (`src/config/types.ts`)

## Deployment

- Auto-deploys to GitHub Pages via `.github/workflows/deploy.yml`
- Triggers on pushes to `main` and `claude/**` branches
- Base path: `/Mandala-ai/`

## Pattern Inspiration Sources

The research-inspired pattern sets (Embroidery, Maze, Flow Field, Noise Strata, Organic Cells) were created based on study of the following external resources:

### Embroidery / Stitch Patterns
- **Ink/Stitch Stitch Library** — https://inkstitch.org/docs/stitch-library/
  - Embroidery stitch types: running, satin, zigzag, chain, cross, herringbone, blanket, feather, stem, seed, fly, couching, lattice, ripple, circular fill, meander fill, contour fill, backstitch, bean stitch
  - UV adaptations: dashed lines, interlocking loops, comb/fence edges, alternating V-branches, X-mark grids, scattered short marks

### Maze / Labyrinth Algorithms
- **Daedalus Maze Program** — https://astrolog.org/labyrnth/daedalus.htm
  - Maze generation: recursive backtracking, Prim's, Kruskal's, Eller's, Wilson's, Hunt-and-Kill, Growing Tree, recursive division, binary tree, sidewinder
  - Maze shapes: orthogonal, delta, sigma, theta (circular), upsilon, zeta, omega, crack, fractal
  - Labyrinth types: classical/Cretan (7-circuit), Chartres (11-circuit), Man in the Maze (I'itoi)
  - Space-filling curves: Hilbert, dragon, Sierpinski
  - Routing: perfect, braid (no dead ends), sparse, unicursal, weave (over-and-under)
  - Texture properties: river factor, bias, run, dead-end percentage

### Flow Field & Generative Art Techniques
- **Generative Hut — Penplotter Tutorial** — https://www.generativehut.com/post/generative-art-python-tutorial-for-penplotter
  - Techniques: distorted grid with column interpolation (lerp), Perlin noise flow fields, circle packing, recursive polygon subdivision with Chaikin smoothing, k-means clustering with convex hulls (patchwork), hatching/cross-hatching
- **Clojure2D Library** — https://github.com/Clojure2D/clojure2d
  - Noise: Perlin, Simplex, value, discrete; FBM, ridged multi-fractal, billow, warp noise (Inigo Quilez domain warping)
  - Vector fields: 100+ named variations from fractal flames (sinusoidal, swirl, horseshoe, polar, julia, waves, fisheye, popcorn, etc.)
  - Simulations: particle systems, reaction-diffusion, physarum/slime mold, cellular automata (Wolfram rules, Langton's ant)
  - Geometry: circle inversion/Mobius transforms, L-systems, grid tessellations (hex/tri/rhomb), low-discrepancy sequences (Halton, Sobol, R2, Poisson disc)
  - Other: strange attractors, harmonograms with noise, metaballs, glitch/signal processing

### Noise Strata & Fragmented Geometry
- **GenToaster — Noise Line Rows** — https://github.com/Domenicobrz/GenToaster-noise-line-rows
  - Multi-octave Simplex noise (5 octaves, fBm) displacing horizontal lines to create topographic/seismic strata
- **GenToaster — Fragmented Cubes** — https://github.com/Domenicobrz/GenToaster-fragmented-cubes
  - 5x5 grid of 3D cubes with Simplex noise vertex displacement; `hugeNoise` flag for dramatic shattering; wireframe rendering with dashed back-faces
- **GenToaster — Recursive Squares** — https://github.com/Domenicobrz/GenToaster-recursive-squares
  - Quad-tree subdivision (max depth 6, 70% early termination); nested outer/inner squares with Simplex noise rotation/scale; Mondrian-meets-fractal aesthetic

### Organic Cells & Biological Patterns
- Sources combined from Clojure2D (reaction-diffusion, physarum, metaballs, Voronoi grids), penplotter tutorial (circle packing, k-means patchwork), and Daedalus (crack mazes as Voronoi-like amorphous tessellations)
