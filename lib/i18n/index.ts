import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { hasLocale, type Locale } from "./config";
import { en } from "./dictionaries/en";
import type { Widen } from "./types";

export type Dictionary = Widen<typeof en>;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: async () => en,
  it: () => import("./dictionaries/it").then((m) => m.it),
  de: () => import("./dictionaries/de").then((m) => m.de),
  fr: () => import("./dictionaries/fr").then((m) => m.fr),
  es: () => import("./dictionaries/es").then((m) => m.es),
  ja: () => import("./dictionaries/ja").then((m) => m.ja),
  zh: () => import("./dictionaries/zh").then((m) => m.zh),
};

export const getDictionaryFor = (l: Locale) => dictionaries[l]();

/** Current locale from the root `[locale]` segment (server only). */
export async function getLocale(): Promise<Locale> {
  const l = await rootLocale();
  if (!l || !hasLocale(l)) notFound();
  return l;
}

/** Dictionary for the current request's locale (server only). */
export async function getDictionary() {
  return getDictionaryFor(await getLocale());
}
