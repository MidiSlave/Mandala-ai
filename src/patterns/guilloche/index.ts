import type { PatternSet } from '../types';
import { draw as classicGuilloche } from './classic-guilloche';
import { draw as rosetteGuilloche } from './rosette-guilloche';
import { draw as engineTurnedLattice } from './engine-turned-lattice';
import { draw as spirographEnvelope } from './spirograph-envelope';
import { draw as moireDiamondMesh } from './moire-diamond-mesh';
import { draw as cycloidalBand } from './cycloidal-band';

const motifs = [classicGuilloche, rosetteGuilloche, engineTurnedLattice, spirographEnvelope, moireDiamondMesh, cycloidalBand];

const guillochePatterns: PatternSet = {
    name: 'Guilloche',
    count: motifs.length,
    draw: (type: number, ctx) => {
        motifs[type](ctx);
    }
};

export default guillochePatterns;
