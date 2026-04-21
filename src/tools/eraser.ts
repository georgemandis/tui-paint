import type { Tool, ToolContext, ToolResult } from "./types.js";

export class EraserTool implements Tool {
  name = "eraser";

  apply(ctx: ToolContext): ToolResult {
    const region = ctx.viewport.cellToSourceRegion(ctx.col, ctx.row);
    const newLayer = ctx.editLayer.clone();
    newLayer.paintRegion(region.x, region.y, region.w, region.h, ctx.bgColor);
    return { editLayer: newLayer };
  }
}
