import React, { useState } from 'react';
import { 
  Sparkles, 
  Radio, 
  Coins, 
  Wrench, 
  Image as ImageIcon, 
  Film, 
  Globe, 
  Sun, 
  Moon, 
  Code2, 
  Volume2, 
  VolumeX 
} from 'lucide-react';
import type { AppState } from '../types';
import { audioService } from '../utils/audioVisualizer';

interface NavbarProps {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  onOpenTokens: () => void;
  onOpenPricing: () => void;
  onOpenGallery: () => void;
  onOpenCinema: () => void;
  onOpenTools: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  state,
  updateState,
  onOpenTokens,
  onOpenPricing,
  onOpenGallery,
  onOpenCinema,
  onOpenTools
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [trackName, setTrackName] = useState('Radio Pixel · Cyber Lofi Lounge #04');

  const toggleRadio = () => {
    if (state.radioPlaying) {
      audioService.stopRadio();
      updateState({ radioPlaying: false });
    } else {
      audioService.startRadio((t) => setTrackName(t));
      updateState({ radioPlaying: true });
    }
  };

  const toggleLang = () => {
    updateState({ lang: state.lang === 'nl' ? 'en' : 'nl' });
  };

  const toggleTheme = () => {
    updateState({ theme: state.theme === 'dark' ? 'light' : 'dark' });
  };

