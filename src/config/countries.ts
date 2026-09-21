/** Países del selector de teléfono. Ecuador primero: es el mercado. Banderas por flagcdn (sin emojis). */
export interface Country {
  code: string
  name: string
  dial: string
  /** Dígitos del número nacional sin el 0 inicial */
  min: number
  max: number
}

export const countries: Country[] = [
  { code: 'EC', name: 'Ecuador', dial: '+593', min: 8, max: 9 },
  { code: 'US', name: 'Estados Unidos', dial: '+1', min: 10, max: 10 },
  { code: 'ES', name: 'España', dial: '+34', min: 9, max: 9 },
  { code: 'CO', name: 'Colombia', dial: '+57', min: 10, max: 10 },
  { code: 'PE', name: 'Perú', dial: '+51', min: 9, max: 9 },
  { code: 'PA', name: 'Panamá', dial: '+507', min: 7, max: 8 },
  { code: 'MX', name: 'México', dial: '+52', min: 10, max: 10 },
  { code: 'CL', name: 'Chile', dial: '+56', min: 9, max: 9 },
  { code: 'AR', name: 'Argentina', dial: '+54', min: 10, max: 11 },
  { code: 'VE', name: 'Venezuela', dial: '+58', min: 10, max: 10 },
  { code: 'CA', name: 'Canadá', dial: '+1', min: 10, max: 10 },
  { code: 'IT', name: 'Italia', dial: '+39', min: 9, max: 10 },
  { code: 'GB', name: 'Reino Unido', dial: '+44', min: 10, max: 10 },
  { code: 'DE', name: 'Alemania', dial: '+49', min: 10, max: 11 },
  { code: 'FR', name: 'Francia', dial: '+33', min: 9, max: 9 },
  { code: 'BR', name: 'Brasil', dial: '+55', min: 10, max: 11 },
  { code: 'UY', name: 'Uruguay', dial: '+598', min: 8, max: 8 },
  { code: 'BO', name: 'Bolivia', dial: '+591', min: 8, max: 8 },
  { code: 'CR', name: 'Costa Rica', dial: '+506', min: 8, max: 8 },
  { code: 'DO', name: 'República Dominicana', dial: '+1', min: 10, max: 10 },
]

export function flagUrl(code: string): string {
  return `https://flagcdn.com/w40/${code.toLowerCase()}.png`
}
