import type { PatternSet } from '../types';
import { draw as sharkTeeth } from './shark-teeth';
import { draw as oceanWaves } from './ocean-waves';
import { draw as turtleShell } from './turtle-shell';
import { draw as spearhead } from './spearhead';
import { draw as tikiFace } from './tiki-face';
import { draw as tapaCross } from './tapa-cross';

const motifs = [sharkTeeth, oceanWaves, turtleShell, spearhead, tikiFace, tapaCross];

const polynesianPatterns: PatternSet = {
    name: 'Polynesian',
    count: motifs.length,
    draw: (type: number, ctx) => {
        motifs[type](ctx);
    }
};

export default polynesianPatterns;
