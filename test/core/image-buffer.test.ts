import { describe, it, expect } from "bun:test";
import { ImageBuffer } from "../../src/core/image-buffer.js";

describe("ImageBuffer", () => {
  it("loads a local PNG and exposes dimensions", async () => {
    const buf = await ImageBuffer.fromFile("fixtures/test-4x4.png");
    expect(buf.width).toBe(4);
    expect(buf.height).toBe(4);
  });

  it("reads pixel color at coordinates", async () => {
    const buf = await ImageBuffer.fromFile("fixtures/test-4x4.png");
    const pixel = buf.getPixel(0, 0);
    expect(pixel).toEqual({ r: 255, g: 0, b: 0 });
  });

  it("averages a region of pixels", async () => {
    const buf = await ImageBuffer.fromFile("fixtures/test-4x4.png");
    // Average of top-left 2x2: (255,0,0), (0,255,0), (255,0,255), (0,255,255)
    const avg = buf.averageRegion(0, 0, 2, 2);
    expect(avg.r).toBeCloseTo(127.5, 0);
    expect(avg.g).toBeCloseTo(127.5, 0);
    expect(avg.b).toBeCloseTo(127.5, 0);
  });

  it("creates a blank buffer with specified dimensions and color", () => {
    const buf = ImageBuffer.blank(10, 8, { r: 255, g: 255, b: 255 });
    expect(buf.width).toBe(10);
    expect(buf.height).toBe(8);
    expect(buf.getPixel(5, 5)).toEqual({ r: 255, g: 255, b: 255 });
  });
});
