declare module 'gifshot' {
  export interface GifOptions {
    images?: (string | HTMLCanvasElement | HTMLImageElement)[];
    video?: string[];
    gifWidth?: number;
    gifHeight?: number;
    interval?: number;
    numFrames?: number;
    frameDuration?: number;
    sampleInterval?: number;
    numWorkers?: number;
  }

  export interface GifResponse {
    error: boolean;
    errorCode?: string;
    errorMsg?: string;
    image: string; // base64 data url
  }

  export function createGIF(
    options: GifOptions,
    callback: (obj: GifResponse) => void
  ): void;

  export function isSupported(): boolean;
}

