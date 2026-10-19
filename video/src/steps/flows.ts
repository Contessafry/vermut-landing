import type { ScreenFlowProps } from "../template/types";

/**
 * Three "How it works" flows built from REAL screenshots of Vermut 1.0.0
 * (re-captured 19 Oct 2026 from build ec56b94: 2x Retina 2560×1600 PNGs of the
 * 1280×800 window, dark theme). Coordinates are window points (1280×800). Each flow ends where it starts (cursor
 * position + first shot) so the clip loops seamlessly.
 *
 * When the revised app ships, re-capture the same screens (or a window
 * recording) and update only `shots` / coordinates here.
 */

const base = {
  windowSize: { width: 1280, height: 800 },
  loopFade: 0.45,
  background: "linear-gradient(180deg, #EFEFF1 0%, #E4E4E7 100%)", // zinc-100 → zinc-200
  radius: 12,
} as const;

const REST = { x: 1010, y: 640 }; // where the cursor waits at loop start/end

/** Step 1 — Pick a store: browse the three stores, open Steam. 8 s */
export const pickAStore: ScreenFlowProps = {
  ...base,
  shots: [{ src: "shots/dark-stores.png", at: 0 }],
  cursor: [
    { ...REST, at: 0 },
    { x: 1094, y: 225, at: 1.2 }, // GOG Galaxy card
    { x: 755, y: 225, at: 2.3 }, // Epic Games Store card
    { x: 418, y: 351, at: 3.5 }, // "Open Steam"
    { x: 418, y: 351, at: 3.75, click: true },
    { x: 418, y: 351, at: 5.4 },
    { ...REST, at: 7.4 },
  ],
  zooms: [{ x: 420, y: 280, scale: 1.6, from: 2.9, to: 5.6 }],
};

/** Step 2 — Vermut sets up Wine: open the Steam bottle, check its graphics backend. 8.5 s */
export const setsUpWine: ScreenFlowProps = {
  ...base,
  shots: [
    { src: "shots/dark-stores.png", at: 0 },
    { src: "shots/dark-bottle-steam-general.png", at: 1.25 },
    { src: "shots/dark-bottle-steam-graphics.png", at: 3.5 },
  ],
  cursor: [
    { ...REST, at: 0 },
    { x: 62, y: 251, at: 1.0 }, // sidebar › Bottles › Steam
    { x: 62, y: 251, at: 1.15, click: true },
    { x: 357, y: 166, at: 3.2 }, // "Graphics" tab
    { x: 357, y: 166, at: 3.35, click: true },
    { x: 631, y: 275, at: 4.6 }, // Backend: DXMT
    { x: 631, y: 275, at: 6.0 },
    { ...REST, at: 8.0 },
  ],
  zooms: [{ x: 540, y: 250, scale: 1.55, from: 2.4, to: 6.1 }],
};

/** Step 3 — Play: open the Library, hit Play. 8 s */
export const play: ScreenFlowProps = {
  ...base,
  shots: [
    { src: "shots/dark-stores.png", at: 0 },
    { src: "shots/dark-library.png", at: 1.25 },
  ],
  cursor: [
    { ...REST, at: 0 },
    { x: 65, y: 146, at: 1.0 }, // sidebar › Library
    { x: 65, y: 146, at: 1.15, click: true },
    { x: 333, y: 225, at: 2.4 }, // Mewgenics cover
    { x: 1225, y: 771, at: 3.9 }, // Play
    { x: 1225, y: 771, at: 4.15, click: true },
    { x: 1225, y: 771, at: 5.6 },
    { ...REST, at: 7.5 },
  ],
  zooms: [{ x: 780, y: 520, scale: 1.32, from: 2.0, to: 5.8 }],
};
