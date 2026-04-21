import type { RGB } from "../core/image-buffer.js";

export function grayscale(color: RGB): RGB {
  const lum = Math.round(0.299 * color.r + 0.587 * color.g + 0.114 * color.b);
  return { r: lum, g: lum, b: lum };
}

const PALETTES: Record<string, RGB[]> = {
  cga: [
    { r: 0, g: 0, b: 0 },
    { r: 85, g: 255, b: 255 },
    { r: 255, g: 85, b: 255 },
    { r: 255, g: 255, b: 255 },
  ],
  gameboy: [
    { r: 15, g: 56, b: 15 },
    { r: 48, g: 98, b: 48 },
    { r: 139, g: 172, b: 15 },
    { r: 155, g: 188, b: 15 },
  ],
  websafe: (() => {
    const colors: RGB[] = [];
    for (let r = 0; r <= 255; r += 51)
      for (let g = 0; g <= 255; g += 51)
        for (let b = 0; b <= 255; b += 51)
          colors.push({ r, g, b });
    return colors;
  })(),
};

function colorDistance(a: RGB, b: RGB): number {
  return (a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2;
}

export function limitPalette(color: RGB, paletteName: string): RGB {
  const palette = PALETTES[paletteName];
  if (!palette) return color;

  let closest = palette[0];
  let minDist = colorDistance(color, closest);
  for (let i = 1; i < palette.length; i++) {
    const dist = colorDistance(color, palette[i]);
    if (dist < minDist) {
      minDist = dist;
      closest = palette[i];
    }
  }
  return { ...closest };
}

export function applyFilters(
  grid: RGB[][],
  options: { grayscale: boolean; palette: string | null; dither: boolean }
): RGB[][] {
  let result = grid.map((row) => row.map((c) => ({ ...c })));

  if (options.grayscale) {
    result = result.map((row) => row.map(grayscale));
  }

  if (options.palette) {
    if (options.dither) {
      result = floydSteinberg(result, options.palette);
    } else {
      result = result.map((row) => row.map((c) => limitPalette(c, options.palette!)));
    }
  }

  return result;
}

function floydSteinberg(grid: RGB[][], paletteName: string): RGB[][] {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  // Work on float copy
  const work = grid.map((row) => row.map((c) => ({ r: c.r, g: c.g, b: c.b })));

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const old = work[y][x];
      const quantized = limitPalette(old, paletteName);
      work[y][x] = quantized;
      const errR = old.r - quantized.r;
      const errG = old.g - quantized.g;
      const errB = old.b - quantized.b;

      const spread = (dx: number, dy: number, factor: number) => {
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && nx < cols && ny < rows) {
          work[ny][nx].r = Math.max(0, Math.min(255, work[ny][nx].r + errR * factor));
          work[ny][nx].g = Math.max(0, Math.min(255, work[ny][nx].g + errG * factor));
          work[ny][nx].b = Math.max(0, Math.min(255, work[ny][nx].b + errB * factor));
        }
      };
      spread(1, 0, 7 / 16);
      spread(-1, 1, 3 / 16);
      spread(0, 1, 5 / 16);
      spread(1, 1, 1 / 16);
    }
  }
  return work.map((row) => row.map((c) => ({ r: Math.round(c.r), g: Math.round(c.g), b: Math.round(c.b) })));
}
