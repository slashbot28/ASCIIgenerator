import confetti from 'canvas-confetti';
import gifshot from 'gifshot';
import type { AsciiCell, EffectType, GlowColor, MotionType } from '../types';

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

// Generate Standalone Animated HTML Document
export function generateAnimatedHtmlDocument(
  grid: AsciiCell[][],
  options: {
    motionType?: MotionType;
    motionSpeed?: number;
    effect?: EffectType;
    glow?: GlowColor;
    title?: string;
  } = {}
): string {
  const {
    motionType = 'orbit',
    motionSpeed = 1,
    effect = 'chroma',
    glow = 'neon pink',
    title = 'ASCIICraft Demo'
  } = options;

  const glowStyles: Record<GlowColor, string> = {
    'none': '',
    'neon pink': 'text-shadow: 0 0 10px rgba(244, 63, 142, 0.8), 0 0 25px rgba(244, 63, 142, 0.4);',
    'cyan': 'text-shadow: 0 0 10px rgba(6, 182, 212, 0.8), 0 0 25px rgba(6, 182, 212, 0.4);',
    'green': 'text-shadow: 0 0 10px rgba(62, 224, 135, 0.8), 0 0 25px rgba(62, 224, 135, 0.4);',
    'gold': 'text-shadow: 0 0 10px rgba(245, 166, 35, 0.8), 0 0 25px rgba(245, 166, 35, 0.4);',
    'violet': 'text-shadow: 0 0 10px rgba(168, 85, 247, 0.8), 0 0 25px rgba(168, 85, 247, 0.4);',
    'white': 'text-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.3);'
  };

  const effectCss: Record<EffectType, string> = {
    'none': '',
    '3d': 'text-shadow: 1px 1px 0px rgba(0,0,0,0.8), 2px 2px 0px rgba(0,0,0,0.7), 3px 3px 0px rgba(0,0,0,0.6), 4px 4px 6px rgba(0,0,0,0.9);',
    'glow': 'filter: drop-shadow(0 0 8px currentColor);',
    'glitch': 'filter: contrast(150%) hue-rotate(90deg);',
    'emboss': 'text-shadow: -1px -1px 1px rgba(255,255,255,0.3), 1px 1px 1px rgba(0,0,0,0.8);',
    'shadow': 'text-shadow: 3px 3px 6px rgba(0,0,0,0.9), 5px 5px 12px rgba(0,0,0,0.8);',
    'hologram': 'text-shadow: 0 0 8px rgba(6, 182, 212, 0.8), 0 0 16px rgba(6, 182, 212, 0.4); letter-spacing: 1px;',
    'fire': 'text-shadow: 0 -2px 4px #ffcc00, 0 -4px 8px #ff6600, 0 -8px 12px #cc0000;',
    'chroma': 'text-shadow: -2px 0 0 rgba(239, 68, 68, 0.85), 2px 0 0 rgba(6, 182, 212, 0.85);',
    'outline': 'text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;'
  };

  const animDuration = (4 / Math.max(0.2, motionSpeed)).toFixed(2);

  // Generate ASCII pre content
  let bodyContent = '';
  for (const row of grid) {
    for (const cell of row) {
      if (cell.char === ' ') {
        bodyContent += ' ';
      } else {
        bodyContent += `<span style="color:${cell.color || '#3ee087'}">${cell.char}</span>`;
      }
    }
    bodyContent += '\n';
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | ASCIICraft Studio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0e1310;
      color: #c7d5c5;
      font-family: 'JetBrains Mono', monospace;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;
    }
    
    /* CRT Scanlines */
    body::after {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
                  linear-gradient(90deg, rgba(255,0,0,0.03), rgba(0,255,0,0.01), rgba(0,0,255,0.03));
      background-size: 100% 2px, 3px 100%;
      pointer-events: none;
      z-index: 10;
    }

    .viewport {
      display: flex;
      align-items: center;
      justify-content: center;
      perspective: 900px;
      padding: 40px;
      width: 100%;
      height: 85vh;
    }

    pre.ascii-art {
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      line-height: 1.15;
      font-weight: 700;
      white-space: pre;
      user-select: text;
      transition: transform 0.1s linear;
      ${glowStyles[glow] || ''}
      ${effectCss[effect] || ''}
    }

    /* Motion Animations */
    @keyframes ascii-float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      25% { transform: translateY(-16px) rotate(-1.5deg); }
      75% { transform: translateY(12px) rotate(1.5deg); }
    }

    @keyframes ascii-rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes ascii-zoom-pulse {
      0%, 100% { transform: scale(0.85); }
      50% { transform: scale(1.22); }
    }

    @keyframes ascii-orbit {
      0% { transform: perspective(900px) rotateX(18deg) rotateY(0deg) scale(0.92); }
      50% { transform: perspective(900px) rotateX(-18deg) rotateY(180deg) scale(1.15); }
      100% { transform: perspective(900px) rotateX(18deg) rotateY(360deg) scale(0.92); }
    }

    @keyframes ascii-hyperspace {
      0% { transform: scale(0.35) rotate(-6deg); opacity: 0.5; }
      50% { transform: scale(1.35) rotate(6deg); opacity: 1; }
      100% { transform: scale(0.35) rotate(-6deg); opacity: 0.5; }
    }

    .motion-float { animation: ascii-float ${animDuration}s ease-in-out infinite; }
    .motion-rotate { animation: ascii-rotate ${animDuration}s linear infinite; }
    .motion-zoom-pulse { animation: ascii-zoom-pulse ${animDuration}s ease-in-out infinite; }
    .motion-orbit { animation: ascii-orbit ${animDuration}s ease-in-out infinite; transform-style: preserve-3d; }
    .motion-hyperspace { animation: ascii-hyperspace ${animDuration}s cubic-bezier(0.4, 0, 0.2, 1) infinite; }

    .paused { animation-play-state: paused !important; }

    /* Control Bar */
    .controls {
      position: fixed;
      bottom: 20px;
      background: rgba(19, 25, 20, 0.85);
      backdrop-filter: blur(8px);
      border: 1px solid #27372b;
      border-radius: 9999px;
      padding: 6px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 20;
      font-size: 12px;
      color: #9bb0a0;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }

    .controls button {
      background: #162018;
      border: 1px solid #2d402f;
      color: #e6f2e4;
      font-family: inherit;
      font-size: 11px;
      padding: 5px 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .controls button:hover {
      background: #223325;
      border-color: #f5a623;
      color: #f5a623;
    }

    .branding {
      color: #f5a623;
      font-weight: 700;
      letter-spacing: 1px;
    }
  </style>
</head>
<body>
  <div class="viewport">
    <pre id="art" class="ascii-art ${motionType !== 'none' ? `motion-${motionType}` : ''}">${bodyContent}</pre>
  </div>

  <div class="controls">
    <span class="branding">⌘ ASCIICRAFT</span>
    <button id="toggleBtn" onclick="togglePlay()">⏸ Pauzeer</button>
    <button onclick="setSpeed(0.5)">0.5x</button>
    <button onclick="setSpeed(1.0)">1.0x</button>
    <button onclick="setSpeed(1.8)">1.8x</button>
    <button onclick="document.documentElement.requestFullscreen()">⛶ Fullscreen</button>
  </div>

  <script>
    const art = document.getElementById('art');
    const toggleBtn = document.getElementById('toggleBtn');
    let isPlaying = true;

    function togglePlay() {
      isPlaying = !isPlaying;
      art.classList.toggle('paused', !isPlaying);
      toggleBtn.innerText = isPlaying ? '⏸ Pauzeer' : '▶ Afspelen';
    }

    function setSpeed(multiplier) {
      const baseSec = ${animDuration};
      const newSec = (baseSec / multiplier).toFixed(2);
      art.style.animationDuration = newSec + 's';
    }
  </script>
</body>
</html>`;
}

// Download Standalone Animated HTML File
export function downloadAnimatedHtml(
  grid: AsciiCell[][],
  options: {
    motionType?: MotionType;
    motionSpeed?: number;
    effect?: EffectType;
    glow?: GlowColor;
    title?: string;
  } = {},
  filename = 'asciicraft-demo.html'
) {
  const htmlContent = generateAnimatedHtmlDocument(grid, options);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  fireConfetti();
}

