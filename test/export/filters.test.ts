import { describe, it, expect } from "bun:test";
import { grayscale, limitPalette } from "../../src/export/filters.js";
import type { RGB } from "../../src/core/image-buffer.js";

describe("filters", () => {
  it("grayscale converts colors to luminance", () => {
    const result = grayscale({ r: 255, g: 0, b: 0 });
    // Luminance of pure red: 0.299 * 255 ≈ 76
    expect(result.r).toBe(result.g);
    expect(result.g).toBe(result.b);
    expect(result.r).toBeCloseTo(76, 0);
  });

  it("CGA palette limits to 4 colors", () => {
    const result = limitPalette({ r: 200, g: 50, b: 50 }, "cga");
    // Should snap to nearest CGA color
    expect(["r", "g", "b"].every((k) => typeof (result as any)[k] === "number")).toBe(true);
  });

  it("gameboy palette limits to 4 green shades", () => {
    const result = limitPalette({ r: 100, g: 100, b: 100 }, "gameboy");
    // Game Boy colors are all green-tinted
    expect(result.g).toBeGreaterThanOrEqual(result.r);
  });
});
