/**
 * Deutsch. Machine-assisted, needs native review (see docs/I18N.md).
 * macOS labels from Apple's German support page mh40616. Quotes use »…«
 * because the display/text font subsets don't include „ (U+201E).
 */
import { links, site } from "@/site.config";
import { build } from "../build";

const macos = "macOS 14 Sonoma oder neuer";

export const de = build({
  locale: "de",
  seo: {
    title: "Vermut: Windows-Spiele auf dem Mac mit Steam, GOG und Epic",
    description:
      "Kostenloser Open-Source-Launcher für Macs mit Apple Silicon. Vermut installiert Steam und GOG Galaxy, fügt Epic Games (Beta) hinzu, richtet Wine ein und startet deine Windows-Spiele.",
    keywords: ["Windows-Spiele auf dem Mac", "Steam Mac Apple Silicon", "Epic Games Mac", "GOG Galaxy Mac", "Wine macOS", "Whisky Alternative", "CrossOver Alternative", "kostenloser Open-Source Spiele-Launcher Mac", "Vermut"],
  },
  nav: ["So funktioniert’s", "Kompatibilität", "Vergleich", "Unterstützen", "FAQ", "Download"],
  hero: {
    eyebrow: "Kostenlos · Open Source · Apple Silicon",
    lead: "Vermut installiert Steam und GOG Galaxy auf deinem Mac, fügt deine Epic-Games-Bibliothek hinzu (Beta) und richtet für jeden Store Wine ein. So starten deine Windows-Spiele mit einem Klick.",
    primary: "Für Mac laden",
    secondary: "Auf GitHub markieren",
    meta: [macos, "Apple Silicon", `${site.license}-Lizenz`],
    screenshotAlt:
      "Die Library von Vermut: ein Steam-Spiel mit dem Status Ready und einer Play-Taste. Die Seitenleiste zeigt Stores, Library, Downloads und je eine Bottle für Steam, Epic Games und GOG Galaxy.",
  },
  howItWorks: {
    eyebrow: "So funktioniert’s",
    title: "Drei Schritte. Kein Terminal.",
    lead: "Keine Bottle einrichten, keine Wine-Version wählen, keine Befehlszeile. Jedes Video unten zeigt die echte App.",
    steps: [
      {
        title: "Store wählen",
        body: "Wähle Steam, GOG Galaxy oder Epic Games (Beta). Steam und GOG kommen über ihre offiziellen Installer, Epic über den Open-Source-Client Legendary, ganz ohne Epic-Launcher. Jeder Store bekommt eine eigene Bottle, damit sie sich nicht in die Quere kommen.",
        description: "Bildschirmaufnahme: Die Ansicht Stores zeigt Steam, Epic Games (Beta) und GOG Galaxy, jeweils in einer eigenen Bottle. Der Zeiger fährt über die Stores und klickt auf Open Steam.",
      },
      {
        title: "Vermut richtet Wine ein",
        body: "Jede Bottle erhält Wine 11 und die passende Grafikschicht für ihren Store: DXMT für Steam, DXVK für Epic, WineD3D für GOG. Du kannst das später ändern, musst aber nicht.",
        description: "Bildschirmaufnahme: Der Zeiger öffnet die Steam-Bottle in der Seitenleiste, wechselt zum Tab Graphics und zeigt auf das gewählte Backend, DXMT.",
      },
      {
        title: "Spielen",
        body: "Melde dich wie gewohnt bei deinem Store an und installiere Spiele. Sie erscheinen in der Library, und Play startet jedes in der richtigen Bottle.",
        description: "Bildschirmaufnahme: Der Zeiger öffnet die Library, in der ein Steam-Spiel als Ready markiert ist, und klickt in der Leiste Continue auf Play.",
      },
    ],
  },
  compatibility: {
    eyebrow: "Kompatibilität, ehrlich gesagt",
    title: "Was läuft und was nicht.",
    lead: "Vermut führt Windows-Spiele mit Wine aus. Viele laufen gut, manche werden nie laufen. Das sagen wir dir lieber jetzt als nach einem 60-GB-Download.",
    groups: [
      {
        title: "Läuft meistens",
        items: [
          ["DirectX-9-, -10- und -11-Spiele, von DXMT oder DXVK nach Metal übersetzt."],
          ["Indie- und ältere Titel, oft die einfachsten Kandidaten."],
          ["Die Clients von Steam und GOG Galaxy selbst sowie deine Epic-Games-Bibliothek über Legendary (Beta)."],
        ],
      },
      {
        title: "Braucht etwas Einrichtung",
        items: [
          ["DirectX-12-Spiele brauchen Apples ", { text: "Game Porting Toolkit", href: "https://developer.apple.com/games/game-porting-toolkit/" }, " (D3DMetal). Vermut erkennt es, wenn du es installierst, liefert es aber nie mit."],
          ["Spiele mit eigenem Launcher, etwa die EA app oder Ubisoft Connect, brauchen eventuell Run .exe in einer Bottle und etwas Ausprobieren."],
        ],
      },
      {
        title: "Läuft nicht",
        items: [
          ["Spiele mit Anti-Cheat auf Kernel-Ebene, darunter Valorant, Fortnite und Call of Duty. Das Anti-Cheat blockiert Wine, und auf dem Mac lässt sich daran nichts ändern."],
          ["Alles, was einen Windows-Treiber braucht, etwa manche Peripherie- oder DRM-Tools."],
        ],
      },
    ],
    footnote: [
      "Bevor du ein Spiel kaufst: Prüfe ",
      { text: "Are We Anti-Cheat Yet?", href: "https://areweanticheatyet.com/" },
      " für den Anti-Cheat-Status und die ",
      { text: "Kompatibilitätsdatenbank von CodeWeavers", href: "https://www.codeweavers.com/compatibility" },
      " für Wine-Berichte auf dem Mac.",
    ],
  },
  comparison: {
    eyebrow: "Im Vergleich",
    title: "Wo Vermut steht.",
    lead: "Es gibt gute Wege, Windows-Spiele auf dem Mac zu spielen. So unterscheiden sie sich, Stand Oktober 2026.",
    rows: [
      { label: "Preis", cells: [["Kostenlos"], ["Kostenlos"], ["Ab 74 $", "12 Monate Updates; 14 Tage kostenlos testen [3][4]"], ["Kostenlos"]] },
      { label: "Open Source", cells: [["Ja, MIT"], ["Ja, GPL-3.0 [2]"], ["Nein", "Basiert auf Wine (LGPL)"], ["Ja, GPL-3.0 [6]"]] },
      { label: "Aktiv gepflegt", cells: [["Ja"], ["Nein", "Am 9. April 2025 archiviert; ein Community-Fork läuft weiter [1][2]"], ["Ja", "CrossOver 26, Februar 2026 [5]"], ["Ja", "v2.22.4, 15. Oktober 2026 [7]"]] },
      {
        label: "Richtet Steam, Epic und GOG für dich ein",
        cells: [
          ["Ja", "Steam und GOG in eigenen Bottles; Epic (Beta) über Legendary, ohne Epic-Launcher"],
          ["Nein", "Du legst eine Bottle an und startest jeden Installer"],
          ["Ja", "Aus dem eigenen Installationskatalog; Epic und GOG seit CrossOver 25 [9][10]"],
          ["Epic, GOG, Amazon", "Eigener Launcher; kein Steam-Client [6]"],
        ],
      },
      {
        label: "Wine-Engine",
        cells: [
          ["Mitgeliefert", "Wine 11 mit DXMT und DXVK; D3DMetal, wenn du es installierst"],
          ["Mitgeliefert, eingefroren", "Kein Upgrade auf Wine 8+ [1]"],
          ["Mitgeliefert", "Eigener Build von CodeWeavers"],
          ["Deine Wahl", "Lädt Wine, GPTK-Builds oder nutzt CrossOver [8]"],
        ],
      },
      { label: "Ohne Terminal nutzbar", cells: [["Ja"], ["Ja"], ["Ja"], ["Ja"]] },
      { label: "Support", cells: [["GitHub-Issues"], ["Keiner"], ["E-Mail und Telefon", "Solange die Lizenz aktiv ist [3]"], ["Community", "GitHub und Discord"]] },
    ],
    aside: ["Du brauchst kommerziellen Support oder die breiteste Abdeckung? Kauf CrossOver. CodeWeavers gehört zu den größten Wine-Mitwirkenden, und jedes Wine-Projekt für den Mac, auch Vermut, baut auf dieser Arbeit auf."],
    sourcesTitle: "Quellen, geprüft am 19. Oktober 2026",
  },
  support: {
    eyebrow: "Vermut unterstützen",
    title: "Kostenlos, und das bleibt so.",
    lead: "Vermut entsteht in der Freizeit. Spenden bezahlen diese Zeit und die Macs und Spiele, auf denen wir testen. Eine Bezahlversion kommt so oder so nicht.",
    donateLabel: "Mit PayPal spenden",
    donateNote: "PayPal öffnet sich in einem neuen Tab.",
    otherTitle: "Kein Geld übrig? Das hilft genauso.",
    options: [
      { title: "Auf GitHub markieren", body: "Sterne helfen anderen Mac-Spielern, das Projekt zu finden.", label: "Repository markieren" },
      { title: "Fehler melden", body: "Etwas kaputt? Ein Issue mit macOS-Version und Logs hilft beim Beheben.", label: "Fehlerbericht öffnen" },
      { title: "Sag uns, welche Spiele laufen", body: "Etwas gespielt? Nenne Spiel, Store und Grafik-Backend, ob es läuft oder nicht.", label: "Spielbericht senden" },
    ],
    share: { title: "Vermut teilen", body: "Du kennst jemanden, der auf dem Mac spielt? Schick den Link weiter.", text: "Vermut: Windows-Spiele auf dem Mac mit Steam, GOG und Epic. Kostenlos und Open Source." },
  },
  faq: {
    eyebrow: "FAQ",
    title: "Fragen und Antworten.",
    items: [
      { q: "Ist Vermut wirklich kostenlos?", a: [`Ja. Open Source unter der ${site.license}-Lizenz, ohne Konto, ohne Bezahlversion, ohne Telemetrie.`] },
      { q: "Läuft es auf Intel-Macs?", a: ["Nein. Vermut ist für Apple Silicon gebaut: M1 und alle neueren Chips."] },
      { q: "Welche macOS-Version brauche ich?", a: [`${macos}.`] },
      { q: "Läuft mein Spiel?", a: ["Das hängt vom Spiel ab. Die meisten Titel mit DirectX 9 bis 11 ja, Spiele mit Kernel-Anti-Cheat nicht. Das ganze Bild steht im Abschnitt ", { text: "Kompatibilität", href: "#compatibility" }, "."] },
      { q: "Sieht Vermut mein Steam- oder Epic-Passwort?", a: ["Nein. Bei Steam und GOG meldest du dich in der offiziellen Store-App an, die in ihrer eigenen Bottle läuft. Bei Epic (Beta) meldest du dich auf der Anmeldeseite von Epic an, und Legendary speichert die Sitzung auf deinem Mac."] },
      { q: "Installiert Vermut den Epic Games Launcher?", a: ["Nein. Der Epic-Support ist in der Beta und nutzt ", { text: "Legendary", href: "https://github.com/derrod/legendary" }, ", einen Open-Source-Client für Epic: anmelden, Bibliothek ansehen, Spiele installieren und starten, ohne den Epic Games Launcher."] },
      { q: "Liefert es Apples Game Porting Toolkit mit?", a: ["Nein, Vermut liefert es nie mit. Wenn du es selbst installierst, erkennt Vermut es und bietet D3DMetal als Grafikoption an."] },
      {
        q: "Warum zeigt macOS eine Warnung?",
        a: [
          "Vermut ist kostenlos und Open Source und weder mit einer kostenpflichtigen Apple Developer ID signiert noch von Apple beglaubigt. Deshalb kann Gatekeeper nicht dafür bürgen. Du erlaubst es einmal unter Systemeinstellungen › Datenschutz & Sicherheit (siehe ",
          { text: "die Schritte für den ersten Start", href: "#download" },
          "). Du kannst den ",
          { text: "Quellcode", href: links.github },
          " lesen und die SHA-256 der DMG mit der auf dieser Seite vergleichen.",
        ],
      },
      { q: "Brauche ich Terminal oder Homebrew?", a: ["Nein. Alles läuft in der App, vom Installieren eines Stores bis zum Starten eines Spiels."] },
      { q: "Was ist der Unterschied zu Whisky?", a: ["Whisky war eine allgemeine Oberfläche für Wine und wird nicht mehr gepflegt. Vermut ist um Spiele-Stores herum gebaut: eine Bottle pro Store, für dich eingerichtet, und eine Library für alles, was du installierst."] },
      { q: "Wie deinstalliere ich es?", a: ["Lösche jede Bottle in ihrem Bereich Danger zone in Vermut (das entfernt den Store und seine Spiele) und zieh Vermut dann in den Papierkorb."] },
    ],
    requirements: {
      title: "Voraussetzungen",
      items: [
        { label: "Mac", value: "Apple Silicon (M1 oder neuer)" },
        { label: "macOS", value: "14 Sonoma oder neuer" },
        { label: "Speicher", value: "10 GB frei, plus Platz für deine Spiele" },
        { label: "Rosetta 2", value: "Wird bei Bedarf für dich installiert" },
        { label: "Internet", value: "Zum Laden von Stores und Spielen" },
      ],
    },
  },
  download: {
    eyebrow: "Download",
    title: "Vermut für deinen Mac laden.",
    lead: "Eine DMG, direkt aus dem neuesten GitHub-Release. Kostenlos, kein Konto nötig.",
    primaryLabel: (version) => `Vermut ${version} laden (.dmg)`,
    shaLabel: "SHA-256",
    allReleases: "Alle Releases und Versionshinweise",
    brewLabel: "Oder mit Homebrew installieren",
    installTitle: "In einer Minute installiert",
    steps: (dmgName) => [
      `Öffne ${dmgName} in deinem Ordner »Downloads«.`,
      "Zieh Vermut in den Ordner »Programme«.",
      "Öffne Vermut aus »Programme«. Fehlt Rosetta 2 auf deinem Mac, installiert Vermut es für dich.",
    ],
    gatekeeper: {
      firstLaunch: "Beim ersten Start öffne Systemeinstellungen > Datenschutz & Sicherheit und klicke auf „Dennoch öffnen“ (macOS Tahoe und Sequoia).",
      firstLaunchLink: "So geht’s",
      title: "Erster Start: Vermut einmal erlauben",
      why: "macOS warnt dich, weil Vermut eine kostenlose Open-Source-App ist, die nicht mit einer kostenpflichtigen Apple Developer ID signiert ist. Du kannst jede Zeile des ",
      whySource: "Quellcodes",
      whyAnd: " lesen und den Download mit seiner ",
      whySha: "SHA-256",
      whyEnd: " prüfen.",
      steps: [
        { title: "Vermut öffnen", body: "Doppelklicke in »Programme« auf Vermut. macOS zeigt »Vermut« wurde nicht geöffnet. Klicke auf »Fertig«, nicht auf »In den Papierkorb legen«." },
        { title: "Datenschutz & Sicherheit öffnen", body: "Wähle Apple-Menü › »Systemeinstellungen«, klicke in der Seitenleiste auf »Datenschutz & Sicherheit« und scrolle nach unten zu »Sicherheit«." },
        { title: "Auf »Dennoch öffnen« klicken", body: "Neben der Meldung zu Vermut klickst du auf »Dennoch öffnen«. Die Taste ist etwa eine Stunde nach Schritt 1 verfügbar." },
        { title: "Bestätigen", body: "Klicke auf »Öffnen« und bestätige mit deinem Anmeldepasswort oder Touch ID. macOS merkt sich die Entscheidung, du machst das also nur einmal." },
      ],
      note: "So läuft es unter macOS 15 Sequoia und neuer, wo Control-Klick › Öffnen die Prüfung nicht mehr überspringt. Unter macOS 14 Sonoma funktioniert Control-Klick › Öffnen weiterhin.",
      appleLabel: "Apple Support: Öffnen einer Mac-App eines unbekannten Entwicklungsteams",
      appleHref: "https://support.apple.com/de-de/guide/mac-help/mh40616/mac",
      illustrationNote: "Vereinfachte Illustrationen, keine Bildschirmfotos.",
    },
    terminal: {
      title: "Lieber im Terminal? Installation mit einem Befehl (ohne Gatekeeper-Warnung)",
      body: "Das Skript lädt die neueste DMG und kopiert Vermut nach »Programme«. Lies es, bevor du es ausführst.",
      sourceLabel: "Quellcode von install.sh ansehen",
    },
  },
  footer: {
    statement: "Kostenlos und Open Source. Kein Konto, keine Telemetrie, keine Bezahlversion.",
    cta: "Für Mac laden",
    columns: [
      { title: "Projekt", links: ["GitHub", "Releases", `${site.license}-Lizenz`, "Markenpaket (.zip)"] },
      { title: "Mitmachen", links: ["Vermut unterstützen", "Leitfaden für Beiträge", "Fehler melden", "Offene Issues"] },
    ],
    legal: "Vermut steht in keiner Verbindung zu Valve, Epic Games, GOG, CodeWeavers oder Apple. Steam, Epic Games Store, GOG Galaxy und andere Namen sind Marken ihrer jeweiligen Inhaber.",
  },
  ui: {
    skipToContent: "Zum Inhalt springen",
    primaryNav: "Hauptnavigation",
    backToTop: "Vermut, zurück nach oben",
    releaseDetails: "Release-Details",
    stepPrefix: (n) => `Schritt ${n}: `,
    videoLabel: (title) => `${title}: Bildschirmaufnahme von Vermut`,
    play: (label) => `Abspielen: ${label}`,
    pause: (label) => `Pause: ${label}`,
    compareCaption: "Vermut im Vergleich mit Whisky, CrossOver und Heroic. Zahlen in eckigen Klammern verweisen auf die Quellen unter der Tabelle.",
    feature: "Merkmal",
    copied: "Kopiert",
    copySha: (file) => `SHA-256 von ${file} kopieren`,
    copyInstall: "Installationsbefehl kopieren",
    copyLink: "Link zu Vermut kopieren",
    opensNewTab: " (öffnet in neuem Tab)",
    shareNewTab: " (teilen, öffnet in neuem Tab)",
    language: "Sprache",
    macosRequirement: macos,
    appleSilicon: "Apple Silicon (M1 oder neuer)",
    facts: { version: "Version", size: "Größe", macos: "macOS", mac: "Mac", licence: "Lizenz" },
    version: (v) => `Version ${v}`,
    latest: "Neueste",
    releaseNotes: (v) => `Versionshinweise zu Vermut ${v}`,
    licence: (l) => `${l}-Lizenz`,
  },
  illustrations: {
    note: "Vereinfachte Illustrationen, keine Bildschirmfotos.",
    dialog: {
      aria: "Illustration des macOS-Dialogs »Vermut« wurde nicht geöffnet, mit den Tasten Fertig und In den Papierkorb legen. Klicke auf Fertig.",
      title: "»Vermut« wurde nicht geöffnet",
      body: "Apple konnte nicht überprüfen, ob »Vermut« frei von Schadsoftware ist, die deinem Mac schaden oder deine Privatsphäre gefährden kann.",
      trash: "In den Papierkorb legen",
      done: "Fertig",
    },
    settings: {
      aria: "Illustration von Systemeinstellungen, Datenschutz & Sicherheit, Abschnitt Sicherheit: die Meldung, dass Vermut blockiert wurde, mit der Taste Dennoch öffnen.",
      window: "Datenschutz & Sicherheit",
      section: "Sicherheit",
      allow: "Apps erlauben aus: App Store & verifizierte Entwickler",
      blocked: "»Vermut« wurde blockiert, um deinen Mac zu schützen.",
      button: "Dennoch öffnen",
    },
  },
  notFound: {
    metaTitle: "Seite nicht gefunden",
    title: "Hier gibt’s nichts einzuschenken.",
    body: "Die gesuchte Seite gibt es nicht. Vermut findest du auf der Startseite.",
    back: "Zurück zu Vermut",
  },
});
