import type { Guide, GuideUi } from "@/lib/guides";
import { S } from "@/lib/guides";
import { links } from "@/site.config";

const FIRST_LAUNCH = "/de#first-launch";

const kernelAntiCheat = [
  "Spiele mit Anti-Cheat auf Kernel-Ebene wie Valorant, Fortnite und Call of Duty laufen nicht unter Wine, und daran kann kein Mac-Tool etwas ändern. Prüfe vor dem Kauf ",
  { text: "Are We Anti-Cheat Yet?", href: S.aacy.href },
  ".",
] as const;

export const ui: GuideUi = {
  guides: "Anleitungen",
  download: "Download",
  home: "Vermut-Startseite",
  breadcrumbGuide: "Anleitung",
  downloadLabel: (v) => `Vermut ${v} laden (.dmg)`,
  firstLaunch: "Anleitung zum ersten Start",
  updated: "Aktualisiert am 22. Oktober 2026 · Apple Silicon · macOS 14+",
  compared: "Der ehrliche Vergleich",
  questions: "Häufige Fragen",
  sources: "Quellen, geprüft am 22. Oktober 2026",
  tryTitle: "Vermut ausprobieren",
  tryBody: "Kostenlos und Open Source. Steam und Epic Games (Beta) auf Wine 11. Apple Silicon, macOS 14 oder neuer.",
  moreGuides: "Weitere Anleitungen",
  allGuides: "Alle Anleitungen",
  readGuide: "Anleitung lesen",
  hub: {
    metaTitle: "Anleitungen: Windows-Spiele auf dem Mac mit Apple Silicon spielen",
    eyebrow: "Anleitungen",
    h1: "Windows-Spiele auf dem Mac, ehrlich erklärt.",
    description: "Praktische, ehrliche Anleitungen, um Windows-Spiele auf Macs mit Apple Silicon zu spielen: Steam mit Wine, Alternativen zu Whisky und Wege ohne CrossOver.",
    back: "Zurück zu Vermut",
  },
};

