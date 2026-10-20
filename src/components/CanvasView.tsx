import React, { useState, useRef } from 'react';
import { 
  Copy, 
  Code, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  FileText,
  Sparkles,
  Share2
} from 'lucide-react';
import type { 
  AppState, 
  ColorTheme, 
  GradientDirection, 
  EffectType, 
  GlowColor, 
  AsciiCell 
} from '../types';
import { 
  copyPlainText, 
  copyHtml, 
  downloadPng, 
  downloadWebP, 
  downloadSvg, 
  downloadTextFile 
} from '../utils/exportUtils';

interface CanvasViewProps {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  asciiGrid: AsciiCell[][];
  rawAsciiText: string;
  onOpenPricing: () => void;
}

export const CanvasView: React.FC<CanvasViewProps> = ({
  state,
  updateState,
  asciiGrid,
  rawAsciiText,
  onOpenPricing
}) => {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [canvasZoom, setCanvasZoom] = useState(1);
  const [showMoreExport, setShowMoreExport] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Available options for quick ribbon
  const THEMES: ColorTheme[] = [
    'rainbow', 'synthwave', 'cyberpunk', 'matrix', 'sunset', 'fire', 'ice', 'toxic', 'neonPink', 'gold', 'monochrome', 'hacker', 'pastel'
  ];
  const DIRECTIONS: GradientDirection[] = ['horizontal', 'vertical', 'diagonal', 'radial'];
  const EFFECTS: EffectType[] = ['none', '3d', 'glow', 'glitch', 'emboss', 'shadow'];
  const GLOWS: GlowColor[] = ['none', 'neon pink', 'cyan', 'green', 'gold', 'violet', 'white'];

  const cyclePrev = <T,>(arr: T[], current: T, setter: (val: T) => void) => {
    const idx = arr.indexOf(current);
    const nextIdx = (idx - 1 + arr.length) % arr.length;
    setter(arr[nextIdx]);
  };

  const cycleNext = <T,>(arr: T[], current: T, setter: (val: T) => void) => {
    const idx = arr.indexOf(current);
    const nextIdx = (idx + 1) % arr.length;
    setter(arr[nextIdx]);
  };

  const handleCopyText = async () => {
    const ok = await copyPlainText(rawAsciiText);
    if (ok) {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  const handleCopyHtml = async () => {
    const ok = await copyHtml(asciiGrid);
    if (ok) {
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    }
  };

  const handleDownloadPng = () => {
    downloadPng(asciiGrid, `asciicraft-${state.mode}.png`, {
      effect: state.effect,
      glow: state.glow
    });
  };

  const handleDownloadWebP = () => {
    downloadWebP(asciiGrid, `asciicraft-${state.mode}.webp`, {
      effect: state.effect,
      glow: state.glow
    });
  };

  const handleDownloadSvg = () => {
    downloadSvg(asciiGrid, `asciicraft-${state.mode}.svg`);
  };

  const handleDownloadTxt = () => {
    downloadTextFile(rawAsciiText, `asciicraft-${state.mode}.txt`);
  };

  // Determine glow class or CSS style
  const getGlowStyle = (): React.CSSProperties => {
    switch (state.glow) {
      case 'neon pink':
        return { textShadow: '0 0 10px rgba(244, 63, 142, 0.8), 0 0 25px rgba(244, 63, 142, 0.4)' };
      case 'cyan':
        return { textShadow: '0 0 10px rgba(6, 182, 212, 0.8), 0 0 25px rgba(6, 182, 212, 0.4)' };
      case 'green':
        return { textShadow: '0 0 10px rgba(62, 224, 135, 0.8), 0 0 25px rgba(62, 224, 135, 0.4)' };
      case 'gold':
        return { textShadow: '0 0 10px rgba(245, 166, 35, 0.8), 0 0 25px rgba(245, 166, 35, 0.4)' };
      case 'violet':
        return { textShadow: '0 0 10px rgba(168, 85, 247, 0.8), 0 0 25px rgba(168, 85, 247, 0.4)' };
      case 'white':
        return { textShadow: '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.3)' };
      default:
        return {};
    }
  };

  const getEffectClass = (): string => {
    if (state.effect === '3d') return 'effect-3d';
    if (state.effect === 'emboss') return 'effect-emboss';
    return '';
  };

  return (
    <main className="flex-1 flex flex-col h-full bg-[#0b0f0c] overflow-hidden relative">
      {/* Top Floating Controls & Action Buttons (Screenshot 2 style) */}
      <div className="w-full bg-[#111712] border-b border-[#212f24] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 select-none z-10">
        {/* Ribbon Selectors with < > chevrons */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* THEMA */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-[10px] text-[#f43f8e] uppercase tracking-wider font-semibold">THEMA</span>
            <div className="flex items-center bg-[#162018] border border-[#28382a] rounded px-1 py-0.5">
              <button 
                onClick={() => cyclePrev(THEMES, state.colorTheme, (t) => updateState({ colorTheme: t }))}
                className="p-1 hover:text-[#f5a623] text-[#7d9382]"
              >
                <ChevronLeft size={13} />
              </button>
              <span className="px-2 text-[#e6f2e4] text-xs font-medium min-w-[70px] text-center">
                {state.colorTheme}
              </span>
              <button 
                onClick={() => cycleNext(THEMES, state.colorTheme, (t) => updateState({ colorTheme: t }))}
                className="p-1 hover:text-[#f5a623] text-[#7d9382]"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>

          {/* RICHTING */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-[10px] text-[#06b6d4] uppercase tracking-wider font-semibold">RICHTING</span>
            <div className="flex items-center bg-[#162018] border border-[#28382a] rounded px-1 py-0.5">
              <button 
                onClick={() => cyclePrev(DIRECTIONS, state.direction, (d) => updateState({ direction: d }))}
                className="p-1 hover:text-[#f5a623] text-[#7d9382]"
              >
                <ChevronLeft size={13} />
              </button>
              <span className="px-2 text-[#e6f2e4] text-xs font-medium min-w-[75px] text-center">
                {state.direction}
              </span>
              <button 
                onClick={() => cycleNext(DIRECTIONS, state.direction, (d) => updateState({ direction: d }))}
                className="p-1 hover:text-[#f5a623] text-[#7d9382]"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>

          {/* EFFECT */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-[10px] text-[#f5a623] uppercase tracking-wider font-semibold">EFFECT</span>
            <div className="flex items-center bg-[#162018] border border-[#28382a] rounded px-1 py-0.5">
              <button 
                onClick={() => cyclePrev(EFFECTS, state.effect, (e) => updateState({ effect: e }))}
                className="p-1 hover:text-[#f5a623] text-[#7d9382]"
              >
                <ChevronLeft size={13} />
              </button>
              <span className="px-2 text-[#e6f2e4] text-xs font-medium min-w-[55px] text-center">
                {state.effect}
              </span>
              <button 
                onClick={() => cycleNext(EFFECTS, state.effect, (e) => updateState({ effect: e }))}
                className="p-1 hover:text-[#f5a623] text-[#7d9382]"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>

          {/* GLOED */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-[10px] text-[#3ee087] uppercase tracking-wider font-semibold">GLOED</span>
            <div className="flex items-center bg-[#162018] border border-[#28382a] rounded px-1 py-0.5">
              <button 
                onClick={() => cyclePrev(GLOWS, state.glow, (g) => updateState({ glow: g }))}
                className="p-1 hover:text-[#f5a623] text-[#7d9382]"
              >
                <ChevronLeft size={13} />
              </button>
              <span className="px-2 text-[#e6f2e4] text-xs font-medium min-w-[75px] text-center">
                {state.glow}
              </span>
              <button 
                onClick={() => cycleNext(GLOWS, state.glow, (g) => updateState({ glow: g }))}
                className="p-1 hover:text-[#f5a623] text-[#7d9382]"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons: Kopieer, HTML kopiëren, PNG, WebP */}
        <div className="flex items-center gap-2">
          {/* Kopieer text */}
          <button 
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#162018] hover:bg-[#1d2b1f] border border-[#2b3d2d] text-xs font-mono text-[#d8e6d7] transition-all hover:border-[#3ee087]"
            title="Kopieer als platte tekst"
          >
            {copiedText ? <Check size={13} className="text-[#3ee087]" /> : <Copy size={13} className="text-[#9bb0a0]" />}
            <span>{copiedText ? 'Gekopieerd!' : 'Kopieer'}</span>
          </button>

          {/* HTML kopiëren */}
          <button 
            onClick={handleCopyHtml}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#162018] hover:bg-[#1d2b1f] border border-[#2b3d2d] text-xs font-mono text-[#d8e6d7] transition-all hover:border-[#06b6d4]"
            title="Kopieer gekleurde HTML code"
          >
            {copiedHtml ? <Check size={13} className="text-[#06b6d4]" /> : <Code size={13} className="text-[#9bb0a0]" />}
            <span>{copiedHtml ? 'HTML Klaar!' : 'HTML kopiëren'}</span>
          </button>

          {/* PNG Download */}
          <button 
            onClick={handleDownloadPng}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#18231a] hover:bg-[#202e23] border border-[#2b3d2d] text-xs font-mono text-[#d8e6d7] transition-all hover:border-[#f5a623]"
          >
            <Download size={13} className="text-[#f5a623]" />
            <span>PNG</span>
          </button>

          {/* WebP Download */}
          <button 
            onClick={handleDownloadWebP}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#18231a] hover:bg-[#202e23] border border-[#2b3d2d] text-xs font-mono text-[#d8e6d7] transition-all hover:border-[#f5a623]"
          >
            <Download size={13} className="text-[#f5a623]" />
            <span>WebP</span>
          </button>

          {/* More Dropdown (SVG, TXT) */}
          <div className="relative">
            <button 
              onClick={() => setShowMoreExport(!showMoreExport)}
              className="p-1.5 rounded-lg bg-[#162018] hover:bg-[#1d2b1f] border border-[#2b3d2d] text-xs font-mono text-[#9bb0a0] hover:text-[#d8e6d7]"
              title="Meer export formaten"
            >
              <Share2 size={13} />
            </button>
            {showMoreExport && (
              <div className="absolute right-0 mt-1 w-36 bg-[#141d16] border border-[#2e4031] rounded-lg shadow-xl p-1 z-30 text-xs font-mono">
                <button 
                  onClick={() => { handleDownloadSvg(); setShowMoreExport(false); }}
                  className="w-full text-left px-2.5 py-1.5 hover:bg-[#1b261e] rounded text-[#dbe6da] flex items-center gap-2"
                >
                  <Download size={12} className="text-[#06b6d4]" /> Vector SVG
                </button>
                <button 
                  onClick={() => { handleDownloadTxt(); setShowMoreExport(false); }}
                  className="w-full text-left px-2.5 py-1.5 hover:bg-[#1b261e] rounded text-[#dbe6da] flex items-center gap-2"
                >
                  <FileText size={12} className="text-[#3ee087]" /> Platte TXT
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Center Art Display Canvas Viewport */}
      <div 
        ref={containerRef}
        className="flex-1 w-full overflow-auto flex items-center justify-center p-6 relative scanline-overlay"
      >
        {/* Floating zoom controls */}
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-[#121813]/80 backdrop-blur border border-[#233125] rounded-lg p-1 z-20">
          <button 
            onClick={() => setCanvasZoom(z => Math.max(0.4, z - 0.1))}
            className="p-1 text-[#8ea291] hover:text-[#e6f2e4]"
            title="Uitzoomen"
          >
            <ZoomOut size={14} />
          </button>
          <span className="text-[10px] font-mono text-[#8ea291] px-1">{Math.round(canvasZoom * 100)}%</span>
          <button 
            onClick={() => setCanvasZoom(z => Math.min(2.5, z + 0.1))}
            className="p-1 text-[#8ea291] hover:text-[#e6f2e4]"
            title="Inzoomen"
          >
            <ZoomIn size={14} />
          </button>
          <button 
            onClick={() => setCanvasZoom(1)}
            className="p-1 text-[#8ea291] hover:text-[#e6f2e4]"
            title="Herstel zoom"
          >
            <Maximize2 size={13} />
          </button>
        </div>

        {/* Empty state when no text and no file */}
        {(!rawAsciiText || rawAsciiText.trim() === '') ? (
          <div className="flex flex-col items-center justify-center text-[#556959] select-none text-center">
            <div className="w-16 h-16 rounded-2xl border border-dashed border-[#28382a] flex items-center justify-center mb-3 text-[#3d5041]">
              <FileText size={28} />
            </div>
            <p className="font-mono text-xs text-[#708574]">Upload een afbeelding of typ tekst</p>
          </div>
        ) : (
          <div 
            style={{ 
              transform: `scale(${canvasZoom})`,
              transformOrigin: 'center center',
              transition: 'transform 0.1s ease-out'
            }}
            className="flex items-center justify-center"
          >
            <pre 
              style={getGlowStyle()}
              className={`font-mono text-sm leading-[1.1] tracking-normal select-text whitespace-pre ${getEffectClass()} ${
                state.animation === 'pulse' ? 'animate-pulse' : ''
              }`}
            >
              {asciiGrid.map((row, rIdx) => (
                <div key={rIdx} className="flex">
                  {row.map((cell, cIdx) => (
                    <span 
                      key={cIdx} 
                      style={{ color: cell.color || '#3ee087' }}
                      className={state.animation === 'glitch' && Math.random() > 0.95 ? 'opacity-30' : ''}
                    >
                      {cell.char}
                    </span>
                  ))}
                </div>
              ))}
            </pre>
          </div>
        )}

        {/* Screenshot 2 Bottom Banner / Watermark */}
        {rawAsciiText && rawAsciiText.trim() !== '' && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#141b15]/90 backdrop-blur-md border border-[#2b3d2d] rounded-xl px-6 py-3 flex flex-col items-center gap-2 shadow-2xl z-20 font-mono text-center">
            <div className="flex items-center gap-2 text-xs text-[#c4d4c6]">
              <span className="text-[#3ee087]">🔒</span>
              <span className="font-semibold">Gemaakt met ASCIICraft</span>
              <span className="text-[#647969] text-[10px]">· Atelier Editie</span>
            </div>
            <button 
              onClick={onOpenPricing}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#241f0c] hover:bg-[#332b10] border border-[#f5a623] text-[#f5a623] hover:text-[#ffca58] text-xs font-bold transition-all shadow-[0_0_12px_rgba(245,166,35,0.25)]"
            >
              <Sparkles size={13} className="text-[#f5a623]" />
              <span>Upgrade naar Premium</span>
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

