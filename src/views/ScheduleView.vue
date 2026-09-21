<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import BookingCalendar from '@/components/schedule/BookingCalendar.vue'
import ScheduleChoice from '@/components/schedule/ScheduleChoice.vue'
import { useLeadStore } from '@/stores/lead'
import { useReveal } from '@/composables/useReveal'
import { cld, cldSet, media } from '@/config/media'
import { scheduleCopy as copy } from '@/config/copy/checkout'

const leadStore = useLeadStore()

// real-interior-06: sala terminada con muro de piedra natural.
const PHOTO = media.reales.interiores[5] ?? media.renderToReality.real

const head = computed(() => (leadStore.hasPaid ? copy.paid : copy.qualified))

const expectRef = ref<HTMLElement | null>(null)
useReveal(expectRef)

// Una transferencia validada mientras tanto cambia el titular y quita el recordatorio del pago.
onMounted(() => leadStore.refresh())
</script>

<template>
  <div class="schedule">
    <section class="schedule__main" aria-labelledby="schedule-title">
      <header class="schedule__head">
        <p class="schedule__eyebrow">
          <i :class="leadStore.hasPaid ? 'fa-solid fa-check' : 'fa-solid fa-compass-drafting'" aria-hidden="true"></i>
          {{ head.eyebrow }}
        </p>
        <h1 id="schedule-title" class="schedule__title">{{ head.title }}</h1>
        <p class="schedule__lead">{{ head.lead }}</p>
      </header>

      <!-- El calendario es el beneficio del pase premium: solo se abre con la visita pagada. -->
      <template v-if="leadStore.hasPaid">
        <h2 class="visually-hidden">{{ copy.calendarTitle }}</h2>
        <BookingCalendar class="schedule__calendar" />
      </template>
      <ScheduleChoice v-else />
    </section>

    <section ref="expectRef" class="schedule__expect" aria-labelledby="schedule-expect">
      <figure class="schedule__photo reveal">
        <img
          :src="cld(PHOTO, 800)"
          :srcset="cldSet(PHOTO, [480, 800, 960])"
          sizes="(min-width: 1024px) 26rem, 100vw"
          :alt="copy.imageAlt"
          width="960"
          height="1280"
          loading="lazy"
          decoding="async"
        />
      </figure>
      <div class="schedule__expect-body">
        <p class="schedule__expect-eyebrow">{{ copy.expectEyebrow }}</p>
        <h2 id="schedule-expect" class="schedule__expect-title">{{ copy.expectTitle }}</h2>
        <ol class="schedule__points">
          <li v-for="(point, index) in copy.expect" :key="point.title" class="schedule__point reveal">
            <span class="schedule__index" aria-hidden="true">0{{ index + 1 }}</span>
            <div>
              <h3 class="schedule__point-title">{{ point.title }}</h3>
              <p>{{ point.text }}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
// Móvil: titular → calendario → qué esperar. Escritorio: calendario al centro, qué esperar a la derecha en oscuro.
.schedule {
  @include flex(column, stretch, flex-start, 0);
  flex: 1;

  @include from('lg') {
    flex-direction: row;
  }

  &__main {
    flex: 1 1 60%;
    min-width: 0;
    padding: 2.25rem 1.25rem 3rem;
    background: $paper;

    @include from('md') {
      padding: 3rem 2rem 4rem;
    }

    @include from('lg') {
      padding: 3.5rem clamp(2rem, 5vw, 5rem) 5rem;
    }

    > * {
      max-width: 46rem;
      margin-inline: auto;
    }
  }

  &__head {
    @include flex(column, flex-start, flex-start, 0.9rem);
  }

  &__eyebrow {
    @include eyebrow;
    @include flex(row, center, flex-start, 0.55rem);
  }

  &__title {
    @include display($display-md);
    max-width: 18ch;
  }

  &__lead {
    max-width: 34rem;
    font-size: $text-lg;
    line-height: 1.5;
    color: $ink-soft;
  }

  &__calendar {
    margin-top: 2rem;
  }

  &__expect {
    @include flex(column, stretch, flex-start, 0);
    background: $night;
    color: $on-night-soft;

    @include from('lg') {
      flex: 0 0 clamp(22rem, 32vw, 28rem);
    }
  }

  &__photo {
    height: clamp(14rem, 62vw, 22rem);
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: 50% 45%;
    }

    @include from('lg') {
      height: 20rem;
    }
  }

  &__expect-body {
    width: 100%;
    max-width: 40rem;
    margin-inline: auto;
    padding: 2.25rem 1.25rem 3rem;

    @include from('md') {
      padding: 2.75rem 2rem 4rem;
    }
  }

  &__expect-eyebrow {
    @include eyebrow;
    color: $accent-glow;
  }

  &__expect-title {
    @include display($display-sm);
    margin-top: 0.8rem;
    color: $on-night;
  }

  &__points {
    margin-top: 1.25rem;
    list-style: none;
  }

  &__point {
    @include flex(row, flex-start, flex-start, 1.1rem);
    padding-block: 1.2rem;
    border-bottom: 1px solid $night-line;
    font-size: $text-sm;
    line-height: 1.55;

    &:last-child {
      border-bottom: none;
    }
  }

  &__index {
    flex: 0 0 1.6rem;
    font-family: $font-display;
    font-size: $text-base;
    color: $accent-glow;
    font-variant-numeric: tabular-nums;
  }

  &__point-title {
    margin-bottom: 0.3rem;
    font-family: $font-principal;
    font-size: $text-base;
    font-weight: 600;
    line-height: 1.35;
    color: $on-night;
  }
}
</style>
