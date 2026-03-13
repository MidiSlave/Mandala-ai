# CLAUDE.md — AI Assistant Guide for Mandala-ai

> **Key principle:** This is a visual canvas application. Never make changes blindly — always validate your work by taking Playwright screenshots and reviewing the rendered output. See the "Validation & Auto-Testing Methodology" section for the full workflow and tooling setup.

## Project Overview

Interactive Mandala Generator — a browser-based app that renders procedural mandala patterns on an HTML5 Canvas using a hand-drawn / rough aesthetic. Users can interact via touch gestures or mouse to twist, zoom (infinite tunnel effect), randomize, and animate the mandala. Seven culturally-inspired pattern sets are available, plus a "Mix" mode that combines them.

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
  App.tsx              # Main (and only) React component — all rendering, UI, gesture handling
  main.tsx             # React entry point
  index.css            # Tailwind import + custom scrollbar/range slider styles
  patterns/
    types.ts           # Core types: PathStyle, DrawUV, PatternContext, PatternSet
    index.ts           # Re-exports all pattern sets
    aztec.ts           # Aztec / Mayan patterns (5 motifs)
    nordic.ts          # Nordic / Fair Isle patterns (5 motifs)
    lace.ts            # Lace / Doily patterns
    chevron.ts         # Chevron / Herringbone patterns
    greekkey.ts        # Greek Key / Meander patterns (5 motifs)
    tribal.ts          # Tribal / Ethnic patterns
    lotus.ts           # Lotus / Indian Floral patterns (5 motifs)
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
| `filled` | Dark fill (`#1A1818`) + stroke |
| `opaque-outline` | Background-color fill (`#EBE7E0`) + stroke — acts as a "cutout" |
| `outline` | Stroke only (no fill) |
| `line` | Open polyline stroke (no closePath) |

### Pattern Conventions

- Each pattern set has a `count` (typically 5) and a `draw(type, ctx)` switch statement.
- Patterns should look good in **both** filled and outline modes — use the `filled` boolean and `baseStyle` to adapt.
- Common variable naming in patterns:
  - `mainStyle` = `filled ? 'filled' : 'outline'`
  - `detailStyle` = `filled ? 'opaque-outline' : 'filled'`
  - `baseStyle` is provided via `PatternContext`
- The rendering engine applies per-layer roughness (hand-drawn wobble), seeded RNG, and per-symmetry-slice rotation — patterns just define geometry.

### Rendering Pipeline (App.tsx)

1. Layers are positioned via an infinite tunnel/conveyor belt system (`zoom` parameter shifts layer IDs).
2. Each layer gets a seeded RNG determining: pattern set (in Mix mode), motif type, filled/outline, spin direction/speed.
3. For each layer, the canvas rotates by `angleStep` for each symmetry slice and calls `patternSet.draw()`.
4. `drawRoughPath()` adds hand-drawn roughness (configurable via `config.roughness`).
5. A grain overlay is applied as a final pass.

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

To screenshot a specific pattern set, use `page.evaluate()` to click pattern buttons by their text content:

```ts
// Open panel first if closed
await page.click('button[title="Toggle Controls"]');
await page.waitForTimeout(300);

// Click a pattern set button by name
await page.evaluate((name) => {
    const buttons = document.querySelectorAll('button');
    for (const btn of buttons) {
        if (btn.textContent?.trim() === name) {
            btn.click();
            break;
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
       count: 5,  // number of distinct motifs
       draw: (type: number, { drawUV, filled, baseStyle }: PatternContext) => {
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

- Tunnel effect power: `TUNNEL_POWER` constant in `App.tsx`
- Default config values: `DEFAULT_CONFIG` object in `App.tsx`
- Background color: `#EBE7E0` (warm paper tone), dark color: `#1A1818`
- Roughness, symmetry, layers, spin, zoom — all in `AppConfig` interface
