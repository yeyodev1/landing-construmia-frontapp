import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

export type WistiaStatus = 'loading' | 'ready' | 'error'

/** Lo que usamos del web component <wistia-player>: el resto de su API no hace falta. */
export interface WistiaPlayerElement extends HTMLElement {
  currentTime: number
  play?: () => Promise<unknown> | unknown
  pause?: () => unknown
}

export interface WistiaPlaybackHandlers {
  /** Segundos reproducidos: llega con los eventos del reproductor y con el sondeo de respaldo. */
  onTime?: (seconds: number) => void
  onPlay?: () => void
  onPause?: () => void
  /** Segundo en el que arranca el video (seguir donde se quedó). */
  startAt?: () => number | undefined
}

/**
 * Los scripts de Wistia se cargan una sola vez por pestaña, sin importar cuántas
 * veces se monte el reproductor (volver a /video no vuelve a pedirlos).
 */
const scripts = new Map<string, Promise<void>>()

function loadScript(src: string): Promise<void> {
  const cached = scripts.get(src)
  if (cached) return cached

  const promise = new Promise<void>((resolve, reject) => {
    const el = document.createElement('script')
    el.src = src
    el.async = true
    el.type = 'module'
    el.onload = () => resolve()
    el.onerror = () => {
      // Se olvida el intento fallido para que "cargar otra vez" pueda pedirlo de nuevo.
      scripts.delete(src)
      el.remove()
      reject(new Error(`No cargó ${src}`))
    }
    document.head.appendChild(el)
  })

  scripts.set(src, promise)
  return promise
}

/** Espera a que el custom element exista, con un tope: un bloqueador puede dejarlo sin definir. */
function whenDefined(tag: string, timeoutMs: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error(`${tag} no se definió`)), timeoutMs)
    customElements.whenDefined(tag).then(() => {
      window.clearTimeout(timer)
      resolve()
    })
  })
}

const POLL_MS = 500

export function useWistia(
  mediaId: string,
  el?: Ref<WistiaPlayerElement | null>,
  handlers: WistiaPlaybackHandlers = {},
) {
  const status = ref<WistiaStatus>('loading')
  let poll: number | undefined
  let seeked = false

  async function load() {
    status.value = 'loading'
    try {
      await Promise.all([
        loadScript('https://fast.wistia.com/player.js'),
        loadScript(`https://fast.wistia.com/embed/${mediaId}.js`),
      ])
      await whenDefined('wistia-player', 12000)
      status.value = 'ready'
    } catch {
      status.value = 'error'
    }
  }

  function readTime(): number | null {
    try {
      const time = Number(el?.value?.currentTime)
      return Number.isFinite(time) ? time : null
    } catch {
      return null
    }
  }

  function emitTime() {
    const time = readTime()
    if (time !== null) handlers.onTime?.(time)
  }

  // Respaldo: si el reproductor no emite "time-update", se lee currentTime mientras suena.
  function startPolling() {
    stopPolling()
    poll = window.setInterval(emitTime, POLL_MS)
  }

  function stopPolling() {
    if (poll !== undefined) window.clearInterval(poll)
    poll = undefined
  }

  /** Seguir donde se quedó: una sola vez, cuando la API ya puede mover el cabezal. */
  function seekToStart() {
    const start = handlers.startAt?.()
    if (seeked || !start || start <= 0 || !el?.value) return
    try {
      el.value.currentTime = start
      seeked = true
    } catch {
      // Sin API no hay seek: el video arranca desde el inicio y nada se rompe.
    }
  }

  const listeners: Record<string, () => void> = {
    'api-ready': seekToStart,
    play: () => {
      seekToStart()
      handlers.onPlay?.()
      emitTime()
      startPolling()
    },
    pause: () => {
      stopPolling()
      emitTime()
      handlers.onPause?.()
    },
    ended: () => {
      stopPolling()
      handlers.onPause?.()
    },
    'time-update': emitTime,
    seek: emitTime,
  }

  onMounted(() => {
    const node = el?.value
    if (node) Object.entries(listeners).forEach(([name, fn]) => node.addEventListener(name, fn))
    load()
  })

  onBeforeUnmount(() => {
    stopPolling()
    const node = el?.value
    if (node) Object.entries(listeners).forEach(([name, fn]) => node.removeEventListener(name, fn))
  })

  return {
    status,
    retry: load,
    currentTime: () => readTime() ?? 0,
    swatchUrl: `https://fast.wistia.com/embed/medias/${mediaId}/swatch`,
  }
}
