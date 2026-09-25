/**
 * Datos de la marca y del negocio: lo que es un hecho (precios, cuentas, contacto, embeds)
 * vive acá. El copy de cada página está en `src/config/copy/`.
 * Todo sale del video del método y de la tarjeta del cliente: no inventar cifras nuevas.
 */
export const site = {
  name: 'Construmia',
  legalName: 'Construmia — Construcción y Remodelación',
  tagline: 'Construcción y remodelación',
  description:
    'Diseño y construcción bajo un mismo equipo. Remodelaciones integrales, ampliaciones y casas antiguas desde $30.000.',
  url: 'https://mkt.construmia.com',
  email: 'team@construmia.com',
  phoneDisplay: '+593 99 369 7927',
  // Solo dígitos con código de país
  whatsapp: '593993697927',
  social: {
    instagram: 'https://www.instagram.com/construmia',
    instagramHandle: '@construmia',
  },
  logo: '/logo-construmia.png',
  isotype: '/isotipo-construmia.png',
} as const

/** Cifras y promesas que aparecen en el video. Son la única fuente para el copy. */
export const facts = {
  method: 'Método Construmia 380',
  minProject: 30000,
  minProjectLabel: '$30.000',
  visitPrice: 50,
  designPrice: 250,
  designBalance: 200,
  warrantyYears: 1,
  corporateClients: ['Nestlé', 'Pronaca'],
  designer: 'Miguel',
  steps: [
    'Diagnóstico',
    'Diseño',
    'Planificación',
    'Presupuesto',
    'Ejecución',
    'Supervisión',
    'Entrega',
    'Garantía',
  ],
} as const

export const embeds = {
  wistiaMediaId: '0ld5ut4g1o',
  bookingUrl: 'https://api.leadconnectorhq.com/widget/booking/l0bCmtWlb9ToCBnMdsPL',
  bookingScript: 'https://link.msgsndr.com/js/form_embed.js',
  /** Segundos que dura el contador de la página del video. */
  unlockSeconds: 120,
  /** Segundos de adelanto del video en la home antes de pedir el registro. */
  previewSeconds: 3,
} as const

/** Cuentas para transferencia. `domain` alimenta el logo (logo.dev). */
export const bankTransfer = {
  holder: 'Miguel Angel Coronel',
  holderId: '0926232463',
  email: 'miguelcoronelcastello@gmail.com',
  accounts: [
    { bank: 'Produbanco', type: 'Cuenta corriente', number: '02017027353', domain: 'produbanco.com.ec' },
    { bank: 'Banco Guayaquil', type: 'Cuenta de ahorros', number: '0015637035', domain: 'bancoguayaquil.com' },
    { bank: 'Banco Pichincha', type: 'Cuenta corriente', number: '2100119282', domain: 'pichincha.com' },
    { bank: 'Banco Internacional', type: 'Cuenta corriente', number: '1000651284', domain: 'bancointernacional.com.ec' },
  ],
} as const

export function bankLogo(domain: string): string | null {
  const token = import.meta.env.VITE_LOGO_DEV_TOKEN
  return token ? `https://img.logo.dev/${domain}?token=${token}&size=96&format=png` : null
}

export function whatsappLink(message = 'Hola, quiero información sobre mi proyecto'): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`
}
