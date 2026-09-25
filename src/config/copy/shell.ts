import { facts } from '@/config/site'

/**
 * Copy del shell del embudo: header, footer, avisos de actividad y 404.
 * Solo hechos del video y de `facts`: acá no se inventan cifras ni nombres.
 */
export const headerCopy = {
  homeLabel: 'Construmia, ir al inicio',
  skipLink: 'Saltar al contenido',
  cta: 'Ver el método',
  ctaTarget: '#registro',
  progressLabel: 'Tu avance en el proceso',
  doneLabel: 'completado',
  steps: [
    { key: 'registro', label: 'Registro' },
    { key: 'video', label: 'Video' },
    { key: 'agenda', label: 'Agenda' },
  ],
} as const

export type FunnelStepKey = (typeof headerCopy.steps)[number]['key']

/**
 * Paso que marca el header según la ruta. `current: null` = ya no hay un paso activo
 * (en /gracias la persona terminó registro y video, pero no pasa a la agenda).
 */
export const stepByRoute: Record<string, { done: number; current: number | null }> = {
  Video: { done: 1, current: 1 },
  Pay: { done: 2, current: 2 },
  PayResponse: { done: 2, current: 2 },
  Schedule: { done: 2, current: 2 },
  Thanks: { done: 2, current: null },
}

export const footerCopy = {
  tagline: 'Diseño y construcción bajo un mismo equipo, del render a la realidad.',
  contactTitle: 'Contacto',
  processTitle: 'Cómo empezamos',
  process: `Una visita técnica de asesoría, levantamiento y diagnóstico de $${facts.visitPrice}, que se descuentan del diseño 3D.`,
  emailLabel: 'Escribir un correo a',
  instagramLabel: 'Instagram de Construmia',
  place: 'Guayaquil, Ecuador',
  rights: 'Todos los derechos reservados.',
  activityDisclaimer:
    'Los avisos de actividad marcados como «Ejemplo ilustrativo» son ilustrativos y no corresponden a personas reales.',
  credit: 'Hecho por',
  creditName: 'Bakano',
  creditUrl: 'https://bakano.ec',
} as const

export interface ActivityTip {
  id: string
  text: string
  /** Solo la vía rápida lleva enlace: a /pago si ya hay registro, a #registro si no. */
  fastTrack?: boolean
}

/**
 * Aviso de EJEMPLO: se muestra solo mientras haya menos de REAL_ACTIVITY_THRESHOLD registros reales
 * (decisión del cliente) y siempre con la etiqueta visible "Ejemplo ilustrativo".
 * Nombre de pila común + sector de la lista de ubicaciones; sin apellidos, fotos ni cifras.
 */
export interface ActivitySample {
  firstName: string
  /** `value` de la pregunta de ubicación en qualification.ts */
  location: string
  action: 'registro' | 'cualificacion' | 'pago'
}

export const activitySamples: ActivitySample[] = [
  { firstName: 'Andrea', location: 'quito', action: 'registro' },
  { firstName: 'Carlos', location: 'guayaquil', action: 'cualificacion' },
  { firstName: 'Gabriela', location: 'cuenca', action: 'registro' },
  { firstName: 'Jorge', location: 'quito', action: 'pago' },
  { firstName: 'Daniela', location: 'guayaquil', action: 'registro' },
  { firstName: 'Luis', location: 'cuenca', action: 'cualificacion' },
  { firstName: 'Fernanda', location: 'quito', action: 'cualificacion' },
  { firstName: 'Diego', location: 'guayaquil', action: 'registro' },
  { firstName: 'Paola', location: 'cuenca', action: 'registro' },
  { firstName: 'Xavier', location: 'quito', action: 'pago' },
  { firstName: 'Verónica', location: 'guayaquil', action: 'cualificacion' },
  { firstName: 'Andrés', location: 'guayaquil', action: 'registro' },
  { firstName: 'Karina', location: 'cuenca', action: 'registro' },
  { firstName: 'Roberto', location: 'guayaquil', action: 'cualificacion' },
]

export const activityCopy = {
  regionLabel: 'Avisos de Construmia',
  close: 'Cerrar avisos',
  eyebrowActivity: 'Actividad reciente',
  eyebrowTip: 'Bueno saberlo',
  /** Va visible dentro de cada aviso de ejemplo. No se abrevia ni se esconde. */
  sampleLabel: 'Ejemplo ilustrativo',
  fastTrackLink: 'Agendar directo',
  /** Qué hizo la persona, según `RecentActivity.action`. Siempre en pasado y verificable. */
  actions: {
    registro: 'se registró para conocer el método',
    cualificacion: 'completó el perfil de su proyecto',
    pago: 'reservó su visita técnica',
  },
  /** Mensajes informativos verdaderos: se intercalan con la actividad (real o de ejemplo). */
  tips: [
    {
      id: 'garantia',
      text: `Cada proyecto se entrega con ${facts.warrantyYears} año de garantía.`,
    },
    {
      id: 'descuento',
      text: `Los $${facts.visitPrice} de la visita técnica se descuentan de tu diseño 3D.`,
    },
    {
      id: 'via-rapida',
      text: 'Puedes agendar directo pagando tu visita técnica y saltarte 4 pasos.',
      fastTrack: true,
    },
  ] as ActivityTip[],
  time: {
    now: 'hace un momento',
    minutes: (n: number) => `hace ${n} min`,
    hours: (n: number) => `hace ${n} h`,
    yesterday: 'ayer',
    days: (n: number) => `hace ${n} días`,
  },
} as const

export const notFoundCopy = {
  eyebrow: 'Error 404',
  title: 'Aquí todavía no hemos construido nada',
  text: 'El enlace está mal escrito o la página ya no existe. Tu proyecto sí tiene por dónde empezar.',
  cta: 'Volver al inicio',
  ctaRegistered: 'Continuar donde me quedé',
  imageAlt: 'Estructura de hormigón de una casa de dos plantas en plena obra, junto a un lago',
  imageCaption: 'Obra en proceso',
} as const
