import type { PatternSet } from '../types';
import { draw as sinusoidal } from './sinusoidal';
import { draw as swirl } from './swirl';
import { draw as noiseTraces } from './noise-traces';
import { draw as distortedGrid } from './distorted-grid';
import { draw as convergence } from './convergence';
import { draw as turbulence } from './turbulence';

const motifs = [sinusoidal, swirl, noiseTraces, distortedGrid, convergence, turbulence];

const flowFieldPatterns: PatternSet = {
    name: 'Flow Field',
    count: motifs.length,
    draw: (type: number, ctx) => {
        motifs[type](ctx);
    }
};

export default flowFieldPatterns;
