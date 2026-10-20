import { useState, useEffect, useRef, useMemo } from 'react';
import type { AppState, AsciiCell } from './types';
import { Navbar } from './components/Navbar';
import { SidebarLeft } from './components/SidebarLeft';
import { CanvasView } from './components/CanvasView';
import { FooterConverters } from './components/FooterConverters';
import { Modals } from './components/Modals';
import { renderAsciiText } from './utils/figletFonts';
import { colorizeAsciiText, processImageToAscii } from './utils/asciiConverter';
import { render3DObject } from './utils/threeDModel';
import { audioService, renderAsciiEqualizer } from './utils/audioVisualizer';

export function App() {
  const [state, setState] = useState<AppState>({
    mode: 'text',
    lang: 'nl',
    theme: 'dark',

    // Text state
    text: 'dit is een test',
    textTab: 'text',
    font: 'slant',
    letterSpacing: 0,
    lineHeight: 1,
    textAlign: 'center',
    animation: 'none',

    // Quick Ribbon state
    colorTheme: 'rainbow',
    direction: 'horizontal',
    effect: '3d',
    glow: 'neon pink',

    // Image & Video state
    imageUrl: null,
    videoUrl: null,
    charset: 'detailed',
    customCharset: ' .:*#@',
    columns: 80,
    contrast: 15,
    brightness: 5,
    invert: false,
    dithering: true,
    colorMode: 'theme',
    monoColor: '#3ee087',

    // Video
    isPlaying: true,
    fps: 24,
    loop: true,

    // 3D
    shape3D: 'torus',
    rotationSpeed: 1,
    zoom3D: 1,
    wireframe3D: false,

    // Audio
    audioActive: false,
    audioSensitivity: 3,
    audioBars: 45,
    audioStyle: 'bars',

    // Radio
    radioPlaying: false,
    radioVolume: 0.5,

    // Tokens
    tokens: 150
  });

  const [activeModal, setActiveModal] = useState<'tokens' | 'pricing' | 'gallery' | 'cinema' | 'tools' | null>(null);

  // References
  const animationFrameRef = useRef<number | null>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const imageElementRef = useRef<HTMLImageElement | null>(null);

  // 3D rotation angles
  const rotRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const [dynamicAscii, setDynamicAscii] = useState<{ text: string; grid: AsciiCell[][] } | null>(null);

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  // Handle uploaded file (image or video)
  const handleFileUpload = (file: File) => {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        imageElementRef.current = img;
        updateState({
          imageUrl: url,
          mode: 'image'
        });
      };
      img.src = url;
    } else if (file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      const vid = document.createElement('video');
      vid.src = url;
      vid.muted = true;
      vid.loop = true;
      vid.play();
      videoElementRef.current = vid;
      updateState({
        videoUrl: url,
        mode: 'video'
      });
    }
  };

  // Handle Webcam
  const handleTriggerWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const vid = document.createElement('video');
      vid.srcObject = stream;
      vid.play();
      videoElementRef.current = vid;
      updateState({
        mode: 'video',
        videoUrl: 'webcam'
      });
    } catch {
      alert('Kan webcam niet openen of geen toestemming verleend.');
    }
  };

  // 3D Animation Loop
  useEffect(() => {
    if (state.mode === '3d') {
      let isMounted = true;
      const loop = () => {
        if (!isMounted) return;
        rotRef.current.x += 0.02 * state.rotationSpeed;
        rotRef.current.y += 0.03 * state.rotationSpeed;

        const asciiStr = render3DObject(
          state.shape3D,
          rotRef.current.x,
          rotRef.current.y,
          65,
          32,
          state.zoom3D
        );
        const grid = colorizeAsciiText(asciiStr, state.colorTheme, state.direction);
        setDynamicAscii({ text: asciiStr, grid });

        animationFrameRef.current = requestAnimationFrame(loop);
      };

      animationFrameRef.current = requestAnimationFrame(loop);
      return () => {
        isMounted = false;
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      };
    }
  }, [state.mode, state.shape3D, state.rotationSpeed, state.zoom3D, state.colorTheme, state.direction]);

  // Audio Visualizer Loop
  useEffect(() => {
    if (state.mode === 'audio' || state.radioPlaying) {
      let isMounted = true;
      const loop = () => {
        if (!isMounted) return;
        if (state.mode === 'audio') {
          const freqData = audioService.getSpectrumData();
          const asciiEq = renderAsciiEqualizer(
            freqData,
            state.audioBars,
            15,
            state.audioStyle
          );
          const grid = colorizeAsciiText(asciiEq, state.colorTheme, state.direction);
          setDynamicAscii({ text: asciiEq, grid });
        }
        animationFrameRef.current = requestAnimationFrame(loop);
      };

      animationFrameRef.current = requestAnimationFrame(loop);
      return () => {
        isMounted = false;
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      };
    }
  }, [state.mode, state.audioBars, state.audioStyle, state.colorTheme, state.direction, state.radioPlaying]);

  // Video Frame Loop
  useEffect(() => {
    if (state.mode === 'video' && videoElementRef.current) {
      let isMounted = true;
      const vid = videoElementRef.current;

      const loop = () => {
        if (!isMounted) return;
        if (vid.readyState >= 2) {
          const result = processImageToAscii(vid as any, {
            columns: state.columns,
            charset: state.charset,
            customCharset: state.customCharset,
            contrast: state.contrast,
            brightness: state.brightness,
            invert: state.invert,
            dithering: state.dithering,
            colorMode: state.colorMode,
            theme: state.colorTheme,
            direction: state.direction,
            monoColor: state.monoColor
          });
          setDynamicAscii(result);
        }
        animationFrameRef.current = requestAnimationFrame(loop);
      };

      animationFrameRef.current = requestAnimationFrame(loop);
      return () => {
        isMounted = false;
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      };
    }
  }, [
    state.mode,
    state.columns,
    state.charset,
    state.customCharset,
    state.contrast,
    state.brightness,
    state.invert,
    state.dithering,
    state.colorMode,
    state.colorTheme,
    state.direction,
    state.monoColor
  ]);

  // Process static Image when parameters change
  useEffect(() => {
    if ((state.mode === 'image' || state.mode === 'converter') && imageElementRef.current && state.imageUrl) {
      const result = processImageToAscii(imageElementRef.current, {
        columns: state.columns,
        charset: state.charset,
        customCharset: state.customCharset,
        contrast: state.contrast,
        brightness: state.brightness,
        invert: state.invert,
        dithering: state.dithering,
        colorMode: state.colorMode,
        theme: state.colorTheme,
        direction: state.direction,
        monoColor: state.monoColor
      });
      setDynamicAscii(result);
    }
  }, [
    state.imageUrl,
    state.mode,
    state.columns,
    state.charset,
    state.customCharset,
    state.contrast,
    state.brightness,
    state.invert,
    state.dithering,
    state.colorMode,
    state.colorTheme,
    state.direction,
    state.monoColor
  ]);

  // Compute Text Mode Output
  const textAsciiData = useMemo(() => {
    if (state.mode !== 'text') return null;
    const raw = renderAsciiText(
      state.text,
      state.font,
      state.letterSpacing,
      state.lineHeight,
      state.textAlign
    );
    const grid = colorizeAsciiText(raw, state.colorTheme, state.direction);
    return { text: raw, grid };
  }, [state.mode, state.text, state.font, state.letterSpacing, state.lineHeight, state.textAlign, state.colorTheme, state.direction]);

  // Current Grid & Raw Text to display
  const activeAscii = useMemo(() => {
    if (state.mode === 'text' && textAsciiData) {
      return textAsciiData;
    }
    if (dynamicAscii) {
      return dynamicAscii;
    }
    // Default fallback to text
    const raw = renderAsciiText(state.text, state.font, state.letterSpacing, state.lineHeight, state.textAlign);
    return { text: raw, grid: colorizeAsciiText(raw, state.colorTheme, state.direction) };
  }, [state.mode, textAsciiData, dynamicAscii, state.text, state.font, state.letterSpacing, state.lineHeight, state.textAlign, state.colorTheme, state.direction]);

  return (
    <div className={`w-screen h-screen flex flex-col bg-[#0e1310] text-[#c7d5c5] select-none ${state.theme === 'dark' ? 'dark' : ''}`}>
      {/* Top Navbar */}
      <Navbar
        state={state}
        updateState={updateState}
        onOpenTokens={() => setActiveModal('tokens')}
        onOpenPricing={() => setActiveModal('pricing')}
        onOpenGallery={() => setActiveModal('gallery')}
        onOpenCinema={() => setActiveModal('cinema')}
        onOpenTools={() => setActiveModal('tools')}
      />

      {/* Main Studio Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Control Sidebar */}
        <SidebarLeft
          state={state}
          updateState={updateState}
          onFileUpload={handleFileUpload}
          onTriggerWebcam={handleTriggerWebcam}
        />

        {/* Central Visualizer / Editor Canvas */}
        <CanvasView
          state={state}
          updateState={updateState}
          asciiGrid={activeAscii.grid}
          rawAsciiText={activeAscii.text}
          onOpenPricing={() => setActiveModal('pricing')}
        />
      </div>

      {/* Bottom Converters Shortcuts */}
      <FooterConverters
        currentMode={state.mode}
        onSelectMode={(m) => {
          if (m === 'audio') {
            audioService.startMic();
          }
          updateState({ mode: m });
        }}
      />

      {/* Modals & Dialogs */}
      <Modals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        onSelectArt={(text) => {
          updateState({ text, mode: 'text' });
        }}
        onAddTokens={(amount) => {
          updateState({ tokens: state.tokens + amount });
        }}
      />
    </div>
  );
}

export default App;
