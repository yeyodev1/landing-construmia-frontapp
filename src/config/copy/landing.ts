/**
 * Copy de la landing de registro ("/"). Todo sale del video del método y de `facts`:
 * acá no se inventan cifras, testimonios ni clientes. Las cifras se arman desde `facts`
 * para que un cambio de precio se haga en un solo lugar.
 */
import { embeds, facts } from '@/config/site'
import { media } from '@/config/media'
import { qualificationQuestions } from '@/config/qualification'

const visit = `$${facts.visitPrice}`
const design = `$${facts.designPrice}`
const balance = `$${facts.designBalance}`
const clients = facts.corporateClients.join(' y ')

/** Ancla del formulario inline (CTA final). Los CTA abren el modal; el router y los avisos bajan acá. */
export const FORM_ANCHOR = '#registro'

/** Primera pregunta del registro: la misma de la cualificación, así no se pregunta dos veces. */
export const projectTypeQuestion = qualificationQuestions[0]!

const preview = embeds.previewSeconds

export const hero = {
  eyebrow: 'Remodelación integral · Diseño y construcción',
  // Dos líneas: la segunda es la que lleva el acento de color.
  title: ['No empieces una obra', 'sin saber cómo va a terminar.'],
  lead: `Un solo equipo diseña y construye tu proyecto. Lo ves completo en render 3D, con alcance y presupuesto claros, antes de empezar la obra.`,
  trust: [
    { value: clients, label: 'Empresas para las que hemos trabajado' },
    { value: '1 año', label: 'De garantía al cierre de cada obra' },
    { value: 'Un solo equipo', label: 'Responsable de principio a fin' },
  ],
  video: {
    tag: 'Mira cómo trabajamos',
    method: facts.method,
    // Duración real del VSL en Wistia (329,8 s).
    duration: '5:30',
    durationLabel: 'Duración del video: 5 minutos 30 segundos',
    sound: 'Sube el volumen',
    play: `Reproducir el video: ${facts.method}`,
    // Cuadro del propio video en Wistia: la diseñadora a cámara, no una foto de stock.
    poster: 'https://embed-ssl.wistia.com/deliveries/96e4d525242fd390e5a84009f6b9c9763af91ea4.jpg',
    posterAlt: 'La diseñadora de Construmia presenta el método a cámara',
    registered: 'Seguir viendo',
    registeredHint: 'Tu registro ya está listo. Sigue el video completo.',
    gate: {
      eyebrow: `Viste el adelanto de ${preview} segundos`,
      title: 'Continúa el video',
      text: 'Cuéntanos de tu proyecto y sigue viendo justo donde te quedaste.',
      cta: 'Continúa el video',
    },
  },
}

