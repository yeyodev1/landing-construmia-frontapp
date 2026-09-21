<script setup lang="ts">
import { videoCopy } from '@/config/copy/video'

defineProps<{
  /** Pregunta actual, contando desde 1. */
  current: number
  total: number
  /** Al enviar, la barra se completa aunque ya no haya pregunta en pantalla. */
  complete?: boolean
}>()
</script>

<template>
  <div
    class="progress"
    role="progressbar"
    :aria-valuemin="1"
    :aria-valuemax="total"
    :aria-valuenow="current"
    :aria-valuetext="videoCopy.qualify.progress(current, total)"
  >
    <span class="progress__count">{{ videoCopy.qualify.progress(current, total) }}</span>
    <span class="progress__track" aria-hidden="true">
      <span
        v-for="n in total"
        :key="n"
        class="progress__step"
        :class="{ 'progress__step--on': complete || n <= current }"
      ></span>
    </span>
  </div>
</template>

<style scoped lang="scss">
.progress {
  @include flex(row, center, flex-start, 0.75rem);
  flex: 1;
  min-width: 0;

  &__count {
    flex: none;
    font-size: 0.74rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    font-variant-numeric: tabular-nums;
    color: $ink-soft;
  }

  &__track {
    @include flex(row, center, flex-start, 4px);
    flex: 1;
    max-width: 11rem;
  }

  &__step {
    position: relative;
    flex: 1;
    height: 3px;
    border-radius: 2px;
    background: $line;
    overflow: hidden;

    // Cada tramo se llena de izquierda a derecha: el avance se ve, no solo se cuenta.
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: $accent;
      transform: scaleX(0);
      transform-origin: left center;
      transition: transform 0.35s $ease;
    }

    &--on::after {
      transform: scaleX(1);
    }
  }
}
</style>
