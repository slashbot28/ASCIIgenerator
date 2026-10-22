import type { Shape3D } from '../types';

// 1. 3D Rotating Text Ring (Cylinder of Text in 3D Space)
export function render3DTextRing(
  text: string,
  rotY: number,
  rotX: number,
  width = 70,
  height = 35,
  zoom = 1
): string {
  const grid: string[][] = Array(height).fill(null).map(() => Array(width).fill(' '));
  const zBuffer: number[][] = Array(height).fill(null).map(() => Array(width).fill(-1000));

  const cleanText = (text && text.trim().length > 0 ? text.trim() : 'ASCIICRAFT') + ' • ';
  // Repeat text to make a full circular ribbon
  const repeatedText = cleanText.length < 15 ? cleanText.repeat(Math.ceil(20 / cleanText.length)) : cleanText;
  const n = repeatedText.length;

  const radius = 18 * zoom;
  const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
  const cosX = Math.cos(rotX * 0.7), sinX = Math.sin(rotX * 0.7);

  // We draw 3 vertical tracks (top border, text, bottom border)
  const tracks = [
    { dy: -2.5, charMode: 'border' },
    { dy: 0, charMode: 'text' },
    { dy: 2.5, charMode: 'border' }
  ];

  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2;
    const char = repeatedText[i];

    // Base position on circle
    const baseX = Math.sin(angle) * radius;
    const baseZ = Math.cos(angle) * radius;

    for (const track of tracks) {
      const baseY = track.dy * zoom;

      // Rotate around Y
      let x = baseX * cosY + baseZ * sinY;
      let y = baseY;
      let z = -baseX * sinY + baseZ * cosY;

      // Rotate around X
      const y2 = y * cosX - z * sinX;
      const z2 = y * sinX + z * cosX;

      const cameraDistance = 35;
      const ooz = 1 / (z2 + cameraDistance);

      const screenX = Math.floor(width / 2 + x * ooz * 38);
      const screenY = Math.floor(height / 2 + y2 * ooz * 38 * 0.6);

      if (screenX >= 0 && screenX < width && screenY >= 0 && screenY < height) {
        if (z2 > zBuffer[screenY][screenX]) {
          zBuffer[screenY][screenX] = z2;
          if (track.charMode === 'text') {
            grid[screenY][screenX] = char;
          } else {
            grid[screenY][screenX] = z2 > 0 ? '─' : '·';
          }
        }
      }
    }
  }

  return grid.map(row => row.join('')).join('\n');
}

// 2. 3D Floating Text Billboard / Banner (Tilting & Wobbling in Space)
export function render3DTextBanner(
  text: string,
  rotX: number,
  rotY: number,
  width = 70,
  height = 35,
  zoom = 1
): string {
  const grid: string[][] = Array(height).fill(null).map(() => Array(width).fill(' '));
  const zBuffer: number[][] = Array(height).fill(null).map(() => Array(width).fill(-1000));

  const cleanText = text && text.trim().length > 0 ? text.trim() : 'ASCIICRAFT 3D';
  const len = cleanText.length;

  const cosY = Math.cos(rotY * 0.8), sinY = Math.sin(rotY * 0.8);
  const cosX = Math.cos(rotX * 0.8), sinX = Math.sin(rotX * 0.8);

  const charSpacing = 2.4 * zoom;
  const startX = -((len - 1) * charSpacing) / 2;

  // Box border offset
  for (let i = 0; i < len; i++) {
    const ch = cleanText[i];
    const px = startX + i * charSpacing;

    // Sample character plus top/bottom 3D bounding box
    const samples = [
      { y: -3 * zoom, char: '═' },
      { y: 0, char: ch },
      { y: 3 * zoom, char: '═' }
    ];

    for (const s of samples) {
      // 3D rotation
      let x = px * cosY;
      let y = s.y;
      let z = -px * sinY;

      const y2 = y * cosX - z * sinX;
      const z2 = y * sinX + z * cosX;

      const ooz = 1 / (z2 + 35);
      const screenX = Math.floor(width / 2 + x * ooz * 38);
      const screenY = Math.floor(height / 2 + y2 * ooz * 38 * 0.6);

      if (screenX >= 0 && screenX < width && screenY >= 0 && screenY < height) {
        if (z2 > zBuffer[screenY][screenX]) {
          zBuffer[screenY][screenX] = z2;
          grid[screenY][screenX] = s.char;
        }
      }
    }
  }

  return grid.map(row => row.join('')).join('\n');
}

