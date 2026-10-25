/**
 * Español (neutral, tuteo). Machine-assisted, needs native review (see docs/I18N.md).
 * macOS labels from Apple's Spanish (es-es) support page mh40616.
 */
import { links, site } from "@/site.config";
import { build } from "../build";

const macos = "macOS 14 Sonoma o posterior";

export const es = build({
  locale: "es",
  seo: {
    title: "Vermut: juegos de Windows en tu Mac con Steam y Epic",
    description:
      "Lanzador gratuito y de código abierto para Mac con Apple Silicon. Vermut instala Steam, añade Epic Games (beta), configura Wine y abre tus juegos de Windows.",
    keywords: ["juegos de Windows en Mac", "Steam Mac Apple Silicon", "Epic Games Mac", "Wine macOS", "alternativa a Whisky", "alternativa a CrossOver", "lanzador de juegos gratis código abierto Mac", "Vermut"],
  },
  nav: ["Cómo funciona", "Compatibilidad", "Comparativa", "Apoyar", "Preguntas", "Descargar"],
  hero: {
    eyebrow: "Gratis · Código abierto · Apple Silicon",
    lead: "Vermut instala Steam en tu Mac, añade tu biblioteca de Epic Games (beta) y configura Wine para cada uno, para que tus juegos de Windows se abran con un clic.",
    primary: "Descargar para Mac",
    secondary: "Dar una estrella en GitHub",
    meta: [macos, "Apple Silicon", `Licencia ${site.license}`],
    screenshotAlt:
      "La Library de Vermut: un juego de Steam marcado como Ready, con un botón Play. La barra lateral muestra Stores, Library, Downloads y una botella para Steam, Epic Games y GOG Galaxy.",
  },
  howItWorks: {
    eyebrow: "Cómo funciona",
    title: "Tres pasos. Sin Terminal.",
    lead: "Sin botellas que configurar, sin versiones de Wine que elegir, sin línea de comandos. Cada vídeo de abajo es la app real.",
    steps: [
      {
        title: "Elige una tienda",
        body: "Elige Steam o Epic Games (beta); GOG Galaxy llegará pronto. Steam se instala con su instalador oficial; Epic usa el cliente de código abierto Legendary, sin el launcher de Epic. Cada tienda tiene su propia botella, así no se estorban.",
        description: "Grabación de pantalla: la pantalla Stores muestra Steam, Epic Games (beta) y GOG Galaxy, cada uno en su botella. El puntero recorre las tiendas y hace clic en Open Steam.",
      },
      {
        title: "Vermut configura Wine",
        body: "Cada botella recibe Wine 11 y una capa gráfica: DXMT por defecto, con DXVK, WineD3D y D3DMetal disponibles. Puedes cambiarla después, pero no hace falta.",
        description: "Grabación de pantalla: el puntero abre la botella de Steam desde la barra lateral, pasa a la pestaña Graphics y señala el backend seleccionado, DXMT.",
      },
      {
        title: "Juega",
        body: "Inicia sesión en tu tienda como siempre e instala juegos. Aparecen en la Library, y Play abre cada uno en la botella correcta.",
        description: "Grabación de pantalla: el puntero abre la Library, donde un juego de Steam aparece como Ready, y hace clic en Play en la barra Continue.",
      },
    ],
  },
  compatibility: {
    eyebrow: "Compatibilidad, sin rodeos",
    title: "Qué funciona y qué no.",
    lead: "Vermut ejecuta juegos de Windows con Wine. Muchos van bien y algunos no irán nunca. Preferimos decírtelo ahora y no después de una descarga de 60 GB.",
    groups: [
      {
        title: "Suele funcionar",
        items: [
          ["Juegos DirectX 9, 10 y 11, traducidos a Metal por DXMT o DXVK."],
          ["Títulos indie y más antiguos, que suelen ser los más fáciles."],
          ["El propio cliente de Steam, además de tu biblioteca de Epic Games con Legendary (beta). GOG Galaxy llegará pronto."],
        ],
      },
      {
        title: "Requiere algo de configuración",
        items: [
          ["Los juegos DirectX 12 necesitan el ", { text: "Game Porting Toolkit", href: "https://developer.apple.com/games/game-porting-toolkit/" }, " de Apple (D3DMetal). Vermut lo detecta si lo instalas, pero nunca lo incluye."],
          ["Los juegos con su propio launcher, como la app de EA o Ubisoft Connect, pueden necesitar Run .exe dentro de una botella y algo de prueba y error."],
        ],
      },
      {
        title: "No funciona",
        items: [
          ["Juegos con antitrampas a nivel de kernel, como Valorant, Fortnite y Call of Duty. El antitrampas bloquea Wine y desde el Mac no se puede hacer nada."],
          ["Todo lo que necesite un controlador de Windows, como algunas herramientas de periféricos o DRM."],
        ],
      },
    ],
    footnote: [
      "Antes de comprar un juego, consulta ",
      { text: "Are We Anti-Cheat Yet?", href: "https://areweanticheatyet.com/" },
      " para ver el estado del antitrampas y la ",
      { text: "base de compatibilidad de CodeWeavers", href: "https://www.codeweavers.com/compatibility" },
      " para informes de Wine en Mac.",
    ],
  },
  comparison: {
    eyebrow: "Comparativa",
    title: "Dónde encaja Vermut.",
    lead: "Hay buenas formas de jugar a juegos de Windows en un Mac. Así se diferencian, a octubre de 2026.",
    rows: [
      { label: "Precio", cells: [["Gratis"], ["Gratis"], ["Desde 74 $", "12 meses de actualizaciones; prueba gratis de 14 días [3][4]"], ["Gratis"]] },
      { label: "Código abierto", cells: [["Sí, MIT"], ["Sí, GPL-3.0 [2]"], ["No", "Basado en Wine (LGPL)"], ["Sí, GPL-3.0 [6]"]] },
      { label: "Mantenido", cells: [["Sí"], ["No", "Archivado el 9 de abril de 2025; sigue un fork de la comunidad [1][2]"], ["Sí", "CrossOver 26, febrero de 2026 [5]"], ["Sí", "v2.22.4, 15 de octubre de 2026 [7]"]] },
      {
        label: "Configura Steam y Epic por ti",
        cells: [
          ["Sí", "Steam en su propia botella; Epic (beta) con Legendary, sin launcher de Epic; GOG pronto"],
          ["No", "Creas una botella y ejecutas cada instalador"],
          ["Sí", "Desde su catálogo de instalación; Epic y GOG desde CrossOver 25 [9][10]"],
          ["Epic, GOG, Amazon", "Launcher propio; sin cliente de Steam [6]"],
        ],
      },
      {
        label: "Motor Wine",
        cells: [
          ["Incluido", "Wine 11 con DXMT y DXVK; D3DMetal si lo instalas"],
          ["Incluido, congelado", "Sin actualización a Wine 8+ [1]"],
          ["Incluido", "Compilación propia de CodeWeavers"],
          ["Tú eliges", "Descarga Wine, compilaciones GPTK o usa CrossOver [8]"],
        ],
      },
      { label: "Funciona sin Terminal", cells: [["Sí"], ["Sí"], ["Sí"], ["Sí"]] },
      { label: "Soporte", cells: [["Issues de GitHub"], ["Ninguno"], ["Correo y teléfono", "Mientras la licencia esté activa [3]"], ["Comunidad", "GitHub y Discord"]] },
    ],
    aside: ["¿Necesitas soporte comercial o la mayor cobertura? Compra CrossOver. CodeWeavers es uno de los mayores contribuidores de Wine, y todos los proyectos de Wine para Mac, Vermut incluido, se apoyan en ese trabajo."],
    sourcesTitle: "Fuentes, comprobadas el 19 de octubre de 2026",
  },
  support: {
    eyebrow: "Apoya a Vermut",
    title: "Gratis, y así seguirá.",
    lead: "Vermut se hace en el tiempo libre. Las donaciones pagan ese tiempo y los Mac y juegos con los que probamos. No habrá versión de pago en ningún caso.",
    donateLabel: "Donar con PayPal",
    donateNote: "PayPal se abre en una pestaña nueva.",
    otherTitle: "¿No es cuestión de dinero? Esto ayuda igual.",
    options: [
      { title: "Una estrella en GitHub", body: "Las estrellas ayudan a otros jugadores de Mac a encontrar el proyecto.", label: "Dar una estrella al repositorio" },
      { title: "Informar de un error", body: "¿Algo falla? Un issue con tu versión de macOS y los registros nos ayuda a arreglarlo.", label: "Abrir un informe de error" },
      { title: "Cuéntanos qué juegos funcionan", body: "¿Has probado algo? Indica el juego, la tienda y el backend gráfico, funcione o no.", label: "Enviar un informe de juego" },
    ],
    share: { title: "Comparte Vermut", body: "¿Conoces a alguien que juegue en Mac? Mándale el enlace.", text: "Vermut: juegos de Windows en tu Mac con Steam y Epic. Gratis y de código abierto." },
  },
  faq: {
    eyebrow: "Preguntas frecuentes",
    title: "Preguntas y respuestas.",
    items: [
      { q: "¿Vermut es gratis de verdad?", a: [`Sí. Es de código abierto con licencia ${site.license}: sin cuenta, sin versión de pago, sin telemetría.`] },
      { q: "¿Funciona en Mac con Intel?", a: ["No. Vermut está hecho para Apple Silicon: M1 y todos los chips posteriores."] },
      { q: "¿Qué versión de macOS necesito?", a: [`${macos}.`] },
      { q: "¿Funcionará mi juego?", a: ["Depende del juego. La mayoría de títulos DirectX 9 a 11 sí; los que usan antitrampas de kernel, no. Tienes todos los detalles en la sección de ", { text: "compatibilidad", href: "#compatibility" }, "."] },
      { q: "¿Vermut ve mi contraseña de Steam o Epic?", a: ["No. En Steam inicias sesión dentro de la app oficial de Steam, que se ejecuta en su botella. En Epic (beta) inicias sesión en la página de Epic y Legendary guarda la sesión en tu Mac."] },
      { q: "¿Vermut instala el Epic Games Launcher?", a: ["No. El soporte de Epic está en beta y usa ", { text: "Legendary", href: "https://github.com/derrod/legendary" }, ", un cliente de Epic de código abierto: inicia sesión, ve tu biblioteca, instala y abre juegos sin el Epic Games Launcher."] },
      { q: "¿Incluye el Game Porting Toolkit de Apple?", a: ["No, Vermut nunca lo incluye. Si lo instalas tú, Vermut lo detecta y ofrece D3DMetal como opción gráfica."] },
      {
        q: "¿Por qué macOS muestra un aviso?",
        a: [
          "Vermut es gratis y de código abierto, y no está firmado con un Apple Developer ID de pago ni notarizado por Apple, así que Gatekeeper no puede avalarlo. Lo permites una vez en Ajustes del Sistema › Privacidad y seguridad (consulta ",
          { text: "los pasos para la primera apertura", href: "#download" },
          "). Puedes leer el ",
          { text: "código fuente", href: links.github },
          " y comparar el SHA-256 del DMG con el que aparece en esta página.",
        ],
      },
      { q: "¿Necesito Terminal o Homebrew?", a: ["No. Todo se hace desde la app, desde instalar una tienda hasta abrir un juego."] },
      { q: "¿En qué se diferencia de Whisky?", a: ["Whisky era una interfaz genérica para Wine y ya no se mantiene. Vermut gira en torno a las tiendas de juegos: una botella por tienda, configurada por ti, y una Library para todo lo que instalas."] },
      { q: "¿Cómo lo desinstalo?", a: ["Elimina cada botella desde su sección Danger zone en Vermut (eso quita la tienda y sus juegos) y luego arrastra Vermut a la papelera."] },
    ],
    requirements: {
      title: "Requisitos",
      items: [
        { label: "Mac", value: "Apple Silicon (M1 o posterior)" },
        { label: "macOS", value: "14 Sonoma o posterior" },
        { label: "Disco", value: "10 GB libres, más espacio para tus juegos" },
        { label: "Rosetta 2", value: "Se instala por ti si falta" },
        { label: "Internet", value: "Para descargar tiendas y juegos" },
      ],
    },
  },
  download: {
    eyebrow: "Descarga",
    title: "Descarga Vermut para tu Mac.",
    lead: "Un único DMG, directo de la última versión en GitHub. Gratis y sin cuenta.",
    primaryLabel: (version) => `Descargar Vermut ${version} (.dmg)`,
    shaLabel: "SHA-256",
    allReleases: "Todas las versiones y notas",
    brewLabel: "O instálalo con Homebrew",
    installTitle: "Instalado en un minuto",
    steps: (dmgName) => [
      `Abre ${dmgName} desde tu carpeta Descargas.`,
      "Arrastra Vermut a la carpeta Aplicaciones.",
      "Abre Vermut desde Aplicaciones. Si a tu Mac le falta Rosetta 2, Vermut la instala por ti.",
    ],
    gatekeeper: {
      firstLaunch: "En la primera apertura, abre Ajustes del Sistema > Privacidad y seguridad, haz clic en “Abrir igualmente” y confirma con Touch ID o tu contraseña.",
      firstLaunchLink: "Cómo hacerlo",
      title: "Primera apertura: permite Vermut una vez",
      why: "macOS te avisa porque Vermut es una app gratuita y de código abierto que no está firmada con un Apple Developer ID de pago. Puedes leer cada línea del ",
      whySource: "código fuente",
      whyAnd: " y verificar la descarga con su ",
      whySha: "SHA-256",
      whyEnd: ".",
      steps: [
        { title: "Abre Vermut y haz clic en Aceptar", body: "Haz doble clic en Vermut en Aplicaciones. macOS muestra un aviso de que “Vermut” no se ha abierto. Haz clic en Aceptar, no en Trasladar a la papelera." },
        { title: "Haz clic en Abrir igualmente en Privacidad y seguridad", body: "Selecciona menú Apple › Ajustes del Sistema › Privacidad y seguridad, desplázate hasta Seguridad y haz clic en Abrir igualmente junto al mensaje sobre Vermut. El botón está disponible durante una hora aproximadamente después del paso 1." },
        { title: "Vuelve a hacer clic en Abrir igualmente", body: "Aparece un cuadro de confirmación: haz clic en Abrir igualmente." },
        { title: "Confirma con Touch ID o tu contraseña", body: "macOS puede pedirte Touch ID o la contraseña del Mac. Es normal: solo confirma. macOS recuerda la decisión, así que solo lo haces una vez." },
      ],
      note: "Así funciona en macOS 15 Sequoia y posterior, donde Control + clic › Abrir ya no omite la comprobación. En macOS 14 Sonoma, Control + clic › Abrir sigue funcionando.",
      appleLabel: "Soporte de Apple: Abrir una app para Mac de un desarrollador desconocido",
      appleHref: "https://support.apple.com/es-es/guide/mac-help/mh40616/mac",
      illustrationNote: "Ilustraciones simplificadas, no capturas de pantalla.",
    },
    terminal: {
      title: "¿Prefieres Terminal? Instalación con un solo comando (sin el aviso de Gatekeeper)",
      body: "El script descarga el último DMG y copia Vermut en Aplicaciones. Léelo antes de ejecutarlo.",
      sourceLabel: "Ver el código de install.sh",
    },
  },
  footer: {
    statement: "Gratis y de código abierto. Sin cuenta, sin telemetría, sin versión de pago.",
    cta: "Descargar para Mac",
    columns: [
      { title: "Proyecto", links: ["GitHub", "Versiones", `Licencia ${site.license}`, "Kit de marca (.zip)"] },
      { title: "Colabora", links: ["Apoya a Vermut", "Guía para colaborar", "Informar de un error", "Issues abiertos"] },
    ],
    legal: "Vermut no está afiliado a Valve, Epic Games, GOG, CodeWeavers ni Apple. Steam, Epic Games Store, GOG Galaxy y otros nombres son marcas de sus respectivos propietarios.",
  },
  ui: {
    skipToContent: "Ir al contenido",
    primaryNav: "Navegación principal",
    backToTop: "Vermut, volver arriba",
    releaseDetails: "Detalles de la versión",
    stepPrefix: (n) => `Paso ${n}: `,
    videoLabel: (title) => `${title}: grabación de pantalla de Vermut`,
    play: (label) => `Reproducir: ${label}`,
    pause: (label) => `Pausar: ${label}`,
    compareCaption: "Vermut frente a Whisky, CrossOver y Heroic. Los números entre corchetes remiten a las fuentes bajo la tabla.",
    feature: "Característica",
    copied: "Copiado",
    copySha: (file) => `Copiar el SHA-256 de ${file}`,
    copyInstall: "Copiar el comando de instalación",
    copyLink: "Copiar el enlace a Vermut",
    opensNewTab: " (se abre en una pestaña nueva)",
    shareNewTab: " (compartir, se abre en una pestaña nueva)",
    language: "Idioma",
    macosRequirement: macos,
    appleSilicon: "Apple Silicon (M1 o posterior)",
    facts: { version: "Versión", size: "Tamaño", macos: "macOS", mac: "Mac", licence: "Licencia" },
    version: (v) => `Versión ${v}`,
    latest: "Última",
    releaseNotes: (v) => `Notas de la versión ${v} de Vermut`,
    licence: (l) => `Licencia ${l}`,
  },
  illustrations: {
    note: "Ilustraciones simplificadas, no capturas de pantalla.",
    dialog: {
      aria: "Ilustración del aviso de macOS que indica que Vermut no se ha abierto, con los botones Aceptar y Trasladar a la papelera. Haz clic en Aceptar.",
      title: "“Vermut” no se ha abierto",
      body: "Apple no ha podido verificar que “Vermut” no contenga software malicioso que pueda dañar el Mac o comprometer tu privacidad.",
      trash: "Trasladar a la papelera",
      done: "Aceptar",
    },
    settings: {
      aria: "Ilustración de Ajustes del Sistema, Privacidad y seguridad, sección Seguridad: el mensaje de que Vermut se ha bloqueado, con el botón Abrir igualmente.",
      window: "Privacidad y seguridad",
      section: "Seguridad",
      allow: "Permitir apps de App Store y desarrolladores identificados",
      blocked: "“Vermut” se ha bloqueado para proteger tu Mac.",
      button: "Abrir igualmente",
    },
  },
  notFound: {
    metaTitle: "Página no encontrada",
    title: "Aquí no hay nada que servir.",
    body: "La página que buscabas no existe. Vermut te espera en la página de inicio.",
    back: "Volver a Vermut",
  },
});
