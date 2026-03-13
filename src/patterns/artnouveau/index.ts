import type { PatternSet } from '../types';
import { draw as whiplashCurve } from './whiplash-curve';
import { draw as floralMedallion } from './floral-medallion';
import { draw as tiffanyGlass } from './tiffany-glass';
import { draw as lilyStem } from './lily-stem';
import { draw as peacockFeather } from './peacock-feather';
import { draw as dragonflyWings } from './dragonfly-wings';

const motifs = [whiplashCurve, floralMedallion, tiffanyGlass, lilyStem, peacockFeather, dragonflyWings];

const artNouveauPatterns: PatternSet = {
    name: 'Art Nouveau',
    count: motifs.length,
    draw: (type: number, ctx) => {
        motifs[type](ctx);
    }
};

export default artNouveauPatterns;
