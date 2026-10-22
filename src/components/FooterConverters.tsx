import React from 'react';
import type { ConverterMode } from '../types';

interface FooterConvertersProps {
  currentMode: ConverterMode;
  onSelectMode: (mode: ConverterMode) => void;
}

export const FooterConverters: React.FC<FooterConvertersProps> = ({
  currentMode,
  onSelectMode
}) => {
  const converters: { id: ConverterMode; label: string }[] = [
    { id: 'converter', label: 'ASCII-converter' },
    { id: 'image', label: 'Afbeelding naar ASCII' },
    { id: 'video', label: 'Video naar ASCII' },
    { id: 'gif', label: 'GIF naar ASCII' },
    { id: 'text', label: 'Tekst naar ASCII' },
    { id: '3d', label: '3D ASCII-art' },
    { id: 'qr', label: 'QR-Code Maker' },
    { id: 'paint', label: 'ASCII Paint' },
    { id: 'audio', label: 'Audiovisualizer' }
  ];

  return (
    <footer className="w-full bg-[#0d120e] border-t border-[#1d271f] px-4 py-2 flex items-center justify-center gap-4 text-xs font-mono overflow-x-auto select-none">
      <span className="text-[#3ee087] font-bold text-[10px] tracking-wider uppercase shrink-0">
        CONVERTERS
      </span>

      <div className="flex items-center gap-3 shrink-0">
        {converters.map(conv => (
          <button
            key={conv.id}
            onClick={() => onSelectMode(conv.id)}
            className={`transition-colors text-[11px] hover:underline underline-offset-4 ${
              currentMode === conv.id
                ? 'text-[#f5a623] font-semibold'
                : 'text-[#7e9282] hover:text-[#c4d4c6]'
            }`}
          >
            {conv.label}
          </button>
        ))}
      </div>
    </footer>
  );
};