// 3. 3D Diamond / Octahedron
export function render3DDiamond(rotX: number, rotY: number, width = 70, height = 35, zoom = 1): string {
  const grid: string[][] = Array(height).fill(null).map(() => Array(width).fill(' '));
  const zBuffer: number[][] = Array(height).fill(null).map(() => Array(width).fill(-1000));

  // Octahedron vertices: Top, Bottom, and 4 equator points
  const s = 1.3 * zoom;
  const vertices = [
    [0, -2 * s, 0],   // 0: Top apex
    [0, 2 * s, 0],    // 1: Bottom apex
    [-1.6 * s, 0, 0], // 2: Left
    [1.6 * s, 0, 0],  // 3: Right
    [0, 0, -1.6 * s], // 4: Front
    [0, 0, 1.6 * s],  // 5: Back
  ];

  const faces = [
    { v: [0, 4, 3], char: '█' },
    { v: [0, 3, 5], char: '▓' },
    { v: [0, 5, 2], char: '▒' },
    { v: [0, 2, 4], char: '░' },
    { v: [1, 3, 4], char: '▓' },
    { v: [1, 5, 3], char: '▒' },
    { v: [1, 2, 5], char: '░' },
    { v: [1, 4, 2], char: '#' }
  ];

  const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
  const cosY = Math.cos(rotY), sinY = Math.sin(rotY);

  const rotate = (p: number[]) => {
    let x = p[0] * cosY + p[2] * sinY;
    let y = p[1];
    let z = -p[0] * sinY + p[2] * cosY;

    const y2 = y * cosX - z * sinX;
    const z2 = y * sinX + z * cosX;
    return [x, y2, z2];
  };

  const scale = 11;

  for (const face of faces) {
    const v0 = rotate(vertices[face.v[0]]);
    const v1 = rotate(vertices[face.v[1]]);
    const v2 = rotate(vertices[face.v[2]]);

    const steps = 16;
    for (let u = 0; u <= steps; u++) {
      for (let v = 0; u + v <= steps; v++) {
        const fu = u / steps;
        const fv = v / steps;
        const fw = 1 - fu - fv;

        const px = fw * v0[0] + fu * v1[0] + fv * v2[0];
        const py = fw * v0[1] + fu * v1[1] + fv * v2[1];
        const pz = fw * v0[2] + fu * v1[2] + fv * v2[2];

        const screenX = Math.floor(width / 2 + px * scale);
        const screenY = Math.floor(height / 2 + py * scale * 0.55);

        if (screenX >= 0 && screenX < width && screenY >= 0 && screenY < height) {
          if (pz > zBuffer[screenY][screenX]) {
            zBuffer[screenY][screenX] = pz;
            grid[screenY][screenX] = face.char;
          }
        }
      }
    }
  }

  return grid.map(row => row.join('')).join('\n');
}

// 4. 3D Cyber Tunnel / Wormhole
export function render3DTunnel(rot: number, width = 70, height = 35, zoom = 1): string {
  const grid: string[][] = Array(height).fill(null).map(() => Array(width).fill(' '));
  const rings = 12;
  const segments = 24;

  for (let r = 0; r < rings; r++) {
    // Distance from camera
    const z = (r * 1.5 + (rot * 3) % 1.5) + 1;
    const radius = (18 / z) * zoom;
    const ringChar = r % 2 === 0 ? '█' : '▓';

    for (let s = 0; s < segments; s++) {
      const angle = (s / segments) * Math.PI * 2 + (r * 0.2);
      const px = Math.cos(angle) * radius;
      const py = Math.sin(angle) * radius * 0.6;

      const screenX = Math.floor(width / 2 + px);
      const screenY = Math.floor(height / 2 + py);

      if (screenX >= 0 && screenX < width && screenY >= 0 && screenY < height) {
        grid[screenY][screenX] = ringChar;
      }
    }
  }

  return grid.map(row => row.join('')).join('\n');
}

