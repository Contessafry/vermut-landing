import type { Guide, GuideUi } from "@/lib/guides";
import { S } from "@/lib/guides";
import { links } from "@/site.config";

const FIRST_LAUNCH = "/it#first-launch";

const kernelAntiCheat = [
  "I giochi con anti-cheat a livello kernel, come Valorant, Fortnite e Call of Duty, non partono con Wine e nessuno strumento per Mac può cambiarlo. Prima di comprare controlla su ",
  { text: "Are We Anti-Cheat Yet?", href: S.aacy.href },
  ".",
] as const;

export const ui: GuideUi = {
  guides: "Guide",
  download: "Download",
  home: "Home di Vermut",
  breadcrumbGuide: "Guida",
  downloadLabel: (v) => `Scarica Vermut ${v} (.dmg)`,
  firstLaunch: "Guida al primo avvio",
  updated: "Aggiornata il 22 ottobre 2026 · Apple Silicon · macOS 14+",
  compared: "Il confronto, senza giri di parole",
  questions: "Domande frequenti",
  sources: "Fonti, verificate il 22 ottobre 2026",
  tryTitle: "Prova Vermut",
  tryBody: "Gratuito e open source. Steam ed Epic Games (beta) su Wine 11. Mac con Apple Silicon e macOS 14 o successivo.",
  moreGuides: "Altre guide",
  allGuides: "Tutte le guide",
  readGuide: "Leggi la guida",
  hub: {
    metaTitle: "Guide: giocare ai giochi Windows su Mac con Apple Silicon",
    eyebrow: "Guide",
    h1: "Giochi Windows sul Mac, spiegati con onestà.",
    description: "Guide pratiche e oneste per giocare ai giochi Windows su Mac con Apple Silicon: Steam con Wine, alternative a Whisky e soluzioni senza CrossOver.",
    back: "Torna a Vermut",
  },
};

