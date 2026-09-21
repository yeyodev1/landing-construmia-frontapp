<script setup lang="ts">
import { form as copy } from '@/config/copy/landing'

/** Quien ya se registró no rellena de nuevo: retoma el embudo o pide el formulario a propósito. */
defineProps<{ name: string }>()

const emit = defineEmits<{ resume: []; other: [] }>()
</script>

<template>
  <div class="resume">
    <p class="resume__eyebrow">{{ copy.resume.eyebrow }}</p>
    <h2 class="resume__title">{{ copy.resume.title(name) }}</h2>
    <p class="resume__lead">{{ copy.resume.lead }}</p>
    <button type="button" class="btn btn--primary btn--lg btn--block resume__cta" @click="emit('resume')">
      {{ copy.resume.cta }}
      <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
    </button>
    <button type="button" class="resume__other" @click="emit('other')">
      {{ copy.resume.other }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.resume {
  @include flex(column, stretch, flex-start, 0.95rem);

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($text-xl);
  }

  &__lead {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__cta {
    margin-top: 0.3rem;
  }

  &__other {
    align-self: center;
    min-height: 44px;
    padding: 0.4rem 0.6rem;
    font-size: $text-sm;
    color: $ink-soft;
    text-decoration: underline;
    text-underline-offset: 3px;
    @include transition(color);

    @media (hover: hover) {
      &:hover {
        color: $accent-deep;
      }
    }
  }
}
</style>
