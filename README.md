# Mandala Generator

An interactive mandala generator that renders culturally-inspired geometric patterns on HTML5 Canvas with a hand-drawn aesthetic. Explore infinite tunnel zoom, animated rotations, and 29 distinct pattern sets drawn from world art traditions, generative algorithms, and research-inspired techniques.

## Features

- **Infinite tunnel zoom** — pinch or scroll to travel endlessly inward/outward through layers
- **29 pattern sets** across cultural, generative, art movement, and research-inspired categories, plus a Mix mode
- **Hand-drawn aesthetic** — every stroke gets per-pass roughness wobble and a paper grain overlay
- **Touch and mouse gestures** — drag, pinch, double-tap, scroll
- **Auto-animation** — continuous spin, zoom, and wave bulge with adjustable speeds
- **Randomize** — double-tap or click to regenerate with a new seed
- **Save to PNG** — export the current canvas as a high-resolution image
- **Fullscreen mode** — immersive viewing (cross-browser including iPad Safari)
- **Responsive UI** — draggable control panel works on mobile and desktop
- **CLI tooling** — headless rendering, analysis, and reference image generation

## Pattern Sets

### Cultural Patterns (17)

| Set | Motifs | Inspiration |
|-----|--------|-------------|
| Aztec / Mayan | 5 | Stepped pyramids, sun disks, jaguar eyes, serpent coils, temple glyphs |
| Nordic / Fair Isle | 5 | Diamond lattices, snowflakes, reindeer, interlocking chains, pine trees |
| Lace / Doily | 5 | Fan scallops, bobbin lace eyes, filet crochet, flower rosettes, medallions |
| Chevron / Herringbone | 5 | Nested chevrons, herringbone weave, arrow fletching, zigzag ribbons, Art Deco fans |
| Greek Key / Meander | 5 | Classic meander, double borders, fret mosaic, labyrinth cross, wave scroll |
| Tribal / Ethnic | 5 | African masks, knotwork bands, totem stacks, tribal shields, war dance figures |
| Lotus / Indian Floral | 5 | Lotus blooms, paisley, temple arches, mango boteh, bell chains |
| Art Deco / Gatsby | 5 | Sunbursts, fan palmettes, stepped ziggurats, keystone arches, fountain stacks |
| Japanese Kumiko | 5 | Asanoha (hemp leaf), seigaiha (waves), shippo (treasures), kikko (tortoiseshell), yagasuri (arrows) |
| Sacred Geometry | 5 | Flower of Life, Seed of Life, Sri Yantra, Metatron's Cube, Vesica Piscis |
| Celtic Knotwork | 5 | Triquetra, quaternary knots, plaitwork braids, ring knots, spiral triskelions |
| Egyptian / Hieroglyph | 5 | Eye of Horus, lotus papyrus columns, ankh, scarab rosettes, zigzag teeth |
| Mesoamerican | 8 | Stepped pyramid, Mayan glyphs, sun rays, Aztec fret, interlocking teeth, serpent scales, Quetzalcoatl feather, Ollin |
| Islamic Geometric | 6 | 8-point stars, girih hexagons, arabesque vines, 6-point tessellation, muqarnas, zellige mosaic |
| Aboriginal Dots | 6 | Waterhole rings, journey lines, kangaroo tracks, cross-hatching, rainbow serpent, campfire circles |
| Polynesian / Tapa | 6 | Ocean waves, shark teeth, spearheads, tapa cross, tiki faces, turtle shells |
| Embroidery / Stitch | 6 | Herringbone, chain, blanket, feather, cross, and seed stitches |

### Generative / Mathematical Patterns (6)

| Set | Motifs | Inspiration |
|-----|--------|-------------|
| Generative | 8 | Rose curves, phyllotaxis, Lissajous, spirograph, radial spokes, wave interference, concentric arcs, recursive triangles |
| Guilloche | 6 | Classic guilloche, cycloidal bands, rosettes, spirograph envelopes, engine-turned lattice, moiré mesh |
| Fractal | 6 | Sierpinski triangle, Koch snowflake, tree branching, recursive squares, Cantor set, hexagonal subdivision |
| Spirals | 6 | Fibonacci, Archimedean, phyllotaxis sunflower, Fermat, spiral lattice, double helix |
| Harmonograph | 6 | Lateral pendulum, rotary, Chladni plates, standing waves, Lissajous beats, cymatics rings |
| Truchet Tiles | 6 | Quarter-circle, diagonal, circular, Smith, woven, multi-curve |

### Art Movement Patterns (2)

