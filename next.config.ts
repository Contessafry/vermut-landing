import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  experimental: { globalNotFound: true },
  // English is the default locale and lives at "/" (no prefix, one canonical URL).
  // Internally it is the `en` segment of app/[locale]; "/en" itself redirects to "/".
  async rewrites() {
    return { beforeFiles: [{ source: "/", destination: "/en" }] };
  },
  async redirects() {
    return [{ source: "/en", destination: "/", permanent: true }];
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
