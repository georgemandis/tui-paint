#!/usr/bin/env bun
import { resolve } from "path";
import { render } from "ink";
import { App } from "./App.js";
import pkg from "../package.json";

const args = process.argv.slice(2);

// --- CLI flags (handled before entering the TUI) ---
if (args.includes("--help") || args.includes("-h")) {
  console.log(`PaTUI v${pkg.version} — terminal-based image editor

Usage: patui [options] [file-or-url]

Options:
  --help, -h        Show this help
  --version, -v     Show version number
  --new WxH         Start with blank canvas (e.g., --new 200x100)

Controls:
  :help             Full interactive help (inside the editor)
  :q                Quit`);
  process.exit(0);
}

if (args.includes("--version") || args.includes("-v")) {
  console.log(`patui v${pkg.version}`);
  process.exit(0);
}

let source: string | null = null;
let newWidth: number | undefined;
let newHeight: number | undefined;

const newIdx = args.indexOf("--new");
if (newIdx !== -1) {
  const dims = args[newIdx + 1];
  const match = dims?.match(/^(\d+)x(\d+)$/);
  if (!match) {
    console.error("Invalid dimensions. Use: --new 200x100");
    process.exit(1);
  }
  newWidth = parseInt(match[1]);
  newHeight = parseInt(match[2]);
} else {
  const raw = args.find((a) => !a.startsWith("-")) || null;
  const isUrl = raw?.startsWith("http://") || raw?.startsWith("https://");
  source = raw && !isUrl ? resolve(process.env.PATUI_CWD || process.cwd(), raw) : raw;
}

// Enter alt screen for fullscreen TUI
process.stdout.write("\x1b[?1049h");
process.stdout.write("\x1b[?25l"); // hide cursor

const { unmount } = render(<App source={source} width={newWidth} height={newHeight} />, {
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
