import type { RGB } from "../core/image-buffer.js";
import type { EditLayer } from "../core/edit-layer.js";
import type { Viewport } from "../core/viewport.js";
import type { ImageBuffer } from "../core/image-buffer.js";

export interface ToolContext {
  image: ImageBuffer;
  editLayer: EditLayer;
  viewport: Viewport;
  fgColor: RGB;
  bgColor: RGB;
  brushSize: number;
  /** The viewport cell the cursor is on */
  col: number;
  row: number;
}

export interface ToolResult {
  editLayer?: EditLayer;
  fgColor?: RGB;
  switchToPreviousTool?: boolean;
}

export interface Tool {
  name: string;
  /** Called when the tool is activated (space/enter, or cursor move in paint mode) */
  apply(ctx: ToolContext): ToolResult;
}