// 5. 3D Heart
export function render3DHeart(rotX: number, rotY: number, width = 70, height = 35, zoom = 1): string {
  const grid: string[][] = Array(height).fill(null).map(() => Array(width).fill(' '));
  const zBuffer: number[][] = Array(height).fill(null).map(() => Array(width).fill(-1000));

  const cosX = Math.cos(rotX * 0.6), sinX = Math.sin(rotX * 0.6);
  const cosY = Math.cos(rotY), sinY = Math.sin(rotY);

  const shades = ' .:-=+*#%@';

  for (let t = 0; t < Math.PI * 2; t += 0.1) {
    for (let p = -Math.PI; p < Math.PI; p += 0.15) {
      // 3D parametric heart formula
      const r = (1 - Math.sin(t));
      const hx = 16 * Math.pow(Math.sin(t), 3) * Math.cos(p) * 0.08 * zoom;
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 0.08 * zoom;
      const hz = r * Math.sin(p) * 0.6 * zoom;

      let x = hx * cosY + hz * sinY;
      let y = hy;
      let z = -hx * sinY + hz * cosY;

      const y2 = y * cosX - z * sinX;
      const z2 = y * sinX + z * cosX;

      const scale = 14;
      const screenX = Math.floor(width / 2 + x * scale);
      const screenY = Math.floor(height / 2 + y2 * scale * 0.55);

      if (screenX >= 0 && screenX < width && screenY >= 0 && screenY < height) {
        if (z2 > zBuffer[screenY][screenX]) {
          zBuffer[screenY][screenX] = z2;
          const lum = Math.max(0, Math.min(1, (z2 + 1.2) / 2.4));
          const idx = Math.floor(lum * (shades.length - 1));
          grid[screenY][screenX] = shades[idx];
        }
      }
    }
  }

  return grid.map(row => row.join('')).join('\n');
}

// 6. 3D Star / Celestial Gem
export function render3DStar(rotX: number, rotY: number, width = 70, height = 35, zoom = 1): string {
  const grid: string[][] = Array(height).fill(null).map(() => Array(width).fill(' '));
  const zBuffer: number[][] = Array(height).fill(null).map(() => Array(width).fill(-1000));

  const points = 5;
  const innerR = 6 * zoom;
  const outerR = 14 * zoom;
  const depth = 4 * zoom;

  const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
  const cosY = Math.cos(rotY), sinY = Math.sin(rotY);

  for (let i = 0; i < points * 2; i++) {
    const angle1 = (i / (points * 2)) * Math.PI * 2;
    const angle2 = ((i + 1) / (points * 2)) * Math.PI * 2;
    const r1 = i % 2 === 0 ? outerR : innerR;
    const r2 = (i + 1) % 2 === 0 ? outerR : innerR;

    const x1 = Math.cos(angle1) * r1, y1 = Math.sin(angle1) * r1;
    const x2 = Math.cos(angle2) * r2, y2 = Math.sin(angle2) * r2;

    // Draw front apex to edge triangle
    for (let t = 0; t <= 1; t += 0.08) {
      const ex = x1 + t * (x2 - x1);
      const ey = y1 + t * (y2 - y1);

      // Line from center tip (0, 0, depth) to edge
      for (let s = 0; s <= 1; s += 0.15) {
        const px = ex * s;
        const py = ey * s;
        const pz = (1 - s) * depth;

        let x = px * cosY + pz * sinY;
        let y = py;
        let z = -px * sinY + pz * cosY;

        const y2 = y * cosX - z * sinX;
        const z2 = y * sinX + z * cosX;

        const screenX = Math.floor(width / 2 + x);
        const screenY = Math.floor(height / 2 + y2 * 0.55);

        if (screenX >= 0 && screenX < width && screenY >= 0 && screenY < height) {
          if (z2 > zBuffer[screenY][screenX]) {
            zBuffer[screenY][screenX] = z2;
            grid[screenY][screenX] = z2 > 0 ? '★' : '·';
          }
        }
      }
    }
  }

  return grid.map(row => row.join('')).join('\n');
}

