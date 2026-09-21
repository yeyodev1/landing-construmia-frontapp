import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { paymentService } from '@/services/payment.service'
import { useLeadStore } from '@/stores/lead'
import { payphoneCopy } from '@/config/copy/checkout'
import type { ApiError, PaymentConfirmation } from '@/types'

const BOX_CSS = 'https://cdn.payphonetodoesposible.com/box/v2.0/payphone-payment-box.css'
const BOX_JS = 'https://cdn.payphonetodoesposible.com/box/v2.0/payphone-payment-box.js'
/** Payphone vence el formulario a los 10 minutos: se renueva un poco antes para no cobrar sobre una orden muerta. */
const FORM_LIFETIME_MS = 10 * 60 * 1000 - 15 * 1000

export type PayphoneStatus = 'loading' | 'ready' | 'error' | 'unavailable'

// Estado de módulo: los recursos de la Cajita se insertan una sola vez por pestaña.
let assetsPromise: Promise<void> | null = null

function loadAssets(): Promise<void> {
  if (assetsPromise) return assetsPromise

  assetsPromise = new Promise<void>((resolve, reject) => {
    if (!document.querySelector(`link[href="${BOX_CSS}"]`)) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = BOX_CSS
      document.head.appendChild(link)
    }

    if (typeof PPaymentButtonBox !== 'undefined') return resolve()

    const script = document.createElement('script')
    script.type = 'module'
    script.src = BOX_JS
    script.onload = () => resolve()
    script.onerror = () => {
      script.remove()
      reject({ status: 0, message: payphoneCopy.error.fallback } satisfies ApiError)
    }
    document.head.appendChild(script)
  }).catch((error) => {
    // Un fallo de red no debe quedar cacheado: el reintento vuelve a pedir el script.
    assetsPromise = null
    throw error
  })

  return assetsPromise
}

/**
 * Monta la Cajita de Pagos en `containerId`: crea la orden, carga los recursos, renderiza
 * y lleva la cuenta de los 10 minutos de vida del formulario.
 */
export function usePayphone(containerId: string) {
  const leadStore = useLeadStore()
  const status = ref<PayphoneStatus>('loading')
  const errorMessage = ref('')
  const renewed = ref(false)
  const remainingMs = ref(FORM_LIFETIME_MS)

  let deadline = 0
  let ticker: number | undefined
  let observer: MutationObserver | null = null
  let readyFallback: number | undefined
  // Cada arranque invalida al anterior: una respuesta vieja no pisa a una orden nueva.
  let run = 0

  const remainingLabel = computed(() => {
    const total = Math.max(0, Math.ceil(remainingMs.value / 1000))
    return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
  })
  const expiringSoon = computed(() => remainingMs.value <= 60 * 1000)

  function stopWatchers() {
    window.clearInterval(ticker)
    window.clearTimeout(readyFallback)
    observer?.disconnect()
    observer = null
  }

  function startCountdown() {
    deadline = Date.now() + FORM_LIFETIME_MS
    remainingMs.value = FORM_LIFETIME_MS
    // Se compara contra la hora real: en segundo plano el navegador frena los intervalos.
    ticker = window.setInterval(() => {
      remainingMs.value = deadline - Date.now()
      if (remainingMs.value <= 0) start(true)
    }, 1000)
  }

  /** La Cajita pinta su interior de forma asíncrona: el skeleton se va cuando ya hay contenido. */
  function waitForContent(container: HTMLElement, current: number) {
    const done = () => {
      if (current !== run) return
      observer?.disconnect()
      window.clearTimeout(readyFallback)
      status.value = 'ready'
    }
    if (container.childElementCount > 0) return done()
    observer = new MutationObserver(() => container.childElementCount > 0 && done())
    observer.observe(container, { childList: true })
    readyFallback = window.setTimeout(done, 6000)
  }

  async function start(isRenewal = false) {
    const current = ++run
    stopWatchers()
    status.value = 'loading'
    errorMessage.value = ''
    renewed.value = isRenewal

    const leadId = leadStore.lead?.id
    if (!leadId) {
      status.value = 'error'
      errorMessage.value = payphoneCopy.noLead
      return
    }

    try {
      const [config] = await Promise.all([paymentService.create(leadId), loadAssets()])
      if (current !== run) return
      await nextTick()

      const container = document.getElementById(containerId)
      if (!container) return
      container.innerHTML = ''

      new PPaymentButtonBox({
        ...config,
        lang: 'es',
        defaultMethod: 'card',
        timeZone: -5,
      }).render(containerId)

      startCountdown()
      waitForContent(container, current)
    } catch (error) {
      if (current !== run) return
      const apiError = error as ApiError
      // 503: Payphone aún sin configurar en el servidor. No es un error de la persona.
      status.value = apiError.status === 503 ? 'unavailable' : 'error'
      errorMessage.value = apiError.message || payphoneCopy.error.fallback
    }
  }

  onMounted(() => start())

  onBeforeUnmount(() => {
    run++
    stopWatchers()
    const container = document.getElementById(containerId)
    if (container) container.innerHTML = ''
  })

  return { status, errorMessage, renewed, remainingLabel, expiringSoon, retry: () => start() }
}

// ─── Confirmación en /pago/respuesta ─────────────────────────────────────

const confirmations = new Map<string, Promise<PaymentConfirmation>>()

/**
 * Confirma un pago una sola vez por transacción aunque la vista se monte de nuevo.
 * Un fallo sí se puede reintentar: la promesa rechazada no se queda guardada.
 */
export function confirmPaymentOnce(id: string, clientTransactionId: string): Promise<PaymentConfirmation> {
  const key = `${id}:${clientTransactionId}`
  const cached = confirmations.get(key)
  if (cached) return cached

  const request = paymentService.confirm(id, clientTransactionId).then(
    (result) => {
      // "pending" no es definitivo: la siguiente consulta debe volver al servidor.
      if (result.status === 'pending') confirmations.delete(key)
      return result
    },
    (error) => {
      confirmations.delete(key)
      throw error
    },
  )
  confirmations.set(key, request)
  return request
}
