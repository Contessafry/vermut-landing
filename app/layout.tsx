import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { seo } from "@/lib/content";
import { jsonLdGraph } from "@/lib/structured-data";
import { site, verification } from "@/site.config";
import "./globals.css";

/* Marketing type: Bricolage Grotesque display (instanced: opsz 96, wdth 75, wght 600–800)
   + Hanken Grotesk text + JetBrains Mono. Latin subsets, self-hosted via next/font. */
const display = localFont({
  src: "./fonts/bricolage-display.woff2",
  variable: "--font-display-face",
  weight: "600 800",
  display: "swap",
  fallback: ["Arial Narrow", "system-ui", "sans-serif"],
  adjustFontFallback: "Arial",
});
const text = localFont({
  src: "./fonts/hanken-vf.woff2",
  variable: "--font-text",
  weight: "100 900",
  display: "swap",
});
const code = localFont({
  src: "./fonts/jetbrains-mono-vf.woff2",
  variable: "--font-code",
  weight: "100 800",
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "SF Mono", "Menlo", "monospace"],
});

const { title, description } = seo;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: "%s · Vermut" },
  description,
  applicationName: "Vermut",
  keywords: [...seo.keywords],
  category: "games",
  alternates: {
    canonical: "/",
    types: { "text/markdown": [{ url: "/llms.txt", title: "Vermut for LLMs" }] },
  },
  verification: {
    ...(verification.google ? { google: verification.google } : {}),
    ...(verification.bing ? { other: { "msvalidate.01": verification.bing } } : {}),
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Vermut",
    title,
    description,
    locale: "en",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#CE003E",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${text.variable} ${code.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only z-50 rounded-md bg-neutral-950 px-4 py-3 font-medium text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          // Static, server-generated JSON-LD; `<` escaped.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph()).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
