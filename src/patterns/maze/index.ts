import type { PatternSet } from '../types';
import { draw as theta } from './theta';
import { draw as triangular } from './triangular';
import { draw as orthogonal } from './orthogonal';
import { draw as hexagonal } from './hexagonal';
import { draw as octagonal } from './octagonal';
import { draw as diagonal } from './diagonal';

const motifs = [theta, triangular, orthogonal, hexagonal, octagonal, diagonal];

const mazePatterns: PatternSet = {
    name: 'Maze / Labyrinth',
    count: motifs.length,
    draw: (type: number, ctx) => {
        motifs[type](ctx);
    }
};

export default mazePatterns;