export const guides: readonly Guide[] = [
  {
    slug: "run-windows-steam-games-on-apple-silicon",
    label: "Windows-Steam-Spiele auf Apple Silicon",
    metaTitle: "Windows-Steam-Spiele auf dem Mac mit M1, M2, M3 oder M4 spielen",
    description:
      "So läuft die Windows-Version von Steam auf einem Mac mit Apple Silicon: mit Wine, DXMT und Rosetta 2. Schritte, was läuft, was nicht, und die kostenlosen und kostenpflichtigen Optionen.",
    h1: "Windows-Steam-Spiele auf einem Mac mit Apple Silicon spielen",
    answer: [
      "Du installierst die Windows-Version von Steam in Wine, das Windows-Aufrufe für macOS übersetzt. Rosetta 2 führt den x86-Code aus, und eine Schicht wie DXMT macht aus DirectX Metal. Vermut übernimmt diese Einrichtung kostenlos: Es lädt Wine, legt eine eigene Bottle für Steam an und startet den offiziellen Steam-Client. Die meisten Spiele mit DirectX 9 bis 11 laufen, Spiele mit Anti-Cheat auf Kernel-Ebene nicht.",
    ],
    sections: [
      {
        id: "why",
        title: "Warum Steam für macOS nicht reicht",
        body: [
          ["Steam für macOS zeigt nur Spiele mit Mac-Version. Ein Großteil einer typischen Steam-Bibliothek gibt es nur für Windows, und auf Macs mit Apple Silicon gibt es kein Boot Camp. Die Windows-Version muss also anders laufen."],
          ["Auf einem Mac mit Apple Silicon arbeiten drei Teile zusammen: Rosetta 2 führt den x86-64-Code aus, Wine stellt die Windows-APIs bereit, und eine Grafikschicht übersetzt DirectX in Metal. Es wird kein ganzer PC emuliert. Deshalb kann es schnell sein, und deshalb scheitern auch manche Spiele."],
        ],
      },
      {
        id: "steps",
        title: "Windows-Steam mit Vermut einrichten",
        steps: [
          { title: "Prüfe deinen Mac", body: ["Du brauchst einen Mac mit Apple Silicon (M1 oder neuer), macOS 14 Sonoma oder neuer und einige GB freien Speicher für Wine, Steam und deine Spiele. Intel-Macs werden nicht unterstützt."] },
          { title: "Vermut laden und öffnen", body: ["Lade das DMG von GitHub und zieh Vermut in den Ordner „Programme“. Die App ist noch nicht notarisiert, daher fragt macOS einmal nach deiner Erlaubnis: Folge der ", { text: "Anleitung zum ersten Start", href: FIRST_LAUNCH }, "."] },
          { title: "Vermut Wine vorbereiten lassen", body: ["Beim ersten Start bietet Vermut an, Rosetta 2 zu installieren, falls es fehlt, und lädt seine Wine-11-Engine, etwa 1 bis 2 GB."] },
          { title: "Steam installieren", body: ["Klick neben Steam auf Install. Vermut lädt den offiziellen Steam-Installer in eine eigene Bottle und schließt das erste Steam-Update ab. Dann meldest du dich mit deinem normalen Steam-Konto an."] },
          { title: "Installieren und spielen", body: ["Installiere Spiele im Steam-Client wie auf einem PC. Installierte Spiele erscheinen in der Bibliothek von Vermut."] },
          { title: "Wenn ein Spiel Probleme macht: Grafik-Backend wechseln", body: ["DXMT ist der Standard für DirectX 10 und 11. Du kannst die Bottle auf DXVK, WineD3D oder D3DMetal umstellen, wenn du Apples Game Porting Toolkit installiert hast. Die Beta v1.2 bringt Einstellungen für einzelne Spiele."] },
        ],
      },
      {
        id: "what-works",
        title: "Was auf Apple Silicon läuft und was nicht",
        bullets: [
          ["Läuft meistens: Spiele mit DirectX 9, 10 und 11 sowie Indie- und ältere Titel, die oft am einfachsten sind."],
          ["Braucht zusätzliche Schritte: DirectX-12-Spiele brauchen Apples D3DMetal aus dem Game Porting Toolkit, das du bei Apple lädst. Spiele mit eigenem Launcher brauchen eventuell etwas Ausprobieren."],
          ["Läuft nicht: ", ...kernelAntiCheat],
          ["Die Leistung hängt vom Spiel und vom Chip ab. Die Übersetzung kostet Leistung: Rechne mit weniger Bildern pro Sekunde als auf einem Windows-PC mit ähnlicher GPU und mit Rucklern, während Shader zum ersten Mal kompiliert werden."],
        ],
        body: [["Suche ein Spiel vor dem Kauf in der ", { text: "Kompatibilitätsdatenbank von CodeWeavers", href: S.cxCompat.href }, ": CrossOver baut auf demselben Wine auf, die Berichte sind also ein guter Anhaltspunkt."]],
      },
    ],
    compare: {
      caption: "Wege, Windows-Steam-Spiele auf einem Mac mit Apple Silicon zu spielen, Oktober 2026",
      columns: ["Option", "Preis", "Windows-Steam-Client", "Größte Einschränkung"],
      rows: [
        { label: "Vermut", cells: ["Kostenlos, MIT-Lizenz", "Ja, wird eingerichtet", "Junges Projekt; Support über GitHub-Issues"] },
        { label: "CrossOver", cells: ["74 $ für 12 Monate Updates; 14 Tage Testversion", "Ja, aus dem Installationskatalog", "Kostenpflichtig; die Option mit dem besten Support"] },
        { label: "Whisky", cells: ["Kostenlos", "Selbst einrichten", "Seit April 2025 archiviert, kein Wine 8 oder neuer"] },
        { label: "Parallels Desktop", cells: ["Kostenpflichtig", "Ja, in Windows 11 für Arm", "DirectX bis 11.1; die meisten Anti-Cheats in einer VM blockiert"] },
        { label: "GeForce NOW", cells: ["Gratis-Stufe und kostenpflichtige Stufen", "Nein, streamt unterstützte Spiele", "Braucht schnelles Internet; nur Spiele aus dem Katalog"] },
      ],
    },
    faq: [
      { q: "Kann ein M1-Mac Windows-Steam-Spiele ausführen?", a: ["Ja. Jeder Mac mit Apple Silicon und macOS 14 Sonoma oder neuer kann den Windows-Steam-Client über Wine ausführen. Ältere oder leichte Spiele laufen auf den Basis-Chips am besten; anspruchsvolle Spiele brauchen mehr GPU und Arbeitsspeicher."] },
      { q: "Brauche ich eine Windows-Lizenz?", a: ["Nein. Wine ist kein Windows, du installierst oder kaufst also kein Windows. Eine Windows-Lizenz brauchst du nur für eine virtuelle Maschine wie Parallels."] },
      { q: "Funktionieren Spielstände und Erfolge von Steam?", a: ["Ja. Du meldest dich im offiziellen Steam-Client mit deinem eigenen Konto an, Cloud-Spielstände, Erfolge und Bibliothek funktionieren also wie auf einem PC."] },
      { q: "Laufen DirectX-12-Spiele?", a: ["Manche, über Apples D3DMetal. Apples Lizenz erlaubt Apps nicht, es mitzuliefern. Du lädst das ", { text: "Game Porting Toolkit", href: S.gptk.href }, " also selbst bei Apple, und Vermut erkennt es."] },
      { q: "Ist das sicher für mein Steam-Konto?", a: ["Vermut startet den offiziellen Steam-Client und sieht dein Passwort nie. Spiele, deren Anti-Cheat Wine ablehnt, starten nicht oder verbinden sich nicht online."] },
    ],
    sources: [S.vermut, S.gptk, S.gptkReq, S.cxStore, S.cx26, S.whiskyNotice, S.parallels, S.gfn, S.aacy, S.cxCompat],
  },

  {
    slug: "free-whisky-alternative-mac",
    label: "Kostenlose Whisky-Alternative für den Mac",
    metaTitle: "Kostenlose Whisky-Alternative für den Mac (Whisky wird nicht mehr gepflegt)",
    description:
      "Whisky wurde im April 2025 archiviert. Das sind die kostenlosen und kostenpflichtigen Alternativen für Windows-Spiele auf dem Mac, und so ziehst du zu Vermut um.",
    h1: "Eine kostenlose Whisky-Alternative für deinen Mac",
    answer: [
      "Whisky wurde am 9. April 2025 archiviert und bekommt kein Wine 8 oder neuer mehr. Wenn du etwas Kostenloses und Gepflegtes suchst: Vermut ist eine Open-Source-App, die Steam und Epic Games (Beta) für dich auf Wine 11 einrichtet. Wenn du die breiteste Kompatibilität und echten Support brauchst, ist CrossOver die kostenpflichtige Option, die Whiskys Entwickler selbst empfiehlt.",
    ],
    sections: [
      {
        id: "status",
        title: "Was mit Whisky passiert ist",
        body: [
          ["Whisky war eine beliebte, kostenlose SwiftUI-Oberfläche für Wine auf Macs mit Apple Silicon. Der Entwickler hat die aktive Arbeit eingestellt und das GitHub-Repository am 9. April 2025 archiviert. Laut Wartungshinweis wechselt Whisky nicht auf Wine 8 oder neuer und bekommt keine Korrekturen für einzelne Apps oder Spiele, auch nicht für Steam."],
          ["Bestehende Installationen funktionieren vielleicht noch eine Weile, aber es wird nichts mehr behoben, und neue Spiele brauchen immer öfter ein neueres Wine. Ein Community-Fork, ", { text: "frankea/Whisky", href: S.whiskyFork.href }, ", wird unabhängig weiterentwickelt."],
        ],
      },
      {
        id: "how-different",
        title: "Was Vermut anders macht als Whisky",
        bullets: [
          ["Gebaut für Spiele-Stores. Whisky gab dir leere Bottles; Vermut gibt jedem Store eine eigene Bottle, installiert den offiziellen Steam-Client und bindet Epic Games über Legendary (Beta) ein, mit einer Bibliothek für installierte Spiele."],
          ["Eine aktuelle Engine. Vermut lädt Wine 11, standardmäßig mit DXMT für DirectX 10 und 11 auf Metal, und Wine Staging und Wine Devel als Ausweichlösungen."],
          ["Dieselbe Auswahl an Grafik-Backends: DXMT, DXVK mit MoltenVK, WineD3D und D3DMetal, wenn du Apples Game Porting Toolkit installiert hast."],
          ["Starte beliebige Windows-Dateien (.exe, .msi oder .bat) in einer Bottle, wenn ein Spiel in keinem unterstützten Store ist."],
          ["Kostenlos und unter MIT-Lizenz, ohne Konto und ohne Telemetrie."],
        ],
      },
      {
        id: "move",
        title: "Von Whisky zu Vermut wechseln",
        steps: [
          { title: "Notiere, was du spielst", body: ["Schreib deine Spiele und die Einstellungen auf, die in Whisky funktioniert haben. Steam und Epic speichern Bibliothek und Cloud-Spielstände auf ihren Servern."] },
          { title: "Lokale Spielstände sichern", body: ["Manche Spiele speichern nur in der Whisky-Bottle. Kopiere diese Spielstände, bevor du etwas änderst. Vermut kann keine Whisky-Bottles importieren."] },
          { title: "Vermut installieren", body: ["Lade es von GitHub und erlaube es einmal unter „Datenschutz & Sicherheit“, wie in der ", { text: "Anleitung zum ersten Start", href: FIRST_LAUNCH }, " beschrieben."] },
          { title: "Deinen Store installieren", body: ["Installiere Steam oder melde dich auf der Seite Stores bei Epic Games an. Vermut lädt Wine und legt die Bottle an."] },
          { title: "Spiele neu installieren", body: ["Lade deine Spiele im Store-Client erneut herunter und stelle bei Bedarf lokale Spielstände wieder her. Behalte Whisky, bis alles läuft, und entferne es dann."] },
        ],
      },
    ],
    compare: {
      caption: "Whisky und seine Alternativen, Oktober 2026",
      columns: ["Option", "Preis", "Gepflegt", "Am besten für"],
      rows: [
        { label: "Vermut", cells: ["Kostenlos, MIT", "Ja", "Steam- und Epic-Spiele ohne Einrichtung"] },
        { label: "Whisky", cells: ["Kostenlos, GPL-3.0", "Nein, seit April 2025 archiviert", "Nichts Neues; nur bestehende Setups"] },
        { label: "Whisky-Community-Fork", cells: ["Kostenlos", "Ja, von einem anderen Entwickler", "Whisky-Nutzer, die ihre Bottles behalten wollen"] },
        { label: "CrossOver", cells: ["74 $ für 12 Monate Updates; 494 $ lebenslang", "Ja, CrossOver 26 im Februar 2026", "Breiteste Kompatibilität und kommerzieller Support"] },
        { label: "Game Porting Toolkit", cells: ["Kostenloser Download bei Apple", "Ja, für Entwickler", "DirectX-12-Spiele testen; kein Launcher"] },
      ],
    },
    after: [
      {
        id: "choose",
        title: "Was solltest du nehmen?",
        bullets: [
          ["Du hast in Whisky Steam- oder Epic-Spiele gespielt und willst einen kostenlosen, gepflegten Ersatz: Probier zuerst Vermut. Das dauert ein paar Minuten und kostet nichts."],
          ["Du hast viele eigene Bottles, die du nicht neu anlegen willst: Der Community-Fork kann Whisky-Bottles importieren. Er wird von jemand anderem gepflegt, beurteile seine Updates also für sich."],
          ["Ein bestimmtes Spiel muss laufen, oder du willst Hilfe, wenn es nicht läuft: Starte die 14-tägige Testversion von CrossOver und kauf es, wenn das Spiel läuft."],
          ["Du bist Entwickler und testest einen DirectX-12-Port: Apples Game Porting Toolkit ist genau dafür gemacht."],
        ],
      },
      {
        id: "limits",
        title: "Ehrliche Grenzen",
        bullets: [
          [...kernelAntiCheat],
          ["Vermut ist jung und wird von einem kleinen Team entwickelt. Es gibt keinen kommerziellen Support; Fehler werden über GitHub-Issues bearbeitet."],
          ["Keine Wine-Oberfläche macht ein Spiel schneller als das Wine darunter. Wenn ein Spiel in Whisky wegen Wine nicht lief, teste es, bevor du annimmst, dass es woanders läuft."],
        ],
      },
    ],
    faq: [
      { q: "Ist Whisky tot?", a: ["Das ursprüngliche Projekt wird nicht mehr gepflegt. Sein GitHub-Repository wurde am 9. April 2025 archiviert und bekommt kein Wine 8 oder neuer. Es gibt einen Community-Fork, den jemand anderes betreut."] },
      { q: "Kann ich meine Whisky-Bottles in Vermut importieren?", a: ["Nein. Vermut legt für jeden Store eine eigene Bottle an. Sichere lokale Spielstände, installiere den Store in Vermut und lade deine Spiele erneut herunter."] },
      { q: "Ist Vermut wirklich kostenlos?", a: ["Ja. Es ist Open Source unter der MIT-Lizenz, ohne Konto, ohne Bezahlversion und ohne Telemetrie. Du kannst den ", { text: "Quellcode", href: links.github }, " lesen."] },
      { q: "Warum empfiehlt Whiskys Entwickler CrossOver?", a: ["CodeWeavers, die Firma hinter CrossOver, leistet einen großen Teil der Wine-Arbeit für den Mac. Die Verkäufe finanzieren diese Arbeit, und jedes kostenlose Wine-Projekt für den Mac, auch Vermut, baut darauf auf."] },
      { q: "Läuft Vermut auf Intel-Macs?", a: ["Nein. Vermut braucht einen Mac mit Apple Silicon und macOS 14 Sonoma oder neuer."] },
    ],
    sources: [S.whiskyNotice, S.whiskyRepo, S.whiskyFork, S.cxStore, S.cx26, S.gptk, S.legendary, S.vermut, S.aacy],
  },

  {
    slug: "run-windows-games-on-mac-without-crossover",
    label: "Windows-Spiele auf dem Mac ohne CrossOver",
    metaTitle: "Windows-Spiele auf dem Mac ohne CrossOver spielen, kostenlos",
    description:
      "Kostenlose Wege, Windows-Spiele auf einem Mac mit Apple Silicon ohne CrossOver zu spielen: Wine mit Vermut, Apples Game Porting Toolkit, virtuelle Maschinen und Cloud-Gaming.",
    h1: "Windows-Spiele auf dem Mac ohne CrossOver spielen",
    answer: [
      "Nutze eine kostenlose Oberfläche für Wine. Vermut ist Open Source und richtet Wine 11, Steam und Epic Games (Beta) auf jedem Mac mit Apple Silicon für dich ein. Für Spiele, die Wine nicht schafft, ist Cloud-Gaming der andere kostenlose Weg: Das Spiel wird gestreamt statt lokal ausgeführt. CrossOver bleibt die kostenpflichtige Wahl mit dem besten Support.",
    ],
    sections: [
      {
        id: "what-crossover-does",
        title: "Was CrossOver macht und was du als Ersatz brauchst",
        body: [
          ["CrossOver ist die kommerzielle Wine-Version von CodeWeavers. Sie kostet 74 $ für 12 Monate Updates und Support oder 494 $ für eine lebenslange Lizenz, und die gekaufte Version läuft auch nach Ende des Supports weiter. Es gibt eine kostenlose Testversion für 14 Tage."],
          ["Ohne CrossOver brauchst du drei Dinge: einen Wine-Build für macOS, eine Grafikschicht, die DirectX in Metal übersetzt, und etwas, das deine Spiele-Stores installiert und startet. Das geht auch von Hand im Terminal, ist aber mühsam zu pflegen. Vermut packt alle drei in eine App."],
        ],
      },
      {
        id: "options",
        title: "Deine kostenlosen Optionen",
        bullets: [
          ["Vermut, kostenlos und Open Source. Es installiert Steam und Epic Games (Beta) in eigenen Wine-11-Bottles, nutzt standardmäßig DXMT für DirectX 10 und 11 und lässt dich auf DXVK, WineD3D oder D3DMetal wechseln."],
          ["Apples Game Porting Toolkit. Kostenlos mit einem Apple-Entwicklerkonto, gedacht für Entwickler, die ihre Spiele testen wollen. Es enthält D3DMetal, mit dem viele DirectX-12-Spiele laufen, ist aber kein Launcher, und Apps dürfen es nicht mitliefern."],
          ["Cloud-Gaming wie GeForce NOW, mit kostenloser Stufe. Das Spiel läuft auf einem entfernten PC, Anti-Cheat ist also kein Problem, aber du brauchst eine schnelle, stabile Verbindung, und das Spiel muss im Katalog des Dienstes sein."],
          ["Eine virtuelle Maschine wie Parallels Desktop ist nicht kostenlos, und Windows für Arm in einer VM unterstützt DirectX nur bis 11.1 und blockiert die meisten Anti-Cheats."],
        ],
      },
      {
        id: "steps",
        title: "Ein Windows-Spiel kostenlos mit Vermut spielen",
        steps: [
          { title: "Prüfe zuerst das Spiel", body: ["Such es in der ", { text: "Kompatibilitätsdatenbank von CodeWeavers", href: S.cxCompat.href }, " und auf ", { text: "Are We Anti-Cheat Yet?", href: S.aacy.href }, ". Wenn es Anti-Cheat auf Kernel-Ebene braucht, nimm Cloud-Gaming."] },
          { title: "Vermut installieren", body: ["Lade das DMG, zieh Vermut in „Programme“ und erlaube es einmal, wie in der ", { text: "Anleitung zum ersten Start", href: FIRST_LAUNCH }, " beschrieben. Du brauchst einen Mac mit Apple Silicon und macOS 14 oder neuer."] },
          { title: "Deinen Store installieren", body: ["Installiere Steam oder melde dich bei Epic Games an. Vermut lädt Wine und bei Bedarf Rosetta 2."] },
          { title: "Für DirectX-12-Spiele D3DMetal hinzufügen", body: ["Lade das Game Porting Toolkit bei Apple. Vermut erkennt es und bietet D3DMetal als Grafik-Backend an."] },
          { title: "Nicht in einem Store? Starte den Installer", body: ["Mit Run .exe startest du jeden Windows-Installer in einer Bottle. Die Ergebnisse schwanken hier stärker als bei Store-Spielen."] },
        ],
      },
    ],
    compare: {
      caption: "Windows-Spiele ohne CrossOver, Oktober 2026",
      columns: ["Option", "Kosten", "DirectX 12", "Spiele mit Anti-Cheat", "Aufwand"],
      rows: [
        { label: "Vermut", cells: ["Kostenlos", "Mit D3DMetal von Apple", "Kernel-Ebene: nein", "Gering, eine App"] },
        { label: "Nur Game Porting Toolkit", cells: ["Kostenlos", "Ja, über D3DMetal", "Kernel-Ebene: nein", "Hoch, Terminal und manuelle Einrichtung"] },
        { label: "GeForce NOW", cells: ["Gratis-Stufe und kostenpflichtige Stufen", "Ja, läuft auf einem entfernten PC", "Ja, bei unterstützten Spielen", "Gering, braucht schnelles Internet"] },
        { label: "Parallels Desktop", cells: ["Kostenpflichtig, plus Windows", "Nein, bis DirectX 11.1", "Meist in einer VM blockiert", "Mittel"] },
        { label: "CrossOver (zum Vergleich)", cells: ["74 $ für ein Jahr Updates", "Ja, über D3DMetal", "Kernel-Ebene: nein", "Gering, kommerzieller Support"] },
      ],
    },
    after: [
      {
        id: "performance",
        title: "Was du von der Leistung erwarten kannst",
        body: [
          ["Wine emuliert keinen PC, aber Rosetta 2 und die Übersetzung von DirectX nach Metal kosten Rechenzeit. Ein Spiel, das auf einem Windows-PC der Mittelklasse flüssig läuft, braucht auf einem M-Basis-Chip eventuell niedrigere Einstellungen. Die ersten Minuten eines neuen Spiels ruckeln oft, während Shader kompiliert werden; das legt sich meist."],
          ["Wenn ein Spiel startet, aber falsch aussieht oder abstürzt, wechsle zuerst das Grafik-Backend. Auch der Arbeitsspeicher zählt: Die veröffentlichten Anforderungen des Game Porting Toolkit empfehlen 16 GB, und große Spiele profitieren davon mit jedem Backend."],
        ],
      },
      {
        id: "honest",
        title: "Wann sich CrossOver trotzdem lohnt",
        body: [
          ["Wenn du auf ein bestimmtes Spiel angewiesen bist, jemanden anschreiben willst, wenn es nicht mehr läuft, oder Titel spielst, die CodeWeavers von Hand repariert hat, lohnt sich die Testversion von CrossOver, bevor du aufgibst. Wer CrossOver kauft, finanziert auch die Wine-Arbeit, die alle kostenlosen Mac-Projekte nutzen."],
          ["Vermut ist kostenlos, aber ein junges Projekt und verspricht nicht, dass jedes Spiel läuft. Seine Stärke: ein kostenloser, schneller Weg, deine Steam- und Epic-Bibliothek auf dem Mac auszuprobieren."],
        ],
      },
    ],
    faq: [
      { q: "Gibt es CrossOver kostenlos?", a: ["Nein. CrossOver hat eine kostenlose Testversion für 14 Tage, danach brauchst du eine kostenpflichtige Lizenz. Wine selbst ist kostenlos, und Vermut ist eine kostenlose App, die darauf aufbaut."] },
      { q: "Ist Wine ein Emulator?", a: ["Nein. Wine implementiert die Windows-APIs auf macOS neu. Auf Apple Silicon übersetzt Rosetta 2 den x86-Code, es wird also kein ganzer PC emuliert."] },
      { q: "Kann ich mit Apples Game Porting Toolkit spielen?", a: ["Es ist ein Entwicklerwerkzeug, aber seine D3DMetal-Schicht bringt viele DirectX-12-Spiele zum Laufen. Lade es bei Apple, und Vermut bietet D3DMetal als Backend an."] },
      { q: "Und Boot Camp?", a: ["Boot Camp gibt es nur auf Intel-Macs. Macs mit Apple Silicon können Windows nicht direkt starten."] },
      { q: "Warum laufen Spiele mit Anti-Cheat nicht?", a: ["Anti-Cheat auf Kernel-Ebene erwartet einen echten Windows-Kernel und blockiert Wine und die meisten virtuellen Maschinen. Auf dem Mac geht das nur über Cloud-Gaming."] },
    ],
    sources: [S.cxStore, S.cxLicence, S.cx26, S.gptk, S.gptkReq, S.parallels, S.gfn, S.aacy, S.cxCompat, S.vermut],
  },
];