export const form = {
  step: 'Paso 1 de 3',
  title: 'Mira cómo trabajamos',
  lead: `Déjanos tus datos y te mostramos el ${facts.method} en video.`,
  fields: {
    firstName: { label: 'Nombre', placeholder: 'Tu nombre' },
    lastName: { label: 'Apellido', placeholder: 'Tu apellido' },
    email: { label: 'Correo', placeholder: 'tucorreo@ejemplo.com' },
    phone: {
      label: 'Teléfono (WhatsApp)',
      placeholder: '099 123 4567',
      valid: 'Número habilitado:',
    },
    projectType: { label: projectTypeQuestion.title, placeholder: 'Elige una opción' },
    startTimeframe: {
      label: '¿Cuándo quieres arrancar tu proyecto?',
      placeholder: 'Elige una opción',
    },
    projectStage: {
      label: '¿Tu proyecto ya está en curso o es nuevo?',
      placeholder: 'Elige una opción',
    },
    serviceNeeded: { label: '¿Qué quieres con tu proyecto?', placeholder: 'Elige una opción' },
  },
  country: {
    button: 'País del teléfono',
    search: 'Buscar país',
    searchPlaceholder: 'Buscar país o código',
    empty: 'No encontramos ese país',
  },
  commitment:
    'Entiendo que este proceso es para quien va en serio con su proyecto. Si continúo, es para avanzar: ver el método, responder con honestidad y agendar mi visita técnica.',
  submit: 'Quiero ver el método',
  submitting: 'Guardando tus datos',
  privacy: 'Usamos tus datos solo para contactarte sobre tu proyecto.',
  errors: {
    firstName: 'Escribe tu nombre',
    lastName: 'Escribe tu apellido',
    emailRequired: 'Escribe tu correo',
    emailInvalid: 'Revisa el correo: parece incompleto',
    phoneRequired: 'Escribe tu número de teléfono',
    phoneInvalid: (country: string) =>
      `Ese número no existe en ${country}. Escribe tu celular con WhatsApp, por ejemplo 099 123 4567`,
    phoneCountry: 'Ese número es de un país que no está en la lista: elige el país correcto',
    projectType: 'Elige qué quieres transformar',
    startTimeframe: 'Elige cuándo quieres arrancar',
    projectStage: 'Cuéntanos si tu proyecto está en curso o es nuevo',
    serviceNeeded: 'Elige qué quieres con tu proyecto',
    commitment: 'Para continuar necesitamos tu compromiso con el proceso',
    summary: 'Revisa los campos marcados para continuar',
    fallback: 'No pudimos guardar tus datos. Inténtalo de nuevo en un momento.',
  },
  resume: {
    eyebrow: 'Ya tienes tu registro',
    title: (name: string) => `${name}, sigue donde te quedaste`,
    lead: 'Tus datos están guardados. Continúa con el método y agenda tu visita técnica.',
    cta: 'Continuar donde me quedé',
    other: 'Registrar otros datos',
  },
}

export const leadModal = {
  dialogLabel: 'Cuéntanos de tu proyecto',
  close: 'Cerrar',
  back: 'Volver a elegir el tipo de proyecto',
  progress: (current: number, total: number) => `Paso ${current} de ${total}`,
  /** Encabezado según desde dónde se abrió: el video pausado o un CTA de la página. */
  intro: {
    video: 'Para seguir viendo, cuéntanos de tu proyecto',
    cta: `Antes del video, cuéntanos de tu proyecto`,
  },
  typeTitle: projectTypeQuestion.title,
  typeHelp: projectTypeQuestion.help,
  details: {
    title: 'Tus datos',
    lead: 'Con esto te mostramos el video completo y te contactamos sobre tu proyecto.',
    chosen: 'Tu proyecto',
    change: 'Cambiar',
  },
}

export const problem = {
  eyebrow: 'El problema',
  title: '¿Has pasado por una remodelación que parecía no terminar nunca?',
  pains: [
    {
      title: 'Retrasos',
      text: 'La fecha de entrega se mueve una y otra vez, y nadie sabe decirte cuándo termina.',
    },
    {
      title: 'Gastos inesperados',
      text: 'El presupuesto crece sin control porque nunca estuvo claro qué se iba a ejecutar.',
    },
    {
      title: 'Otro resultado',
      text: 'Lo que te entregan se parece poco a lo que imaginaste al empezar.',
    },
  ],
  pivot: ['Esos problemas no nacen en obra.', 'Nacen antes.'],
  pivotText:
    'Nacen cuando un proyecto arranca sin un diseño definido, sin una planificación clara y sin que nadie sepa realmente qué se va a ejecutar. Una buena obra no empieza construyendo: empieza planificando bien.',
  cta: 'Quiero planificar bien mi obra',
}

