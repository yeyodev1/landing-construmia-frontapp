<script setup lang="ts">
import { computed, ref } from 'vue'
import FormCta from '@/components/landing/FormCta.vue'
import { useReveal } from '@/composables/useReveal'
import { facts } from '@/config/site'
import { method } from '@/config/copy/landing'

const root = ref<HTMLElement | null>(null)
useReveal(root)

// Un solo camino: los 8 pasos del video, cada uno con su línea de detalle.
const steps = computed(() =>
  facts.steps.map((name, index) => ({
    name,
    number: String(index + 1).padStart(2, '0'),
    detail: method.details[index] ?? '',
  })),
)
</script>

<template>
  <section ref="root" class="method" aria-labelledby="method-title">
    <div class="method__inner">
      <div class="method__aside">
        <header class="method__head reveal">
          <p class="method__eyebrow">{{ method.eyebrow }}</p>
          <h2 id="method-title" class="method__title">{{ method.title }}</h2>
          <p class="method__lead">{{ method.lead }}</p>
        </header>
        <div class="method__foot reveal">
          <p class="method__note">{{ method.note }}</p>
          <FormCta :label="method.cta" variant="light" />
        </div>
      </div>

      <ol class="path reveal">
        <li v-for="step in steps" :key="step.name" class="path__step">
          <span class="path__node" aria-hidden="true">{{ step.number }}</span>
          <div class="path__body">
            <h3 class="path__name">{{ step.name }}</h3>
            <p class="path__detail">{{ step.detail }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped lang="scss">
.method {
  background: $night;
  color: $on-night;
  padding-block: $space-section;

  &__inner {
    @include container;
    @include flex(column, stretch, flex-start, $space-xl);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;
      gap: 5rem;
    }
  }

  &__aside {
    @include flex(column, flex-start, flex-start, 2.5rem);

    @include from('lg') {
      flex: 0 0 44%;
      position: sticky;
      top: 7rem;
    }
  }

  &__head {
    @include flex(column, flex-start, flex-start, 1.1rem);
  }

  &__eyebrow {
    @include eyebrow;
    color: $accent-glow;
  }

  &__title {
    @include display($display-md, 400);
  }

  &__lead {
    font-size: $text-lg;
    color: $on-night-soft;
  }

  &__foot {
    @include flex(column, flex-start, flex-start, 1.6rem);
    padding-top: 1.8rem;
    border-top: 1px solid $night-line;
  }

  &__note {
    font-size: $text-sm;
    line-height: 1.7;
    color: $on-night-soft;
  }
}

// El camino: una sola línea continua que une los 8 pasos, sin cortes entre etapas.
.path {
  --node: 2.75rem;
  list-style: none;
  position: relative;
  flex: 1 1 auto;
  max-width: 34rem;

  &::before {
    content: '';
    position: absolute;
    left: calc(var(--node) / 2);
    top: calc(var(--node) / 2);
    bottom: calc(var(--node) / 2);
    width: 1px;
    background: linear-gradient(180deg, $accent-glow, rgba($accent-glow, 0.25));
    transform-origin: top;
    transform: scaleY(0);
    transition: transform 1.4s $ease 0.2s;
  }

  // La propia lista es el .reveal: al aparecer, la línea se dibuja de arriba hacia abajo.
  &.is-visible::before {
    transform: scaleY(1);
  }

  &__step {
    position: relative;
    @include flex(row, flex-start, flex-start, 1.25rem);
    padding-bottom: 2.2rem;

    &:last-child {
      padding-bottom: 0;
    }
  }

  &__node {
    flex: 0 0 var(--node);
    height: var(--node);
    @include flex(row, center, center);
    border-radius: 50%;
    background: $night;
    border: 1px solid rgba($accent-glow, 0.55);
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: $accent-glow;
    font-variant-numeric: tabular-nums;
  }

  &__step:last-child &__node {
    background: $accent-glow;
    color: $night;
  }

  &__body {
    @include flex(column, flex-start, flex-start, 0.3rem);
    padding-top: 0.45rem;
    min-width: 0;
  }

  &__name {
    @include display($text-xl, 500);
  }

  &__detail {
    font-size: $text-sm;
    color: $on-night-soft;
  }
}
</style>
