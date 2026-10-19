/**
 * English content, re-exported for English-only consumers (llms.txt,
 * llms-full.txt). Pages read the current locale via getDictionary().
 */
import { en } from "./i18n/dictionaries/en";

export * from "./i18n/types";
export const content = en;
export const seo = en.seo;
export type Content = typeof en;
