import type { PatternSet } from '../types';
import { draw as skull } from './skull';
import { draw as bomb } from './bomb';
import { draw as sword } from './sword';
import { draw as explosion } from './explosion';
import { draw as knife } from './knife';
import { draw as bowArrow } from './bow-arrow';
import { draw as crossbones } from './crossbones';
import { draw as axe } from './axe';
import { draw as reaper } from './reaper';

const motifs = [
    skull, bomb, sword, explosion, knife, bowArrow, crossbones, axe, reaper
];

const darkPatterns: PatternSet = {
    name: 'Death / Dark',
    count: motifs.length,
    draw: (type: number, ctx) => {
        motifs[type](ctx);
    }
};

export default darkPatterns;
