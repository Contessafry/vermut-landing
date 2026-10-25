import type { Guide, GuideUi } from "@/lib/guides";
import { S } from "@/lib/guides";
import { guides as more } from "./es-more";
import { links } from "@/site.config";

const FIRST_LAUNCH = "/es#first-launch";

const kernelAntiCheat = [
  "Los juegos con antitrampas a nivel de kernel, como Valorant, Fortnite y Call of Duty, no funcionan con Wine, y ninguna herramienta para Mac puede cambiarlo. Consulta ",
  { text: "Are We Anti-Cheat Yet?", href: S.aacy.href },
  " antes de comprar.",
] as const;

export const ui: GuideUi = {
  guides: "Guías",
  download: "Descargar",
  home: "Inicio de Vermut",
  breadcrumbGuide: "Guía",
  downloadLabel: (v) => `Descargar Vermut ${v} (.dmg)`,
  firstLaunch: "Guía de primer inicio",
  updated: "Actualizada el 22 de octubre de 2026 · Apple Silicon · macOS 14+",
  compared: "La comparación, sin rodeos",
  questions: "Preguntas frecuentes",
  sources: "Fuentes, comprobadas el 22 de octubre de 2026",
  tryTitle: "Prueba Vermut",
  tryBody: "Gratis y de código abierto. Steam y Epic Games (beta) sobre Wine 11. Mac con Apple Silicon y macOS 14 o posterior.",
  moreGuides: "Más guías",
  allGuides: "Todas las guías",
  readGuide: "Leer la guía",
  hub: {
    metaTitle: "Guías: jugar juegos de Windows en Mac con Apple Silicon",
    eyebrow: "Guías",
    h1: "Juegos de Windows en tu Mac, explicados con honestidad.",
    description: "Guías prácticas y honestas para jugar juegos de Windows en Mac con Apple Silicon: Steam y Epic con Wine, DirectX 12, primera apertura, alternativas a Whisky y opciones sin CrossOver.",
    back: "Volver a Vermut",
  },
};