export const guides: readonly Guide[] = [
  {
    slug: "run-windows-steam-games-on-apple-silicon",
    label: "Giochi Steam per Windows su Mac Apple Silicon",
    metaTitle: "Come giocare ai giochi Steam per Windows su Mac M1, M2, M3 e M4",
    description:
      "Installa la versione Windows di Steam su un Mac con Apple Silicon usando Wine, DXMT e Rosetta 2. I passaggi, cosa funziona, cosa no e le alternative gratuite e a pagamento.",
    h1: "Come giocare ai giochi Steam per Windows su un Mac con Apple Silicon",
    answer: [
      "Si installa la versione Windows di Steam dentro Wine, che traduce le chiamate di Windows per macOS. Rosetta 2 esegue il codice x86 e un livello come DXMT trasforma DirectX in Metal. Vermut fa tutta questa configurazione gratis: scarica Wine, crea una bottiglia separata per Steam e avvia il client ufficiale. La maggior parte dei giochi DirectX da 9 a 11 funziona; quelli con anti-cheat a livello kernel no.",
    ],
    sections: [
      {
        id: "why",
        title: "Perché Steam per macOS non basta",
        body: [
          ["Steam per macOS mostra solo i giochi che hanno una versione per Mac. Buona parte di una libreria Steam è solo per Windows, e sui Mac con Apple Silicon Boot Camp non esiste: la versione Windows va fatta girare in un altro modo."],
          ["Su un Mac con Apple Silicon lavorano insieme tre pezzi: Rosetta 2 esegue il codice x86-64, Wine fornisce le API di Windows e un livello grafico converte DirectX in Metal. Non si emula un PC intero, ed è per questo che può essere veloce, ma anche il motivo per cui alcuni giochi non partono."],
        ],
      },
      {
        id: "steps",
        title: "Installare Steam per Windows con Vermut",
        steps: [
          { title: "Controlla il Mac", body: ["Serve un Mac con Apple Silicon (M1 o successivo), macOS 14 Sonoma o successivo e qualche GB libero per Wine, Steam e i giochi. I Mac Intel non sono supportati."] },
          { title: "Scarica e apri Vermut", body: ["Scarica il DMG da GitHub e trascina Vermut in Applicazioni. L'app non è ancora notarizzata, quindi macOS ti chiede di autorizzarla una volta: segui la ", { text: "guida al primo avvio", href: FIRST_LAUNCH }, "."] },
          { title: "Lascia che Vermut prepari Wine", body: ["Al primo avvio Vermut propone di installare Rosetta 2 se manca e scarica il suo motore Wine 11, circa 1-2 GB."] },
          { title: "Installa Steam", body: ["Fai clic su Install accanto a Steam. Vermut scarica l'installer ufficiale di Steam nella sua bottiglia e completa il primo aggiornamento. Poi accedi con il tuo solito account Steam."] },
          { title: "Installa e gioca", body: ["Installa i giochi dal client Steam come faresti su un PC. I giochi installati compaiono nella Libreria di Vermut."] },
          { title: "Se un gioco dà problemi, cambia backend grafico", body: ["DXMT è il predefinito per DirectX 10 e 11. Puoi passare la bottiglia a DXVK, WineD3D oppure D3DMetal, se hai installato il Game Porting Toolkit di Apple. La beta v1.2 aggiunge le impostazioni per singolo gioco."] },
        ],
      },
      {
        id: "what-works",
        title: "Cosa funziona su Apple Silicon e cosa no",
        bullets: [
          ["Di solito funzionano: i giochi DirectX 9, 10 e 11 e i titoli indie o meno recenti, spesso i più semplici."],
          ["Serve qualche passaggio in più: i giochi DirectX 12 richiedono D3DMetal, incluso nel Game Porting Toolkit che scarichi da Apple. I giochi con un launcher proprio possono richiedere qualche tentativo."],
          ["Non funzionano: ", ...kernelAntiCheat],
          ["Le prestazioni dipendono dal gioco e dal chip. La traduzione ha un costo: aspettati meno fotogrammi al secondo rispetto a un PC Windows con una GPU simile e qualche scatto mentre gli shader vengono compilati la prima volta."],
        ],
        body: [["Prima di comprare un gioco cercalo nel ", { text: "database di compatibilità di CodeWeavers", href: S.cxCompat.href }, ": CrossOver si basa sullo stesso Wine, quindi le sue segnalazioni sono un buon riferimento."]],
      },
    ],
    compare: {
      caption: "Come giocare ai giochi Steam per Windows su un Mac con Apple Silicon, ottobre 2026",
      columns: ["Soluzione", "Prezzo", "Client Steam per Windows", "Limite principale"],
      rows: [
        { label: "Vermut", cells: ["Gratis, licenza MIT", "Sì, configurato in automatico", "Progetto giovane; supporto tramite issue su GitHub"] },
        { label: "CrossOver", cells: ["74 $ per 12 mesi di aggiornamenti; prova di 14 giorni", "Sì, dal suo catalogo di installazione", "A pagamento; l'opzione con più supporto"] },
        { label: "Whisky", cells: ["Gratis", "Da configurare a mano", "Archiviato ad aprile 2025, niente Wine 8 o successivi"] },
        { label: "Parallels Desktop", cells: ["A pagamento", "Sì, dentro Windows 11 per Arm", "DirectX fino alla 11.1; quasi tutti gli anti-cheat bloccati in una VM"] },
        { label: "GeForce NOW", cells: ["Piano gratuito e piani a pagamento", "No, trasmette in streaming i giochi supportati", "Serve una connessione veloce; solo i giochi del suo catalogo"] },
      ],
    },
    faq: [
      { q: "Un Mac M1 può far girare i giochi Steam per Windows?", a: ["Sì. Qualsiasi Mac con Apple Silicon e macOS 14 Sonoma o successivo può usare il client Steam per Windows tramite Wine. I giochi leggeri o meno recenti vanno meglio sui chip base; quelli pesanti chiedono più GPU e memoria."] },
      { q: "Serve una licenza di Windows?", a: ["No. Wine non è Windows, quindi non devi installarlo né comprarlo. La licenza di Windows serve solo per una macchina virtuale come Parallels."] },
      { q: "Salvataggi e obiettivi di Steam funzionano?", a: ["Sì. Accedi con il tuo account nel client Steam ufficiale, quindi salvataggi nel cloud, obiettivi e libreria funzionano come su PC."] },
      { q: "I giochi DirectX 12 funzionano?", a: ["Alcuni sì, con D3DMetal di Apple. La licenza di Apple non permette alle app di includerlo, quindi scarichi tu il ", { text: "Game Porting Toolkit", href: S.gptk.href }, " da Apple e Vermut lo rileva."] },
      { q: "È sicuro per il mio account Steam?", a: ["Vermut avvia il client Steam ufficiale e non vede mai la tua password. I giochi il cui anti-cheat rifiuta Wine non partono o non si collegano online."] },
    ],
    sources: [S.vermut, S.gptk, S.gptkReq, S.cxStore, S.cx26, S.whiskyNotice, S.parallels, S.gfn, S.aacy, S.cxCompat],
  },

  {
    slug: "free-whisky-alternative-mac",
    label: "Alternativa gratuita a Whisky per Mac",
    metaTitle: "Alternativa gratuita a Whisky per Mac (Whisky non è più aggiornato)",
    description:
      "Whisky è stato archiviato ad aprile 2025. Ecco le alternative gratuite e a pagamento per giocare ai giochi Windows su Mac e come passare a Vermut.",
    h1: "Un'alternativa gratuita a Whisky per il tuo Mac",
    answer: [
      "Whisky è stato archiviato il 9 aprile 2025 e non passerà a Wine 8 o successivi. Se vuoi qualcosa di gratuito e mantenuto, Vermut è un'app open source che configura per te Steam ed Epic Games (beta) su Wine 11. Se ti servono la compatibilità più ampia e un supporto vero, c'è CrossOver, l'opzione a pagamento consigliata dallo stesso autore di Whisky.",
    ],
    sections: [
      {
        id: "status",
        title: "Che fine ha fatto Whisky",
        body: [
          ["Whisky era una popolare interfaccia gratuita in SwiftUI per usare Wine sui Mac con Apple Silicon. Il suo sviluppatore ha smesso di lavorarci e ha archiviato il repository GitHub il 9 aprile 2025. L'avviso di manutenzione dice che Whisky non passerà a Wine 8 o successivi e non riceverà correzioni per app o giochi specifici, Steam compreso."],
          ["Le installazioni esistenti possono funzionare ancora per un po', ma non verrà corretto più nulla e i giochi nuovi chiedono sempre più spesso un Wine recente. Un fork della community, ", { text: "frankea/Whisky", href: S.whiskyFork.href }, ", continua lo sviluppo in modo indipendente."],
        ],
      },
      {
        id: "how-different",
        title: "In cosa Vermut è diverso da Whisky",
        bullets: [
          ["Pensato per gli store di giochi. Whisky ti dava bottiglie vuote; Vermut dà a ogni store la sua bottiglia, installa il client Steam ufficiale e gestisce Epic Games con Legendary (beta), con una Libreria per i giochi installati."],
          ["Un motore aggiornato. Vermut scarica Wine 11, con DXMT per DirectX 10 e 11 su Metal come predefinito e Wine Staging e Wine Devel come alternative."],
          ["La stessa scelta di backend grafici: DXMT, DXVK con MoltenVK, WineD3D e D3DMetal se hai installato il Game Porting Toolkit di Apple."],
          ["Puoi avviare qualsiasi .exe, .msi o .bat di Windows dentro una bottiglia, quando un gioco non è su uno store supportato."],
          ["Gratuito e con licenza MIT, senza account e senza telemetria."],
        ],
      },
      {
        id: "move",
        title: "Passare da Whisky a Vermut",
        steps: [
          { title: "Annota a cosa giochi", body: ["Fai un elenco dei giochi e delle impostazioni che funzionavano in Whisky. Steam ed Epic tengono libreria e salvataggi nel cloud sui loro server."] },
          { title: "Fai il backup dei salvataggi locali", body: ["Alcuni giochi tengono i salvataggi solo dentro la bottiglia di Whisky. Copiali prima di cambiare qualcosa. Vermut non può importare le bottiglie di Whisky."] },
          { title: "Installa Vermut", body: ["Scaricalo da GitHub e autorizzalo una volta in Privacy e sicurezza, seguendo la ", { text: "guida al primo avvio", href: FIRST_LAUNCH }, "."] },
          { title: "Installa il tuo store", body: ["Installa Steam, oppure accedi a Epic Games, dalla pagina Stores. Vermut scarica Wine e crea la bottiglia."] },
          { title: "Reinstalla i giochi", body: ["Scarica di nuovo i giochi dal client dello store e, se serve, ripristina i salvataggi locali. Tieni Whisky finché tutto funziona, poi rimuovilo."] },
        ],
      },
    ],
    compare: {
      caption: "Whisky e le sue alternative, ottobre 2026",
      columns: ["Soluzione", "Prezzo", "Mantenuto", "Ideale per"],
      rows: [
        { label: "Vermut", cells: ["Gratis, MIT", "Sì", "Giochi Steam ed Epic senza configurazioni"] },
        { label: "Whisky", cells: ["Gratis, GPL-3.0", "No, archiviato ad aprile 2025", "Niente di nuovo; solo configurazioni esistenti"] },
        { label: "Fork della community di Whisky", cells: ["Gratis", "Sì, da un altro sviluppatore", "Chi usava Whisky e vuole tenere le sue bottiglie"] },
        { label: "CrossOver", cells: ["74 $ per 12 mesi di aggiornamenti; 494 $ a vita", "Sì, CrossOver 26 a febbraio 2026", "La compatibilità più ampia e il supporto commerciale"] },
        { label: "Game Porting Toolkit", cells: ["Download gratuito da Apple", "Sì, per sviluppatori", "Provare giochi DirectX 12; non è un launcher"] },
      ],
    },
    after: [
      {
        id: "choose",
        title: "Quale scegliere?",
        bullets: [
          ["Giocavi a giochi Steam o Epic con Whisky e vuoi un sostituto gratuito e mantenuto: prova prima Vermut. Bastano pochi minuti e non costa nulla."],
          ["Hai tante bottiglie personalizzate che non vuoi rifare: il fork della community importa le bottiglie di Whisky. Lo cura un altro sviluppatore, quindi valuta i suoi aggiornamenti per quello che sono."],
          ["Ti serve che un gioco preciso funzioni, o vuoi aiuto quando non va: attiva la prova di 14 giorni di CrossOver e compralo se quel gioco gira."],
          ["Sei uno sviluppatore e stai provando un porting DirectX 12: il Game Porting Toolkit di Apple è lo strumento fatto per questo."],
        ],
      },
      {
        id: "limits",
        title: "I limiti, detti chiaramente",
        bullets: [
          [...kernelAntiCheat],
          ["Vermut è giovane e lo porta avanti un piccolo team. Non ha un supporto commerciale: i bug si gestiscono con le issue su GitHub."],
          ["Nessuna interfaccia per Wine rende un gioco più veloce del Wine che c'è sotto. Se un gioco non andava in Whisky per colpa di Wine, provalo prima di dare per scontato che altrove funzioni."],
        ],
      },
    ],
    faq: [
      { q: "Whisky è morto?", a: ["Il progetto originale non è più mantenuto. Il suo repository GitHub è stato archiviato il 9 aprile 2025 e non avrà Wine 8 o successivi. Esiste un fork della community, gestito da un'altra persona."] },
      { q: "Posso importare le bottiglie di Whisky in Vermut?", a: ["No. Vermut crea una bottiglia sua per ogni store. Fai il backup dei salvataggi locali, installa lo store in Vermut e scarica di nuovo i giochi."] },
      { q: "Vermut è davvero gratis?", a: ["Sì. È open source con licenza MIT, senza account, senza versione a pagamento e senza telemetria. Puoi leggere il ", { text: "codice sorgente", href: links.github }, "."] },
      { q: "Perché l'autore di Whisky consiglia CrossOver?", a: ["CodeWeavers, l'azienda dietro CrossOver, fa gran parte del lavoro su Wine per Mac. Le vendite di CrossOver lo finanziano, e ogni progetto gratuito di Wine per Mac, Vermut compreso, si basa su quel lavoro."] },
      { q: "Vermut funziona sui Mac Intel?", a: ["No. Vermut richiede un Mac con Apple Silicon e macOS 14 Sonoma o successivo."] },
    ],
    sources: [S.whiskyNotice, S.whiskyRepo, S.whiskyFork, S.cxStore, S.cx26, S.gptk, S.legendary, S.vermut, S.aacy],
  },

  {
    slug: "run-windows-games-on-mac-without-crossover",
    label: "Giocare ai giochi Windows su Mac senza CrossOver",
    metaTitle: "Come giocare ai giochi Windows su Mac senza CrossOver, gratis",
    description:
      "I modi gratuiti per giocare ai giochi Windows su un Mac con Apple Silicon senza CrossOver: Wine con Vermut, il Game Porting Toolkit di Apple, macchine virtuali e cloud gaming.",
    h1: "Come giocare ai giochi Windows su Mac senza CrossOver",
    answer: [
      "Usa un'interfaccia gratuita per Wine. Vermut è open source e configura per te Wine 11, Steam ed Epic Games (beta) su qualsiasi Mac con Apple Silicon. Per i giochi che Wine non riesce a far girare, l'altra strada gratuita è il cloud gaming, che trasmette il gioco in streaming invece di eseguirlo sul Mac. CrossOver resta la scelta a pagamento con più supporto.",
    ],
    sections: [
      {
        id: "what-crossover-does",
        title: "Cosa fa CrossOver e cosa serve per farne a meno",
        body: [
          ["CrossOver è la versione commerciale di Wine di CodeWeavers. Costa 74 $ per 12 mesi di aggiornamenti e supporto, oppure 494 $ per la licenza a vita, e la versione acquistata continua a funzionare anche dopo la fine del supporto. C'è una prova gratuita di 14 giorni."],
          ["Senza CrossOver ti servono tre cose: una build di Wine per macOS, un livello grafico che traduca DirectX in Metal e qualcosa che installi e avvii gli store di giochi. Farlo a mano dal Terminale si può, ma è faticoso da mantenere. Vermut mette insieme tutti e tre in un'unica app."],
        ],
      },
      {
        id: "options",
        title: "Le alternative gratuite",
        bullets: [
          ["Vermut, gratuito e open source. Installa Steam ed Epic Games (beta) nelle loro bottiglie Wine 11, usa DXMT come predefinito per DirectX 10 e 11 e ti permette di passare a DXVK, WineD3D o D3DMetal."],
          ["Il Game Porting Toolkit di Apple. Gratuito con un account sviluppatore Apple, pensato per permettere agli sviluppatori di provare i loro giochi. Contiene D3DMetal, che fa girare molti giochi DirectX 12, ma non è un launcher e le app non possono includerlo."],
          ["Il cloud gaming, come GeForce NOW. Ha un piano gratuito. Il gioco gira su un PC remoto, quindi l'anti-cheat non è un problema, ma servono una connessione veloce e stabile e il gioco deve essere nel catalogo del servizio."],
          ["Una macchina virtuale come Parallels Desktop non è gratuita, e Windows per Arm in una VM supporta DirectX solo fino alla 11.1 e blocca quasi tutti gli anti-cheat."],
        ],
      },
      {
        id: "steps",
        title: "Giocare gratis a un gioco Windows con Vermut",
        steps: [
          { title: "Controlla prima il gioco", body: ["Cercalo nel ", { text: "database di compatibilità di CodeWeavers", href: S.cxCompat.href }, " e su ", { text: "Are We Anti-Cheat Yet?", href: S.aacy.href }, ". Se richiede un anti-cheat a livello kernel, usa il cloud gaming."] },
          { title: "Installa Vermut", body: ["Scarica il DMG, trascina Vermut in Applicazioni e autorizzalo una volta con la ", { text: "guida al primo avvio", href: FIRST_LAUNCH }, ". Serve un Mac con Apple Silicon e macOS 14 o successivo."] },
          { title: "Installa il tuo store", body: ["Installa Steam o accedi a Epic Games. Vermut scarica Wine e, se serve, Rosetta 2."] },
          { title: "Per i giochi DirectX 12, aggiungi D3DMetal", body: ["Scarica il Game Porting Toolkit da Apple. Vermut lo rileva e propone D3DMetal come backend grafico."] },
          { title: "Non è su uno store? Avvia l'installer", body: ["Usa Run .exe per avviare un qualsiasi installer Windows dentro una bottiglia. Qui i risultati sono più variabili rispetto ai giochi degli store."] },
        ],
      },
    ],
    compare: {
      caption: "Giocare ai giochi Windows senza CrossOver, ottobre 2026",
      columns: ["Soluzione", "Costo", "DirectX 12", "Giochi con anti-cheat", "Impegno"],
      rows: [
        { label: "Vermut", cells: ["Gratis", "Con D3DMetal di Apple", "A livello kernel: no", "Basso, un'unica app"] },
        { label: "Solo Game Porting Toolkit", cells: ["Gratis", "Sì, con D3DMetal", "A livello kernel: no", "Alto, Terminale e configurazione manuale"] },
        { label: "GeForce NOW", cells: ["Piano gratuito e piani a pagamento", "Sì, gira su un PC remoto", "Sì, per i giochi supportati", "Basso, serve internet veloce"] },
        { label: "Parallels Desktop", cells: ["A pagamento, più Windows", "No, fino a DirectX 11.1", "Quasi tutti bloccati in una VM", "Medio"] },
        { label: "CrossOver (come riferimento)", cells: ["74 $ per un anno di aggiornamenti", "Sì, con D3DMetal", "A livello kernel: no", "Basso, supporto commerciale"] },
      ],
    },
    after: [
      {
        id: "performance",
        title: "Cosa aspettarsi dalle prestazioni",
        body: [
          ["Wine non emula un PC, ma Rosetta 2 e la conversione da DirectX a Metal aggiungono lavoro. Un gioco fluido su un PC Windows di fascia media può richiedere impostazioni più basse su un chip M di base. I primi minuti di un gioco nuovo spesso scattano mentre gli shader vengono compilati; di solito poi si stabilizza."],
          ["Se un gioco parte ma si vede male o si chiude, la prima cosa da provare è cambiare backend grafico. Conta anche la memoria: i requisiti pubblicati del Game Porting Toolkit consigliano 16 GB, e i giochi grandi ne beneficiano con qualsiasi backend."],
        ],
      },
      {
        id: "honest",
        title: "Quando CrossOver vale ancora la spesa",
        body: [
          ["Se ti interessa un gioco in particolare, vuoi qualcuno a cui scrivere quando qualcosa si rompe o giochi a titoli che CodeWeavers ha sistemato a mano, vale la pena provare CrossOver prima di arrenderti. Comprarlo finanzia anche il lavoro su Wine che usano tutti i progetti gratuiti per Mac."],
          ["Vermut è gratuito, ma è un progetto giovane e non promette che ogni gioco funzioni. Il suo punto di forza è un modo gratuito e veloce per provare la tua libreria Steam ed Epic sul Mac."],
        ],
      },
    ],
    faq: [
      { q: "Esiste una versione gratuita di CrossOver?", a: ["No: CrossOver ha una prova gratuita di 14 giorni, poi serve una licenza a pagamento. Wine invece è gratuito, e Vermut è un'app gratuita basata su Wine."] },
      { q: "Wine è un emulatore?", a: ["No. Wine reimplementa le API di Windows su macOS. Sui Mac con Apple Silicon Rosetta 2 traduce il codice x86, quindi non si emula un PC intero."] },
      { q: "Posso usare il Game Porting Toolkit di Apple per giocare?", a: ["È uno strumento per sviluppatori, ma il suo livello D3DMetal fa girare molti giochi DirectX 12. Scaricalo da Apple e Vermut propone D3DMetal come backend."] },
      { q: "E Boot Camp?", a: ["Boot Camp esiste solo sui Mac Intel. I Mac con Apple Silicon non possono avviare Windows."] },
      { q: "Perché i giochi con anti-cheat non partono?", a: ["L'anti-cheat a livello kernel si aspetta un vero kernel Windows e blocca Wine e quasi tutte le macchine virtuali. Su Mac l'unico modo per giocarci è il cloud gaming."] },
    ],
    sources: [S.cxStore, S.cxLicence, S.cx26, S.gptk, S.gptkReq, S.parallels, S.gfn, S.aacy, S.cxCompat, S.vermut],
  },
];
