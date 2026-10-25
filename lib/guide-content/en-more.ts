import type { Guide } from "@/lib/guides";
import { S } from "@/lib/guides";


/** Guides added 25 October 2026: two search-intent guides, three on how Vermut works. */
export const guides: readonly Guide[] = [
  {
    slug: "install-wine-on-mac-apple-silicon",
    label: "Install Wine on a Mac in 2026",
    metaTitle: "How to install Wine on a Mac (Apple Silicon, Sonoma to Tahoe)",
    description:
      "Homebrew's wine-stable cask was disabled on 1 September 2026. The ways to get Wine on an M1 to M4 Mac today: Gcenx builds, a Wine front end like Vermut, or CrossOver.",
    h1: "How to install Wine on a Mac in 2026",
    answer: [
      "The old shortcut, brew install --cask wine-stable, no longer works: Homebrew disabled the cask on 1 September 2026 because it fails Apple's Gatekeeper checks. You can still download Wine builds for macOS from the Gcenx project on GitHub, but you then set up prefixes, graphics layers and stores yourself. If you want Wine to play Windows games, a front end such as Vermut downloads Wine 11 for you and sets up Steam or Epic Games (beta) in its own bottle, for free.",
    ],
    sections: [
      {
        id: "what-changed",
        title: "What changed with Wine on macOS",
        body: [
          ["For years most guides said to install Wine with Homebrew. The wine-stable cask (Wine 11.0) is now marked disabled with the reason fails_gatekeeper_check, so Homebrew refuses to install it. Guides written before September 2026 are out of date on this point."],
          ["Wine itself is still developed and still runs on macOS. On an Apple Silicon Mac it runs x86-64 Windows programs through Rosetta 2, so Rosetta must be installed. Games also need a layer that turns DirectX into Metal, such as DXMT, DXVK with MoltenVK, or Apple's D3DMetal; plain Wine only includes WineD3D, which goes through OpenGL."],
        ],
      },
      {
        id: "options",
        title: "Three ways to get Wine on an Apple Silicon Mac",
        bullets: [
          ["Gcenx builds, free. The Gcenx project publishes Wine Stable, Staging and Devel packages for macOS on GitHub. Good if you're comfortable in Terminal and want plain Wine for apps, not only games."],
          ["A free front end such as Vermut. It downloads its own Wine 11 build, plus Gcenx Wine Staging and Devel on demand, and creates one bottle per store. Made for Steam and Epic games; there's no Terminal step."],
          ["CrossOver, paid. CodeWeavers' commercial Wine, with a 14-day trial and support. The widest compatibility if you need a specific game or Windows app to work."],
        ],
      },
      {
        id: "steps",
        title: "Get Wine for games in five minutes with Vermut",
        steps: [
          { title: "Check your Mac", body: ["Apple Silicon (M1 or later) and macOS 14 Sonoma or later. Intel Macs aren't supported."] },
          { title: "Install Vermut", body: ["Download the DMG, drag Vermut to Applications and allow it once with the ", { text: "first-launch guide", href: "/open-anyway-unnotarized-app-mac" }, "."] },
          { title: "Let it install Rosetta 2 and Wine", body: ["On first launch Vermut offers to install Rosetta 2 if it's missing and downloads its Wine 11 engine."] },
          { title: "Choose your store", body: ["Pick Steam or Epic Games (beta). Vermut creates a bottle for each, with a graphics layer already set. GOG Galaxy is coming soon."] },
          { title: "Need another Wine version?", body: ["In Settings › Wine Engines you can download Wine Staging or Wine Devel and pick them for a single bottle or game."] },
        ],
      },
    ],
    after: [
      {
        id: "limits",
        title: "Honest limits",
        bullets: [
          ["Wine isn't Windows. Many programs run, some don't, and games with kernel-level anti-cheat never will."],
          ["Vermut is built for game stores. For office software or a single Windows utility, plain Wine or CrossOver may suit you better, although Vermut can run an .exe in a custom bottle."],
          ["Rosetta 2 matters: Apple has said it will limit Rosetta in future macOS versions, so the Mac Wine landscape may change again."],
        ],
      },
    ],
    faq: [
      { q: "Why does brew install wine-stable fail?", a: ["Homebrew disabled the wine-stable cask on 1 September 2026 because the package fails macOS Gatekeeper checks. Use a Gcenx build from GitHub, a front end such as Vermut, or CrossOver."] },
      { q: "Does Wine work on macOS Sequoia and Tahoe?", a: ["Yes, on Apple Silicon through Rosetta 2. Vermut needs macOS 14 Sonoma or later and runs on newer versions too."] },
      { q: "Is Wine free?", a: ["Yes. Wine is free, open-source software. Vermut, which installs and manages it for games, is also free and MIT-licensed."] },
      { q: "Can I use Wine on an Intel Mac?", a: ["Wine builds exist for Intel Macs, but Vermut supports Apple Silicon only."] },
    ],
    sources: [S.brewWine, S.gcenxWine, S.winehq, S.cxStore, S.dxmt, S.vermutRelease, S.vermut],
  },

  {
    slug: "epic-games-windows-games-on-mac",
    label: "Play Windows Epic Games on a Mac",
    metaTitle: "How to play Windows Epic Games Store games on an M1, M2, M3 or M4 Mac",
    description:
      "The Mac Epic Games Launcher only installs Mac games. How to install and play your Windows Epic library on Apple Silicon for free with Vermut and Legendary.",
    h1: "How to play Windows Epic Games Store games on a Mac",
    answer: [
      "The Epic Games Launcher for Mac only installs games that have a Mac version. To play the Windows ones on an Apple Silicon Mac you need Wine. Vermut does this for free in beta: it uses Legendary, an open-source Epic client, so you sign in on Epic's own page, see your library, and install and launch Windows games in a Wine 11 bottle, without the Epic Games Launcher. Fortnite and other games with kernel-level anti-cheat won't run.",
    ],
    sections: [
      {
        id: "why",
        title: "Why the Mac Epic Games Launcher isn't enough",
        body: [
          ["Epic's launcher runs on macOS, but its library only offers Mac builds. Most of what you've bought or claimed for free on the Epic Games Store is Windows-only, so it doesn't show up as installable."],
          ["Running the Windows Epic launcher inside Wine is possible but heavy. Vermut skips it: Legendary talks to Epic's servers directly, downloads the Windows game files and starts them in Wine."],
        ],
      },
      {
        id: "steps",
        title: "Set up your Epic library with Vermut",
        steps: [
          { title: "Install Vermut", body: ["You need an Apple Silicon Mac with macOS 14 or later. Drag Vermut to Applications and allow it once with the ", { text: "first-launch guide", href: "/open-anyway-unnotarized-app-mac" }, "."] },
          { title: "Choose Epic Games (beta)", body: ["Select Epic Games in Stores. Vermut downloads its Wine engine and the Legendary client, and checks Legendary's checksum."] },
          { title: "Sign in on Epic's page", body: ["Vermut opens Epic's login page. Your password goes to Epic, not to Vermut; Legendary keeps the session on your Mac."] },
          { title: "Install a game", body: ["Your Epic library appears in Vermut. Install a game and it downloads into the Epic bottle."] },
          { title: "Play, and tune if needed", body: ["Installed games appear in the Library with a Play button. If one misbehaves, open Game Settings with ⌥⌘I and try another graphics backend."] },
        ],
      },
    ],
    after: [
      {
        id: "what-works",
        title: "What to expect",
        bullets: [
          ["Usually runs: DirectX 9 to 11 games, especially older and indie titles."],
          ["DirectX 12 games need Apple's D3DMetal: see ", { text: "DirectX 12 games on a Mac", href: "/directx-12-games-on-mac-d3dmetal" }, "."],
          ["Won't run: Fortnite, Valorant and other games with kernel-level anti-cheat. Check ", { text: "Are We Anti-Cheat Yet?", href: S.aacy.href }, " first."],
          ["Epic support in Vermut is in beta. Some features of the official launcher, such as its store front or friends list, aren't there: you buy and claim games on Epic's website."],
        ],
      },
    ],
    faq: [
      { q: "Can I play Fortnite on a Mac with Vermut?", a: ["No. Fortnite uses kernel-level anti-cheat that blocks Wine. Cloud gaming is the only way to play it on a Mac."] },
      { q: "Does Vermut install the Epic Games Launcher?", a: ["No. It uses Legendary, an open-source Epic client, so you don't need the launcher."] },
      { q: "Do free Epic games work?", a: ["Games you claimed for free are in your library like any other, so you can install them. Whether each one runs depends on the game."] },
      { q: "Does Vermut see my Epic password?", a: ["No. You sign in on Epic's own login page and Legendary stores the session on your Mac."] },
    ],
    sources: [S.legendary, S.epicMac, S.aacy, S.vermutRelease, S.vermut],
  },

  {
    slug: "directx-12-games-on-mac-d3dmetal",
    label: "DirectX 12 games on a Mac with D3DMetal",
    metaTitle: "How to play DirectX 12 games on a Mac with D3DMetal",
    description:
      "DirectX 12 Windows games on Apple Silicon need Apple's D3DMetal from the Game Porting Toolkit. How to download it for free and use it in Vermut, step by step.",
    h1: "How to play DirectX 12 games on an Apple Silicon Mac",
    answer: [
      "DirectX 12 games need D3DMetal, Apple's translation layer from the Game Porting Toolkit. Apple's licence doesn't let apps include it, so you download it yourself from developer.apple.com with a free Apple Account. Vermut then finds it, checks it's version 2.0 or later, and offers D3DMetal as a graphics backend for a bottle or a single game.",
    ],
    sections: [
      {
        id: "why",
        title: "Why DirectX 12 needs something extra",
        body: [
          ["Macs speak Metal, not DirectX. Vermut's default layer, DXMT, translates DirectX 10 and 11 to Metal, and DXVK covers DirectX 9 to 11 through Vulkan and MoltenVK. Neither handles DirectX 12 on a Mac."],
          ["Apple's D3DMetal does. It's part of the Game Porting Toolkit, which Apple makes for developers evaluating Windows games, and it's the same layer that commercial tools rely on for DirectX 12."],
        ],
      },
      {
        id: "steps",
        title: "Install D3DMetal and use it in Vermut",
        steps: [
          { title: "Sign in to Apple Developer", body: ["Go to developer.apple.com and sign in with your Apple Account. A free account is enough."] },
          { title: "Download the Game Porting Toolkit", body: ["Search for Game Porting Toolkit in the Downloads list and download the .dmg."] },
          { title: "Open the evaluation environment", body: ["Open the .dmg, then open “Evaluation environment for Windows games” and accept the licence. This mounts the volume that contains D3DMetal."] },
          { title: "Let Vermut find it", body: ["Open Vermut › Settings › D3DMetal. Vermut searches the usual places; if it doesn't find it, click Point to location… and choose the redist/lib folder."] },
          { title: "Switch the game to D3DMetal", body: ["Select the game in the Library, press ⌥⌘I to open Game Settings and set Graphics backend to D3DMetal. Or set it for the whole bottle in the bottle's Graphics tab."] },
        ],
      },
    ],
    after: [
      {
        id: "limits",
        title: "Honest limits",
        bullets: [
          ["D3DMetal works with Steam and Epic bottles in Vermut. Vermut never modifies or redistributes it."],
          ["Not every DirectX 12 game runs, and demanding ones need a strong GPU: plan on lower settings on a base M-series chip."],
          ["Games with kernel-level anti-cheat still won't run, whatever the graphics layer."],
          ["If a game starts but crashes, compare with DXMT: some games have a DirectX 11 mode that runs better."],
        ],
      },
    ],
    faq: [
      { q: "Is D3DMetal free?", a: ["Yes. The Game Porting Toolkit is a free download from Apple, with a free Apple Account."] },
      { q: "Why doesn't Vermut include D3DMetal?", a: ["Apple's licence doesn't allow apps to bundle it. You download it from Apple and Vermut uses your copy."] },
      { q: "Which version do I need?", a: ["Vermut needs D3DMetal 2.0 or later. If it finds an older one, it tells you to download the latest from Apple."] },
      { q: "Do I need Xcode or Terminal?", a: ["No. With Vermut you only download the .dmg, open it and accept the licence."] },
    ],
    sources: [S.gptk, S.gptkDownload, S.gptkReq, S.dxmt, S.vermutRelease, S.vermut],
  },

  {
    slug: "open-anyway-unnotarized-app-mac",
    label: "Open Vermut the first time (Open Anyway)",
    metaTitle: "Apple could not verify an app? How to open Vermut with Open Anyway",
    description:
      "Why macOS says it can't verify Vermut, and how to open it safely on Sonoma, Sequoia and later with Open Anyway in Privacy & Security. Plus how to check the download.",
    h1: "How to open Vermut the first time on macOS",
    answer: [
      "macOS blocks Vermut on first launch because it's a free app that isn't notarized with a paid Apple Developer ID yet, not because it contains malware. Open it once, click Done, then go to System Settings › Privacy & Security, click Open Anyway next to the message about Vermut and confirm with Touch ID or your password. From then on it opens normally. Since macOS Sequoia, Control-click › Open no longer skips this step.",
    ],
    sections: [
      {
        id: "why",
        title: "Why macOS warns you",
        body: [
          ["Gatekeeper checks that an app is signed with an Apple Developer ID and notarized by Apple. Notarization needs a paid developer membership. Vermut is a free, MIT-licensed project and isn't notarized yet, so macOS shows a warning such as “Apple could not verify Vermut is free of malware”."],
          ["The warning means Apple hasn't scanned the app, not that it found a problem. You can read the full source code on GitHub and compare your download with the SHA-256 published on the download page and in the release notes."],
        ],
      },
      {
        id: "steps",
        title: "Open Vermut, step by step",
        steps: [
          { title: "Open Vermut from Applications", body: ["Drag Vermut from the DMG to Applications, then open it. macOS shows the warning: click Done, not Move to Bin."] },
          { title: "Click Open Anyway in Privacy & Security", body: ["Choose Apple menu › System Settings › Privacy & Security, scroll to Security and click Open Anyway next to the message about Vermut. The button appears for about an hour after step 1."] },
          { title: "Click Open Anyway again", body: ["A confirmation dialog appears. Click Open Anyway."] },
          { title: "Confirm with Touch ID or your password", body: ["macOS saves Vermut as an exception. Next time it opens with a double-click."] },
        ],
      },
    ],
    after: [
      {
        id: "check",
        title: "Check the download first, if you like",
        bullets: [
          ["In Terminal, run shasum -a 256 on the DMG in your Downloads folder and compare the result with the SHA-256 on the Vermut download page."],
          ["Only download Vermut from its GitHub releases or from the official site, which links to them."],
          ["Don't turn off Gatekeeper for the whole Mac. Open Anyway only makes an exception for this app."],
        ],
      },
    ],
    faq: [
      { q: "Is Vermut safe?", a: ["Vermut is open source, so anyone can read what it does, and every release lists its SHA-256. It has no account and no telemetry. The macOS warning is about notarization, not about a detected threat."] },
      { q: "Why doesn't Control-click › Open work?", a: ["Apple removed that shortcut in macOS Sequoia. Use Open Anyway in Privacy & Security instead."] },
      { q: "I don't see Open Anyway.", a: ["Try to open Vermut first and click Done; the button only appears for about an hour after a blocked launch. Then check the Security section at the bottom of Privacy & Security."] },
      { q: "Will I have to do this after every update?", a: ["Usually only once per downloaded copy. If macOS warns you again after installing a new version, repeat the same steps."] },
    ],
    sources: [S.appleOpenAnyway, S.appleSafely, S.appleSequoia, S.vermutRelease, S.vermut],
  },

  {
    slug: "wine-bottles-and-game-settings-mac",
    label: "Bottles and per-game settings in Vermut",
    metaTitle: "Wine bottles, graphics backends and per-game settings in Vermut",
    description:
      "How Vermut's Wine bottles work: one per store, custom bottles for any .exe, and per-game settings for Wine engine, DXMT, DXVK, WineD3D or D3DMetal.",
    h1: "Wine bottles and per-game settings in Vermut",
    answer: [
      "A bottle is a separate Windows environment, a Wine prefix with its own C: drive. Vermut makes one for each store, and you can add custom bottles for apps outside Steam and Epic. Settings are layered: Vermut's Settings give the defaults, each bottle can change them, and since 1.2 each game can change them again from Game Settings (⌥⌘I). “Automatic” always shows the value it inherits.",
    ],
    sections: [
      {
        id: "layers",
        title: "Settings, bottle, game: how the layers work",
        bullets: [
          ["Settings (⌘,) hold the defaults: Wine engine, graphics backend, DXMT version and log level."],
          ["A bottle uses those defaults unless you change them on the bottle page. Store bottles also have Windows version (10, 8.1 or 7), high-resolution mode, winecfg, the bottle's C: drive in Finder, logs and diagnostics."],
          ["A game uses its bottle's values unless you override them in Game Settings. Overrides only affect that game."],
          ["Changing the engine doesn't touch your games or saves. If the store is open, the change applies the next time you open it."],
        ],
      },
      {
        id: "backends",
        title: "Which graphics backend to pick",
        bullets: [
          ["DXMT, the default: DirectX 10 and 11 straight to Metal. Vermut manages several DXMT versions in Settings › Components, so one game can stay on an older version."],
          ["DXVK with MoltenVK: DirectX 9 to 11 through Vulkan. It needs Wine Staging, which Vermut selects automatically."],
          ["WineD3D: Wine's own layer, through OpenGL. Slower, but sometimes the most compatible for old games."],
          ["D3DMetal: Apple's layer for DirectX 12, available once you install the Game Porting Toolkit. See ", { text: "DirectX 12 games on a Mac", href: "/directx-12-games-on-mac-d3dmetal" }, "."],
        ],
      },
      {
        id: "steps",
        title: "Common tasks",
        steps: [
          { title: "Change settings for one game", body: ["Select the game in the Library and press ⌥⌘I (View › Game Settings). Pick a Wine engine, graphics backend, DXMT version or log level, or leave Automatic."] },
          { title: "Create a custom bottle", body: ["Press ⇧⌘N (File › New Bottle…). Name it and choose engine, graphics backend and Windows version, or leave them on Automatic."] },
          { title: "Run a Windows installer", body: ["In a custom bottle, click Run .exe or Installer… (⌘O) and pick an .exe or .msi. You can also use Run .exe from the toolbar."] },
          { title: "Start over if a bottle breaks", body: ["Use Reset bottle on the bottle page. It deletes that bottle and the games installed in it; your store account and cloud saves aren't stored there."] },
        ],
      },
    ],
    faq: [
      { q: "Can I import Whisky or CrossOver bottles?", a: ["No. Vermut creates its own bottles. Install the store in Vermut and download your games again."] },
      { q: "Where are my games stored?", a: ["Inside each bottle's C: drive. Open it from the bottle page to see the files in Finder. Games run best from the internal SSD."] },
      { q: "What does the log level do?", a: ["It controls how much Wine writes to the log. Raise it when you're reporting a bug on GitHub, then set it back to Automatic."] },
      { q: "Does GOG Galaxy have a bottle?", a: ["Not yet. GOG Galaxy is marked Coming soon in Vermut 1.2."] },
    ],
    sources: [S.vermutRelease, S.vermut, S.dxmt, S.gptk, S.gcenxWine],
  },
];
