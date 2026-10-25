import type { Guide, GuideUi } from "@/lib/guides";
import { S } from "@/lib/guides";
import { guides as more } from "./fr-more";
import { links } from "@/site.config";

const FIRST_LAUNCH = "/fr#first-launch";

const kernelAntiCheat = [
  "Les jeux dotés d'un anti-triche au niveau du noyau, comme Valorant, Fortnite et Call of Duty, ne fonctionnent pas avec Wine, et aucun outil sur Mac n'y peut rien. Vérifiez sur ",
  { text: "Are We Anti-Cheat Yet?", href: S.aacy.href },
  " avant d'acheter.",
] as const;

export const ui: GuideUi = {
  guides: "Guides",
  download: "Télécharger",
  home: "Accueil Vermut",
  breadcrumbGuide: "Guide",
  downloadLabel: (v) => `Télécharger Vermut ${v} (.dmg)`,
  firstLaunch: "Guide du premier lancement",
  updated: "Mis à jour le 22 octobre 2026 · Apple Silicon · macOS 14+",
  compared: "La comparaison, en toute franchise",
  questions: "Questions fréquentes",
  sources: "Sources, vérifiées le 22 octobre 2026",
  tryTitle: "Essayer Vermut",
  tryBody: "Gratuit et open source. Steam et Epic Games (bêta) sur Wine 11. Mac Apple Silicon, macOS 14 ou ultérieur.",
  moreGuides: "Autres guides",
  allGuides: "Tous les guides",
  readGuide: "Lire le guide",
  hub: {
    metaTitle: "Guides : jouer à des jeux Windows sur un Mac Apple Silicon",
    eyebrow: "Guides",
    h1: "Les jeux Windows sur Mac, expliqués honnêtement.",
    description: "Des guides pratiques et honnêtes pour jouer à des jeux Windows sur un Mac Apple Silicon : Steam et Epic avec Wine, DirectX 12, premier lancement, alternatives à Whisky et solutions sans CrossOver.",
    back: "Retour à Vermut",
  },
};

