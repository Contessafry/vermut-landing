import type { Guide } from "@/lib/guides";
import { S } from "@/lib/guides";

export const guides: readonly Guide[] = [
  {
    slug: "install-wine-on-mac-apple-silicon",
    label: "Wine auf dem Mac installieren (2026)",
    metaTitle: "Wine auf dem Mac installieren (Apple Silicon, Sonoma bis Tahoe)",
    description:
      "Homebrews Cask wine-stable ist seit 1. September 2026 deaktiviert. So kommst du heute an Wine auf einem M1- bis M4-Mac: Gcenx-Builds, ein Frontend wie Vermut oder CrossOver.",
    h1: "Wine auf dem Mac installieren: so geht es 2026",
    answer: [
      "Der alte Weg, brew install --cask wine-stable, funktioniert nicht mehr: Homebrew hat den Cask am 1. September 2026 deaktiviert, weil er Apples Gatekeeper-Prüfung nicht besteht. Wine-Builds für macOS gibt es weiterhin vom Projekt Gcenx auf GitHub, aber Präfixe, Grafikschichten und Stores richtest du dann selbst ein. Wenn du Wine zum Spielen von Windows-Spielen brauchst, lädt ein Frontend wie Vermut Wine 11 für dich herunter und richtet Steam oder Epic Games (Beta) in einer eigenen Bottle ein, kostenlos.",
    ],
    sections: [
      {
        id: "what-changed",
        title: "Was sich bei Wine auf macOS geändert hat",
        body: [
          ["Jahrelang hieß es in fast jeder Anleitung, Wine mit Homebrew zu installieren. Der Cask wine-stable (Wine 11.0) ist jetzt mit dem Grund fails_gatekeeper_check deaktiviert, Homebrew installiert ihn also nicht mehr. Anleitungen von vor September 2026 sind in diesem Punkt veraltet."],
          ["Wine selbst wird weiterentwickelt und läuft weiter auf macOS. Auf einem Mac mit Apple Silicon führt es x86-64-Windows-Programme über Rosetta 2 aus, das deshalb installiert sein muss. Spiele brauchen außerdem eine Schicht, die DirectX in Metal übersetzt, etwa DXMT, DXVK mit MoltenVK oder Apples D3DMetal; reines Wine bringt nur WineD3D mit, das über OpenGL läuft."],
        ],
      },
      {
        id: "options",
        title: "Drei Wege zu Wine auf einem Mac mit Apple Silicon",
        bullets: [
          ["Gcenx-Builds, kostenlos. Das Projekt Gcenx veröffentlicht Wine Stable, Staging und Devel für macOS auf GitHub. Gut, wenn du dich im Terminal wohlfühlst und Wine auch für Programme willst, nicht nur für Spiele."],
          ["Ein kostenloses Frontend wie Vermut. Es lädt seinen eigenen Wine-11-Build, bei Bedarf auch Gcenx Wine Staging und Devel, und legt pro Store eine Bottle an. Gemacht für Steam- und Epic-Spiele, ganz ohne Terminal."],
          ["CrossOver, kostenpflichtig. Das kommerzielle Wine von CodeWeavers, mit 14 Tagen Testphase und Support. Die breiteste Kompatibilität, wenn ein bestimmtes Spiel oder Windows-Programm laufen muss."],
        ],
      },
      {
        id: "steps",
        title: "Wine für Spiele in fünf Minuten mit Vermut",
        steps: [
          { title: "Mac prüfen", body: ["Apple Silicon (M1 oder neuer) und macOS 14 Sonoma oder neuer. Intel-Macs werden nicht unterstützt."] },
          { title: "Vermut installieren", body: ["Lade das DMG, zieh Vermut in »Programme« und erlaube es einmal mit der ", { text: "Anleitung zum ersten Start", href: "/de/open-anyway-unnotarized-app-mac" }, "."] },
          { title: "Rosetta 2 und Wine installieren lassen", body: ["Beim ersten Start bietet Vermut an, Rosetta 2 zu installieren, falls es fehlt, und lädt seine Wine-11-Engine."] },
          { title: "Store wählen", body: ["Wähle Steam oder Epic Games (Beta). Vermut legt für jeden eine Bottle mit passender Grafikschicht an. GOG Galaxy kommt bald."] },
          { title: "Andere Wine-Version nötig?", body: ["Unter Einstellungen › Wine Engines kannst du Wine Staging oder Wine Devel laden und für eine einzelne Bottle oder ein einzelnes Spiel wählen."] },
        ],
      },
    ],
    after: [
      {
        id: "limits",
        title: "Ehrliche Grenzen",
        bullets: [
          ["Wine ist kein Windows. Viele Programme laufen, manche nicht, und Spiele mit Kernel-Anti-Cheat laufen nie."],
          ["Vermut ist für Spiele-Stores gebaut. Für Büroprogramme oder ein einzelnes Windows-Tool passt reines Wine oder CrossOver vielleicht besser, auch wenn Vermut eine .exe in einer eigenen Bottle starten kann."],
          ["Rosetta 2 ist entscheidend: Apple hat angekündigt, Rosetta in künftigen macOS-Versionen einzuschränken. Wine auf dem Mac kann sich also wieder ändern."],
        ],
      },
    ],
    faq: [
      { q: "Warum schlägt brew install wine-stable fehl?", a: ["Homebrew hat den Cask wine-stable am 1. September 2026 deaktiviert, weil das Paket die Gatekeeper-Prüfung von macOS nicht besteht. Nutze einen Gcenx-Build von GitHub, ein Frontend wie Vermut oder CrossOver."] },
      { q: "Läuft Wine auf macOS Sequoia und Tahoe?", a: ["Ja, auf Apple Silicon über Rosetta 2. Vermut braucht macOS 14 Sonoma oder neuer und läuft auch auf neueren Versionen."] },
      { q: "Ist Wine kostenlos?", a: ["Ja. Wine ist freie Open-Source-Software. Auch Vermut, das Wine für Spiele installiert und verwaltet, ist kostenlos und MIT-lizenziert."] },
      { q: "Kann ich Wine auf einem Intel-Mac nutzen?", a: ["Es gibt Wine-Builds für Intel-Macs, aber Vermut unterstützt nur Apple Silicon."] },
    ],
    sources: [S.brewWine, S.gcenxWine, S.winehq, S.cxStore, S.dxmt, S.vermutRelease, S.vermut],
  },

  {
    slug: "epic-games-windows-games-on-mac",
    label: "Windows-Spiele von Epic auf dem Mac",
    metaTitle: "Windows-Spiele aus dem Epic Games Store auf M1-, M2-, M3- oder M4-Macs spielen",
    description:
      "Der Epic Games Launcher für Mac installiert nur Mac-Spiele. So installierst und spielst du deine Windows-Bibliothek von Epic auf Apple Silicon kostenlos mit Vermut und Legendary.",
    h1: "Windows-Spiele aus dem Epic Games Store auf dem Mac spielen",
    answer: [
      "Der Epic Games Launcher für Mac installiert nur Spiele mit Mac-Version. Für die Windows-Spiele brauchst du auf einem Mac mit Apple Silicon Wine. Vermut erledigt das kostenlos, als Beta: Es nutzt Legendary, einen Open-Source-Client für Epic. Du meldest dich auf Epics eigener Seite an, siehst deine Bibliothek und installierst und startest Windows-Spiele in einer Wine-11-Bottle, ohne Epic Games Launcher. Fortnite und andere Spiele mit Kernel-Anti-Cheat laufen nicht.",
    ],
    sections: [
      {
        id: "why",
        title: "Warum der Epic Games Launcher für Mac nicht reicht",
        body: [
          ["Epics Launcher läuft unter macOS, bietet in der Bibliothek aber nur Mac-Versionen an. Das meiste, was du im Epic Games Store gekauft oder gratis geholt hast, gibt es nur für Windows, also lässt es sich nicht installieren."],
          ["Den Windows-Launcher von Epic in Wine zu starten geht, ist aber schwerfällig. Vermut überspringt ihn: Legendary spricht direkt mit Epics Servern, lädt die Windows-Spieldateien und startet sie in Wine."],
        ],
      },
      {
        id: "steps",
        title: "Deine Epic-Bibliothek mit Vermut einrichten",
        steps: [
          { title: "Vermut installieren", body: ["Du brauchst einen Mac mit Apple Silicon und macOS 14 oder neuer. Zieh Vermut in »Programme« und erlaube es einmal mit der ", { text: "Anleitung zum ersten Start", href: "/de/open-anyway-unnotarized-app-mac" }, "."] },
          { title: "Epic Games (Beta) wählen", body: ["Wähle Epic Games unter Stores. Vermut lädt seine Wine-Engine und den Legendary-Client und prüft dessen Prüfsumme."] },
          { title: "Auf Epics Seite anmelden", body: ["Vermut öffnet Epics Anmeldeseite. Dein Passwort geht an Epic, nicht an Vermut; Legendary speichert die Sitzung auf deinem Mac."] },
          { title: "Ein Spiel installieren", body: ["Deine Epic-Bibliothek erscheint in Vermut. Installiere ein Spiel, es wird in die Epic-Bottle geladen."] },
          { title: "Spielen und bei Bedarf anpassen", body: ["Installierte Spiele erscheinen in der Bibliothek mit einer Play-Taste. Macht eines Probleme, öffne mit ⌥⌘I die Spieleinstellungen und probiere ein anderes Grafik-Backend."] },
        ],
      },
    ],
    after: [
      {
        id: "what-works",
        title: "Was du erwarten kannst",
        bullets: [
          ["Läuft meistens: Spiele mit DirectX 9 bis 11, vor allem ältere und Indie-Titel."],
          ["DirectX-12-Spiele brauchen Apples D3DMetal: siehe ", { text: "DirectX-12-Spiele auf dem Mac", href: "/de/directx-12-games-on-mac-d3dmetal" }, "."],
          ["Läuft nicht: Fortnite, Valorant und andere Spiele mit Kernel-Anti-Cheat. Prüfe vorher ", { text: "Are We Anti-Cheat Yet?", href: S.aacy.href }, "."],
          ["Epic in Vermut ist eine Beta. Manches aus dem offiziellen Launcher, etwa der Shop oder die Freundesliste, fehlt: Spiele kaufst und holst du auf Epics Website."],
        ],
      },
    ],
    faq: [
      { q: "Kann ich mit Vermut Fortnite auf dem Mac spielen?", a: ["Nein. Fortnite nutzt Kernel-Anti-Cheat, das Wine blockiert. Auf dem Mac geht das nur per Cloud-Gaming."] },
      { q: "Installiert Vermut den Epic Games Launcher?", a: ["Nein. Es nutzt Legendary, einen Open-Source-Client für Epic, der Launcher ist also nicht nötig."] },
      { q: "Funktionieren Gratisspiele von Epic?", a: ["Gratis geholte Spiele stehen wie alle anderen in deiner Bibliothek und lassen sich installieren. Ob sie laufen, hängt vom Spiel ab."] },
      { q: "Sieht Vermut mein Epic-Passwort?", a: ["Nein. Du meldest dich auf Epics eigener Seite an, und Legendary speichert die Sitzung auf deinem Mac."] },
    ],
    sources: [S.legendary, S.epicMac, S.aacy, S.vermutRelease, S.vermut],
  },

  {
    slug: "directx-12-games-on-mac-d3dmetal",
    label: "DirectX-12-Spiele auf dem Mac mit D3DMetal",
    metaTitle: "DirectX-12-Spiele auf dem Mac spielen: mit D3DMetal",
    description:
      "DirectX-12-Spiele für Windows brauchen auf Apple Silicon Apples D3DMetal aus dem Game Porting Toolkit. So lädst du es kostenlos und nutzt es in Vermut, Schritt für Schritt.",
    h1: "DirectX-12-Spiele auf einem Mac mit Apple Silicon spielen",
    answer: [
      "DirectX-12-Spiele brauchen D3DMetal, Apples Übersetzungsschicht aus dem Game Porting Toolkit. Apples Lizenz erlaubt Apps nicht, es mitzuliefern, also lädst du es selbst von developer.apple.com, mit einem kostenlosen Apple Account. Vermut findet es dann, prüft, ob es Version 2.0 oder neuer ist, und bietet D3DMetal als Grafik-Backend für eine Bottle oder ein einzelnes Spiel an.",
    ],
    sections: [
      {
        id: "why",
        title: "Warum DirectX 12 etwas extra braucht",
        body: [
          ["Macs sprechen Metal, nicht DirectX. Vermuts Standardschicht DXMT übersetzt DirectX 10 und 11 nach Metal, DXVK deckt DirectX 9 bis 11 über Vulkan und MoltenVK ab. Keine von beiden kann DirectX 12 auf dem Mac."],
          ["Apples D3DMetal schon. Es gehört zum Game Porting Toolkit, das Apple für Entwickler baut, die Windows-Spiele testen, und ist dieselbe Schicht, auf die kommerzielle Tools für DirectX 12 setzen."],
        ],
      },
      {
        id: "steps",
        title: "D3DMetal installieren und in Vermut nutzen",
        steps: [
          { title: "Bei Apple Developer anmelden", body: ["Geh auf developer.apple.com und melde dich mit deinem Apple Account an. Ein kostenloser Account reicht."] },
          { title: "Game Porting Toolkit laden", body: ["Such in der Download-Liste nach Game Porting Toolkit und lade das .dmg."] },
          { title: "Evaluierungsumgebung öffnen", body: ["Öffne das .dmg, dann „Evaluation environment for Windows games“, und akzeptiere die Lizenz. Damit wird das Volume mit D3DMetal aktiviert."] },
          { title: "Vermut suchen lassen", body: ["Öffne Vermut › Einstellungen › D3DMetal. Vermut sucht an den üblichen Orten; findet es nichts, klicke auf Point to location… und wähle den Ordner redist/lib."] },
          { title: "Spiel auf D3DMetal umstellen", body: ["Wähle das Spiel in der Bibliothek, drücke ⌥⌘I für die Spieleinstellungen und setze Graphics backend auf D3DMetal. Oder stell es für die ganze Bottle im Tab Graphics der Bottle ein."] },
        ],
      },
    ],
    after: [
      {
        id: "limits",
        title: "Ehrliche Grenzen",
        bullets: [
          ["D3DMetal funktioniert in Vermut mit den Bottles für Steam und Epic. Vermut verändert oder verbreitet es nie."],
          ["Nicht jedes DirectX-12-Spiel läuft, und anspruchsvolle brauchen eine starke GPU: Rechne auf einem M-Basischip mit niedrigeren Einstellungen."],
          ["Spiele mit Kernel-Anti-Cheat laufen weiterhin nicht, egal mit welcher Grafikschicht."],
          ["Startet ein Spiel und stürzt dann ab, vergleiche mit DXMT: Manche Spiele haben einen DirectX-11-Modus, der besser läuft."],
        ],
      },
    ],
    faq: [
      { q: "Ist D3DMetal kostenlos?", a: ["Ja. Das Game Porting Toolkit ist ein kostenloser Download von Apple, mit einem kostenlosen Apple Account."] },
      { q: "Warum liefert Vermut D3DMetal nicht mit?", a: ["Apples Lizenz erlaubt es Apps nicht. Du lädst es bei Apple, und Vermut nutzt deine Kopie."] },
      { q: "Welche Version brauche ich?", a: ["Vermut braucht D3DMetal 2.0 oder neuer. Findet es eine ältere Version, weist es dich darauf hin, die neueste bei Apple zu laden."] },
      { q: "Brauche ich Xcode oder das Terminal?", a: ["Nein. Mit Vermut lädst du nur das .dmg, öffnest es und akzeptierst die Lizenz."] },
    ],
    sources: [S.gptk, S.gptkDownload, S.gptkReq, S.dxmt, S.vermutRelease, S.vermut],
  },

  {
    slug: "open-anyway-unnotarized-app-mac",
    label: "Vermut zum ersten Mal öffnen (Dennoch öffnen)",
    metaTitle: "Apple kann eine App nicht überprüfen? Vermut mit »Dennoch öffnen« starten",
    description:
      "Warum macOS Vermut nicht überprüfen kann und wie du es unter Sonoma, Sequoia und neuer sicher mit »Dennoch öffnen« in Datenschutz & Sicherheit startest. Plus: Download prüfen.",
    h1: "Vermut zum ersten Mal unter macOS öffnen",
    answer: [
      "macOS blockiert Vermut beim ersten Start, weil es eine kostenlose App ist, die noch nicht mit einer kostenpflichtigen Apple Developer ID notarisiert ist, nicht weil sie Schadsoftware enthält. Öffne sie einmal, klicke auf »Fertig«, geh dann zu Systemeinstellungen › Datenschutz & Sicherheit, klicke neben der Meldung zu Vermut auf »Dennoch öffnen« und bestätige mit Touch ID oder Passwort. Danach öffnet sie sich normal. Seit macOS Sequoia überspringt Ctrl-Klick › Öffnen diesen Schritt nicht mehr.",
    ],
    sections: [
      {
        id: "why",
        title: "Warum macOS warnt",
        body: [
          ["Gatekeeper prüft, ob eine App mit einer Apple Developer ID signiert und von Apple notarisiert ist. Die Notarisierung setzt eine kostenpflichtige Entwicklermitgliedschaft voraus. Vermut ist ein kostenloses Projekt unter MIT-Lizenz und noch nicht notarisiert, deshalb zeigt macOS eine Warnung wie „Apple konnte nicht überprüfen, ob Vermut frei von Schadsoftware ist“."],
          ["Die Warnung heißt, dass Apple die App nicht geprüft hat, nicht, dass ein Problem gefunden wurde. Du kannst den gesamten Quellcode auf GitHub lesen und deinen Download mit der SHA-256 auf der Download-Seite und in den Release Notes vergleichen."],
        ],
      },
      {
        id: "steps",
        title: "Vermut öffnen, Schritt für Schritt",
        steps: [
          { title: "Vermut aus »Programme« öffnen", body: ["Zieh Vermut aus dem DMG nach »Programme« und öffne es. macOS zeigt die Warnung: Klicke auf »Fertig«, nicht auf »In den Papierkorb legen«."] },
          { title: "In Datenschutz & Sicherheit auf »Dennoch öffnen« klicken", body: ["Wähle Apple-Menü › »Systemeinstellungen« › »Datenschutz & Sicherheit«, scrolle zu »Sicherheit« und klicke neben der Meldung zu Vermut auf »Dennoch öffnen«. Die Taste erscheint etwa eine Stunde lang nach Schritt 1."] },
          { title: "Erneut auf »Dennoch öffnen« klicken", body: ["Ein Bestätigungsdialog erscheint. Klicke auf »Dennoch öffnen«."] },
          { title: "Mit Touch ID oder Passwort bestätigen", body: ["macOS speichert Vermut als Ausnahme. Beim nächsten Mal reicht ein Doppelklick."] },
        ],
      },
    ],
    after: [
      {
        id: "check",
        title: "Wenn du willst, prüf vorher den Download",
        bullets: [
          ["Führe im Terminal shasum -a 256 für das DMG in deinem Download-Ordner aus und vergleiche das Ergebnis mit der SHA-256 auf der Download-Seite von Vermut."],
          ["Lade Vermut nur aus den GitHub-Releases oder von der offiziellen Website, die darauf verlinkt."],
          ["Schalte Gatekeeper nicht für den ganzen Mac ab. »Dennoch öffnen« macht nur für diese App eine Ausnahme."],
        ],
      },
    ],
    faq: [
      { q: "Ist Vermut sicher?", a: ["Vermut ist Open Source, jeder kann also nachlesen, was es tut, und jedes Release nennt seine SHA-256. Es gibt kein Konto und keine Telemetrie. Die macOS-Warnung betrifft die Notarisierung, keine erkannte Bedrohung."] },
      { q: "Warum funktioniert Ctrl-Klick › Öffnen nicht?", a: ["Apple hat diese Abkürzung mit macOS Sequoia entfernt. Nutze stattdessen »Dennoch öffnen« in Datenschutz & Sicherheit."] },
      { q: "Ich sehe »Dennoch öffnen« nicht.", a: ["Versuch zuerst, Vermut zu öffnen, und klicke auf »Fertig«: Die Taste erscheint nur etwa eine Stunde nach einem blockierten Start. Schau dann im Abschnitt »Sicherheit« unten in Datenschutz & Sicherheit."] },
      { q: "Muss ich das nach jedem Update wiederholen?", a: ["Meist nur einmal pro geladener Kopie. Warnt macOS nach einer neuen Version erneut, wiederhole dieselben Schritte."] },
    ],
    sources: [S.appleOpenAnyway, S.appleSafely, S.appleSequoia, S.vermutRelease, S.vermut],
  },

  {
    slug: "wine-bottles-and-game-settings-mac",
    label: "Bottles und Spieleinstellungen in Vermut",
    metaTitle: "Wine-Bottles, Grafik-Backends und Einstellungen pro Spiel in Vermut",
    description:
      "So funktionieren Vermuts Wine-Bottles: eine pro Store, eigene Bottles für jede .exe und Einstellungen pro Spiel für Wine-Engine, DXMT, DXVK, WineD3D oder D3DMetal.",
    h1: "Wine-Bottles und Einstellungen pro Spiel in Vermut",
    answer: [
      "Eine Bottle ist eine eigene Windows-Umgebung, ein Wine-Präfix mit eigenem Laufwerk C:. Vermut legt eine pro Store an, und du kannst eigene Bottles für Programme außerhalb von Steam und Epic hinzufügen. Die Einstellungen sind geschichtet: Vermuts Einstellungen liefern die Standardwerte, jede Bottle kann sie ändern, und seit 1.2 kann jedes Spiel sie in den Spieleinstellungen (⌥⌘I) noch einmal ändern. „Automatic“ zeigt immer den geerbten Wert.",
    ],
    sections: [
      {
        id: "layers",
        title: "Einstellungen, Bottle, Spiel: so funktionieren die Ebenen",
        bullets: [
          ["Die Einstellungen (⌘,) enthalten die Standardwerte: Wine-Engine, Grafik-Backend, DXMT-Version und Log-Level."],
          ["Eine Bottle nutzt diese Werte, bis du sie auf ihrer Seite änderst. Store-Bottles haben außerdem Windows-Version (10, 8.1 oder 7), hochauflösenden Modus, winecfg, das Laufwerk C: der Bottle im Finder, Logs und Diagnose."],
          ["Ein Spiel nutzt die Werte seiner Bottle, bis du sie in den Spieleinstellungen überschreibst. Das gilt nur für dieses Spiel."],
          ["Ein Engine-Wechsel lässt Spiele und Spielstände unberührt. Ist der Store offen, gilt die Änderung ab dem nächsten Öffnen."],
        ],
      },
      {
        id: "backends",
        title: "Welches Grafik-Backend passt",
        bullets: [
          ["DXMT, der Standard: DirectX 10 und 11 direkt nach Metal. Vermut verwaltet mehrere DXMT-Versionen unter Einstellungen › Components, damit ein Spiel bei einer älteren Version bleiben kann."],
          ["DXVK mit MoltenVK: DirectX 9 bis 11 über Vulkan. Braucht Wine Staging, das Vermut automatisch wählt."],
          ["WineD3D: Wines eigene Schicht, über OpenGL. Langsamer, für alte Spiele aber manchmal am kompatibelsten."],
          ["D3DMetal: Apples Schicht für DirectX 12, verfügbar, sobald du das Game Porting Toolkit installiert hast. Siehe ", { text: "DirectX-12-Spiele auf dem Mac", href: "/de/directx-12-games-on-mac-d3dmetal" }, "."],
        ],
      },
      {
        id: "steps",
        title: "Häufige Aufgaben",
        steps: [
          { title: "Einstellungen für ein Spiel ändern", body: ["Wähle das Spiel in der Bibliothek und drücke ⌥⌘I (View › Game Settings). Wähle Wine-Engine, Grafik-Backend, DXMT-Version oder Log-Level, oder lass Automatic."] },
          { title: "Eigene Bottle anlegen", body: ["Drücke ⇧⌘N (File › New Bottle…). Gib ihr einen Namen und wähle Engine, Grafik-Backend und Windows-Version, oder lass sie auf Automatic."] },
          { title: "Windows-Installer starten", body: ["Klicke in einer eigenen Bottle auf Run .exe or Installer… (⌘O) und wähle eine .exe oder .msi. Du kannst auch Run .exe in der Symbolleiste nutzen."] },
          { title: "Neu anfangen, wenn eine Bottle kaputt ist", body: ["Nutze Reset bottle auf der Seite der Bottle. Das löscht diese Bottle und die darin installierten Spiele; dein Store-Konto und Cloud-Spielstände liegen nicht dort."] },
        ],
      },
    ],
    faq: [
      { q: "Kann ich Bottles aus Whisky oder CrossOver importieren?", a: ["Nein. Vermut legt eigene Bottles an. Installiere den Store in Vermut und lade deine Spiele neu."] },
      { q: "Wo liegen meine Spiele?", a: ["Im Laufwerk C: der jeweiligen Bottle. Öffne es von der Bottle-Seite aus, um die Dateien im Finder zu sehen. Spiele laufen am besten von der internen SSD."] },
      { q: "Wofür ist das Log-Level?", a: ["Es bestimmt, wie viel Wine ins Log schreibt. Erhöhe es, wenn du einen Fehler auf GitHub meldest, und stell es danach zurück auf Automatic."] },
      { q: "Hat GOG Galaxy eine Bottle?", a: ["Noch nicht. In Vermut 1.2 ist GOG Galaxy als Coming soon markiert."] },
    ],
    sources: [S.vermutRelease, S.vermut, S.dxmt, S.gptk, S.gcenxWine],
  },
];
