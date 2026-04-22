import { describe, it, expect } from "bun:test";
import { resolveColor, getHueFamily, fuzzyColorMatch } from "../../src/core/colors.js";

describe("resolveColor", () => {
  it("resolves a CSS color name to RGB", () => {
    expect(resolveColor("red")).toEqual({ r: 255, g: 0, b: 0 });
  });

  it("is case-insensitive", () => {
    expect(resolveColor("Red")).toEqual({ r: 255, g: 0, b: 0 });
    expect(resolveColor("CORNFLOWERBLUE")).toEqual({ r: 100, g: 149, b: 237 });
  });

  it("resolves a palette number string (1-16)", () => {
    // Palette color 1 is black {0,0,0}
    expect(resolveColor("1")).toEqual({ r: 0, g: 0, b: 0 });
    // Palette color 11 is bright red {255,0,0}
    expect(resolveColor("11")).toEqual({ r: 255, g: 0, b: 0 });
  });

  it("returns null for invalid input", () => {
    expect(resolveColor("notacolor")).toBeNull();
    expect(resolveColor("0")).toBeNull();
    expect(resolveColor("17")).toBeNull();
    expect(resolveColor("")).toBeNull();
  });

  it("prefers CSS name over palette number when both could match", () => {
    // CSS names are checked first; numbers only match as palette indices
    expect(resolveColor("red")).toEqual({ r: 255, g: 0, b: 0 });
  });
});

describe("getHueFamily", () => {
  it("classifies pure red", () => {
    expect(getHueFamily({ r: 255, g: 0, b: 0 })).toBe("red");
  });

  it("classifies near-red with fractional hue (h ≈ 359.8)", () => {
    // {255, 0, 1} produces hue ~359.8, must still be classified as red
    expect(getHueFamily({ r: 255, g: 0, b: 1 })).toBe("red");
  });

  it("classifies pure blue", () => {
    expect(getHueFamily({ r: 0, g: 0, b: 255 })).toBe("blue");
  });

  it("classifies pure green", () => {
    expect(getHueFamily({ r: 0, g: 255, b: 0 })).toBe("green");
  });

  it("classifies white and near-white", () => {
    expect(getHueFamily({ r: 255, g: 255, b: 255 })).toBe("white");
    expect(getHueFamily({ r: 245, g: 245, b: 245 })).toBe("white");
  });

  it("classifies black and near-black", () => {
    expect(getHueFamily({ r: 0, g: 0, b: 0 })).toBe("black");
    expect(getHueFamily({ r: 15, g: 15, b: 15 })).toBe("black");
  });

  it("classifies gray", () => {
    expect(getHueFamily({ r: 128, g: 128, b: 128 })).toBe("gray");
    expect(getHueFamily({ r: 192, g: 192, b: 192 })).toBe("gray");
  });

  it("classifies navy as blue", () => {
    expect(getHueFamily({ r: 0, g: 0, b: 128 })).toBe("blue");
  });

  it("classifies brown", () => {
    // saddlebrown: {139, 69, 19}
    expect(getHueFamily({ r: 139, g: 69, b: 19 })).toBe("brown");
  });

  it("classifies chocolate as orange (high saturation excludes it from brown)", () => {
    // chocolate: {210, 105, 30} — hue ~25, saturation ~75%, lightness ~47%
    // Saturation exceeds 60% brown threshold, so falls through to hue table -> orange
    expect(getHueFamily({ r: 210, g: 105, b: 30 })).toBe("orange");
  });

  it("classifies pink/magenta range", () => {
    expect(getHueFamily({ r: 255, g: 0, b: 255 })).toBe("pink");
    expect(getHueFamily({ r: 255, g: 192, b: 203 })).toBe("pink");
  });

  it("classifies cyan", () => {
    expect(getHueFamily({ r: 0, g: 255, b: 255 })).toBe("cyan");
  });

  it("classifies orange", () => {
    expect(getHueFamily({ r: 255, g: 165, b: 0 })).toBe("orange");
  });

  it("classifies purple", () => {
    expect(getHueFamily({ r: 128, g: 0, b: 128 })).toBe("purple");
  });
});

describe("fuzzyColorMatch", () => {
  it("matches two blues", () => {
    expect(fuzzyColorMatch({ r: 0, g: 0, b: 255 }, { r: 0, g: 0, b: 128 })).toBe(true);
  });

  it("does not match blue and red", () => {
    expect(fuzzyColorMatch({ r: 0, g: 0, b: 255 }, { r: 255, g: 0, b: 0 })).toBe(false);
  });

  it("matches two grays", () => {
    expect(fuzzyColorMatch({ r: 128, g: 128, b: 128 }, { r: 192, g: 192, b: 192 })).toBe(true);
  });
});
