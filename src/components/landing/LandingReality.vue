<script setup lang="ts">
import { ref } from 'vue'
import { useReveal } from '@/composables/useReveal'
import { cld, cldSet } from '@/config/media'
import { reality } from '@/config/copy/landing'

const root = ref<HTMLElement | null>(null)
useReveal(root)
</script>

<template>
  <section ref="root" class="reality" aria-labelledby="reality-title">
    <div class="reality__inner">
      <header class="reality__head reveal">
        <p class="reality__eyebrow">{{ reality.eyebrow }}</p>
        <h2 id="reality-title" class="reality__title">{{ reality.title }}</h2>
        <p class="reality__lead">{{ reality.lead }}</p>
      </header>

      <ol class="reality__stages">
        <li
          v-for="(stage, index) in reality.stages"
          :key="stage.id"
          class="stage reveal"
          :style="{ transitionDelay: `${index * 120}ms` }"
        >
          <figure class="stage__figure">
            <div class="stage__frame">
              <img
                :src="cld(stage.id, 900)"
                :srcset="cldSet(stage.id, [480, 720, 960, 1280])"
                sizes="(min-width: 1160px) 360px, (min-width: 768px) 31vw, 100vw"
                :alt="stage.alt"
                loading="lazy"
                decoding="async"
              />
              <span class="stage__tag">{{ stage.tag }}</span>
            </div>
            <figcaption class="stage__caption">
              <span class="stage__number" aria-hidden="true">0{{ index + 1 }}</span>
              {{ stage.title }}
            </figcaption>
          </figure>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped lang="scss">
.reality {
  background: $paper;
  padding-block: $space-section;

  &__inner {
    @include container(1280px);
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

  &__lead {
    font-size: $text-lg;
    color: $ink-soft;
  }

  &__stages {
    list-style: none;
    @include flex(column, stretch, flex-start, 2rem);
    margin-top: $space-xl;

    @include from('md') {
      flex-direction: row;
      gap: 1.25rem;
    }
  }
}

.stage {
  @include from('md') {
    flex: 1 1 0;
    min-width: 0;

    // Cada momento baja un poco: se lee como una secuencia, no como tres fotos sueltas.
    &:nth-child(2) {
      margin-top: 3rem;
    }

    &:nth-child(3) {
      margin-top: 6rem;
    }
  }

  &__figure {
    @include flex(column, stretch, flex-start, 1rem);
  }

  &__frame {
    position: relative;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    border-radius: $radius-sm;
    background: $sand;

    @include from('md') {
      aspect-ratio: 4 / 5;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 1.2s $ease;
    }

    &:hover img {
      transform: scale(1.03);
    }
  }

  &__tag {
    position: absolute;
    left: 0.9rem;
    top: 0.9rem;
    padding: 0.35rem 0.75rem;
    border-radius: $radius-pill;
    background: rgba($night, 0.72);
    backdrop-filter: blur(6px);
    color: $on-night;
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.06em;
  }

  &__caption {
    @include flex(row, baseline, flex-start, 0.8rem);
    @include display($text-xl, 400);
  }

  &__number {
    font-family: $font-principal;
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.14em;
    color: $accent;
  }
}
</style>
