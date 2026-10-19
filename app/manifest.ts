import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vermut",
    short_name: "Vermut",
    description: "Steam, Epic Games and GOG on your Mac.",
    start_url: "/",
    display: "browser",
    background_color: "#FFFFFF",
    theme_color: "#CE003E",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
