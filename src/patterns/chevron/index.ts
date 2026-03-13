import type { PatternSet } from '../types';
import { draw as nestedChevrons } from './nested-chevrons';
import { draw as herringboneWeave } from './herringbone-weave';
import { draw as arrowFletching } from './arrow-fletching';
import { draw as zigzagRibbon } from './zigzag-ribbon';
import { draw as artDecoFan } from './art-deco-fan';

const motifs = [nestedChevrons, herringboneWeave, arrowFletching, zigzagRibbon, artDecoFan];

const chevronPatterns: PatternSet = {
    name: 'Chevron / Herringbone',
    count: motifs.length,
    draw: (type: number, ctx) => {
        motifs[type](ctx);
    }
};

export default chevronPatterns;
