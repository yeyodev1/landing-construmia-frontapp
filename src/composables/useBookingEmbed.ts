import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { embeds } from '@/config/site'
import { useLeadStore } from '@/stores/lead'

/** Si la agenda no avisa que cargó en este tiempo, se ofrece la salida por WhatsApp. */
const SLOW_MS = 12000

// Estado de módulo: el script de LeadConnector se inserta una sola vez por pestaña.
let scriptInjected = false
let embedCount = 0

/**
 * form_embed.js escucha los mensajes del iframe y le ajusta el alto. Basta con que esté
 * en la página una vez: los iframes que aparecen después también los atiende.
 */
function loadBookingScript() {
  if (scriptInjected || document.querySelector(`script[src="${embeds.bookingScript}"]`)) {
    scriptInjected = true
    return
  }
  const script = document.createElement('script')
  script.src = embeds.bookingScript
  script.async = true
  // Un fallo de red se puede reintentar en la próxima visita a la agenda.
  script.onerror = () => {
    script.remove()
    scriptInjected = false
  }
  document.body.appendChild(script)
  scriptInjected = true
}

/** Calendario de LeadConnector: id único, datos del lead precargados y estado de carga. */
export function useBookingEmbed() {
  const leadStore = useLeadStore()

  // El id sigue el formato del embed oficial: <calendarId>_<n>.
  const calendarId = embeds.bookingUrl.split('/').pop() ?? 'booking'
  const iframeId = `${calendarId}_${Date.now()}${++embedCount}`

  const loaded = ref(false)
  const slow = ref(false)
  let slowTimer: number | undefined

  // Nombre, correo y teléfono ya los dio en el registro: no se le piden otra vez.
  const src = computed(() => {
    const lead = leadStore.lead
    if (!lead) return embeds.bookingUrl
    const params = new URLSearchParams({
      first_name: lead.firstName,
      last_name: lead.lastName,
      email: lead.email,
      phone: lead.phoneE164,
    })
    return `${embeds.bookingUrl}?${params.toString()}`
  })

  function onLoad() {
    loaded.value = true
    slow.value = false
    window.clearTimeout(slowTimer)
  }

  onMounted(() => {
    loadBookingScript()
    slowTimer = window.setTimeout(() => {
      if (!loaded.value) slow.value = true
    }, SLOW_MS)
  })

  onBeforeUnmount(() => window.clearTimeout(slowTimer))

  return { iframeId, src, loaded, slow, onLoad }
}
