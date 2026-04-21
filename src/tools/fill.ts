import type { Tool, ToolContext, ToolResult } from "./types.js";
import type { RGB } from "../core/image-buffer.js";
import { Sampler } from "../core/sampler.js";

export class FillTool implements Tool {
  name = "fill";

  apply(ctx: ToolContext): ToolResult {
    const grid = Sampler.sample(ctx.image, ctx.viewport, ctx.editLayer);
    const { w: cols, h: rows } = ctx.viewport.getTermSize();
    const targetColor = grid[ctx.row]?.[ctx.col];
    if (!targetColor) return {};

    // Don't fill if target is same as fill color
    if (targetColor.r === ctx.fgColor.r && targetColor.g === ctx.fgColor.g && targetColor.b === ctx.fgColor.b) {
      return {};
    }

    const newLayer = ctx.editLayer.clone();
    const visited = new Set<string>();
    const stack: [number, number][] = [[ctx.col, ctx.row]];
    const tolerance = 30; // color matching tolerance

    while (stack.length > 0) {
      const [c, r] = stack.pop()!;
      const key = `${c},${r}`;
      if (visited.has(key)) continue;
      if (c < 0 || c >= cols || r < 0 || r >= rows) continue;

      const cellColor = grid[r][c];
      if (!this.colorsMatch(cellColor, targetColor, tolerance)) continue;

      visited.add(key);
      const region = ctx.viewport.cellToSourceRegion(c, r);
      newLayer.paintRegion(region.x, region.y, region.w, region.h, ctx.fgColor);

      stack.push([c + 1, r], [c - 1, r], [c, r + 1], [c, r - 1]);
    }

    return { editLayer: newLayer };
  }

  private colorsMatch(a: RGB, b: RGB, tolerance: number): boolean {
    return Math.abs(a.r - b.r) <= tolerance
      && Math.abs(a.g - b.g) <= tolerance
      && Math.abs(a.b - b.b) <= tolerance;
  }
}
