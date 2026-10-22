/**
 * Guide pages (English only, see docs/I18N.md › Guides). Every claim is
 * sourced in `sources` or comes from the Vermut source code (Contessafry/Vermut).
 * Facts checked 22 October 2026.
 */
import type { Rich } from "@/lib/i18n/types";
import { links } from "@/site.config";

export const guidesUpdated = "2026-10-22";

export type GuideSection = {
  id: string;
  title: string;
  body?: readonly Rich[];
  steps?: readonly { title: string; body: Rich }[];
  bullets?: readonly Rich[];
};

export type GuideCompare = {
  caption: string;
  columns: readonly string[];
  rows: readonly { label: string; cells: readonly string[] }[];
};

export type Guide = {
  slug: string;
  /** <title> (the layout template appends "· Vermut"). */
  metaTitle: string;
  description: string;
  /** Short label for the hub and cross-links. */
  label: string;
  h1: string;
  answer: Rich;
  sections: readonly GuideSection[];
  compare?: GuideCompare;
  /** Rendered after the comparison table. */
  after?: readonly GuideSection[];
  faq: readonly { q: string; a: Rich }[];
  sources: readonly { label: string; href: string }[];
};

const FIRST_LAUNCH = "/#first-launch";
const COMPAT = "/#compatibility";

const S = {
  whiskyNotice: { label: "Whisky documentation: Maintenance notice", href: "https://docs.getwhisky.app/maintenance-notice" },
  whiskyRepo: { label: "Whisky-App/Whisky on GitHub (archived)", href: "https://github.com/Whisky-App/Whisky" },
  whiskyFork: { label: "frankea/Whisky, a community fork", href: "https://github.com/frankea/Whisky" },
  cxStore: { label: "CodeWeavers store (CrossOver prices)", href: "https://www.codeweavers.com/store" },
  cxLicence: { label: "CodeWeavers: Licensing questions", href: "https://www.codeweavers.com/store/licensing" },
  cx26: { label: "CodeWeavers: CrossOver 26 release, 10 February 2026", href: "https://www.codeweavers.com/blog/mjohnson/2026/02/10/crossover-26-cures-artificial-incompatibility-with-windows-games-on-mac" },
  gptk: { label: "Apple Developer: Game Porting Toolkit", href: "https://developer.apple.com/games/game-porting-toolkit/" },
  gptkReq: { label: "Gcenx/game-porting-toolkit releases (requirements)", href: "https://github.com/Gcenx/game-porting-toolkit/releases" },
  parallels: { label: "Parallels KB 122485: Play Windows games in Parallels Desktop", href: "https://kb.parallels.com/en/122485" },
  gfn: { label: "NVIDIA: GeForce NOW system requirements", href: "https://www.nvidia.com/en-us/geforce-now/system-reqs/" },
  aacy: { label: "Are We Anti-Cheat Yet?", href: "https://areweanticheatyet.com/" },
  cxCompat: { label: "CodeWeavers compatibility database", href: "https://www.codeweavers.com/compatibility" },
  legendary: { label: "Legendary, an open-source Epic Games client", href: "https://github.com/derrod/legendary" },
  vermut: { label: "Vermut source code (MIT)", href: links.github },
} as const;

const kernelAntiCheat: Rich = [
  "Games with kernel-level anti-cheat, such as Valorant, Fortnite and Call of Duty, won't run through Wine, and no Mac tool can change that. Check ",
  { text: "Are We Anti-Cheat Yet?", href: S.aacy.href },
  " before you buy.",
];

