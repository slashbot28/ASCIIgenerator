import type { AsciiCell, CharsetName, ColorRGB, ColorTheme, GradientDirection } from '../types';

export const CHARSETS: Record<CharsetName, string> = {
  classic: ' .:-=+*#%@',
  detailed: ' `\'".:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$',
  blocks: ' ░▒▓█',
  braille: ' ⠁⠃⠇⡇⣇⣧⣷⣿',
  matrix: ' 01',
  binary: ' 01',
  hex: ' 0123456789ABCDEF',
  geometric: ' ·◇◆□■▲▼○●',
  math: ' ·÷×±≠≈∆∇∂√∫∑∏∞',
  slashes: ' `/|\\#',
  minimal: ' ·+#',
  custom: ' .:*#@'
};

export const COLOR_THEMES: Record<ColorTheme, string[]> = {
  rainbow: [
    '#ff3b30', '#ff9500', '#ffcc00', '#34c759', '#00c7be', '#30b0c7', '#32ade6', '#007aff', '#5856d6', '#af52de'
  ],
  synthwave: [
    '#f72585', '#b5179e', '#7209b7', '#560bad', '#480ca8', '#3a0ca3', '#3f37c9', '#4361ee', '#4895ef', '#4cc9f0'
  ],
  cyberpunk: [
    '#ffe600', '#00f0ff', '#ff003c', '#05d9e8', '#ff2a6d', '#01012b', '#d1f7ff'
  ],
  matrix: [
    '#003b00', '#008f11', '#00ff41', '#00ff66', '#a6ffb2', '#00ff41', '#008f11'
  ],
  sunset: [
    '#2b1055', '#75225b', '#b33951', '#e26d5c', '#ff9b71', '#ffc15e', '#ffe49e'
  ],
  fire: [
    '#2c0003', '#670008', '#990000', '#d82800', '#fe6000', '#ff9f00', '#ffff38'
  ],
  ice: [
    '#001a33', '#004080', '#0080ff', '#3399ff', '#66b2ff', '#99ccff', '#cce6ff', '#ffffff'
  ],
  toxic: [
    '#0b2900', '#1f5e00', '#399900', '#55d900', '#73ff00', '#a3ff4d', '#ccff99'
  ],
  neonPink: [
    '#4a0028', '#8a004b', '#cf0070', '#ff1493', '#ff69b4', '#ff85c2', '#ffc2e0'
  ],
  gold: [
    '#332200', '#664400', '#996600', '#cc8800', '#ffaa00', '#ffc233', '#ffdd80', '#fff5cc'
  ],
  monochrome: [
    '#111111', '#333333', '#555555', '#777777', '#999999', '#bbbbbb', '#dddddd', '#ffffff'
  ],
  hacker: [
    '#051f08', '#0d4715', '#167a25', '#24b338', '#3ef258', '#8aff9b'
  ],
  pastel: [
    '#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff', '#d0baff'
  ]
};

// Convert hex to RGB
export function hexToRgb(hex: string): ColorRGB {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  const num = parseInt(c, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

// Convert RGB to hex
export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  return '#' + [r, g, b].map(x => clamp(x).toString(16).padStart(2, '0')).join('');
}

// Interpolate between two hex colors
export function interpolateColor(color1: string, color2: string, factor: number): string {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  const r = c1.r + factor * (c2.r - c1.r);
  const g = c1.g + factor * (c2.g - c1.g);
  const b = c1.b + factor * (c2.b - c1.b);
  return rgbToHex(r, g, b);
}

// Get gradient color along a palette
export function getPaletteColor(palette: string[], progress: number): string {
  if (palette.length === 0) return '#ffffff';
  if (palette.length === 1) return palette[0];
  const p = Math.max(0, Math.min(1, progress));
  const segment = p * (palette.length - 1);
  const index = Math.floor(segment);
  const nextIndex = Math.min(index + 1, palette.length - 1);
  const factor = segment - index;
  return interpolateColor(palette[index], palette[nextIndex], factor);
}

// Calculate color based on theme and direction for a grid coordinate (col, row, totalCols, totalRows)
export function getThemeColorAt(
  theme: ColorTheme,
  direction: GradientDirection,
  col: number,
  row: number,
  totalCols: number,
  totalRows: number
): string {
  const palette = COLOR_THEMES[theme] || COLOR_THEMES.rainbow;
  let progress = 0;

  switch (direction) {
    case 'horizontal':
      progress = totalCols > 1 ? col / (totalCols - 1) : 0;
      break;
    case 'vertical':
      progress = totalRows > 1 ? row / (totalRows - 1) : 0;
      break;
    case 'diagonal':
      const maxDist = (totalCols - 1) + (totalRows - 1);
      progress = maxDist > 0 ? (col + row) / maxDist : 0;
      break;
    case 'radial': {
      const centerX = totalCols / 2;
      const centerY = totalRows / 2;
      const maxR = Math.sqrt(centerX * centerX + centerY * centerY);
      const dist = Math.sqrt(Math.pow(col - centerX, 2) + Math.pow(row - centerY, 2));
      progress = maxR > 0 ? dist / maxR : 0;
      break;
    }
  }

  return getPaletteColor(palette, progress);
}

// Convert plain text ASCII string into a grid of colored cells
export function colorizeAsciiText(
  asciiText: string,
  theme: ColorTheme,
  direction: GradientDirection
): AsciiCell[][] {
  const lines = asciiText.split('\n');
  const totalRows = lines.length;
  const totalCols = Math.max(...lines.map(l => l.length), 1);

  const grid: AsciiCell[][] = [];

  for (let r = 0; r < totalRows; r++) {
    const rowCells: AsciiCell[] = [];
    const line = lines[r];
    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      if (char === ' ') {
        rowCells.push({ char: ' ', color: undefined });
      } else {
        const color = getThemeColorAt(theme, direction, c, r, totalCols, totalRows);
        rowCells.push({ char, color });
      }
    }
    grid.push(rowCells);
  }

  return grid;
}

