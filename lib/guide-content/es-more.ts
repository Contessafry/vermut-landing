import type { Guide } from "@/lib/guides";
import { S } from "@/lib/guides";

export const guides: readonly Guide[] = [
  {
    slug: "install-wine-on-mac-apple-silicon",
    label: "Instalar Wine en Mac (2026)",
    metaTitle: "Cómo instalar Wine en Mac (Apple Silicon, de Sonoma a Tahoe)",
    description:
      "El cask wine-stable de Homebrew está desactivado desde el 1 de septiembre de 2026. Cómo conseguir Wine hoy en un Mac M1 a M4: builds de Gcenx, una interfaz como Vermut o CrossOver.",
    h1: "Instalar Wine en Mac: lo que funciona en 2026",
    answer: [
      "El método de siempre, brew install --cask wine-stable, ya no funciona: Homebrew desactivó el cask el 1 de septiembre de 2026 porque no supera la comprobación de Gatekeeper de Apple. Sigue habiendo builds de Wine para macOS en el proyecto Gcenx de GitHub, pero tendrás que configurar tú los prefijos, las capas gráficas y las tiendas. Si quieres Wine para jugar a juegos de Windows, una interfaz como Vermut descarga Wine 11 por ti e instala Steam o Epic Games (beta) en una botella propia, gratis.",
    ],
    sections: [
      {
        id: "what-changed",
        title: "Qué ha cambiado con Wine en macOS",
        body: [
          ["Durante años, casi todas las guías decían que instalaras Wine con Homebrew. El cask wine-stable (Wine 11.0) está ahora desactivado con el motivo fails_gatekeeper_check, así que Homebrew ya no lo instala. Las guías anteriores a septiembre de 2026 están desfasadas en este punto."],
          ["Wine sigue desarrollándose y funcionando en macOS. En un Mac con Apple Silicon ejecuta programas Windows x86-64 mediante Rosetta 2, que debe estar instalado. Los juegos necesitan además una capa que traduzca DirectX a Metal, como DXMT, DXVK con MoltenVK o D3DMetal de Apple; Wine solo trae WineD3D, que funciona sobre OpenGL."],
        ],
      },
      {
        id: "options",
        title: "Tres formas de tener Wine en un Mac con Apple Silicon",
        bullets: [
          ["Builds de Gcenx, gratis. El proyecto Gcenx publica Wine Stable, Staging y Devel para macOS en GitHub. Buena opción si te manejas con el Terminal y quieres Wine también para programas, no solo juegos."],
          ["Una interfaz gratuita como Vermut. Descarga su propio build de Wine 11, más Gcenx Wine Staging y Devel cuando los pides, y crea una botella por tienda. Pensada para juegos de Steam y Epic, sin Terminal."],
          ["CrossOver, de pago. El Wine comercial de CodeWeavers, con 14 días de prueba y soporte. La compatibilidad más amplia si necesitas que funcione un juego o programa concreto de Windows."],
        ],
      },
      {
        id: "steps",
        title: "Wine para jugar en cinco minutos con Vermut",
        steps: [
          { title: "Comprueba tu Mac", body: ["Apple Silicon (M1 o posterior) y macOS 14 Sonoma o posterior. Los Mac con Intel no son compatibles."] },
          { title: "Instala Vermut", body: ["Descarga el DMG, arrastra Vermut a Aplicaciones y permítelo una vez con la ", { text: "guía de la primera apertura", href: "/es/open-anyway-unnotarized-app-mac" }, "."] },
          { title: "Deja que instale Rosetta 2 y Wine", body: ["En la primera apertura, Vermut ofrece instalar Rosetta 2 si falta y descarga su motor Wine 11."] },
          { title: "Elige una tienda", body: ["Elige Steam o Epic Games (beta). Vermut crea para cada una una botella con la capa gráfica adecuada. GOG Galaxy llegará pronto."] },
          { title: "¿Necesitas otra versión de Wine?", body: ["En Ajustes › Wine Engines puedes descargar Wine Staging o Wine Devel y elegirlo para una sola botella o un solo juego."] },
        ],
      },
    ],
    after: [
      {
        id: "limits",
        title: "Límites, con honestidad",
        bullets: [
          ["Wine no es Windows. Muchos programas funcionan, algunos no, y los juegos con antitrampas a nivel de kernel no funcionan nunca."],
          ["Vermut está hecho para tiendas de juegos. Para ofimática o una herramienta suelta de Windows, puede encajar mejor Wine a secas o CrossOver, aunque Vermut puede abrir un .exe en una botella personalizada."],
          ["Rosetta 2 es clave: Apple ha anunciado que lo limitará en futuras versiones de macOS, así que Wine en Mac puede volver a cambiar."],
        ],
      },
    ],
    faq: [
      { q: "¿Por qué falla brew install wine-stable?", a: ["Homebrew desactivó el cask wine-stable el 1 de septiembre de 2026 porque el paquete no supera la comprobación de Gatekeeper de macOS. Usa un build de Gcenx en GitHub, una interfaz como Vermut o CrossOver."] },
      { q: "¿Funciona Wine en macOS Sequoia y Tahoe?", a: ["Sí, en Apple Silicon mediante Rosetta 2. Vermut requiere macOS 14 Sonoma o posterior y funciona también en versiones más recientes."] },
      { q: "¿Wine es gratis?", a: ["Sí. Wine es software libre y de código abierto. Vermut, que instala y gestiona Wine para juegos, también es gratis y tiene licencia MIT."] },
      { q: "¿Puedo usar Wine en un Mac con Intel?", a: ["Hay builds de Wine para Mac con Intel, pero Vermut solo es compatible con Apple Silicon."] },
    ],
    sources: [S.brewWine, S.gcenxWine, S.winehq, S.cxStore, S.dxmt, S.vermutRelease, S.vermut],
  },

  {
    slug: "epic-games-windows-games-on-mac",
    label: "Juegos de Windows de Epic en Mac",
    metaTitle: "Juega a juegos de Windows de Epic Games Store en un Mac M1, M2, M3 o M4",
    description:
      "El launcher de Epic Games para Mac solo instala juegos de Mac. Así puedes instalar y jugar tu biblioteca de Windows de Epic en Apple Silicon gratis, con Vermut y Legendary.",
    h1: "Jugar a juegos de Windows de Epic Games Store en Mac",
    answer: [
      "El launcher de Epic Games para Mac solo instala juegos con versión para Mac. Para los de Windows necesitas Wine en un Mac con Apple Silicon. Vermut lo hace gratis, en beta: usa Legendary, un cliente de Epic de código abierto. Inicias sesión en la página de Epic, ves tu biblioteca e instalas y abres juegos de Windows en una botella con Wine 11, sin el launcher de Epic. Fortnite y otros juegos con antitrampas a nivel de kernel no funcionan.",
    ],
    sections: [
      {
        id: "why",
        title: "Por qué no basta con el launcher de Epic para Mac",
        body: [
          ["El launcher de Epic funciona en macOS, pero su biblioteca solo ofrece versiones para Mac. La mayoría de lo que compraste o reclamaste gratis en Epic Games Store es solo para Windows, así que no se puede instalar."],
          ["Ejecutar el launcher de Windows de Epic en Wine es posible, pero pesado. Vermut se lo salta: Legendary habla directamente con los servidores de Epic, descarga los archivos de Windows del juego y los abre en Wine."],
        ],
      },
      {
        id: "steps",
        title: "Configura tu biblioteca de Epic con Vermut",
        steps: [
          { title: "Instala Vermut", body: ["Necesitas un Mac con Apple Silicon y macOS 14 o posterior. Arrastra Vermut a Aplicaciones y permítelo una vez con la ", { text: "guía de la primera apertura", href: "/es/open-anyway-unnotarized-app-mac" }, "."] },
          { title: "Elige Epic Games (beta)", body: ["Elige Epic Games en Tiendas. Vermut descarga su motor Wine y el cliente Legendary, y comprueba su suma de verificación."] },
          { title: "Inicia sesión en la página de Epic", body: ["Vermut abre la página de inicio de sesión de Epic. Tu contraseña va a Epic, no a Vermut; Legendary guarda la sesión en tu Mac."] },
          { title: "Instala un juego", body: ["Tu biblioteca de Epic aparece en Vermut. Instala un juego y se descargará en la botella de Epic."] },
          { title: "Juega y ajusta si hace falta", body: ["Los juegos instalados aparecen en la Biblioteca con un botón Play. Si alguno da problemas, abre sus ajustes con ⌥⌘I y prueba otro backend gráfico."] },
        ],
      },
    ],
    after: [
      {
        id: "what-works",
        title: "Qué puedes esperar",
        bullets: [
          ["Suele funcionar: juegos con DirectX 9 a 11, sobre todo títulos antiguos e indies."],
          ["Los juegos con DirectX 12 necesitan D3DMetal de Apple: consulta ", { text: "Juegos DirectX 12 en Mac", href: "/es/directx-12-games-on-mac-d3dmetal" }, "."],
          ["No funciona: Fortnite, Valorant y otros juegos con antitrampas a nivel de kernel. Compruébalo antes en ", { text: "Are We Anti-Cheat Yet?", href: S.aacy.href }, "."],
          ["Epic en Vermut está en beta. Faltan algunas funciones del launcher oficial, como la tienda o la lista de amigos: compra y reclama juegos en la web de Epic."],
        ],
      },
    ],
    faq: [
      { q: "¿Puedo jugar a Fortnite en Mac con Vermut?", a: ["No. Fortnite usa un antitrampas a nivel de kernel que bloquea Wine. En Mac solo se puede jugar por streaming en la nube."] },
      { q: "¿Vermut instala el launcher de Epic Games?", a: ["No. Usa Legendary, un cliente de Epic de código abierto, así que no necesitas el launcher."] },
      { q: "¿Funcionan los juegos gratis de Epic?", a: ["Los juegos reclamados gratis están en tu biblioteca como los demás y se pueden instalar. Que funcionen depende del juego."] },
      { q: "¿Vermut ve mi contraseña de Epic?", a: ["No. Inicias sesión en la página de Epic y Legendary guarda la sesión en tu Mac."] },
    ],
    sources: [S.legendary, S.epicMac, S.aacy, S.vermutRelease, S.vermut],
  },

  {
    slug: "directx-12-games-on-mac-d3dmetal",
    label: "Juegos DirectX 12 en Mac con D3DMetal",
    metaTitle: "Jugar a juegos DirectX 12 en Mac: cómo usar D3DMetal",
    description:
      "Los juegos de Windows con DirectX 12 necesitan D3DMetal, la capa de Apple del Game Porting Toolkit. Cómo descargarlo gratis y usarlo en Vermut, paso a paso.",
    h1: "Jugar a juegos DirectX 12 en un Mac con Apple Silicon",
    answer: [
      "Los juegos con DirectX 12 necesitan D3DMetal, la capa de traducción de Apple incluida en el Game Porting Toolkit. La licencia de Apple no permite que las apps lo incluyan, así que lo descargas tú desde developer.apple.com con una cuenta de Apple gratuita. Después Vermut lo encuentra, comprueba que sea la versión 2.0 o posterior y ofrece D3DMetal como backend gráfico para una botella o un solo juego.",
    ],
    sections: [
      {
        id: "why",
        title: "Por qué DirectX 12 necesita algo más",
        body: [
          ["Los Mac hablan Metal, no DirectX. La capa por defecto de Vermut, DXMT, traduce DirectX 10 y 11 a Metal, y DXVK cubre DirectX 9 a 11 mediante Vulkan y MoltenVK. Ninguna de las dos maneja DirectX 12 en Mac."],
          ["D3DMetal de Apple sí. Forma parte del Game Porting Toolkit, que Apple creó para desarrolladores que prueban juegos de Windows, y es la misma capa en la que se apoyan las herramientas comerciales para DirectX 12."],
        ],
      },
      {
        id: "steps",
        title: "Instalar D3DMetal y usarlo en Vermut",
        steps: [
          { title: "Inicia sesión en Apple Developer", body: ["Ve a developer.apple.com e inicia sesión con tu cuenta de Apple. Basta una cuenta gratuita."] },
          { title: "Descarga el Game Porting Toolkit", body: ["Busca Game Porting Toolkit en la lista de descargas y descarga el .dmg."] },
          { title: "Abre el entorno de evaluación", body: ["Abre el .dmg, luego “Evaluation environment for Windows games”, y acepta la licencia. Así se activa el volumen que contiene D3DMetal."] },
          { title: "Deja que Vermut lo encuentre", body: ["Abre Vermut › Ajustes › D3DMetal. Vermut busca en las ubicaciones habituales; si no lo encuentra, haz clic en Point to location… y elige la carpeta redist/lib."] },
          { title: "Pasa un juego a D3DMetal", body: ["Selecciona el juego en la Biblioteca, pulsa ⌥⌘I para sus ajustes y pon Graphics backend en D3DMetal. O configúralo para toda la botella en la pestaña Graphics de la botella."] },
        ],
      },
    ],
    after: [
      {
        id: "limits",
        title: "Límites, con honestidad",
        bullets: [
          ["En Vermut, D3DMetal funciona con las botellas de Steam y Epic. Vermut nunca lo modifica ni lo redistribuye."],
          ["No todos los juegos con DirectX 12 funcionan, y los exigentes necesitan una GPU potente: en un chip M base, cuenta con ajustes más bajos."],
          ["Los juegos con antitrampas a nivel de kernel siguen sin funcionar, con cualquier capa gráfica."],
          ["Si un juego arranca y luego se cierra, compara con DXMT: algunos juegos tienen un modo DirectX 11 que funciona mejor."],
        ],
      },
    ],
    faq: [
      { q: "¿D3DMetal es gratis?", a: ["Sí. El Game Porting Toolkit es una descarga gratuita de Apple, con una cuenta de Apple gratuita."] },
      { q: "¿Por qué Vermut no incluye D3DMetal?", a: ["La licencia de Apple no lo permite a las apps. Lo descargas de Apple y Vermut usa tu copia."] },
      { q: "¿Qué versión necesito?", a: ["Vermut necesita D3DMetal 2.0 o posterior. Si encuentra una versión anterior, te avisa para que descargues la última de Apple."] },
      { q: "¿Necesito Xcode o el Terminal?", a: ["No. Con Vermut solo descargas el .dmg, lo abres y aceptas la licencia."] },
    ],
    sources: [S.gptk, S.gptkDownload, S.gptkReq, S.dxmt, S.vermutRelease, S.vermut],
  },

  {
    slug: "open-anyway-unnotarized-app-mac",
    label: "Abrir Vermut la primera vez (Abrir igualmente)",
    metaTitle: "¿Apple no pudo verificar una app? Abre Vermut con «Abrir igualmente»",
    description:
      "Por qué macOS no puede verificar Vermut y cómo abrirlo con seguridad con Abrir igualmente, en Privacidad y seguridad, en Sonoma, Sequoia y posteriores. Además: cómo comprobar la descarga.",
    h1: "Abrir Vermut por primera vez en macOS",
    answer: [
      "macOS bloquea Vermut la primera vez porque es una app gratuita que aún no está notarizada con un Developer ID de Apple de pago, no porque contenga malware. Ábrela una vez, haz clic en Aceptar, ve a Ajustes del Sistema › Privacidad y seguridad, haz clic en Abrir igualmente junto al mensaje sobre Vermut y confirma con Touch ID o tu contraseña. A partir de ahí se abre con normalidad. Desde macOS Sequoia, Control-clic › Abrir ya no se salta este paso.",
    ],
    sections: [
      {
        id: "why",
        title: "Por qué macOS muestra un aviso",
        body: [
          ["Gatekeeper comprueba que una app esté firmada con un Developer ID de Apple y notarizada por Apple. La notarización requiere una membresía de desarrollador de pago. Vermut es un proyecto gratuito con licencia MIT y aún no está notarizado, así que macOS muestra un aviso como «Apple no ha podido verificar que Vermut no contenga software malicioso»."],
          ["El aviso significa que Apple no ha revisado la app, no que haya encontrado un problema. Puedes leer todo el código en GitHub y comparar tu descarga con el SHA-256 publicado en la página de descarga y en las notas de la versión."],
        ],
      },
      {
        id: "steps",
        title: "Abrir Vermut, paso a paso",
        steps: [
          { title: "Abre Vermut desde Aplicaciones", body: ["Arrastra Vermut del DMG a Aplicaciones y ábrelo. macOS muestra el aviso: haz clic en Aceptar, no en Trasladar a la papelera."] },
          { title: "Haz clic en Abrir igualmente en Privacidad y seguridad", body: ["Selecciona menú Apple › Ajustes del Sistema › Privacidad y seguridad, desplázate hasta Seguridad y haz clic en Abrir igualmente junto al mensaje sobre Vermut. El botón está disponible durante una hora aproximadamente después del paso 1."] },
          { title: "Vuelve a hacer clic en Abrir igualmente", body: ["Aparece un cuadro de confirmación: haz clic en Abrir igualmente."] },
          { title: "Confirma con Touch ID o tu contraseña", body: ["macOS guarda Vermut como excepción. La próxima vez basta con hacer doble clic."] },
        ],
      },
    ],
    after: [
      {
        id: "check",
        title: "Si quieres, comprueba antes la descarga",
        bullets: [
          ["En el Terminal, ejecuta shasum -a 256 sobre el DMG de tu carpeta Descargas y compara el resultado con el SHA-256 de la página de descarga de Vermut."],
          ["Descarga Vermut solo desde sus releases de GitHub o desde la web oficial que enlaza a ellas."],
          ["No desactives Gatekeeper para todo el Mac. Abrir igualmente crea una excepción solo para esta app."],
        ],
      },
    ],
    faq: [
      { q: "¿Vermut es seguro?", a: ["Vermut es de código abierto, así que cualquiera puede ver lo que hace, y cada versión publica su SHA-256. No hay cuenta ni telemetría. El aviso de macOS se refiere a la notarización, no a una amenaza detectada."] },
      { q: "¿Por qué no funciona Control-clic › Abrir?", a: ["Apple eliminó ese atajo en macOS Sequoia. Usa Abrir igualmente en Privacidad y seguridad."] },
      { q: "No veo Abrir igualmente.", a: ["Primero intenta abrir Vermut y haz clic en Aceptar: el botón solo aparece durante una hora aproximadamente después de una apertura bloqueada. Luego mira en la sección Seguridad, al final de Privacidad y seguridad."] },
      { q: "¿Tengo que repetirlo en cada actualización?", a: ["Normalmente, una vez por cada copia descargada. Si macOS vuelve a avisar tras una nueva versión, repite los mismos pasos."] },
    ],
    sources: [S.appleOpenAnyway, S.appleSafely, S.appleSequoia, S.vermutRelease, S.vermut],
  },

  {
    slug: "wine-bottles-and-game-settings-mac",
    label: "Botellas y ajustes por juego en Vermut",
    metaTitle: "Botellas de Wine, backends gráficos y ajustes por juego en Vermut",
    description:
      "Cómo funcionan las botellas de Wine de Vermut: una por tienda, botellas personalizadas para cualquier .exe y ajustes por juego para el motor Wine, DXMT, DXVK, WineD3D o D3DMetal.",
    h1: "Botellas de Wine y ajustes por juego en Vermut",
    answer: [
      "Una botella es un entorno de Windows separado, un prefijo de Wine con su propia unidad C:. Vermut crea una por tienda, y puedes añadir botellas personalizadas para programas fuera de Steam y Epic. Los ajustes van por capas: los Ajustes de Vermut fijan los valores por defecto, cada botella puede cambiarlos y, desde la 1.2, cada juego puede volver a cambiarlos en sus ajustes (⌥⌘I). «Automatic» muestra siempre el valor heredado.",
    ],
    sections: [
      {
        id: "layers",
        title: "Ajustes, botella, juego: cómo funcionan las capas",
        bullets: [
          ["Los Ajustes (⌘,) guardan los valores por defecto: motor Wine, backend gráfico, versión de DXMT y nivel de log."],
          ["Una botella usa esos valores hasta que los cambias en su página. Las botellas de tienda tienen además versión de Windows (10, 8.1 o 7), modo de alta resolución, winecfg, la unidad C: de la botella en el Finder, logs y diagnóstico."],
          ["Un juego usa los valores de su botella hasta que los sustituyes en sus ajustes. Solo afecta a ese juego."],
          ["Cambiar de motor no toca juegos ni partidas guardadas. Si la tienda está abierta, el cambio se aplica la próxima vez que se abra."],
        ],
      },
      {
        id: "backends",
        title: "Qué backend gráfico usar",
        bullets: [
          ["DXMT, por defecto: DirectX 10 y 11 directamente a Metal. Vermut gestiona varias versiones de DXMT en Ajustes › Components, para que un juego pueda quedarse en una versión anterior."],
          ["DXVK con MoltenVK: DirectX 9 a 11 mediante Vulkan. Necesita Wine Staging, que Vermut selecciona automáticamente."],
          ["WineD3D: la capa propia de Wine, sobre OpenGL. Más lenta, pero a veces la más compatible con juegos antiguos."],
          ["D3DMetal: la capa DirectX 12 de Apple, disponible cuando instalas el Game Porting Toolkit. Consulta ", { text: "Juegos DirectX 12 en Mac", href: "/es/directx-12-games-on-mac-d3dmetal" }, "."],
        ],
      },
      {
        id: "steps",
        title: "Tareas habituales",
        steps: [
          { title: "Cambiar los ajustes de un juego", body: ["Selecciona el juego en la Biblioteca y pulsa ⌥⌘I (View › Game Settings). Elige motor Wine, backend gráfico, versión de DXMT o nivel de log, o deja Automatic."] },
          { title: "Crear una botella personalizada", body: ["Pulsa ⇧⌘N (File › New Bottle…). Ponle nombre y elige motor, backend gráfico y versión de Windows, o déjalos en Automatic."] },
          { title: "Ejecutar un instalador de Windows", body: ["En una botella personalizada, haz clic en Run .exe or Installer… (⌘O) y elige un .exe o .msi. También puedes usar Run .exe en la barra de herramientas."] },
          { title: "Empezar de cero si una botella falla", body: ["Usa Reset bottle en la página de la botella. Borra esa botella y los juegos instalados en ella; tu cuenta de la tienda y las partidas en la nube no están ahí."] },
        ],
      },
    ],
    faq: [
      { q: "¿Puedo importar botellas de Whisky o CrossOver?", a: ["No. Vermut crea sus propias botellas. Instala la tienda en Vermut y vuelve a descargar tus juegos."] },
      { q: "¿Dónde están mis juegos?", a: ["En la unidad C: de cada botella. Ábrela desde la página de la botella para ver los archivos en el Finder. Los juegos funcionan mejor desde el SSD interno."] },
      { q: "¿Para qué sirve el nivel de log?", a: ["Controla cuánta información escribe Wine en el log. Súbelo para informar de un fallo en GitHub y luego vuelve a Automatic."] },
      { q: "¿GOG Galaxy tiene botella?", a: ["Todavía no. En Vermut 1.2, GOG Galaxy aparece como Coming soon."] },
    ],
    sources: [S.vermutRelease, S.vermut, S.dxmt, S.gptk, S.gcenxWine],
  },
];
