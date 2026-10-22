export type ConverterMode = 
  | 'converter'
  | 'image'
  | 'video'
  | 'gif'
  | 'text'
  | '3d'
  | 'audio'
  | 'qr'
  | 'paint';

export type TextTab = 'text' | 'font' | 'layout' | 'style' | 'animate';

export type ColorTheme = 
  | 'rainbow'
  | 'synthwave'
  | 'cyberpunk'
  | 'matrix'
  | 'sunset'
  | 'fire'
  | 'ice'
  | 'toxic'
  | 'neonPink'
  | 'gold'
  | 'monochrome'
  | 'hacker'
  | 'pastel';

export type GradientDirection = 'horizontal' | 'vertical' | 'diagonal' | 'radial';

export type EffectType = 'none' | '3d' | 'glow' | 'glitch' | 'emboss' | 'shadow';

export type GlowColor = 'none' | 'neon pink' | 'cyan' | 'green' | 'gold' | 'violet' | 'white';

export type CharsetName = 
  | 'classic'
  | 'detailed'
  | 'blocks'
  | 'braille'
  | 'matrix'
  | 'binary'
  | 'hex'
  | 'geometric'
  | 'math'
  | 'slashes'
  | 'minimal'
  | 'custom';

export type Shape3D = 'torus' | 'cube' | 'sphere' | 'pyramid' | 'dna';

export interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

export interface AsciiCell {
  char: string;
  color?: string; // hex or rgb
  glow?: string;
}

export interface AppState {
  mode: ConverterMode;
  lang: 'nl' | 'en';
  theme: 'dark' | 'light';
  
  // Text Mode state
  text: string;
  textTab: TextTab;
  font: string;
  letterSpacing: number;
  lineHeight: number;
  textAlign: 'left' | 'center' | 'right';
  animation: 'none' | 'rainbow-cycle' | 'wave' | 'pulse' | 'matrix-rain' | 'glitch';
  
  // Quick Ribbon state
  colorTheme: ColorTheme;
  direction: GradientDirection;
  effect: EffectType;
  glow: GlowColor;
  
  // Image / Video state
  imageUrl: string | null;
  videoUrl: string | null;
  charset: CharsetName;
  customCharset: string;
  columns: number;
  contrast: number;
  brightness: number;
  invert: boolean;
  dithering: boolean;
  colorMode: 'full' | 'mono' | 'theme';
  monoColor: string;
  
  // Video specific
  isPlaying: boolean;
  fps: number;
  loop: boolean;
  
  // 3D state
  shape3D: Shape3D;
  rotationSpeed: number;
  zoom3D: number;
  wireframe3D: boolean;
  autoSpin3D: boolean;
  
  // Audio state
  audioActive: boolean;
  audioSensitivity: number;
  audioBars: number;
  audioStyle: 'bars' | 'wave' | 'matrix';
  
  // Radio Pixel
  radioPlaying: boolean;
  radioVolume: number;
  
  // Tokens & Premium
  tokens: number;

  // QR Code Mode state
  qrText: string;

  // ASCII Paint Mode state
  paintTool: 'brush' | 'eraser' | 'fill';
  paintChar: string;
  paintColor: string;
  paintGrid: AsciiCell[][];
}
