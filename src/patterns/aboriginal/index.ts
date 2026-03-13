import type { PatternSet } from '../types';
import { draw as waterhole } from './waterhole';
import { draw as journeyLines } from './journey-lines';
import { draw as kangarooTracks } from './kangaroo-tracks';
import { draw as crossHatching } from './cross-hatching';
import { draw as rainbowSerpent } from './rainbow-serpent';
import { draw as campfire } from './campfire';

const motifs = [waterhole, journeyLines, kangarooTracks, crossHatching, rainbowSerpent, campfire];

const aboriginalPatterns: PatternSet = {
    name: 'Aboriginal Dots',
    count: motifs.length,
    draw: (type: number, ctx) => {
        motifs[type](ctx);
    }
};

export default aboriginalPatterns;
