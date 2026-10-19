import localFont from "next/font/local";

/* Marketing type: Bricolage Grotesque display (instanced: opsz 96, wdth 75, wght 600–800)
   + Hanken Grotesk text + JetBrains Mono. Latin subsets only (incl. Latin-1: de/fr/es/it
   accents), self-hosted via next/font. CJK (ja, zh) uses the Mac's system fonts through
   the :lang() stacks in globals.css, so no extra bytes ship for any locale. */
export const display = localFont({
  src: "../app/fonts/bricolage-display.woff2",
  variable: "--font-display-face",
  weight: "600 800",
  display: "swap",
  fallback: ["Arial Narrow", "system-ui", "sans-serif"],
  adjustFontFallback: "Arial",
});
export const text = localFont({
  src: "../app/fonts/hanken-vf.woff2",
  variable: "--font-text",
  weight: "100 900",
  display: "swap",
});
export const code = localFont({
  src: "../app/fonts/jetbrains-mono-vf.woff2",
  variable: "--font-code",
  weight: "100 800",
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "SF Mono", "Menlo", "monospace"],
});

export const fontVars = `${display.variable} ${text.variable} ${code.variable}`;
