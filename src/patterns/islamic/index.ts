import type { PatternSet } from '../types';
import { draw as eightPointStar } from './eight-point-star';
import { draw as girihHexagons } from './girih-hexagons';
import { draw as arabesqueVine } from './arabesque-vine';
import { draw as sixPointStar } from './six-point-star';
import { draw as muqarnasCross } from './muqarnas-cross';
import { draw as zelligeMosaic } from './zellige-mosaic';

const motifs = [eightPointStar, girihHexagons, arabesqueVine, sixPointStar, muqarnasCross, zelligeMosaic];

const islamicPatterns: PatternSet = {
    name: 'Islamic Geometric',
    count: motifs.length,
    draw: (type: number, ctx) => {
        motifs[type](ctx);
    }
};

export default islamicPatterns;