export const story = {
  eyebrow: 'La historia real detrás del método',
  title: 'El caso de Alejandra',
  place: 'Salinas',
  figures: {
    from: { value: '$25.000', label: 'Presupuesto con el que empezó su remodelación' },
    to: { value: '$40.000', prefix: 'casi', label: 'Lo que ya llevaba gastado, sin fecha de entrega' },
  },
  paragraphs: [
    'Alejandra y su familia llegaron a Construmia agotados de una remodelación que parecía no terminar nunca. No tenían un tiempo claro de entrega, había varias cosas a medias, y lo que se diseñó al inicio ya ni siquiera correspondía con lo que se estaba construyendo.',
    'Su casa se planteó como una vivienda de una planta. Cuando decidió crecer y construir un segundo piso, no encontró quién integrara bien el nuevo diseño con lo que ya existía. Sin planificación clara ni asesoría a tiempo, el presupuesto siguió creciendo mientras la obra quedaba inconclusa.',
  ],
  quote: 'No se trataba de terminar una obra a medias. Había que repensar la casa completa.',
  resolution:
    'Volvimos a mirar el proyecto de manera integral: entender cómo quería vivir su casa y repensarla desde la planta baja hasta el nuevo segundo piso, para que todo funcionara como una sola vivienda coherente, con continuidad real entre diseño y construcción.',
  cta: 'No quiero que me pase lo mismo',
}

export const method = {
  eyebrow: facts.method,
  title: 'Un solo camino, sin cortes entre una etapa y otra.',
  lead: 'Diseño y construcción nunca son dos procesos separados. Eso es justamente lo que reduce la improvisación en obra.',
  // Mismo orden que facts.steps: una línea por paso.
  details: [
    'Visita técnica, levantamiento y el primer criterio profesional sobre tu casa.',
    'Tu proyecto completo en render 3D, con los ajustes que necesites antes de aprobarlo.',
    'Se define qué se va a ejecutar antes de que la obra arranque.',
    'Alcance y costos claros, ajustados a lo que puedes invertir.',
    'Construye el mismo equipo que diseñó, con la misma visión.',
    'Dirección y control de costos durante toda la obra.',
    'Tu proyecto llevado del render a la realidad.',
    'Un año de garantía. No te dejamos solo al entregar.',
  ],
  note: 'No vendemos solo mano de obra: vendemos criterio profesional, diseño, dirección, asesoría, planificación y ejecución integral, bajo un mismo equipo y una misma visión.',
  cta: 'Quiero empezar por el diagnóstico',
}

export const reality = {
  eyebrow: 'Del render a la realidad',
  title: 'Primero lo ves. Después se construye.',
  lead: 'Apruebas el diseño antes de la obra, y ese es el diseño con el que avanzamos. Así se ve el camino en un proyecto de cocina.',
  stages: [
    {
      tag: 'Render 3D',
      title: 'El diseño que apruebas',
      id: media.renderToReality.render,
      alt: 'Render 3D de una cocina con isla, lámparas colgantes y vitrina iluminada',
    },
    {
      tag: 'Obra',
      title: 'La ejecución, supervisada',
      id: media.renderToReality.obra,
      alt: 'Cocina en plena obra: piso de porcelanato instalado, paredes en proceso y campana ya colocada',
    },
    {
      tag: 'Realidad',
      title: 'La cocina entregada',
      id: media.renderToReality.real,
      alt: 'Cocina terminada con isla de mármol, campana de acero y muebles altos iluminados',
    },
  ],
}

export interface GalleryItem {
  id: string
  kind: 'render' | 'real'
  /** ancho / alto del original: reserva el espacio y evita saltos de layout */
  ratio: number
  alt: string
}

