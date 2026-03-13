// Simple seeded noise function using rng
export function noise2d(x: number, y: number): number {
    // Hash-based pseudo-noise using rng seed
    const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return n - Math.floor(n);
}

// Smooth noise with interpolation
export function smoothNoise(x: number, y: number): number {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = x - ix;
    const fy = y - iy;
    const sx = fx * fx * (3 - 2 * fx); // smoothstep
    const sy = fy * fy * (3 - 2 * fy);
    const a = noise2d(ix, iy);
    const b = noise2d(ix + 1, iy);
    const c = noise2d(ix, iy + 1);
    const d = noise2d(ix + 1, iy + 1);
    return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}
