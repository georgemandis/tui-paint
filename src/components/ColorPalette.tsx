import { Box, Text } from "ink";
import { useStore, MS_PAINT_PALETTE } from "../state/store.js";

export function ColorPalette() {
  const recentColors = useStore((s) => s.recentColors);

  return (
    <Box paddingX={1} gap={0}>
      {MS_PAINT_PALETTE.map((c, i) => (
        <Text key={i} color={`rgb(${c.r},${c.g},${c.b})`}>█</Text>
      ))}
      <Text> </Text>
      {recentColors.map((c, i) => (
        <Text key={`r${i}`} color={`rgb(${c.r},${c.g},${c.b})`}>█</Text>
      ))}
    </Box>
  );
}
