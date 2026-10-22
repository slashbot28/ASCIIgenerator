import React, { useState, useRef, useEffect } from 'react';
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
  Share2,
  Film,
  Video,
  MessageSquare,
  RotateCcw,
  Play,
  Pause
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
  copyDiscordAnsi,
  downloadPng, 
  downloadWebP, 
  downloadSvg, 
  downloadTextFile,
  recordWebmVideo,
  exportAnimatedGif
} from '../utils/exportUtils';

interface CanvasViewProps {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  asciiGrid: AsciiCell[][];
  rawAsciiText: string;
  onOpenPricing: () => void;
  on3DRotate?: (dx: number, dy: number) => void;
  onPaintCell?: (row: number, col: number) => void;
  onPaintFloodFill?: (row: number, col: number) => void;
}

export const CanvasView: React.FC<CanvasViewProps> = ({
  state,
  updateState,
  asciiGrid,
  rawAsciiText,
  onOpenPricing,
  on3DRotate,
  onPaintCell,
  onPaintFloodFill
}) => {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedAnsi, setCopiedAnsi] = useState(false);
  const [canvasZoom, setCanvasZoom] = useState(1);
  const [showMoreExport, setShowMoreExport] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [exportProgress, setExportProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const isMouseDownRef = useRef(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Quick ribbon arrays
  const THEMES: ColorTheme[] = [
    'rainbow', 'synthwave', 'cyberpunk', 'matrix', 'sunset', 'fire', 'ice', 'toxic', 'neonPink', 'gold', 'monochrome', 'hacker', 'pastel'
  ];
  const DIRECTIONS: GradientDirection[] = ['horizontal', 'vertical', 'diagonal', 'radial'];
  const EFFECTS: EffectType[] = [
    'none', '3d', 'glow', 'glitch', 'emboss', 'shadow', 'hologram', 'fire', 'chroma', 'outline'
  ];
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

  const handleCopyAnsi = async () => {
    const ok = await copyDiscordAnsi(asciiGrid);
    if (ok) {
      setCopiedAnsi(true);
      setTimeout(() => setCopiedAnsi(false), 2000);
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

  // Export GIF
  const handleExportGif = async () => {
    setIsExporting('GIF genereren...');
    setExportProgress(10);
    try {
      await exportAnimatedGif(
        () => asciiGrid,
        18,
        0.08,
        { effect: state.effect, glow: state.glow },
        (p) => setExportProgress(p)
      );
    } catch {
      alert('GIF exporteren mislukt.');
    } finally {
      setIsExporting(null);
      setExportProgress(0);
    }
  };

  // Export WebM Video
  const handleExportWebm = async () => {
    setIsExporting('Video opnemen (3 sec)...');
    setExportProgress(0);
    try {
      await recordWebmVideo(
        () => asciiGrid,
        3000,
        { effect: state.effect, glow: state.glow },
        (p) => setExportProgress(Math.round(p * 100))
      );
    } catch {
      alert('Video exporteren mislukt.');
    } finally {
      setIsExporting(null);
      setExportProgress(0);
    }
  };

  // Mouse & Touch 3D Orbit Controls
  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDownRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    if (state.mode === '3d' && on3DRotate) {
      on3DRotate(dx, dy);
    }
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
  };

  // Wheel zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey || state.mode === '3d') {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.05 : 0.05;
        if (state.mode === '3d') {
          updateState({ zoom3D: Math.max(0.4, Math.min(2.5, state.zoom3D + delta)) });
        } else {
          setCanvasZoom(z => Math.max(0.4, Math.min(2.5, z + delta)));
        }
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [state.mode, state.zoom3D]);

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
    if (state.effect === 'shadow') return 'effect-shadow';
    if (state.effect === 'hologram') return 'effect-hologram';
    if (state.effect === 'fire') return 'effect-fire';
    if (state.effect === 'chroma') return 'effect-chroma';
    if (state.effect === 'outline') return 'effect-outline';
    return '';
  };

  return (
    <main className="flex-1 flex flex-col h-full bg-[#0b0f0c] overflow-hidden relative">
      {/* Top Floating Controls & Action Buttons */}
      <div className="w-full bg-[#111712] border-b border-[#212f24] px-4 py-2 flex flex-wrap items-center justify-between gap-2.5 select-none z-10">
        {/* Ribbon Selectors with < > chevrons */}
        <div className="flex items-center gap-3 flex-wrap">
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

          {/* 3D Spin Toggle (Only in 3D Mode) */}
          {state.mode === '3d' && (
            <button 
              onClick={() => updateState({ autoSpin3D: !state.autoSpin3D })}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono border transition-all ${
                state.autoSpin3D 
                  ? 'bg-[#1e2a20] text-[#3ee087] border-[#3e5642]' 
                  : 'bg-[#151c16] text-[#7d9382] border-[#253527]'
              }`}
            >
              {state.autoSpin3D ? <Pause size={12} /> : <Play size={12} />}
              <span>{state.autoSpin3D ? 'Auto-Spin Aan' : 'Auto-Spin Uit'}</span>
            </button>
          )}
        </div>

        {/* Action Buttons: Kopieer, HTML, Discord ANSI, GIF, PNG */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Discord ANSI Kopiëren (Feature E) */}
          <button 
            onClick={handleCopyAnsi}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#181a29] hover:bg-[#20243b] border border-[#3b426d] text-xs font-mono text-[#a5b4fc] transition-all shadow-[0_0_8px_rgba(99,102,241,0.2)]"
            title="Kopieer als gekleurde Discord ANSI code"
          >
            {copiedAnsi ? <Check size={13} className="text-[#818cf8]" /> : <MessageSquare size={13} className="text-[#818cf8]" />}
            <span>{copiedAnsi ? 'Discord Klaar!' : 'Discord ANSI'}</span>
          </button>

          {/* Kopieer text */}
          <button 
            onClick={handleCopyText}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#162018] hover:bg-[#1d2b1f] border border-[#2b3d2d] text-xs font-mono text-[#d8e6d7] transition-all hover:border-[#3ee087]"
            title="Kopieer als platte tekst"
          >
            {copiedText ? <Check size={13} className="text-[#3ee087]" /> : <Copy size={13} className="text-[#9bb0a0]" />}
            <span>{copiedText ? 'Gekopieerd!' : 'Kopieer'}</span>
          </button>

          {/* HTML kopiëren */}
          <button 
            onClick={handleCopyHtml}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#162018] hover:bg-[#1d2b1f] border border-[#2b3d2d] text-xs font-mono text-[#d8e6d7] transition-all hover:border-[#06b6d4]"
            title="Kopieer gekleurde HTML code"
          >
            {copiedHtml ? <Check size={13} className="text-[#06b6d4]" /> : <Code size={13} className="text-[#9bb0a0]" />}
            <span>HTML</span>
          </button>

          {/* Animated GIF Export (Feature A) */}
          <button 
            onClick={handleExportGif}
            disabled={isExporting !== null}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#271720] hover:bg-[#381c2c] border border-[#5c2a44] text-xs font-mono text-[#f43f8e] transition-all hover:shadow-[0_0_10px_rgba(244,63,142,0.3)] disabled:opacity-50"
            title="Exporteer als bewegende GIF"
          >
            <Film size={13} className="text-[#f43f8e]" />
            <span>GIF</span>
          </button>

          {/* WebM Video Export (Feature A) */}
          <button 
            onClick={handleExportWebm}
            disabled={isExporting !== null}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#142323] hover:bg-[#1a3333] border border-[#265353] text-xs font-mono text-[#22d3ee] transition-all hover:shadow-[0_0_10px_rgba(34,211,238,0.3)] disabled:opacity-50"
            title="Exporteer als WebM videoclip"
          >
            <Video size={13} className="text-[#22d3ee]" />
            <span>Video</span>
          </button>

          {/* PNG Download */}
          <button 
            onClick={handleDownloadPng}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#18231a] hover:bg-[#202e23] border border-[#2b3d2d] text-xs font-mono text-[#d8e6d7] transition-all hover:border-[#f5a623]"
          >
            <Download size={13} className="text-[#f5a623]" />
            <span>PNG</span>
          </button>

          {/* More Dropdown (WebP, SVG, TXT) */}
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
                  onClick={() => { handleDownloadWebP(); setShowMoreExport(false); }}
                  className="w-full text-left px-2.5 py-1.5 hover:bg-[#1b261e] rounded text-[#dbe6da] flex items-center gap-2"
                >
                  <Download size={12} className="text-[#f5a623]" /> WebP
                </button>
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

      {/* Export Progress Banner */}
      {isExporting && (
        <div className="w-full bg-[#1e2417] border-b border-[#f5a623] px-4 py-2 flex items-center justify-between text-xs font-mono text-[#f5a623] z-20">
          <div className="flex items-center gap-2">
            <span className="animate-spin text-lg font-bold">⌘</span>
            <span>{isExporting} ({exportProgress}%)</span>
          </div>
          <div className="w-48 bg-[#0e1410] rounded-full h-2 overflow-hidden border border-[#3b4c2b]">
            <div 
              style={{ width: `${exportProgress}%` }} 
              className="bg-[#f5a623] h-full transition-all duration-150"
            ></div>
          </div>
        </div>
      )}

      {/* Center Art Display Canvas Viewport */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`flex-1 w-full overflow-auto flex items-center justify-center p-6 relative scanline-overlay ${
          state.mode === '3d' ? 'cursor-grab active:cursor-grabbing' : state.mode === 'paint' ? 'cursor-crosshair' : ''
        }`}
      >
        {/* Floating Controls: Zoom & 3D Orbit Tip */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
          {state.mode === '3d' && (
            <div className="px-2.5 py-1 rounded bg-[#131d15]/90 border border-[#2c3f2f] text-[10px] font-mono text-[#8ea291] flex items-center gap-1.5 shadow-md">
              <RotateCcw size={11} className="text-[#3ee087]" />
              <span>Sleep met de muis om 3D te draaien</span>
            </div>
          )}

          <div className="flex items-center gap-1 bg-[#121813]/80 backdrop-blur border border-[#233125] rounded-lg p-1">
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
              transition: state.mode === '3d' ? 'none' : 'transform 0.1s ease-out'
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
                      onClick={() => {
                        if (state.mode === 'paint') {
                          if (state.paintTool === 'fill' && onPaintFloodFill) {
                            onPaintFloodFill(rIdx, cIdx);
                          } else if (onPaintCell) {
                            onPaintCell(rIdx, cIdx);
                          }
                        }
                      }}
                      onMouseEnter={(e) => {
                        if (state.mode === 'paint' && e.buttons === 1 && onPaintCell && state.paintTool !== 'fill') {
                          onPaintCell(rIdx, cIdx);
                        }
                      }}
                      style={{ color: cell.color || '#3ee087' }}
                      className={`inline-block ${state.mode === 'paint' ? 'hover:bg-[#223325] cursor-pointer' : ''} ${
                        state.animation === 'glitch' && Math.random() > 0.95 ? 'opacity-30' : ''
                      }`}
                    >
                      {cell.char}
                    </span>
                  ))}
                </div>
              ))}
            </pre>
          </div>
        )}

        {/* Bottom Banner / Watermark */}
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
