import { ref } from 'vue'
import { useRouter, type RouteLocationRaw } from 'vue-router'
import { useLeadStore } from '@/stores/lead'

/** Desde dónde se abrió: el video al llegar al adelanto, o cualquier CTA de la página. */
export type LeadModalSource = 'video' | 'cta'

// Estado de módulo: el header, los CTA, el video y el modal comparten el mismo diálogo.
const isOpen = ref(false)
const source = ref<LeadModalSource>('cta')
/** Segundos del video vistos en la home: al registrarse, /video sigue desde ahí. */
const videoSeconds = ref(0)

export function useLeadModal() {
  const router = useRouter()
  const leadStore = useLeadStore()

  /** Adónde va la persona al registrarse: el video, en el segundo donde lo dejó si lo empezó. */
  function videoRoute(): RouteLocationRaw {
    const t = Math.round(videoSeconds.value)
    return t > 0 ? { name: 'Video', query: { t: String(t) } } : { name: 'Video' }
  }

  function open(from: LeadModalSource = 'cta') {
    // Quien ya se registró no rellena nada: sigue en su paso del embudo.
    if (leadStore.isRegistered) {
      router.push(leadStore.canSchedule ? { name: 'Schedule' } : videoRoute())
      return
    }
    source.value = from
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  function trackVideo(seconds: number) {
    if (seconds > videoSeconds.value) videoSeconds.value = seconds
  }

  return { isOpen, source, videoSeconds, open, close, trackVideo, videoRoute }
}
