import React from 'react';
import { 
  X, 
  Sparkles, 
  Coins, 
  Check, 
  Film, 
  Image as ImageIcon, 
  Wrench, 
  Play
} from 'lucide-react';
import { fireConfetti } from '../utils/exportUtils';

interface ModalsProps {
  activeModal: 'tokens' | 'pricing' | 'gallery' | 'cinema' | 'tools' | null;
  onClose: () => void;
  onSelectArt: (text: string) => void;
  onAddTokens: (amount: number) => void;
}

export const Modals: React.FC<ModalsProps> = ({
  activeModal,
  onClose,
  onSelectArt,
  onAddTokens
}) => {
  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#121914] border border-[#2b3c2d] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl font-mono text-[#c4d4c6]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#202c22] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeModal === 'tokens' && <Coins className="text-[#f5a623]" size={20} />}
            {activeModal === 'pricing' && <Sparkles className="text-[#f5a623]" size={20} />}
            {activeModal === 'gallery' && <ImageIcon className="text-[#06b6d4]" size={20} />}
            {activeModal === 'cinema' && <Film className="text-[#f43f8e]" size={20} />}
            {activeModal === 'tools' && <Wrench className="text-[#3ee087]" size={20} />}
            
            <h2 className="text-base font-bold text-[#e6f2e4]">
              {activeModal === 'tokens' && 'Haal Tokens Op'}
              {activeModal === 'pricing' && 'ASCIICraft Atelier Abonnementen'}
              {activeModal === 'gallery' && 'Galerij der Meesterwerken (165+)'}
              {activeModal === 'cinema' && 'ASCII Cinema (6 Klassieke Animaties)'}
              {activeModal === 'tools' && 'Creatieve Atelier Tools (12)'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-[#788e7d] hover:text-[#e6f2e4] rounded-lg hover:bg-[#182319]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* TOKENS MODAL */}
          {activeModal === 'tokens' && (
            <div className="flex flex-col gap-5">
              <div className="p-4 rounded-xl bg-[#172219] border border-[#2d402f] flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-[#e6f2e4] text-sm">Dagelijkse Gratis Tokens</h3>
                  <p className="text-xs text-[#809684] mt-1">Claim elke 24 uur 50 gratis creatieve tokens.</p>
                </div>
                <button 
                  onClick={() => {
                    onAddTokens(50);
                    fireConfetti();
                    onClose();
                  }}
                  className="px-4 py-2 rounded-lg bg-[#f5a623] hover:bg-[#ffba3b] text-black font-bold text-xs shadow-lg transition-transform active:scale-95"
                >
                  +50 Claimen
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: 'Starter Bundel', tokens: 250, price: '€2,99', popular: false },
                  { name: 'Atelier Plus', tokens: 1000, price: '€7,99', popular: true },
                  { name: 'Onbeperkt Pas', tokens: 9999, price: '€14,99', popular: false }
                ].map((tier, i) => (
                  <div key={i} className={`p-4 rounded-xl border flex flex-col justify-between ${tier.popular ? 'border-[#f5a623] bg-[#1a2315]' : 'border-[#263527] bg-[#141d16]'}`}>
                    <div>
                      {tier.popular && <span className="text-[10px] text-[#f5a623] font-bold uppercase tracking-wider">Meest Gekozen</span>}
                      <h4 className="font-bold text-[#e6f2e4] text-sm mt-1">{tier.name}</h4>
                      <p className="text-lg font-bold text-[#f5a623] mt-2">{tier.tokens} <span className="text-xs text-[#809684]">tokens</span></p>
                    </div>
                    <button 
                      onClick={() => {
                        onAddTokens(tier.tokens);
                        fireConfetti();
                        onClose();
                      }}
                      className="mt-4 w-full py-2 rounded-lg bg-[#202c22] hover:bg-[#2b3c2d] border border-[#344837] text-xs font-semibold text-[#dbe6da] transition-all"
                    >
                      {tier.price}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRICING MODAL */}
          {activeModal === 'pricing' && (
            <div className="flex flex-col gap-4">
              <div className="text-center mb-2">
                <p className="text-xs text-[#8ea291]">Ontgrendel alle 72 tekensets, 4K WebM video export met audio & onbeperkte creaties.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-xl border border-[#27382a] bg-[#141d16] flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-[#e6f2e4]">Atelier Free</h3>
                    <p className="text-2xl font-bold text-[#f5a623] mt-2">€0 <span className="text-xs text-[#7e9483]">/voor altijd</span></p>
                    <ul className="text-xs text-[#9bb0a0] mt-4 flex flex-col gap-2">
                      <li className="flex items-center gap-2"><Check size={14} className="text-[#3ee087]" /> Basis converters & FIGLET fonts</li>
                      <li className="flex items-center gap-2"><Check size={14} className="text-[#3ee087]" /> PNG, WebP, HTML & Platte TXT export</li>
                      <li className="flex items-center gap-2"><Check size={14} className="text-[#3ee087]" /> Radio Pixel live stream</li>
                    </ul>
                  </div>
                  <button onClick={onClose} className="mt-6 w-full py-2 rounded-lg border border-[#304433] bg-[#1a241c] text-xs font-semibold">
                    Huidig Plan
                  </button>
                </div>

                <div className="p-5 rounded-xl border border-[#f5a623] bg-[#1b2318] flex flex-col justify-between relative shadow-[0_0_20px_rgba(245,166,35,0.15)]">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-[#e6f2e4]">Atelier Pro VIP</h3>
                      <span className="text-[10px] bg-[#f5a623] text-black font-bold px-2 py-0.5 rounded">AANBEVOLEN</span>
                    </div>
                    <p className="text-2xl font-bold text-[#f5a623] mt-2">€4,99 <span className="text-xs text-[#7e9483]">/maand</span></p>
                    <ul className="text-xs text-[#c4d4c6] mt-4 flex flex-col gap-2">
                      <li className="flex items-center gap-2"><Check size={14} className="text-[#f5a623]" /> Geen watermerk & onbeperkte tokens</li>
                      <li className="flex items-center gap-2"><Check size={14} className="text-[#f5a623]" /> Video naar ASCII met audio behoud</li>
                      <li className="flex items-center gap-2"><Check size={14} className="text-[#f5a623]" /> Alle 72 karakters & Braille HD mode</li>
                      <li className="flex items-center gap-2"><Check size={14} className="text-[#f5a623]" /> Vector SVG & Animated GIF export</li>
                    </ul>
                  </div>
                  <button 
                    onClick={() => {
                      onAddTokens(5000);
                      fireConfetti();
                      onClose();
                    }}
                    className="mt-6 w-full py-2.5 rounded-lg bg-[#f5a623] hover:bg-[#ffba3b] text-black font-bold text-xs shadow-lg transition-transform active:scale-95"
                  >
                    Start Met Pro
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* GALLERY MODAL */}
          {activeModal === 'gallery' && (
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  title: 'Cyberpunk Skull',
                  text: '       _--~~--_\n     /~ _    _ ~\\\n    |  / \\  / \\  |\n    |      V     |\n     \\   _--_   /\n      ~-____-~',
                  category: 'Cyber'
                },
                {
                  title: 'Retro Arcade Spaceship',
                  text: '      /\\\n     /  \\\n    / /\\ \\\n   | |  | |\n  /| |  | |\\\n /_|_|__|_|_\\\n    /____\\',
                  category: 'Sci-Fi'
                },
                {
                  title: 'Doge Wow',
                  text: '    ___\n  /     \\\n | () () |\n  \\  ^  /\n   |||||\n   WOW ASCII',
                  category: 'Meme'
                },
                {
                  title: 'Coffee Atelier',
                  text: '   ( (\n    ) )\n  ._____.\n  |     |]\n  \\_____/\n  ATELIER',
                  category: 'Lo-Fi'
                }
              ].map((item, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    onSelectArt(item.text);
                    onClose();
                  }}
                  className="p-3 rounded-xl bg-[#162018] border border-[#273729] hover:border-[#06b6d4] transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-xs text-[#e6f2e4] group-hover:text-[#06b6d4]">{item.title}</span>
                    <span className="text-[10px] text-[#6e8473]">{item.category}</span>
                  </div>
                  <pre className="bg-[#0e1410] p-2 rounded text-[10px] leading-tight text-[#3ee087] overflow-hidden max-h-24 font-mono">
                    {item.text}
                  </pre>
                  <div className="mt-2 text-[10px] text-[#06b6d4] text-right font-semibold">
                    Klik om in te laden →
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CINEMA MODAL */}
          {activeModal === 'cinema' && (
            <div className="grid grid-cols-2 gap-3">
              {[
                { title: 'Matrix Code Rain', desc: 'Vallende groene neon codes in pure ASCII', icon: '01' },
                { title: 'Synthwave Sun Horizon', desc: 'Draaiende 80s neon zon over een wireframe grid', icon: '☼' },
                { title: 'Star Wars Crawl', desc: 'Klassieke openingsletters die in de ruimte zweven', icon: '★' },
                { title: 'Bouncing DVD Logo', desc: 'De legendarische stuiterende hoektreffer', icon: '▣' }
              ].map((clip, i) => (
                <div 
                  key={i}
                  onClick={() => {
                    onSelectArt(`[CINEMA SCENE: ${clip.title}]\n\n  ▲ ▲ ▲ ▲ ▲\n ◄ █ █ █ █ ►\n  ▼ ▼ ▼ ▼ ▼\n\n   ${clip.icon} ${clip.title} ${clip.icon}`);
                    onClose();
                  }}
                  className="p-4 rounded-xl bg-[#162018] border border-[#273729] hover:border-[#f43f8e] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#22161e] border border-[#3f1f31] flex items-center justify-center text-[#f43f8e]">
                      <Play size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#e6f2e4] group-hover:text-[#f43f8e]">{clip.title}</h4>
                      <p className="text-[10px] text-[#809684] mt-0.5">{clip.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TOOLS MODAL */}
          {activeModal === 'tools' && (
            <div className="grid grid-cols-2 gap-3">
              {[
                { title: 'ASCII QR-Code Maker', desc: 'Maak scanbare QR codes van tekst en links' },
                { title: 'Achtergrond Verwijderaar', desc: 'Verwijder achtergronden voor schone ASCII' },
                { title: 'Kleurpalet Generator', desc: 'Genereer retro synthwave & cyberpunk gradients' },
                { title: 'FIGLET Font Tester', desc: 'Bekijk direct al je woorden in 50+ fonts' },
                { title: 'Video Cropper & Trimmer', desc: 'Knip videofragmenten voor perfecte animatie' },
                { title: 'Audio Beat Extractor', desc: 'Zet audio amplitudes om in ASCII golven' }
              ].map((tool, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-[#162018] border border-[#273729] hover:border-[#3ee087] transition-all cursor-pointer">
                  <h4 className="font-bold text-xs text-[#e6f2e4]">{tool.title}</h4>
                  <p className="text-[10px] text-[#809684] mt-1">{tool.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

