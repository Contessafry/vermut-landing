/**
 * All landing copy as typed data. Components render this; they hold no copy.
 * Facts checked against the app source (Package.swift, build.sh, README,
 * LICENSE) and the running app on 19 Oct 2026. Competitor facts: see
 * `comparison.sources` (checked 19 Oct 2026).
 */
import { links, site } from "@/site.config";

/** Inline rich text: plain strings and links. */
export type Rich = ReadonlyArray<string | { readonly text: string; readonly href: string }>;

export type NavItem = { readonly label: string; readonly href: string };

export type Step = {
  readonly id: string;
  readonly number: string;
  readonly title: string;
  readonly body: string;
  readonly video: {
    readonly mp4: string;
    readonly webm: string;
    readonly poster: string;
    readonly width: number;
    readonly height: number;
    /** Accessible description of what the clip shows (no audio, no captions needed). */
    readonly description: string;
  };
};

export type CompatGroup = {
  readonly id: "runs" | "setup" | "no";
  readonly title: string;
  readonly items: readonly Rich[];
};

export type CompareCell = { readonly value: string; readonly note?: string; readonly tone?: "yes" | "no" | "neutral" };
export type CompareRow = { readonly label: string; readonly cells: readonly [CompareCell, CompareCell, CompareCell, CompareCell] };
export type Source = { readonly id: number; readonly label: string; readonly href: string };

export type Faq = { readonly q: string; readonly a: Rich };

const nav: readonly NavItem[] = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Compatibility", href: "#compatibility" },
  { label: "Compare", href: "#compare" },
  { label: "FAQ", href: "#faq" },
];

