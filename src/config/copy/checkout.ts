/**
 * Copy de pago, confirmación, agenda y gracias.
 * Solo hechos del video del método y de `facts` (site.ts): nada de cifras ni plazos inventados.
 */
import { facts } from '@/config/site'

const visit = `$${facts.visitPrice}`
const design = `$${facts.designPrice}`
const balance = `$${facts.designBalance}`

export const payCopy = {
  eyebrow: 'Vía rápida',
  title: 'Reserva tu visita técnica',
  lead: 'No es solo que alguien vaya a medir: es el primer criterio profesional aplicado a tu proyecto.',
  imageAlt: 'Profesional de Construmia con casco en una obra de dos pisos en construcción',
  price: {
    amount: visit,
    label: 'Visita técnica',
    note: 'Pago único. Asesoría, levantamiento y diagnóstico.',
  },
  includesTitle: 'Qué incluye',
  includes: [
    {
      title: 'Asesoría',
      text: 'Conversamos sobre cómo quieres vivir tu casa y el presupuesto que tienes. No es para limitarte: así te recomendamos opciones que sí se ajustan a lo que puedes invertir.',
    },
    {
      title: 'Levantamiento',
      text: 'Tomamos las medidas y registramos lo que ya existe. Es la base sobre la que se diseña.',
    },
    {
      title: 'Diagnóstico',
      text: 'Miramos tu proyecto de manera integral y te decimos con qué criterio conviene abordarlo.',
    },
  ],
  ledger: {
    title: `Tus ${visit} se descuentan del diseño`,
    rows: [
      { label: 'Diseño completo en render 3D', value: design },
      { label: 'Menos tu visita técnica', value: `– ${visit}` },
    ],
    total: { label: 'Pagas por el diseño, solo si decides avanzar', value: balance },
  },
  fastTrack: {
    title: 'Agenda inmediata, sin los 4 pasos',
    text: 'Apenas se confirma tu pago eliges día y hora. Te saltas:',
    skipped: [
      'Esperar el contador',
      'El formulario de cualificación',
      'La revisión de tu caso por un asesor',
      'La llamada de confirmación',
    ],
  },
  methodTitle: 'Elige cómo pagar',
  methodsLabel: 'Método de pago',
  tabs: {
    card: 'Tarjeta',
    transfer: 'Transferencia',
  },
} as const

export const payphoneCopy = {
  title: 'Paga con tarjeta',
  subtitle: 'Crédito o débito. El cobro lo procesa Payphone.',
  summaryLabel: 'Visita técnica Construmia',
  loading: 'Preparando tu formulario de pago',
  expiresIn: 'Este formulario vence en',
  renewed: 'El formulario anterior venció. Ya preparamos uno nuevo para ti.',
  secure: 'Tus datos de tarjeta van directo a Payphone. Construmia no los ve ni los guarda.',
  error: {
    title: 'No pudimos cargar el formulario de pago',
    fallback: 'Revisa tu conexión e inténtalo otra vez.',
    retry: 'Reintentar',
  },
  unavailable: {
    title: 'El pago con tarjeta no está disponible en este momento',
    text: 'Puedes reservar tu visita hoy mismo por transferencia bancaria. Toma un par de minutos.',
    action: 'Pagar por transferencia',
  },
  noLead: 'Primero completa tu registro para poder pagar.',
} as const

