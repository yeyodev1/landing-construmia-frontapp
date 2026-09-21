<script setup lang="ts">
import { ref } from 'vue'
import WistiaPlayer from '@/components/video/WistiaPlayer.vue'
import VideoPoster from '@/components/landing/VideoPoster.vue'
import { useVideoGate } from '@/composables/useVideoGate'
import { useLeadModal } from '@/composables/useLeadModal'
import { hero } from '@/config/copy/landing'

/**
 * El VSL en la home. Sin registro: póster → play en la misma página → a los `previewSeconds`
 * se pausa y se pide el registro. Con registro no hay adelanto: el póster lleva a /video.
 */
const copy = hero.video
const player = ref<InstanceType<typeof WistiaPlayer> | null>(null)
const { started, gated, registered, start, onTime, onPlay, reopen } = useVideoGate(player)
const { videoRoute } = useLeadModal()
</script>

<template>
  <div class="hero-video">
    <WistiaPlayer ref="player" @timeupdate="onTime" @play="onPlay" />

    <Transition name="hero-video-poster">
      <RouterLink
        v-if="registered"
        :to="videoRoute()"
        class="hero-video__face"
        :aria-label="`${copy.registered}: ${copy.method}`"
      >
        <VideoPoster :cta="copy.registered" />
      </RouterLink>
      <button
        v-else-if="!started"
        type="button"
        class="hero-video__face"
        :aria-label="copy.play"
        @click="start"
      >
        <VideoPoster />
      </button>
    </Transition>

    <Transition name="hero-video-gate">
      <div v-if="gated && !registered" class="hero-video__gate" role="group" :aria-label="copy.gate.title">
        <p class="hero-video__gate-eyebrow">
          <i class="fa-solid fa-lock" aria-hidden="true"></i>{{ copy.gate.eyebrow }}
        </p>
        <p class="hero-video__gate-title">{{ copy.gate.title }}</p>
        <p class="hero-video__gate-text">{{ copy.gate.text }}</p>
        <button type="button" class="btn btn--primary hero-video__gate-cta" @click="reopen">
          <i class="fa-solid fa-play" aria-hidden="true"></i>
          {{ copy.gate.cta }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.hero-video {
  position: relative;
  isolation: isolate;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #000;

  @include from('md') {
    border-radius: $radius-md;
    box-shadow:
      0 0 0 1px rgba($on-night, 0.08),
      0 30px 80px rgba(#000, 0.55),
      0 0 120px rgba($accent, 0.12);
  }

  &__face {
    position: absolute;
    inset: 0;
    z-index: 3;
    display: block;
    width: 100%;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    &:focus-visible {
      outline: 3px solid $accent-glow;
      outline-offset: -3px;
    }
  }

  // Capa sobre el video pausado: vidrio oscuro, el cuadro se sigue intuyendo detrás.
  &__gate {
    position: absolute;
    inset: 0;
    z-index: 4;
    @include flex(column, center, center, 0.45rem);
    padding: 1rem;
    text-align: center;
    color: $on-night;
    background: rgba($night, 0.6);
    backdrop-filter: blur(14px) saturate(1.1);
    -webkit-backdrop-filter: blur(14px) saturate(1.1);

    @include from('md') {
      gap: 0.7rem;
    }
  }

  &__gate-eyebrow {
    @include flex(row, center, center, 0.45rem);
    @include eyebrow;
    font-size: 0.64rem;
    letter-spacing: 0.14em;
    color: $accent-glow;
  }

  &__gate-title {
    @include display(clamp(1.35rem, 1rem + 2vw, 2.4rem), 400);
    letter-spacing: -0.02em;
  }

  // En móvil el video mide ~200 px de alto: solo título y botón.
  &__gate-text {
    display: none;
    max-width: 30rem;
    font-size: $text-sm;
    color: $on-night-soft;

    @include from('md') {
      display: block;
    }
  }

  &__gate-cta {
    margin-top: 0.35rem;
    padding: 0.75rem 1.4rem;

    @include from('md') {
      margin-top: 0.6rem;
      padding: 0.95rem 1.9rem;
    }
  }
}

.hero-video-poster-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.6s $ease;
}

.hero-video-poster-leave-to {
  opacity: 0;
  transform: scale(1.03);
}

.hero-video-gate-enter-active {
  transition:
    opacity 0.45s ease,
    backdrop-filter 0.45s ease;

  > * {
    transition:
      opacity 0.45s ease 0.08s,
      transform 0.5s $ease 0.08s;
  }
}

.hero-video-gate-leave-active {
  transition: opacity 0.25s ease;
}

.hero-video-gate-enter-from,
.hero-video-gate-leave-to {
  opacity: 0;

  > * {
    opacity: 0;
    transform: translateY(10px);
  }
}
</style>
