import type { Tool, ToolContext, ToolResult } from "./types.js";
import { Sampler } from "../core/sampler.js";

export class EyedropperTool implements Tool {
  name = "eyedropper";

  apply(ctx: ToolContext): ToolResult {
    const grid = Sampler.sample(ctx.image, ctx.viewport, ctx.editLayer);
    const color = grid[ctx.row]?.[ctx.col];
    if (!color) return {};
    return { fgColor: color, switchToPreviousTool: true };
  }
}
