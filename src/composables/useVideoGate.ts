import { computed, onBeforeUnmount, ref, watch, type Ref } from 'vue'
import { useLeadStore } from '@/stores/lead'
import { useLeadModal } from '@/composables/useLeadModal'
import { embeds } from '@/config/site'
import type { WistiaStatus } from '@/composables/useWistia'

/** Lo que el gate necesita del reproductor (WistiaPlayer expone esto con defineExpose). */
export interface GatedPlayer {
  play: () => Promise<boolean>
  pause: () => void
  status: WistiaStatus
}

/**
 * Adelanto del VSL en la home: se ve `previewSeconds` y, para seguir, se pide el registro.
 * El tiempo llega de los eventos del reproductor (o de su sondeo de respaldo); si el navegador
 * no deja leerlo, el modal se abre igual a los `previewSeconds` desde el primer play.
 */
export function useVideoGate(player: Ref<GatedPlayer | null>) {
  const leadStore = useLeadStore()
  const { isOpen, open, trackVideo } = useLeadModal()
  const limit = embeds.previewSeconds

  const started = ref(false)
  const gated = ref(false)
  const registered = computed(() => leadStore.isRegistered)

  let gotTime = false
  let fallback: number | undefined
  let wantsPlay = false

  function gate() {
    window.clearTimeout(fallback)
    gated.value = true
    player.value?.pause()
    open('video')
  }

  function armFallback() {
    if (fallback !== undefined || registered.value) return
    fallback = window.setTimeout(
      () => {
        if (gotTime || gated.value) return
        trackVideo(limit)
        gate()
      },
      limit * 1000 + 600,
    )
  }

  function onTime(seconds: number) {
    if (seconds > 0) gotTime = true
    trackVideo(seconds)
    if (!registered.value && !gated.value && seconds >= limit) gate()
  }

  function onPlay() {
    started.value = true
    if (registered.value) return
    // Tras el adelanto, cualquier play (los controles de Wistia, el teclado) vuelve al registro.
    if (gated.value) {
      gate()
      return
    }
    armFallback()
  }

  /** Clic en el póster: arranca el video en la misma página. */
  async function start() {
    started.value = true
    armFallback()
    if (player.value?.status === 'ready') await player.value.play()
    else wantsPlay = true
  }

  // Si tocó play antes de que Wistia terminara de cargar, arranca apenas esté listo.
  watch(
    () => player.value?.status,
    (status) => {
      if (status !== 'ready' || !wantsPlay) return
      wantsPlay = false
      player.value?.play()
    },
  )

  // Cualquier apertura del modal (también desde un CTA) pausa el video.
  watch(isOpen, (value) => {
    if (value) player.value?.pause()
  })

  onBeforeUnmount(() => window.clearTimeout(fallback))

  return { started, gated, registered, start, onTime, onPlay, reopen: () => open('video') }
}
