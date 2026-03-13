export type PathStyle = 'filled' | 'opaque-outline' | 'outline' | 'line';

export type DrawUV = (uvPoints: [number, number][], style: PathStyle) => void;

export interface PatternContext {
    drawUV: DrawUV;
    filled: boolean;
    baseStyle: PathStyle;
    rng?: () => number;
}

export interface PatternSet {
    name: string;
    count: number;
    draw: (type: number, ctx: PatternContext) => void;
}
