/**
 * English dictionary: the source of truth. Every other locale must match this
 * shape (see `Dictionary` in ../types.ts). Facts checked against the app and
 * its v1.0.0 release on 19 Oct 2026.
 */
import { links, site } from "@/site.config";

import type { CompatGroup, CompareRow, Faq, NavItem, Rich, Source, Step } from "../types";

const nav: readonly NavItem[] = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Compatibility", href: "#compatibility" },
  { label: "Compare", href: "#compare" },
  { label: "Support", href: "#support" },
  { label: "FAQ", href: "#faq" },
  { label: "Download", href: "#download" },
];

export const en = {
  locale: "en",
  nav,

  hero: {
    eyebrow: "Free · Open source · Apple Silicon",
    title: ["Pour.", "Click.", "Play."] as const,
    lead: "Vermut installs Steam and GOG Galaxy on your Mac, adds your Epic Games library (beta), and sets up Wine for each, so your Windows games launch with a click.",
    primary: { label: "Download for Mac", href: links.downloadSection },
    secondary: { label: "Star on GitHub", href: links.github },
    /** The live release version is prepended by the Hero component. */
    meta: [
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
        body: "Choose Steam, GOG Galaxy or Epic Games (beta). Steam and GOG get their official installers; Epic runs through the open-source Legendary client, with no Epic launcher. Each store gets its own bottle, so they never get in each other's way.",
        video: {
          mp4: "/videos/step-1.mp4",
          webm: "/videos/step-1.webm",
          poster: "/videos/step-1-poster.webp",
          width: 1600,
          height: 1000,
          description:
            "Screen recording: the Stores screen lists Steam, Epic Games (beta) and GOG Galaxy, each installed in its own bottle. The pointer moves across the stores and clicks Open Steam.",
        },
      },
      {
        id: "wine",
        number: "02",
        title: "Vermut sets up Wine",
        body: "Each bottle gets Wine 11 and the graphics layer that suits its store: DXMT for Steam, DXVK for Epic, WineD3D for GOG. You can change it later. You don't have to.",
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
    ] as readonly Step[],
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
          ["The Steam and GOG Galaxy clients themselves, plus your Epic Games library through Legendary (beta)."],
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
    ] as readonly CompatGroup[],
    footnote: [
      "Before you buy a game, check ",
      { text: "Are We Anti-Cheat Yet?", href: "https://areweanticheatyet.com/" },
      " for anti-cheat status and ",
      { text: "CodeWeavers' compatibility database", href: "https://www.codeweavers.com/compatibility" },
      " for Wine reports on the Mac.",
    ] as Rich,
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
          { value: "Yes", note: "Steam and GOG in their own bottles; Epic (beta) via Legendary, no Epic launcher", tone: "yes" },
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
    ] as readonly CompareRow[],
    aside: [
      "Need commercial support or the widest coverage? Buy CrossOver. CodeWeavers are among the biggest contributors to Wine, and every Mac Wine project, Vermut included, builds on that work.",
    ] as Rich,
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
    ] as readonly Source[],
  },

  support: {
    id: "support",
    eyebrow: "Support Vermut",
    title: "Free, and staying that way.",
    lead: "Vermut is built in spare time. Donations pay for that time and for the Macs and games we test on. No paid tier is coming either way.",
    donateLabel: "Donate with PayPal",
    donateNote: "Opens PayPal in a new tab.",
    otherTitle: "Not a money thing? These help just as much.",
    options: [
      { id: "star", title: "Star on GitHub", body: "Stars help other Mac gamers find the project.", label: "Star the repository", href: links.github },
      { id: "bug", title: "Report a bug", body: "Something broke? An issue with your macOS version and logs gets it fixed.", label: "Open a bug report", href: links.newIssue },
      { id: "games", title: "Tell us which games work", body: "Played something? Post the game, store and graphics backend, working or not.", label: "Send a game report", href: links.gameReport },
    ],
    share: {
      title: "Share Vermut",
      body: "Know someone who games on a Mac? Send them the link.",
      text: "Vermut: play Windows games on your Mac with Steam, GOG and Epic. Free and open source.",
    },
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
      { q: "Does Vermut see my Steam or Epic password?", a: ["No. For Steam and GOG you sign in inside the official store app, running in its own bottle. For Epic (beta) you sign in on Epic's own login page, and Legendary keeps the session on your Mac."] },
      { q: "Does Vermut install the Epic Games Launcher?", a: ["No. Epic support is in beta and uses ", { text: "Legendary", href: "https://github.com/derrod/legendary" }, ", an open-source Epic client: sign in, see your library, install and launch games, without the Epic Games Launcher."] },
      { q: "Does it include Apple's Game Porting Toolkit?", a: ["No, Vermut never bundles it. If you install it yourself, Vermut detects it and offers D3DMetal as a graphics option."] },
      {
        q: "Why does macOS warn me?",
        a: [
          "Vermut is free and open source, and it isn't signed with a paid Apple Developer ID or notarized, so Gatekeeper can't vouch for it. Allow it once in System Settings › Privacy & Security (see ",
          { text: "the first-launch steps", href: "#download" },
          "). You can review the ",
          { text: "source code", href: links.github },
          " and compare the DMG's SHA-256 with the one on this page.",
        ],
      },
      { q: "Do I need Terminal or Homebrew?", a: ["No. Everything happens in the app, from installing a store to launching a game."] },
      { q: "How is it different from Whisky?", a: ["Whisky was a general-purpose Wine wrapper and is no longer maintained. Vermut is built around game stores: one bottle per store, set up for you, with a Library for everything you install."] },
      { q: "How do I uninstall it?", a: ["Delete each bottle from its Danger zone in Vermut, which removes the store and its games, then drag Vermut to the Trash."] },
    ] as readonly Faq[],
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

  download: {
    id: "download",
    eyebrow: "Download",
    title: "Get Vermut for your Mac.",
    lead: "One DMG, straight from the latest GitHub release. Free, with no account to create.",
    primaryLabel: (version: string) => `Download Vermut ${version} (.dmg)`,
    shaLabel: "SHA-256",
    allReleases: "All releases and release notes",
    brewLabel: "Or install with Homebrew",
    installTitle: "Install in a minute",
    steps: (dmgName: string) => [
      `Open ${dmgName} from your Downloads folder.`,
      "Drag Vermut to the Applications folder.",
      "Open Vermut from Applications. If your Mac doesn't have Rosetta 2 yet, Vermut installs it for you.",
    ],
    gatekeeper: {
      firstLaunch: "On first launch, open System Settings > Privacy & Security, click “Open Anyway” and confirm with Touch ID or your password.",
      firstLaunchLink: "How it works",
      title: "First launch: allow Vermut once",
      why: "macOS warns you because Vermut is a free, open-source app that isn't signed with a paid Apple Developer ID. You can read every line of the ",
      whySource: "source code",
      whyAnd: " and check the download against its ",
      whySha: "SHA-256",
      whyEnd: ".",
      steps: [
        { title: "Open Vermut, then click Done", body: "Double-click Vermut in Applications. macOS shows “Vermut” Not Opened. Click Done, not Move to Trash." },
        { title: "Click Open Anyway in Privacy & Security", body: "Choose Apple menu › System Settings › Privacy & Security, scroll down to Security and click Open Anyway next to the message about Vermut. The button appears for about an hour after step 1." },
        { title: "Click Open Anyway again", body: "A confirmation dialog appears. Click Open Anyway." },
        { title: "Confirm with Touch ID or your password", body: "macOS may ask for Touch ID or your Mac password. That’s normal: just confirm. macOS remembers the choice, so you only do this once." },
      ],
      note: "This is the flow on macOS 15 Sequoia and later, where Control-click › Open no longer skips the check. On macOS 14 Sonoma, Control-click › Open still works.",
      appleLabel: "Apple Support: Open a Mac app from an unknown developer",
      appleHref: "https://support.apple.com/guide/mac-help/open-a-mac-app-from-an-unknown-developer-mh40616/mac",
      illustrationNote: "Simplified illustrations, not screenshots.",
    },
    terminal: {
      title: "Prefer Terminal? One-line install (skips the Gatekeeper prompt)",
      body: "The script downloads the latest DMG and copies Vermut to Applications. Read it before you run it.",
      sourceLabel: "View install.sh source",
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
          { label: "Brand assets (.zip)", href: site.brandAssets },
        ],
      },
      {
        title: "Contribute",
        links: [
          { label: "Support Vermut", href: "#support" },
          { label: "Contributing guide", href: links.contributing },
          { label: "Report a bug", href: links.newIssue },
          { label: "Open issues", href: links.issues },
        ],
      },
    ],
    legal:
      "Vermut is not affiliated with Valve, Epic Games, GOG, CodeWeavers or Apple. Steam, Epic Games Store, GOG Galaxy and other names are trademarks of their respective owners.",
  },

  seo: {
  title: "Vermut: play Windows games on your Mac with Steam, GOG and Epic",
  description:
    "Free, open-source launcher for Apple Silicon Macs. Vermut installs Steam and GOG Galaxy, adds Epic Games (beta), sets up Wine and runs your Windows games.",
  keywords: [
    "play Windows games on Mac",
    "Steam on Mac Apple Silicon",
    "Epic Games on Mac",
    "GOG Galaxy on Mac",
    "Wine for macOS",
    "Whisky alternative",
    "CrossOver alternative",
    "free open source game launcher Mac",
    "Vermut",
  ],
},

  ui: {
    skipToContent: "Skip to content",
    primaryNav: "Primary",
    backToTop: "Vermut, back to top",
    releaseDetails: "Release details",
    stepPrefix: (n: number) => `Step ${n}: `,
    videoLabel: (title: string) => `${title}: screen recording of Vermut`,
    play: (label: string) => `Play: ${label}`,
    pause: (label: string) => `Pause: ${label}`,
    compareCaption: "Vermut compared with Whisky, CrossOver and Heroic. Bracketed numbers refer to the sources listed below the table.",
    feature: "Feature",
    copied: "Copied",
    copySha: (file: string) => `Copy SHA-256 of ${file}`,
    copyInstall: "Copy install command",
    copyLink: "Copy link to Vermut",
    opensNewTab: " (opens in a new tab)",
    shareNewTab: " (share, opens in a new tab)",
    language: "Language",
    macosRequirement: "macOS 14 Sonoma or later",
    appleSilicon: "Apple Silicon (M1 or later)",
    facts: { version: "Version", size: "Size", macos: "macOS", mac: "Mac", licence: "Licence" },
    version: (v: string) => `Version ${v}`,
    latest: "Latest",
    releaseNotes: (v: string) => `Vermut ${v} release notes`,
    licence: (l: string) => `${l} licence`,
  },

  illustrations: {
    note: "Simplified illustrations, not screenshots.",
    dialog: {
      aria: "Illustration of the macOS dialog “Vermut” Not Opened, with the buttons Done and Move to Trash. Click Done.",
      title: "“Vermut” Not Opened",
      body: "Apple could not verify “Vermut” is free of malware that may harm your Mac or compromise your privacy.",
      trash: "Move to Trash",
      done: "Done",
    },
    settings: {
      aria: "Illustration of System Settings, Privacy & Security, Security section: the message “Vermut” was blocked to protect your Mac, with an Open Anyway button.",
      window: "Privacy & Security",
      section: "Security",
      allow: "Allow applications from App Store & Known Developers",
      blocked: "“Vermut” was blocked to protect your Mac.",
      button: "Open Anyway",
    },
  },

  notFound: {
    metaTitle: "Page not found",
    title: "Nothing to pour here.",
    body: "The page you were looking for doesn't exist. Vermut lives on the home page.",
    back: "Back to Vermut",
  },
} as const;
