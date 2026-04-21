# TUI Paint — MS Paint meets Vim, in your terminal

A terminal-based MS Paint clone with Vim-style modal controls, bringing pixel art creation to your command line. Load real images and render them as hilariously low-resolution "chonky pixels" (█ blocks), with a zoom mechanic that transforms the Mona Lisa into a muddy brown square and back into recognizable ASCII art.

## What it does

TUI Paint loads images (PNG, JPEG, or URLs) and renders them as large ASCII blocks in your terminal. The zoom feature is the star: zoom out to see your entire image as one giant pixelated blob, zoom in to explore intricate ASCII detail. Use Vim-style modal editing to paint, erase, fill, sample colors, and export your work in multiple formats—PNG, ANSI, or plain text.

## Installation

```bash
# Clone and install dependencies
bun install

# Run with an image
bun src/index.tsx [image-path-or-url]
```

## Usage

```bash
# Load a local image
tui-paint mona.png

# Load from URL
tui-paint https://example.com/image.png

# Start with blank canvas
tui-paint

# Specify canvas dimensions
tui-paint --size 80x40
tui-paint image.png --size 120x60
```

## Controls

### Modes

| Mode | Enter via | Behavior |
|------|-----------|----------|
| Normal | Esc | Move cursor, switch tools, zoom, access commands |
| Paint | i or p | Cursor movement applies active tool |
| Visual | v | Rectangle selection for bulk operations |
| Command | : | Text command input for actions and filters |

### Normal Mode Keys

| Key | Action |
|-----|--------|
| h/j/k/l or arrows | Move cursor up/down/left/right |
| b | Select brush tool |
| e | Select eraser tool |
| f | Select fill (bucket) tool |
| d | Select eyedropper (color picker) tool |
| + or = | Zoom in |
| - or _ | Zoom out |
| i or p | Enter Paint mode |
| v | Enter Visual mode |
| : | Enter Command mode |
| u | Undo |
| Ctrl+R | Redo |
| 1-9 | Quick select palette color |
| Space or Enter | Apply tool at cursor position |

### Commands (enter with `:`)

| Command | Action |
|---------|--------|
| `:o [file-or-url]` | Open image file or URL |
| `:new [W H]` | Create new blank canvas (dimensions optional) |
| `:w [file.png/.ans/.txt]` | Export canvas to file |
| `:wc` | Copy ANSI-colored version to clipboard |
| `:wq` | Export PNG and quit |
| `:q` | Quit |
| `:q!` | Quit without saving |
| `:set zoom N` | Set zoom level to N |
| `:set brush N` | Set brush size to N pixels |
| `:gray` | Toggle grayscale filter |
| `:palette cga\|gameboy\|websafe` | Limit colors to palette |
| `:dither` | Toggle Floyd-Steinberg dithering |
| `:reset` | Remove all filters and return to original |
| `:help` | Show in-app help |

## Keyboard Shortcuts

- **Paint mode + Space**: Apply tool to single cell
- **Paint mode + drag**: Apply tool across multiple cells
- **Visual mode + selection**: Outline shows selected rectangle
- **Undo/Redo**: Works across undo history within session

## Export Formats

### PNG
Export your final work as a standard PNG image:
```
:w output.png
```

### ANSI Text
Create a colored text file with ANSI escape codes, perfect for terminal display or scripts:
```
:w output.ans
```

### Plain Text
Export as pure ASCII without colors:
```
:w output.txt
```

### Clipboard
Copy the ANSI-colored version to your clipboard for instant pasting into terminals or documents:
```
:wc
```

## Filters

### Grayscale
Remove color, keeping only luminance values:
```
:gray
```
Toggle on and off without losing color data underneath.

### Palette Limiting
Reduce color palette to match retro systems:

- **CGA**: 4 colors (classic PC)
- **Game Boy**: 4 shades of green
- **Websafe**: 216 colors

```
:palette cga
:palette gameboy
:palette websafe
```

### Dithering
Apply Floyd-Steinberg dithering for better color approximation with limited palettes:
```
:dither
```

### Reset
Clear all filters and return to original colors:
```
:reset
```

## Layout

```
┌─────────────────────────────────────────────┐
│ File  Edit  View  Image  Help               │
├────┬────────────────────────────────────────┤
│ [B]│                                        │
│ [E]│                                        │
│ [F]│         Canvas Area                    │
│ [D]│      (chonky █ pixels)                 │
│ [S]│                                        │
│ [Z]│                                        │
│    │                                        │
│ FG │                                        │
│ BG │                                        │
├────┴────────────────────────────────────────┤
│ ████████████████  [recent colors]           │
├─────────────────────────────────────────────┤
│ -- NORMAL --  brush(1)  Zoom:1x  mona.png  │
└─────────────────────────────────────────────┘
```

**Left panel**: Tool selector and color swatches
**Center**: Main canvas with rendered pixels
**Bottom bar**: Mode indicator, brush size, zoom level, filename

## Tech Stack

- **Bun** — Fast JavaScript runtime and package manager
- **TypeScript** — Type-safe code
- **Ink** — React for terminal UIs
- **sharp** — Image processing and resizing
- **zustand** — Lightweight state management

## Tips & Tricks

- Use **zoom out** to see your whole image and plan big changes
- Use **zoom in** to work on details and create ASCII art effects
- **Eyedropper tool** (d) picks colors from your canvas, great for maintaining consistency
- **Fill tool** (f) works in connected regions—limit it with visual mode selection
- **Undo** (u) and **Redo** (Ctrl+R) are unlimited within your session
- Export as **ANSI** and share terminal art with friends
- Use **dithering** with palette limits for impressionist effects

## License

MIT
