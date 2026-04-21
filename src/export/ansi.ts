import { useStore } from "../state/store.js";
import { Sampler } from "../core/sampler.js";
import { applyFilters } from "./filters.js";

export function generateAnsi(withColor: boolean): string {
  const { image, editLayer, viewport, grayscale: gs, palette, dither } = useStore.getState();
  if (!image || !viewport) throw new Error("No image loaded");

  const grid = Sampler.sample(image, viewport, editLayer);
  const filtered = applyFilters(grid, { grayscale: gs, palette, dither });

  let output = "";
  for (const row of filtered) {
    for (const pixel of row) {
      if (withColor) {
        output += `\x1b[38;2;${pixel.r};${pixel.g};${pixel.b}m\u2588`;
      } else {
        output += "\u2588";
      }
    }
    output += withColor ? "\x1b[0m\n" : "\n";
  }
  return output;
}

export async function exportAnsi(filename: string, withColor: boolean) {
  const content = generateAnsi(withColor);
  await Bun.write(filename, content);
}