// Convert Image element or ImageData to ASCII Grid
export function processImageToAscii(
  img: HTMLImageElement | HTMLCanvasElement,
  options: {
    columns: number;
    charset: CharsetName;
    customCharset?: string;
    contrast: number; // -100 to 100
    brightness: number; // -100 to 100
    invert: boolean;
    dithering: boolean;
    colorMode: 'full' | 'mono' | 'theme';
    theme?: ColorTheme;
    direction?: GradientDirection;
    monoColor?: string;
  }
): { text: string; grid: AsciiCell[][] } {
  const {
    columns,
    charset,
    customCharset,
    contrast,
    brightness,
    invert,
    dithering,
    colorMode,
    theme = 'rainbow',
    direction = 'horizontal',
    monoColor = '#3ee087'
  } = options;

  const characters = charset === 'custom' && customCharset && customCharset.length > 0
    ? customCharset
    : CHARSETS[charset] || CHARSETS.classic;

  const charCount = characters.length;
  const aspectFontCorrection = 0.55;

  const imgWidth = img instanceof HTMLImageElement ? img.naturalWidth : img.width;
  const imgHeight = img instanceof HTMLImageElement ? img.naturalHeight : img.height;

  if (!imgWidth || !imgHeight) {
    return { text: '', grid: [] };
  }

  const cols = Math.max(10, Math.min(300, columns));
  const rows = Math.max(5, Math.round((imgHeight / imgWidth) * cols * aspectFontCorrection));

  const offscreen = document.createElement('canvas');
  offscreen.width = cols;
  offscreen.height = rows;
  const ctx = offscreen.getContext('2d', { willReadFrequently: true });
  if (!ctx) return { text: '', grid: [] };

  ctx.drawImage(img, 0, 0, cols, rows);
  const imageData = ctx.getImageData(0, 0, cols, rows);
  const data = imageData.data;

  const lumMatrix: number[][] = [];
  const rgbMatrix: ColorRGB[][] = [];

  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  const brightOffset = brightness * 1.5;

  for (let y = 0; y < rows; y++) {
    lumMatrix[y] = [];
    rgbMatrix[y] = [];
    for (let x = 0; x < cols; x++) {
      const idx = (y * cols + x) * 4;
      let r = data[idx];
      let g = data[idx + 1];
      let b = data[idx + 2];

      r = Math.min(255, Math.max(0, factor * (r - 128) + 128 + brightOffset));
      g = Math.min(255, Math.max(0, factor * (g - 128) + 128 + brightOffset));
      b = Math.min(255, Math.max(0, factor * (b - 128) + 128 + brightOffset));

      rgbMatrix[y][x] = { r, g, b };

      let lum = 0.299 * r + 0.587 * g + 0.114 * b;
      if (invert) {
        lum = 255 - lum;
      }
      lumMatrix[y][x] = lum;
    }
  }

  if (dithering) {
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const oldVal = lumMatrix[y][x];
        const stepSize = 255 / (charCount - 1);
        const quantized = Math.round(oldVal / stepSize) * stepSize;
        lumMatrix[y][x] = quantized;
        const err = oldVal - quantized;

        if (x + 1 < cols) lumMatrix[y][x + 1] += err * (7 / 16);
        if (y + 1 < rows && x - 1 >= 0) lumMatrix[y + 1][x - 1] += err * (3 / 16);
        if (y + 1 < rows) lumMatrix[y + 1][x] += err * (5 / 16);
        if (y + 1 < rows && x + 1 < cols) lumMatrix[y + 1][x + 1] += err * (1 / 16);
      }
    }
  }

  const grid: AsciiCell[][] = [];
  const textLines: string[] = [];

  for (let y = 0; y < rows; y++) {
    const rowCells: AsciiCell[] = [];
    let lineStr = '';

    for (let x = 0; x < cols; x++) {
      const lum = Math.max(0, Math.min(255, lumMatrix[y][x]));
      const charIndex = Math.floor((lum / 255) * (charCount - 1));
      const char = characters[charIndex] || ' ';
      lineStr += char;

      let cellColor: string;
      if (colorMode === 'full') {
        const rgb = rgbMatrix[y][x];
        cellColor = rgbToHex(rgb.r, rgb.g, rgb.b);
      } else if (colorMode === 'mono') {
        cellColor = monoColor;
      } else {
        cellColor = getThemeColorAt(theme, direction, x, y, cols, rows);
      }

      rowCells.push({
        char,
        color: char === ' ' ? undefined : cellColor
      });
    }

    grid.push(rowCells);
    textLines.push(lineStr);
  }

  return {
    text: textLines.join('\n'),
    grid
  };
}

