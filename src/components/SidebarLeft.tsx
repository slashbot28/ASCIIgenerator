import React, { useRef } from 'react';
import { 
  UploadCloud, 
  Type as TypeIcon, 
  Activity, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Camera 
} from 'lucide-react';
import type { AppState, CharsetName, Shape3D, TextTab } from '../types';
import { ASCII_FONTS } from '../utils/figletFonts';

interface SidebarLeftProps {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  onFileUpload: (file: File) => void;
  onTriggerWebcam: () => void;
}

export const SidebarLeft: React.FC<SidebarLeftProps> = ({
  state,
  updateState,
  onFileUpload,
  onTriggerWebcam
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  const lineCount = state.text.split('\n').length;
  const maxLineLength = Math.max(...state.text.split('\n').map(l => l.length), 0);

  return (
    <aside className="w-80 shrink-0 bg-[#121813] border-r border-[#223024] p-4 flex flex-col gap-4 overflow-y-auto select-none">
      {/* Upload Box */}
      <div 
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="w-full border border-dashed border-[#2d402f] hover:border-[#f5a623] rounded-xl p-5 flex flex-col items-center justify-center text-center bg-[#151c16] hover:bg-[#182319] transition-all cursor-pointer group"
      >
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*,video/*,.gif"
          onChange={handleFileChange}
          className="hidden" 
        />
        <div className="w-12 h-12 rounded-full bg-[#1b261d] border border-[#2d402f] flex items-center justify-center mb-3 group-hover:scale-105 group-hover:border-[#f5a623] transition-all">
          <UploadCloud size={22} className="text-[#849a89] group-hover:text-[#f5a623] transition-colors" />
        </div>
        <p className="text-xs text-[#a2b5a5] font-mono leading-relaxed">
          <span className="text-[#d8e6d7] font-semibold">Zet uw bestanden hier neer</span> of <span className="text-[#f5a623] underline underline-offset-2">bladeren</span>
        </p>
        <p className="text-[10px] text-[#697f6e] font-mono mt-1">PNG, JPG, WebP, GIF, MP4</p>
      </div>

      {/* Start without file divider */}
      <div className="flex items-center gap-2 text-[10px] font-mono text-[#627767] uppercase tracking-wider justify-center">
        <span className="h-px bg-[#202c22] flex-1"></span>
        <span>Of starten zonder bestand</span>
        <span className="h-px bg-[#202c22] flex-1"></span>
      </div>

      {/* Quick Start Buttons: Tekst & Animatie */}
      <div className="grid grid-cols-2 gap-2">
        <button 
          onClick={() => updateState({ mode: 'text' })}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-mono font-medium transition-all ${
            state.mode === 'text' 
              ? 'bg-[#1e2a20] text-[#e6f2e4] border-[#3e5642] shadow-[0_0_12px_rgba(62,224,135,0.15)]' 
              : 'bg-[#151c16] text-[#8e9f91] border-[#253527] hover:border-[#384c3a] hover:text-[#c4d4c6]'
          }`}
        >
          <TypeIcon size={14} className="text-[#3ee087]" />
          <span>Tekst</span>
        </button>

        <button 
          onClick={() => updateState({ mode: '3d' })}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-mono font-medium transition-all ${
            state.mode === '3d' 
              ? 'bg-[#1e2a20] text-[#e6f2e4] border-[#3e5642] shadow-[0_0_12px_rgba(62,224,135,0.15)]' 
              : 'bg-[#151c16] text-[#8e9f91] border-[#253527] hover:border-[#384c3a] hover:text-[#c4d4c6]'
          }`}
        >
          <Activity size={14} className="text-[#06b6d4]" />
          <span>Animatie (3D)</span>
        </button>
      </div>

      {/* TEXT MODE CONTROLS */}
      {state.mode === 'text' && (
        <div className="flex flex-col gap-3">
          {/* Tabs: Tekst, Lettertype, Indeling, Stijl, Animeren */}
          <div className="flex border-b border-[#243326] text-[11px] font-mono">
            {(['text', 'font', 'layout', 'style', 'animate'] as TextTab[]).map(tab => {
              const labels: Record<TextTab, string> = {
                text: 'Tekst',
                font: 'Lettertype',
                layout: 'Indeling',
                style: 'Stijl',
                animate: 'Animeren'
              };
              return (
                <button
                  key={tab}
                  onClick={() => updateState({ textTab: tab })}
                  className={`flex-1 py-1.5 text-center transition-colors relative ${
                    state.textTab === tab 
                      ? 'text-[#f5a623] font-bold' 
                      : 'text-[#7e9282] hover:text-[#a8baa9]'
                  }`}
                >
                  {labels[tab]}
                  {state.textTab === tab && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f5a623]"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sub-tab 1: Tekst Input */}
          {state.textTab === 'text' && (
            <div className="flex flex-col gap-2">
              <label className="text-[11px] text-[#8ea291] font-mono">Jouw tekst</label>
              <textarea 
                value={state.text}
                onChange={(e) => updateState({ text: e.target.value })}
                rows={4}
                className="w-full bg-[#162018] border border-[#273729] rounded-lg p-2.5 text-xs font-mono text-[#dbe6da] focus:border-[#f5a623] focus:outline-none transition-colors resize-none"
                placeholder="Typ hier je tekst..."
              />
              <div className="flex justify-between items-center text-[10px] text-[#697f6e] font-mono">
                <span>{lineCount}/5 regels · {maxLineLength} tek./regel</span>
                <button 
                  onClick={() => updateState({ text: 'dit is een test' })}
                  className="text-[#f5a623] hover:underline"
                >
                  Voorbeeld
                </button>
              </div>
            </div>
          )}

          {/* Sub-tab 2: Lettertype */}
          {state.textTab === 'font' && (
            <div className="flex flex-col gap-3 font-mono">
              <label className="text-[11px] text-[#8ea291]">Kies Lettertype (FIGLET)</label>
              <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                {ASCII_FONTS.map(f => (
                  <button
                    key={f.id}
                    onClick={() => updateState({ font: f.id })}
                    className={`p-2 text-left text-xs rounded border transition-all ${
                      state.font === f.id
                        ? 'bg-[#1d291f] text-[#f5a623] border-[#f5a623]'
                        : 'bg-[#151c16] text-[#9bb0a0] border-[#253527] hover:border-[#384c3a]'
                    }`}
                  >
                    <div className="font-semibold">{f.name}</div>
                    <div className="text-[9px] text-[#6e8473]">{f.height} regels hoog</div>
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                <div className="flex justify-between text-[11px] text-[#8ea291]">
                  <span>Letterafstand</span>
                  <span>{state.letterSpacing}px</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="4" 
                  value={state.letterSpacing}
                  onChange={(e) => updateState({ letterSpacing: Number(e.target.value) })}
                  className="accent-[#f5a623] h-1.5 bg-[#1f2b21] rounded"
                />
              </div>
            </div>
          )}

          {/* Sub-tab 3: Indeling */}
          {state.textTab === 'layout' && (
            <div className="flex flex-col gap-3 font-mono">
              <label className="text-[11px] text-[#8ea291]">Uitlijning</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'left', icon: AlignLeft, label: 'Links' },
                  { id: 'center', icon: AlignCenter, label: 'Midden' },
                  { id: 'right', icon: AlignRight, label: 'Rechts' }
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => updateState({ textAlign: item.id as 'left' | 'center' | 'right' })}
                      className={`flex flex-col items-center gap-1 p-2 rounded border text-xs ${
                        state.textAlign === item.id
                          ? 'bg-[#1d291f] text-[#f5a623] border-[#f5a623]'
                          : 'bg-[#151c16] text-[#9bb0a0] border-[#253527]'
                      }`}
                    >
                      <Icon size={14} />
                      <span className="text-[10px]">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                <div className="flex justify-between text-[11px] text-[#8ea291]">
                  <span>Regelafstand</span>
                  <span>{state.lineHeight}</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="3" 
                  step="1"
                  value={state.lineHeight}
                  onChange={(e) => updateState({ lineHeight: Number(e.target.value) })}
                  className="accent-[#f5a623] h-1.5 bg-[#1f2b21] rounded"
                />
              </div>
            </div>
          )}

          {/* Sub-tab 4: Stijl */}
          {state.textTab === 'style' && (
            <div className="flex flex-col gap-3 font-mono">
              <label className="text-[11px] text-[#8ea291]">Preset Stijlen</label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {[
                  { name: 'Retro Synth', theme: 'synthwave', effect: '3d', glow: 'neon pink' },
                  { name: 'Cyber Hacker', theme: 'matrix', effect: 'glow', glow: 'green' },
                  { name: 'Golden Glow', theme: 'gold', effect: '3d', glow: 'gold' },
                  { name: 'Rainbow Pop', theme: 'rainbow', effect: '3d', glow: 'neon pink' },
                  { name: 'Cyberpunk 2077', theme: 'cyberpunk', effect: 'glow', glow: 'cyan' },
                  { name: 'Clean White', theme: 'monochrome', effect: 'none', glow: 'none' }
                ].map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => updateState({
                      colorTheme: preset.theme as any,
                      effect: preset.effect as any,
                      glow: preset.glow as any
                    })}
                    className="p-2 bg-[#162018] hover:bg-[#1d2a1f] border border-[#273729] rounded text-left text-[#c4d4c6] hover:text-[#f5a623] transition-colors"
                  >
                    <div className="font-semibold">{preset.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sub-tab 5: Animeren */}
          {state.textTab === 'animate' && (
            <div className="flex flex-col gap-2 font-mono">
              <label className="text-[11px] text-[#8ea291]">Animatie Effecten</label>
              {[
                { id: 'none', label: 'Geen animatie' },
                { id: 'rainbow-cycle', label: 'Rainbow Cyclus (Kleurloop)' },
                { id: 'wave', label: 'Wave Golfbeweging' },
                { id: 'pulse', label: 'Pulsar Gloed' },
                { id: 'matrix-rain', label: 'Matrix Rain Flicker' },
                { id: 'glitch', label: 'Cyber Glitch' }
              ].map(anim => (
                <button
                  key={anim.id}
                  onClick={() => updateState({ animation: anim.id as any })}
                  className={`p-2 text-left text-xs rounded border transition-all ${
                    state.animation === anim.id
                      ? 'bg-[#1d291f] text-[#3ee087] border-[#3ee087]'
                      : 'bg-[#151c16] text-[#9bb0a0] border-[#253527] hover:border-[#384c3a]'
                  }`}
                >
                  {anim.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* IMAGE / VIDEO CONVERTER CONTROLS */}
      {(state.mode === 'image' || state.mode === 'video' || state.mode === 'converter') && state.imageUrl && (
        <div className="flex flex-col gap-3 font-mono">
          <div className="flex items-center justify-between text-xs text-[#a2b5a5]">
            <span className="font-semibold text-[#e6f2e4]">Afbeelding Instellingen</span>
            <button 
              onClick={() => updateState({ imageUrl: null })}
              className="text-[#f43f8e] text-[10px] hover:underline"
            >
              Wissen
            </button>
          </div>

          {/* Charset Selector */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-[#8ea291]">Tekenset (Karakters)</label>
            <select
              value={state.charset}
              onChange={(e) => updateState({ charset: e.target.value as CharsetName })}
              className="bg-[#162018] border border-[#273729] rounded p-1.5 text-xs text-[#c4d4c6] focus:border-[#f5a623] focus:outline-none"
            >
              <option value="classic">Klassiek (@%#*+=-:. )</option>
              <option value="detailed">Gedetailleerd (70+ tekens)</option>
              <option value="blocks">Blokken (█▓▒░ )</option>
              <option value="braille">Braille (⠁⠃⠇⡇⣇⣧⣷⣿)</option>
              <option value="matrix">Matrix (01)</option>
              <option value="binary">Binair (01 )</option>
              <option value="hex">Hexadecimaal (0-F)</option>
              <option value="geometric">Geometrisch (▲▼○●)</option>
              <option value="math">Wiskundig (∑∏√∞)</option>
              <option value="slashes">Slashes (`/|\#)</option>
              <option value="minimal">Minimalistisch (·+#)</option>
              <option value="custom">Aangepast...</option>
            </select>
          </div>

          {state.charset === 'custom' && (
            <input 
              type="text" 
              value={state.customCharset}
              onChange={(e) => updateState({ customCharset: e.target.value })}
              placeholder="Vul aangepaste tekens in..."
              className="bg-[#162018] border border-[#273729] rounded p-1.5 text-xs text-[#c4d4c6]"
            />
          )}

          {/* Columns (Resolution) Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] text-[#8ea291]">
              <span>Resolutie (Breedte)</span>
              <span className="text-[#f5a623]">{state.columns} kolommen</span>
            </div>
            <input 
              type="range" 
              min="20" 
              max="200" 
              value={state.columns}
              onChange={(e) => updateState({ columns: Number(e.target.value) })}
              className="accent-[#f5a623] h-1.5 bg-[#1f2b21] rounded"
            />
          </div>

          {/* Contrast Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] text-[#8ea291]">
              <span>Contrast</span>
              <span>{state.contrast}</span>
            </div>
            <input 
              type="range" 
              min="-100" 
              max="100" 
              value={state.contrast}
              onChange={(e) => updateState({ contrast: Number(e.target.value) })}
              className="accent-[#3ee087] h-1.5 bg-[#1f2b21] rounded"
            />
          </div>

          {/* Brightness Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] text-[#8ea291]">
              <span>Helderheid</span>
              <span>{state.brightness}</span>
            </div>
            <input 
              type="range" 
              min="-100" 
              max="100" 
              value={state.brightness}
              onChange={(e) => updateState({ brightness: Number(e.target.value) })}
              className="accent-[#3ee087] h-1.5 bg-[#1f2b21] rounded"
            />
          </div>

          {/* Color Mode */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-[#8ea291]">Kleurweergave</label>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: 'full', label: 'RGB Kleur' },
                { id: 'theme', label: 'Thema' },
                { id: 'mono', label: 'Monochroom' }
              ].map(cm => (
                <button
                  key={cm.id}
                  onClick={() => updateState({ colorMode: cm.id as any })}
                  className={`py-1 text-center text-xs rounded border ${
                    state.colorMode === cm.id 
                      ? 'bg-[#1e2a20] text-[#f5a623] border-[#f5a623]' 
                      : 'bg-[#151c16] text-[#8ea291] border-[#253527]'
                  }`}
                >
                  {cm.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#202c22]">
            <label className="flex items-center justify-between text-xs text-[#a2b5a5] cursor-pointer">
              <span>Dithering (Floyd-Steinberg)</span>
              <input 
                type="checkbox" 
                checked={state.dithering}
                onChange={(e) => updateState({ dithering: e.target.checked })}
                className="accent-[#3ee087] w-4 h-4 rounded"
              />
            </label>
            <label className="flex items-center justify-between text-xs text-[#a2b5a5] cursor-pointer">
              <span>Kleuren omkeren (Invert)</span>
              <input 
                type="checkbox" 
                checked={state.invert}
                onChange={(e) => updateState({ invert: e.target.checked })}
                className="accent-[#3ee087] w-4 h-4 rounded"
              />
            </label>
          </div>
        </div>
      )}

      {/* 3D MODE CONTROLS */}
      {state.mode === '3d' && (
        <div className="flex flex-col gap-3 font-mono">
          <label className="text-[11px] text-[#8ea291]">3D Vorm Selector</label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'torus', label: 'Donut (Torus)' },
              { id: 'cube', label: 'Kubus 3D' },
              { id: 'sphere', label: 'Bol (Sphere)' },
              { id: 'dna', label: 'DNA Helix' },
              { id: 'pyramid', label: 'Piramide' }
            ].map(s => (
              <button
                key={s.id}
                onClick={() => updateState({ shape3D: s.id as Shape3D })}
                className={`p-2 text-left text-xs rounded border transition-all ${
                  state.shape3D === s.id
                    ? 'bg-[#1d291f] text-[#3ee087] border-[#3ee087]'
                    : 'bg-[#151c16] text-[#9bb0a0] border-[#253527]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            <div className="flex justify-between text-[11px] text-[#8ea291]">
              <span>Rotatiesnelheid</span>
              <span>{state.rotationSpeed.toFixed(1)}x</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="3" 
              step="0.1"
              value={state.rotationSpeed}
              onChange={(e) => updateState({ rotationSpeed: Number(e.target.value) })}
              className="accent-[#3ee087] h-1.5 bg-[#1f2b21] rounded"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-[11px] text-[#8ea291]">
              <span>Zoom</span>
              <span>{state.zoom3D.toFixed(1)}x</span>
            </div>
            <input 
              type="range" 
              min="0.5" 
              max="2.0" 
              step="0.1"
              value={state.zoom3D}
              onChange={(e) => updateState({ zoom3D: Number(e.target.value) })}
              className="accent-[#06b6d4] h-1.5 bg-[#1f2b21] rounded"
            />
          </div>
        </div>
      )}

      {/* AUDIO VISUALIZER CONTROLS */}
      {state.mode === 'audio' && (
        <div className="flex flex-col gap-3 font-mono">
          <label className="text-[11px] text-[#8ea291]">Audiovisualizer Modus</label>
          <div className="grid grid-cols-3 gap-1">
            {[
              { id: 'bars', label: 'Balken' },
              { id: 'wave', label: 'Golf' },
              { id: 'matrix', label: 'Matrix' }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => updateState({ audioStyle: m.id as any })}
                className={`py-1.5 text-center text-xs rounded border ${
                  state.audioStyle === m.id
                    ? 'bg-[#1d291f] text-[#3ee087] border-[#3ee087]'
                    : 'bg-[#151c16] text-[#9bb0a0] border-[#253527]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            <div className="flex justify-between text-[11px] text-[#8ea291]">
              <span>Gevoeligheid</span>
              <span>{state.audioSensitivity}</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="5" 
              value={state.audioSensitivity}
              onChange={(e) => updateState({ audioSensitivity: Number(e.target.value) })}
              className="accent-[#f43f8e] h-1.5 bg-[#1f2b21] rounded"
            />
          </div>
        </div>
      )}

      {/* Webcam shortcut */}
      <button 
        onClick={onTriggerWebcam}
        className="mt-auto flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#141b15] hover:bg-[#1b251d] border border-[#233125] text-xs font-mono text-[#9bb0a0] hover:text-[#e6f2e4] transition-all"
      >
        <Camera size={14} className="text-[#3ee087]" />
        <span>Live Webcam naar ASCII</span>
      </button>
    </aside>
  );
};

