# ⌘ ASCIICraft Studio (ASCIIgenerator)

<div align="center">

```text
   ____   _____ _____ _____ _____                __  __ 
  / __ \ / ____/ ____|_   _|_   _|              / _|/ _|
 / /  | | (___| |      | |   | |  ___ _ __ __ _| |_| |_ 
| |   | |\___ \ |      | |   | | / __| '__/ _` |  _|  _|
| |__| |____) | |____ _| |_ _| || (__| | | (_| | | | |  
 \____/|_____/ \_____|_____|_____|\___|_|  \__,_|_| |_|  
                                                         
            ✳ HET CREATIEVE ATELIER · THE CREATIVE STUDIO ✳
```

[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-f5a623?style=for-the-badge)](LICENSE)

*A full-featured, client-side retro terminal ASCII art creative suite inspired by [asciicraft.com](https://asciicraft.com/converter).*

[Features](#-key-features) • [Quick Start](#-getting-started) • [Converters](#-multi-format-converters) • [Themes & Effects](#-themes--visual-effects) • [Deployment](#-firebase-deployment)

</div>

---

## 🌟 Overview

**ASCIICraft Studio** is an all-in-one browser-based workstation for generating, styling, and animating ASCII art from text, images, videos, 3D wireframes, and live audio feeds. Designed with an authentic 80s/cyberpunk terminal aesthetic, CRT scanlines, multi-directional gradients, and vibrant neon glows.

All processing is **100% client-side** using high-performance Canvas, Web Audio API, and custom mathematical renderers — guaranteeing instant feedback and complete privacy.

---

## 🚀 Key Features

### 🔤 1. Text to ASCII (FIGLET Typography)
- Multi-line ASCII banner generation with real-time character and line counters.
- **7 Built-in FIGLET Fonts**: *Slant*, *Standard*, *Block 3D*, *Isometric*, *Bubble / Rounded*, *Mini Pixel*, and *Doom*.
- Fine-grained controls for **Letter Spacing**, **Line Height**, and **Alignment** (*Left*, *Center*, *Right*).
- Interactive presets and animated text modes (*Rainbow Cycle*, *Wave*, *Pulse*, *Matrix Rain*, *Glitch*).

### 🖼️ 2. Image to ASCII Converter
- Drag-and-drop or file browser upload for PNG, JPG, WebP, SVG, and GIF.
- **11 Curated Character Sets**:
  - `Classic`: ` .:-=+*#%@`
  - `Detailed (70+ chars)`: Extended ramp for photographic contrast
  - `Blocks`: ` ░▒▓█`
  - `Braille HD`: High-density Braille dot mapping
  - `Matrix`: ` 01` binary digital rain
  - `Binary`, `Hexadecimal`, `Geometric`, `Math Symbols`, `Slashes`, and `Custom Chars`
- **Floyd-Steinberg Dithering** for sharp edge definition and natural gradients.
- Contrast (-100 to +100), Brightness (-100 to +100), Inversion, and Column Resolution (20–200 columns).
- **Color Modes**: Full Truecolor RGB extraction, Monochromatic Phosphor Green / Amber, or Gradient Themed.

### 🎥 3. Video & Live Webcam to ASCII
- Real-time frame-by-frame ASCII conversion for MP4 and WebM videos.
- **Live Webcam Mirror**: Instant retro ASCII streaming straight from your camera.
- Frame-rate throttling and loop playback controls.

### 🍩 4. Interactive 3D ASCII Art
- Real-time 3D rendered and shaded wireframes in pure ASCII:
  - **Torus (Donut)**: Mathematical donut raymarching with perspective shading.
  - **3D Cube**: Shaded polygon faces and edge perspective projection.
  - **Sphere**: Spherical normal dot-product light calculations.
  - **DNA Double Helix**: Continuously rotating genetic strand with rungs.
  - **Pyramid**: Geometric 3D polygonal volume.
- Interactive controls for **Rotation Speed** and **Zoom Scale**.

### 🎵 5. ASCII Audio Visualizer
- Web Audio API spectrum analyser with responsive frequency bins.
- Three visualization formats: **Bars** (` ▂▃▄▅▆▇█`), **Waveform Points**, and **Matrix Pulse**.
- Microphone input support with real-time sensitivity slider.

### 📻 6. Radio Pixel • ON AIR
- Embedded generative Lo-Fi / Synthwave ambient player.
- Generates warm vintage chord progressions and dreamy arpeggiated chimes using Web Audio oscillators.
- Ambient background music while creating artwork in the atelier.

### 💾 7. Multi-Format Export Options
- **Copy Raw Text**: Plain ASCII string copied instantly to clipboard.
- **Copy Styled HTML**: Pre-formatted HTML `<pre>` with inline CSS colors.
- **Download PNG**: High-resolution rendered canvas with dark CRT background, retro fonts, and neon glow.
- **Download WebP**: Optimized modern web image format.
- **Download Vector SVG**: Scalable vector art with embedded font styling.
- **Download TXT**: Plain text file.
- Built-in confetti celebrations on successful export!

---

## 🎨 Themes & Visual Effects

Quick-selector ribbons at the top of the canvas allow one-click style cycling:

| Setting | Options |
| :--- | :--- |
| **THEME** | `Rainbow`, `Synthwave`, `Cyberpunk`, `Matrix`, `Sunset`, `Fire`, `Ice`, `Toxic`, `Neon Pink`, `Gold`, `Monochrome`, `Hacker`, `Pastel` |
| **DIRECTION** | `Horizontal`, `Vertical`, `Diagonal`, `Radial` |
| **EFFECT** | `None`, `3D Extrusion`, `Neon Glow`, `Glitch`, `Emboss`, `Drop Shadow` |
| **GLOW** | `None`, `Neon Pink`, `Cyan`, `Green`, `Gold`, `Violet`, `White` |

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Tooling**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/)
- **Typography**: [Google Fonts](https://fonts.google.com/) (*JetBrains Mono*, *Space Mono*, *VT323*, *Fira Code*)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Sound Engine**: Web Audio API (Generative synthesis & FFT Analyser)
- **Effects**: Canvas Confetti

---

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- `npm` or `pnpm` or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/slashbot28/ASCIIgenerator.git
   cd ASCIIgenerator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173/`

4. **Build for production:**
   ```bash
   npm run build
   ```
   The compiled static assets will be output to the `dist/` folder.

---

## 🔥 Firebase Deployment

This project includes a pre-configured `firebase.json` for **Firebase Hosting**:

1. **Install Firebase CLI (if not already installed):**
   ```bash
   npx firebase-tools login
   ```

2. **Select your Firebase project:**
   ```bash
   npx firebase-tools use <YOUR_PROJECT_ID>
   ```

3. **Deploy with a single command:**
   ```bash
   npm run build
   npx firebase-tools deploy --only hosting
   ```

---

## 📁 Project Structure

```
ascii-generator/
├── public/
│   ├── favicon.svg          # Studio browser icon
│   └── icons.svg            # Graphic icons
├── src/
│   ├── assets/              # Static media assets
│   ├── components/
│   │   ├── CanvasView.tsx   # Art viewport, quick ribbons & export controls
│   │   ├── FooterConverters.tsx # Bottom shortcuts bar
│   │   ├── Modals.tsx       # Tokens, Gallery, Cinema, Pricing & Tools dialogs
│   │   ├── Navbar.tsx       # Studio navigation, Radio Pixel & ticker news
│   │   └── SidebarLeft.tsx  # Upload box, Text tabs, 3D & Image sliders
│   ├── types/
│   │   └── index.ts         # TypeScript interfaces & state definitions
│   ├── utils/
│   │   ├── asciiConverter.ts # Image/Video pixel-to-ASCII & color interpolator
│   │   ├── audioVisualizer.ts # Web Audio synth engine & spectrum visualizer
│   │   ├── exportUtils.ts   # PNG/WebP/SVG/TXT/HTML canvas exporters & confetti
│   │   ├── figletFonts.ts   # FIGLET ASCII letter matrices & text renderer
│   │   └── threeDModel.ts   # Math models for Torus, Cube, Sphere & DNA
│   ├── App.tsx              # Root studio state orchestrator
│   ├── index.css            # Tailwind directives, CRT scanlines & glow effects
│   └── main.tsx             # React DOM entry point
├── firebase.json            # Firebase Hosting configuration
├── tailwind.config.js       # Studio palette and font configuration
└── vite.config.ts           # Vite bundler configuration
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/slashbot28/ASCIIgenerator/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <sub>Crafted with passion in Het Creatieve Atelier ✳</sub>
</div>