export const transferCopy = {
  title: 'Paga por transferencia',
  subtitle: `Transfiere ${visit} a cualquiera de estas cuentas y sube tu comprobante.`,
  steps: {
    accounts: 'Transfiere a una de estas cuentas',
    bank: 'Dinos a qué banco transferiste',
    receipt: 'Sube tu comprobante',
  },
  account: {
    number: 'Número de cuenta',
    holder: 'Titular',
    holderId: 'Cédula',
    copy: 'Copiar',
    copied: 'Copiado',
    copyId: 'Copiar cédula',
    copiedNumber: 'Número de cuenta copiado',
    copiedId: 'Cédula copiada',
    copyFailed: 'No pudimos copiar. Mantén presionado el número para copiarlo.',
  },
  upload: {
    idle: 'Arrastra tu comprobante aquí',
    idleMobile: 'Toca para elegir tu comprobante',
    browse: 'o elige un archivo',
    hint: 'Imagen o PDF, máximo 10 MB',
    drop: 'Suelta el archivo',
    change: 'Cambiar',
    remove: 'Quitar',
    pdf: 'Documento PDF',
    previewAlt: 'Vista previa de tu comprobante',
  },
  errors: {
    type: 'El comprobante debe ser una imagen o un PDF.',
    size: 'El archivo pesa más de 10 MB. Prueba con una captura de pantalla.',
    bank: 'Elige el banco al que hiciste la transferencia.',
    file: 'Sube tu comprobante para continuar.',
    noLead: 'Primero completa tu registro para poder reportar tu pago.',
    fallback: 'No pudimos enviar tu comprobante. Inténtalo otra vez.',
  },
  submit: 'Enviar comprobante',
  submitting: 'Enviando comprobante',
  after: 'Validamos tu transferencia y te escribimos para agendar tu visita.',
} as const

export const payResponseCopy = {
  confirming: {
    title: 'Estamos confirmando tu pago',
    text: 'Toma unos segundos. No cierres ni recargues esta página.',
  },
  paid: {
    eyebrow: 'Pago confirmado',
    title: 'Tu visita técnica está reservada',
    text: 'Ahora elige el día y la hora. Te llevamos a la agenda.',
    action: 'Elegir mi horario',
    // Pago aprobado desde un navegador donde no está el registro: la agenda se coordina por WhatsApp.
    noLeadText: 'Recibimos tu pago. Escríbenos por WhatsApp y coordinamos el horario de tu visita.',
    noLeadAction: 'Coordinar por WhatsApp',
    whatsappMessage: 'Hola, acabo de pagar mi visita técnica y quiero agendarla',
  },
  canceled: {
    eyebrow: 'Pago no realizado',
    title: 'El pago se canceló',
    text: 'No se hizo ningún cobro a tu tarjeta. Puedes intentarlo otra vez o pagar por transferencia.',
  },
  pending: {
    eyebrow: 'Pago en proceso',
    title: 'Tu pago todavía no se confirma',
    text: 'Payphone aún no nos da una respuesta definitiva. Vuelve a consultar en unos segundos.',
    retry: 'Consultar otra vez',
  },
  error: {
    eyebrow: 'Algo no salió bien',
    title: 'No pudimos confirmar tu pago',
    missing: 'Este enlace no trae los datos del pago. Si ya pagaste, escríbenos y lo revisamos contigo.',
    fallback: 'Si se hizo un cobro a tu tarjeta, escríbenos y lo revisamos contigo.',
    retry: 'Reintentar',
  },
  backToPay: 'Volver al pago',
  help: 'Ayuda por WhatsApp',
  helpMessage: 'Hola, necesito ayuda con el pago de mi visita técnica',
} as const

