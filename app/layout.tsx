import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/site.config";
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

const title = "Vermut: Steam, Epic Games and GOG on your Mac";
const description =
  "Free, open-source macOS app that installs Steam, Epic Games Store and GOG Galaxy and sets up Wine for each, so Windows games launch with a click on Apple Silicon.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: "%s · Vermut" },
  description,
  applicationName: "Vermut",
  keywords: ["Vermut", "Wine", "macOS", "Apple Silicon", "Steam on Mac", "Epic Games on Mac", "GOG Galaxy Mac", "Windows games on Mac", "open source"],
  alternates: { canonical: "/" },
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Vermut",
  description,
  applicationCategory: "GameApplication",
  operatingSystem: `macOS ${site.minMacOS} or later (Apple Silicon)`,
  softwareVersion: site.version,
  license: "https://opensource.org/license/mit",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  downloadUrl: site.downloadUrl,
  codeRepository: site.githubUrl,
  url: site.url,
  image: `${site.url}/opengraph-image.png`,
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
