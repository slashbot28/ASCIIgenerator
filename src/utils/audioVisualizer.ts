// Web Audio API Synthesizer & Spectrum Analyser for ASCII Audio Visualizer and Radio Pixel

class AudioEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private isRadioPlaying = false;
  private radioTimer: number | null = null;
  private masterGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.25;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Start Radio Pixel (Generative Lo-Fi / Synthwave Chord Progression)
  public startRadio(onTrackChange?: (name: string) => void) {
    this.initContext();
    if (!this.ctx || !this.analyser || !this.masterGain) return;

    this.isRadioPlaying = true;
    if (onTrackChange) onTrackChange('Radio Pixel · Cyber Lofi Lounge #04');

    // Synth chord frequencies (D minor 9th / Bb maj7 / C maj / F maj)
    const chords = [
      [146.83, 220.0, 261.63, 329.63], // Dm9
      [116.54, 174.61, 233.08, 293.66], // Bbmaj7
      [130.81, 196.0, 261.63, 329.63], // Cmaj
      [174.61, 220.0, 261.63, 349.23], // Fmaj7
    ];

    let chordIndex = 0;

    const playChord = () => {
      if (!this.isRadioPlaying || !this.ctx || !this.analyser || !this.masterGain) return;

      const currentChord = chords[chordIndex];
      chordIndex = (chordIndex + 1) % chords.length;

      const chordGain = this.ctx.createGain();
      chordGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      chordGain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 1.2);
      chordGain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 3.8);

      chordGain.connect(this.analyser);
      this.analyser.connect(this.masterGain);

      // Warm retro pad oscillators
      currentChord.forEach(freq => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        // Lowpass filter for dreamy vintage tone
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450 + Math.random() * 200, this.ctx.currentTime);

        osc.connect(filter);
        filter.connect(chordGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 4.0);
      });

      // Subtle arpeggio chime
      const arpFreq = currentChord[Math.floor(Math.random() * currentChord.length)] * 2;
      const arpOsc = this.ctx.createOscillator();
      const arpGain = this.ctx.createGain();
      arpOsc.type = 'sine';
      arpOsc.frequency.setValueAtTime(arpFreq, this.ctx.currentTime + 0.5);

      arpGain.gain.setValueAtTime(0.001, this.ctx.currentTime + 0.5);
      arpGain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.7);
      arpGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.2);

      arpOsc.connect(arpGain);
      arpGain.connect(this.analyser);

      arpOsc.start(this.ctx.currentTime + 0.5);
      arpOsc.stop(this.ctx.currentTime + 2.2);

      this.radioTimer = window.setTimeout(playChord, 3800);
    };

    playChord();
  }

  public stopRadio() {
    this.isRadioPlaying = false;
    if (this.radioTimer) {
      clearTimeout(this.radioTimer);
      this.radioTimer = null;
    }
  }

  public getIsRadioPlaying(): boolean {
    return this.isRadioPlaying;
  }

  public setVolume(val: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime);
    }
  }

  // Connect microphone for live visualizer
  public async startMic(): Promise<boolean> {
    try {
      this.initContext();
      if (!this.ctx || !this.analyser) return false;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = this.ctx.createMediaStreamSource(stream);
      source.connect(this.analyser);
      return true;
    } catch {
      return false;
    }
  }

  // Get current spectrum data
  public getSpectrumData(): Uint8Array {
    if (!this.analyser) {
      return new Uint8Array(32);
    }
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }
}

export const audioService = new AudioEngine();

// Render Frequency Data to ASCII Visualizer Frame
export function renderAsciiEqualizer(
  data: Uint8Array,
  columns = 40,
  rows = 14,
  style: 'bars' | 'wave' | 'matrix' = 'bars'
): string {
  const barBlocks = [' ', ' ', '▂', '▃', '▄', '▅', '▆', '▇', '█'];
  const grid: string[][] = Array(rows).fill(null).map(() => Array(columns).fill(' '));

  const binStep = Math.max(1, Math.floor(data.length / columns));

  for (let c = 0; c < columns; c++) {
    const rawVal = data[c * binStep] || 0;
    // Normalize to height
    const normalized = (rawVal / 255);
    const heightInBlocks = Math.round(normalized * rows);

    for (let r = 0; r < rows; r++) {
      const targetRow = rows - 1 - r;
      if (style === 'bars') {
        if (r < heightInBlocks) {
          const blockChar = r === heightInBlocks - 1 ? barBlocks[Math.min(8, Math.floor((rawVal % 32) / 4) + 1)] : '█';
          grid[targetRow][c] = blockChar;
        }
      } else if (style === 'wave') {
        if (r === heightInBlocks) {
          grid[targetRow][c] = '●';
        } else if (r === heightInBlocks - 1 || r === heightInBlocks + 1) {
          grid[targetRow][c] = '·';
        }
      } else {
        // Matrix style
        if (r < heightInBlocks) {
          grid[targetRow][c] = (c + r) % 2 === 0 ? '1' : '0';
        }
      }
    }
  }

  return grid.map(row => row.join('')).join('\n');
}

