import { content, seo, type CompareCell, type Rich } from "@/lib/content";
import { contentUpdated, links, release, site } from "@/site.config";

const abs = (href: string) => (href.startsWith("#") ? `${site.url}/${href}` : href.startsWith("/") ? `${site.url}${href}` : href);
const md = (r: Rich) => r.map((p) => (typeof p === "string" ? p : `[${p.text}](${abs(p.href)})`)).join("");
const req = content.faq.requirements.items.map((r) => `${r.label}: ${r.value}`).join("; ");

/** llms.txt (https://llmstxt.org): H1, blockquote summary, details, H2 link lists. */
export function llmsTxt() {
  return `# ${site.name}

> ${seo.description}

Vermut is a native macOS app (MIT licence, version ${site.version}). It gives each store its own Wine bottle with Wine 11 and a graphics layer (DXMT, DXVK or WineD3D; D3DMetal if Apple's Game Porting Toolkit is installed). Requirements: ${req}. Games with kernel-level anti-cheat do not run. Last updated ${contentUpdated}.

## Download
- [Download Vermut ${site.version} (.dmg)](${release.dmgUrl}): latest release from GitHub
- [Install steps](${site.url}/#download): open the DMG, drag to Applications${release.notarized ? "" : ", allow it once in System Settings › Privacy & Security"}
- [All releases](${release.releasesUrl}): release notes and older versions${release.checksumUrl ? `\n- [SHA-256 checksum](${release.checksumUrl})` : ""}${release.brewCask ? `\n- Homebrew: \`brew install --cask ${release.brewCask}\`` : ""}

## Project
- [GitHub repository](${links.github}): source code, issues and contributing guide
- [Report a bug](${links.newIssue})

## Docs
- [How it works](${site.url}/#how-it-works): pick a store, Vermut sets up Wine, play
- [Compatibility](${site.url}/#compatibility): what runs, what needs setup, what won't run
- [Requirements](${site.url}/#faq): ${req}
- [Comparison](${site.url}/#compare): Vermut vs Whisky, CrossOver and Heroic
- [FAQ](${site.url}/#faq)

## Optional
- [Full page content in Markdown](${site.url}/llms-full.txt)
- [Brand assets](${site.url}${site.brandAssets})
`;
}

export function llmsFullTxt() {
  const { hero, howItWorks: h, compatibility: c, comparison: cmp, faq, download: d, footer } = content;
  const table = [
    `| | ${cmp.columns.join(" | ")} |`,
    `|---|${cmp.columns.map(() => "---").join("|")}|`,
    ...cmp.rows.map((r) => `| ${r.label} | ${r.cells.map((x: CompareCell) => (x.note ? `${x.value} (${x.note})` : x.value)).join(" | ")} |`),
  ].join("\n");
  return `# ${site.name}: ${site.tagline}

> ${seo.description}

Source: ${site.url} · Last updated ${contentUpdated}

${hero.lead}

${hero.meta.join(" · ")}

## ${h.title}

${h.lead}

${h.steps.map((s) => `### ${s.number}. ${s.title}\n\n${s.body}`).join("\n\n")}

## ${c.title}

${c.lead}

${c.groups.map((g) => `### ${g.title}\n\n${g.items.map((i) => `- ${md(i)}`).join("\n")}`).join("\n\n")}

${md(c.footnote)}

## ${cmp.title}

${cmp.lead}

${table}

${md(cmp.aside)}

${cmp.sourcesTitle}:

${cmp.sources.map((s) => `${s.id}. [${s.label}](${s.href})`).join("\n")}

## ${faq.title}

${faq.items.map((f) => `### ${f.q}\n\n${md(f.a)}`).join("\n\n")}

### ${faq.requirements.title}

${faq.requirements.items.map((r) => `- ${r.label}: ${r.value}`).join("\n")}

## ${d.title}

${d.lead}

- [${d.primary.label}](${d.primary.href})
${d.facts.map((f) => `- ${f.label}: ${f.value}`).join("\n")}${d.checksum ? `\n- [${d.checksum.label}](${d.checksum.href})` : ""}
- [${d.allReleases.label}](${d.allReleases.href})${d.brew ? `\n- ${d.brew.label}: \`${d.brew.command}\`` : ""}

### ${d.installTitle}

${d.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}
${d.gatekeeper ? `\n### ${d.gatekeeper.title}\n\n${d.gatekeeper.intro}\n\n${d.gatekeeper.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\n${d.gatekeeper.note}\n` : ""}
---

${footer.statement} Source code: ${links.github}. ${footer.legal}
`;
}
