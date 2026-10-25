import type { Guide } from "@/lib/guides";
import { S } from "@/lib/guides";

export const guides: readonly Guide[] = [
  {
    slug: "install-wine-on-mac-apple-silicon",
    label: "Installare Wine su Mac nel 2026",
    metaTitle: "Come installare Wine su Mac (Apple Silicon, da Sonoma a Tahoe)",
    description:
      "Il cask wine-stable di Homebrew è disattivato dal 1° settembre 2026. I modi per avere Wine su un Mac M1–M4 oggi: build Gcenx, un'app come Vermut o CrossOver.",
    h1: "Come installare Wine su Mac nel 2026",
    answer: [
      "La vecchia scorciatoia, brew install --cask wine-stable, non funziona più: Homebrew ha disattivato il cask il 1° settembre 2026 perché non supera i controlli Gatekeeper di Apple. Le build di Wine per macOS del progetto Gcenx su GitHub si possono ancora scaricare, ma prefix, livelli grafici e store poi li configuri tu. Se ti serve Wine per giocare ai giochi Windows, un'app come Vermut scarica Wine 11 al posto tuo e prepara Steam o Epic Games (beta) nella loro bottiglia, gratis.",
    ],
    sections: [
      {
        id: "what-changed",
        title: "Cosa è cambiato con Wine su macOS",
        body: [
          ["Per anni quasi tutte le guide dicevano di installare Wine con Homebrew. Il cask wine-stable (Wine 11.0) ora risulta disattivato con il motivo fails_gatekeeper_check, quindi Homebrew si rifiuta di installarlo. Le guide scritte prima di settembre 2026 su questo punto sono superate."],
          ["Wine invece è ancora sviluppato e funziona ancora su macOS. Su un Mac con Apple Silicon esegue i programmi Windows x86-64 tramite Rosetta 2, che quindi deve essere installato. I giochi hanno bisogno anche di un livello che traduca DirectX in Metal, come DXMT, DXVK con MoltenVK o D3DMetal di Apple; Wine da solo include solo WineD3D, che passa da OpenGL."],
        ],
      },
      {
        id: "options",
        title: "Tre modi per avere Wine su un Mac con Apple Silicon",
        bullets: [
          ["Build Gcenx, gratis. Il progetto Gcenx pubblica su GitHub i pacchetti Wine Stable, Staging e Devel per macOS. Vanno bene se usi il Terminale senza problemi e ti serve Wine per le app, non solo per i giochi."],
          ["Un'app gratuita come Vermut. Scarica la sua build di Wine 11, più Wine Staging e Devel di Gcenx quando servono, e crea una bottiglia per ogni store. Pensata per i giochi di Steam ed Epic, senza passaggi nel Terminale."],
          ["CrossOver, a pagamento. Il Wine commerciale di CodeWeavers, con prova gratuita di 14 giorni e assistenza. La compatibilità più ampia se ti serve che funzioni un gioco o un programma Windows preciso."],
        ],
      },
      {
        id: "steps",
        title: "Wine per giocare in cinque minuti con Vermut",
        steps: [
          { title: "Controlla il Mac", body: ["Apple Silicon (M1 o successivi) e macOS 14 Sonoma o successivo. I Mac Intel non sono supportati."] },
          { title: "Installa Vermut", body: ["Scarica il DMG, trascina Vermut in Applicazioni e consentilo una volta seguendo la ", { text: "guida al primo avvio", href: "/it/open-anyway-unnotarized-app-mac" }, "."] },
          { title: "Lascia che installi Rosetta 2 e Wine", body: ["Al primo avvio Vermut propone di installare Rosetta 2 se manca e scarica il suo motore Wine 11."] },
          { title: "Scegli lo store", body: ["Scegli Steam o Epic Games (beta). Vermut crea una bottiglia per ciascuno, con il livello grafico già impostato. GOG Galaxy arriverà presto."] },
          { title: "Ti serve un'altra versione di Wine?", body: ["In Impostazioni › Wine Engines puoi scaricare Wine Staging o Wine Devel e sceglierli per una sola bottiglia o un solo gioco."] },
        ],
      },
    ],
    after: [
      {
        id: "limits",
        title: "I limiti, detti chiaramente",
        bullets: [
          ["Wine non è Windows. Tanti programmi funzionano, alcuni no, e i giochi con anti-cheat a livello kernel non funzioneranno mai."],
          ["Vermut è fatto per gli store di giochi. Per programmi da ufficio o una singola utility Windows può andarti meglio Wine da solo o CrossOver, anche se Vermut può avviare un .exe in una bottiglia personalizzata."],
          ["Rosetta 2 è fondamentale: Apple ha annunciato che la limiterà nelle prossime versioni di macOS, quindi Wine su Mac potrebbe cambiare di nuovo."],
        ],
      },
    ],
    faq: [
      { q: "Perché brew install wine-stable non funziona?", a: ["Homebrew ha disattivato il cask wine-stable il 1° settembre 2026 perché il pacchetto non supera i controlli Gatekeeper di macOS. Usa una build Gcenx da GitHub, un'app come Vermut o CrossOver."] },
      { q: "Wine funziona su macOS Sequoia e Tahoe?", a: ["Sì, su Apple Silicon tramite Rosetta 2. Vermut richiede macOS 14 Sonoma o successivo e funziona anche sulle versioni più recenti."] },
      { q: "Wine è gratis?", a: ["Sì. Wine è software libero e open source. Anche Vermut, che lo installa e lo gestisce per i giochi, è gratuito e con licenza MIT."] },
      { q: "Posso usare Wine su un Mac Intel?", a: ["Esistono build di Wine per Mac Intel, ma Vermut supporta solo Apple Silicon."] },
    ],
    sources: [S.brewWine, S.gcenxWine, S.winehq, S.cxStore, S.dxmt, S.vermutRelease, S.vermut],
  },

  {
    slug: "epic-games-windows-games-on-mac",
    label: "Giochi Epic per Windows su Mac",
    metaTitle: "Come giocare ai giochi Windows di Epic Games Store su Mac M1, M2, M3 o M4",
    description:
      "L'Epic Games Launcher per Mac installa solo giochi per Mac. Come installare e giocare la tua libreria Epic per Windows su Apple Silicon, gratis, con Vermut e Legendary.",
    h1: "Come giocare ai giochi Windows di Epic Games Store su Mac",
    answer: [
      "L'Epic Games Launcher per Mac installa solo i giochi che hanno una versione per Mac. Per giocare a quelli per Windows su un Mac con Apple Silicon serve Wine. Vermut lo fa gratis, in beta: usa Legendary, un client Epic open source, quindi accedi dalla pagina di Epic, vedi la tua libreria e installi e avvii i giochi Windows in una bottiglia Wine 11, senza l'Epic Games Launcher. Fortnite e gli altri giochi con anti-cheat a livello kernel non partono.",
    ],
    sections: [
      {
        id: "why",
        title: "Perché l'Epic Games Launcher per Mac non basta",
        body: [
          ["Il launcher di Epic gira su macOS, ma la sua libreria propone solo le versioni per Mac. Quasi tutto quello che hai comprato o riscattato gratis su Epic Games Store è solo per Windows, quindi non risulta installabile."],
          ["Avviare il launcher Epic per Windows dentro Wine si può, ma è pesante. Vermut lo salta: Legendary parla direttamente con i server di Epic, scarica i file del gioco per Windows e li avvia in Wine."],
        ],
      },
      {
        id: "steps",
        title: "Prepara la tua libreria Epic con Vermut",
        steps: [
          { title: "Installa Vermut", body: ["Ti serve un Mac con Apple Silicon e macOS 14 o successivo. Trascina Vermut in Applicazioni e consentilo una volta con la ", { text: "guida al primo avvio", href: "/it/open-anyway-unnotarized-app-mac" }, "."] },
          { title: "Scegli Epic Games (beta)", body: ["Seleziona Epic Games in Stores. Vermut scarica il motore Wine e il client Legendary, e ne verifica il checksum."] },
          { title: "Accedi dalla pagina di Epic", body: ["Vermut apre la pagina di accesso di Epic. La password va a Epic, non a Vermut; Legendary conserva la sessione sul tuo Mac."] },
          { title: "Installa un gioco", body: ["La tua libreria Epic compare in Vermut. Installa un gioco e viene scaricato nella bottiglia di Epic."] },
          { title: "Gioca, e regola se serve", body: ["I giochi installati compaiono in Libreria con il pulsante Play. Se uno dà problemi, apri le impostazioni del gioco con ⌥⌘I e prova un altro backend grafico."] },
        ],
      },
    ],
    after: [
      {
        id: "what-works",
        title: "Cosa aspettarti",
        bullets: [
          ["Di solito funzionano: i giochi DirectX da 9 a 11, soprattutto quelli meno recenti e gli indie."],
          ["I giochi DirectX 12 richiedono D3DMetal di Apple: vedi ", { text: "Giochi DirectX 12 su Mac", href: "/it/directx-12-games-on-mac-d3dmetal" }, "."],
          ["Non funzionano: Fortnite, Valorant e gli altri giochi con anti-cheat a livello kernel. Controlla prima su ", { text: "Are We Anti-Cheat Yet?", href: S.aacy.href }, "."],
          ["Il supporto a Epic in Vermut è in beta. Alcune funzioni del launcher ufficiale, come il negozio o la lista amici, non ci sono: i giochi li compri e li riscatti sul sito di Epic."],
        ],
      },
    ],
    faq: [
      { q: "Posso giocare a Fortnite su Mac con Vermut?", a: ["No. Fortnite usa un anti-cheat a livello kernel che blocca Wine. Su Mac l'unico modo è il cloud gaming."] },
      { q: "Vermut installa l'Epic Games Launcher?", a: ["No. Usa Legendary, un client Epic open source, quindi il launcher non serve."] },
      { q: "I giochi gratuiti di Epic funzionano?", a: ["I giochi riscattati gratis sono nella tua libreria come gli altri, quindi puoi installarli. Se partono dipende dal singolo gioco."] },
      { q: "Vermut vede la mia password di Epic?", a: ["No. Accedi dalla pagina di Epic e Legendary salva la sessione sul tuo Mac."] },
    ],
    sources: [S.legendary, S.epicMac, S.aacy, S.vermutRelease, S.vermut],
  },

  {
    slug: "directx-12-games-on-mac-d3dmetal",
    label: "Giochi DirectX 12 su Mac con D3DMetal",
    metaTitle: "Come giocare ai giochi DirectX 12 su Mac con D3DMetal",
    description:
      "I giochi Windows DirectX 12 su Apple Silicon richiedono D3DMetal di Apple, dal Game Porting Toolkit. Come scaricarlo gratis e usarlo in Vermut, passo per passo.",
    h1: "Come giocare ai giochi DirectX 12 su un Mac con Apple Silicon",
    answer: [
      "I giochi DirectX 12 hanno bisogno di D3DMetal, il livello di traduzione di Apple incluso nel Game Porting Toolkit. La licenza di Apple non permette alle app di includerlo, quindi lo scarichi tu da developer.apple.com con un Apple Account gratuito. Vermut poi lo trova, controlla che sia la versione 2.0 o successiva e propone D3DMetal come backend grafico per una bottiglia o per un singolo gioco.",
    ],
    sections: [
      {
        id: "why",
        title: "Perché DirectX 12 ha bisogno di qualcosa in più",
        body: [
          ["Il Mac parla Metal, non DirectX. Il livello predefinito di Vermut, DXMT, traduce DirectX 10 e 11 in Metal, e DXVK copre DirectX da 9 a 11 tramite Vulkan e MoltenVK. Nessuno dei due gestisce DirectX 12 su Mac."],
          ["D3DMetal di Apple sì. Fa parte del Game Porting Toolkit, che Apple realizza per gli sviluppatori che valutano i giochi Windows, ed è lo stesso livello su cui si basano gli strumenti commerciali per DirectX 12."],
        ],
      },
      {
        id: "steps",
        title: "Installa D3DMetal e usalo in Vermut",
        steps: [
          { title: "Accedi ad Apple Developer", body: ["Vai su developer.apple.com e accedi con il tuo Apple Account. Basta un account gratuito."] },
          { title: "Scarica il Game Porting Toolkit", body: ["Cerca Game Porting Toolkit nell'elenco dei download e scarica il .dmg."] },
          { title: "Apri l'ambiente di valutazione", body: ["Apri il .dmg, poi apri “Evaluation environment for Windows games” e accetta la licenza. Così viene montato il volume che contiene D3DMetal."] },
          { title: "Lascia che Vermut lo trovi", body: ["Apri Vermut › Impostazioni › D3DMetal. Vermut cerca nei percorsi soliti; se non lo trova, clicca Point to location… e scegli la cartella redist/lib."] },
          { title: "Passa il gioco a D3DMetal", body: ["Seleziona il gioco in Libreria, premi ⌥⌘I per aprire le impostazioni del gioco e imposta Graphics backend su D3DMetal. Oppure impostalo per tutta la bottiglia nella scheda Graphics della bottiglia."] },
        ],
      },
    ],
    after: [
      {
        id: "limits",
        title: "I limiti, detti chiaramente",
        bullets: [
          ["In Vermut D3DMetal funziona con le bottiglie di Steam ed Epic. Vermut non lo modifica e non lo ridistribuisce mai."],
          ["Non tutti i giochi DirectX 12 partono, e quelli più pesanti chiedono una GPU potente: su un chip M di base metti in conto impostazioni più basse."],
          ["I giochi con anti-cheat a livello kernel continuano a non funzionare, qualunque sia il livello grafico."],
          ["Se un gioco parte ma si chiude, prova con DXMT: alcuni giochi hanno una modalità DirectX 11 che va meglio."],
        ],
      },
    ],
    faq: [
      { q: "D3DMetal è gratis?", a: ["Sì. Il Game Porting Toolkit si scarica gratis da Apple, con un Apple Account gratuito."] },
      { q: "Perché Vermut non include D3DMetal?", a: ["La licenza di Apple non permette alle app di includerlo. Lo scarichi da Apple e Vermut usa la tua copia."] },
      { q: "Che versione serve?", a: ["Vermut richiede D3DMetal 2.0 o successivo. Se trova una versione più vecchia ti avvisa di scaricare l'ultima da Apple."] },
      { q: "Servono Xcode o il Terminale?", a: ["No. Con Vermut scarichi solo il .dmg, lo apri e accetti la licenza."] },
    ],
    sources: [S.gptk, S.gptkDownload, S.gptkReq, S.dxmt, S.vermutRelease, S.vermut],
  },

  {
    slug: "open-anyway-unnotarized-app-mac",
    label: "Aprire Vermut la prima volta (Apri comunque)",
    metaTitle: "Apple non può verificare un'app? Come aprire Vermut con Apri comunque",
    description:
      "Perché macOS dice di non poter verificare Vermut e come aprirlo in sicurezza su Sonoma, Sequoia e successivi con Apri comunque in Privacy e sicurezza. E come controllare il download.",
    h1: "Come aprire Vermut la prima volta su macOS",
    answer: [
      "macOS blocca Vermut al primo avvio perché è un'app gratuita non ancora notarizzata con un Apple Developer ID a pagamento, non perché contenga malware. Aprilo una volta, clicca Fine, poi vai in Impostazioni di Sistema › Privacy e sicurezza, clicca Apri comunque accanto al messaggio su Vermut e conferma con Touch ID o la password. Da lì in poi si apre normalmente. Da macOS Sequoia il clic con il tasto Ctrl › Apri non salta più questo passaggio.",
    ],
    sections: [
      {
        id: "why",
        title: "Perché macOS ti avvisa",
        body: [
          ["Gatekeeper controlla che un'app sia firmata con un Apple Developer ID e notarizzata da Apple. La notarizzazione richiede un abbonamento sviluppatore a pagamento. Vermut è un progetto gratuito con licenza MIT e non è ancora notarizzato, quindi macOS mostra un avviso come “Apple non può verificare che Vermut sia privo di malware”."],
          ["L'avviso significa che Apple non ha analizzato l'app, non che ha trovato un problema. Puoi leggere tutto il codice sorgente su GitHub e confrontare il download con lo SHA-256 pubblicato nella pagina di download e nelle note di rilascio."],
        ],
      },
      {
        id: "steps",
        title: "Aprire Vermut, passo per passo",
        steps: [
          { title: "Apri Vermut da Applicazioni", body: ["Trascina Vermut dal DMG in Applicazioni, poi aprilo. macOS mostra l'avviso: clicca Fine, non Sposta nel Cestino."] },
          { title: "Clicca Apri comunque in Privacy e sicurezza", body: ["Scegli menu Apple › Impostazioni di Sistema › Privacy e sicurezza, scorri fino a Sicurezza e clicca Apri comunque accanto al messaggio su Vermut. Il pulsante resta disponibile per circa un'ora dopo il passaggio 1."] },
          { title: "Clicca di nuovo Apri comunque", body: ["Compare una finestra di conferma. Clicca Apri comunque."] },
          { title: "Conferma con Touch ID o la password", body: ["macOS registra Vermut come eccezione. La volta dopo si apre con un doppio clic."] },
        ],
      },
    ],
    after: [
      {
        id: "check",
        title: "Se vuoi, controlla prima il download",
        bullets: [
          ["Nel Terminale esegui shasum -a 256 sul DMG nella cartella Download e confronta il risultato con lo SHA-256 nella pagina di download di Vermut."],
          ["Scarica Vermut solo dalle release su GitHub o dal sito ufficiale, che rimanda lì."],
          ["Non disattivare Gatekeeper per tutto il Mac. Apri comunque crea un'eccezione solo per questa app."],
        ],
      },
    ],
    faq: [
      { q: "Vermut è sicuro?", a: ["Vermut è open source, quindi chiunque può leggere cosa fa, e ogni release riporta il suo SHA-256. Non ha account né telemetria. L'avviso di macOS riguarda la notarizzazione, non una minaccia rilevata."] },
      { q: "Perché Ctrl-clic › Apri non funziona?", a: ["Apple ha tolto questa scorciatoia in macOS Sequoia. Usa Apri comunque in Privacy e sicurezza."] },
      { q: "Non vedo Apri comunque.", a: ["Prima prova ad aprire Vermut e clicca Fine: il pulsante compare solo per circa un'ora dopo un avvio bloccato. Poi guarda nella sezione Sicurezza in fondo a Privacy e sicurezza."] },
      { q: "Dovrò rifarlo a ogni aggiornamento?", a: ["Di solito basta una volta per ogni copia scaricata. Se dopo aver installato una nuova versione macOS ti avvisa di nuovo, ripeti gli stessi passaggi."] },
    ],
    sources: [S.appleOpenAnyway, S.appleSafely, S.appleSequoia, S.vermutRelease, S.vermut],
  },

  {
    slug: "wine-bottles-and-game-settings-mac",
    label: "Bottiglie e impostazioni per gioco in Vermut",
    metaTitle: "Bottiglie Wine, backend grafici e impostazioni per gioco in Vermut",
    description:
      "Come funzionano le bottiglie Wine di Vermut: una per store, bottiglie personalizzate per qualsiasi .exe e impostazioni per gioco per motore Wine, DXMT, DXVK, WineD3D o D3DMetal.",
    h1: "Bottiglie Wine e impostazioni per gioco in Vermut",
    answer: [
      "Una bottiglia è un ambiente Windows separato, un prefix Wine con il suo disco C:. Vermut ne crea una per ogni store, e puoi aggiungere bottiglie personalizzate per le app fuori da Steam ed Epic. Le impostazioni sono a livelli: le Impostazioni di Vermut danno i valori predefiniti, ogni bottiglia può cambiarli e dalla 1.2 ogni gioco può cambiarli di nuovo dalle impostazioni del gioco (⌥⌘I). “Automatic” mostra sempre il valore che eredita.",
    ],
    sections: [
      {
        id: "layers",
        title: "Impostazioni, bottiglia, gioco: come funzionano i livelli",
        bullets: [
          ["Le Impostazioni (⌘,) contengono i valori predefiniti: motore Wine, backend grafico, versione di DXMT e livello di log."],
          ["Una bottiglia usa questi valori finché non li cambi nella sua pagina. Le bottiglie degli store hanno anche versione di Windows (10, 8.1 o 7), modalità ad alta risoluzione, winecfg, il disco C: della bottiglia nel Finder, log e diagnostica."],
          ["Un gioco usa i valori della sua bottiglia finché non li sovrascrivi nelle impostazioni del gioco. Le modifiche valgono solo per quel gioco."],
          ["Cambiare motore non tocca giochi né salvataggi. Se lo store è aperto, la modifica vale dalla prossima apertura."],
        ],
      },
      {
        id: "backends",
        title: "Quale backend grafico scegliere",
        bullets: [
          ["DXMT, il predefinito: DirectX 10 e 11 direttamente in Metal. Vermut gestisce più versioni di DXMT in Impostazioni › Components, così un gioco può restare su una versione più vecchia."],
          ["DXVK con MoltenVK: DirectX da 9 a 11 tramite Vulkan. Richiede Wine Staging, che Vermut seleziona da solo."],
          ["WineD3D: il livello di Wine, tramite OpenGL. Più lento, ma a volte il più compatibile con i giochi vecchi."],
          ["D3DMetal: il livello di Apple per DirectX 12, disponibile dopo aver installato il Game Porting Toolkit. Vedi ", { text: "Giochi DirectX 12 su Mac", href: "/it/directx-12-games-on-mac-d3dmetal" }, "."],
        ],
      },
      {
        id: "steps",
        title: "Le operazioni più comuni",
        steps: [
          { title: "Cambiare le impostazioni di un gioco", body: ["Seleziona il gioco in Libreria e premi ⌥⌘I (View › Game Settings). Scegli motore Wine, backend grafico, versione di DXMT o livello di log, oppure lascia Automatic."] },
          { title: "Creare una bottiglia personalizzata", body: ["Premi ⇧⌘N (File › New Bottle…). Dalle un nome e scegli motore, backend grafico e versione di Windows, oppure lasciali su Automatic."] },
          { title: "Avviare un installer Windows", body: ["In una bottiglia personalizzata clicca Run .exe or Installer… (⌘O) e scegli un .exe o un .msi. Puoi usare anche Run .exe dalla barra degli strumenti."] },
          { title: "Ripartire da zero se una bottiglia si rompe", body: ["Usa Reset bottle nella pagina della bottiglia. Elimina quella bottiglia e i giochi installati dentro; account dello store e salvataggi in cloud non sono lì."] },
        ],
      },
    ],
    faq: [
      { q: "Posso importare bottiglie di Whisky o CrossOver?", a: ["No. Vermut crea le sue bottiglie. Installa lo store in Vermut e scarica di nuovo i giochi."] },
      { q: "Dove vengono salvati i giochi?", a: ["Nel disco C: di ogni bottiglia. Aprilo dalla pagina della bottiglia per vedere i file nel Finder. I giochi vanno meglio dall'SSD interno."] },
      { q: "A cosa serve il livello di log?", a: ["Decide quanto scrive Wine nel log. Alzalo quando segnali un bug su GitHub, poi rimettilo su Automatic."] },
      { q: "GOG Galaxy ha una bottiglia?", a: ["Non ancora. In Vermut 1.2 GOG Galaxy è indicato come Coming soon."] },
    ],
    sources: [S.vermutRelease, S.vermut, S.dxmt, S.gptk, S.gcenxWine],
  },
];
