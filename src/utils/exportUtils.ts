import confetti from 'canvas-confetti';
import gifshot from 'gifshot';
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
    const plain = grid.map(r => r.map(c => c.char).join('')).join('\n');
    return copyPlainText(plain);
  }
}

// Helper: map hex color to closest Discord ANSI escape code
function getDiscordAnsiColor(hexColor?: string): number {
  if (!hexColor) return 37; // default white
  const c = hexColor.replace('#', '');
  const r = parseInt(c.slice(0, 2), 16) || 0;
  const g = parseInt(c.slice(2, 4), 16) || 0;
  const b = parseInt(c.slice(4, 6), 16) || 0;

  // Discord ANSI Palette reference points:
  // 30: Dark Gray, 31: Red, 32: Green, 33: Yellow/Gold, 34: Blue, 35: Pink/Magenta, 36: Cyan, 37: White
  const ansiPalette: { code: number; r: number; g: number; b: number }[] = [
    { code: 30, r: 79, g: 84, b: 92 },
    { code: 31, r: 237, g: 66, b: 69 },
    { code: 32, r: 87, g: 242, b: 135 },
    { code: 33, r: 254, g: 231, b: 92 },
    { code: 34, r: 88, g: 101, b: 242 },
    { code: 35, r: 235, g: 69, b: 158 },
    { code: 36, r: 59, g: 165, b: 92 },
    { code: 37, r: 255, g: 255, b: 255 }
  ];

  let bestCode = 37;
  let minDistance = Infinity;

  for (const p of ansiPalette) {
    const dist = Math.pow(r - p.r, 2) + Math.pow(g - p.g, 2) + Math.pow(b - p.b, 2);
    if (dist < minDistance) {
      minDistance = dist;
      bestCode = p.code;
    }
  }

  return bestCode;
}

// Generate Discord ANSI formatted codeblock
export function generateDiscordAnsi(grid: AsciiCell[][]): string {
  let result = '```ansi\n';

  for (const row of grid) {
    let currentAnsi = -1;
    for (const cell of row) {
      if (cell.char === ' ') {
        result += ' ';
        continue;
      }
      const ansiCode = getDiscordAnsiColor(cell.color);
      if (ansiCode !== currentAnsi) {
        result += `\u001b[0;${ansiCode}m`;
        currentAnsi = ansiCode;
      }
      result += cell.char;
    }
    if (currentAnsi !== -1) {
      result += '\u001b[0m';
    }
    result += '\n';
  }

  result += '```';
  return result;
}

// Copy Discord ANSI to clipboard
export async function copyDiscordAnsi(grid: AsciiCell[][]): Promise<boolean> {
  const ansiText = generateDiscordAnsi(grid);
  const ok = await copyPlainText(ansiText);
  if (ok) fireConfetti();
  return ok;
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

// Render Grid to Canvas for PNG / WebP / Frame export
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
      } else if (effect === 'shadow') {
        ctx.fillStyle = 'rgba(0,0,0,0.9)';
        ctx.fillText(cell.char, x + 4, y + 4);
      } else if (effect === 'chroma') {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.7)';
        ctx.fillText(cell.char, x - 2, y);
        ctx.fillStyle = 'rgba(6, 182, 212, 0.7)';
        ctx.fillText(cell.char, x + 2, y);
      } else if (effect === 'fire') {
        ctx.shadowColor = '#ff6600';
        ctx.shadowBlur = 10;
        ctx.fillStyle = 'rgba(255, 60, 0, 0.8)';
        ctx.fillText(cell.char, x, y - 2);
      } else if (effect === 'outline') {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.strokeText(cell.char, x, y);
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

// Record Animated WebM Video Clip
export async function recordWebmVideo(
  getFrameGrid: () => AsciiCell[][],
  durationMs = 3000,
  options?: { effect?: EffectType; glow?: GlowColor },
  onProgress?: (progress: number) => void
): Promise<void> {
  const initialCanvas = renderGridToCanvas(getFrameGrid(), options);
  const canvas = document.createElement('canvas');
  canvas.width = initialCanvas.width;
  canvas.height = initialCanvas.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const stream = canvas.captureStream(30);
  const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
  const chunks: Blob[] = [];

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  const startTime = Date.now();

  const renderInterval = setInterval(() => {
    const frame = renderGridToCanvas(getFrameGrid(), options);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(frame, 0, 0);

    const elapsed = Date.now() - startTime;
    if (onProgress) {
      onProgress(Math.min(1, elapsed / durationMs));
    }
  }, 1000 / 30);

  mediaRecorder.start();

  await new Promise<void>((resolve) => {
    setTimeout(() => {
      clearInterval(renderInterval);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'asciicraft-animation.webm';
        a.click();
        URL.revokeObjectURL(url);
        fireConfetti();
        resolve();
      };
      mediaRecorder.stop();
    }, durationMs);
  });
}

// Export Animated GIF using gifshot
export async function exportAnimatedGif(
  getFrameGrid: () => AsciiCell[][],
  frameCount = 16,
  frameInterval = 0.1,
  options?: { effect?: EffectType; glow?: GlowColor },
  onProgress?: (percent: number) => void
): Promise<void> {
  const frames: string[] = [];

  for (let i = 0; i < frameCount; i++) {
    const canvas = renderGridToCanvas(getFrameGrid(), options);
    frames.push(canvas.toDataURL('image/png'));
    if (onProgress) {
      onProgress(Math.round(((i + 1) / frameCount) * 50));
    }
    await new Promise((r) => setTimeout(r, 60));
  }

  return new Promise((resolve, reject) => {
    gifshot.createGIF(
      {
        images: frames,
        interval: frameInterval,
        numFrames: frameCount,
        gifWidth: 480,
        gifHeight: 320,
        sampleInterval: 10
      },
      (obj) => {
        if (!obj.error) {
          const a = document.createElement('a');
          a.href = obj.image;
          a.download = 'asciicraft-animation.gif';
          a.click();
          fireConfetti();
          if (onProgress) onProgress(100);
          resolve();
        } else {
          reject(new Error(obj.errorMsg || 'Failed to generate GIF'));
        }
      }
    );
  });
}
