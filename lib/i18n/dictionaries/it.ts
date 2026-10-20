/**
 * Italiano. Native-quality copy, to be reviewed by Francesco.
 * macOS labels verified against Apple's Italian support page mh40616
 * (Impostazioni di Sistema › Privacy e sicurezza › Sicurezza › Apri comunque).
 * App UI labels (Stores, Library, Play, Run .exe, Danger zone) stay in English
 * because the app itself is English-only.
 */
import { links, site } from "@/site.config";
import { build } from "../build";

const macos = "macOS 14 Sonoma o successivo";

export const it = build({
  locale: "it",
  seo: {
    title: "Vermut: giochi Windows sul Mac con Steam, GOG ed Epic",
    description:
      "Launcher gratuito e open source per Mac con Apple Silicon. Vermut installa Steam e GOG Galaxy, aggiunge Epic Games (beta), configura Wine e avvia i tuoi giochi Windows.",
    keywords: [
      "giochi Windows su Mac",
      "Steam su Mac Apple Silicon",
      "Epic Games su Mac",
      "GOG Galaxy su Mac",
      "Wine per macOS",
      "alternativa a Whisky",
      "alternativa a CrossOver",
      "launcher giochi gratuito open source Mac",
      "Vermut",
    ],
  },
  nav: ["Come funziona", "Compatibilità", "Confronto", "Sostienici", "FAQ", "Scarica"],
  hero: {
    eyebrow: "Gratis · Open source · Apple Silicon",
    lead: "Vermut installa Steam e GOG Galaxy sul tuo Mac, aggiunge la tua libreria Epic Games (beta) e configura Wine per ciascuno: i tuoi giochi Windows partono con un clic.",
    primary: "Scarica per Mac",
    secondary: "Metti una stella su GitHub",
    meta: [macos, "Apple Silicon", `Licenza ${site.license}`],
    screenshotAlt:
      "La Library di Vermut: un gioco Steam segnato come Ready, con il pulsante Play. Nella barra laterale ci sono Stores, Library, Downloads e una bottiglia ciascuno per Steam, Epic Games e GOG Galaxy.",
  },
  howItWorks: {
    eyebrow: "Come funziona",
    title: "Tre passi. Niente Terminale.",
    lead: "Nessuna bottiglia da configurare, nessuna versione di Wine da scegliere, nessuna riga di comando. Ogni video qui sotto è l’app vera.",
    steps: [
      {
        title: "Scegli uno store",
        body: "Scegli Steam, GOG Galaxy o Epic Games (beta). Steam e GOG si installano con i loro installer ufficiali; Epic passa dal client open source Legendary, senza il launcher di Epic. Ogni store ha la sua bottiglia, così non si pestano i piedi a vicenda.",
        description:
          "Registrazione dello schermo: la schermata Stores mostra Steam, Epic Games (beta) e GOG Galaxy, ognuno installato nella sua bottiglia. Il puntatore passa sugli store e fa clic su Open Steam.",
      },
      {
        title: "Vermut configura Wine",
        body: "Ogni bottiglia riceve Wine 11 e il livello grafico più adatto al suo store: DXMT per Steam, DXVK per Epic, WineD3D per GOG. Puoi cambiarlo più avanti, ma non è necessario.",
        description:
          "Registrazione dello schermo: il puntatore apre la bottiglia di Steam dalla barra laterale, passa alla scheda Graphics e indica il backend selezionato, DXMT.",
      },
      {
        title: "Gioca",
        body: "Accedi al tuo store come sempre e installa i giochi. Li trovi nella Library, e Play avvia ciascuno nella bottiglia giusta.",
        description:
          "Registrazione dello schermo: il puntatore apre la Library, dove un gioco Steam è segnato come Ready, e fa clic su Play nella barra Continue.",
      },
    ],
  },
  compatibility: {
    eyebrow: "Compatibilità, senza giri di parole",
    title: "Cosa funziona e cosa no.",
    lead: "Vermut esegue i giochi Windows tramite Wine. Molti girano bene, alcuni non gireranno mai: preferiamo dirtelo ora, non dopo un download da 60 GB.",
    groups: [
      {
        title: "Di solito funziona",
        items: [
          ["Giochi DirectX 9, 10 e 11, tradotti in Metal da DXMT o DXVK."],
          ["Titoli indie e meno recenti, spesso i più semplici da far partire."],
          ["I client Steam e GOG Galaxy, più la tua libreria Epic Games tramite Legendary (beta)."],
        ],
      },
      {
        title: "Serve qualche passaggio in più",
        items: [
          [
            "I giochi DirectX 12 richiedono il ",
            { text: "Game Porting Toolkit", href: "https://developer.apple.com/games/game-porting-toolkit/" },
            " di Apple (D3DMetal). Se lo installi, Vermut lo rileva, ma non lo include mai.",
          ],
          ["I giochi con un proprio launcher, come l’app EA o Ubisoft Connect, possono richiedere Run .exe dentro una bottiglia e qualche tentativo."],
        ],
      },
      {
        title: "Non funziona",
        items: [
          ["I giochi con anti-cheat a livello kernel, tra cui Valorant, Fortnite e Call of Duty. L’anti-cheat blocca Wine e dal lato Mac non si può fare nulla."],
          ["Tutto ciò che richiede un driver Windows, come alcuni strumenti per periferiche o DRM."],
        ],
      },
    ],
    footnote: [
      "Prima di comprare un gioco, controlla ",
      { text: "Are We Anti-Cheat Yet?", href: "https://areweanticheatyet.com/" },
      " per lo stato dell’anti-cheat e il ",
      { text: "database di compatibilità di CodeWeavers", href: "https://www.codeweavers.com/compatibility" },
      " per le segnalazioni su Wine per Mac.",
    ],
  },
  comparison: {
    eyebrow: "A confronto",
    title: "Dove si colloca Vermut.",
    lead: "Ci sono buoni modi per giocare ai titoli Windows su Mac. Ecco le differenze, aggiornate a ottobre 2026.",
    rows: [
      { label: "Prezzo", cells: [["Gratis"], ["Gratis"], ["Da 74 $", "12 mesi di aggiornamenti; prova gratuita di 14 giorni [3][4]"], ["Gratis"]] },
      { label: "Open source", cells: [["Sì, MIT"], ["Sì, GPL-3.0 [2]"], ["No", "Basato su Wine (LGPL)"], ["Sì, GPL-3.0 [6]"]] },
      {
        label: "Sviluppo attivo",
        cells: [["Sì"], ["No", "Archiviato il 9 aprile 2025; prosegue un fork della community [1][2]"], ["Sì", "CrossOver 26, febbraio 2026 [5]"], ["Sì", "v2.22.4, 15 ottobre 2026 [7]"]],
      },
      {
        label: "Configura Steam, Epic e GOG per te",
        cells: [
          ["Sì", "Steam e GOG nelle loro bottiglie; Epic (beta) tramite Legendary, senza launcher Epic"],
          ["No", "Crei tu la bottiglia e lanci ogni installer"],
          ["Sì", "Dal suo catalogo di installazione; Epic e GOG da CrossOver 25 [9][10]"],
          ["Epic, GOG, Amazon", "Launcher proprio; niente client Steam [6]"],
        ],
      },
      {
        label: "Motore Wine",
        cells: [
          ["Incluso", "Wine 11 con DXMT e DXVK; D3DMetal se lo installi"],
          ["Incluso, fermo", "Nessun aggiornamento a Wine 8+ [1]"],
          ["Incluso", "Build di CodeWeavers"],
          ["A tua scelta", "Scarica Wine, build GPTK o usa CrossOver [8]"],
        ],
      },
      { label: "Funziona senza Terminale", cells: [["Sì"], ["Sì"], ["Sì"], ["Sì"]] },
      { label: "Assistenza", cells: [["Issue su GitHub"], ["Nessuna"], ["Email e telefono", "Finché la licenza è attiva [3]"], ["Community", "GitHub e Discord"]] },
    ],
    aside: [
      "Ti serve assistenza commerciale o la copertura più ampia? Compra CrossOver. CodeWeavers è tra i maggiori contributori di Wine, e ogni progetto Wine per Mac, Vermut compreso, si regge su quel lavoro.",
    ],
    sourcesTitle: "Fonti, verificate il 19 ottobre 2026",
  },
  support: {
    eyebrow: "Sostieni Vermut",
    title: "Gratis, e resterà così.",
    lead: "Vermut nasce nel tempo libero. Le donazioni ripagano quel tempo e i Mac e i giochi su cui facciamo i test. In ogni caso, non arriverà nessuna versione a pagamento.",
    donateLabel: "Dona con PayPal",
    donateNote: "PayPal si apre in una nuova scheda.",
    otherTitle: "Non è questione di soldi? Anche questo aiuta.",
    options: [
      { title: "Una stella su GitHub", body: "Le stelle aiutano altri giocatori su Mac a trovare il progetto.", label: "Metti una stella al repository" },
      { title: "Segnala un bug", body: "Qualcosa non va? Una issue con versione di macOS e log ci aiuta a sistemarlo.", label: "Apri una segnalazione" },
      { title: "Dicci quali giochi funzionano", body: "Hai provato un gioco? Indica titolo, store e backend grafico, che funzioni o no.", label: "Invia un resoconto" },
    ],
    share: {
      title: "Condividi Vermut",
      body: "Conosci qualcuno che gioca su Mac? Mandagli il link.",
      text: "Vermut: giochi Windows sul Mac con Steam, GOG ed Epic. Gratis e open source.",
    },
  },
  faq: {
    eyebrow: "FAQ",
    title: "Domande e risposte.",
    items: [
      { q: "Vermut è davvero gratis?", a: [`Sì. È open source con licenza ${site.license}: niente account, niente versione a pagamento, niente telemetria.`] },
      { q: "Funziona sui Mac con processore Intel?", a: ["No. Vermut è pensato per Apple Silicon: M1 e tutti i chip successivi."] },
      { q: "Quale versione di macOS serve?", a: [`${macos}.`] },
      {
        q: "Il mio gioco funzionerà?",
        a: ["Dipende dal gioco. La maggior parte dei titoli DirectX da 9 a 11 sì; quelli con anti-cheat a livello kernel no. Il quadro completo è nella sezione ", { text: "compatibilità", href: "#compatibility" }, "."],
      },
      {
        q: "Vermut vede la mia password di Steam o di Epic?",
        a: ["No. Per Steam e GOG accedi dentro l’app ufficiale dello store, che gira nella sua bottiglia. Per Epic (beta) accedi dalla pagina di login di Epic e Legendary conserva la sessione sul tuo Mac."],
      },
      {
        q: "Vermut installa l’Epic Games Launcher?",
        a: ["No. Il supporto a Epic è in beta e usa ", { text: "Legendary", href: "https://github.com/derrod/legendary" }, ", un client Epic open source: accedi, vedi la libreria, installi e avvii i giochi senza l’Epic Games Launcher."],
      },
      { q: "Include il Game Porting Toolkit di Apple?", a: ["No, Vermut non lo include mai. Se lo installi tu, Vermut lo rileva e propone D3DMetal come opzione grafica."] },
      {
        q: "Perché macOS mi mostra un avviso?",
        a: [
          "Vermut è gratuito e open source, e non è firmato con un Apple Developer ID a pagamento né autenticato da Apple: per questo Gatekeeper non può garantirlo. Basta autorizzarlo una volta in Impostazioni di Sistema › Privacy e sicurezza (vedi ",
          { text: "i passaggi per il primo avvio", href: "#download" },
          "). Puoi leggere il ",
          { text: "codice sorgente", href: links.github },
          " e confrontare lo SHA-256 del DMG con quello riportato in questa pagina.",
        ],
      },
      { q: "Mi servono il Terminale o Homebrew?", a: ["No. Fai tutto dall’app, dall’installazione di uno store all’avvio di un gioco."] },
      {
        q: "In cosa è diverso da Whisky?",
        a: ["Whisky era un’interfaccia generica per Wine e non è più mantenuto. Vermut è costruito attorno agli store di giochi: una bottiglia per store, configurata per te, e una Library per tutto quello che installi."],
      },
      { q: "Come lo disinstallo?", a: ["Elimina ogni bottiglia dalla sua sezione Danger zone in Vermut (rimuove lo store e i suoi giochi), poi trascina Vermut nel Cestino."] },
    ],
    requirements: {
      title: "Requisiti",
      items: [
        { label: "Mac", value: "Apple Silicon (M1 o successivo)" },
        { label: "macOS", value: "14 Sonoma o successivo" },
        { label: "Disco", value: "10 GB liberi, più lo spazio per i giochi" },
        { label: "Rosetta 2", value: "Installata da Vermut se manca" },
        { label: "Internet", value: "Per scaricare store e giochi" },
      ],
    },
  },
  download: {
    eyebrow: "Download",
    title: "Scarica Vermut per il tuo Mac.",
    lead: "Un solo DMG, direttamente dall’ultima release su GitHub. Gratis, senza account da creare.",
    primaryLabel: (version) => `Scarica Vermut ${version} (.dmg)`,
    shaLabel: "SHA-256",
    allReleases: "Tutte le release e le note di rilascio",
    brewLabel: "Oppure installa con Homebrew",
    installTitle: "Installazione in un minuto",
    steps: (dmgName) => [
      `Apri ${dmgName} dalla cartella Download.`,
      "Trascina Vermut nella cartella Applicazioni.",
      "Apri Vermut da Applicazioni. Se sul tuo Mac manca Rosetta 2, Vermut la installa per te.",
    ],
    gatekeeper: {
      firstLaunch: "Al primo avvio apri Impostazioni di Sistema > Privacy e sicurezza, clicca “Apri comunque” e conferma con Touch ID o password.",
      firstLaunchLink: "Come fare",
      title: "Primo avvio: autorizza Vermut una volta",
      why: "macOS mostra un avviso perché Vermut è un’app gratuita e open source, non firmata con un Apple Developer ID a pagamento. Puoi leggere ogni riga del ",
      whySource: "codice sorgente",
      whyAnd: " e verificare il download con il suo ",
      whySha: "SHA-256",
      whyEnd: ".",
      steps: [
        { title: "Apri Vermut e fai clic su Fine", body: "Fai doppio clic su Vermut in Applicazioni. macOS mostra l’avviso “Vermut” non è stato aperto: fai clic su Fine, non su Sposta nel Cestino." },
        { title: "Fai clic su Apri comunque in Privacy e sicurezza", body: "Scegli menu Apple › Impostazioni di Sistema › Privacy e sicurezza, scorri fino a Sicurezza e fai clic su Apri comunque accanto al messaggio su Vermut. Il pulsante resta disponibile per circa un’ora dopo il passo 1." },
        { title: "Fai di nuovo clic su Apri comunque", body: "Compare una finestra di conferma: fai clic su Apri comunque." },
        { title: "Conferma con Touch ID o password", body: "macOS può chiederti Touch ID o la password del Mac. È normale: conferma e basta. macOS ricorda la scelta, quindi lo fai una volta sola." },
      ],
      note: "Questa è la procedura su macOS 15 Sequoia e successivi, dove Ctrl-clic › Apri non salta più il controllo. Su macOS 14 Sonoma, Ctrl-clic › Apri funziona ancora.",
      appleLabel: "Supporto Apple: Aprire un’app Mac di un’azienda di sviluppo sconosciuta",
      appleHref: "https://support.apple.com/it-it/guide/mac-help/mh40616/mac",
      illustrationNote: "Illustrazioni semplificate, non screenshot.",
    },
    terminal: {
      title: "Preferisci il Terminale? Installazione con un solo comando (senza l’avviso di Gatekeeper)",
      body: "Lo script scarica l’ultimo DMG e copia Vermut in Applicazioni. Leggilo prima di eseguirlo.",
      sourceLabel: "Vedi il codice di install.sh",
    },
  },
  footer: {
    statement: "Gratis e open source. Niente account, niente telemetria, niente versione a pagamento.",
    cta: "Scarica per Mac",
    columns: [
      { title: "Progetto", links: ["GitHub", "Release", `Licenza ${site.license}`, "Kit del marchio (.zip)"] },
      { title: "Contribuisci", links: ["Sostieni Vermut", "Guida per contribuire", "Segnala un bug", "Issue aperte"] },
    ],
    legal:
      "Vermut non è affiliato con Valve, Epic Games, GOG, CodeWeavers o Apple. Steam, Epic Games Store, GOG Galaxy e gli altri nomi sono marchi dei rispettivi proprietari.",
  },
  ui: {
    skipToContent: "Vai al contenuto",
    primaryNav: "Principale",
    backToTop: "Vermut, torna all’inizio",
    releaseDetails: "Dettagli della release",
    stepPrefix: (n) => `Passo ${n}: `,
    videoLabel: (title) => `${title}: registrazione dello schermo di Vermut`,
    play: (label) => `Riproduci: ${label}`,
    pause: (label) => `Pausa: ${label}`,
    compareCaption: "Vermut a confronto con Whisky, CrossOver e Heroic. I numeri tra parentesi quadre rimandano alle fonti sotto la tabella.",
    feature: "Caratteristica",
    copied: "Copiato",
    copySha: (file) => `Copia lo SHA-256 di ${file}`,
    copyInstall: "Copia il comando di installazione",
    copyLink: "Copia il link a Vermut",
    opensNewTab: " (si apre in una nuova scheda)",
    shareNewTab: " (condividi, si apre in una nuova scheda)",
    language: "Lingua",
    macosRequirement: macos,
    appleSilicon: "Apple Silicon (M1 o successivo)",
    facts: { version: "Versione", size: "Dimensione", macos: "macOS", mac: "Mac", licence: "Licenza" },
    version: (v) => `Versione ${v}`,
    latest: "Ultima",
    releaseNotes: (v) => `Note di rilascio di Vermut ${v}`,
    licence: (l) => `Licenza ${l}`,
  },
  illustrations: {
    note: "Illustrazioni semplificate, non screenshot.",
    dialog: {
      aria: "Illustrazione dell’avviso di macOS che dice che Vermut non è stato aperto, con i pulsanti Fine e Sposta nel Cestino. Fai clic su Fine.",
      title: "“Vermut” non è stato aperto",
      body: "Apple non è riuscita a verificare che “Vermut” sia privo di malware che potrebbero danneggiare il Mac o compromettere la tua privacy.",
      trash: "Sposta nel Cestino",
      done: "Fine",
    },
    settings: {
      aria: "Illustrazione di Impostazioni di Sistema, Privacy e sicurezza, sezione Sicurezza: il messaggio che Vermut è stato bloccato, con il pulsante Apri comunque.",
      window: "Privacy e sicurezza",
      section: "Sicurezza",
      allow: "Consenti applicazioni da App Store e sviluppatori noti",
      blocked: "“Vermut” è stato bloccato per proteggere il Mac.",
      button: "Apri comunque",
    },
  },
  notFound: {
    metaTitle: "Pagina non trovata",
    title: "Qui non c’è niente da versare.",
    body: "La pagina che cercavi non esiste. Vermut ti aspetta nella home.",
    back: "Torna a Vermut",
  },
});
