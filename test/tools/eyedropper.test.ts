import { describe, it, expect } from "bun:test";
import { EyedropperTool } from "../../src/tools/eyedropper.js";
import { EditLayer } from "../../src/core/edit-layer.js";
import { Viewport } from "../../src/core/viewport.js";
import { ImageBuffer } from "../../src/core/image-buffer.js";

describe("EyedropperTool", () => {
  it("picks color from canvas and sets as fg", () => {
    const image = ImageBuffer.blank(10, 10, { r: 100, g: 150, b: 200 });
    const editLayer = new EditLayer(10, 10);
    const viewport = new Viewport(10, 10, 10, 10);
    const dropper = new EyedropperTool();

    const result = dropper.apply({
      image, editLayer, viewport,
      fgColor: { r: 0, g: 0, b: 0 },
      bgColor: { r: 255, g: 255, b: 255 },
      brushSize: 1, col: 5, row: 5,
    });

    expect(result.fgColor).toEqual({ r: 100, g: 150, b: 200 });
    expect(result.switchToPreviousTool).toBe(true);
  });
});
