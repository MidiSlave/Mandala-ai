// Arrow with fletching — large arrow filling most of tile vertically (v 0.1-0.9)
import type { PatternContext } from '../types';
import { circlePoints, bandFromPolyline } from './helpers';

export function draw({ drawUV, filled }: PatternContext): void {
    const bw = 0.015;
    const shaftTop = 0.40;
    const shaftBot = 0.60;
    drawUV([[0.05, shaftTop], [0.60, shaftTop], [0.60, shaftBot], [0.05, shaftBot]], filled ? 'filled' : 'outline');
    drawUV([[0.05, 0.5 - bw], [0.60, 0.5 - bw], [0.60, 0.5 + bw], [0.05, 0.5 + bw]], 'filled');
    drawUV([[0.08, shaftTop - 0.02 - bw], [0.55, shaftTop - 0.02 - bw], [0.55, shaftTop - 0.02 + bw], [0.08, shaftTop - 0.02 + bw]], 'filled');
    drawUV([[0.08, shaftBot + 0.02 - bw], [0.55, shaftBot + 0.02 - bw], [0.55, shaftBot + 0.02 + bw], [0.08, shaftBot + 0.02 + bw]], 'filled');

    drawUV([[0.58, 0.08], [0.96, 0.50], [0.58, 0.92]], 'filled');
    drawUV(bandFromPolyline([[0.58, 0.08], [0.96, 0.50], [0.58, 0.92], [0.58, 0.08]], 0.012), 'filled');
    drawUV(bandFromPolyline([[0.62, 0.22], [0.88, 0.50]], 0.02), 'filled');
    drawUV(bandFromPolyline([[0.62, 0.78], [0.88, 0.50]], 0.02), 'filled');
    drawUV([[0.62, 0.5 - 0.02], [0.85, 0.5 - 0.02], [0.85, 0.5 + 0.02], [0.62, 0.5 + 0.02]], 'filled');
    drawUV(bandFromPolyline([[0.64, 0.35], [0.78, 0.50], [0.64, 0.65]], 0.018), 'filled');

    drawUV([[0.02, shaftTop], [0.08, 0.08], [0.18, 0.14], [0.10, shaftTop]], filled ? 'filled' : 'outline');
    drawUV([[0.02, shaftBot], [0.08, 0.92], [0.18, 0.86], [0.10, shaftBot]], filled ? 'filled' : 'outline');
    drawUV([[0.10, shaftTop], [0.17, 0.12], [0.26, 0.18], [0.18, shaftTop]], filled ? 'opaque-outline' : 'outline');
    drawUV([[0.10, shaftBot], [0.17, 0.88], [0.26, 0.82], [0.18, shaftBot]], filled ? 'opaque-outline' : 'outline');
    drawUV([[0.20, shaftTop], [0.26, 0.18], [0.34, 0.24], [0.27, shaftTop]], filled ? 'filled' : 'outline');
    drawUV([[0.20, shaftBot], [0.26, 0.82], [0.34, 0.76], [0.27, shaftBot]], filled ? 'filled' : 'outline');
    drawUV([[0.30, shaftTop], [0.34, 0.26], [0.40, 0.30], [0.35, shaftTop]], filled ? 'opaque-outline' : 'outline');
    drawUV([[0.30, shaftBot], [0.34, 0.74], [0.40, 0.70], [0.35, shaftBot]], filled ? 'opaque-outline' : 'outline');

    for (let i = 0; i < 5; i++) {
        const u = 0.04 + i * 0.04;
        drawUV(bandFromPolyline([[u, shaftTop], [u + 0.04, 0.12 + i * 0.03]], 0.012), 'filled');
        drawUV(bandFromPolyline([[u, shaftBot], [u + 0.04, 0.88 - i * 0.03]], 0.012), 'filled');
    }

    drawUV(bandFromPolyline([[0.01, 0.32], [0.05, 0.50], [0.01, 0.68]], 0.015), 'filled');
    drawUV([[0.00, 0.35], [0.025, 0.35], [0.025, 0.65], [0.00, 0.65]], 'filled');

    drawUV([[0.30, 0.10 - bw], [0.58, 0.10 - bw], [0.58, 0.10 + bw], [0.30, 0.10 + bw]], 'filled');
    drawUV([[0.35, 0.06 - bw], [0.53, 0.06 - bw], [0.53, 0.06 + bw], [0.35, 0.06 + bw]], 'filled');
    drawUV([[0.25, 0.14 - bw], [0.55, 0.14 - bw], [0.55, 0.14 + bw], [0.25, 0.14 + bw]], 'filled');
    for (let i = 0; i < 5; i++) {
        const u = 0.30 + i * 0.06;
        drawUV(circlePoints(u, 0.03, 0.015, 6), 'filled');
    }
    for (let i = 0; i < 3; i++) {
        const cu = 0.35 + i * 0.08;
        drawUV([[cu, 0.18], [cu + 0.025, 0.24], [cu - 0.025, 0.24]], filled ? 'filled' : 'outline');
    }
    for (let i = 0; i < 6; i++) {
        const u = 0.20 + i * 0.07;
        drawUV([[u - bw, 0.28], [u + bw, 0.28], [u + bw, 0.34], [u - bw, 0.34]], 'filled');
    }

    drawUV([[0.30, 0.90 - bw], [0.58, 0.90 - bw], [0.58, 0.90 + bw], [0.30, 0.90 + bw]], 'filled');
    drawUV([[0.35, 0.94 - bw], [0.53, 0.94 - bw], [0.53, 0.94 + bw], [0.35, 0.94 + bw]], 'filled');
    drawUV([[0.25, 0.86 - bw], [0.55, 0.86 - bw], [0.55, 0.86 + bw], [0.25, 0.86 + bw]], 'filled');
    for (let i = 0; i < 5; i++) {
        const u = 0.30 + i * 0.06;
        drawUV(circlePoints(u, 0.97, 0.015, 6), 'filled');
    }
    for (let i = 0; i < 3; i++) {
        const cu = 0.35 + i * 0.08;
        drawUV([[cu, 0.82], [cu + 0.025, 0.76], [cu - 0.025, 0.76]], filled ? 'filled' : 'outline');
    }
    for (let i = 0; i < 6; i++) {
        const u = 0.20 + i * 0.07;
        drawUV([[u - bw, 0.66], [u + bw, 0.66], [u + bw, 0.72], [u - bw, 0.72]], 'filled');
    }

    for (let i = 0; i < 4; i++) {
        const u = 0.30 + i * 0.08;
        drawUV([[u, 0.46], [u + 0.02, 0.50], [u, 0.54], [u - 0.02, 0.50]], 'filled');
    }
}
