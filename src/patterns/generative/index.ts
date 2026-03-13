import type { PatternSet } from '../types';
import { draw as roseCurve } from './rose-curve';
import { draw as phyllotaxis } from './phyllotaxis';
import { draw as lissajous } from './lissajous';
import { draw as concentricArcs } from './concentric-arcs';
import { draw as waveInterference } from './wave-interference';
import { draw as spirograph } from './spirograph';
import { draw as recursiveTriangles } from './recursive-triangles';
import { draw as radialSpokes } from './radial-spokes';

const motifs = [roseCurve, phyllotaxis, lissajous, concentricArcs, waveInterference, spirograph, recursiveTriangles, radialSpokes];

const generativePatterns: PatternSet = {
    name: 'Generative',
    count: motifs.length,
    draw: (type: number, ctx) => {
        motifs[type](ctx);
    }
};

export default generativePatterns;
