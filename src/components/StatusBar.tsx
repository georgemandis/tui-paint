import { Box, Text } from "ink";
import { useStore } from "../state/store.js";

const MODE_LABELS = {
  normal: "-- NORMAL --",
  paint: "-- PAINT --",
  visual: "-- VISUAL --",
  command: ":",
};

export function StatusBar() {
  const mode = useStore((s) => s.mode);
  const tool = useStore((s) => s.tool);
  const brushSize = useStore((s) => s.brushSize);
  const viewport = useStore((s) => s.viewport);
  const filename = useStore((s) => s.filename);
  const message = useStore((s) => s.message);
  const commandText = useStore((s) => s.commandText);

  const zoom = viewport?.getZoom() ?? 1;

  return (
    <Box justifyContent="space-between" paddingX={1}>
      <Text color="yellow">
        {mode === "command" ? `:${commandText}` : MODE_LABELS[mode]}
      </Text>
      {message ? (
        <Text color="gray">{message}</Text>
      ) : (
        <>
          <Text color="white">{tool}({brushSize})</Text>
          <Text color="white">Zoom:{zoom}x</Text>
          <Text color="gray">{filename ?? "[no file]"}</Text>
        </>
      )}
    </Box>
  );
}