export const scheduleCopy = {
  paid: {
    eyebrow: 'Pago confirmado',
    title: 'Tu visita está pagada. Elige tu horario.',
    lead: 'Reserva el día y la hora que mejor te queden. Tu visita técnica ya está cubierta.',
  },
  qualified: {
    eyebrow: 'Tu proyecto califica',
    title: 'Tu proyecto es para nuestro método. Elige cómo seguimos.',
    lead: 'El primer paso es la visita técnica. Puedes agendarla tú mismo ahora con el pase premium, o esperar a que un asesor te contacte.',
  },
  /** Dos caminos para quien calificó y aún no paga. El calendario se abre solo con el pase premium. */
  choice: {
    premium: {
      badge: 'Pase premium',
      price: visit,
      priceNote: 'Visita técnica',
      title: 'Agenda tu cita ahora y sáltate todos los pasos',
      points: [
        'Eliges el día y la hora de tu visita hoy mismo',
        'Sin esperar la llamada del asesor ni la revisión de tu caso',
        `Los ${visit} se descuentan de tu diseño 3D: en lugar de ${design} pagas ${balance}`,
        'Incluye asesoría, levantamiento y diagnóstico de tu proyecto',
      ],
      cta: `Pagar ${visit} y agendar ahora`,
      note: 'Pago con tarjeta o transferencia. Al confirmarse, se abre tu agenda.',
    },
    advisor: {
      badge: 'Sin pagar ahora',
      title: 'Un asesor se contactará contigo en breve',
      text: 'Revisamos lo que nos contaste de tu proyecto y te escribimos para coordinar la visita técnica.',
      channel: (phone: string) => `Te escribiremos por WhatsApp al ${phone}.`,
      whatsapp: '¿Prefieres escribirnos tú?',
      whatsappAction: 'Escribir por WhatsApp',
      whatsappMessage: 'Hola, mi proyecto calificó y quiero coordinar mi visita técnica',
    },
  },
  calendarTitle: 'Agenda de visitas técnicas',
  calendarLoading: 'Cargando la agenda',
  calendarHelp: 'Si la agenda no carga, escríbenos y te reservamos el horario.',
  calendarHelpAction: 'Agendar por WhatsApp',
  calendarHelpMessage: 'Hola, quiero agendar mi visita técnica',
  expectEyebrow: 'Qué esperar',
  expectTitle: 'Así es la visita técnica',
  imageAlt: 'Sala terminada por Construmia con muro de piedra natural y mobiliario claro',
  expect: [
    {
      title: 'Una conversación honesta sobre tu presupuesto',
      text: 'Te vamos a pedir que seas transparente con lo que tienes para invertir. Con eso te recomendamos las mejores opciones según tus gustos y tus necesidades.',
    },
    {
      title: 'Levantamiento y diagnóstico de tu casa',
      text: 'No es solo que alguien vaya a medir: es el primer criterio profesional aplicado a tu proyecto.',
    },
    {
      title: 'El siguiente paso, si decides avanzar',
      text: `Pasamos al diseño completo en render 3D. Cuesta ${design} y ya se descuentan los ${visit} de la visita: pagas ${balance} adicionales. Mientras esté en proceso puedes pedir los ajustes que necesites.`,
    },
  ],
} as const

export const thanksCopy = {
  transfer: {
    eyebrow: 'Comprobante recibido',
    title: 'Recibimos tu comprobante',
    lead: 'Gracias por dar el paso. Lo validamos y te escribimos para agendar tu visita técnica.',
    stepsTitle: 'Qué sigue',
    steps: [
      'Validamos tu transferencia con el banco.',
      'Te escribimos por WhatsApp o correo para confirmarla.',
      'Eliges el día y la hora de tu visita técnica.',
    ],
    whatsapp: 'Escribir por WhatsApp',
    whatsappMessage: 'Hola, acabo de enviar el comprobante de mi visita técnica',
    imageAlt: 'Casa de dos pisos terminada por Construmia con piscina y jardín',
  },
  notQualified: {
    eyebrow: 'Gracias por tu tiempo',
    title: 'Gracias por contarnos tu proyecto',
    lead: 'Por lo que nos compartiste, hoy nuestro método no es el que mejor le sirve a tu proyecto. Preferimos decírtelo de frente antes que hacerte perder tiempo.',
    forTitle: `Para qué proyectos es el ${facts.method}`,
    forItems: [
      'Remodelaciones integrales: varios espacios de tu casa a la vez.',
      'Ampliaciones importantes.',
      'La reestructuración completa de una casa antigua.',
      `Proyectos a partir de ${facts.minProjectLabel}, con diseño y construcción bajo un mismo equipo.`,
    ],
    aside: 'Si lo que necesitas es renovar un solo ambiente puntual, eso lo podemos hablar en otro momento.',
    doorTitle: 'Si tu proyecto crece, aquí estamos',
    doorText: 'Escríbenos cuando quieras retomarlo. Mientras tanto, en Instagram compartimos renders y obras terminadas.',
    whatsapp: 'Escribir por WhatsApp',
    whatsappMessage: 'Hola, me registré en su página y quiero contarles más de mi proyecto',
    instagram: 'Ver Instagram',
    imageAlt: 'Casa de dos pisos terminada por Construmia con piscina y jardín',
  },
} as const
