import { onBeforeUnmount, onMounted } from 'vue'
import type { LeadMeta } from '@/types'

/**
 * Mide el tiempo que la persona pasa en una página, contando solo cuando la
 * pestaña está visible: una pestaña olvidada en segundo plano no es interés.
 * El CRM lo recibe como `time_on_page_seconds` en el webhook.
 */
export function usePageTime() {
  let visibleMs = 0
  let since: number | null = null

  function onVisibility() {
    if (document.hidden) {
      if (since !== null) visibleMs += performance.now() - since
      since = null
    } else if (since === null) {
      since = performance.now()
    }
  }

  onMounted(() => {
    since = document.hidden ? null : performance.now()
    document.addEventListener('visibilitychange', onVisibility)
  })

  onBeforeUnmount(() => document.removeEventListener('visibilitychange', onVisibility))

  function seconds(): number {
    const running = since !== null ? performance.now() - since : 0
    return Math.round((visibleMs + running) / 1000)
  }

  /** Lo que viaja en `meta` al API. */
  function meta(): LeadMeta {
    const mobile = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches
    return { timeOnPageSeconds: seconds(), device: mobile ? 'mobile' : 'desktop' }
  }

  return { seconds, meta }
}
