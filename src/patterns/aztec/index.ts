import type { PatternSet } from '../types';
import { draw as steppedPyramid } from './stepped-pyramid';
import { draw as sunDisk } from './sun-disk';
import { draw as jaguarEye } from './jaguar-eye';
import { draw as serpentCoil } from './serpent-coil';
import { draw as templeGlyph } from './temple-glyph';

const motifs = [steppedPyramid, sunDisk, jaguarEye, serpentCoil, templeGlyph];

const aztecPatterns: PatternSet = {
    name: 'Aztec / Mayan',
    count: motifs.length,
    draw: (type: number, ctx) => {
        motifs[type](ctx);
    }
};

export default aztecPatterns;
