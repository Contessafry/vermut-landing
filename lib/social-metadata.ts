import type { Metadata } from "next";
import { site } from "@/site.config";

/**
 * Absolute social preview images. Next replaces nested `openGraph` / `twitter`
 * objects instead of merging them, so every generateMetadata that sets those
 * fields must spread this in or the file-based app/opengraph-image.png is dropped.
 */
const alt = "Vermut: Pour. Click. Play. Steam and Epic Games (beta) on your Mac.";

export const openGraphImage = {
  images: [
    {
      url: `${site.url}/opengraph-image.png`,
      width: 1280,
      height: 640,
      alt,
      type: "image/png",
    },
  ],
} satisfies Pick<NonNullable<Metadata["openGraph"]>, "images">;

export const twitterImage = {
  images: [
    {
      url: `${site.url}/twitter-image.png`,
      width: 1280,
      height: 640,
      alt,
    },
  ],
} satisfies Pick<NonNullable<Metadata["twitter"]>, "images">;