  return (
    <header className="w-full border-b border-[#223024] bg-[#111712] sticky top-0 z-40 select-none">
      {/* Top Main Navigation Bar */}
      <div className="max-w-[1700px] mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Left Logo */}
        <div 
          onClick={() => updateState({ mode: 'converter' })}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-[#18231a] border border-[#2d402f] flex items-center justify-center shadow-inner group-hover:border-[#f5a623] transition-colors">
            <span className="text-[#f5a623] font-bold text-lg font-mono">⌘</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[#e6f2e4] font-bold text-lg tracking-wider font-mono">ASCIICraft</span>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-[#728a77] font-mono">
              HET CREATIEVE ATELIER <span className="text-[#f5a623]">✳</span>
            </span>
          </div>
        </div>

        {/* Center Pill Switchers */}
        <div className="flex items-center gap-2">
          {/* ASCII-converter Pill */}
          <button 
            onClick={() => updateState({ mode: 'converter' })}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium font-mono border transition-all ${
              state.mode === 'converter' || state.mode === 'text' || state.mode === 'image'
                ? 'bg-[#1b261d] text-[#e6f2e4] border-[#3a523e] shadow-[0_0_15px_rgba(62,224,135,0.1)]'
                : 'bg-transparent text-[#8a9f8f] border-transparent hover:border-[#2d402f]'
            }`}
          >
            <Code2 size={15} className="text-[#3ee087]" />
            <span>ASCII-converter</span>
          </button>

          {/* Radio Pixel Button */}
          <button 
            onClick={toggleRadio}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium font-mono border transition-all ${
              state.radioPlaying 
                ? 'bg-[#291b22] text-[#f43f8e] border-[#5e2b42] shadow-[0_0_15px_rgba(244,63,142,0.25)]' 
                : 'bg-[#151d16] text-[#9bb0a0] border-[#293b2c] hover:border-[#3d5742]'
            }`}
            title={state.radioPlaying ? 'Pauzeer Radio Pixel' : 'Start Radio Pixel Lo-Fi'}
          >
            <Radio size={14} className={state.radioPlaying ? 'animate-pulse text-[#f43f8e]' : 'text-[#7e9483]'} />
            <span>Radio Pixel</span>
            <span className="flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase">
              <span className={`w-2 h-2 rounded-full ${state.radioPlaying ? 'bg-red-500 animate-ping' : 'bg-zinc-600'}`}></span>
              <span className={state.radioPlaying ? 'text-red-400' : 'text-zinc-500'}>ON AIR</span>
            </span>
            {state.radioPlaying ? <Volume2 size={13} className="text-[#f43f8e]" /> : <VolumeX size={13} className="text-[#7e9483]" />}
          </button>
        </div>

        {/* Right Action Icons & Badges */}
        <div className="flex items-center gap-3">
          {/* Abonnementen Button */}
          <button 
            onClick={onOpenPricing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono text-[#dbe6da] bg-[#162017] hover:bg-[#1d2a1f] border border-[#2b3c2d] hover:border-[#405a44] transition-all"
          >
            <Sparkles size={14} className="text-[#f5a623]" />
            <span>{state.lang === 'nl' ? 'Abonnementen' : 'Pricing'}</span>
          </button>

          {/* Token Badge */}
          <div 
            onClick={onOpenTokens}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono text-[#9bb0a0] bg-[#121a14] border border-[#253527] cursor-pointer hover:border-[#f5a623] hover:text-[#f5a623] transition-colors"
          >
            <span>{state.lang === 'nl' ? 'Gratis' : 'Free'}</span>
            <span className="text-[#f5a623] font-bold">{state.tokens} tokens</span>
          </div>

          {/* User Profile Avatar */}
          <div className="relative">
            <button 
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-8 h-8 rounded-full bg-[#1e2a20] border border-[#374b3a] text-xs font-bold text-[#e6f2e4] flex items-center justify-center hover:border-[#f5a623] transition-colors"
            >
              G
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#141d16] border border-[#2e4031] rounded-lg shadow-2xl p-2 z-50 text-xs font-mono">
                <div className="px-3 py-2 border-b border-[#253527] text-[#a4b8a8]">
                  Geert (Creator)
                  <div className="text-[10px] text-[#f5a623] font-bold mt-0.5">PRO ATELIER</div>
                </div>
                <button 
                  onClick={() => { onOpenTokens(); setProfileOpen(false); }}
                  className="w-full text-left px-3 py-2 hover:bg-[#1b261e] rounded text-[#dbe6da] flex items-center gap-2"
                >
                  <Coins size={13} className="text-[#f5a623]" /> Tokens beheren
                </button>
                <button 
                  onClick={() => { onOpenPricing(); setProfileOpen(false); }}
                  className="w-full text-left px-3 py-2 hover:bg-[#1b261e] rounded text-[#dbe6da] flex items-center gap-2"
                >
                  <Sparkles size={13} className="text-[#f5a623]" /> Upgrade naar Pro
                </button>
              </div>
            )}
          </div>

          {/* Language Switcher */}
          <button 
            onClick={toggleLang}
            className="px-2.5 py-1 text-xs font-mono font-bold rounded bg-[#162017] border border-[#2b3c2d] text-[#c3d4c5] hover:border-[#3ee087] transition-colors"
          >
            {state.lang.toUpperCase()}
          </button>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-1.5 rounded text-[#9bb0a0] hover:text-[#e6f2e4] hover:bg-[#19231b] transition-colors"
            title="Wissel thema"
          >
            {state.theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>

      {/* Subheader: Category pills, Marquee ticker & "Haal tokens op" button */}
      <div className="max-w-[1700px] mx-auto px-4 py-2 flex items-center justify-between border-t border-[#1b271d] text-xs font-mono gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={onOpenTools}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#162017] hover:bg-[#1d2b1f] border border-[#28392a] text-[#c2d3c4] transition-all"
          >
            <Wrench size={13} className="text-[#3ee087]" />
            <span>Tools</span>
            <span className="text-[10px] text-[#6e8473] bg-[#0f1611] px-1.5 py-0.2 rounded">12</span>
          </button>

          <button 
            onClick={onOpenGallery}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#162017] hover:bg-[#1d2b1f] border border-[#28392a] text-[#c2d3c4] transition-all"
          >
            <ImageIcon size={13} className="text-[#06b6d4]" />
            <span>Galerij</span>
            <span className="text-[10px] text-[#6e8473] bg-[#0f1611] px-1.5 py-0.2 rounded">165</span>
          </button>

          <button 
            onClick={onOpenCinema}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#162017] hover:bg-[#1d2b1f] border border-[#28392a] text-[#c2d3c4] transition-all"
          >
            <Film size={13} className="text-[#f43f8e]" />
            <span>Cinema</span>
            <span className="text-[10px] text-[#6e8473] bg-[#0f1611] px-1.5 py-0.2 rounded">6</span>
          </button>

          <button 
            onClick={onOpenTools}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#162017] hover:bg-[#1d2b1f] border border-[#28392a] text-[#c2d3c4] transition-all"
          >
            <Globe size={13} className="text-[#a855f7]" />
            <span>Apps</span>
            <span className="text-[10px] text-[#6e8473] bg-[#0f1611] px-1.5 py-0.2 rounded">3</span>
          </button>
        </div>

        {/* Ticker / News Bar */}
        <div className="flex-1 overflow-hidden px-4 hidden md:block">
          <div className="text-[11px] text-[#869c8b] flex items-center gap-4 whitespace-nowrap">
            <span className="text-[#3ee087] font-semibold">Nieuw ·</span>
            <span>ASCII-audiovisualizer, exporteer je nummers als video</span>
            <span className="text-[#495e4d]">•</span>
            <span className="text-[#f5a623] font-semibold">Binnenkort ·</span>
            <span>de Radio Pixel Chrome-extensie, je radio in elk tabblad</span>
            {state.radioPlaying && (
              <>
                <span className="text-[#495e4d]">•</span>
                <span className="text-[#f43f8e] font-semibold animate-pulse">Now Playing: {trackName}</span>
              </>
            )}
          </div>
        </div>

        {/* Haal tokens op Button (Golden Glow) */}
        <button 
          onClick={onOpenTokens}
          className="shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1b1c11] hover:bg-[#262817] border border-[#f5a623] text-[#f5a623] hover:text-[#ffbe42] text-xs font-bold shadow-[0_0_12px_rgba(245,166,35,0.25)] hover:shadow-[0_0_18px_rgba(245,166,35,0.45)] transition-all cursor-pointer"
        >
          <Coins size={14} className="text-[#f5a623]" />
          <span>Haal tokens op</span>
        </button>
      </div>
    </header>
  );
};

