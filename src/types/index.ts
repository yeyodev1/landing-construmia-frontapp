/** Forma con la que httpBase rechaza cualquier error del API. */
export interface ApiError {
  status: number
  message: string
  data?: unknown
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pages: number
}

/** Lo que devuelve el backapp en /auth/login y /auth/me. */
export interface SessionUser {
  id: string
  email: string
  name: string
  phone: string
  accountType: 'customer' | 'admin' | string
}

// ─── Embudo de Construmia ────────────────────────────────────────────────

export type LeadStage = 'contacto' | 'cualificacion' | 'pago'

/** Señales de comportamiento que el CRM recibe en las notas del lead. */
export interface LeadMeta {
  timeOnPageSeconds: number
  device: 'mobile' | 'desktop'
}

export interface UtmParams {
  source?: string
  medium?: string
  campaign?: string
  content?: string
  term?: string
}

/** POST /leads */
export interface LeadContactPayload {
  firstName: string
  lastName: string
  email: string
  /** ISO-3166 alpha-2 del selector, ej. 'EC' */
  phoneCountry: string
  /** Prefijo con +, ej. '+593' */
  phoneDial: string
  /** Número nacional, solo dígitos, sin el 0 inicial */
  phone: string
  startTimeframe: string
  commitment: boolean
  utm?: UtmParams
  pageUrl?: string
  meta?: LeadMeta
}

/** PUT /leads/:id/qualification */
export interface QualificationAnswers {
  projectType: string
  budget: string
  propertyStatus: string
  location: string
  decisionMaker: string
}

/** Lo que el API devuelve de un lead: nunca más de lo que el navegador necesita. */
export interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneE164: string
  stage: LeadStage
  qualified: boolean | null
  paid: boolean
}

/** GET /leads/recent → `{ items, total }`; `total` = registros reales acumulados. */
export interface RecentActivity {
  firstName: string
  location: string
  action: 'registro' | 'cualificacion' | 'pago'
  at: string
}

/** POST /payments — configuración lista para `new PPaymentButtonBox(...)`. */
export interface PaymentBoxConfig {
  token: string
  storeId: string
  clientTransactionId: string
  amount: number
  amountWithoutTax: number
  currency: 'USD'
  reference: string
  email: string
  phoneNumber: string
}

/** POST /payments/confirm */
export interface PaymentConfirmation {
  status: 'paid' | 'canceled' | 'pending'
  lead: Lead | null
  message: string
}
