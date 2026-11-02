import { type LegalData } from "./types/configDataTypes";

// Legal content for sakaramos. Plain-language pages for a personal portfolio, not a reviewed legal opinion.
const legalData = {
  terms: {
    title: "Términos",
    description: "Condiciones de uso del sitio sakaramos.",
    lastUpdated: "2026-11-01",
    intro:
      "Estos términos explican cómo puedes usar sakaramos, el sitio personal de Andres Ramos. Al entrar aceptas estas condiciones. Si no estás de acuerdo, no uses el sitio.",
    sections: [
      {
        heading: "Uso del sitio",
        body: [
          "sakaramos es un portafolio personal. Puedes leer el contenido para conocer el trabajo de Andres Ramos y escribir por el formulario de contacto. El uso debe ser lícito: no interfieras con el sitio, no intentes acceder a partes que no están publicadas y no uses el formulario para enviar spam o contenido abusivo.",
        ],
      },
      {
        heading: "Contenido",
        body: [
          "Los textos, la foto y el diseño del sitio son de Andres Ramos, salvo cuando se indique otra fuente. Puedes enlazar las páginas. Copiar o redistribuir el contenido para otro fin necesita permiso.",
        ],
      },
      {
        heading: "Sin garantías",
        body: [
          "El sitio se ofrece tal como está. No se garantiza que esté siempre disponible ni libre de errores. Los proyectos y textos describen experiencia personal y no son una oferta comercial.",
        ],
      },
      {
        heading: "Ley aplicable",
        body: [
          "Estos términos se rigen por las leyes de la República de Colombia.",
        ],
      },
      {
        heading: "Cambios",
        body: [
          "Estos términos se pueden actualizar. La fecha de la última revisión aparece al inicio de la página. Seguir usando el sitio después de un cambio implica que aceptas la versión nueva.",
        ],
      },
      {
        heading: "Contacto",
        body: [
          "Si tienes dudas sobre estos términos, escribe a andfera201@gmail.com.",
        ],
      },
    ],
  },
  privacy: {
    title: "Privacidad",
    description: "Qué datos recoge sakaramos y para qué se usan.",
    lastUpdated: "2026-11-01",
    intro:
      "Esta página explica qué datos personales trata sakaramos, el sitio de Andres Ramos, y con qué fin. No hay cuentas de usuario ni venta de datos.",
    sections: [
      {
        heading: "Datos que recogemos",
        body: [
          "Si escribes por el formulario de contacto, recibimos el nombre, el correo y el mensaje que envías. Eso es lo único que pides entregar.",
          "El sitio se sirve en Cloudflare. Al visitarlo, el proveedor de alojamiento puede registrar datos técnicos de la conexión, como la dirección IP, el tipo de navegador y la página pedida, para entregar el sitio y protegerlo.",
        ],
      },
      {
        heading: "Para qué se usan",
        body: [
          "El nombre, el correo y el mensaje se usan solo para leer tu consulta y responderte. No se usan para publicidad ni se venden.",
        ],
      },
      {
        heading: "Preferencia de tema",
        body: [
          "Si cambias entre tema claro y oscuro, esa elección se guarda en tu navegador (almacenamiento local). No sale del dispositivo y no es una cookie de seguimiento.",
        ],
      },
      {
        heading: "Con quién se comparten",
        body: [
          "El mensaje de contacto se envía por un servicio de correo (Resend) para que llegue a Andres Ramos. Cloudflare entrega el sitio. Esos proveedores tratan los datos solo para prestar ese servicio. También se pueden entregar datos si una autoridad lo exige por ley.",
        ],
      },
      {
        heading: "Cuánto tiempo se conservan",
        body: [
          "Los mensajes de contacto se conservan el tiempo necesario para responder y llevar el hilo de la conversación, y se borran cuando ya no hacen falta.",
        ],
      },
      {
        heading: "Tus derechos",
        body: [
          "Puedes pedir acceso, corrección o eliminación de los datos que hayas enviado por el formulario. Escribe a andfera201@gmail.com e indica de qué mensaje se trata.",
        ],
      },
      {
        heading: "Cambios",
        body: [
          "Esta política se puede actualizar. La fecha de la última revisión aparece al inicio de la página.",
        ],
      },
      {
        heading: "Contacto",
        body: [
          "Para preguntas sobre privacidad escribe a andfera201@gmail.com.",
        ],
      },
    ],
  },
} satisfies LegalData;

export default legalData;
