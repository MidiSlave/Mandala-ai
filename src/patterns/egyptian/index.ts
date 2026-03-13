import type { PatternSet } from '../types';
import { draw as eyeOfHorus } from './eye-of-horus';
import { draw as lotusPapyrusColumn } from './lotus-papyrus-column';
import { draw as triangleTeethZigzag } from './triangle-teeth-zigzag';
import { draw as scarabRosette } from './scarab-rosette';
import { draw as ankh } from './ankh';

const motifs = [eyeOfHorus, lotusPapyrusColumn, triangleTeethZigzag, scarabRosette, ankh];

const egyptianPatterns: PatternSet = {
    name: 'Egyptian / Hieroglyph',
    count: motifs.length,
    draw: (type: number, ctx) => {
        motifs[type](ctx);
    }
};

export default egyptianPatterns;
