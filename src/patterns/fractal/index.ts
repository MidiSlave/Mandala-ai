import type { PatternSet } from '../types';
import { draw as sierpinskiTriangle } from './sierpinski-triangle';
import { draw as kochSnowflake } from './koch-snowflake';
import { draw as recursiveSquares } from './recursive-squares';
import { draw as cantorSet } from './cantor-set';
import { draw as treeBranching } from './tree-branching';
import { draw as hexagonalSubdivision } from './hexagonal-subdivision';

const motifs = [sierpinskiTriangle, kochSnowflake, recursiveSquares, cantorSet, treeBranching, hexagonalSubdivision];

const fractalPatterns: PatternSet = {
    name: 'Fractal',
    count: motifs.length,
    draw: (type: number, ctx) => {
        motifs[type](ctx);
    }
};

export default fractalPatterns;
