import confetti from 'canvas-confetti';
import type { AsciiCell, EffectType, GlowColor } from '../types';

export function fireConfetti() {
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#f5a623', '#3ee087', '#f43f8e', '#06b6d4']
    });
  } catch {
    // ignore
  }
}

// Copy Plain Text
export async function copyPlainText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    fireConfetti();
    return true;
  } catch {
    return false;
  }
}

// Generate styled HTML string
export function generateStyledHtml(
  grid: AsciiCell[][],
  backgroundColor = '#0e1310'
): string {
  let html = `<pre style="background: ${backgroundColor}; color: #ffffff; font-family: 'Courier New', monospace; font-size: 14px; line-height: 1.1; padding: 20px; border-radius: 8px; display: inline-block;">\n`;

  for (const row of grid) {
    for (const cell of row) {
      if (!cell.color || cell.char === ' ') {
        html += cell.char;
      } else {
        html += `<span style="color: ${cell.color};">${cell.char}</span>`;
      }
    }
    html += '\n';
  }

  html += '</pre>';
  return html;
}

// Copy Styled HTML to clipboard
export async function copyHtml(grid: AsciiCell[][]): Promise<boolean> {
  try {
    const html = generateStyledHtml(grid);
    const blob = new Blob([html], { type: 'text/html' });
    const textBlob = new Blob([grid.map(r => r.map(c => c.char).join('')).join('\n')], { type: 'text/plain' });

    await navigator.clipboard.write([
      new ClipboardItem({
        'text/html': blob,
        'text/plain': textBlob
      })
    ]);
    fireConfetti();
    return true;
  } catch {
    // Fallback to text copy
    const plain = grid.map(r => r.map(c => c.char).join('')).join('\n');
    return copyPlainText(plain);
  }
}

// Download Plain Text File
export function downloadTextFile(text: string, filename = 'asciicraft-art.txt') {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  fireConfetti();
}

// Render Grid to Canvas for PNG / WebP export
export function renderGridToCanvas(
  grid: AsciiCell[][],
  options: {
    effect?: EffectType;
    glow?: GlowColor;
    backgroundColor?: string;
    fontSize?: number;
  } = {}
): HTMLCanvasElement {
  const {
    effect = 'none',
    glow = 'none',
    backgroundColor = '#0e1310',
    fontSize = 14
  } = options;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const rows = grid.length;
  const cols = Math.max(...grid.map(r => r.length), 1);

  const charWidth = fontSize * 0.62;
  const lineHeight = fontSize * 1.15;
  const padding = 24;

  canvas.width = Math.round(cols * charWidth + padding * 2);
  canvas.height = Math.round(rows * lineHeight + padding * 2);

  // Draw background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = `bold ${fontSize}px "JetBrains Mono", "Courier New", monospace`;
  ctx.textBaseline = 'top';

  const glowColorMap: Record<GlowColor, string> = {
    'none': 'transparent',
    'neon pink': '#f43f8e',
    'cyan': '#06b6d4',
    'green': '#3ee087',
    'gold': '#f5a623',
    'violet': '#a855f7',
    'white': '#ffffff'
  };

  const glowColorVal = glowColorMap[glow] || 'transparent';

  for (let r = 0; r < rows; r++) {
    const row = grid[r];
    for (let c = 0; c < row.length; c++) {
      const cell = row[c];
      if (cell.char === ' ') continue;

      const x = padding + c * charWidth;
      const y = padding + r * lineHeight;

      ctx.save();

      // Glow effect
      if (glow !== 'none') {
        ctx.shadowColor = glowColorVal;
        ctx.shadowBlur = 12;
      }

      // 3D effect shadow
      if (effect === '3d') {
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillText(cell.char, x + 2, y + 2);
        ctx.fillText(cell.char, x + 3, y + 3);
      } else if (effect === 'emboss') {
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fillText(cell.char, x - 1, y - 1);
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillText(cell.char, x + 1, y + 1);
      }

      ctx.fillStyle = cell.color || '#3ee087';
      ctx.fillText(cell.char, x, y);

      ctx.restore();
    }
  }

  return canvas;
}

// Download PNG Image
export function downloadPng(
  grid: AsciiCell[][],
  filename = 'asciicraft.png',
  options?: { effect?: EffectType; glow?: GlowColor }
) {
  const canvas = renderGridToCanvas(grid, options || {});
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  fireConfetti();
}

// Download WebP Image
export function downloadWebP(
  grid: AsciiCell[][],
  filename = 'asciicraft.webp',
  options?: { effect?: EffectType; glow?: GlowColor }
) {
  const canvas = renderGridToCanvas(grid, options || {});
  const url = canvas.toDataURL('image/webp', 0.95);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  fireConfetti();
}

// Download SVG Vector
export function downloadSvg(
  grid: AsciiCell[][],
  filename = 'asciicraft.svg'
) {
  const rows = grid.length;
  const cols = Math.max(...grid.map(r => r.length), 1);
  const fontSize = 14;
  const charWidth = fontSize * 0.62;
  const lineHeight = fontSize * 1.15;
  const padding = 20;

  const width = Math.round(cols * charWidth + padding * 2);
  const height = Math.round(rows * lineHeight + padding * 2);

  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="#0e1310"/>
    <style>
      .t { font-family: "JetBrains Mono", monospace; font-size: ${fontSize}px; font-weight: bold; }
    </style>
  `;

  for (let r = 0; r < rows; r++) {
    const row = grid[r];
    for (let c = 0; c < row.length; c++) {
      const cell = row[c];
      if (cell.char === ' ') continue;
      const x = padding + c * charWidth;
      const y = padding + r * lineHeight + fontSize;
      const fill = cell.color || '#3ee087';
      // Escaping XML special chars
      const safeChar = cell.char === '&' ? '&amp;' : cell.char === '<' ? '&lt;' : cell.char === '>' ? '&gt;' : cell.char;
      svgContent += `<text x="${x}" y="${y}" fill="${fill}" class="t">${safeChar}</text>`;
    }
  }

  svgContent += '</svg>';

  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  fireConfetti();
}

