import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, type RouteLocationRaw } from 'vue-router'
import { leadService } from '@/services/lead.service'
import { useLeadStore } from '@/stores/lead'
import { useToastStore } from '@/stores/toast'
import { activityCopy, activitySamples } from '@/config/copy/shell'
import { realNotice, sampleNotice, tipNotice, type ActivityNotice } from '@/composables/activityNotices'
import type { RecentActivity } from '@/types'

export type { ActivityNotice } from '@/composables/activityNotices'

/**
 * Decisión del cliente: hasta tener 10 registros reales, los avisos de actividad son EJEMPLOS
 * rotulados como tales ("Ejemplo ilustrativo"); desde 10, solo registros reales y sin etiqueta.
 */
export const REAL_ACTIVITY_THRESHOLD = 10

const DISMISS_KEY = 'construmia_activity_closed'
const FIRST_DELAY = 8000
const VISIBLE_MS = 6000
const GAP_MIN = 18000
const GAP_MAX = 28000
const RETRY_MS = 5000
/** Si /leads/recent no contesta tras dos reintentos, se sigue como si hubiera fallado. */
const MAX_LOAD_WAITS = 2
/** Cada mensaje informativo sale como mucho dos veces: un aviso que insiste deja de ser creíble. */
const TIP_ROUNDS = 2
/** En el pago no se distrae a nadie. */
const SILENT_ROUTES = ['Pay', 'PayResponse']

function readDismissed(): boolean {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === '1'
  } catch {
    return false
  }
}

/**
 * Avisos de abajo a la izquierda, uno a la vez. Con `total >= REAL_ACTIVITY_THRESHOLD` la actividad
 * sale de GET /leads/recent; por debajo (o si el API falla) rotan los ejemplos de copy/shell.ts,
 * cada uno con su etiqueta visible. En ambos casos se intercalan los mensajes informativos.
 */
