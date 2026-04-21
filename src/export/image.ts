import sharp from "sharp";
import { useStore } from "../state/store.js";
import { Sampler } from "../core/sampler.js";
import { applyFilters } from "./filters.js";

export async function exportImage(filename: string, blockSize = 16) {
  const { image, editLayer, viewport, grayscale: gs, palette, dither } = useStore.getState();
  if (!image || !viewport) throw new Error("No image loaded");

  const grid = Sampler.sample(image, viewport, editLayer);
  const filtered = applyFilters(grid, { grayscale: gs, palette, dither });

  const rows = filtered.length;
  const cols = filtered[0]?.length ?? 0;
  const outW = cols * blockSize;
  const outH = rows * blockSize;

  const pixels = Buffer.alloc(outW * outH * 3);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const color = filtered[r][c];
      for (let dy = 0; dy < blockSize; dy++) {
        for (let dx = 0; dx < blockSize; dx++) {
          const idx = ((r * blockSize + dy) * outW + (c * blockSize + dx)) * 3;
          pixels[idx] = color.r;
          pixels[idx + 1] = color.g;
          pixels[idx + 2] = color.b;
        }
      }
    }
  }

  await sharp(pixels, { raw: { width: outW, height: outH, channels: 3 } })
    .toFile(filename);
}
