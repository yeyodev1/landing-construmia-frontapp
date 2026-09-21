<script setup lang="ts">
import { ref } from 'vue'
import { embeds } from '@/config/site'
import { videoCopy } from '@/config/copy/video'
import { useWistia, type WistiaPlayerElement } from '@/composables/useWistia'

const props = defineProps<{
  /** Segundo desde el que arranca (seguir donde se quedó en la home). */
  startAt?: number
}>()

const emit = defineEmits<{ timeupdate: [seconds: number]; play: []; pause: [] }>()

const copy = videoCopy.player
const mediaEl = ref<WistiaPlayerElement | null>(null)

const { status, retry, swatchUrl, currentTime } = useWistia(embeds.wistiaMediaId, mediaEl, {
  startAt: () => props.startAt,
  onTime: (seconds) => emit('timeupdate', seconds),
  onPlay: () => emit('play'),
  onPause: () => emit('pause'),
})

/** Al abrir el cuestionario el video se pausa: nadie responde bien con alguien hablando de fondo. */
function pause() {
  try {
    mediaEl.value?.pause?.()
  } catch {
    // El reproductor aún no estaba listo: no hay nada que pausar.
  }
}

/** Devuelve false si el navegador bloqueó la reproducción: queda el botón propio de Wistia. */
async function play(): Promise<boolean> {
  try {
    await mediaEl.value?.play?.()
    return true
  } catch {
    return false
  }
}

defineExpose({ pause, play, currentTime, status })
</script>

<template>
  <div
    class="player"
    :class="`player--${status}`"
    role="region"
    :aria-label="copy.label"
    :aria-busy="status === 'loading'"
  >
    <!-- El swatch es una miniatura de pocos bytes: borrosa hace de póster mientras llega el reproductor. -->
    <div
      class="player__swatch"
      :style="{ backgroundImage: `url(${swatchUrl})` }"
      aria-hidden="true"
    ></div>

    <wistia-player
      ref="mediaEl"
      class="player__media"
      :media-id="embeds.wistiaMediaId"
      aspect="1.7777777777777777"
      :current-time="startAt && startAt > 0 ? startAt : undefined"
    ></wistia-player>

    <Transition name="fade">
      <div v-if="status === 'loading'" class="player__state" aria-hidden="true">
        <span class="player__pulse"><i class="fa-solid fa-play"></i></span>
      </div>
      <div v-else-if="status === 'error'" class="player__state player__state--error" role="alert">
        <p>{{ copy.error }}</p>
        <button type="button" class="btn btn--outline-light" @click="retry">
          <i class="fa-solid fa-rotate-right" aria-hidden="true"></i>
          {{ copy.retry }}
        </button>
      </div>
    </Transition>
    <span v-if="status === 'loading'" class="visually-hidden" role="status">{{
      copy.loading
    }}</span>
  </div>
</template>

<style scoped lang="scss">
.player {
  position: relative;
  width: 100%;
  // El espacio queda reservado desde el primer pintado: nada salta cuando llega el video.
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #000;
  isolation: isolate;

  @include from('md') {
    border-radius: $radius-md;
  }

  &__swatch {
    position: absolute;
    inset: -8%;
    background: center / cover no-repeat;
    filter: blur(18px);
    opacity: 0.85;
    transition: opacity 0.6s ease;
    z-index: 0;
  }

  &--ready &__swatch {
    opacity: 0;
  }

  &__media {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
    z-index: 1;
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  &--ready &__media {
    opacity: 1;
  }

  &__state {
    position: absolute;
    inset: 0;
    z-index: 2;
    @include flex(column, center, center, 1rem);
    padding: 1.25rem;
    text-align: center;
    color: $on-night;
    font-size: $text-sm;

    &--error {
      background: rgba($night, 0.72);
    }
  }

  &__pulse {
    @include flex(row, center, center);
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    border: 1px solid rgba($on-night, 0.35);
    color: $on-night;
    font-size: 1.05rem;
    padding-left: 0.2rem;
    animation: player-pulse 1.8s ease-in-out infinite;
  }
}

@keyframes player-pulse {
  0%,
  100% {
    opacity: 0.45;
    transform: scale(0.96);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
