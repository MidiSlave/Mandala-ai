import type { PatternSet } from '../types';
import { draw as concentricWarpedSquares } from './concentric-warped-squares';
import { draw as parallelLinesBulge } from './parallel-lines-bulge';
import { draw as checkerboardSpherical } from './checkerboard-spherical';
import { draw as rotatingSquares } from './rotating-squares';
import { draw as moireCircles } from './moire-circles';
import { draw as zigzagWaveField } from './zigzag-wave-field';

const motifs = [concentricWarpedSquares, parallelLinesBulge, checkerboardSpherical, rotatingSquares, moireCircles, zigzagWaveField];

const opArtPatterns: PatternSet = {
    name: 'Op Art',
    count: motifs.length,
    draw: (type: number, ctx) => {
        motifs[type](ctx);
    }
};

export default opArtPatterns;
