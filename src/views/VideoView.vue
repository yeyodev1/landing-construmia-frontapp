<script setup lang="ts">
import { computed, ref } from 'vue'
import { embeds } from '@/config/site'
import { videoCopy } from '@/config/copy/video'
import { useLeadStore } from '@/stores/lead'
import { usePageTime } from '@/composables/usePageTime'
import WistiaPlayer from '@/components/video/WistiaPlayer.vue'
import UnlockCountdown from '@/components/video/UnlockCountdown.vue'
import FastLaneCard from '@/components/video/FastLaneCard.vue'
import TrustStrip from '@/components/video/TrustStrip.vue'
import QualifyModal from '@/components/qualify/QualifyModal.vue'

const leadStore = useLeadStore()
const copy = videoCopy
// El CRM recibe cuánto tiempo pasó la persona con el video antes de cualificar.
const { meta } = usePageTime()

const player = ref<InstanceType<typeof WistiaPlayer> | null>(null)
const qualifyOpen = ref(false)

const firstName = computed(() => leadStore.lead?.firstName?.trim() ?? '')
const countdownKey = computed(() => `construmia_unlock_${leadStore.lead?.id ?? 'anon'}`)
const notice = computed(() => (leadStore.hasPaid ? copy.notice.paid : copy.notice.qualified))

function openQualify() {
  player.value?.pause()
  qualifyOpen.value = true
}
</script>

<template>
  <div class="video-page">
    <div v-if="leadStore.canSchedule" class="video-page__notice" role="status">
      <p class="video-page__notice-text">
        <i class="fa-solid fa-calendar-check" aria-hidden="true"></i>
        <span>{{ notice }}</span>
      </p>
      <RouterLink :to="{ name: 'Schedule' }" class="btn btn--light video-page__notice-cta">
        {{ copy.notice.cta }}
        <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </RouterLink>
    </div>

    <section class="stage" aria-labelledby="video-title">
      <div class="stage__inner">
        <header class="stage__head">
          <p class="stage__greeting">{{ copy.hero.greeting(firstName) }}</p>
          <h1 id="video-title" class="stage__title">{{ copy.hero.title }}</h1>
        </header>

        <div class="stage__screen">
          <WistiaPlayer ref="player" />
        </div>

        <div class="stage__aside">
          <p class="stage__eyebrow">{{ copy.hero.eyebrow }}</p>
          <p class="stage__lead">{{ copy.hero.lead }}</p>
        </div>
      </div>
    </section>

    <section class="next">
      <UnlockCountdown
        class="next__item"
        :seconds="embeds.unlockSeconds"
        :storage-key="countdownKey"
        @request="openQualify"
      />
      <FastLaneCard class="next__item" />
    </section>

    <TrustStrip class="video-page__trust" />

    <QualifyModal :open="qualifyOpen" :meta="meta" @close="qualifyOpen = false" />
  </div>
</template>

<style scoped lang="scss">
// Sala de cine: todo a oscuras para que lo único iluminado sea la pantalla.
.video-page {
  @include flex(column, stretch, flex-start, 0);
  flex: 1;
  background: $night;
  color: $on-night;
  padding-bottom: $space-section;

  &__notice {
    @include flex(row, center, center, 0.75rem 1.25rem);
    flex-wrap: wrap;
    padding: 0.8rem 1.25rem;
    background: rgba($accent, 0.16);
    border-bottom: 1px solid rgba($accent-glow, 0.3);
  }

  &__notice-text {
    @include flex(row, baseline, flex-start, 0.6rem);
    font-size: $text-sm;
    line-height: 1.45;
    color: $on-night;

    i {
      color: $accent-glow;
    }
  }

  &__notice-cta {
    flex: none;
    padding: 0.55rem 1.2rem;
    font-size: 0.78rem;
  }

  &__trust {
    @include container(1100px);
    margin-top: $space-section;
  }
}

.stage {
  position: relative;
  padding-top: clamp(1.75rem, 5vw, 4rem);
  overflow: hidden;

  // La luz del proyector: un halo cobre muy tenue detrás de la pantalla, nada más.
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 22%;
    width: min(1200px, 140vw);
    height: 70%;
    transform: translateX(-50%);
    background: radial-gradient(closest-side, rgba($accent, 0.2), transparent);
    pointer-events: none;
  }

  &__inner {
    position: relative;
    @include container(1100px);
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 1.5rem 3rem;
  }

  &__head {
    flex: 1 1 100%;
    animation: stage-rise 0.7s $ease both;

    @include from('lg') {
      flex: 1 1 56%;
    }
  }

  &__greeting {
    @include eyebrow;
    color: $accent-glow;
    letter-spacing: 0.16em;
    line-height: 1.5;
  }

  &__title {
    @include display($display-md, 400);
    margin-top: 0.8rem;
    color: $on-night;
    max-width: 17ch;
  }

  // En móvil la pantalla va a sangre y antes que la bajada: el video tiene que asomar sin hacer scroll.
  &__screen {
    flex: 1 1 100%;
    order: 2;
    margin-inline: -1.25rem;
    width: calc(100% + 2.5rem);
    animation: stage-rise 0.8s $ease 0.1s both;

    @include from('md') {
      margin-inline: 0;
      width: 100%;
      border-radius: $radius-md;
      box-shadow:
        0 0 0 1px $night-line,
        0 40px 90px rgba(#000, 0.55);
    }

    @include from('lg') {
      order: 3;
    }
  }

  &__aside {
    flex: 1 1 100%;
    order: 3;
    animation: stage-rise 0.7s $ease 0.18s both;

    @include from('lg') {
      flex: 1 1 30%;
      order: 2;
      padding-bottom: 0.4rem;
    }
  }

  &__eyebrow {
    @include eyebrow;
    color: rgba($on-night, 0.5);
    margin-bottom: 0.6rem;
  }

  &__lead {
    font-size: $text-base;
    color: $on-night-soft;
    max-width: 46ch;
  }
}

.next {
  @include container(1100px);
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
  margin-top: clamp(2rem, 5vw, 3.5rem);

  @include from('lg') {
    flex-direction: row;
    align-items: stretch;
    gap: 1.5rem;
  }

  &__item {
    @include from('lg') {
      flex: 1 1 0;
      min-width: 0;
    }
  }
}

@keyframes stage-rise {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