const guides1: readonly Guide[] = [
  {
    slug: "run-windows-steam-games-on-apple-silicon",
    label: "Juegos de Steam para Windows en Mac con Apple Silicon",
    metaTitle: "Cómo jugar juegos de Steam para Windows en un Mac M1, M2, M3 o M4",
    description:
      "Instala la versión de Windows de Steam en un Mac con Apple Silicon usando Wine, DXMT y Rosetta 2. Pasos, qué funciona, qué no y las opciones gratis y de pago.",
    h1: "Cómo jugar juegos de Steam para Windows en un Mac con Apple Silicon",
    answer: [
      "Instala la versión de Windows de Steam dentro de Wine, que traduce las llamadas de Windows a macOS. Rosetta 2 ejecuta el código x86 y una capa como DXMT convierte DirectX en Metal. Vermut hace toda esa configuración gratis: descarga Wine, crea una botella propia para Steam y abre el cliente oficial de Steam. La mayoría de los juegos con DirectX 9 a 11 funcionan; los que tienen antitrampas a nivel de kernel, no.",
    ],
    sections: [
      {
        id: "why",
        title: "Por qué Steam para macOS no basta",
        body: [
          ["Steam para macOS solo muestra los juegos que tienen versión para Mac. Gran parte de una biblioteca de Steam es solo para Windows, y en los Mac con Apple Silicon no existe Boot Camp, así que la versión de Windows tiene que funcionar de otra manera."],
          ["En un Mac con Apple Silicon trabajan juntas tres piezas: Rosetta 2 ejecuta el código x86-64, Wine aporta las API de Windows y una capa gráfica convierte DirectX en Metal. No se emula un PC completo; por eso puede ir rápido, y también por eso algunos juegos fallan."],
        ],
      },
      {
        id: "steps",
        title: "Configurar Steam para Windows con Vermut",
        steps: [
          { title: "Revisa tu Mac", body: ["Necesitas un Mac con Apple Silicon (M1 o posterior), macOS 14 Sonoma o posterior y varios GB libres para Wine, Steam y tus juegos. Los Mac con Intel no son compatibles."] },
          { title: "Descarga y abre Vermut", body: ["Descarga el DMG desde GitHub y arrastra Vermut a Aplicaciones. La app aún no está notarizada, así que macOS te pedirá permitirla una vez: sigue la ", { text: "guía de primer inicio", href: FIRST_LAUNCH }, "."] },
          { title: "Deja que Vermut prepare Wine", body: ["En el primer inicio, Vermut ofrece instalar Rosetta 2 si falta y descarga su motor Wine 11, de unos 1 a 2 GB."] },
          { title: "Instala Steam", body: ["Haz clic en Install junto a Steam. Vermut descarga el instalador oficial de Steam en su propia botella y completa la primera actualización. Después inicia sesión con tu cuenta de Steam de siempre."] },
          { title: "Instala y juega", body: ["Instala los juegos desde el cliente de Steam como en un PC. Los juegos instalados aparecen en la Biblioteca de Vermut."] },
          { title: "Si un juego falla, cambia el backend gráfico", body: ["DXMT es el predeterminado para DirectX 10 y 11. Puedes cambiar la botella a DXVK, WineD3D o D3DMetal si instalaste el Game Porting Toolkit de Apple. La beta v1.2 añade ajustes por juego."] },
        ],
      },
      {
        id: "what-works",
        title: "Qué funciona en Apple Silicon y qué no",
        bullets: [
          ["Suele funcionar: los juegos con DirectX 9, 10 y 11, y los indies o los títulos más antiguos, que suelen ser los más fáciles."],
          ["Necesita pasos extra: los juegos con DirectX 12 necesitan D3DMetal, incluido en el Game Porting Toolkit que descargas de Apple. Los juegos con su propio launcher pueden requerir algo de prueba y error."],
          ["No funciona: ", ...kernelAntiCheat],
          ["El rendimiento depende del juego y del chip. La traducción tiene un coste: espera menos fotogramas por segundo que en un PC con Windows y una GPU parecida, y algunos tirones mientras se compilan los shaders la primera vez."],
        ],
        body: [["Antes de comprar un juego, búscalo en la ", { text: "base de datos de compatibilidad de CodeWeavers", href: S.cxCompat.href }, ": CrossOver usa el mismo Wine, así que sus informes son una buena referencia."]],
      },
    ],
    compare: {
      caption: "Formas de jugar juegos de Steam para Windows en un Mac con Apple Silicon, octubre de 2026",
      columns: ["Opción", "Precio", "Cliente de Steam para Windows", "Principal limitación"],
      rows: [
        { label: "Vermut", cells: ["Gratis, licencia MIT", "Sí, lo configura por ti", "Proyecto joven; soporte mediante issues en GitHub"] },
        { label: "CrossOver", cells: ["74 $ por 12 meses de actualizaciones; prueba de 14 días", "Sí, desde su catálogo de instalación", "De pago; la opción con mejor soporte"] },
        { label: "Whisky", cells: ["Gratis", "Lo configuras tú", "Archivado en abril de 2025, sin Wine 8 ni posteriores"] },
        { label: "Parallels Desktop", cells: ["De pago", "Sí, dentro de Windows 11 para Arm", "DirectX hasta 11.1; la mayoría de antitrampas bloqueados en una VM"] },
        { label: "GeForce NOW", cells: ["Plan gratis y planes de pago", "No, transmite los juegos compatibles", "Necesita buena conexión; solo juegos de su catálogo"] },
      ],
    },
    faq: [
      { q: "¿Un Mac M1 puede ejecutar juegos de Steam para Windows?", a: ["Sí. Cualquier Mac con Apple Silicon y macOS 14 Sonoma o posterior puede usar el cliente de Steam para Windows con Wine. Los juegos ligeros o antiguos van mejor en los chips base; los exigentes necesitan más GPU y memoria."] },
      { q: "¿Necesito una licencia de Windows?", a: ["No. Wine no es Windows, así que no instalas ni compras Windows. Solo necesitas licencia de Windows para una máquina virtual como Parallels."] },
      { q: "¿Funcionan mis partidas guardadas y logros de Steam?", a: ["Sí. Inicias sesión con tu cuenta en el cliente oficial de Steam, así que las partidas en la nube, los logros y tu biblioteca funcionan como en un PC."] },
      { q: "¿Funcionan los juegos con DirectX 12?", a: ["Algunos, con D3DMetal de Apple. La licencia de Apple no permite que las apps lo incluyan, así que descargas tú el ", { text: "Game Porting Toolkit", href: S.gptk.href }, " de Apple y Vermut lo detecta."] },
      { q: "¿Es seguro para mi cuenta de Steam?", a: ["Vermut abre el cliente oficial de Steam y nunca ve tu contraseña. Los juegos cuyo antitrampas rechaza Wine no arrancan o no se conectan en línea."] },
    ],
    sources: [S.vermut, S.gptk, S.gptkReq, S.cxStore, S.cx26, S.whiskyNotice, S.parallels, S.gfn, S.aacy, S.cxCompat],
  },

  {
    slug: "free-whisky-alternative-mac",
    label: "Alternativa gratis a Whisky para Mac",
    metaTitle: "Alternativa gratis a Whisky para Mac (Whisky ya no se mantiene)",
    description:
      "Whisky se archivó en abril de 2025. Estas son las alternativas gratis y de pago para jugar juegos de Windows en Mac, y cómo pasarte a Vermut.",
    h1: "Una alternativa gratis a Whisky para tu Mac",
    answer: [
      "Whisky se archivó el 9 de abril de 2025 y no pasará a Wine 8 ni a versiones posteriores. Si quieres algo gratis y mantenido, Vermut es una app de código abierto que configura por ti Steam y Epic Games (beta) sobre Wine 11. Si necesitas la compatibilidad más amplia y soporte de verdad, CrossOver es la opción de pago que recomienda el propio autor de Whisky.",
    ],
    sections: [
      {
        id: "status",
        title: "Qué pasó con Whisky",
        body: [
          ["Whisky era una popular interfaz gratuita en SwiftUI para usar Wine en Mac con Apple Silicon. Su desarrollador dejó el desarrollo activo y archivó el repositorio de GitHub el 9 de abril de 2025. El aviso de mantenimiento dice que Whisky no pasará a Wine 8 ni posteriores y no recibirá arreglos para apps o juegos concretos, Steam incluido."],
          ["Las instalaciones existentes pueden seguir funcionando un tiempo, pero no se arreglará nada más, y los juegos nuevos necesitan cada vez más un Wine reciente. Un fork de la comunidad, ", { text: "frankea/Whisky", href: S.whiskyFork.href }, ", sigue el desarrollo de forma independiente."],
        ],
      },
      {
        id: "how-different",
        title: "En qué se diferencia Vermut de Whisky",
        bullets: [
          ["Pensado para las tiendas de juegos. Whisky te daba botellas vacías; Vermut da a cada tienda su propia botella, instala el cliente oficial de Steam y gestiona Epic Games con Legendary (beta), con una Biblioteca para tus juegos instalados."],
          ["Un motor actual. Vermut descarga Wine 11, con DXMT por defecto para DirectX 10 y 11 sobre Metal, y Wine Staging y Wine Devel como alternativas."],
          ["La misma variedad de backends gráficos: DXMT, DXVK con MoltenVK, WineD3D y D3DMetal si instalaste el Game Porting Toolkit de Apple."],
          ["Ejecuta cualquier .exe, .msi o .bat de Windows dentro de una botella cuando un juego no está en una tienda compatible."],
          ["Gratis y con licencia MIT, sin cuenta y sin telemetría."],
        ],
      },
      {
        id: "move",
        title: "Pasar de Whisky a Vermut",
        steps: [
          { title: "Apunta a qué juegas", body: ["Haz una lista de tus juegos y de los ajustes que funcionaban en Whisky. Steam y Epic guardan tu biblioteca y tus partidas en la nube en sus servidores."] },
          { title: "Haz copia de las partidas locales", body: ["Algunos juegos guardan las partidas solo dentro de la botella de Whisky. Cópialas antes de cambiar nada. Vermut no puede importar botellas de Whisky."] },
          { title: "Instala Vermut", body: ["Descárgalo desde GitHub y permítelo una vez en Privacidad y seguridad, siguiendo la ", { text: "guía de primer inicio", href: FIRST_LAUNCH }, "."] },
          { title: "Instala tu tienda", body: ["Instala Steam, o inicia sesión en Epic Games, desde la página Stores. Vermut descarga Wine y crea la botella."] },
          { title: "Reinstala tus juegos", body: ["Vuelve a descargar los juegos desde el cliente de la tienda y, si hace falta, restaura las partidas locales. Conserva Whisky hasta que todo funcione y luego elimínalo."] },
        ],
      },
    ],
    compare: {
      caption: "Whisky y sus alternativas, octubre de 2026",
      columns: ["Opción", "Precio", "Mantenido", "Ideal para"],
      rows: [
        { label: "Vermut", cells: ["Gratis, MIT", "Sí", "Juegos de Steam y Epic sin configurar nada"] },
        { label: "Whisky", cells: ["Gratis, GPL-3.0", "No, archivado en abril de 2025", "Nada nuevo; solo instalaciones existentes"] },
        { label: "Fork de la comunidad de Whisky", cells: ["Gratis", "Sí, por otro desarrollador", "Usuarios de Whisky que quieren conservar sus botellas"] },
        { label: "CrossOver", cells: ["74 $ por 12 meses de actualizaciones; 494 $ de por vida", "Sí, CrossOver 26 en febrero de 2026", "La compatibilidad más amplia y soporte comercial"] },
        { label: "Game Porting Toolkit", cells: ["Descarga gratis de Apple", "Sí, para desarrolladores", "Probar juegos con DirectX 12; no es un launcher"] },
      ],
    },
    after: [
      {
        id: "choose",
        title: "¿Cuál elegir?",
        bullets: [
          ["Jugabas juegos de Steam o Epic en Whisky y quieres un sustituto gratis y mantenido: prueba primero Vermut. Son unos minutos y no cuesta nada."],
          ["Tienes muchas botellas personalizadas que no quieres rehacer: el fork de la comunidad importa botellas de Whisky. Lo mantiene otra persona, así que valora sus actualizaciones por sí mismas."],
          ["Necesitas que un juego concreto funcione, o quieres ayuda cuando no va: activa la prueba de 14 días de CrossOver y cómpralo si ese juego funciona."],
          ["Eres desarrollador y estás probando un port con DirectX 12: el Game Porting Toolkit de Apple es la herramienta pensada para eso."],
        ],
      },
      {
        id: "limits",
        title: "Los límites, con honestidad",
        bullets: [
          [...kernelAntiCheat],
          ["Vermut es joven y lo desarrolla un equipo pequeño. No tiene soporte comercial; los errores se gestionan con issues en GitHub."],
          ["Ninguna interfaz de Wine hace un juego más rápido que el Wine que tiene debajo. Si un juego fallaba en Whisky por culpa de Wine, pruébalo antes de dar por hecho que funcionará en otro sitio."],
        ],
      },
    ],
    faq: [
      { q: "¿Whisky está muerto?", a: ["El proyecto original ya no se mantiene. Su repositorio de GitHub se archivó el 9 de abril de 2025 y no tendrá Wine 8 ni posteriores. Existe un fork de la comunidad, a cargo de otra persona."] },
      { q: "¿Puedo importar mis botellas de Whisky en Vermut?", a: ["No. Vermut crea su propia botella para cada tienda. Haz copia de tus partidas locales, instala la tienda en Vermut y vuelve a descargar tus juegos."] },
      { q: "¿Vermut es gratis de verdad?", a: ["Sí. Es de código abierto con licencia MIT, sin cuenta, sin versión de pago y sin telemetría. Puedes leer el ", { text: "código fuente", href: links.github }, "."] },
      { q: "¿Por qué el autor de Whisky recomienda CrossOver?", a: ["CodeWeavers, la empresa detrás de CrossOver, hace buena parte del trabajo de Wine para Mac. Sus ventas lo financian, y todos los proyectos gratuitos de Wine para Mac, Vermut incluido, se basan en ese trabajo."] },
      { q: "¿Vermut funciona en Mac con Intel?", a: ["No. Vermut necesita un Mac con Apple Silicon y macOS 14 Sonoma o posterior."] },
    ],
    sources: [S.whiskyNotice, S.whiskyRepo, S.whiskyFork, S.cxStore, S.cx26, S.gptk, S.legendary, S.vermut, S.aacy],
  },

  {
    slug: "run-windows-games-on-mac-without-crossover",
    label: "Juegos de Windows en Mac sin CrossOver",
    metaTitle: "Cómo jugar juegos de Windows en Mac sin CrossOver, gratis",
    description:
      "Formas gratis de jugar juegos de Windows en un Mac con Apple Silicon sin CrossOver: Wine con Vermut, el Game Porting Toolkit de Apple, máquinas virtuales y juego en la nube.",
    h1: "Cómo jugar juegos de Windows en Mac sin CrossOver",
    answer: [
      "Usa una interfaz gratuita para Wine. Vermut es de código abierto y configura por ti Wine 11, Steam y Epic Games (beta) en cualquier Mac con Apple Silicon. Para los juegos que Wine no puede ejecutar, la otra vía gratis es el juego en la nube, que transmite el juego en vez de ejecutarlo en el Mac. CrossOver sigue siendo la opción de pago con mejor soporte.",
    ],
    sections: [
      {
        id: "what-crossover-does",
        title: "Qué hace CrossOver y qué necesitas para prescindir de él",
        body: [
          ["CrossOver es la versión comercial de Wine de CodeWeavers. Cuesta 74 $ por 12 meses de actualizaciones y soporte, o 494 $ por una licencia de por vida, y la versión que compraste sigue funcionando cuando termina el soporte. Hay una prueba gratis de 14 días."],
          ["Sin él necesitas tres cosas: una versión de Wine para macOS, una capa gráfica que traduzca DirectX a Metal y algo que instale y abra tus tiendas de juegos. Hacerlo a mano en el Terminal es posible, pero cuesta mantenerlo. Vermut reúne las tres en una sola app."],
        ],
      },
      {
        id: "options",
        title: "Tus opciones gratis",
        bullets: [
          ["Vermut, gratis y de código abierto. Instala Steam y Epic Games (beta) en sus propias botellas de Wine 11, usa DXMT por defecto para DirectX 10 y 11 y te deja cambiar a DXVK, WineD3D o D3DMetal."],
          ["El Game Porting Toolkit de Apple. Gratis con una cuenta de desarrollador de Apple, pensado para que los desarrolladores evalúen sus juegos. Incluye D3DMetal, que ejecuta muchos juegos con DirectX 12, pero no es un launcher y las apps no pueden incluirlo."],
          ["El juego en la nube, como GeForce NOW, con plan gratis. El juego se ejecuta en un PC remoto, así que el antitrampas no es problema, pero necesitas una conexión rápida y estable, y el juego tiene que estar en el catálogo del servicio."],
          ["Una máquina virtual como Parallels Desktop no es gratis, y Windows para Arm en una VM solo admite DirectX hasta 11.1 y bloquea la mayoría de antitrampas."],
        ],
      },
      {
        id: "steps",
        title: "Jugar gratis a un juego de Windows con Vermut",
        steps: [
          { title: "Revisa primero el juego", body: ["Búscalo en la ", { text: "base de datos de compatibilidad de CodeWeavers", href: S.cxCompat.href }, " y en ", { text: "Are We Anti-Cheat Yet?", href: S.aacy.href }, ". Si necesita antitrampas a nivel de kernel, usa el juego en la nube."] },
          { title: "Instala Vermut", body: ["Descarga el DMG, arrastra Vermut a Aplicaciones y permítelo una vez con la ", { text: "guía de primer inicio", href: FIRST_LAUNCH }, ". Necesitas un Mac con Apple Silicon y macOS 14 o posterior."] },
          { title: "Instala tu tienda", body: ["Instala Steam o inicia sesión en Epic Games. Vermut descarga Wine y, si hace falta, Rosetta 2."] },
          { title: "Para juegos con DirectX 12, añade D3DMetal", body: ["Descarga el Game Porting Toolkit de Apple. Vermut lo detecta y ofrece D3DMetal como backend gráfico."] },
          { title: "¿No está en una tienda? Ejecuta el instalador", body: ["Usa Run .exe para abrir cualquier instalador de Windows dentro de una botella. Aquí los resultados varían más que con los juegos de las tiendas."] },
        ],
      },
    ],
    compare: {
      caption: "Jugar juegos de Windows sin CrossOver, octubre de 2026",
      columns: ["Opción", "Coste", "DirectX 12", "Juegos con antitrampas", "Esfuerzo"],
      rows: [
        { label: "Vermut", cells: ["Gratis", "Con D3DMetal de Apple", "A nivel de kernel: no", "Bajo, una sola app"] },
        { label: "Solo Game Porting Toolkit", cells: ["Gratis", "Sí, con D3DMetal", "A nivel de kernel: no", "Alto, Terminal y configuración manual"] },
        { label: "GeForce NOW", cells: ["Plan gratis y planes de pago", "Sí, se ejecuta en un PC remoto", "Sí, en juegos compatibles", "Bajo, necesita internet rápido"] },
        { label: "Parallels Desktop", cells: ["De pago, más Windows", "No, hasta DirectX 11.1", "La mayoría bloqueados en una VM", "Medio"] },
        { label: "CrossOver (como referencia)", cells: ["74 $ por un año de actualizaciones", "Sí, con D3DMetal", "A nivel de kernel: no", "Bajo, soporte comercial"] },
      ],
    },
    after: [
      {
        id: "performance",
        title: "Qué esperar del rendimiento",
        body: [
          ["Wine no emula un PC, pero Rosetta 2 y la conversión de DirectX a Metal añaden trabajo. Un juego fluido en un PC con Windows de gama media puede necesitar ajustes más bajos en un chip M base. Los primeros minutos de un juego nuevo suelen dar tirones mientras se compilan los shaders; normalmente se estabiliza."],
          ["Si un juego arranca pero se ve mal o se cierra, lo primero es cambiar de backend gráfico. La memoria también cuenta: los requisitos publicados del Game Porting Toolkit recomiendan 16 GB, y los juegos grandes lo agradecen con cualquier backend."],
        ],
      },
      {
        id: "honest",
        title: "Cuándo sigue valiendo la pena CrossOver",
        body: [
          ["Si dependes de un juego concreto, quieres a alguien a quien escribir cuando falle o juegas títulos que CodeWeavers ha arreglado a mano, vale la pena probar CrossOver antes de rendirte. Comprarlo también financia el trabajo de Wine que usan todos los proyectos gratuitos para Mac."],
          ["Vermut es gratis, pero es un proyecto joven y no promete que funcionen todos los juegos. Su punto fuerte es una forma gratis y rápida de probar tu biblioteca de Steam y Epic en el Mac."],
        ],
      },
    ],
    faq: [
      { q: "¿Hay una versión gratis de CrossOver?", a: ["No: CrossOver tiene una prueba gratis de 14 días y luego una licencia de pago. Wine sí es gratis, y Vermut es una app gratis basada en él."] },
      { q: "¿Wine es un emulador?", a: ["No. Wine reimplementa las API de Windows en macOS. En Apple Silicon, Rosetta 2 traduce el código x86, así que no se emula un PC completo."] },
      { q: "¿Puedo usar el Game Porting Toolkit de Apple para jugar?", a: ["Es una herramienta para desarrolladores, pero su capa D3DMetal ejecuta muchos juegos con DirectX 12. Descárgalo de Apple y Vermut ofrece D3DMetal como backend."] },
      { q: "¿Y Boot Camp?", a: ["Boot Camp solo existe en los Mac con Intel. Los Mac con Apple Silicon no pueden arrancar Windows."] },
      { q: "¿Por qué no funcionan los juegos con antitrampas?", a: ["El antitrampas a nivel de kernel espera un kernel de Windows real y bloquea Wine y la mayoría de máquinas virtuales. En Mac, la única forma de jugarlos es el juego en la nube."] },
    ],
    sources: [S.cxStore, S.cxLicence, S.cx26, S.gptk, S.gptkReq, S.parallels, S.gfn, S.aacy, S.cxCompat, S.vermut],
  },
];

export const guides: readonly Guide[] = [...guides1, ...more];
