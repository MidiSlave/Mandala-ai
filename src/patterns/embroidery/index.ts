import type { PatternSet } from '../types';
import { draw as herringboneStitch } from './herringbone-stitch';
import { draw as chainStitch } from './chain-stitch';
import { draw as blanketStitch } from './blanket-stitch';
import { draw as featherStitch } from './feather-stitch';
import { draw as crossStitch } from './cross-stitch';
import { draw as seedStitch } from './seed-stitch';

const motifs = [herringboneStitch, chainStitch, blanketStitch, featherStitch, crossStitch, seedStitch];

const embroideryPatterns: PatternSet = {
    name: 'Embroidery / Stitch',
    count: motifs.length,
    draw: (type: number, ctx) => {
        motifs[type](ctx);
    }
};

export default embroideryPatterns;
