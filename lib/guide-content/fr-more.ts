import type { Guide } from "@/lib/guides";
import { S } from "@/lib/guides";

export const guides: readonly Guide[] = [
  {
    slug: "install-wine-on-mac-apple-silicon",
    label: "Installer Wine sur Mac (2026)",
    metaTitle: "Installer Wine sur Mac (Apple Silicon, de Sonoma à Tahoe)",
    description:
      "Le cask Homebrew wine-stable est désactivé depuis le 1er septembre 2026. Comment obtenir Wine aujourd’hui sur un Mac M1 à M4 : builds Gcenx, une interface comme Vermut ou CrossOver.",
    h1: "Installer Wine sur Mac : la méthode qui marche en 2026",
    answer: [
      "L’ancienne méthode, brew install --cask wine-stable, ne fonctionne plus : Homebrew a désactivé le cask le 1er septembre 2026 parce qu’il échoue au contrôle Gatekeeper d’Apple. Des builds de Wine pour macOS existent toujours via le projet Gcenx sur GitHub, mais il faut alors configurer soi-même préfixes, couches graphiques et boutiques. Si vous voulez Wine pour jouer à des jeux Windows, une interface comme Vermut télécharge Wine 11 pour vous et installe Steam ou Epic Games (bêta) dans une bouteille dédiée, gratuitement.",
    ],
    sections: [
      {
        id: "what-changed",
        title: "Ce qui a changé pour Wine sur macOS",
        body: [
          ["Pendant des années, presque tous les guides disaient d’installer Wine avec Homebrew. Le cask wine-stable (Wine 11.0) est désormais désactivé avec le motif fails_gatekeeper_check, et Homebrew ne l’installe plus. Les guides antérieurs à septembre 2026 sont dépassés sur ce point."],
          ["Wine lui-même continue d’évoluer et de fonctionner sur macOS. Sur un Mac Apple Silicon, il exécute les programmes Windows x86-64 via Rosetta 2, qui doit donc être installé. Les jeux ont aussi besoin d’une couche qui traduit DirectX vers Metal, comme DXMT, DXVK avec MoltenVK ou D3DMetal d’Apple ; Wine seul n’a que WineD3D, qui passe par OpenGL."],
        ],
      },
      {
        id: "options",
        title: "Trois façons d’obtenir Wine sur un Mac Apple Silicon",
        bullets: [
          ["Builds Gcenx, gratuits. Le projet Gcenx publie Wine Stable, Staging et Devel pour macOS sur GitHub. Idéal si le Terminal ne vous fait pas peur et si vous voulez Wine aussi pour des logiciels, pas seulement des jeux."],
          ["Une interface gratuite comme Vermut. Elle télécharge son propre build de Wine 11, plus Gcenx Wine Staging et Devel à la demande, et crée une bouteille par boutique. Pensée pour les jeux Steam et Epic, sans Terminal."],
          ["CrossOver, payant. Le Wine commercial de CodeWeavers, avec 14 jours d’essai et un support. La compatibilité la plus large si un jeu ou un logiciel Windows précis doit fonctionner."],
        ],
      },
      {
        id: "steps",
        title: "Wine pour jouer en cinq minutes avec Vermut",
        steps: [
          { title: "Vérifiez votre Mac", body: ["Apple Silicon (M1 ou plus récent) et macOS 14 Sonoma ou ultérieur. Les Mac Intel ne sont pas pris en charge."] },
          { title: "Installez Vermut", body: ["Téléchargez le DMG, glissez Vermut dans Applications et autorisez-le une fois avec le ", { text: "guide du premier lancement", href: "/fr/open-anyway-unnotarized-app-mac" }, "."] },
          { title: "Laissez-le installer Rosetta 2 et Wine", body: ["Au premier lancement, Vermut propose d’installer Rosetta 2 s’il manque, puis télécharge son moteur Wine 11."] },
          { title: "Choisissez une boutique", body: ["Choisissez Steam ou Epic Games (bêta). Vermut crée pour chacune une bouteille avec la bonne couche graphique. GOG Galaxy arrive bientôt."] },
          { title: "Besoin d’une autre version de Wine ?", body: ["Dans Réglages › Wine Engines, téléchargez Wine Staging ou Wine Devel et choisissez-le pour une seule bouteille ou un seul jeu."] },
        ],
      },
    ],
    after: [
      {
        id: "limits",
        title: "Limites, en toute honnêteté",
        bullets: [
          ["Wine n’est pas Windows. Beaucoup de programmes fonctionnent, certains non, et les jeux avec anti-triche noyau ne fonctionnent jamais."],
          ["Vermut est conçu pour les boutiques de jeux. Pour la bureautique ou un utilitaire Windows isolé, Wine seul ou CrossOver peut mieux convenir, même si Vermut sait lancer un .exe dans une bouteille personnalisée."],
          ["Rosetta 2 est essentiel : Apple a annoncé qu’il serait limité dans de futures versions de macOS. Wine sur Mac pourrait donc encore évoluer."],
        ],
      },
    ],
    faq: [
      { q: "Pourquoi brew install wine-stable échoue-t-il ?", a: ["Homebrew a désactivé le cask wine-stable le 1er septembre 2026, car le paquet échoue au contrôle Gatekeeper de macOS. Utilisez un build Gcenx sur GitHub, une interface comme Vermut, ou CrossOver."] },
      { q: "Wine fonctionne-t-il sur macOS Sequoia et Tahoe ?", a: ["Oui, sur Apple Silicon via Rosetta 2. Vermut demande macOS 14 Sonoma ou ultérieur et fonctionne aussi sur les versions plus récentes."] },
      { q: "Wine est-il gratuit ?", a: ["Oui. Wine est un logiciel libre et open source. Vermut, qui installe et gère Wine pour les jeux, est aussi gratuit et sous licence MIT."] },
      { q: "Puis-je utiliser Wine sur un Mac Intel ?", a: ["Des builds de Wine existent pour les Mac Intel, mais Vermut ne prend en charge que l’Apple Silicon."] },
    ],
    sources: [S.brewWine, S.gcenxWine, S.winehq, S.cxStore, S.dxmt, S.vermutRelease, S.vermut],
  },

  {
    slug: "epic-games-windows-games-on-mac",
    label: "Jeux Windows d’Epic sur Mac",
    metaTitle: "Jouer aux jeux Windows de l’Epic Games Store sur Mac M1, M2, M3 ou M4",
    description:
      "Le lanceur Epic Games pour Mac n’installe que les jeux Mac. Voici comment installer et lancer votre bibliothèque Epic Windows sur Apple Silicon gratuitement, avec Vermut et Legendary.",
    h1: "Jouer aux jeux Windows de l’Epic Games Store sur Mac",
    answer: [
      "Le lanceur Epic Games pour Mac n’installe que les jeux qui ont une version Mac. Pour les jeux Windows, il faut Wine sur un Mac Apple Silicon. Vermut le fait gratuitement, en bêta : il utilise Legendary, un client Epic open source. Vous vous connectez sur la page d’Epic, voyez votre bibliothèque, puis installez et lancez les jeux Windows dans une bouteille Wine 11, sans le lanceur Epic. Fortnite et les autres jeux avec anti-triche noyau ne fonctionnent pas.",
    ],
    sections: [
      {
        id: "why",
        title: "Pourquoi le lanceur Epic pour Mac ne suffit pas",
        body: [
          ["Le lanceur d’Epic tourne sur macOS, mais sa bibliothèque ne propose que les versions Mac. La plupart des jeux achetés ou récupérés gratuitement sur l’Epic Games Store n’existent que sur Windows : impossible de les installer."],
          ["Lancer le lanceur Windows d’Epic dans Wine est possible, mais lourd. Vermut s’en passe : Legendary dialogue directement avec les serveurs d’Epic, télécharge les fichiers Windows du jeu et les lance dans Wine."],
        ],
      },
      {
        id: "steps",
        title: "Configurer votre bibliothèque Epic avec Vermut",
        steps: [
          { title: "Installez Vermut", body: ["Il faut un Mac Apple Silicon sous macOS 14 ou ultérieur. Glissez Vermut dans Applications et autorisez-le une fois avec le ", { text: "guide du premier lancement", href: "/fr/open-anyway-unnotarized-app-mac" }, "."] },
          { title: "Choisissez Epic Games (bêta)", body: ["Choisissez Epic Games dans Boutiques. Vermut télécharge son moteur Wine et le client Legendary, dont il vérifie la somme de contrôle."] },
          { title: "Connectez-vous sur la page d’Epic", body: ["Vermut ouvre la page de connexion d’Epic. Votre mot de passe va à Epic, pas à Vermut ; Legendary garde la session sur votre Mac."] },
          { title: "Installez un jeu", body: ["Votre bibliothèque Epic apparaît dans Vermut. Installez un jeu : il est téléchargé dans la bouteille Epic."] },
          { title: "Jouez, et ajustez si besoin", body: ["Les jeux installés apparaissent dans la Bibliothèque avec un bouton Play. Si l’un pose problème, ouvrez les réglages du jeu avec ⌥⌘I et essayez un autre backend graphique."] },
        ],
      },
    ],
    after: [
      {
        id: "what-works",
        title: "À quoi s’attendre",
        bullets: [
          ["Fonctionne le plus souvent : les jeux DirectX 9 à 11, surtout les titres plus anciens et indépendants."],
          ["Les jeux DirectX 12 nécessitent D3DMetal d’Apple : voir ", { text: "Jeux DirectX 12 sur Mac", href: "/fr/directx-12-games-on-mac-d3dmetal" }, "."],
          ["Ne fonctionne pas : Fortnite, Valorant et les autres jeux avec anti-triche noyau. Vérifiez d’abord sur ", { text: "Are We Anti-Cheat Yet?", href: S.aacy.href }, "."],
          ["Epic dans Vermut est en bêta. Certaines fonctions du lanceur officiel, comme la boutique ou la liste d’amis, manquent : achetez et récupérez vos jeux sur le site d’Epic."],
        ],
      },
    ],
    faq: [
      { q: "Puis-je jouer à Fortnite sur Mac avec Vermut ?", a: ["Non. Fortnite utilise un anti-triche noyau qui bloque Wine. Sur Mac, il n’est jouable qu’en cloud gaming."] },
      { q: "Vermut installe-t-il le lanceur Epic Games ?", a: ["Non. Il utilise Legendary, un client Epic open source, donc le lanceur n’est pas nécessaire."] },
      { q: "Les jeux gratuits d’Epic fonctionnent-ils ?", a: ["Les jeux récupérés gratuitement sont dans votre bibliothèque comme les autres et peuvent être installés. Leur fonctionnement dépend du jeu."] },
      { q: "Vermut voit-il mon mot de passe Epic ?", a: ["Non. Vous vous connectez sur la page d’Epic, et Legendary garde la session sur votre Mac."] },
    ],
    sources: [S.legendary, S.epicMac, S.aacy, S.vermutRelease, S.vermut],
  },

  {
    slug: "directx-12-games-on-mac-d3dmetal",
    label: "Jeux DirectX 12 sur Mac avec D3DMetal",
    metaTitle: "Jouer à des jeux DirectX 12 sur Mac : utiliser D3DMetal",
    description:
      "Les jeux Windows DirectX 12 ont besoin de D3DMetal, la couche d’Apple issue du Game Porting Toolkit. Comment le télécharger gratuitement et l’utiliser dans Vermut, étape par étape.",
    h1: "Jouer à des jeux DirectX 12 sur un Mac Apple Silicon",
    answer: [
      "Les jeux DirectX 12 ont besoin de D3DMetal, la couche de traduction d’Apple incluse dans le Game Porting Toolkit. La licence d’Apple interdit aux apps de l’intégrer : vous le téléchargez vous-même sur developer.apple.com avec un compte Apple gratuit. Vermut le trouve ensuite, vérifie qu’il s’agit de la version 2.0 ou ultérieure, et propose D3DMetal comme backend graphique pour une bouteille ou un seul jeu.",
    ],
    sections: [
      {
        id: "why",
        title: "Pourquoi DirectX 12 demande un élément en plus",
        body: [
          ["Les Mac parlent Metal, pas DirectX. La couche par défaut de Vermut, DXMT, traduit DirectX 10 et 11 vers Metal, et DXVK couvre DirectX 9 à 11 via Vulkan et MoltenVK. Aucune des deux ne gère DirectX 12 sur Mac."],
          ["D3DMetal d’Apple, si. Il fait partie du Game Porting Toolkit, conçu par Apple pour les développeurs qui testent des jeux Windows, et c’est la même couche sur laquelle s’appuient les outils commerciaux pour DirectX 12."],
        ],
      },
      {
        id: "steps",
        title: "Installer D3DMetal et l’utiliser dans Vermut",
        steps: [
          { title: "Connectez-vous à Apple Developer", body: ["Allez sur developer.apple.com et connectez-vous avec votre compte Apple. Un compte gratuit suffit."] },
          { title: "Téléchargez le Game Porting Toolkit", body: ["Cherchez Game Porting Toolkit dans la liste des téléchargements et récupérez le .dmg."] },
          { title: "Ouvrez l’environnement d’évaluation", body: ["Ouvrez le .dmg, puis « Evaluation environment for Windows games », et acceptez la licence. Cela active le volume qui contient D3DMetal."] },
          { title: "Laissez Vermut le trouver", body: ["Ouvrez Vermut › Réglages › D3DMetal. Vermut cherche aux emplacements habituels ; s’il ne trouve rien, cliquez sur Point to location… et choisissez le dossier redist/lib."] },
          { title: "Passez un jeu sur D3DMetal", body: ["Sélectionnez le jeu dans la Bibliothèque, appuyez sur ⌥⌘I pour ses réglages et réglez Graphics backend sur D3DMetal. Ou réglez-le pour toute la bouteille dans l’onglet Graphics de la bouteille."] },
        ],
      },
    ],
    after: [
      {
        id: "limits",
        title: "Limites, en toute honnêteté",
        bullets: [
          ["Dans Vermut, D3DMetal fonctionne avec les bouteilles Steam et Epic. Vermut ne le modifie ni ne le redistribue jamais."],
          ["Tous les jeux DirectX 12 ne fonctionnent pas, et les plus lourds demandent un GPU puissant : sur une puce M de base, prévoyez des réglages plus bas."],
          ["Les jeux avec anti-triche noyau ne fonctionnent toujours pas, quelle que soit la couche graphique."],
          ["Si un jeu démarre puis plante, comparez avec DXMT : certains jeux ont un mode DirectX 11 qui fonctionne mieux."],
        ],
      },
    ],
    faq: [
      { q: "D3DMetal est-il gratuit ?", a: ["Oui. Le Game Porting Toolkit est un téléchargement gratuit chez Apple, avec un compte Apple gratuit."] },
      { q: "Pourquoi Vermut n’inclut-il pas D3DMetal ?", a: ["La licence d’Apple ne le permet pas aux apps. Vous le téléchargez chez Apple et Vermut utilise votre copie."] },
      { q: "Quelle version me faut-il ?", a: ["Vermut a besoin de D3DMetal 2.0 ou ultérieur. S’il trouve une version plus ancienne, il vous indique de télécharger la dernière chez Apple."] },
      { q: "Faut-il Xcode ou le Terminal ?", a: ["Non. Avec Vermut, il suffit de télécharger le .dmg, de l’ouvrir et d’accepter la licence."] },
    ],
    sources: [S.gptk, S.gptkDownload, S.gptkReq, S.dxmt, S.vermutRelease, S.vermut],
  },

  {
    slug: "open-anyway-unnotarized-app-mac",
    label: "Ouvrir Vermut la première fois (Ouvrir quand même)",
    metaTitle: "Apple n’a pas pu vérifier une app ? Ouvrir Vermut avec « Ouvrir quand même »",
    description:
      "Pourquoi macOS ne peut pas vérifier Vermut et comment l’ouvrir sans risque avec Ouvrir quand même, dans Confidentialité et sécurité, sur Sonoma, Sequoia et ultérieur. Et comment vérifier le téléchargement.",
    h1: "Ouvrir Vermut pour la première fois sur macOS",
    answer: [
      "macOS bloque Vermut au premier lancement parce que c’est une app gratuite pas encore notariée avec un Developer ID Apple payant, pas parce qu’elle contient un logiciel malveillant. Ouvrez-la une fois, cliquez sur Terminé, puis allez dans Réglages Système › Confidentialité et sécurité, cliquez sur Ouvrir quand même à côté du message sur Vermut et confirmez avec Touch ID ou votre mot de passe. Ensuite, elle s’ouvre normalement. Depuis macOS Sequoia, Contrôle-clic › Ouvrir ne permet plus de contourner cette étape.",
    ],
    sections: [
      {
        id: "why",
        title: "Pourquoi macOS affiche un avertissement",
        body: [
          ["Gatekeeper vérifie qu’une app est signée avec un Developer ID Apple et notariée par Apple. La notarisation exige un abonnement développeur payant. Vermut est un projet gratuit sous licence MIT, pas encore notarié, donc macOS affiche un avertissement du type « Apple n’a pas pu vérifier que Vermut ne contient pas de logiciel malveillant »."],
          ["Cet avertissement signifie qu’Apple n’a pas examiné l’app, pas qu’un problème a été trouvé. Vous pouvez lire tout le code source sur GitHub et comparer votre téléchargement avec le SHA-256 publié sur la page de téléchargement et dans les notes de version."],
        ],
      },
      {
        id: "steps",
        title: "Ouvrir Vermut, étape par étape",
        steps: [
          { title: "Ouvrez Vermut depuis Applications", body: ["Glissez Vermut du DMG vers Applications et ouvrez-le. macOS affiche l’avertissement : cliquez sur Terminé, pas sur Placer dans la corbeille."] },
          { title: "Cliquez sur Ouvrir quand même dans Confidentialité et sécurité", body: ["Choisissez le menu Pomme › Réglages Système › Confidentialité et sécurité, faites défiler jusqu’à Sécurité et cliquez sur Ouvrir quand même à côté du message sur Vermut. Le bouton reste visible environ une heure après l’étape 1."] },
          { title: "Cliquez de nouveau sur Ouvrir quand même", body: ["Une fenêtre de confirmation apparaît : cliquez sur Ouvrir quand même."] },
          { title: "Confirmez avec Touch ID ou votre mot de passe", body: ["macOS enregistre Vermut comme exception. La prochaine fois, un double-clic suffit."] },
        ],
      },
    ],
    after: [
      {
        id: "check",
        title: "Si vous le souhaitez, vérifiez d’abord le téléchargement",
        bullets: [
          ["Dans le Terminal, lancez shasum -a 256 sur le DMG dans votre dossier Téléchargements et comparez le résultat avec le SHA-256 indiqué sur la page de téléchargement de Vermut."],
          ["Ne téléchargez Vermut que depuis ses releases GitHub ou le site officiel qui y renvoie."],
          ["Ne désactivez pas Gatekeeper pour tout le Mac. Ouvrir quand même crée une exception pour cette seule app."],
        ],
      },
    ],
    faq: [
      { q: "Vermut est-il sûr ?", a: ["Vermut est open source, donc chacun peut voir ce qu’il fait, et chaque version publie son SHA-256. Pas de compte ni de télémétrie. L’avertissement de macOS concerne la notarisation, pas une menace détectée."] },
      { q: "Pourquoi Contrôle-clic › Ouvrir ne marche-t-il pas ?", a: ["Apple a supprimé ce raccourci avec macOS Sequoia. Utilisez plutôt Ouvrir quand même dans Confidentialité et sécurité."] },
      { q: "Je ne vois pas Ouvrir quand même.", a: ["Essayez d’abord d’ouvrir Vermut puis cliquez sur Terminé : le bouton n’apparaît qu’environ une heure après un lancement bloqué. Regardez ensuite dans la section Sécurité, en bas de Confidentialité et sécurité."] },
      { q: "Faut-il recommencer à chaque mise à jour ?", a: ["En général, une fois par copie téléchargée. Si macOS avertit de nouveau après une nouvelle version, refaites les mêmes étapes."] },
    ],
    sources: [S.appleOpenAnyway, S.appleSafely, S.appleSequoia, S.vermutRelease, S.vermut],
  },

  {
    slug: "wine-bottles-and-game-settings-mac",
    label: "Bouteilles et réglages par jeu dans Vermut",
    metaTitle: "Bouteilles Wine, backends graphiques et réglages par jeu dans Vermut",
    description:
      "Comment fonctionnent les bouteilles Wine de Vermut : une par boutique, des bouteilles personnalisées pour n’importe quel .exe, et des réglages par jeu pour le moteur Wine, DXMT, DXVK, WineD3D ou D3DMetal.",
    h1: "Bouteilles Wine et réglages par jeu dans Vermut",
    answer: [
      "Une bouteille est un environnement Windows séparé, un préfixe Wine avec son propre lecteur C:. Vermut en crée une par boutique, et vous pouvez ajouter des bouteilles personnalisées pour des programmes hors de Steam et Epic. Les réglages sont en couches : les Réglages de Vermut fixent les valeurs par défaut, chaque bouteille peut les modifier et, depuis la 1.2, chaque jeu peut les modifier à nouveau dans ses réglages (⌥⌘I). « Automatic » affiche toujours la valeur héritée.",
    ],
    sections: [
      {
        id: "layers",
        title: "Réglages, bouteille, jeu : comment fonctionnent les couches",
        bullets: [
          ["Les Réglages (⌘,) contiennent les valeurs par défaut : moteur Wine, backend graphique, version de DXMT et niveau de log."],
          ["Une bouteille utilise ces valeurs jusqu’à ce que vous les changiez sur sa page. Les bouteilles des boutiques ont aussi la version de Windows (10, 8.1 ou 7), le mode haute résolution, winecfg, le lecteur C: de la bouteille dans le Finder, les logs et le diagnostic."],
          ["Un jeu utilise les valeurs de sa bouteille jusqu’à ce que vous les remplaciez dans ses réglages. Cela ne concerne que ce jeu."],
          ["Changer de moteur ne touche ni aux jeux ni aux sauvegardes. Si la boutique est ouverte, le changement s’applique à sa prochaine ouverture."],
        ],
      },
      {
        id: "backends",
        title: "Quel backend graphique choisir",
        bullets: [
          ["DXMT, par défaut : DirectX 10 et 11 directement vers Metal. Vermut gère plusieurs versions de DXMT dans Réglages › Components, pour qu’un jeu puisse rester sur une version plus ancienne."],
          ["DXVK avec MoltenVK : DirectX 9 à 11 via Vulkan. Il demande Wine Staging, que Vermut sélectionne automatiquement."],
          ["WineD3D : la couche propre à Wine, via OpenGL. Plus lente, mais parfois la plus compatible avec les vieux jeux."],
          ["D3DMetal : la couche DirectX 12 d’Apple, disponible une fois le Game Porting Toolkit installé. Voir ", { text: "Jeux DirectX 12 sur Mac", href: "/fr/directx-12-games-on-mac-d3dmetal" }, "."],
        ],
      },
      {
        id: "steps",
        title: "Tâches courantes",
        steps: [
          { title: "Modifier les réglages d’un jeu", body: ["Sélectionnez le jeu dans la Bibliothèque et appuyez sur ⌥⌘I (View › Game Settings). Choisissez moteur Wine, backend graphique, version de DXMT ou niveau de log, ou laissez Automatic."] },
          { title: "Créer une bouteille personnalisée", body: ["Appuyez sur ⇧⌘N (File › New Bottle…). Donnez-lui un nom et choisissez moteur, backend graphique et version de Windows, ou laissez-les sur Automatic."] },
          { title: "Lancer un installateur Windows", body: ["Dans une bouteille personnalisée, cliquez sur Run .exe or Installer… (⌘O) et choisissez un .exe ou un .msi. Vous pouvez aussi utiliser Run .exe dans la barre d’outils."] },
          { title: "Repartir de zéro si une bouteille est cassée", body: ["Utilisez Reset bottle sur la page de la bouteille. Cela efface cette bouteille et les jeux qui y sont installés ; votre compte de boutique et vos sauvegardes cloud ne sont pas là."] },
        ],
      },
    ],
    faq: [
      { q: "Puis-je importer des bouteilles de Whisky ou CrossOver ?", a: ["Non. Vermut crée ses propres bouteilles. Installez la boutique dans Vermut et retéléchargez vos jeux."] },
      { q: "Où sont mes jeux ?", a: ["Dans le lecteur C: de chaque bouteille. Ouvrez-le depuis la page de la bouteille pour voir les fichiers dans le Finder. Les jeux tournent mieux sur le SSD interne."] },
      { q: "À quoi sert le niveau de log ?", a: ["Il règle la quantité d’informations que Wine écrit dans le log. Augmentez-le pour signaler un bug sur GitHub, puis remettez-le sur Automatic."] },
      { q: "GOG Galaxy a-t-il une bouteille ?", a: ["Pas encore. Dans Vermut 1.2, GOG Galaxy est indiqué comme Coming soon."] },
    ],
    sources: [S.vermutRelease, S.vermut, S.dxmt, S.gptk, S.gcenxWine],
  },
];
