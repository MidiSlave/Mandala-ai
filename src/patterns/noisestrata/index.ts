import type { PatternSet } from '../types';
import { draw as topographicContour } from './topographic-contour';
import { draw as fragmentedGrid } from './fragmented-grid';
import { draw as ridgeLines } from './ridge-lines';
import { draw as terrainBands } from './terrain-bands';
import { draw as warpDistortion } from './warp-distortion';
import { draw as noiseColumns } from './noise-columns';

const motifs = [topographicContour, fragmentedGrid, ridgeLines, terrainBands, warpDistortion, noiseColumns];

const noiseStrataPatterns: PatternSet = {
    name: 'Noise Strata',
    count: motifs.length,
    draw: (type: number, ctx) => {
        motifs[type](ctx);
    }
};

export default noiseStrataPatterns;