export function useActivityFeed() {
  const route = useRoute()
  const leadStore = useLeadStore()
  const toastStore = useToastStore()

  const current = ref<ActivityNotice | null>(null)
  const visible = ref(false)
  const paused = ref(false)
  const dismissed = ref(readDismissed())

  /** null = aún cargando; [] = sin registros reales suficientes (o API caído) → ejemplos. */
  let recent: RecentActivity[] | null = null
  let recentIndex = 0
  let loadWaits = 0
  // Cada sesión arranca los ejemplos en un punto distinto: quien vuelve no ve la misma secuencia.
  const sampleStart = Math.floor(Math.random() * activitySamples.length)
  let samplesShown = 0
  let sinceTip = 0
  let tipCursor = 0
  let tipsShown = 0

  // Temporizador único con pausa: lleva la cuenta de lo que falta para poder reanudar.
  let timer: number | undefined
  let remaining = 0
  let startedAt = 0
  let pending: (() => void) | null = null
  const holds = new Set<string>()

  function clear() {
    window.clearTimeout(timer)
    timer = undefined
    pending = null
  }

  function run(ms: number, fn: () => void) {
    clear()
    remaining = ms
    pending = fn
    startedAt = Date.now()
    timer = window.setTimeout(fn, ms)
  }

  function hold(reason: string) {
    if (!visible.value) return
    holds.add(reason)
    if (timer === undefined) return
    window.clearTimeout(timer)
    timer = undefined
    remaining -= Date.now() - startedAt
    paused.value = true
  }

  function release(reason: string) {
    holds.delete(reason)
    if (holds.size || timer !== undefined || !pending) return
    paused.value = false
    startedAt = Date.now()
    // Al soltar siempre queda un respiro para terminar de leer.
    remaining = Math.max(remaining, 1200)
    timer = window.setTimeout(pending, remaining)
  }

  function isSilent(): boolean {
    return SILENT_ROUTES.includes(String(route.name))
  }

  /** No se interrumpe un modal abierto, un campo en edición ni una pestaña en segundo plano. */
  function isBusy(): boolean {
    const el = document.activeElement
    const typing = !!el && /^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName)
    const modalOpen = document.body.style.overflow === 'hidden'
    return typing || modalOpen || document.hidden || toastStore.toasts.length > 0
  }

  function fastTrackTo(): RouteLocationRaw {
    return leadStore.isRegistered ? { name: 'Pay' } : { name: 'Home', hash: '#registro' }
  }

  function nextTip(): ActivityNotice | null {
    // La vía rápida no se le ofrece a quien ya tiene la agenda abierta.
    const tips = activityCopy.tips.filter((tip) => !(tip.fastTrack && leadStore.canSchedule))
    if (!tips.length || tipsShown >= tips.length * TIP_ROUNDS) return null
    const tip = tips[tipCursor % tips.length]
    if (!tip) return null
    tipCursor += 1
    tipsShown += 1
    sinceTip = 0
    return tipNotice(tip, tipsShown, fastTrackTo())
  }

  function nextReal(list: RecentActivity[]): ActivityNotice | null {
    while (recentIndex < list.length) {
      const item = list[recentIndex]
      recentIndex += 1
      const notice = item ? realNotice(item, recentIndex) : null
      if (notice) return notice
    }
    return null
  }

  function nextSample(): ActivityNotice | null {
    if (samplesShown >= activitySamples.length) return null
    const sample = activitySamples[(sampleStart + samplesShown) % activitySamples.length]
    if (!sample) return null
    const notice = sampleNotice(sample, samplesShown)
    samplesShown += 1
    return notice
  }

  function nextActivity(): ActivityNotice | null {
    const notice = recent?.length ? nextReal(recent) : nextSample()
    if (notice) sinceTip += 1
    return notice
  }

  /** Dos avisos de actividad y uno informativo; cuando se acaban ambos, la rotación termina. */
  function pick(): ActivityNotice | null {
    if (sinceTip < 2) return nextActivity() ?? nextTip()
    return nextTip() ?? nextActivity()
  }

  function show() {
    if (dismissed.value || isSilent()) return
    if (isBusy()) return run(RETRY_MS, show)
    // Se espera un poco a saber si hay actividad real, para no mezclar ejemplos con reales.
    if (recent === null && loadWaits < MAX_LOAD_WAITS) {
      loadWaits += 1
      return run(RETRY_MS, show)
    }
    const notice = pick()
    if (!notice) return
    current.value = notice
    visible.value = true
    run(VISIBLE_MS, hide)
  }

  function hide() {
    visible.value = false
    paused.value = false
    holds.clear()
    run(GAP_MIN + Math.random() * (GAP_MAX - GAP_MIN), show)
  }

  function dismiss() {
    dismissed.value = true
    visible.value = false
    clear()
    try {
      sessionStorage.setItem(DISMISS_KEY, '1')
    } catch {
      // Sin sessionStorage (modo privado estricto) basta con cerrarlo en esta carga.
    }
  }

  // Un toque en el enlace del aviso cuenta como leído: se retira sin esperar.
  function consume() {
    if (visible.value) hide()
  }

  watch(
    () => route.name,
    () => {
      if (dismissed.value) return
      if (isSilent()) {
        visible.value = false
        paused.value = false
        holds.clear()
        clear()
      } else if (timer === undefined && !visible.value) {
        run(FIRST_DELAY, show)
      }
    },
  )

  // Un error o una confirmación del embudo manda sobre cualquier aviso: se le cede el lugar.
  watch(
    () => toastStore.toasts.length,
    (count) => {
      if (count && visible.value) hide()
    },
  )

  onMounted(() => {
    if (dismissed.value) return
    leadService
      .recent()
      .then(({ items, total }) => {
        const enough = Number(total) >= REAL_ACTIVITY_THRESHOLD && Array.isArray(items)
        recent = enough ? items.slice(0, 12) : []
      })
      .catch(() => {
        // API caído = como si hubiera menos de 10 registros: ejemplos rotulados.
        recent = []
      })
    if (!isSilent()) run(FIRST_DELAY, show)
  })

  onBeforeUnmount(clear)

  return { current, visible, paused, dismissed, dismiss, consume, hold, release }
}
