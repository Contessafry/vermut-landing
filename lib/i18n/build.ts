import type { Dictionary } from ".";
import { en } from "./dictionaries/en";
import type { Rich } from "./types";

/**
 * What a translator writes: only the words. `build()` merges it onto the
 * English dictionary, which owns ids, links, video files, tones and sources.
 * Array lengths must match English (checked at build time).
 */
export type Translation = {
  locale: string;
  seo: { title: string; description: string; keywords: readonly string[] };
  /** How it works, Compatibility, Compare, Support, FAQ, Download */
  nav: readonly [string, string, string, string, string, string];
  hero: {
    eyebrow: string;
    lead: string;
    primary: string;
    secondary: string;
    /** macOS requirement, chip, licence */
    meta: readonly [string, string, string];
    screenshotAlt: string;
  };
  howItWorks: {
    eyebrow: string;
    title: string;
    lead: string;
    steps: readonly { title: string; body: string; description: string }[];
  };
  compatibility: {
    eyebrow: string;
    title: string;
    lead: string;
    groups: readonly { title: string; items: readonly Rich[] }[];
    footnote: Rich;
  };
  comparison: {
    eyebrow: string;
    title: string;
    lead: string;
    /** Per row: label and four [value, note?] cells (Vermut, Whisky, CrossOver, Heroic). */
    rows: readonly { label: string; cells: readonly (readonly [string, string?])[] }[];
    aside: Rich;
    sourcesTitle: string;
  };
  support: {
    eyebrow: string;
    title: string;
    lead: string;
    donateLabel: string;
    donateNote: string;
    otherTitle: string;
    options: readonly { title: string; body: string; label: string }[];
    share: { title: string; body: string; text: string };
  };
  faq: {
    eyebrow: string;
    title: string;
    items: readonly { q: string; a: Rich }[];
    requirements: { title: string; items: readonly { label: string; value: string }[] };
  };
  download: Omit<Dictionary["download"], "id">;
  footer: {
    statement: string;
    cta: string;
    /** Column titles and their link labels, same order as English. */
    columns: readonly { title: string; links: readonly string[] }[];
    legal: string;
  };
  ui: Dictionary["ui"];
  illustrations: Dictionary["illustrations"];
  notFound: Dictionary["notFound"];
};

function same<T>(name: string, a: readonly unknown[], b: readonly T[]): readonly T[] {
  if (a.length !== b.length) throw new Error(`i18n: ${name} has ${b.length} entries, English has ${a.length}`);
  return b;
}

export function build(t: Translation): Dictionary {
  const steps = same(`${t.locale} howItWorks.steps`, en.howItWorks.steps, t.howItWorks.steps);
  const groups = same(`${t.locale} compatibility.groups`, en.compatibility.groups, t.compatibility.groups);
  const rows = same(`${t.locale} comparison.rows`, en.comparison.rows, t.comparison.rows);
  const options = same(`${t.locale} support.options`, en.support.options, t.support.options);
  const faq = same(`${t.locale} faq.items`, en.faq.items, t.faq.items);
  const req = same(`${t.locale} faq.requirements`, en.faq.requirements.items, t.faq.requirements.items);
  const cols = same(`${t.locale} footer.columns`, en.footer.columns, t.footer.columns);
  return {
    ...en,
    locale: t.locale,
    seo: t.seo,
    nav: en.nav.map((n, i) => ({ ...n, label: t.nav[i] })),
    hero: {
      ...en.hero,
      eyebrow: t.hero.eyebrow,
      lead: t.hero.lead,
      primary: { ...en.hero.primary, label: t.hero.primary },
      secondary: { ...en.hero.secondary, label: t.hero.secondary },
      meta: t.hero.meta,
      screenshotAlt: t.hero.screenshotAlt,
    },
    howItWorks: {
      ...en.howItWorks,
      eyebrow: t.howItWorks.eyebrow,
      title: t.howItWorks.title,
      lead: t.howItWorks.lead,
      steps: en.howItWorks.steps.map((s, i) => ({
        ...s,
        title: steps[i].title,
        body: steps[i].body,
        video: { ...s.video, description: steps[i].description },
      })),
    },
    compatibility: {
      ...en.compatibility,
      eyebrow: t.compatibility.eyebrow,
      title: t.compatibility.title,
      lead: t.compatibility.lead,
      groups: en.compatibility.groups.map((g, i) => ({ ...g, title: groups[i].title, items: groups[i].items })),
      footnote: t.compatibility.footnote,
    },
    comparison: {
      ...en.comparison,
      eyebrow: t.comparison.eyebrow,
      title: t.comparison.title,
      lead: t.comparison.lead,
      rows: en.comparison.rows.map((r, i) => ({
        label: rows[i].label,
        cells: r.cells.map((c, j) => {
          const [value, note] = same(`${t.locale} comparison.rows[${i}].cells`, r.cells, rows[i].cells)[j];
          return { tone: c.tone, value, ...(note ? { note } : {}) };
        }),
      })),
      aside: t.comparison.aside,
      sourcesTitle: t.comparison.sourcesTitle,
    },
    support: {
      ...en.support,
      ...t.support,
      options: en.support.options.map((o, i) => ({ ...o, ...options[i] })),
    },
    faq: {
      ...en.faq,
      eyebrow: t.faq.eyebrow,
      title: t.faq.title,
      items: faq,
      requirements: { title: t.faq.requirements.title, items: req },
    },
    download: { ...en.download, ...t.download },
    footer: {
      ...en.footer,
      statement: t.footer.statement,
      cta: { ...en.footer.cta, label: t.footer.cta },
      columns: en.footer.columns.map((c, i) => ({
        title: cols[i].title,
        links: c.links.map((l, j) => ({ ...l, label: same(`${t.locale} footer.columns[${i}]`, c.links, cols[i].links)[j] })),
      })),
      legal: t.footer.legal,
    },
    ui: t.ui,
    illustrations: t.illustrations,
    notFound: t.notFound,
  };
}
