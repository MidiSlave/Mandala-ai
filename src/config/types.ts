export interface ColorTheme {
    name: string;
    background: string;
    colors: string[];
    stroke: string;
    strokeLight: string;
    grain: string;
    centerDark: string;
}

export type PatternMode = 'cultural' | 'generative';

export interface AppConfig {
    symmetry: number;
    layers: number;
    spread: number;
    roughness: number;
    twist: number;
    seed: number;
    spinSpeed: number;
    spinVariance: number;
    waveSpeed: number;
    zoomSpeed: number;
    zoom: number;
    mode: PatternMode;
}
