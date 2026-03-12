# Test Coverage Analysis

## Current State

**Test coverage: 0%** — The project has zero test files, no test framework installed, no test scripts, and no CI/CD pipeline.

The entire application logic lives in a single 665-line file (`src/App.tsx`) containing complex math, canvas rendering, gesture handling, animation loops, and React UI — all completely untested.

---

## Recommended Testing Infrastructure

**Framework:** [Vitest](https://vitest.dev/) — native Vite integration, fast, TypeScript-first, Jest-compatible API.

**Additional libraries needed:**
- `vitest` — test runner
- `@testing-library/react` + `@testing-library/jest-dom` — React component testing
- `jsdom` — browser environment for unit tests
- `canvas` (npm package) — mock Canvas 2D API in Node

---

## Proposed Test Areas (Priority Order)

### 1. `mulberry32()` — Seeded RNG (HIGH priority, easy win)

This pure function is trivially extractable and testable. It underpins all pattern generation.

**Tests to write:**
- Determinism: same seed always produces same sequence
- Different seeds produce different sequences
- Output is always in [0, 1)
- Edge cases: seed = 0, seed = negative, seed = Number.MAX_SAFE_INTEGER

**Why:** A bug here silently corrupts every pattern. These tests take minutes to write and provide high confidence.

---

### 2. `mapUV()` — Coordinate Mapping (HIGH priority, easy win)

Another pure function (currently nested inside `draw()` but extractable). Maps UV texture space to polar Cartesian coordinates.

**Tests to write:**
- `u=0, v=0` maps to inner ring start
- `u=1, v=1` maps to outer ring end
- `v=0.5` maps to midpoint radius `(r1+r2)/2`
- `r1 === r2` produces zero-width ring (degenerate case)
- `layerTwist` rotates output correctly

**Why:** Coordinate math bugs produce visually wrong but silently "working" patterns. Unit tests catch precision errors early.

---

### 3. Layer Type Sequencing (HIGH priority)

The logic at lines 128–145 computes which pattern type each layer displays using seeded RNG chaining. This is stateful and tricky.

**Tests to write:**
- Fixed seed produces expected type sequence
- Changing `zoom` (shift) correctly offsets the sequence
- Sequence wraps modulo 5
- `getStep()` always returns 1–4

**Why:** This logic involves forward and backward iteration with modular arithmetic — exactly the kind of code that breaks silently on off-by-one errors.

---

### 4. Gesture Math (MEDIUM priority)

The pinch/rotate calculations (lines 395–412) involve distance ratios, logarithmic scaling, and angle wrapping.

**Tests to write (extract helpers first):**
- Pinch zoom: doubling distance → `zoom += 1` (log2 scale)
- Angle wrapping: angles crossing ±π boundary normalize correctly
- Roughness clamping: result stays in [0, 10]
- Symmetry clamping: result stays in [4, 48]

**Why:** Touch gestures are hard to debug on device. Unit-testing the math catches issues without needing a touchscreen.

---

### 5. Config Validation & Boundary Clamping (MEDIUM priority)

Several places clamp values: `Math.max(4, ...)`, `Math.min(48, ...)`, `Math.max(0, ...)`. These are scattered inline.

**Tests to write:**
- Symmetry: values below 4 clamp to 4, above 48 clamp to 48
- Roughness: values below 0 clamp to 0, above 10 clamp to 10
- Layers: `Math.max(1, ...)` enforced
- Spread: `r2 <= 0` causes layer skip

**Why:** Missing boundary checks cause canvas rendering errors (NaN, Infinity) that manifest as blank screens.

---

### 6. React Component Integration (MEDIUM priority)

**Tests to write:**
- Component renders without crashing
- Toggle controls button shows/hides the panel
- Layer slider updates layer count
- Randomize button changes the seed
- Animate button toggles animation state
- Auto-animate speed sliders only visible when animating

**Why:** Ensures UI interactions don't regress. These are straightforward with `@testing-library/react`.

---

### 7. Animation Loop Behavior (LOW priority)

**Tests to write:**
- `autoAnimateRef = true` causes twist and wavePhase to increment
- Delta time calculation is frame-rate independent
- Wave phase wraps within bounds
- Pointer easing converges toward target

**Why:** Animation bugs are subtle but these tests help catch timing regressions.

---

### 8. Event Listener Cleanup (LOW priority)

**Tests to write:**
- Unmounting the component removes all window event listeners
- No memory leaks from `requestAnimationFrame` after unmount
- ResizeObserver / resize listener cleaned up

**Why:** Memory leaks accumulate silently. Testing cleanup prevents them.

---

## Refactoring Required for Testability

The current code has everything in one component. To enable testing, extract:

1. **`mulberry32()`** — already a standalone function (line 6) ✅
2. **`mapUV()`** — extract from inside `draw()` (line 148) to module scope
3. **Gesture math** — extract `getDistance`, `getAngle`, and clamping logic into a `gestures.ts` utility
4. **Layer type computation** — extract `getStep()` and the type-sequence loop into a `layers.ts` utility
5. **Config defaults and validation** — extract into a `config.ts` module

This refactoring improves testability without changing behavior.

---

## Suggested `package.json` additions

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  },
  "devDependencies": {
    "vitest": "^3.0.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "jsdom": "^25.0.0"
  }
}
```

---

## Summary

| Area | Priority | Effort | Impact |
|------|----------|--------|--------|
| `mulberry32()` RNG | HIGH | Low | High — underpins all patterns |
| `mapUV()` coordinates | HIGH | Low | High — silent visual bugs |
| Layer type sequencing | HIGH | Medium | High — pattern correctness |
| Gesture math | MEDIUM | Medium | Medium — touch interaction |
| Config boundaries | MEDIUM | Low | Medium — crash prevention |
| React component | MEDIUM | Medium | Medium — UI regression |
| Animation loop | LOW | Medium | Low — timing edge cases |
| Event cleanup | LOW | Low | Low — memory leaks |

Starting with items 1–3 would give meaningful coverage of the core algorithmic logic with minimal effort.
