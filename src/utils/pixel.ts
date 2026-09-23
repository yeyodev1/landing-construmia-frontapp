/**
 * Meta (Facebook) Pixel. El ID sale de VITE_META_PIXEL_ID; vacío = todo esto es no-op.
 * El PageView lo dispara el router en cada navegación (es una SPA), no el snippet.
 */
type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void
  queue: unknown[]
  push: Fbq
  loaded: boolean
  version: string
}

declare global {
  interface Window {
    fbq?: Fbq
    _fbq?: Fbq
  }
}

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID?.trim()

export function initPixel() {
  if (!PIXEL_ID || window.fbq) return

  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args)
    else fbq.queue.push(args)
  } as Fbq
  fbq.push = fbq
  fbq.loaded = true
  fbq.version = '2.0'
  fbq.queue = []
  window.fbq = fbq
  window._fbq = fbq

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(script)

  fbq('init', PIXEL_ID)
}

export function track(event: string, params?: Record<string, unknown>) {
  window.fbq?.('track', event, params)
}
