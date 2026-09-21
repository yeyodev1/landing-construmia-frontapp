import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

interface CountdownOptions {
  /** Duración total en segundos. */
  seconds: number
  /** Clave de sessionStorage donde vive el timestamp de término (una por lead). */
  storageKey: string
  /** Cada cuántos segundos cambia el texto para lectores de pantalla. */
  announceEvery?: number
}

function readEnd(key: string): number | null {
  try {
    const raw = Number(sessionStorage.getItem(key))
    return Number.isFinite(raw) && raw > 0 ? raw : null
  } catch {
    return null
  }
}

function writeEnd(key: string, value: number) {
  try {
    sessionStorage.setItem(key, String(value))
  } catch {
    // Sin sessionStorage (modo privado estricto) el contador igual corre, solo no sobrevive a recargar.
  }
}

/**
 * Cuenta regresiva contra el reloj, no contra los ticks: se guarda CUÁNDO termina y cada
 * tick calcula `fin - Date.now()`. Así recargar no la reinicia y una pestaña en segundo
 * plano (donde el navegador frena los timers) no la atrasa.
 */
export function useCountdown({ seconds, storageKey, announceEvery = 30 }: CountdownOptions) {
  const totalMs = seconds * 1000
  const remainingMs = ref(totalMs)
  let endAt = 0
  let timer: number | undefined

  const done = computed(() => remainingMs.value <= 0)
  const remainingSeconds = computed(() => Math.ceil(remainingMs.value / 1000))
  const progress = computed(() => Math.min(1, Math.max(0, 1 - remainingMs.value / totalMs)))

  const clock = computed(() => {
    const s = remainingSeconds.value
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  })

  /** Segundos redondeados hacia arriba al múltiplo de `announceEvery`: cambia pocas veces. */
  const announceSeconds = computed(() =>
    done.value ? 0 : Math.ceil(remainingSeconds.value / announceEvery) * announceEvery,
  )

  function stop() {
    if (timer !== undefined) window.clearInterval(timer)
    timer = undefined
  }

  function tick() {
    remainingMs.value = Math.max(0, endAt - Date.now())
    if (remainingMs.value === 0) stop()
  }

  // El término se resuelve ya en el setup: al recargar con el contador vencido no hay un
  // primer pintado en 2:00 que luego salte a "listo".
  const stored = readEnd(storageKey)
  // Un término más lejano que la duración total solo puede venir de un reloj movido: se descarta.
  if (stored !== null && stored - Date.now() <= totalMs) {
    endAt = stored
  } else {
    endAt = Date.now() + totalMs
    writeEnd(storageKey, endAt)
  }
  remainingMs.value = Math.max(0, endAt - Date.now())
  /** Ya estaba vencido al cargar: la página no celebra un desbloqueo que la persona ya vio. */
  const startedDone = remainingMs.value === 0

  // Al volver a la pestaña se recalcula de inmediato, sin esperar al siguiente tick frenado.
  function onVisibility() {
    if (!document.hidden) tick()
  }

  onMounted(() => {
    if (!startedDone) timer = window.setInterval(tick, 250)
    document.addEventListener('visibilitychange', onVisibility)
  })

  onBeforeUnmount(() => {
    stop()
    document.removeEventListener('visibilitychange', onVisibility)
  })

  return { done, startedDone, remainingSeconds, progress, clock, announceSeconds }
}
