# Mandala Generator

An interactive mandala generator that renders culturally-inspired geometric patterns on HTML5 Canvas with a hand-drawn aesthetic. Explore infinite tunnel zoom, animated rotations, and seven distinct pattern sets drawn from world art traditions.

## Features

- **Infinite tunnel zoom** — pinch or scroll to travel endlessly inward/outward through layers
- **Seven cultural pattern sets** plus a Mix mode that blends them all
- **Hand-drawn aesthetic** — every stroke gets per-pass roughness wobble and a paper grain overlay
- **Touch and mouse gestures** — drag, pinch, double-tap, scroll
- **Auto-animation** — continuous spin, zoom, and wave bulge with adjustable speeds
- **Randomize** — double-tap or click to regenerate with a new seed
- **Save to PNG** — export the current canvas as a high-resolution image
- **Fullscreen mode** — immersive viewing (cross-browser including iPad Safari)
- **Responsive UI** — draggable control panel works on mobile and desktop

## Pattern Sets

| Set | Inspiration |
|-----|-------------|
| Aztec / Mayan | Stepped pyramids, sun disks, jaguar eyes, serpent coils, temple glyphs |
| Nordic / Fair Isle | Diamond lattices, snowflakes, reindeer motifs |
| Lace / Doily | Scalloped edges, floral medallions, mesh fills |
| Chevron / Herringbone | Zigzag bands, arrow stacks, woven textures |
| Greek Key / Meander | Interlocking rectangular spirals, wave borders |
| Tribal / Ethnic | Geometric masks, shield patterns, dotwork |
| Lotus / Indian Floral | Lotus blooms, paisley, temple arches, mango/boteh, bell chains |
| **Mix** | Randomly assigns a different set to each layer |

## Controls

| Input | Action |
|-------|--------|
| Drag (1 finger / mouse) | Twist (horizontal) and change symmetry (vertical) |
| Pinch / scroll wheel | Infinite zoom in/out |
| Double-tap | Randomize pattern seed |
| Hover / touch | Expand nearby layers (reactive bulge) |
| UI panel | Layer count, pattern set selector, animation controls, randomize, save |

## Run Locally

**Prerequisites:** Node.js

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:3000`.

### Other Commands

```bash
npm run build     # Production build to dist/
npm run preview   # Preview production build
npm run lint      # Type-check (tsc --noEmit)
```

## Tech Stack

- React 19 + TypeScript 5.8
- Vite 6
- Tailwind CSS 4
- HTML5 Canvas 2D (all rendering)
- Motion (Framer Motion) for UI animations
- Lucide React icons

## License

See repository for license details.
