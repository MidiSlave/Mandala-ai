import type { PatternSet } from '../types';
import { draw as circlePacking } from './circle-packing';
import { draw as metaballs } from './metaballs';
import { draw as reactionDiffusion } from './reaction-diffusion';
import { draw as voronoiCrack } from './voronoi-crack';
import { draw as myceliumNetwork } from './mycelium-network';
import { draw as patchwork } from './patchwork';

const motifs = [circlePacking, metaballs, reactionDiffusion, voronoiCrack, myceliumNetwork, patchwork];

const organicCellPatterns: PatternSet = {
    name: 'Organic Cells',
    count: motifs.length,
    draw: (type: number, ctx) => {
        motifs[type](ctx);
    }
};

export default organicCellPatterns;
