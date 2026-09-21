import { computed, nextTick, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLeadStore } from '@/stores/lead'
import { useToastStore } from '@/stores/toast'
import { DEFAULT_COUNTRY, findCountry } from '@/composables/useCountryPicker'
import { usePageTime } from '@/composables/usePageTime'
import { useLeadModal } from '@/composables/useLeadModal'
import { form as copy } from '@/config/copy/landing'
import type { ApiError, LeadContactPayload, UtmParams } from '@/types'

export type LeadField =
  | 'projectType'
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'phone'
  | 'startTimeframe'
  | 'commitment'

// En orden de pantalla: el foco va al primero que falló.
const FIELDS: LeadField[] = [
  'projectType',
  'firstName',
  'lastName',
  'email',
  'phone',
  'startTimeframe',
  'commitment',
]

const UTM_KEY = 'construmia_utm'
const LANDING_URL_KEY = 'construmia_landing_url'
const UTM_NAMES = ['source', 'medium', 'campaign', 'content', 'term'] as const
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Número nacional: solo dígitos y sin el 0 inicial ("099 123 4567" → "991234567"). */
export function toNationalNumber(raw: string): string {
  return raw.replace(/\D/g, '').replace(/^0+/, '')
}

/**
 * Los UTM llegan en la URL del anuncio. Se guardan en sessionStorage apenas carga la
 * página: si la persona navega o recarga sin ellos, el registro igual los conserva.
 */
function captureAttribution(): { utm: UtmParams; pageUrl: string } {
  const utm: UtmParams = {}
  const params = new URLSearchParams(window.location.search)
  UTM_NAMES.forEach((name) => {
    const value = params.get(`utm_${name}`)?.trim()
    if (value) utm[name] = value.slice(0, 200)
  })

  try {
    if (Object.keys(utm).length) {
      sessionStorage.setItem(UTM_KEY, JSON.stringify(utm))
      sessionStorage.setItem(LANDING_URL_KEY, window.location.href)
    } else {
      const saved = sessionStorage.getItem(UTM_KEY)
      if (saved) Object.assign(utm, JSON.parse(saved) as UtmParams)
    }
    const pageUrl = sessionStorage.getItem(LANDING_URL_KEY) || window.location.href
    return { utm, pageUrl }
  } catch {
    // Safari privado o storage bloqueado: se registra igual, con lo que haya en la URL.
    return { utm, pageUrl: window.location.href }
  }
}

export interface LeadFormOptions {
  /** Tipo de proyecto ya elegido en el paso 1 del modal: el formulario no lo vuelve a pedir. */
  projectType?: () => string | undefined
}

export function useLeadForm(idPrefix: string, options: LeadFormOptions = {}) {
  const router = useRouter()
  const { videoRoute } = useLeadModal()
  const leadStore = useLeadStore()
  const toastStore = useToastStore()
  const attribution = captureAttribution()
  // Tiempo visible en la landing hasta que se registra: el CRM lo lee como interés.
  const pageTime = usePageTime()

  const values = reactive({
    projectType: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneCountry: DEFAULT_COUNTRY.code,
    phone: '',
    startTimeframe: '',
    commitment: false,
  })

  const errors = reactive<Record<LeadField, string>>({
    projectType: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    startTimeframe: '',
    commitment: '',
  })

  const touched = reactive<Record<LeadField, boolean>>({
    projectType: false,
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    startTimeframe: false,
    commitment: false,
  })

  const loading = ref(false)
  const summary = ref('')
  /** La persona ya registrada puede pedir el formulario para dejar otros datos. */
  const editing = ref(false)

  const country = computed(() => findCountry(values.phoneCountry))
  const showResume = computed(() => leadStore.isRegistered && !editing.value)
  const resumeName = computed(() => leadStore.lead?.firstName ?? '')
  const fixedProjectType = computed(() => options.projectType?.() || '')
  /** Sin tipo elegido antes (formulario inline), el select es el primer campo. */
  const asksProjectType = computed(() => !fixedProjectType.value)
  const fields = computed(() =>
    asksProjectType.value ? FIELDS : FIELDS.filter((field) => field !== 'projectType'),
  )

  function messageFor(field: LeadField): string {
    switch (field) {
      case 'projectType':
        return fixedProjectType.value || values.projectType ? '' : copy.errors.projectType
      case 'firstName':
        return values.firstName.trim().length >= 2 ? '' : copy.errors.firstName
      case 'lastName':
        return values.lastName.trim().length >= 2 ? '' : copy.errors.lastName
      case 'email': {
        const email = values.email.trim()
        if (!email) return copy.errors.emailRequired
        return EMAIL_PATTERN.test(email) ? '' : copy.errors.emailInvalid
      }
      case 'phone': {
        const digits = toNationalNumber(values.phone)
        if (!digits) return copy.errors.phoneRequired
        const { min, max, name } = country.value
        return digits.length >= min && digits.length <= max
          ? ''
          : copy.errors.phoneLength(min, max, name)
      }
      case 'startTimeframe':
        return values.startTimeframe ? '' : copy.errors.startTimeframe
      case 'commitment':
        return values.commitment ? '' : copy.errors.commitment
    }
  }

  function validate(field: LeadField): boolean {
    errors[field] = messageFor(field)
    return !errors[field]
  }

  /** Al salir del campo: desde acá ese campo se valida en vivo. */
  function blur(field: LeadField) {
    touched[field] = true
    if (field === 'phone') values.phone = toNationalNumber(values.phone)
    validate(field)
  }

  /** Mientras escribe solo se revalida lo que ya se mostró con error: no se regaña antes de tiempo. */
  function input(field: LeadField) {
    if (touched[field]) validate(field)
  }

  /** Cambiar de país cambia la regla de dígitos del teléfono. */
  function countryChanged() {
    if (touched.phone) validate('phone')
  }

  function fieldId(field: LeadField): string {
    return `${idPrefix}-${field}`
  }

  function buildPayload(): LeadContactPayload {
    return {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim().toLowerCase(),
      phoneCountry: country.value.code,
      phoneDial: country.value.dial,
      phone: toNationalNumber(values.phone),
      startTimeframe: values.startTimeframe,
      projectType: fixedProjectType.value || values.projectType,
      commitment: values.commitment,
      utm: attribution.utm,
      pageUrl: attribution.pageUrl,
      meta: pageTime.meta(),
    }
  }

  async function submit() {
    if (loading.value) return

    fields.value.forEach((field) => (touched[field] = true))
    // Se validan todos (para marcar cada error), y el foco va al primero que falló.
    const firstInvalid = fields.value.map((field) => (validate(field) ? null : field)).find(Boolean)
    if (firstInvalid) {
      summary.value = copy.errors.summary
      await nextTick()
      document.getElementById(fieldId(firstInvalid))?.focus()
      return
    }

    summary.value = ''
    loading.value = true
    try {
      await leadStore.register(buildPayload())
      await router.push(videoRoute())
    } catch (error) {
      toastStore.error((error as ApiError)?.message || copy.errors.fallback)
    } finally {
      loading.value = false
    }
  }

  function resume() {
    router.push(leadStore.canSchedule ? { name: 'Schedule' } : videoRoute())
  }

  return {
    values,
    errors,
    loading,
    summary,
    editing,
    country,
    showResume,
    resumeName,
    asksProjectType,
    blur,
    input,
    countryChanged,
    fieldId,
    submit,
    resume,
  }
}