export const content = {
  nav,

  hero: {
    eyebrow: "Free · Open source · Apple Silicon",
    title: ["Pour.", "Click.", "Play."] as const,
    lead: "Vermut installs Steam, Epic Games Store and GOG Galaxy on your Mac and sets up Wine for each one, so your Windows games launch with a click.",
    primary: { label: "Download for Mac", href: links.download },
    secondary: { label: "Star on GitHub", href: links.github },
    meta: [
      `Version ${site.version}`,
      `macOS ${site.minMacOS.replace(/\.0$/, "")} ${site.minMacOSName} or later`,
      "Apple Silicon",
      `${site.license} licence`,
    ],
    screenshotAlt:
      "Vermut's Library: a Steam game marked Ready, with a Play button. The sidebar lists Stores, Library, Downloads and one bottle each for Steam, Epic Games and GOG Galaxy.",
  },

  howItWorks: {
    id: "how-it-works",
    eyebrow: "How it works",
    title: "Three steps. No Terminal.",
    lead: "No bottles to configure, no Wine versions to pick, no command line. Every clip below is the real app.",
    steps: [
      {
        id: "pick",
        number: "01",
        title: "Pick a store",
        body: "Choose Steam, Epic Games Store or GOG Galaxy. Vermut downloads the official installer and gives each store its own bottle, so they never get in each other's way.",
        video: {
          mp4: "/videos/step-1.mp4",
          webm: "/videos/step-1.webm",
          poster: "/videos/step-1-poster.webp",
          width: 1600,
          height: 1000,
          description:
            "Screen recording: the Stores screen lists Steam, Epic Games Store and GOG Galaxy, each installed in its own bottle. The pointer moves across the stores and clicks Open Steam.",
        },
      },
      {
        id: "wine",
        number: "02",
        title: "Vermut sets up Wine",
        body: "Each bottle gets Wine 11 and the graphics layer that suits its store: DXMT for Steam, WineD3D for Epic and GOG. You can change it later. You don't have to.",
        video: {
          mp4: "/videos/step-2.mp4",
          webm: "/videos/step-2.webm",
          poster: "/videos/step-2-poster.webp",
          width: 1600,
          height: 1000,
          description:
            "Screen recording: the pointer opens the Steam bottle from the sidebar, switches to the Graphics tab and points at the selected backend, DXMT.",
        },
      },
      {
        id: "play",
        number: "03",
        title: "Play",
        body: "Sign in to your store as usual and install your games. They appear in your Library, and Play starts each one in the right bottle.",
        video: {
          mp4: "/videos/step-3.mp4",
          webm: "/videos/step-3.webm",
          poster: "/videos/step-3-poster.webp",
          width: 1600,
          height: 1000,
          description:
            "Screen recording: the pointer opens the Library, where a Steam game is marked Ready, and clicks Play in the Continue bar.",
        },
      },
    ] satisfies readonly Step[],
  },

  compatibility: {
    id: "compatibility",
    eyebrow: "Honest compatibility",
    title: "What runs, and what doesn't.",
    lead: "Vermut runs Windows games through Wine. Plenty of games work well. Some never will, and we'd rather tell you now than after a 60 GB download.",
    groups: [
      {
        id: "runs",
        title: "Usually runs",
        items: [
          ["DirectX 9, 10 and 11 games, translated to Metal by DXMT or DXVK."],
          ["Indie and older titles, which are often the easiest wins."],
          ["The store apps themselves: Steam, Epic Games Store and GOG Galaxy."],
        ],
      },
      {
        id: "setup",
        title: "Needs extra setup",
        items: [
          [
            "DirectX 12 games need Apple's ",
            { text: "Game Porting Toolkit", href: "https://developer.apple.com/games/game-porting-toolkit/" },
            " (D3DMetal). Vermut detects it if you install it, but never bundles it.",
          ],
          ["Games with launchers of their own, such as the EA app or Ubisoft Connect, may need Run .exe inside a bottle and some trial and error."],
        ],
      },
      {
        id: "no",
        title: "Won't run",
        items: [
          ["Games with kernel-level anti-cheat, including Valorant, Fortnite and Call of Duty. The anti-cheat blocks Wine, and nothing on the Mac side can change that."],
          ["Anything that needs a Windows driver, such as some peripheral or DRM tools."],
        ],
      },
    ] satisfies readonly CompatGroup[],
    footnote: [
      "Before you buy a game, check ",
      { text: "Are We Anti-Cheat Yet?", href: "https://areweanticheatyet.com/" },
      " for anti-cheat status and ",
      { text: "CodeWeavers' compatibility database", href: "https://www.codeweavers.com/compatibility" },
      " for Wine reports on the Mac.",
    ] satisfies Rich,
  },

  comparison: {
    id: "compare",
    eyebrow: "Compared",
    title: "Where Vermut fits.",
    lead: "There are good ways to run Windows games on a Mac. Here's how they differ, as of October 2026.",
    columns: ["Vermut", "Whisky", "CrossOver", "Heroic"] as const,
    rows: [
      {
        label: "Price",
        cells: [
          { value: "Free", tone: "yes" },
          { value: "Free", tone: "yes" },
          { value: "From $74", note: "12 months of updates; 14-day free trial [3][4]", tone: "neutral" },
          { value: "Free", tone: "yes" },
        ],
      },
      {
        label: "Open source",
        cells: [
          { value: "Yes, MIT", tone: "yes" },
          { value: "Yes, GPL-3.0 [2]", tone: "yes" },
          { value: "No", note: "Built on Wine (LGPL)", tone: "no" },
          { value: "Yes, GPL-3.0 [6]", tone: "yes" },
        ],
      },
      {
        label: "Maintained",
        cells: [
          { value: "Yes", tone: "yes" },
          { value: "No", note: "Archived 9 April 2025; a community fork continues [1][2]", tone: "no" },
          { value: "Yes", note: "CrossOver 26, February 2026 [5]", tone: "yes" },
          { value: "Yes", note: "v2.22.4, 15 October 2026 [7]", tone: "yes" },
        ],
      },
      {
        label: "Sets up Steam, Epic and GOG for you",
        cells: [
          { value: "Yes", note: "One bottle per store, one click each", tone: "yes" },
          { value: "No", note: "You create a bottle and run each installer", tone: "no" },
          { value: "Yes", note: "From its install catalogue; Epic and GOG since CrossOver 25 [9][10]", tone: "yes" },
          { value: "Epic, GOG, Amazon", note: "Its own launcher; no Steam client [6]", tone: "neutral" },
        ],
      },
      {
        label: "Wine engine",
        cells: [
          { value: "Bundled", note: "Wine 11 with DXMT and DXVK; D3DMetal if you install it", tone: "yes" },
          { value: "Bundled, frozen", note: "No upgrade to Wine 8+ [1]", tone: "no" },
          { value: "Bundled", note: "CodeWeavers' own build", tone: "yes" },
          { value: "You choose", note: "Downloads Wine, GPTK builds, or uses CrossOver [8]", tone: "neutral" },
        ],
      },
      {
        label: "Works without Terminal",
        cells: [
          { value: "Yes", tone: "yes" },
          { value: "Yes", tone: "yes" },
          { value: "Yes", tone: "yes" },
          { value: "Yes", tone: "yes" },
        ],
      },
      {
        label: "Support",
        cells: [
          { value: "GitHub issues", tone: "neutral" },
          { value: "None", tone: "no" },
          { value: "Email and phone", note: "While your licence is active [3]", tone: "yes" },
          { value: "Community", note: "GitHub and Discord", tone: "neutral" },
        ],
      },
    ] satisfies readonly CompareRow[],
    aside: [
      "Need commercial support or the widest coverage? Buy CrossOver. CodeWeavers are among the biggest contributors to Wine, and every Mac Wine project, Vermut included, builds on that work.",
    ] satisfies Rich,
    sourcesTitle: "Sources, checked 19 October 2026",
    sources: [
      { id: 1, label: "Whisky maintenance notice", href: "https://docs.getwhisky.app/maintenance-notice" },
      { id: 2, label: "Whisky-App/Whisky on GitHub (archived)", href: "https://github.com/Whisky-App/Whisky" },
      { id: 3, label: "CodeWeavers store", href: "https://www.codeweavers.com/store" },
      { id: 4, label: "CodeWeavers: How CrossOver licences work", href: "https://www.codeweavers.com/blog/balfour/2025/10/9/dont-panic-how-crossover-licenses-work" },
      { id: 5, label: "CodeWeavers: CrossOver 26 release", href: "https://www.codeweavers.com/blog/mjohnson/2026/02/10/crossover-26-cures-artificial-incompatibility-with-windows-games-on-mac" },
      { id: 6, label: "Heroic Games Launcher FAQ", href: "https://heroicgameslauncher.com/faq" },
      { id: 7, label: "Heroic releases on GitHub", href: "https://github.com/Heroic-Games-Launcher/HeroicGamesLauncher/releases" },
      { id: 8, label: "Heroic wiki: Using Heroic on a Mac", href: "https://github.com/Heroic-Games-Launcher/HeroicGamesLauncher/wiki/Using-Heroic-on-a-Mac-computer" },
      { id: 9, label: "CodeWeavers: Three game clients that work with CrossOver", href: "https://www.codeweavers.com/blog/mjohnson/2023/3/8/three-game-clients-that-work-on-macos-with-crossover" },
      { id: 10, label: "CodeWeavers: CrossOver 25 release", href: "https://www.codeweavers.com/blog/mjohnson/2025/3/11/experience-next-level-gaming-on-mac-with-crossover-25" },
    ] satisfies readonly Source[],
  },

  faq: {
    id: "faq",
    eyebrow: "FAQ",
    title: "Questions, answered.",
    items: [
      { q: "Is Vermut really free?", a: [`Yes. It's open source under the ${site.license} licence, with no account, no paid tier and no telemetry.`] },
      { q: "Does it work on Intel Macs?", a: ["No. Vermut is built for Apple Silicon: M1 and every chip since."] },
      { q: "Which version of macOS do I need?", a: [`macOS ${site.minMacOS.replace(/\.0$/, "")} ${site.minMacOSName} or later.`] },
      { q: "Will my game run?", a: ["It depends on the game. Most DirectX 9 to 11 games do; games with kernel-level anti-cheat don't. See ", { text: "compatibility", href: "#compatibility" }, " for the full picture."] },
      { q: "Does Vermut see my Steam or Epic password?", a: ["No. You sign in inside the official store app, running in its own bottle. Vermut never handles your credentials."] },
      { q: "Does it include Apple's Game Porting Toolkit?", a: ["No, Vermut never bundles it. If you install it yourself, Vermut detects it and offers D3DMetal as a graphics option."] },
      { q: "Do I need Terminal or Homebrew?", a: ["No. Everything happens in the app, from installing a store to launching a game."] },
      { q: "How is it different from Whisky?", a: ["Whisky was a general-purpose Wine wrapper and is no longer maintained. Vermut is built around game stores: one bottle per store, set up for you, with a Library for everything you install."] },
      { q: "How do I uninstall it?", a: ["Delete each bottle from its Danger zone in Vermut, which removes the store and its games, then drag Vermut to the Trash."] },
    ] satisfies readonly Faq[],
    requirements: {
      title: "Requirements",
      items: [
        { label: "Mac", value: "Apple Silicon (M1 or later)" },
        { label: "macOS", value: `${site.minMacOS.replace(/\.0$/, "")} ${site.minMacOSName} or later` },
        { label: "Disk", value: "10 GB free, plus room for your games" },
        { label: "Rosetta 2", value: "Installed for you if missing" },
        { label: "Internet", value: "To download stores and games" },
      ],
    },
  },

  footer: {
    statement: "Free and open source. No account, no telemetry, no paid tier.",
    cta: { label: "Download for Mac", href: links.download },
    columns: [
      {
        title: "Project",
        links: [
          { label: "GitHub", href: links.github },
          { label: "Releases", href: links.releases },
          { label: `${site.license} licence`, href: links.license },
        ],
      },
      {
        title: "Contribute",
        links: [
          { label: "Contributing guide", href: links.contributing },
          { label: "Report a bug", href: links.newIssue },
          { label: "Open issues", href: links.issues },
        ],
      },
    ],
    legal:
      "Vermut is not affiliated with Valve, Epic Games, GOG, CodeWeavers or Apple. Steam, Epic Games Store, GOG Galaxy and other names are trademarks of their respective owners.",
  },
} as const;

export type Content = typeof content;
