import sharp from "sharp";

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export class ImageBuffer {
  readonly width: number;
  readonly height: number;
  private data: Buffer; // Raw RGB pixels, 3 bytes per pixel

  private constructor(width: number, height: number, data: Buffer) {
    this.width = width;
    this.height = height;
    this.data = data;
  }

  static async fromFile(path: string): Promise<ImageBuffer> {
    const image = sharp(path);
    const metadata = await image.metadata();
    const raw = await image.removeAlpha().raw().toBuffer();
    return new ImageBuffer(metadata.width!, metadata.height!, raw);
  }

  static async fromUrl(url: string): Promise<ImageBuffer> {
    const response = await fetch(url);
    const arrayBuf = await response.arrayBuffer();
    const image = sharp(Buffer.from(arrayBuf));
    const metadata = await image.metadata();
    const raw = await image.removeAlpha().raw().toBuffer();
    return new ImageBuffer(metadata.width!, metadata.height!, raw);
  }

  static blank(width: number, height: number, color: RGB): ImageBuffer {
    const data = Buffer.alloc(width * height * 3);
    for (let i = 0; i < width * height; i++) {
      data[i * 3] = color.r;
      data[i * 3 + 1] = color.g;
      data[i * 3 + 2] = color.b;
    }
    return new ImageBuffer(width, height, data);
  }

  getPixel(x: number, y: number): RGB {
    const idx = (y * this.width + x) * 3;
    return { r: this.data[idx], g: this.data[idx + 1], b: this.data[idx + 2] };
  }

  averageRegion(x: number, y: number, w: number, h: number): RGB {
    let totalR = 0, totalG = 0, totalB = 0;
    let count = 0;
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        const px = x + dx;
        const py = y + dy;
        if (px < this.width && py < this.height) {
          const pixel = this.getPixel(px, py);
          totalR += pixel.r;
          totalG += pixel.g;
          totalB += pixel.b;
          count++;
        }
      }
    }
    return { r: totalR / count, g: totalG / count, b: totalB / count };
  }
}
