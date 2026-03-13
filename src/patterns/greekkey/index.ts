import type { PatternSet } from '../types';
import { draw as classicMeander } from './classic-meander';
import { draw as labyrinthCross } from './labyrinth-cross';
import { draw as waveScroll } from './wave-scroll';
import { draw as doubleMeanderBorder } from './double-meander-border';
import { draw as fretMosaic } from './fret-mosaic';

const motifs = [classicMeander, labyrinthCross, waveScroll, doubleMeanderBorder, fretMosaic];

const greekkeyPatterns: PatternSet = {
    name: 'Greek Key / Meander',
    count: motifs.length,
    draw: (type: number, ctx) => {
        motifs[type](ctx);
    }
};

export default greekkeyPatterns;
