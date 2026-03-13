import type { PatternSet } from '../types';
import { draw as africanMask } from './african-mask';
import { draw as tribalShield } from './tribal-shield';
import { draw as knotworkBand } from './knotwork-band';
import { draw as totemStack } from './totem-stack';
import { draw as warDanceFigure } from './war-dance-figure';

const motifs = [africanMask, tribalShield, knotworkBand, totemStack, warDanceFigure];

const tribalPatterns: PatternSet = {
    name: 'Tribal / Ethnic',
    count: motifs.length,
    draw: (type: number, ctx) => {
        motifs[type](ctx);
    }
};

export default tribalPatterns;
