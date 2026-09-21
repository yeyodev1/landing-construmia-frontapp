import { onMounted, ref } from 'vue'

export type WistiaStatus = 'loading' | 'ready' | 'error'

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

export function useWistia(mediaId: string) {
  const status = ref<WistiaStatus>('loading')

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

  onMounted(load)

  return {
    status,
    retry: load,
    swatchUrl: `https://fast.wistia.com/embed/medias/${mediaId}/swatch`,
  }
}
