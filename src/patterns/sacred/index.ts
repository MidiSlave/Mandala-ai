import type { PatternSet } from '../types';
import { draw as flowerOfLife } from './flower-of-life';
import { draw as seedOfLife } from './seed-of-life';
import { draw as sriYantra } from './sri-yantra';
import { draw as metatronsCube } from './metatrons-cube';
import { draw as vesicaPiscis } from './vesica-piscis';

const motifs = [flowerOfLife, seedOfLife, sriYantra, metatronsCube, vesicaPiscis];

const sacredPatterns: PatternSet = {
    name: 'Sacred Geometry',
    count: motifs.length,
    draw: (type: number, ctx) => {
        motifs[type](ctx);
    }
};

export default sacredPatterns;
