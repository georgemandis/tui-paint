import { describe, it, expect } from "bun:test";
import { FillTool } from "../../src/tools/fill.js";
import { EditLayer } from "../../src/core/edit-layer.js";
import { Viewport } from "../../src/core/viewport.js";
import { ImageBuffer } from "../../src/core/image-buffer.js";

describe("FillTool", () => {
  it("fills connected same-color cells", () => {
    const image = ImageBuffer.blank(10, 10, { r: 255, g: 255, b: 255 });
    const editLayer = new EditLayer(10, 10);
    const viewport = new Viewport(10, 10, 10, 10);
    const fill = new FillTool();

    const result = fill.apply({
      image, editLayer, viewport,
      fgColor: { r: 255, g: 0, b: 0 },
      bgColor: { r: 255, g: 255, b: 255 },
      brushSize: 1, col: 0, row: 0,
    });

    expect(result.editLayer).toBeDefined();
    // Should have filled the entire canvas since it's all one color
    const region = viewport.cellToSourceRegion(5, 5);
    const color = result.editLayer!.getRegionColor(region.x, region.y, region.w, region.h);
    expect(color).toEqual({ r: 255, g: 0, b: 0 });
  });

  it("does nothing if target color matches fill color", () => {
    const image = ImageBuffer.blank(10, 10, { r: 255, g: 0, b: 0 });
    const editLayer = new EditLayer(10, 10);
    const viewport = new Viewport(10, 10, 10, 10);
    const fill = new FillTool();

    const result = fill.apply({
      image, editLayer, viewport,
      fgColor: { r: 255, g: 0, b: 0 },
      bgColor: { r: 255, g: 255, b: 255 },
      brushSize: 1, col: 0, row: 0,
    });

    expect(result.editLayer).toBeUndefined();
  });
});