export const guides: readonly Guide[] = [
  {
    slug: "run-windows-steam-games-on-apple-silicon",
    label: "Run Windows Steam games on Apple Silicon",
    metaTitle: "How to run Windows Steam games on Apple Silicon Macs",
    description:
      "Run the Windows version of Steam on an M1, M2, M3 or M4 Mac with Wine, DXMT and Rosetta 2. Steps, what works, what doesn't, and the free and paid options.",
    h1: "How to run Windows Steam games on an Apple Silicon Mac",
    answer: [
      "Install the Windows version of Steam inside Wine, which translates Windows calls to macOS, with Rosetta 2 handling the x86 code and a layer such as DXMT turning DirectX into Metal. Vermut does that setup for you for free: it downloads Wine, creates a separate bottle for Steam and launches the official Steam client. Most DirectX 9 to 11 games run; games with kernel-level anti-cheat don't.",
    ],
    sections: [
      {
        id: "why",
        title: "Why the Mac version of Steam isn't enough",
        body: [
          ["Steam for macOS only shows games that have a Mac build. Most of a typical Steam library is Windows-only, and Apple Silicon Macs can't run Boot Camp, so the Windows build has to run some other way."],
          ["On an Apple Silicon Mac three things work together: Rosetta 2 runs the x86-64 code, Wine provides the Windows APIs, and a graphics layer turns DirectX into Metal. None of this is emulating a whole PC, which is why it can be fast, and also why some games fail."],
        ],
      },
      {
        id: "steps",
        title: "Set up Windows Steam with Vermut",
        steps: [
          { title: "Check your Mac", body: ["You need an Apple Silicon Mac (M1 or later) with macOS 14 Sonoma or later and several GB of free space for Wine, Steam and your games. Intel Macs aren't supported."] },
          { title: "Download and open Vermut", body: ["Get the DMG from GitHub and drag Vermut to Applications. The app isn't notarized yet, so macOS asks you to allow it once: follow the ", { text: "first-launch guide", href: FIRST_LAUNCH }, "."] },
          { title: "Let Vermut prepare Wine", body: ["On first launch Vermut offers to install Rosetta 2 if it's missing and downloads its Wine 11 engine, about 1 to 2 GB."] },
          { title: "Install Steam", body: ["Click Install next to Steam. Vermut downloads the official Steam installer into its own bottle and finishes Steam's first update. Then sign in with your normal Steam account."] },
          { title: "Install and play", body: ["Install games from the Steam client as you would on a PC. Installed games appear in Vermut's Library."] },
          { title: "If a game misbehaves, change the graphics backend", body: ["DXMT is the default for DirectX 10 and 11. You can switch the bottle to DXVK, WineD3D, or D3DMetal if you installed Apple's Game Porting Toolkit. The v1.2 beta adds settings for a single game."] },
        ],
      },
      {
        id: "what-works",
        title: "What works on Apple Silicon, and what doesn't",
        bullets: [
          ["Usually runs: DirectX 9, 10 and 11 games, and indie or older titles, which are often the easiest."],
          ["Needs extra setup: DirectX 12 games need Apple's D3DMetal from the Game Porting Toolkit, which you download from Apple. Games with their own launcher may need trial and error."],
          ["Won't run: ", ...kernelAntiCheat],
          ["Performance depends on the game and on your chip. Translation has a cost, so expect lower frame rates than a Windows PC with a similar GPU, and some stutter while shaders compile the first time."],
        ],
        body: [["Search the ", { text: "CodeWeavers compatibility database", href: S.cxCompat.href }, " for a game before buying it: CrossOver is built on the same Wine, so its reports are a good guide."]],
      },
    ],
    compare: {
      caption: "Ways to play Windows Steam games on an Apple Silicon Mac, October 2026",
      columns: ["Option", "Price", "Runs the Windows Steam client", "Main limit"],
      rows: [
        { label: "Vermut", cells: ["Free, MIT licence", "Yes, set up for you", "Young project; support through GitHub issues"] },
        { label: "CrossOver", cells: ["$74 for 12 months of updates; 14-day trial", "Yes, from its install catalogue", "Paid; the best-supported option"] },
        { label: "Whisky", cells: ["Free", "You set it up", "Archived in April 2025, no Wine 8+"] },
        { label: "Parallels Desktop", cells: ["Paid", "Yes, inside Windows 11 on Arm", "DirectX up to 11.1; most anti-cheat blocked in a VM"] },
        { label: "GeForce NOW", cells: ["Free tier, paid tiers", "No, it streams supported games", "Needs a fast connection; only games in its catalogue"] },
      ],
    },
    faq: [
      { q: "Can an M1 Mac run Windows Steam games?", a: ["Yes. Any Apple Silicon Mac with macOS 14 Sonoma or later can run the Windows Steam client through Wine. Older or lighter games run best on base chips; demanding games need more GPU and memory."] },
      { q: "Do I need a Windows licence?", a: ["No. Wine isn't Windows, so you don't install or buy Windows. You only need a Windows licence for a virtual machine such as Parallels."] },
      { q: "Will my Steam saves and achievements work?", a: ["Yes. You sign in with your own account in the official Steam client, so cloud saves, achievements and your library work as on a PC."] },
      { q: "Do DirectX 12 games work?", a: ["Some do, through Apple's D3DMetal. Apple's licence doesn't allow apps to bundle it, so you download the ", { text: "Game Porting Toolkit", href: S.gptk.href }, " from Apple yourself and Vermut detects it."] },
      { q: "Is it safe for my Steam account?", a: ["Vermut runs the official Steam client and never sees your password. Games whose anti-cheat refuses Wine won't start or won't connect online."] },
    ],
    sources: [S.vermut, S.gptk, S.gptkReq, S.cxStore, S.cx26, S.whiskyNotice, S.parallels, S.gfn, S.aacy, S.cxCompat],
  },

  {
    slug: "free-whisky-alternative-mac",
    label: "Free Whisky alternative for Mac",
    metaTitle: "Free Whisky alternative for Mac (Whisky is no longer maintained)",
    description:
      "Whisky was archived in April 2025. Here are the free and paid alternatives for running Windows games on a Mac, and how to move your games to Vermut.",
    h1: "A free Whisky alternative for your Mac",
    answer: [
      "Whisky was archived on 9 April 2025 and it won't move to Wine 8 or later. If you want something free and maintained, Vermut is an open-source app that sets up Steam and Epic Games (beta) on Wine 11 for you. If you need the widest compatibility and real support, CrossOver is the paid option that Whisky's own author recommends.",
    ],
    sections: [
      {
        id: "status",
        title: "What happened to Whisky",
        body: [
          ["Whisky was a popular free SwiftUI front end for Wine on Apple Silicon. Its maintainer stopped active development and archived the GitHub repository on 9 April 2025. The maintenance notice says Whisky won't move to Wine 8 or later and won't get fixes for specific apps or games, Steam included."],
          ["Existing installations may keep working for a while, but nothing new will be fixed, and newer games increasingly need a newer Wine. A community fork, ", { text: "frankea/Whisky", href: S.whiskyFork.href }, ", continues development independently."],
        ],
      },
      {
        id: "how-different",
        title: "How Vermut differs from Whisky",
        bullets: [
          ["Built around game stores. Whisky gave you empty bottles; Vermut gives each store its own bottle, installs the official Steam client and handles Epic Games through Legendary (beta), with a Library for installed games."],
          ["A current engine. Vermut downloads Wine 11, with DXMT for DirectX 10 and 11 on Metal by default, and Wine Staging and Wine Devel as fallbacks."],
          ["The same choice of graphics backends: DXMT, DXVK with MoltenVK, WineD3D, and D3DMetal if you installed Apple's Game Porting Toolkit."],
          ["Run any Windows .exe, .msi or .bat inside a bottle when a game isn't on a supported store."],
          ["Free and MIT-licensed, with no account and no telemetry."],
        ],
      },
      {
        id: "move",
        title: "Move from Whisky to Vermut",
        steps: [
          { title: "Note what you play", body: ["Make a list of your games and the settings that worked in Whisky. Steam and Epic keep your library and cloud saves on their servers."] },
          { title: "Back up local saves", body: ["Some games keep saves only inside the Whisky bottle. Copy them before you change anything. Vermut can't import Whisky bottles."] },
          { title: "Install Vermut", body: ["Download it from GitHub and allow it once in Privacy & Security, using the ", { text: "first-launch guide", href: FIRST_LAUNCH }, "."] },
          { title: "Install your store", body: ["Install Steam, or sign in to Epic Games, from the Stores page. Vermut downloads Wine and creates the bottle."] },
          { title: "Reinstall your games", body: ["Download your games again from the store client, then restore local saves if needed. Keep Whisky until everything works, then remove it."] },
        ],
      },
    ],
    compare: {
      caption: "Whisky and its alternatives, October 2026",
      columns: ["Option", "Price", "Maintained", "Best for"],
      rows: [
        { label: "Vermut", cells: ["Free, MIT", "Yes", "Steam and Epic games without setup"] },
        { label: "Whisky", cells: ["Free, GPL-3.0", "No, archived April 2025", "Nothing new; existing setups only"] },
        { label: "Whisky community fork", cells: ["Free", "Yes, by a different maintainer", "Whisky users who want to keep their bottles"] },
        { label: "CrossOver", cells: ["$74 for 12 months of updates; $494 lifetime", "Yes, CrossOver 26 in February 2026", "The widest compatibility and commercial support"] },
        { label: "Game Porting Toolkit", cells: ["Free download from Apple", "Yes, for developers", "Testing DirectX 12 games; not a launcher"] },
      ],
    },
    after: [
      {
        id: "choose",
        title: "Which one should you pick?",
        bullets: [
          ["You played Steam or Epic games in Whisky and want a free, maintained replacement: try Vermut first. It takes a few minutes and costs nothing."],
          ["You have many custom bottles you don't want to rebuild: the community fork can import Whisky bottles. It's run by a different maintainer, so judge its updates on their own."],
          ["You need a specific game to work, or want help when it doesn't: start CrossOver's 14-day trial and buy it if that game runs."],
          ["You're a developer testing a DirectX 12 port: Apple's Game Porting Toolkit is the tool made for that."],
        ],
      },
      {
        id: "limits",
        title: "Honest limits",
        bullets: [
          [...kernelAntiCheat],
          ["Vermut is young and run by a small team. It has no commercial support; bugs are handled through GitHub issues."],
          ["No Wine front end makes a game faster than the Wine underneath. If a game failed in Whisky because of Wine, test it before you assume it will work elsewhere."],
        ],
      },
    ],
    faq: [
      { q: "Is Whisky dead?", a: ["The original project is no longer maintained. Its GitHub repository was archived on 9 April 2025 and it won't get Wine 8 or later. A community fork exists, run by a different person."] },
      { q: "Can I import my Whisky bottles into Vermut?", a: ["No. Vermut creates its own bottle for each store. Back up any local saves, install the store in Vermut and download your games again."] },
      { q: "Is Vermut really free?", a: ["Yes. It's open source under the MIT licence, with no account, no paid tier and no telemetry. You can read the ", { text: "source code", href: links.github }, "."] },
      { q: "Why does Whisky's author recommend CrossOver?", a: ["CodeWeavers, the company behind CrossOver, does much of the Wine work for the Mac. Their sales pay for it, and every free Mac Wine project, Vermut included, builds on it."] },
      { q: "Does Vermut work on Intel Macs?", a: ["No. Vermut needs an Apple Silicon Mac with macOS 14 Sonoma or later."] },
    ],
    sources: [S.whiskyNotice, S.whiskyRepo, S.whiskyFork, S.cxStore, S.cx26, S.gptk, S.legendary, S.vermut, S.aacy],
  },

  {
    slug: "run-windows-games-on-mac-without-crossover",
    label: "Run Windows games on Mac without CrossOver",
    metaTitle: "How to run Windows games on a Mac without CrossOver",
    description:
      "Free ways to play Windows games on an Apple Silicon Mac without CrossOver: Wine with Vermut, Apple's Game Porting Toolkit, virtual machines and cloud gaming.",
    h1: "How to run Windows games on a Mac without CrossOver",
    answer: [
      "Use a free Wine front end. Vermut is open source and sets up Wine 11, Steam and Epic Games (beta) for you on any Apple Silicon Mac. For games that Wine can't run, the other free route is cloud gaming, which streams the game instead of running it. CrossOver remains the best-supported paid choice.",
    ],
    sections: [
      {
        id: "what-crossover-does",
        title: "What CrossOver does, and what you need to replace it",
        body: [
          ["CrossOver is CodeWeavers' commercial version of Wine. It costs $74 for 12 months of updates and support, or $494 for a lifetime licence, and the version you bought keeps working after support ends. There's a 14-day free trial."],
          ["Without it you need three things: a Wine build for macOS, a graphics layer that translates DirectX to Metal, and something that installs and launches your game stores. Doing this by hand in Terminal is possible but slow to maintain. Vermut packages all three in one app."],
        ],
      },
      {
        id: "options",
        title: "Your free options",
        bullets: [
          ["Vermut, free and open source. It installs Steam and Epic Games (beta) in their own Wine 11 bottles, uses DXMT by default for DirectX 10 and 11, and lets you switch to DXVK, WineD3D or D3DMetal."],
          ["Apple's Game Porting Toolkit. Free with an Apple developer account, made for developers to evaluate their games. It contains D3DMetal, which runs many DirectX 12 games, but it isn't a game launcher, and apps aren't allowed to bundle it."],
          ["Cloud gaming, such as GeForce NOW. Free tier available. The game runs on a remote PC, so anti-cheat isn't a problem, but you need a fast, stable connection and the game must be in the service's catalogue."],
          ["A virtual machine such as Parallels Desktop isn't free, and Windows on Arm in a VM supports DirectX only up to 11.1 and blocks most anti-cheat."],
        ],
      },
      {
        id: "steps",
        title: "Play a Windows game for free with Vermut",
        steps: [
          { title: "Check the game first", body: ["Look it up in the ", { text: "CodeWeavers compatibility database", href: S.cxCompat.href }, " and on ", { text: "Are We Anti-Cheat Yet?", href: S.aacy.href }, ". If it needs kernel-level anti-cheat, use cloud gaming."] },
          { title: "Install Vermut", body: ["Download the DMG, drag Vermut to Applications and allow it once with the ", { text: "first-launch guide", href: FIRST_LAUNCH }, ". You need an Apple Silicon Mac with macOS 14 or later."] },
          { title: "Install your store", body: ["Install Steam or sign in to Epic Games. Vermut downloads Wine and Rosetta 2 if needed."] },
          { title: "For DirectX 12 games, add D3DMetal", body: ["Download the Game Porting Toolkit from Apple. Vermut detects it and offers D3DMetal as a graphics backend."] },
          { title: "Not on a store? Run the installer", body: ["Use Run .exe to start any Windows installer inside a bottle. Results vary more here than with store games."] },
        ],
      },
    ],
    compare: {
      caption: "Running Windows games without CrossOver, October 2026",
      columns: ["Option", "Cost", "DirectX 12", "Anti-cheat games", "Effort"],
      rows: [
        { label: "Vermut", cells: ["Free", "With D3DMetal from Apple", "Kernel-level: no", "Low, one app"] },
        { label: "Game Porting Toolkit alone", cells: ["Free", "Yes, via D3DMetal", "Kernel-level: no", "High, Terminal and manual setup"] },
        { label: "GeForce NOW", cells: ["Free tier, paid tiers", "Yes, runs on a remote PC", "Yes, for supported games", "Low, needs fast internet"] },
        { label: "Parallels Desktop", cells: ["Paid, plus Windows", "No, up to DirectX 11.1", "Most blocked in a VM", "Medium"] },
        { label: "CrossOver (for reference)", cells: ["$74 a year of updates", "Yes, through D3DMetal", "Kernel-level: no", "Low, commercial support"] },
      ],
    },
    after: [
      {
        id: "performance",
        title: "What to expect from performance",
        body: [
          ["Wine doesn't emulate a PC, but Rosetta 2 and the DirectX-to-Metal layer both add work. A game that runs at a steady frame rate on a mid-range Windows PC may need lower settings on a base M-series chip. The first minutes of a new game often stutter while shaders compile; that usually settles down."],
          ["If a game starts but looks wrong or crashes, switching the graphics backend is the first thing to try. Memory matters too: the Game Porting Toolkit's published requirements recommend 16 GB, and big games benefit from it with any backend."],
        ],
      },
      {
        id: "honest",
        title: "When CrossOver is still worth it",
        body: [
          ["If you rely on one specific game, want someone to email when it breaks, or play titles that CodeWeavers has fixed by hand, CrossOver's trial is worth trying before you give up. Paying for it also funds the Wine work that every free Mac project uses."],
          ["Vermut is free, but it's a young project and doesn't promise every game. Its strength is a free, quick way to try your Steam and Epic library on a Mac."],
        ],
      },
    ],
    faq: [
      { q: "Is there a free version of CrossOver?", a: ["No, CrossOver has a 14-day free trial, then a paid licence. Wine itself is free, and Vermut is a free app built on it."] },
      { q: "Is Wine an emulator?", a: ["No. Wine reimplements Windows APIs on macOS. On Apple Silicon, Rosetta 2 translates the x86 code, so there's no full PC being emulated."] },
      { q: "Can I use Apple's Game Porting Toolkit to play games?", a: ["It's a developer tool, but its D3DMetal layer runs many DirectX 12 games. Download it from Apple and Vermut offers D3DMetal as a backend."] },
      { q: "What about Boot Camp?", a: ["Boot Camp only exists on Intel Macs. Apple Silicon Macs can't boot Windows."] },
      { q: "Why won't games with anti-cheat run?", a: ["Kernel-level anti-cheat expects a real Windows kernel and blocks Wine and most virtual machines. Cloud gaming is the only way to play those on a Mac."] },
    ],
    sources: [S.cxStore, S.cxLicence, S.cx26, S.gptk, S.gptkReq, S.parallels, S.gfn, S.aacy, S.cxCompat, S.vermut],
  },
];

export const getGuide = (slug: string) => guides.find((g) => g.slug === slug);
export const COMPAT_HREF = COMPAT;
