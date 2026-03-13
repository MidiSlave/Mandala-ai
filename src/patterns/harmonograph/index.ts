import type { PatternSet } from '../types';
import { draw as lateral } from './lateral';
import { draw as rotary } from './rotary';
import { draw as chladni } from './chladni';
import { draw as standingWave } from './standing-wave';
import { draw as lissajousBeats } from './lissajous-beats';
import { draw as cymaticsRing } from './cymatics-ring';

const motifs = [lateral, rotary, chladni, standingWave, lissajousBeats, cymaticsRing];

const harmonographPatterns: PatternSet = {
    name: 'Harmonograph',
    count: motifs.length,
    draw: (type: number, ctx) => {
        motifs[type](ctx);
    }
};

export default harmonographPatterns;
