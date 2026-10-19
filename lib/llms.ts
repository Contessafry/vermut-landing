import { content, seo, type CompareCell, type Rich } from "@/lib/content";
import { getRelease, type Release } from "@/lib/release";
import { contentUpdated, links, release as cfg, site } from "@/site.config";

const abs = (href: string) => (href.startsWith("#") ? `${site.url}/${href}` : href.startsWith("/") ? `${site.url}${href}` : href);
const md = (r: Rich) => r.map((p) => (typeof p === "string" ? p : `[${p.text}](${abs(p.href)})`)).join("");
const req = content.faq.requirements.items.map((r) => `${r.label}: ${r.value}`).join("; ");

/** llms.txt (https://llmstxt.org): H1, blockquote summary, details, H2 link lists. */
function downloadLines(r: Release) {
  return [
    `- [Download Vermut ${r.version} (.dmg, ${r.sizeLabel})](${r.dmgUrl}): ${r.dmgName}, latest release from GitHub`,
    r.sha256 ? `- SHA-256 of ${r.dmgName}: \`${r.sha256}\`` : "",
    `- [Install steps](${site.url}/#download): open the DMG, drag to Applications${cfg.notarized ? "" : ", allow it once in System Settings › Privacy & Security (the app is not notarized)"}`,
    cfg.installer.scriptUrl ? `- Terminal alternative: \`curl -fsSL ${cfg.installer.scriptUrl} | bash\` ([source](${cfg.installer.sourceUrl}))` : "",
    cfg.brewCask ? `- Homebrew: \`brew install --cask ${cfg.brewCask}\`` : "",
    `- [Release notes](${r.notesUrl}) · [All releases](${cfg.releasesUrl})`,
  ].filter(Boolean).join("\n");
}

export async function llmsTxt() {
  const r = await getRelease();
  return `# ${site.name}

> ${seo.description}

Vermut is a native macOS app (MIT licence, version ${r.version}). It installs Steam and GOG Galaxy with their official installers and adds Epic Games in beta through the open-source Legendary client (no Epic Games Launcher). It gives each store its own Wine bottle with Wine 11 and a graphics layer (DXMT, DXVK or WineD3D; D3DMetal if Apple's Game Porting Toolkit is installed). Requirements: ${req}. Games with kernel-level anti-cheat do not run. The app is not signed with an Apple Developer ID or notarized, so on first launch macOS asks you to allow it once in System Settings › Privacy & Security. Last updated ${contentUpdated}.

## Download
${downloadLines(r)}

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

export async function llmsFullTxt() {
  const r = await getRelease();
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

Version ${r.version} · ${hero.meta.join(" · ")}

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

${downloadLines(r)}
- Requirements: macOS ${site.minMacOS.replace(/\.0$/, "")} ${site.minMacOSName} or later, Apple Silicon (M1 or later)

### ${d.installTitle}

${d.steps(r.dmgName).map((s, i) => `${i + 1}. ${s}`).join("\n")}
${cfg.notarized ? "" : `\n### ${d.gatekeeper.title}\n\n${d.gatekeeper.why}${d.gatekeeper.whySource} (${links.github})${d.gatekeeper.whyAnd}${d.gatekeeper.whySha}${r.sha256 ? ` (${r.sha256})` : ""}.\n\n${d.gatekeeper.steps.map((s, i) => `${i + 1}. **${s.title}.** ${s.body}`).join("\n")}\n\n${d.gatekeeper.note} Source: [${d.gatekeeper.appleLabel}](${d.gatekeeper.appleHref})\n`}
---

${footer.statement} Source code: ${links.github}. ${footer.legal}
`;
}
