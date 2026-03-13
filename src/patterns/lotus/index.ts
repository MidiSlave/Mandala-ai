import type { PatternSet } from '../types';
import { draw as lotusBloom } from './lotus-bloom';
import { draw as paisley } from './paisley';
import { draw as templeArch } from './temple-arch';
import { draw as mangoBoteh } from './mango-boteh';
import { draw as chainOfBells } from './chain-of-bells';

const motifs = [lotusBloom, paisley, templeArch, mangoBoteh, chainOfBells];

const lotusPatterns: PatternSet = {
    name: 'Lotus / Indian Floral',
    count: motifs.length,
    draw: (type: number, ctx) => {
        motifs[type](ctx);
    }
};

export default lotusPatterns;
