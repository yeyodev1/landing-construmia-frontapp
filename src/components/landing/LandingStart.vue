<script setup lang="ts">
import { ref } from 'vue'
import FormCta from '@/components/landing/FormCta.vue'
import { useReveal } from '@/composables/useReveal'
import { start } from '@/config/copy/landing'

const root = ref<HTMLElement | null>(null)
useReveal(root)
</script>

<template>
  <section ref="root" class="start" aria-labelledby="start-title">
    <div class="start__inner">
      <header class="start__head reveal">
        <p class="start__eyebrow">{{ start.eyebrow }}</p>
        <h2 id="start-title" class="start__title">{{ start.title }}</h2>
      </header>

      <ol class="start__steps">
        <li
          v-for="(step, index) in start.steps"
          :key="step.title"
          class="step reveal"
          :class="{ 'step--first': index === 0 }"
          :style="{ transitionDelay: `${index * 120}ms` }"
        >
          <div class="step__top">
            <span class="step__number" aria-hidden="true">0{{ index + 1 }}</span>
            <i
              v-if="index < start.steps.length - 1"
              class="fa-solid fa-arrow-right-long step__arrow"
              aria-hidden="true"
            ></i>
          </div>
          <p class="step__price">{{ step.price }}</p>
          <p class="step__note">{{ step.priceNote }}</p>
          <h3 class="step__title">{{ step.title }}</h3>
          <p class="step__text">{{ step.text }}</p>
        </li>
      </ol>

      <div class="start__foot reveal">
        <FormCta :label="start.cta" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.start {
  background: $sand;
  padding-block: $space-section;

  &__inner {
    @include container;
  }

  &__head {
    @include flex(column, flex-start, flex-start, 1rem);
    max-width: 46rem;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-md, 400);
  }

  &__steps {
    list-style: none;
    @include flex(column, stretch, flex-start, 0);
    margin-top: $space-xl;

    @include from('lg') {
      flex-direction: row;
      gap: 1.25rem;
    }
  }

  &__foot {
    margin-top: $space-xl;
  }
}

.step {
  @include flex(column, flex-start, flex-start, 0.5rem);
  padding-block: 2rem;
  border-top: 1px solid rgba($ink, 0.16);

  @include from('lg') {
    flex: 1 1 0;
    min-width: 0;
    padding: 1.6rem 0 0;
  }

  // La visita es la puerta de entrada: el único paso que se decide hoy.
  &--first {
    @include from('lg') {
      border-top: 2px solid $accent;
    }
  }

  &__top {
    @include flex(row, center, space-between, 1rem);
    align-self: stretch;
    margin-bottom: 0.8rem;
  }

  &__number {
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.16em;
    color: $accent-deep;
  }

  &__arrow {
    display: none;
    color: $ink-muted;

    @include from('lg') {
      display: inline-block;
    }
  }

  &__price {
    @include display($display-lg, 400);
    letter-spacing: -0.04em;
    color: $ink;
  }

  &--first &__price {
    color: $accent-deep;
  }

  &__note {
    @include eyebrow;
    color: $ink-soft;
    letter-spacing: 0.14em;
  }

  &__title {
    @include display($text-xl, 500);
    margin-top: 1rem;
  }

  &__text {
    font-size: $text-sm;
    line-height: 1.7;
    color: $ink-soft;
    max-width: 38ch;
  }
}
</style>
