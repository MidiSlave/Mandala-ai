import type { PatternSet } from '../types';
import { draw as fanScallop } from './fan-scallop';
import { draw as bobbinLaceEye } from './bobbin-lace-eye';
import { draw as filetCrochet } from './filet-crochet';
import { draw as flowerRosette } from './flower-rosette';
import { draw as laceMedallion } from './lace-medallion';

const motifs = [fanScallop, bobbinLaceEye, filetCrochet, flowerRosette, laceMedallion];

const lacePatterns: PatternSet = {
    name: 'Lace / Doily',
    count: motifs.length,
    draw: (type: number, ctx) => {
        motifs[type](ctx);
    }
};

export default lacePatterns;
