import type { PatternSet } from '../types';
import { draw as quarterCircle } from './quarter-circle';
import { draw as diagonal } from './diagonal';
import { draw as smith } from './smith';
import { draw as circular } from './circular';
import { draw as woven } from './woven';
import { draw as multiCurve } from './multi-curve';

const motifs = [quarterCircle, diagonal, smith, circular, woven, multiCurve];

const truchetPatterns: PatternSet = {
    name: 'Truchet Tiles',
    count: motifs.length,
    draw: (type: number, ctx) => {
        motifs[type](ctx);
    }
};

export default truchetPatterns;
