<script setup lang="ts">
import { ref } from 'vue'
import FormCta from '@/components/landing/FormCta.vue'
import { useReveal } from '@/composables/useReveal'
import { problem } from '@/config/copy/landing'

const root = ref<HTMLElement | null>(null)
useReveal(root)
</script>

<template>
  <section ref="root" class="problem" aria-labelledby="problem-title">
    <div class="problem__inner">
      <header class="problem__head reveal">
        <p class="problem__eyebrow">{{ problem.eyebrow }}</p>
        <h2 id="problem-title" class="problem__title">{{ problem.title }}</h2>
      </header>

      <ol class="problem__pains">
        <li
          v-for="(pain, index) in problem.pains"
          :key="pain.title"
          class="problem__pain reveal"
          :style="{ transitionDelay: `${index * 90}ms` }"
        >
          <span class="problem__number" aria-hidden="true">0{{ index + 1 }}</span>
          <h3 class="problem__pain-title">{{ pain.title }}</h3>
          <p class="problem__pain-text">{{ pain.text }}</p>
        </li>
      </ol>

      <div class="problem__pivot reveal">
        <p class="problem__statement">
          {{ problem.pivot[0] }}
          <em>{{ problem.pivot[1] }}</em>
        </p>
        <div class="problem__resolve">
          <p class="problem__text">{{ problem.pivotText }}</p>
          <FormCta :label="problem.cta" variant="dark" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.problem {
  background: $paper;
  padding-block: $space-section;

  &__inner {
    @include container;
  }

  &__head {
    @include flex(column, flex-start, flex-start, 1rem);
    max-width: 50rem;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-md, 400);
  }

  &__pains {
    list-style: none;
    @include flex(column, stretch, flex-start, 0);
    margin-top: $space-xl;
    border-top: 1px solid $line;

    @include from('md') {
      flex-direction: row;
    }
  }

  &__pain {
    @include flex(column, flex-start, flex-start, 0.5rem);
    padding: 1.6rem 0;
    border-bottom: 1px solid $line;

    @include from('md') {
      flex: 1 1 0;
      padding: 2rem 2rem 2rem 0;
      border-bottom: 0;

      & + & {
        padding-left: 2rem;
        border-left: 1px solid $line;
      }
    }
  }

  &__number {
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.18em;
    color: $accent;
  }

  &__pain-title {
    @include display($text-xl, 500);
  }

  &__pain-text {
    color: $ink-soft;
    max-width: 30ch;
  }

  &__pivot {
    @include flex(column, flex-start, flex-start, 2rem);
    margin-top: $space-xl;

    @include from('lg') {
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
      gap: 4rem;
    }
  }

  &__statement {
    @include display($display-lg, 400);
    letter-spacing: -0.035em;
    max-width: 14ch;

    em {
      display: block;
      font-style: italic;
      color: $accent;
    }
  }

  &__resolve {
    @include flex(column, flex-start, flex-start, 1.6rem);
    max-width: 30rem;
    padding-bottom: 0.4rem;
  }

  &__text {
    font-size: $text-lg;
    color: $ink-soft;
  }
}
</style>
