import type { Shape3D } from '../types';

export function render3DDonut(A: number, B: number, width = 70, height = 35): string {
  const b: string[] = [];
  const z: number[] = [];
  const size = width * height;

  for (let k = 0; k < size; k++) {
    b[k] = ' ';
    z[k] = 0;
  }

  const R1 = 1;
  const R2 = 2;
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
      const fu = u / steps;
      for (let v = 0; v <= steps; v++) {
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

export function render3DDNA(rot: number, width = 70, height = 35): string {
  const grid: string[][] = Array(height).fill(null).map(() => Array(width).fill(' '));
  const amplitude = 14;

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

export function render3DObject(shape: Shape3D, rotX: number, rotY: number, width = 70, height = 35, zoom = 1): string {
  switch (shape) {
    case 'torus':
      return render3DDonut(rotX, rotY, width, height);
    case 'cube':
      return render3DCube(rotX, rotY, width, height, zoom);
    case 'sphere':
      return render3DSphere(rotX, rotY, width, height, zoom);
    case 'dna':
      return render3DDNA(rotY, width, height);
    case 'pyramid':
      return render3DCube(rotX * 0.8, rotY * 0.8, width, height, zoom * 0.9);
  }
}

