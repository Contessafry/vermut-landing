import type { NextConfig } from "next";

/** Keep in sync with lib/guides.ts (the hub "guides" plus each guide slug). */
const GUIDE_SLUGS = [
  "guides",
  "run-windows-steam-games-on-apple-silicon",
  "free-whisky-alternative-mac",
  "run-windows-games-on-mac-without-crossover",
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  experimental: { globalNotFound: true },
  // English is the default locale and lives at "/" (no prefix, one canonical URL).
  // Internally it is the `en` segment of app/[locale]; "/en" itself redirects to "/".
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/en" },
        // English-only guide pages live at the root, like the English home page.
        { source: `/:slug(${GUIDE_SLUGS.join("|")})`, destination: "/en/:slug" },
      ],
    };
  },
  async redirects() {
    return [
      { source: "/en", destination: "/", permanent: true },
      { source: `/en/:slug(${GUIDE_SLUGS.join("|")})`, destination: "/:slug", permanent: true },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        source: "/videos/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/brand/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
