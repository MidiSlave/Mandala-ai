import type { PatternSet } from '../types';
import { draw as sunburst } from './sunburst';
import { draw as fanPalmette } from './fan-palmette';
import { draw as steppedZiggurat } from './stepped-ziggurat';
import { draw as keystoneArch } from './keystone-arch';
import { draw as fountainChevronStack } from './fountain-chevron-stack';

const motifs = [sunburst, fanPalmette, steppedZiggurat, keystoneArch, fountainChevronStack];

const artDecoPatterns: PatternSet = {
    name: 'Art Deco / Gatsby',
    count: motifs.length,
    draw: (type: number, ctx) => {
        motifs[type](ctx);
    }
};

export default artDecoPatterns;
