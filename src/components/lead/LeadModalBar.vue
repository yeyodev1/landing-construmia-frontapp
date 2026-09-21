<script setup lang="ts">
import { leadModal as copy } from '@/config/copy/landing'

/** Barra del registro en modal: volver (solo en el paso 2), avance y cerrar. */
const props = defineProps<{ step: number; total: number }>()
const emit = defineEmits<{ back: []; close: [] }>()
</script>

<template>
  <header class="bar">
    <button
      type="button"
      class="bar__nav"
      :class="{ 'bar__nav--hidden': props.step === 1 }"
      :disabled="props.step === 1"
      :aria-label="copy.back"
      @click="emit('back')"
    >
      <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
    </button>

    <div class="bar__progress">
      <p class="bar__count" aria-live="polite">{{ copy.progress(step, total) }}</p>
      <span class="bar__track" aria-hidden="true">
        <span class="bar__fill" :style="{ transform: `scaleX(${step / total})` }"></span>
      </span>
    </div>

    <button type="button" class="bar__nav" :aria-label="copy.close" @click="emit('close')">
      <i class="fa-solid fa-xmark" aria-hidden="true"></i>
    </button>
  </header>
</template>

<style scoped lang="scss">
.bar {
  @include flex(row, center, space-between, 0.5rem);
  flex: none;
  margin-inline: -0.45rem;

  &__nav {
    flex: none;
    @include flex(row, center, center);
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    color: $ink-soft;
    transition:
      background-color 0.2s ease,
      opacity 0.2s ease;

    &:hover {
      background: $sand;
      color: $ink;
    }

    &--hidden {
      opacity: 0;
      pointer-events: none;
    }
  }

  &__progress {
    @include flex(column, center, center, 0.4rem);
    flex: 1;
    max-width: 11rem;
  }

  &__count {
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: $ink-soft;
  }

  &__track {
    width: 100%;
    height: 3px;
    border-radius: 3px;
    background: $line;
    overflow: hidden;
  }

  &__fill {
    display: block;
    height: 100%;
    background: $accent;
    transform-origin: left center;
    transition: transform 0.45s $ease;
  }
}
</style>
