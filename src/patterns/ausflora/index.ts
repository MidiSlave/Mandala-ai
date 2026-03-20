import type { PatternSet } from '../types';
import { draw as banksia } from './banksia';
import { draw as waratah } from './waratah';
import { draw as bottlebrush } from './bottlebrush';
import { draw as fern } from './fern';
import { draw as pohutukawa } from './pohutukawa';
import { draw as eucalyptus } from './eucalyptus';
import { draw as kowhai } from './kowhai';
import { draw as protea } from './protea';
import { draw as flannel } from './flannel';
import { draw as wattle } from './wattle';

const motifs = [
    banksia, waratah, bottlebrush, fern, pohutukawa,
    eucalyptus, kowhai, protea, flannel, wattle
];

const ausfloraPatterns: PatternSet = {
    name: 'Australasian Flora',
    count: motifs.length,
    draw: (type: number, ctx) => {
        motifs[type](ctx);
    }
};

export default ausfloraPatterns;
