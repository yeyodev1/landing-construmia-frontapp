import { facts } from '@/config/site'

/**
 * Copy de /video: el video del método, el contador, la cualificación y la vía rápida.
 * Solo hechos del video y de `facts`: acá no se inventan cifras ni promesas.
 */
const visit = `$${facts.visitPrice}`
const design = `$${facts.designPrice}`
const balance = `$${facts.designBalance}`

export const videoCopy = {
  hero: {
    eyebrow: facts.method,
    greeting: (firstName: string) =>
      firstName ? `${firstName}, tu registro está listo.` : 'Tu registro está listo.',
    title: 'Mira el video completo antes de dar el siguiente paso.',
    lead: 'La diseñadora de Construmia te cuenta el caso de Alejandra y por qué acá diseño y construcción nunca son dos procesos separados. Sube el volumen.',
  },

  notice: {
    qualified: 'Tu proyecto ya fue revisado. Puedes elegir el día de tu visita técnica.',
    paid: 'Tu visita técnica ya está pagada. Solo falta elegir el día.',
    cta: 'Ir a agendar',
  },

  player: {
    /** Viene de la vista previa de la home: el video retoma en el segundo donde se quedó. */
    resumed: 'Seguimos donde lo dejaste',
    label: 'Video del método Construmia 380',
    loading: 'Cargando el video',
    error: 'No pudimos cargar el video. Revisa tu conexión.',
    retry: 'Cargar otra vez',
  },

  countdown: {
    runningLabel: 'El siguiente paso se habilita en',
    runningHint:
      'Aprovecha para ver el video: ahí está todo lo que necesitas saber antes de hablar con nosotros.',
    doneLabel: 'Siguiente paso habilitado',
    doneTitle: 'Listo. Un experto puede tomar tu caso.',
    doneHint:
      'Son unas pocas preguntas de un solo toque. Con eso revisamos si tu proyecto encaja con el método.',
    button: 'Quiero que me atienda un experto',
    buttonWait: (time: string) => `Disponible en ${time}`,
    /** Lo que escucha un lector de pantalla: cada 30 s y al terminar, nunca cada segundo. */
    announce: (minutes: number, seconds: number) => {
      const parts: string[] = []
      if (minutes > 0) parts.push(minutes === 1 ? '1 minuto' : `${minutes} minutos`)
      if (seconds > 0) parts.push(`${seconds} segundos`)
      return `Faltan ${parts.join(' y ')} para habilitar el siguiente paso.`
    },
    announceDone: 'El siguiente paso ya está habilitado. Puedes pedir que te atienda un experto.',
  },

  qualify: {
    dialogLabel: 'Cuéntanos de tu proyecto',
    progress: (current: number, total: number) => `${current} de ${total}`,
    back: 'Atrás',
    close: 'Cerrar',
    keyboardHint: (count: number) => `También puedes responder con las teclas 1 a ${count}.`,
    reviewingTitle: 'Revisando tu proyecto…',
    reviewingHint: 'Estamos guardando tus respuestas.',
    successTitle: 'Tu proyecto encaja con el método.',
    successHint: 'Te llevamos a la agenda para que elijas el día de tu visita técnica.',
    errorTitle: 'No pudimos guardar tus respuestas.',
    errorHint: 'Tus respuestas siguen aquí. Revisa tu conexión e inténtalo otra vez.',
    errorFallback: 'No pudimos guardar tus respuestas. Inténtalo otra vez.',
    retry: 'Reintentar',
    review: 'Revisar mis respuestas',
  },

  fastLane: {
    seal: 'Vía rápida',
    title: 'Agenda directo y sáltate 4 pasos',
    lead: `Paga hoy tu visita técnica de ${visit} y elige el día de inmediato.`,
    skippedTitle: 'Lo que te saltas',
    // Los cuatro pasos del camino normal, en el orden en que ocurren.
    skipped: [
      'Esperar el contador',
      'El formulario de cualificación',
      'La revisión de tu caso por un asesor',
      'La llamada de confirmación',
    ],
    priceLabel: 'Visita técnica',
    price: visit,
    priceNote: 'Asesoría, levantamiento y diagnóstico en tu propiedad.',
    discount: `Los ${visit} se descuentan del diseño completo en render 3D: de ${design}, pagas ${balance} adicionales.`,
    cta: 'Pagar la visita y agendar',
  },

  trust: {
    eyebrow: 'Del render a la realidad',
    title: 'Un equipo responsable de llevar tu proyecto hasta la entrega.',
    stages: [
      {
        key: 'render',
        caption: 'Render 3D',
        alt: 'Render 3D de una cocina con isla de mármol y lámparas colgantes',
      },
      {
        key: 'obra',
        caption: 'En obra',
        alt: 'La misma cocina en obra, con el piso instalado y la campana ya colgada',
      },
      {
        key: 'real',
        caption: 'Entregada',
        alt: 'Cocina terminada con isla de mármol y frente de listones',
      },
    ],
    facts: [
      'Diseño y construcción bajo un mismo equipo, de principio a fin.',
      `${facts.warrantyYears} año de garantía al cierre de cada proyecto.`,
      `El mismo nivel de planificación que en proyectos para ${facts.corporateClients.join(' y ')}.`,
    ],
  },
} as const
