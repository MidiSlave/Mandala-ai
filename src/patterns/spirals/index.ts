import type { PatternSet } from '../types';
import { draw as fibonacci } from './fibonacci';
import { draw as archimedean } from './archimedean';
import { draw as phyllotaxis } from './phyllotaxis';
import { draw as fermat } from './fermat';
import { draw as spiralLattice } from './spiral-lattice';
import { draw as doubleHelix } from './double-helix';

const motifs = [fibonacci, archimedean, phyllotaxis, fermat, spiralLattice, doubleHelix];

const spiralPatterns: PatternSet = {
    name: 'Spirals',
    count: motifs.length,
    draw: (type: number, ctx) => {
        motifs[type](ctx);
    }
};

export default spiralPatterns;