const guides1: readonly Guide[] = [
  {
    slug: "run-windows-steam-games-on-apple-silicon",
    label: "Jeux Steam Windows sur Mac Apple Silicon",
    metaTitle: "Jouer aux jeux Steam Windows sur un Mac M1, M2, M3 ou M4",
    description:
      "Installez la version Windows de Steam sur un Mac Apple Silicon avec Wine, DXMT et Rosetta 2. Les étapes, ce qui marche, ce qui ne marche pas, et les options gratuites et payantes.",
    h1: "Comment jouer aux jeux Steam Windows sur un Mac Apple Silicon",
    answer: [
      "Installez la version Windows de Steam dans Wine, qui traduit les appels Windows pour macOS. Rosetta 2 exécute le code x86 et une couche comme DXMT convertit DirectX en Metal. Vermut fait toute cette configuration gratuitement : il télécharge Wine, crée une bouteille dédiée à Steam et lance le client Steam officiel. La plupart des jeux DirectX 9 à 11 fonctionnent ; ceux qui ont un anti-triche au niveau du noyau, non.",
    ],
    sections: [
      {
        id: "why",
        title: "Pourquoi Steam pour macOS ne suffit pas",
        body: [
          ["Steam pour macOS n'affiche que les jeux qui ont une version Mac. Une bonne partie d'une bibliothèque Steam est réservée à Windows, et Boot Camp n'existe pas sur les Mac Apple Silicon : il faut donc faire tourner la version Windows autrement."],
          ["Sur un Mac Apple Silicon, trois éléments travaillent ensemble : Rosetta 2 exécute le code x86-64, Wine fournit les API de Windows et une couche graphique convertit DirectX en Metal. Aucun PC complet n'est émulé, d'où des performances parfois très bonnes, mais aussi des jeux qui refusent de se lancer."],
        ],
      },
      {
        id: "steps",
        title: "Installer Steam Windows avec Vermut",
        steps: [
          { title: "Vérifiez votre Mac", body: ["Il faut un Mac Apple Silicon (M1 ou ultérieur), macOS 14 Sonoma ou ultérieur et plusieurs Go d'espace libre pour Wine, Steam et vos jeux. Les Mac Intel ne sont pas pris en charge."] },
          { title: "Téléchargez et ouvrez Vermut", body: ["Téléchargez le DMG sur GitHub et faites glisser Vermut dans Applications. L'app n'est pas encore notarisée, macOS vous demande donc de l'autoriser une fois : suivez le ", { text: "guide du premier lancement", href: FIRST_LAUNCH }, "."] },
          { title: "Laissez Vermut préparer Wine", body: ["Au premier lancement, Vermut propose d'installer Rosetta 2 s'il manque et télécharge son moteur Wine 11, soit environ 1 à 2 Go."] },
          { title: "Installez Steam", body: ["Cliquez sur Install à côté de Steam. Vermut télécharge l'installateur officiel de Steam dans sa propre bouteille et termine la première mise à jour. Connectez-vous ensuite avec votre compte Steam habituel."] },
          { title: "Installez et jouez", body: ["Installez vos jeux depuis le client Steam comme sur un PC. Les jeux installés apparaissent dans la bibliothèque de Vermut."] },
          { title: "Un jeu pose problème ? Changez de moteur graphique", body: ["DXMT est utilisé par défaut pour DirectX 10 et 11. Vous pouvez passer la bouteille sur DXVK, WineD3D ou D3DMetal si vous avez installé le Game Porting Toolkit d'Apple. La bêta v1.2 ajoute des réglages par jeu."] },
        ],
      },
      {
        id: "what-works",
        title: "Ce qui fonctionne sur Apple Silicon, et ce qui ne fonctionne pas",
        bullets: [
          ["Fonctionne généralement : les jeux DirectX 9, 10 et 11, ainsi que les jeux indépendants ou plus anciens, souvent les plus simples."],
          ["Demande un peu plus de préparation : les jeux DirectX 12 ont besoin de D3DMetal, inclus dans le Game Porting Toolkit à télécharger chez Apple. Les jeux qui ont leur propre lanceur peuvent demander quelques essais."],
          ["Ne fonctionne pas : ", ...kernelAntiCheat],
          ["Les performances dépendent du jeu et de la puce. La traduction a un coût : attendez-vous à moins d'images par seconde qu'avec un PC Windows doté d'un GPU comparable, et à quelques saccades pendant la première compilation des shaders."],
        ],
        body: [["Avant d'acheter un jeu, cherchez-le dans la ", { text: "base de compatibilité de CodeWeavers", href: S.cxCompat.href }, " : CrossOver repose sur le même Wine, ses rapports sont donc un bon indicateur."]],
      },
    ],
    compare: {
      caption: "Jouer aux jeux Steam Windows sur un Mac Apple Silicon, octobre 2026",
      columns: ["Solution", "Prix", "Client Steam Windows", "Principale limite"],
      rows: [
        { label: "Vermut", cells: ["Gratuit, licence MIT", "Oui, configuré pour vous", "Projet jeune ; support via les issues GitHub"] },
        { label: "CrossOver", cells: ["74 $ pour 12 mois de mises à jour ; essai de 14 jours", "Oui, depuis son catalogue d'installation", "Payant ; l'option la mieux supportée"] },
        { label: "Whisky", cells: ["Gratuit", "À configurer vous-même", "Archivé en avril 2025, pas de Wine 8 ni ultérieur"] },
        { label: "Parallels Desktop", cells: ["Payant", "Oui, dans Windows 11 pour Arm", "DirectX jusqu'à 11.1 ; la plupart des anti-triche bloqués en VM"] },
        { label: "GeForce NOW", cells: ["Offre gratuite et offres payantes", "Non, diffuse les jeux pris en charge en streaming", "Connexion rapide nécessaire ; uniquement les jeux de son catalogue"] },
      ],
    },
    faq: [
      { q: "Un Mac M1 peut-il faire tourner les jeux Steam Windows ?", a: ["Oui. Tout Mac Apple Silicon sous macOS 14 Sonoma ou ultérieur peut exécuter le client Steam Windows via Wine. Les jeux légers ou anciens tournent mieux sur les puces de base ; les jeux exigeants demandent plus de GPU et de mémoire."] },
      { q: "Faut-il une licence Windows ?", a: ["Non. Wine n'est pas Windows : vous n'installez ni n'achetez Windows. Une licence Windows n'est nécessaire que pour une machine virtuelle comme Parallels."] },
      { q: "Mes sauvegardes et succès Steam fonctionnent-ils ?", a: ["Oui. Vous vous connectez avec votre compte dans le client Steam officiel, donc sauvegardes cloud, succès et bibliothèque fonctionnent comme sur PC."] },
      { q: "Les jeux DirectX 12 fonctionnent-ils ?", a: ["Certains, grâce à D3DMetal d'Apple. La licence d'Apple n'autorise pas les apps à l'intégrer : vous téléchargez vous-même le ", { text: "Game Porting Toolkit", href: S.gptk.href }, " chez Apple et Vermut le détecte."] },
      { q: "Est-ce sans risque pour mon compte Steam ?", a: ["Vermut lance le client Steam officiel et ne voit jamais votre mot de passe. Les jeux dont l'anti-triche refuse Wine ne se lancent pas ou ne se connectent pas en ligne."] },
    ],
    sources: [S.vermut, S.gptk, S.gptkReq, S.cxStore, S.cx26, S.whiskyNotice, S.parallels, S.gfn, S.aacy, S.cxCompat],
  },

  {
    slug: "free-whisky-alternative-mac",
    label: "Alternative gratuite à Whisky sur Mac",
    metaTitle: "Alternative gratuite à Whisky sur Mac (Whisky n'est plus maintenu)",
    description:
      "Whisky a été archivé en avril 2025. Voici les alternatives gratuites et payantes pour jouer à des jeux Windows sur Mac, et comment passer à Vermut.",
    h1: "Une alternative gratuite à Whisky pour votre Mac",
    answer: [
      "Whisky a été archivé le 9 avril 2025 et ne passera pas à Wine 8 ni aux versions suivantes. Si vous cherchez une solution gratuite et maintenue, Vermut est une app open source qui configure pour vous Steam et Epic Games (bêta) sur Wine 11. Si vous avez besoin de la compatibilité la plus large et d'un vrai support, CrossOver est l'option payante que recommande l'auteur de Whisky lui-même.",
    ],
    sections: [
      {
        id: "status",
        title: "Ce qui est arrivé à Whisky",
        body: [
          ["Whisky était une interface gratuite et populaire en SwiftUI pour utiliser Wine sur les Mac Apple Silicon. Son développeur a arrêté le développement actif et archivé le dépôt GitHub le 9 avril 2025. L'avis de maintenance précise que Whisky ne passera pas à Wine 8 ni ultérieur et ne recevra plus de correctifs pour des apps ou des jeux précis, Steam compris."],
          ["Les installations existantes peuvent encore fonctionner un temps, mais plus rien ne sera corrigé, et les jeux récents exigent de plus en plus un Wine récent. Un fork communautaire, ", { text: "frankea/Whisky", href: S.whiskyFork.href }, ", poursuit le développement de façon indépendante."],
        ],
      },
      {
        id: "how-different",
        title: "Ce qui distingue Vermut de Whisky",
        bullets: [
          ["Pensé pour les boutiques de jeux. Whisky vous donnait des bouteilles vides ; Vermut donne à chaque boutique sa propre bouteille, installe le client Steam officiel et gère Epic Games via Legendary (bêta), avec une bibliothèque pour vos jeux installés."],
          ["Un moteur à jour. Vermut télécharge Wine 11, avec DXMT par défaut pour DirectX 10 et 11 sur Metal, et Wine Staging et Wine Devel en solution de repli."],
          ["Le même choix de moteurs graphiques : DXMT, DXVK avec MoltenVK, WineD3D et D3DMetal si vous avez installé le Game Porting Toolkit d'Apple."],
          ["Lancez n'importe quel fichier Windows .exe, .msi ou .bat dans une bouteille quand un jeu n'est pas sur une boutique prise en charge."],
          ["Gratuit et sous licence MIT, sans compte et sans télémétrie."],
        ],
      },
      {
        id: "move",
        title: "Passer de Whisky à Vermut",
        steps: [
          { title: "Notez ce à quoi vous jouez", body: ["Listez vos jeux et les réglages qui fonctionnaient dans Whisky. Steam et Epic conservent votre bibliothèque et vos sauvegardes cloud sur leurs serveurs."] },
          { title: "Sauvegardez vos parties locales", body: ["Certains jeux ne gardent leurs sauvegardes que dans la bouteille Whisky. Copiez-les avant de changer quoi que ce soit. Vermut ne peut pas importer les bouteilles Whisky."] },
          { title: "Installez Vermut", body: ["Téléchargez-le sur GitHub et autorisez-le une fois dans Confidentialité et sécurité, en suivant le ", { text: "guide du premier lancement", href: FIRST_LAUNCH }, "."] },
          { title: "Installez votre boutique", body: ["Installez Steam ou connectez-vous à Epic Games depuis la page Stores. Vermut télécharge Wine et crée la bouteille."] },
          { title: "Réinstallez vos jeux", body: ["Téléchargez à nouveau vos jeux depuis le client de la boutique, puis restaurez vos sauvegardes locales si besoin. Gardez Whisky jusqu'à ce que tout fonctionne, puis supprimez-le."] },
        ],
      },
    ],
    compare: {
      caption: "Whisky et ses alternatives, octobre 2026",
      columns: ["Solution", "Prix", "Maintenu", "Idéal pour"],
      rows: [
        { label: "Vermut", cells: ["Gratuit, MIT", "Oui", "Les jeux Steam et Epic sans configuration"] },
        { label: "Whisky", cells: ["Gratuit, GPL-3.0", "Non, archivé en avril 2025", "Rien de nouveau ; installations existantes seulement"] },
        { label: "Fork communautaire de Whisky", cells: ["Gratuit", "Oui, par un autre développeur", "Les utilisateurs de Whisky qui veulent garder leurs bouteilles"] },
        { label: "CrossOver", cells: ["74 $ pour 12 mois de mises à jour ; 494 $ à vie", "Oui, CrossOver 26 en février 2026", "La compatibilité la plus large et un support commercial"] },
        { label: "Game Porting Toolkit", cells: ["Téléchargement gratuit chez Apple", "Oui, pour les développeurs", "Tester des jeux DirectX 12 ; ce n'est pas un lanceur"] },
      ],
    },
    after: [
      {
        id: "choose",
        title: "Laquelle choisir ?",
        bullets: [
          ["Vous jouiez à des jeux Steam ou Epic dans Whisky et voulez un remplaçant gratuit et maintenu : essayez d'abord Vermut. Cela prend quelques minutes et ne coûte rien."],
          ["Vous avez beaucoup de bouteilles personnalisées que vous ne voulez pas refaire : le fork communautaire sait importer les bouteilles Whisky. Il est maintenu par quelqu'un d'autre, jugez donc ses mises à jour sur pièces."],
          ["Un jeu précis doit absolument fonctionner, ou vous voulez de l'aide en cas de problème : lancez l'essai de 14 jours de CrossOver et achetez-le si ce jeu tourne."],
          ["Vous êtes développeur et testez un portage DirectX 12 : le Game Porting Toolkit d'Apple est fait pour ça."],
        ],
      },
      {
        id: "limits",
        title: "Les limites, honnêtement",
        bullets: [
          [...kernelAntiCheat],
          ["Vermut est jeune et développé par une petite équipe. Il n'a pas de support commercial ; les bugs sont traités via les issues GitHub."],
          ["Aucune interface pour Wine ne rend un jeu plus rapide que le Wine qui tourne derrière. Si un jeu échouait dans Whisky à cause de Wine, testez-le avant de supposer qu'il fonctionnera ailleurs."],
        ],
      },
    ],
    faq: [
      { q: "Whisky est-il abandonné ?", a: ["Le projet d'origine n'est plus maintenu. Son dépôt GitHub a été archivé le 9 avril 2025 et il n'aura pas Wine 8 ni ultérieur. Un fork communautaire existe, géré par une autre personne."] },
      { q: "Puis-je importer mes bouteilles Whisky dans Vermut ?", a: ["Non. Vermut crée sa propre bouteille pour chaque boutique. Sauvegardez vos parties locales, installez la boutique dans Vermut et téléchargez à nouveau vos jeux."] },
      { q: "Vermut est-il vraiment gratuit ?", a: ["Oui. Il est open source sous licence MIT, sans compte, sans version payante et sans télémétrie. Vous pouvez lire le ", { text: "code source", href: links.github }, "."] },
      { q: "Pourquoi l'auteur de Whisky recommande-t-il CrossOver ?", a: ["CodeWeavers, l'entreprise derrière CrossOver, réalise une grande partie du travail sur Wine pour Mac. Ses ventes financent ce travail, sur lequel reposent tous les projets Wine gratuits pour Mac, Vermut compris."] },
      { q: "Vermut fonctionne-t-il sur les Mac Intel ?", a: ["Non. Vermut nécessite un Mac Apple Silicon sous macOS 14 Sonoma ou ultérieur."] },
    ],
    sources: [S.whiskyNotice, S.whiskyRepo, S.whiskyFork, S.cxStore, S.cx26, S.gptk, S.legendary, S.vermut, S.aacy],
  },

  {
    slug: "run-windows-games-on-mac-without-crossover",
    label: "Jeux Windows sur Mac sans CrossOver",
    metaTitle: "Jouer à des jeux Windows sur Mac sans CrossOver, gratuitement",
    description:
      "Les solutions gratuites pour jouer à des jeux Windows sur un Mac Apple Silicon sans CrossOver : Wine avec Vermut, le Game Porting Toolkit d'Apple, les machines virtuelles et le cloud gaming.",
    h1: "Comment jouer à des jeux Windows sur Mac sans CrossOver",
    answer: [
      "Utilisez une interface gratuite pour Wine. Vermut est open source et configure pour vous Wine 11, Steam et Epic Games (bêta) sur n'importe quel Mac Apple Silicon. Pour les jeux que Wine ne sait pas faire tourner, l'autre voie gratuite est le cloud gaming, qui diffuse le jeu en streaming au lieu de l'exécuter sur le Mac. CrossOver reste le choix payant le mieux supporté.",
    ],
    sections: [
      {
        id: "what-crossover-does",
        title: "Ce que fait CrossOver, et ce qu'il faut pour s'en passer",
        body: [
          ["CrossOver est la version commerciale de Wine éditée par CodeWeavers. Il coûte 74 $ pour 12 mois de mises à jour et de support, ou 494 $ pour une licence à vie, et la version achetée continue de fonctionner après la fin du support. Un essai gratuit de 14 jours est proposé."],
          ["Sans lui, il vous faut trois choses : une version de Wine pour macOS, une couche graphique qui traduit DirectX en Metal et un outil qui installe et lance vos boutiques de jeux. On peut tout faire à la main dans le Terminal, mais c'est fastidieux à entretenir. Vermut réunit les trois dans une seule app."],
        ],
      },
      {
        id: "options",
        title: "Vos options gratuites",
        bullets: [
          ["Vermut, gratuit et open source. Il installe Steam et Epic Games (bêta) dans leurs propres bouteilles Wine 11, utilise DXMT par défaut pour DirectX 10 et 11 et vous laisse passer à DXVK, WineD3D ou D3DMetal."],
          ["Le Game Porting Toolkit d'Apple. Gratuit avec un compte développeur Apple, conçu pour que les développeurs évaluent leurs jeux. Il contient D3DMetal, qui fait tourner de nombreux jeux DirectX 12, mais ce n'est pas un lanceur, et les apps n'ont pas le droit de l'intégrer."],
          ["Le cloud gaming, comme GeForce NOW, avec une offre gratuite. Le jeu tourne sur un PC distant, l'anti-triche n'est donc pas un problème, mais il faut une connexion rapide et stable, et le jeu doit figurer au catalogue du service."],
          ["Une machine virtuelle comme Parallels Desktop n'est pas gratuite, et Windows pour Arm en VM ne prend en charge DirectX que jusqu'à 11.1 et bloque la plupart des anti-triche."],
        ],
      },
      {
        id: "steps",
        title: "Jouer gratuitement à un jeu Windows avec Vermut",
        steps: [
          { title: "Vérifiez d'abord le jeu", body: ["Cherchez-le dans la ", { text: "base de compatibilité de CodeWeavers", href: S.cxCompat.href }, " et sur ", { text: "Are We Anti-Cheat Yet?", href: S.aacy.href }, ". S'il exige un anti-triche au niveau du noyau, passez par le cloud gaming."] },
          { title: "Installez Vermut", body: ["Téléchargez le DMG, faites glisser Vermut dans Applications et autorisez-le une fois avec le ", { text: "guide du premier lancement", href: FIRST_LAUNCH }, ". Il faut un Mac Apple Silicon sous macOS 14 ou ultérieur."] },
          { title: "Installez votre boutique", body: ["Installez Steam ou connectez-vous à Epic Games. Vermut télécharge Wine, et Rosetta 2 si nécessaire."] },
          { title: "Pour les jeux DirectX 12, ajoutez D3DMetal", body: ["Téléchargez le Game Porting Toolkit chez Apple. Vermut le détecte et propose D3DMetal comme moteur graphique."] },
          { title: "Pas sur une boutique ? Lancez l'installateur", body: ["Utilisez Run .exe pour lancer n'importe quel installateur Windows dans une bouteille. Les résultats varient davantage qu'avec les jeux des boutiques."] },
        ],
      },
    ],
    compare: {
      caption: "Jouer à des jeux Windows sans CrossOver, octobre 2026",
      columns: ["Solution", "Coût", "DirectX 12", "Jeux avec anti-triche", "Effort"],
      rows: [
        { label: "Vermut", cells: ["Gratuit", "Avec D3DMetal d'Apple", "Niveau noyau : non", "Faible, une seule app"] },
        { label: "Game Porting Toolkit seul", cells: ["Gratuit", "Oui, via D3DMetal", "Niveau noyau : non", "Élevé, Terminal et configuration manuelle"] },
        { label: "GeForce NOW", cells: ["Offre gratuite et offres payantes", "Oui, tourne sur un PC distant", "Oui, pour les jeux pris en charge", "Faible, connexion rapide nécessaire"] },
        { label: "Parallels Desktop", cells: ["Payant, plus Windows", "Non, jusqu'à DirectX 11.1", "La plupart bloqués en VM", "Moyen"] },
        { label: "CrossOver (pour comparaison)", cells: ["74 $ pour un an de mises à jour", "Oui, via D3DMetal", "Niveau noyau : non", "Faible, support commercial"] },
      ],
    },
    after: [
      {
        id: "performance",
        title: "À quoi s'attendre côté performances",
        body: [
          ["Wine n'émule pas un PC, mais Rosetta 2 et la conversion de DirectX vers Metal ajoutent du travail. Un jeu fluide sur un PC Windows milieu de gamme peut demander des réglages plus bas sur une puce M de base. Les premières minutes d'un nouveau jeu saccadent souvent pendant la compilation des shaders ; cela se stabilise en général."],
          ["Si un jeu se lance mais s'affiche mal ou plante, commencez par changer de moteur graphique. La mémoire compte aussi : la configuration requise publiée du Game Porting Toolkit recommande 16 Go, et les gros jeux en profitent quel que soit le moteur."],
        ],
      },
      {
        id: "honest",
        title: "Quand CrossOver vaut encore le coup",
        body: [
          ["Si vous tenez à un jeu précis, voulez pouvoir écrire à quelqu'un quand il ne marche plus ou jouez à des titres que CodeWeavers a corrigés à la main, l'essai de CrossOver mérite d'être tenté avant d'abandonner. L'acheter finance aussi le travail sur Wine dont profitent tous les projets Mac gratuits."],
          ["Vermut est gratuit, mais c'est un projet jeune qui ne promet pas que chaque jeu fonctionnera. Son point fort : un moyen gratuit et rapide d'essayer votre bibliothèque Steam et Epic sur Mac."],
        ],
      },
    ],
    faq: [
      { q: "Existe-t-il une version gratuite de CrossOver ?", a: ["Non : CrossOver propose un essai gratuit de 14 jours, puis une licence payante. Wine, lui, est gratuit, et Vermut est une app gratuite construite dessus."] },
      { q: "Wine est-il un émulateur ?", a: ["Non. Wine réimplémente les API de Windows sur macOS. Sur Apple Silicon, Rosetta 2 traduit le code x86 : aucun PC complet n'est émulé."] },
      { q: "Peut-on jouer avec le Game Porting Toolkit d'Apple ?", a: ["C'est un outil pour développeurs, mais sa couche D3DMetal fait tourner de nombreux jeux DirectX 12. Téléchargez-le chez Apple et Vermut propose D3DMetal comme moteur."] },
      { q: "Et Boot Camp ?", a: ["Boot Camp n'existe que sur les Mac Intel. Les Mac Apple Silicon ne peuvent pas démarrer sous Windows."] },
      { q: "Pourquoi les jeux avec anti-triche ne fonctionnent-ils pas ?", a: ["L'anti-triche au niveau du noyau attend un vrai noyau Windows et bloque Wine et la plupart des machines virtuelles. Sur Mac, seul le cloud gaming permet d'y jouer."] },
    ],
    sources: [S.cxStore, S.cxLicence, S.cx26, S.gptk, S.gptkReq, S.parallels, S.gfn, S.aacy, S.cxCompat, S.vermut],
  },
];

export const guides: readonly Guide[] = [...guides1, ...more];
