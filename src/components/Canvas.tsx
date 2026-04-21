import { Box, Text, useStdout } from "ink";
import { useEffect, useRef, useState } from "react";
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
  const gridRef = useRef<import("../core/image-buffer.js").RGB[][] | null>(null);
  const [cursorTick, setCursorTick] = useState(0);

  // Rainbow cursor tick — re-render at ~12fps so the hue cycles smoothly
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorTick((t) => t + 1);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  // Main render
  useEffect(() => {
    if (!image || !viewport) return;

    const canvasOffsetX = 5;
    const canvasOffsetY = 1;
    const termSize = viewport.getTermSize();

    if (!rendererRef.current) {
      rendererRef.current = new CanvasRenderer(
        canvasOffsetX, canvasOffsetY, termSize.w, termSize.h
      );
    }

    const grid = Sampler.sample(image, viewport, editLayer);
    gridRef.current = grid;
    rendererRef.current.render(grid, cursorCol, cursorRow, true);
  }, [image, editLayer, viewport, cursorCol, cursorRow, cursorTick]);

  if (!image) {
    return (
      <Box flexGrow={1} justifyContent="center" alignItems="center">
        <Text color="gray">No image loaded. Use :o filename or :new</Text>
      </Box>
    );
  }

  const termSize = viewport?.getTermSize() ?? { w: 40, h: 20 };
  return (
    <Box flexGrow={1} width={termSize.w} height={termSize.h}>
      <Text>{" ".repeat(termSize.w * termSize.h)}</Text>
    </Box>
  );
}
