<script setup lang="ts">
import { ref } from 'vue'
import FormCta from '@/components/landing/FormCta.vue'
import { useReveal } from '@/composables/useReveal'
import { story } from '@/config/copy/landing'

// Sin foto a propósito: no tenemos imágenes de la casa de Alejandra y otra casa la suplantaría.
const root = ref<HTMLElement | null>(null)
useReveal(root)
</script>

<template>
  <section ref="root" class="story" aria-labelledby="story-title">
    <div class="story__inner">
      <div class="story__aside">
        <header class="story__head reveal">
          <p class="story__eyebrow">{{ story.eyebrow }}</p>
          <h2 id="story-title" class="story__title">{{ story.title }}</h2>
          <p class="story__place">
            <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
            {{ story.place }}
          </p>
        </header>

        <dl class="story__figures reveal">
          <div class="story__figure">
            <dt>{{ story.figures.from.label }}</dt>
            <dd>{{ story.figures.from.value }}</dd>
          </div>
          <div class="story__arrow" aria-hidden="true">
            <i class="fa-solid fa-arrow-right-long"></i>
          </div>
          <div class="story__figure story__figure--to">
            <dt>{{ story.figures.to.label }}</dt>
            <dd>
              <small>{{ story.figures.to.prefix }}</small>
              {{ story.figures.to.value }}
            </dd>
          </div>
        </dl>
      </div>

      <div class="story__body">
        <p v-for="text in story.paragraphs" :key="text" class="story__text reveal">{{ text }}</p>
        <blockquote class="story__quote reveal">
          <p>{{ story.quote }}</p>
        </blockquote>
        <p class="story__text reveal">{{ story.resolution }}</p>
        <div class="reveal">
          <FormCta :label="story.cta" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.story {
  background: $sand;
  padding-block: $space-section;

  &__inner {
    @include container;
    @include flex(column, stretch, flex-start, $space-xl);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
      gap: 6rem;
    }
  }

  &__aside {
    @include flex(column, stretch, flex-start, 2.5rem);

    @include from('lg') {
      flex: 0 0 42%;
      position: sticky;
      top: 7rem;
    }
  }

  &__head {
    @include flex(column, flex-start, flex-start, 1rem);
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-lg, 400);
    letter-spacing: -0.035em;
  }

  &__place {
    @include flex(row, center, flex-start, 0.5rem);
    font-size: $text-sm;
    font-weight: 500;
    color: $ink-soft;

    i {
      color: $accent;
    }
  }

  &__figures {
    @include flex(row, flex-end, flex-start, 1.2rem);
    flex-wrap: wrap;
    padding-top: 1.8rem;
    border-top: 1px solid rgba($ink, 0.14);
  }

  &__figure {
    @include flex(column-reverse, flex-start, flex-end, 0.4rem);
    flex: 1 1 8.5rem;
    min-width: 0;

    dd {
      @include display($display-sm, 400);
      color: $ink-soft;
      white-space: nowrap;

      small {
        font-size: 0.5em;
        font-style: italic;
        margin-right: 0.1em;
      }
    }

    dt {
      font-size: $text-xs;
      line-height: 1.45;
      color: $ink-muted;
      max-width: 18ch;
    }

    &--to dd {
      color: $danger;
    }
  }

  &__arrow {
    padding-bottom: 2.6rem;
    color: $ink-muted;

    @include until('sm') {
      display: none;
    }
  }

  &__body {
    @include flex(column, flex-start, flex-start, 1.4rem);
    max-width: 38rem;

    @include from('lg') {
      padding-top: 0.6rem;
    }
  }

  &__text {
    font-size: $text-lg;
    line-height: 1.7;
    color: $ink-soft;
  }

  &__quote {
    margin-block: 1.2rem;
    padding-left: 1.4rem;
    border-left: 2px solid $accent;

    p {
      @include display($display-sm, 400);
      font-style: italic;
      line-height: 1.2;
      color: $ink;
    }
  }
}
</style>
