<script setup lang="ts">
import { ref } from 'vue'
import { useReveal } from '@/composables/useReveal'
import { faq } from '@/config/copy/landing'

// <details>/<summary> nativos: teclado, lector de pantalla y búsqueda del navegador sin JS.
const root = ref<HTMLElement | null>(null)
useReveal(root)
</script>

<template>
  <section ref="root" class="faq" aria-labelledby="faq-title">
    <div class="faq__inner">
      <header class="faq__head reveal">
        <p class="faq__eyebrow">{{ faq.eyebrow }}</p>
        <h2 id="faq-title" class="faq__title">{{ faq.title }}</h2>
      </header>

      <div class="faq__list reveal">
        <details v-for="item in faq.items" :key="item.q" class="faq__item">
          <summary class="faq__question">
            <span>{{ item.q }}</span>
            <i class="fa-solid fa-plus faq__icon" aria-hidden="true"></i>
          </summary>
          <p class="faq__answer">{{ item.a }}</p>
        </details>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.faq {
  background: $paper;
  padding-block: $space-section;

  &__inner {
    @include container;
    @include flex(column, stretch, flex-start, 2.5rem);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
      gap: 5rem;
    }
  }

  &__head {
    @include flex(column, flex-start, flex-start, 1rem);

    @include from('lg') {
      flex: 0 0 34%;
      position: sticky;
      top: 7rem;
    }
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-md, 400);
  }

  &__list {
    flex: 1 1 auto;
    min-width: 0;
    border-top: 1px solid $line;
  }

  &__item {
    border-bottom: 1px solid $line;

    &[open] .faq__icon {
      transform: rotate(45deg);
      color: $accent;
    }
  }

  &__question {
    @include flex(row, center, space-between, 1.2rem);
    padding-block: 1.3rem;
    min-height: 3rem;
    cursor: pointer;
    list-style: none;
    font-family: $font-display;
    font-size: $text-lg;
    font-weight: 500;
    line-height: 1.3;
    color: $ink;
    transition: color 0.25s $ease;
    @include focus-ring;

    &::-webkit-details-marker {
      display: none;
    }

    &:hover {
      color: $accent-deep;
    }
  }

  &__icon {
    flex: 0 0 auto;
    font-size: 0.85rem;
    color: $ink-muted;
    transition:
      transform 0.3s $ease,
      color 0.3s $ease;
  }

  &__answer {
    padding: 0 2.5rem 1.5rem 0;
    color: $ink-soft;
    max-width: 60ch;
  }
}
</style>
