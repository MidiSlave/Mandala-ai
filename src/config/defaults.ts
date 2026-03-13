import type { AppConfig, ColorTheme } from './types';

export const DEFAULT_CONFIG: AppConfig = {
    symmetry: 12,
    layers: 12,
    spread: 70,
    roughness: 0,
    twist: 0,
    seed: 42,
    spinSpeed: 1,
    spinVariance: 0.8,
    waveSpeed: 1,
    zoomSpeed: 0.3,
    zoom: 0,
    mode: 'cultural'
};

export const TUNNEL_POWER = 2.5;

export function tunnelRadius(t: number, maxR: number): number {
    return maxR * Math.pow(Math.max(0, t), TUNNEL_POWER);
}

export const COLOR_THEMES: ColorTheme[] = [
    {
        name: 'Monochrome',
        background: '#EBE7E0',
        colors: ['#1A1818'],
        stroke: 'rgba(26, 24, 24, 0.9)',
        strokeLight: 'rgba(26, 24, 24, 0.6)',
        grain: 'rgba(0,0,0,0.03)',
        centerDark: '26, 24, 24',
    },
    {
        name: 'Pastel',
        background: '#FFF6E3',
        colors: ['#9B8A9E', '#7BA69E', '#C4889B', '#B08D57', '#6B7FA6'],
        stroke: 'rgba(100, 80, 100, 0.85)',
        strokeLight: 'rgba(100, 80, 100, 0.5)',
        grain: 'rgba(80,60,80,0.025)',
        centerDark: '100, 80, 100',
    },
    {
        name: 'Neon',
        background: '#070014',
        colors: ['#EA00D9', '#0ABDC6', '#39FF14', '#FF0055', '#FFD700'],
        stroke: 'rgba(255, 255, 255, 0.7)',
        strokeLight: 'rgba(255, 255, 255, 0.4)',
        grain: 'rgba(255,255,255,0.02)',
        centerDark: '200, 0, 200',
    },
    {
        name: 'Sepia',
        background: '#FDFBD4',
        colors: ['#704214', '#8B4513', '#A2574F', '#5C3A1E', '#8E6B3D'],
        stroke: 'rgba(80, 48, 16, 0.85)',
        strokeLight: 'rgba(80, 48, 16, 0.5)',
        grain: 'rgba(80,48,16,0.025)',
        centerDark: '80, 48, 16',
    },
    {
        name: 'Sunset',
        background: '#272344',
        colors: ['#FA9C32', '#C2435F', '#E44C1D', '#FFD166', '#5E508D'],
        stroke: 'rgba(250, 200, 150, 0.7)',
        strokeLight: 'rgba(250, 200, 150, 0.4)',
        grain: 'rgba(255,200,100,0.02)',
        centerDark: '200, 100, 50',
    },
    {
        name: 'Ocean',
        background: '#0A1628',
        colors: ['#457F9A', '#084596', '#1CA9C9', '#3B5F7F', '#FCC40F'],
        stroke: 'rgba(100, 180, 220, 0.7)',
        strokeLight: 'rgba(100, 180, 220, 0.4)',
        grain: 'rgba(100,180,220,0.02)',
        centerDark: '50, 100, 150',
    },
    {
        name: 'Forest',
        background: '#1A2E1A',
        colors: ['#8A9A5B', '#2E6F40', '#B7410E', '#B2C495', '#6B8E23'],
        stroke: 'rgba(150, 180, 100, 0.7)',
        strokeLight: 'rgba(150, 180, 100, 0.4)',
        grain: 'rgba(100,150,80,0.02)',
        centerDark: '40, 80, 40',
    },
    {
        name: 'Royal',
        background: '#0D1B2A',
        colors: ['#CFB53B', '#B87333', '#F7E7CE', '#8B7536', '#D4AF37'],
        stroke: 'rgba(200, 180, 60, 0.7)',
        strokeLight: 'rgba(200, 180, 60, 0.4)',
        grain: 'rgba(200,180,60,0.02)',
        centerDark: '160, 140, 40',
    },
    {
        name: 'Vaporwave',
        background: '#1A0A2E',
        colors: ['#FF6EC7', '#00E5FF', '#C4A1FF', '#FFB6C1', '#7B68EE'],
        stroke: 'rgba(255, 110, 199, 0.7)',
        strokeLight: 'rgba(255, 110, 199, 0.4)',
        grain: 'rgba(200,100,255,0.02)',
        centerDark: '150, 50, 200',
    },
    {
        name: 'Terracotta',
        background: '#F5E6D3',
        colors: ['#C75B39', '#3F4FA1', '#D4A843', '#8B3A2F', '#1E2456'],
        stroke: 'rgba(140, 60, 40, 0.85)',
        strokeLight: 'rgba(140, 60, 40, 0.5)',
        grain: 'rgba(100,50,30,0.025)',
        centerDark: '140, 60, 40',
    },
];
