import type { PatternSet } from '../types';
import { draw as steppedPyramid } from './stepped-pyramid';
import { draw as mayanGlyphBlock } from './mayan-glyph-block';
import { draw as sunRays } from './sun-rays';
import { draw as aztecFret } from './aztec-fret';
import { draw as interlockingTeeth } from './interlocking-teeth';
import { draw as serpentScales } from './serpent-scales';
import { draw as quetzalcoatlFeather } from './quetzalcoatl-feather';
import { draw as ollin } from './ollin';

const motifs = [steppedPyramid, mayanGlyphBlock, sunRays, aztecFret, interlockingTeeth, serpentScales, quetzalcoatlFeather, ollin];

const mesoamericanPatterns: PatternSet = {
    name: 'Mesoamerican',
    count: motifs.length,
    draw: (type: number, ctx) => {
        motifs[type](ctx);
    }
};

export default mesoamericanPatterns;