export const gallery = {
  eyebrow: 'Renders y obra real',
  title: 'Lo que diseñamos y lo que entregamos.',
  tags: { render: 'Render 3D', real: 'Obra real' },
  prev: 'Ver imágenes anteriores',
  next: 'Ver más imágenes',
  region: 'Galería de renders y obras de Construmia',
  items: [
    { id: media.renders.exteriores[7], kind: 'render', ratio: 1, alt: 'Render de fachada de dos plantas con madera, piedra y palmeras al atardecer' },
    { id: media.reales.obra[8], kind: 'real', ratio: 0.81, alt: 'Casa de dos plantas en obra gris, con la estructura lista y palmeras alrededor' },
    { id: media.renders.sociales[7], kind: 'render', ratio: 1, alt: 'Render de área social con bar, cielo raso de madera y mesón de mármol' },
    { id: media.reales.interiores[5], kind: 'real', ratio: 0.75, alt: 'Sala terminada con pared de piedra natural verde y sillones claros' },
    { id: media.renders.dormitorios[15], kind: 'render', ratio: 1, alt: 'Render de dormitorio principal con cabecera de madera e iluminación cálida' },
    { id: media.reales.obra[6], kind: 'real', ratio: 0.81, alt: 'Fachada posterior con piscina en la etapa final de la obra' },
    { id: media.renders.banos[0], kind: 'render', ratio: 1, alt: 'Render de baño con doble lavamanos, espejos ovalados y mármol claro' },
    { id: media.reales.interiores[8], kind: 'real', ratio: 0.75, alt: 'Comedor terminado con mesa de mármol, sillas claras y lámparas colgantes' },
    { id: media.renders.sociales[17], kind: 'render', ratio: 1, alt: 'Render de comedor con mesa de mármol y cielo raso de madera iluminado' },
    { id: media.reales.piscinas[0], kind: 'real', ratio: 0.81, alt: 'Terraza techada con cocina exterior y vista a la piscina' },
  ] as GalleryItem[],
  cta: 'Quiero ver mi proyecto así',
}

export const fit = {
  eyebrow: 'Un filtro honesto',
  title: 'Esto no es para todo el mundo. Y está bien.',
  yes: {
    title: 'Es para ti si',
    items: [
      `Quieres una remodelación integral: varios espacios de tu casa a la vez.`,
      'Planeas una ampliación importante, como un segundo piso.',
      'Tienes una casa antigua que necesita reestructurarse por completo.',
      `Tu proyecto parte desde ${facts.minProjectLabel}.`,
      'Quieres ver el proyecto completo, su alcance y su presupuesto antes de empezar.',
      'Buscas un solo equipo responsable de principio a fin, incluida la parte legal si tu casa lo necesita.',
    ],
  },
  no: {
    title: 'No es para ti si',
    items: [
      'Necesitas renovar un solo ambiente puntual. Eso lo podemos hablar en otro momento.',
      'Tu único criterio es quién te cobra menos.',
    ],
    warning:
      'Quien elige solo por precio suele terminar con una versión de lo que vivió Alejandra: un presupuesto que crece sin control y una obra que no sabes cuándo va a terminar.',
  },
  closing: 'Esto es para quienes quieren transformar su casa de verdad, no un solo espacio suelto.',
  cta: 'Mi proyecto sí es para esto',
}

export const start = {
  eyebrow: 'Cómo empezamos',
  title: `El primer paso cuesta ${visit} y ya es criterio profesional.`,
  steps: [
    {
      price: visit,
      priceNote: 'Visita técnica',
      title: 'Asesoría, levantamiento y diagnóstico',
      text: 'No es solo que alguien vaya a medir: es el primer criterio profesional aplicado a tu proyecto. Te pediremos que seas transparente con tu presupuesto. No es para limitarte, es al contrario: así te recomendamos las mejores opciones según tus gustos y lo que puedes invertir.',
    },
    {
      price: design,
      priceNote: `Diseño en render 3D · pagas ${balance}`,
      title: 'Tu proyecto completo, antes de construirlo',
      text: `Si decides avanzar, pasamos al diseño completo en render 3D. De los ${design} ya se descuentan los ${visit} de la visita: pagas ${balance} adicionales por un diseño terminado. Mientras esté en proceso, antes de que lo apruebes, pides los ajustes que necesites.`,
    },
    {
      price: 'Obra',
      priceNote: 'Alcance y tiempos definidos',
      title: 'Se construye lo que aprobaste',
      text: 'Una vez que apruebas el diseño, ese es el diseño con el que avanzamos a la obra. Esa es la diferencia entre construir a ciegas y construir con dirección.',
    },
  ],
  cta: 'Quiero dar el primer paso',
}