// Original 3D Donut
export function render3DDonut(A: number, B: number, width = 70, height = 35, zoom = 1): string {
  const b: string[] = [];
  const z: number[] = [];
  const size = width * height;

  for (let k = 0; k < size; k++) {
    b[k] = ' ';
    z[k] = 0;
  }

  const R1 = 1 * zoom;
  const R2 = 2 * zoom;
  const K2 = 5;
  const K1 = (width * K2 * 3) / (8 * (R1 + R2));

  const cosA = Math.cos(A);
  const sinA = Math.sin(A);
  const cosB = Math.cos(B);
  const sinB = Math.sin(B);

  for (let theta = 0; theta < 6.28; theta += 0.07) {
    const costheta = Math.cos(theta);
    const sintheta = Math.sin(theta);

    for (let phi = 0; phi < 6.28; phi += 0.02) {
      const cosphi = Math.cos(phi);
      const sinphi = Math.sin(phi);

      const circlex = R2 + R1 * costheta;
      const circley = R1 * sintheta;

      const x = circlex * (cosB * cosphi + sinA * sinB * sinphi) - circley * cosA * sinB;
      const y = circlex * (sinB * cosphi - sinA * cosB * sinphi) + circley * cosA * cosB;
      const cz = K2 + cosA * circlex * sinphi + circley * sinA;
      const ooz = 1 / cz;

      const xp = Math.floor(width / 2 + K1 * ooz * x);
      const yp = Math.floor(height / 2 - K1 * ooz * y * 0.55);

      const L =
        cosphi * costheta * sinB -
        cosA * costheta * sinphi -
        sinA * sintheta +
        cosB * (cosA * sintheta - costheta * sinA * sinphi);

      if (L > 0) {
        if (xp >= 0 && xp < width && yp >= 0 && yp < height) {
          const idx = xp + yp * width;
          if (ooz > z[idx]) {
            z[idx] = ooz;
            const lumChars = '.,-~:;=!*#$@';
            const lumIdx = Math.floor(L * 8);
            b[idx] = lumChars[Math.max(0, Math.min(lumChars.length - 1, lumIdx))];
          }
        }
      }
    }
  }

  const lines: string[] = [];
  for (let i = 0; i < height; i++) {
    lines.push(b.slice(i * width, (i + 1) * width).join(''));
  }
  return lines.join('\n');
}

// Original 3D Cube
export function render3DCube(rotX: number, rotY: number, width = 70, height = 35, zoom = 1): string {
  const grid: string[][] = Array(height).fill(null).map(() => Array(width).fill(' '));
  const zBuffer: number[][] = Array(height).fill(null).map(() => Array(width).fill(-1000));

  const vertices = [
    [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
    [-1, -1, 1],  [1, -1, 1],  [1, 1, 1],  [-1, 1, 1]
  ];

  const faces = [
    { v: [0, 1, 2, 3], char: '░' },
    { v: [5, 4, 7, 6], char: '█' },
    { v: [4, 0, 3, 7], char: '▒' },
    { v: [1, 5, 6, 2], char: '▓' },
    { v: [3, 2, 6, 7], char: '#' },
    { v: [4, 5, 1, 0], char: '=' }
  ];

  const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
  const cosY = Math.cos(rotY), sinY = Math.sin(rotY);

  const rotate = (p: number[]) => {
    const x = p[0] * cosY + p[2] * sinY;
    const y = p[1];
    const z = -p[0] * sinY + p[2] * cosY;

    const y2 = y * cosX - z * sinX;
    const z2 = y * sinX + z * cosX;
    return [x, y2, z2];
  };

  const scale = 12 * zoom;

  for (const face of faces) {
    const v0 = rotate(vertices[face.v[0]]);
    const v1 = rotate(vertices[face.v[1]]);
    const v2 = rotate(vertices[face.v[2]]);
    const v3 = rotate(vertices[face.v[3]]);

    const steps = 18;
    for (let u = 0; u <= steps; u++) {
      for (let v = 0; v <= steps; v++) {
        const fu = u / steps;
        const fv = v / steps;
        const px = (1 - fu) * (1 - fv) * v0[0] + fu * (1 - fv) * v1[0] + fu * fv * v2[0] + (1 - fu) * fv * v3[0];
        const py = (1 - fu) * (1 - fv) * v0[1] + fu * (1 - fv) * v1[1] + fu * fv * v2[1] + (1 - fu) * fv * v3[1];
        const pz = (1 - fu) * (1 - fv) * v0[2] + fu * (1 - fv) * v1[2] + fu * fv * v2[2] + (1 - fu) * fv * v3[2];

        const screenX = Math.floor(width / 2 + px * scale);
        const screenY = Math.floor(height / 2 + py * scale * 0.55);

        if (screenX >= 0 && screenX < width && screenY >= 0 && screenY < height) {
          if (pz > zBuffer[screenY][screenX]) {
            zBuffer[screenY][screenX] = pz;
            grid[screenY][screenX] = face.char;
          }
        }
      }
    }
  }

  return grid.map(row => row.join('')).join('\n');
}

// Original 3D Sphere
export function render3DSphere(rotX: number, rotY: number, width = 70, height = 35, zoom = 1): string {
  const grid: string[][] = Array(height).fill(null).map(() => Array(width).fill(' '));
  const radius = 10 * zoom;
  const shades = ' .:-=+*#%@';

  const lightX = Math.cos(rotY) * 0.8;
  const lightY = Math.sin(rotX) * 0.8;
  const lightZ = 1.0;
  const lightLen = Math.sqrt(lightX * lightX + lightY * lightY + lightZ * lightZ);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = (x - width / 2);
      const dy = (y - height / 2) / 0.55;
      const d2 = dx * dx + dy * dy;

      if (d2 <= radius * radius) {
        const dz = Math.sqrt(radius * radius - d2);
        const nx = dx / radius;
        const ny = dy / radius;
        const nz = dz / radius;

        const dot = (nx * lightX + ny * lightY + nz * lightZ) / lightLen;
        const lum = Math.max(0, Math.min(1, (dot + 0.3) / 1.3));
        const idx = Math.floor(lum * (shades.length - 1));
        grid[y][x] = shades[idx];
      }
    }
  }

  return grid.map(row => row.join('')).join('\n');
}

