import type { PatternSet } from '../types';
import { draw as sittingCat } from './sitting-cat';
import { draw as walkingCat } from './walking-cat';
import { draw as elephant } from './elephant';
import { draw as giraffe } from './giraffe';
import { draw as cow } from './cow';
import { draw as turkey } from './turkey';
import { draw as bat } from './bat';
import { draw as snake } from './snake';
import { draw as rat } from './rat';
import { draw as fish } from './fish';
import { draw as bear } from './bear';
import { draw as lizard } from './lizard';
import { draw as bird } from './bird';
import { draw as possum } from './possum';
import { draw as kangaroo } from './kangaroo';

const motifs = [
    sittingCat, walkingCat, elephant, giraffe, cow, turkey, bat,
    snake, rat, fish, bear, lizard, bird, possum, kangaroo
];

const animalPatterns: PatternSet = {
    name: 'Animals',
    count: motifs.length,
    draw: (type: number, ctx) => {
        motifs[type](ctx);
    }
};

export default animalPatterns;