export const guarantees = {
  eyebrow: 'Garantías y control',
  title: 'Nunca te enterarás de un cambio cuando ya está hecho.',
  items: [
    {
      icon: 'fa-solid fa-file-signature',
      title: 'Imprevistos autorizados por ti',
      text: 'Si tu casa es antigua y aparecen imprevistos técnicos reales, te lo informamos y lo autorizamos contigo antes de ejecutarlo.',
    },
    {
      icon: 'fa-solid fa-scale-balanced',
      title: 'Control de costos',
      text: 'Llevamos el control de costos durante toda la obra, no solo al inicio.',
    },
    {
      icon: 'fa-solid fa-shield-halved',
      title: `${facts.warrantyYears} año de garantía`,
      text: 'Al cierre de cada proyecto. No te dejamos solo apenas te entregamos la obra. Y con la forma en que trabajamos, casi nunca hace falta usarla.',
    },
  ],
  proof: `Es el mismo nivel de planificación y de responsabilidad con el que hemos trabajado en proyectos para empresas como ${clients}.`,
  image: {
    id: media.reales.piscinas[2]!,
    alt: 'Casa de dos plantas entregada por Construmia, con piscina y jardín terminados',
  },
}

export const faq = {
  eyebrow: 'Preguntas frecuentes',
  title: 'Lo que suelen preguntarnos antes de empezar.',
  items: [
    {
      q: '¿Qué tipo de proyectos toman?',
      a: `Remodelaciones integrales de varios espacios de tu casa a la vez, ampliaciones importantes o la reestructuración completa de una casa antigua. Hablamos de proyectos a partir de ${facts.minProjectLabel}.`,
    },
    {
      q: '¿Y si solo quiero renovar un ambiente?',
      a: 'Este proceso no está pensado para un solo ambiente puntual. Eso lo podemos hablar en otro momento.',
    },
    {
      q: `¿Qué incluye la visita técnica de ${visit}?`,
      a: 'Asesoría, levantamiento y diagnóstico. No es solo que alguien vaya a medir: es el primer criterio profesional aplicado a tu proyecto.',
    },
    {
      q: '¿Por qué me van a preguntar cuánto puedo invertir?',
      a: 'No es para limitarte, es al contrario. Con ese dato te recomendamos las mejores opciones según tus gustos y tus necesidades, en vez de mostrarte algo que después no se ajusta a lo que puedes invertir.',
    },
    {
      q: '¿Cuánto cuesta el diseño en render 3D?',
      a: `${design}, de los que ya se descuentan los ${visit} de la visita técnica. Pagas ${balance} adicionales por un diseño terminado.`,
    },
    {
      q: '¿Puedo pedir cambios al diseño?',
      a: 'Sí. Mientras el diseño esté en proceso, antes de que lo apruebes, puedes pedir los ajustes que necesites. Una vez aprobado, ese es el diseño con el que avanzamos a la obra, con alcance y tiempos definidos.',
    },
    {
      q: '¿Qué pasa si aparecen imprevistos durante la obra?',
      a: 'Si son imprevistos técnicos reales, como puede pasar en una casa antigua, te lo informamos y lo autorizamos contigo antes de ejecutarlo. Además llevamos el control de costos durante toda la obra.',
    },
    {
      q: '¿Se encargan también de la parte legal?',
      a: 'Sí. Hay un solo equipo responsable de principio a fin, incluyendo la parte legal si tu casa lo necesita.',
    },
    {
      q: '¿Qué garantía tiene la obra?',
      a: `${facts.warrantyYears} año de garantía al cierre de cada proyecto.`,
    },
  ],
}

export const finalCta = {
  eyebrow: 'El siguiente paso',
  title: 'Construir a ciegas o construir con dirección.',
  lead: 'No estás contratando a alguien para que te remodele. Estás contratando a un equipo que sabe llevar tu proyecto desde una idea hasta una obra terminada.',
  cta: 'Quiero ver el método',
  formNote: '¿Prefieres dejar tus datos aquí mismo? Completa el formulario.',
  note: `Registro sin costo · Visita técnica ${visit}`,
  image: {
    id: media.renders.exteriores[6]!,
    alt: 'Render de fachada de casa de dos plantas con madera, piedra y palmeras al anochecer',
  },
}

export const stickyCta = {
  text: `Proyectos desde ${facts.minProjectLabel}`,
  cta: 'Quiero ver el método',
}
