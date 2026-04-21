import { Box, Text, useStdout } from "ink";
import { useEffect, useRef } from "react";
import { useStore } from "../state/store.js";
import { CanvasRenderer } from "../core/canvas-renderer.js";
import { Sampler } from "../core/sampler.js";

export function Canvas() {
  const { stdout } = useStdout();
  const image = useStore((s) => s.image);
  const editLayer = useStore((s) => s.editLayer);
  const viewport = useStore((s) => s.viewport);
  const cursorCol = useStore((s) => s.cursorCol);
  const cursorRow = useStore((s) => s.cursorRow);
  const rendererRef = useRef<CanvasRenderer | null>(null);

  useEffect(() => {
    if (!image || !viewport) return;

    // Calculate canvas area position (after toolbar sidebar)
    const canvasOffsetX = 5; // sidebar width
    const canvasOffsetY = 1; // menu bar height
    const termSize = viewport.getTermSize();

    if (!rendererRef.current) {
      rendererRef.current = new CanvasRenderer(
        canvasOffsetX, canvasOffsetY, termSize.w, termSize.h
      );
    }

    const grid = Sampler.sample(image, viewport, editLayer);
    rendererRef.current.render(grid, cursorCol, cursorRow);
  }, [image, editLayer, viewport, cursorCol, cursorRow]);

  if (!image) {
    return (
      <Box flexGrow={1} justifyContent="center" alignItems="center">
        <Text color="gray">No image loaded. Use :o filename or :new</Text>
      </Box>
    );
  }

  // Reserve space for the canvas — actual rendering is via direct stdout writes
  const termSize = viewport?.getTermSize() ?? { w: 40, h: 20 };
  return (
    <Box flexGrow={1} width={termSize.w} height={termSize.h}>
      <Text>{" ".repeat(termSize.w * termSize.h)}</Text>
    </Box>
  );
}