// Original 3D DNA
export function render3DDNA(rot: number, width = 70, height = 35, zoom = 1): string {
  const grid: string[][] = Array(height).fill(null).map(() => Array(width).fill(' '));
  const amplitude = 14 * zoom;

  for (let y = 0; y < height; y++) {
    const angle = (y * 0.3) + rot;
    const x1 = Math.round(width / 2 + Math.sin(angle) * amplitude);
    const x2 = Math.round(width / 2 - Math.sin(angle) * amplitude);
    const z1 = Math.cos(angle);
    const z2 = -z1;

    if (y % 2 === 0) {
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      for (let rx = minX + 1; rx < maxX; rx++) {
        if (rx >= 0 && rx < width) {
          grid[y][rx] = '=';
        }
      }
    }

    if (x1 >= 0 && x1 < width) {
      grid[y][x1] = z1 > 0 ? '●' : '○';
    }
    if (x2 >= 0 && x2 < width) {
      grid[y][x2] = z2 > 0 ? '◆' : '◇';
    }
  }

  return grid.map(row => row.join('')).join('\n');
}

// Master 3D Object Dispatcher
export function render3DObject(
  shape: Shape3D,
  rotX: number,
  rotY: number,
  width = 70,
  height = 35,
  zoom = 1,
  customText = 'ASCIICRAFT'
): string {
  switch (shape) {
    case 'textRing':
      return render3DTextRing(customText, rotY, rotX, width, height, zoom);
    case 'textBanner':
      return render3DTextBanner(customText, rotX, rotY, width, height, zoom);
    case 'diamond':
      return render3DDiamond(rotX, rotY, width, height, zoom);
    case 'tunnel':
      return render3DTunnel(rotY, width, height, zoom);
    case 'heart':
      return render3DHeart(rotX, rotY, width, height, zoom);
    case 'star':
      return render3DStar(rotX, rotY, width, height, zoom);
    case 'torus':
      return render3DDonut(rotX, rotY, width, height, zoom);
    case 'cube':
      return render3DCube(rotX, rotY, width, height, zoom);
    case 'sphere':
      return render3DSphere(rotX, rotY, width, height, zoom);
    case 'dna':
      return render3DDNA(rotY, width, height, zoom);
    case 'pyramid':
      return render3DCube(rotX * 0.8, rotY * 0.8, width, height, zoom * 0.85);
  }
}