| Set | Motifs | Inspiration |
|-----|--------|-------------|
| Op Art | 6 | Checkerboard spherical, concentric warped squares, moiré circles, parallel bulge, rotating squares, zigzag waves |
| Art Nouveau | 6 | Whiplash curves, lily stems, peacock feathers, dragonfly wings, floral medallions, Tiffany glass |

### Research-Inspired Patterns (5)

| Set | Motifs | Inspiration |
|-----|--------|-------------|
| Maze / Labyrinth | 6 | Theta (circular), triangular, orthogonal, hexagonal, octagonal, diagonal mazes |
| Flow Field | 6 | Sinusoidal streams, swirl vortex, noise traces, distorted grid, convergence, turbulence |
| Noise Strata | 6 | Topographic contours, fragmented grid, ridge lines, terrain bands, warp distortion, noise columns |
| Organic Cells | 6 | Circle packing, metaballs, reaction-diffusion, Voronoi cracks, mycelium networks, patchwork |
| **Mix** | — | Randomly assigns a different set to each layer |

## Pattern Reference Strips

Each pattern set has a reference strip showing all motifs in filled (left) and outline (right) modes.

### Cultural Patterns

![Aztec / Mayan](docs/strips/strip-aztec-mayan.png)
![Nordic / Fair Isle](docs/strips/strip-nordic-fair-isle.png)
![Lace / Doily](docs/strips/strip-lace-doily.png)
![Chevron / Herringbone](docs/strips/strip-chevron-herringbone.png)
![Greek Key / Meander](docs/strips/strip-greek-key-meander.png)
![Tribal / Ethnic](docs/strips/strip-tribal-ethnic.png)
![Lotus / Indian Floral](docs/strips/strip-lotus-indian-floral.png)
![Art Deco / Gatsby](docs/strips/strip-art-deco-gatsby.png)
![Japanese Kumiko](docs/strips/strip-japanese-kumiko.png)
![Sacred Geometry](docs/strips/strip-sacred-geometry.png)
![Celtic Knotwork](docs/strips/strip-celtic-knotwork.png)
![Egyptian / Hieroglyph](docs/strips/strip-egyptian-hieroglyph.png)
![Mesoamerican](docs/strips/strip-mesoamerican.png)
![Islamic Geometric](docs/strips/strip-islamic-geometric.png)
![Aboriginal Dots](docs/strips/strip-aboriginal-dots.png)
![Polynesian](docs/strips/strip-polynesian.png)
![Embroidery / Stitch](docs/strips/strip-embroidery-stitch.png)

### Generative / Mathematical Patterns

![Generative](docs/strips/strip-generative.png)
![Guilloche](docs/strips/strip-guilloche.png)
![Fractal](docs/strips/strip-fractal.png)
![Spirals](docs/strips/strip-spirals.png)
![Harmonograph](docs/strips/strip-harmonograph.png)
![Truchet Tiles](docs/strips/strip-truchet-tiles.png)

### Art Movement Patterns

![Op Art](docs/strips/strip-op-art.png)
![Art Nouveau](docs/strips/strip-art-nouveau.png)

### Research-Inspired Patterns

![Maze / Labyrinth](docs/strips/strip-maze-labyrinth.png)
![Flow Field](docs/strips/strip-flow-field.png)
![Noise Strata](docs/strips/strip-noise-strata.png)
![Organic Cells](docs/strips/strip-organic-cells.png)

## Controls

| Input | Action |
|-------|--------|
| Drag (1 finger / mouse) | Twist (horizontal) and change symmetry (vertical) |
| Pinch / scroll wheel | Infinite zoom in/out |
| Double-tap | Randomize pattern seed |
| Hover / touch | Expand nearby layers (reactive bulge) |
| UI panel | Layer count, pattern set selector, animation controls, randomize, save |

## CLI Tools

The `tools/` directory provides headless rendering and analysis utilities:

```bash
npx tsx tools/cli.ts render-strips                 # Render reference strips for all 29 pattern sets
npx tsx tools/cli.ts render-strips --set maze      # Render strip for a specific set
npx tsx tools/cli.ts render-tiles                   # Render individual pattern tiles
npx tsx tools/cli.ts render-mandalas --size 1200    # Render full mandalas
npx tsx tools/cli.ts render-all                     # Render tiles + mandalas + strips
npx tsx tools/cli.ts analyze                        # Analyze rendered tiles
npx tsx tools/cli.ts report                         # Full pipeline: render + analyze
npx tsx tools/cli.ts list                           # List all pattern sets
```

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
