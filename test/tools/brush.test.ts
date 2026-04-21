import { describe, it, expect } from "bun:test";
import { BrushTool } from "../../src/tools/brush.js";
import { EditLayer } from "../../src/core/edit-layer.js";
import { Viewport } from "../../src/core/viewport.js";
import { ImageBuffer } from "../../src/core/image-buffer.js";

describe("BrushTool", () => {
  it("paints foreground color at cursor position", () => {
    const image = ImageBuffer.blank(20, 20, { r: 255, g: 255, b: 255 });
    const editLayer = new EditLayer(20, 20);
    const viewport = new Viewport(20, 20, 10, 10);
    const brush = new BrushTool();

    const result = brush.apply({
      image, editLayer, viewport,
      fgColor: { r: 255, g: 0, b: 0 },
      bgColor: { r: 255, g: 255, b: 255 },
      brushSize: 1, col: 0, row: 0,
    });

    expect(result.editLayer).toBeDefined();
    // The edit should be in source coords corresponding to cell (0,0)
    const region = viewport.cellToSourceRegion(0, 0);
    const color = result.editLayer!.getRegionColor(region.x, region.y, region.w, region.h);
    expect(color).toEqual({ r: 255, g: 0, b: 0 });
  });
});
