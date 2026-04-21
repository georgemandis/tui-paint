import { generateAnsi } from "./ansi.js";

export async function copyToClipboard() {
  const ansi = generateAnsi(true);
  const proc = Bun.spawn(["pbcopy"], {
    stdin: "pipe",
  });
  proc.stdin.write(ansi);
  proc.stdin.end();
  await proc.exited;
}
