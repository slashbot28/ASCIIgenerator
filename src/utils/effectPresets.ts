import type { EffectPreset } from '../types';

export const DEMO_PRESETS: EffectPreset[] = [
  {
    id: 'cyber-synthwave',
    name: 'Cyber Synthwave',
    desc: '3D Orbitering, Neon Pink Glow & Chroma Glitch',
    icon: '🔮',
    colorTheme: 'synthwave',
    direction: 'horizontal',
    effect: 'chroma',
    glow: 'neon pink',
    motionType: 'orbit',
    motionSpeed: 1.2,
    animation: 'rainbow-cycle',
    font: 'slant'
  },
  {
    id: 'matrix-float',
    name: 'Matrix Cyber Float',
    desc: 'Zwevende beweging, Hologram scanlines & Matrix Rain',
    icon: '🟩',
    colorTheme: 'matrix',
    direction: 'vertical',
    effect: 'hologram',
    glow: 'green',
    motionType: 'float',
    motionSpeed: 1.0,
    animation: 'matrix-rain',
    font: 'standard'
  },
  {
    id: 'retro-supernova',
    name: 'Retro Supernova',
    desc: 'Volledige 360° rotatie, 3D extrusie & Regenboog',
    icon: '🌈',
    colorTheme: 'rainbow',
    direction: 'diagonal',
    effect: '3d',
    glow: 'gold',
    motionType: 'rotate',
    motionSpeed: 1.5,
    animation: 'pulse',
    font: 'bubble'
  },
  {
    id: 'deep-space-voyager',
    name: 'Deep Space Voyager',
    desc: 'Hyperspace in/uitzoomen, Diepe schaduw & Cyaan gloed',
    icon: '🚀',
    colorTheme: 'ice',
    direction: 'radial',
    effect: 'shadow',
    glow: 'cyan',
    motionType: 'hyperspace',
    motionSpeed: 0.8,
    animation: 'wave',
    font: 'isometric'
  },
  {
    id: 'inferno-overdrive',
    name: 'Inferno Overdrive',
    desc: 'Pulsar zoomstoten, Vlammende gloed & Fire gradient',
    icon: '🔥',
    colorTheme: 'fire',
    direction: 'vertical',
    effect: 'fire',
    glow: 'gold',
    motionType: 'zoom-pulse',
    motionSpeed: 1.8,
    animation: 'pulse',
    font: 'doom'
  }
];
