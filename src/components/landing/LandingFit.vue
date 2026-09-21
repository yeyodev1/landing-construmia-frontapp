<script setup lang="ts">
import { ref } from 'vue'
import FormCta from '@/components/landing/FormCta.vue'
import { useReveal } from '@/composables/useReveal'
import { fit } from '@/config/copy/landing'

const root = ref<HTMLElement | null>(null)
useReveal(root)
</script>

<template>
  <section ref="root" class="fit" aria-labelledby="fit-title">
    <div class="fit__inner">
      <header class="fit__head reveal">
        <p class="fit__eyebrow">{{ fit.eyebrow }}</p>
        <h2 id="fit-title" class="fit__title">{{ fit.title }}</h2>
      </header>

      <div class="fit__columns">
        <div class="fit__col fit__col--yes reveal">
          <h3 class="fit__col-title">{{ fit.yes.title }}</h3>
          <ul class="fit__list">
            <li v-for="item in fit.yes.items" :key="item" class="fit__item">
              <i class="fa-solid fa-check" aria-hidden="true"></i>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>

        <div class="fit__col fit__col--no reveal" style="transition-delay: 120ms">
          <h3 class="fit__col-title">{{ fit.no.title }}</h3>
          <ul class="fit__list">
            <li v-for="item in fit.no.items" :key="item" class="fit__item">
              <i class="fa-solid fa-xmark" aria-hidden="true"></i>
              <span>{{ item }}</span>
            </li>
          </ul>
          <p class="fit__warning">{{ fit.no.warning }}</p>
        </div>
      </div>

      <div class="fit__close reveal">
        <p class="fit__closing">{{ fit.closing }}</p>
        <FormCta :label="fit.cta" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.fit {
  background: $paper;
  padding-block: $space-section;

  &__inner {
    @include container;
  }

  &__head {
    @include flex(column, flex-start, flex-start, 1rem);
    max-width: 44rem;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-md, 400);
  }

  &__columns {
    @include flex(column, stretch, flex-start, 1.25rem);
    margin-top: $space-xl;

    @include from('md') {
      flex-direction: row;
      gap: 1.5rem;
    }
  }

  &__col {
    @include flex(column, stretch, flex-start, 1.4rem);
    padding: 1.8rem 1.4rem;
    border-radius: $radius-md;

    @include from('md') {
      flex: 1 1 0;
      min-width: 0;
      padding: 2.4rem 2.2rem;
    }

    &--yes {
      background: $surface;
      border: 1px solid $line;

      @include from('md') {
        flex-grow: 1.25;
      }

      i {
        color: $accent;
      }
    }

    &--no {
      background: $sand;

      i {
        color: $ink-muted;
      }
    }
  }

  &__col-title {
    @include display($text-xl, 500);
  }

  &__list {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.95rem);
  }

  &__item {
    @include flex(row, baseline, flex-start, 0.85rem);
    color: $ink-soft;

    i {
      flex: 0 0 1rem;
      font-size: 0.9rem;
    }
  }

  &__warning {
    margin-top: auto;
    padding-top: 1.3rem;
    border-top: 1px solid rgba($ink, 0.12);
    font-size: $text-sm;
    font-style: italic;
    color: $ink-soft;
  }

  &__close {
    @include flex(column, flex-start, flex-start, 1.6rem);
    margin-top: $space-xl;

    @include from('md') {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 3rem;
    }
  }

  &__closing {
    @include display($display-sm, 400);
    font-style: italic;
    max-width: 26ch;
  }
}
</style>
