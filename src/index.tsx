#!/usr/bin/env bun
import { resolve } from "path";
import { render } from "ink";
import { App } from "./App.js";

const args = process.argv.slice(2);
const raw = args[0] || null;
const isUrl = raw?.startsWith("http://") || raw?.startsWith("https://");
const source = raw && !isUrl ? resolve(process.env.PATUI_CWD || process.cwd(), raw) : raw;

// Enter alt screen for fullscreen TUI
process.stdout.write("\x1b[?1049h");
process.stdout.write("\x1b[?25l"); // hide cursor

const { unmount } = render(<App source={source} />, {
  exitOnCtrlC: false,
});

process.on("exit", () => {
  process.stdout.write("\x1b[?25h"); // show cursor
  process.stdout.write("\x1b[?1049l"); // exit alt screen
});

process.on("SIGINT", () => {
  unmount();
  process.exit(0);
});
