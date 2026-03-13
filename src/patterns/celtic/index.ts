import type { PatternSet } from '../types';
import { draw as triquetra } from './triquetra';
import { draw as spiralTriskelion } from './spiral-triskelion';
import { draw as plaitworkBraid } from './plaitwork-braid';
import { draw as ringKnot } from './ring-knot';
import { draw as quaternaryKnot } from './quaternary-knot';

const motifs = [triquetra, spiralTriskelion, plaitworkBraid, ringKnot, quaternaryKnot];

const celticPatterns: PatternSet = {
    name: 'Celtic Knotwork',
    count: motifs.length,
    draw: (type: number, ctx) => {
        motifs[type](ctx);
    }
};

export default celticPatterns;
