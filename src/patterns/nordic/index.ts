import type { PatternSet } from '../types';
import { draw as diamondLattice } from './diamond-lattice';
import { draw as snowflakeCrystal } from './snowflake-crystal';
import { draw as reindeer } from './reindeer';
import { draw as pineTree } from './pine-tree';
import { draw as interlockingDiamondChain } from './interlocking-diamond-chain';

const motifs = [diamondLattice, snowflakeCrystal, reindeer, pineTree, interlockingDiamondChain];

const nordicPatterns: PatternSet = {
    name: 'Nordic / Fair Isle',
    count: motifs.length,
    draw: (type: number, ctx) => {
        motifs[type](ctx);
    }
};

export default nordicPatterns;
