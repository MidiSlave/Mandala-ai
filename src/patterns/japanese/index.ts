import type { PatternSet } from '../types';
import { draw as asanoha } from './asanoha';
import { draw as seigaiha } from './seigaiha';
import { draw as shippo } from './shippo';
import { draw as kikko } from './kikko';
import { draw as yagasuri } from './yagasuri';

const motifs = [asanoha, seigaiha, shippo, kikko, yagasuri];

const japanesePatterns: PatternSet = {
    name: 'Japanese Kumiko',
    count: motifs.length,
    draw: (type: number, ctx) => {
        motifs[type](ctx);
    }
};

export default japanesePatterns;
