<script setup lang="ts">
import { ref } from 'vue'
import { cld, cldSet, media } from '@/config/media'
import { videoCopy } from '@/config/copy/video'
import { useReveal } from '@/composables/useReveal'

const copy = videoCopy.trust
const root = ref<HTMLElement | null>(null)
useReveal(root)

// La misma cocina en sus tres momentos: es la prueba más corta de "del render a la realidad".
const stages = copy.stages.map((stage) => ({ ...stage, id: media.renderToReality[stage.key] }))
</script>

<template>
  <section ref="root" class="trust" aria-labelledby="trust-title">
    <div class="trust__head reveal">
      <p class="trust__eyebrow">{{ copy.eyebrow }}</p>
      <h2 id="trust-title" class="trust__title">{{ copy.title }}</h2>
    </div>

    <ol class="trust__stages reveal">
      <li v-for="stage in stages" :key="stage.key" class="trust__stage">
        <img
          class="trust__img"
          :src="cld(stage.id, 800)"
          :srcset="cldSet(stage.id, [240, 480, 800])"
          sizes="(min-width: 1024px) 320px, 33vw"
          :alt="stage.alt"
          width="800"
          height="1000"
          loading="lazy"
          decoding="async"
        />
        <span class="trust__caption">{{ stage.caption }}</span>
      </li>
    </ol>

    <ul class="trust__facts reveal">
      <li v-for="fact in copy.facts" :key="fact" class="trust__fact">{{ fact }}</li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.trust {
  @include flex(column, stretch, flex-start, 1.75rem);

  @include from('md') {
    gap: 2.5rem;
  }

  &__head {
    @include flex(column, flex-start, flex-start, 0.7rem);
    max-width: 38rem;
  }

  &__eyebrow {
    @include eyebrow;
    color: $accent-glow;
  }

  &__title {
    @include display($display-sm, 400);
    color: $on-night;
  }

  &__stages {
    @include flex(row, stretch, flex-start, 0.4rem);
    list-style: none;

    @include from('md') {
      gap: 1rem;
    }
  }

  &__stage {
    position: relative;
    flex: 1 1 0;
    min-width: 0;
    overflow: hidden;
    border-radius: 6px;
    background: $night-soft;

    @include from('md') {
      border-radius: $radius-sm;
    }
  }

  &__img {
    width: 100%;
    height: 100%;
    aspect-ratio: 4 / 5;
    object-fit: cover;
  }

  &__caption {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 1.6rem 0.55rem 0.5rem;
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: $on-night;
    background: linear-gradient(180deg, transparent, rgba(#0e0c0a, 0.78));

    @include from('md') {
      padding: 2.5rem 1rem 0.9rem;
      font-size: $text-xs;
    }
  }

  &__facts {
    @include flex(column, stretch, flex-start, 0);
    list-style: none;
    border-top: 1px solid $night-line;

    @include from('md') {
      flex-direction: row;
      border-top: none;
      gap: 2rem;
    }
  }

  &__fact {
    padding-block: 0.9rem;
    font-size: $text-sm;
    line-height: 1.5;
    color: $on-night-soft;
    border-bottom: 1px solid $night-line;

    @include from('md') {
      flex: 1 1 0;
      padding-block: 1rem 0;
      border-bottom: none;
      border-top: 1px solid $night-line;
    }
  }
}
</style>
