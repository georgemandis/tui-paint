import { describe, it, expect } from "bun:test";
import { generateAnsi } from "../../src/export/ansi.js";
import { useStore } from "../../src/state/store.js";
import { ImageBuffer } from "../../src/core/image-buffer.js";
import { Viewport } from "../../src/core/viewport.js";
import { EditLayer } from "../../src/core/edit-layer.js";

describe("generateAnsi", () => {
  it("generates ANSI colored block output", () => {
    // Set up store with a tiny image
    const image = ImageBuffer.blank(2, 2, { r: 255, g: 0, b: 0 });
    const viewport = new Viewport(2, 2, 2, 2);
    const editLayer = new EditLayer(2, 2);
    useStore.setState({ image, viewport, editLayer });

    const output = generateAnsi(true);
    expect(output).toContain("\x1b[38;2;255;0;0m");
    expect(output).toContain("\u2588");
  });

  it("generates plain block output without color", () => {
    const image = ImageBuffer.blank(2, 2, { r: 255, g: 0, b: 0 });
    const viewport = new Viewport(2, 2, 2, 2);
    const editLayer = new EditLayer(2, 2);
    useStore.setState({ image, viewport, editLayer });

    const output = generateAnsi(false);
    expect(output).not.toContain("\x1b[");
    expect(output).toContain("\u2588");
  });
});
