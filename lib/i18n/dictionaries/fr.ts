/**
 * Français. Machine-assisted, needs native review (see docs/I18N.md).
 * macOS labels from Apple's French support page mh40616. Avoid the
 * ligature œ: it is not in the font subsets. Guillemets use U+00A0.
 */
import { links, site } from "@/site.config";
import { build } from "../build";

const macos = "macOS 14 Sonoma ou ultérieur";

export const fr = build({
  locale: "fr",
  seo: {
    title: "Vermut : jeux Windows sur Mac avec Steam, GOG et Epic",
    description:
      "Lanceur gratuit et open source pour Mac avec puce Apple. Vermut installe Steam et GOG Galaxy, ajoute Epic Games (bêta), configure Wine et lance vos jeux Windows.",
    keywords: ["jeux Windows sur Mac", "Steam Mac Apple Silicon", "Epic Games Mac", "GOG Galaxy Mac", "Wine macOS", "alternative à Whisky", "alternative à CrossOver", "lanceur de jeux gratuit open source Mac", "Vermut"],
  },
  nav: ["Fonctionnement", "Compatibilité", "Comparatif", "Soutenir", "FAQ", "Télécharger"],
  hero: {
    eyebrow: "Gratuit · Open source · Apple Silicon",
    lead: "Vermut installe Steam et GOG Galaxy sur votre Mac, ajoute votre bibliothèque Epic Games (bêta) et configure Wine pour chacun : vos jeux Windows se lancent en un clic.",
    primary: "Télécharger pour Mac",
    secondary: "Ajouter une étoile sur GitHub",
    meta: [macos, "Apple Silicon", `Licence ${site.license}`],
    screenshotAlt:
      "La Library de Vermut : un jeu Steam marqué Ready, avec un bouton Play. La barre latérale affiche Stores, Library, Downloads et une bouteille pour Steam, Epic Games et GOG Galaxy.",
  },
  howItWorks: {
    eyebrow: "Fonctionnement",
    title: "Trois étapes. Sans Terminal.",
    lead: "Pas de bouteille à configurer, pas de version de Wine à choisir, pas de ligne de commande. Chaque vidéo ci-dessous montre la vraie app.",
    steps: [
      {
        title: "Choisissez une boutique",
        body: "Choisissez Steam, GOG Galaxy ou Epic Games (bêta). Steam et GOG s’installent avec leurs programmes officiels ; Epic passe par le client open source Legendary, sans le lanceur Epic. Chaque boutique a sa propre bouteille, pour qu’elles ne se gênent pas.",
        description: "Enregistrement d’écran : l’écran Stores affiche Steam, Epic Games (bêta) et GOG Galaxy, chacun dans sa bouteille. Le pointeur survole les boutiques puis clique sur Open Steam.",
      },
      {
        title: "Vermut configure Wine",
        body: "Chaque bouteille reçoit Wine 11 et la couche graphique adaptée à sa boutique : DXMT pour Steam, DXVK pour Epic, WineD3D pour GOG. Vous pourrez la changer plus tard, mais rien ne vous y oblige.",
        description: "Enregistrement d’écran : le pointeur ouvre la bouteille Steam depuis la barre latérale, passe à l’onglet Graphics et désigne le moteur sélectionné, DXMT.",
      },
      {
        title: "Jouez",
        body: "Connectez-vous à votre boutique comme d’habitude et installez vos jeux. Ils apparaissent dans la Library, et Play lance chacun dans la bonne bouteille.",
        description: "Enregistrement d’écran : le pointeur ouvre la Library, où un jeu Steam est marqué Ready, et clique sur Play dans la barre Continue.",
      },
    ],
  },
  compatibility: {
    eyebrow: "Compatibilité, en toute franchise",
    title: "Ce qui marche, et ce qui ne marche pas.",
    lead: "Vermut fait tourner les jeux Windows avec Wine. Beaucoup fonctionnent bien, certains ne fonctionneront jamais. Mieux vaut le savoir maintenant qu’après un téléchargement de 60 Go.",
    groups: [
      {
        title: "Fonctionne en général",
        items: [
          ["Les jeux DirectX 9, 10 et 11, traduits en Metal par DXMT ou DXVK."],
          ["Les jeux indés et plus anciens, souvent les plus simples."],
          ["Les clients Steam et GOG Galaxy eux-mêmes, plus votre bibliothèque Epic Games via Legendary (bêta)."],
        ],
      },
      {
        title: "Demande un peu de réglage",
        items: [
          ["Les jeux DirectX 12 nécessitent le ", { text: "Game Porting Toolkit", href: "https://developer.apple.com/games/game-porting-toolkit/" }, " d’Apple (D3DMetal). Vermut le détecte si vous l’installez, mais ne l’inclut jamais."],
          ["Les jeux avec leur propre lanceur, comme l’app EA ou Ubisoft Connect, peuvent demander Run .exe dans une bouteille et quelques essais."],
        ],
      },
      {
        title: "Ne fonctionne pas",
        items: [
          ["Les jeux avec un anti-triche au niveau du noyau, dont Valorant, Fortnite et Call of Duty. L’anti-triche bloque Wine, et rien ne peut être fait côté Mac."],
          ["Tout ce qui exige un pilote Windows, comme certains outils de périphériques ou de DRM."],
        ],
      },
    ],
    footnote: [
      "Avant d’acheter un jeu, consultez ",
      { text: "Are We Anti-Cheat Yet?", href: "https://areweanticheatyet.com/" },
      " pour l’état de l’anti-triche et la ",
      { text: "base de compatibilité de CodeWeavers", href: "https://www.codeweavers.com/compatibility" },
      " pour les retours Wine sur Mac.",
    ],
  },
  comparison: {
    eyebrow: "Comparatif",
    title: "Où se situe Vermut.",
    lead: "Il existe de bonnes façons de jouer à des jeux Windows sur Mac. Voici leurs différences, en octobre 2026.",
    rows: [
      { label: "Prix", cells: [["Gratuit"], ["Gratuit"], ["À partir de 74 $", "12 mois de mises à jour ; essai gratuit de 14 jours [3][4]"], ["Gratuit"]] },
      { label: "Open source", cells: [["Oui, MIT"], ["Oui, GPL-3.0 [2]"], ["Non", "Basé sur Wine (LGPL)"], ["Oui, GPL-3.0 [6]"]] },
      { label: "Maintenu", cells: [["Oui"], ["Non", "Archivé le 9 avril 2025 ; un fork communautaire continue [1][2]"], ["Oui", "CrossOver 26, février 2026 [5]"], ["Oui", "v2.22.4, 15 octobre 2026 [7]"]] },
      {
        label: "Installe Steam, Epic et GOG pour vous",
        cells: [
          ["Oui", "Steam et GOG dans leurs bouteilles ; Epic (bêta) via Legendary, sans lanceur Epic"],
          ["Non", "Vous créez une bouteille et lancez chaque installateur"],
          ["Oui", "Depuis son catalogue d’installation ; Epic et GOG depuis CrossOver 25 [9][10]"],
          ["Epic, GOG, Amazon", "Son propre lanceur ; pas de client Steam [6]"],
        ],
      },
      {
        label: "Moteur Wine",
        cells: [
          ["Inclus", "Wine 11 avec DXMT et DXVK ; D3DMetal si vous l’installez"],
          ["Inclus, figé", "Pas de mise à niveau vers Wine 8+ [1]"],
          ["Inclus", "Version maison de CodeWeavers"],
          ["Au choix", "Télécharge Wine, des builds GPTK ou utilise CrossOver [8]"],
        ],
      },
      { label: "Fonctionne sans Terminal", cells: [["Oui"], ["Oui"], ["Oui"], ["Oui"]] },
      { label: "Assistance", cells: [["Issues GitHub"], ["Aucune"], ["E-mail et téléphone", "Tant que la licence est active [3]"], ["Communauté", "GitHub et Discord"]] },
    ],
    aside: ["Besoin d’une assistance commerciale ou de la couverture la plus large ? Achetez CrossOver. CodeWeavers est l’un des principaux contributeurs de Wine, et tous les projets Wine pour Mac, Vermut compris, reposent sur ce travail."],
    sourcesTitle: "Sources, vérifiées le 19 octobre 2026",
  },
  support: {
    eyebrow: "Soutenir Vermut",
    title: "Gratuit, et ça le restera.",
    lead: "Vermut est développé sur du temps libre. Les dons financent ce temps, ainsi que les Mac et les jeux de test. Aucune version payante n’est prévue, quoi qu’il arrive.",
    donateLabel: "Faire un don avec PayPal",
    donateNote: "PayPal s’ouvre dans un nouvel onglet.",
    otherTitle: "Pas une question d’argent ? Ceci aide tout autant.",
    options: [
      { title: "Une étoile sur GitHub", body: "Les étoiles aident d’autres joueurs sur Mac à trouver le projet.", label: "Ajouter une étoile au dépôt" },
      { title: "Signaler un bug", body: "Quelque chose ne marche pas ? Un ticket avec votre version de macOS et les journaux nous aide à corriger.", label: "Ouvrir un rapport de bug" },
      { title: "Dites-nous quels jeux marchent", body: "Vous avez essayé un jeu ? Indiquez le jeu, la boutique et le moteur graphique, que ça marche ou non.", label: "Envoyer un retour de jeu" },
    ],
    share: { title: "Partager Vermut", body: "Vous connaissez quelqu’un qui joue sur Mac ? Envoyez-lui le lien.", text: "Vermut : jeux Windows sur Mac avec Steam, GOG et Epic. Gratuit et open source." },
  },
  faq: {
    eyebrow: "FAQ",
    title: "Questions et réponses.",
    items: [
      { q: "Vermut est-il vraiment gratuit ?", a: [`Oui. Open source sous licence ${site.license} : pas de compte, pas de version payante, pas de télémétrie.`] },
      { q: "Fonctionne-t-il sur les Mac Intel ?", a: ["Non. Vermut est conçu pour les puces Apple : M1 et toutes les suivantes."] },
      { q: "Quelle version de macOS faut-il ?", a: [`${macos}.`] },
      { q: "Mon jeu va-t-il fonctionner ?", a: ["Cela dépend du jeu. La plupart des titres DirectX 9 à 11, oui ; ceux avec un anti-triche noyau, non. Tout est détaillé dans la section ", { text: "compatibilité", href: "#compatibility" }, "."] },
      { q: "Vermut voit-il mon mot de passe Steam ou Epic ?", a: ["Non. Pour Steam et GOG, vous vous connectez dans l’app officielle de la boutique, qui tourne dans sa bouteille. Pour Epic (bêta), vous vous connectez sur la page de connexion d’Epic et Legendary conserve la session sur votre Mac."] },
      { q: "Vermut installe-t-il l’Epic Games Launcher ?", a: ["Non. La prise en charge d’Epic est en bêta et utilise ", { text: "Legendary", href: "https://github.com/derrod/legendary" }, ", un client Epic open source : connexion, bibliothèque, installation et lancement des jeux, sans l’Epic Games Launcher."] },
      { q: "Inclut-il le Game Porting Toolkit d’Apple ?", a: ["Non, Vermut ne l’inclut jamais. Si vous l’installez vous-même, Vermut le détecte et propose D3DMetal comme option graphique."] },
      {
        q: "Pourquoi macOS affiche-t-il un avertissement ?",
        a: [
          "Vermut est gratuit et open source, et il n’est ni signé avec un Apple Developer ID payant, ni notarié par Apple : Gatekeeper ne peut donc pas s’en porter garant. Autorisez-le une fois dans Réglages Système › Confidentialité et sécurité (voir ",
          { text: "les étapes du premier lancement", href: "#download" },
          "). Vous pouvez lire le ",
          { text: "code source", href: links.github },
          " et comparer le SHA-256 du DMG avec celui affiché sur cette page.",
        ],
      },
      { q: "Faut-il le Terminal ou Homebrew ?", a: ["Non. Tout se fait dans l’app, de l’installation d’une boutique au lancement d’un jeu."] },
      { q: "Quelle différence avec Whisky ?", a: ["Whisky était une interface Wine généraliste et n’est plus maintenu. Vermut est pensé autour des boutiques de jeux : une bouteille par boutique, configurée pour vous, et une Library pour tout ce que vous installez."] },
      { q: "Comment le désinstaller ?", a: ["Supprimez chaque bouteille depuis sa section Danger zone dans Vermut (cela retire la boutique et ses jeux), puis faites glisser Vermut dans la corbeille."] },
    ],
    requirements: {
      title: "Configuration requise",
      items: [
        { label: "Mac", value: "Puce Apple (M1 ou ultérieure)" },
        { label: "macOS", value: "14 Sonoma ou ultérieur" },
        { label: "Disque", value: "10 Go libres, plus la place pour vos jeux" },
        { label: "Rosetta 2", value: "Installé pour vous s’il manque" },
        { label: "Internet", value: "Pour télécharger boutiques et jeux" },
      ],
    },
  },
  download: {
    eyebrow: "Téléchargement",
    title: "Téléchargez Vermut pour votre Mac.",
    lead: "Un seul DMG, tiré directement de la dernière version publiée sur GitHub. Gratuit, sans compte.",
    primaryLabel: (version) => `Télécharger Vermut ${version} (.dmg)`,
    shaLabel: "SHA-256",
    allReleases: "Toutes les versions et notes de version",
    brewLabel: "Ou installer avec Homebrew",
    installTitle: "Installé en une minute",
    steps: (dmgName) => [
      `Ouvrez ${dmgName} depuis votre dossier Téléchargements.`,
      "Faites glisser Vermut dans le dossier Applications.",
      "Ouvrez Vermut depuis Applications. Si Rosetta 2 manque sur votre Mac, Vermut l’installe pour vous.",
    ],
    gatekeeper: {
      firstLaunch: "Au premier lancement, ouvrez Réglages Système > Confidentialité et sécurité et cliquez sur « Ouvrir quand même » (macOS Tahoe et Sequoia).",
      firstLaunchLink: "Voir comment",
      title: "Premier lancement : autorisez Vermut une fois",
      why: "macOS vous avertit car Vermut est une app gratuite et open source, non signée avec un Apple Developer ID payant. Vous pouvez lire chaque ligne du ",
      whySource: "code source",
      whyAnd: " et vérifier le téléchargement avec son ",
      whySha: "SHA-256",
      whyEnd: ".",
      steps: [
        { title: "Ouvrez Vermut", body: "Double-cliquez sur Vermut dans Applications. macOS affiche « Vermut » n’a pas été ouvert. Cliquez sur Terminé, pas sur Placer dans la corbeille." },
        { title: "Ouvrez Confidentialité et sécurité", body: "Choisissez le menu Pomme › Réglages Système, cliquez sur Confidentialité et sécurité dans la barre latérale, puis faites défiler jusqu’à Sécurité." },
        { title: "Cliquez sur Ouvrir quand même", body: "À côté du message concernant Vermut, cliquez sur Ouvrir quand même. Le bouton reste disponible environ une heure après l’étape 1." },
        { title: "Confirmez", body: "Cliquez sur Ouvrir, puis confirmez avec votre mot de passe d’ouverture de session ou Touch ID. macOS retient ce choix : vous ne le faites qu’une fois." },
      ],
      note: "Voici la marche à suivre sous macOS 15 Sequoia et ultérieur, où Contrôle-clic › Ouvrir ne contourne plus la vérification. Sous macOS 14 Sonoma, Contrôle-clic › Ouvrir fonctionne encore.",
      appleLabel: "Assistance Apple : Ouvrir une app Mac provenant d’un développeur inconnu",
      appleHref: "https://support.apple.com/fr-fr/guide/mac-help/mh40616/mac",
      illustrationNote: "Illustrations simplifiées, pas des captures d’écran.",
    },
    terminal: {
      title: "Plutôt Terminal ? Installation en une commande (sans l’avertissement Gatekeeper)",
      body: "Le script télécharge le dernier DMG et copie Vermut dans Applications. Lisez-le avant de l’exécuter.",
      sourceLabel: "Voir le code de install.sh",
    },
  },
  footer: {
    statement: "Gratuit et open source. Pas de compte, pas de télémétrie, pas de version payante.",
    cta: "Télécharger pour Mac",
    columns: [
      { title: "Projet", links: ["GitHub", "Versions", `Licence ${site.license}`, "Kit de marque (.zip)"] },
      { title: "Contribuer", links: ["Soutenir Vermut", "Guide de contribution", "Signaler un bug", "Tickets ouverts"] },
    ],
    legal: "Vermut n’est affilié ni à Valve, ni à Epic Games, ni à GOG, ni à CodeWeavers, ni à Apple. Steam, Epic Games Store, GOG Galaxy et les autres noms sont des marques de leurs propriétaires respectifs.",
  },
  ui: {
    skipToContent: "Aller au contenu",
    primaryNav: "Navigation principale",
    backToTop: "Vermut, retour en haut",
    releaseDetails: "Détails de la version",
    stepPrefix: (n) => `Étape ${n} : `,
    videoLabel: (title) => `${title} : enregistrement d’écran de Vermut`,
    play: (label) => `Lire : ${label}`,
    pause: (label) => `Pause : ${label}`,
    compareCaption: "Vermut comparé à Whisky, CrossOver et Heroic. Les numéros entre crochets renvoient aux sources sous le tableau.",
    feature: "Critère",
    copied: "Copié",
    copySha: (file) => `Copier le SHA-256 de ${file}`,
    copyInstall: "Copier la commande d’installation",
    copyLink: "Copier le lien vers Vermut",
    opensNewTab: " (s’ouvre dans un nouvel onglet)",
    shareNewTab: " (partager, s’ouvre dans un nouvel onglet)",
    language: "Langue",
    macosRequirement: macos,
    appleSilicon: "Puce Apple (M1 ou ultérieure)",
    facts: { version: "Version", size: "Taille", macos: "macOS", mac: "Mac", licence: "Licence" },
    version: (v) => `Version ${v}`,
    latest: "Dernière",
    releaseNotes: (v) => `Notes de version de Vermut ${v}`,
    licence: (l) => `Licence ${l}`,
  },
  illustrations: {
    note: "Illustrations simplifiées, pas des captures d’écran.",
    dialog: {
      aria: "Illustration de la fenêtre macOS « Vermut » n’a pas été ouvert, avec les boutons Terminé et Placer dans la corbeille. Cliquez sur Terminé.",
      title: "« Vermut » n’a pas été ouvert",
      body: "Apple n’a pas pu confirmer que « Vermut » ne contenait pas de logiciel malveillant pouvant endommager votre Mac ou compromettre votre confidentialité.",
      trash: "Placer dans la corbeille",
      done: "Terminé",
    },
    settings: {
      aria: "Illustration de Réglages Système, Confidentialité et sécurité, section Sécurité : le message indiquant que Vermut a été bloqué, avec le bouton Ouvrir quand même.",
      window: "Confidentialité et sécurité",
      section: "Sécurité",
      allow: "Autoriser les applications provenant de l’App Store et de développeurs identifiés",
      blocked: "« Vermut » a été bloqué pour protéger votre Mac.",
      button: "Ouvrir quand même",
    },
  },
  notFound: {
    metaTitle: "Page introuvable",
    title: "Rien à servir ici.",
    body: "La page que vous cherchez n’existe pas. Vermut vous attend sur la page d’accueil.",
    back: "Retour à Vermut",
  },
});
