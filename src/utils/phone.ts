import { parsePhoneNumberFromString, type CountryCode } from 'libphonenumber-js/mobile'

export interface ParsedPhone {
  /** País que sale del número (con "+34…" manda España aunque esté elegido Ecuador). */
  country: string
  /** Número nacional sin el 0 de marcado local: "995254965". */
  national: string
  /** "+593995254965": lo que se guarda y usa WhatsApp. */
  e164: string
  /** "+593 99 525 4965": lo que se le muestra a la persona. */
  international: string
}

/**
 * "0995254965", "995254965", "593995254965" y "+593 99 525 4965" son el mismo número.
 * La metadata "mobile" solo acepta celulares que existan en el plan de numeración del
 * país: un fijo o un número con dígitos de más o de menos no pasa.
 */
export function parsePhone(raw: string, country: string): ParsedPhone | null {
  const clean = raw.replace(/[^\d+]/g, '')
  if (!clean) return null
  const parsed = parsePhoneNumberFromString(clean, country as CountryCode)
  if (!parsed?.isValid() || !parsed.country) return null
  return {
    country: parsed.country,
    national: String(parsed.nationalNumber),
    e164: String(parsed.number),
    international: parsed.formatInternational(),
  }
}
