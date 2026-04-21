import { Box, Text } from "ink";

const MENUS = ["File", "Edit", "View", "Image", "Help"];

export function MenuBar() {
  return (
    <Box
      borderStyle="single"
      borderBottom={true}
      borderLeft={false}
      borderRight={false}
      borderTop={false}
      paddingX={1}
    >
      {MENUS.map((menu) => (
        <Text key={menu} color="white">
          {menu}{"  "}
        </Text>
      ))}
    </Box>
  );
}
