<script setup lang="ts">
import { computed } from 'vue'
import { useLeadStore } from '@/stores/lead'
import { cld, cldSet, media } from '@/config/media'
import { notFoundCopy } from '@/config/copy/shell'

const leadStore = useLeadStore()

// real-obra-06: estructura de hormigón sin terminar (la toma sin logo). Un 404 también es una obra a medias.
const photo = media.reales.obra[5] ?? media.renderToReality.obra

// Quien ya se registró no vuelve al formulario: retoma el embudo donde iba.
const back = computed(() =>
  leadStore.isRegistered
    ? { to: { name: leadStore.canSchedule ? 'Schedule' : 'Video' }, label: notFoundCopy.ctaRegistered }
    : { to: { name: 'Home' }, label: notFoundCopy.cta },
)
</script>

<template>
  <section class="not-found">
    <div class="not-found__body">
      <p class="not-found__eyebrow">{{ notFoundCopy.eyebrow }}</p>
      <h1 class="not-found__title">{{ notFoundCopy.title }}</h1>
      <p class="not-found__text">{{ notFoundCopy.text }}</p>
      <RouterLink :to="back.to" class="btn btn--primary btn--lg not-found__cta">
        {{ back.label }}
        <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </RouterLink>
    </div>

    <figure class="not-found__figure">
      <img
        :src="cld(photo, 1200)"
        :srcset="cldSet(photo)"
        sizes="(min-width: 1024px) 50vw, 100vw"
        :alt="notFoundCopy.imageAlt"
        width="1242"
        height="1539"
        decoding="async"
      />
      <figcaption class="not-found__caption">{{ notFoundCopy.imageCaption }}</figcaption>
    </figure>
  </section>
</template>

<style scoped lang="scss">
.not-found {
  flex: 1;
  @include flex(column, stretch, flex-start, 0);

  @include from('lg') {
    flex-direction: row;
    min-height: calc(100vh - 72px);
  }

  &__body {
    @include flex(column, flex-start, center, 1.1rem);
    padding: 3.5rem 1.25rem 3rem;

    @include from('md') {
      padding: 5rem 2rem 4rem;
    }

    @include from('lg') {
      flex: 1 1 50%;
      padding: 4rem clamp(2rem, 6vw, 6rem);
    }
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-md);
    max-width: 14ch;
  }

  &__text {
    font-size: $text-lg;
    color: $ink-soft;
    max-width: 38ch;
  }

  &__cta {
    margin-top: 0.9rem;

    i {
      font-size: 0.8em;
      transition: transform 0.25s $ease;
    }

    @media (hover: hover) {
      &:hover i {
        transform: translateX(3px);
      }
    }
  }

  // La foto va a sangre: en móvil cierra la pantalla, en desktop ocupa media página.
  &__figure {
    position: relative;
    aspect-ratio: 4 / 3;
    background: $sand;
    overflow: hidden;

    @include from('lg') {
      flex: 1 1 50%;
      aspect-ratio: auto;
    }

    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: 30% 40%;
    }
  }

  &__caption {
    position: absolute;
    left: 1.25rem;
    bottom: 1.1rem;
    padding: 0.35rem 0.7rem;
    font-size: 0.66rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: $on-night;
    background: rgba($night, 0.62);
    backdrop-filter: blur(6px);
    border-radius: 2px;

    @include from('lg') {
      left: auto;
      right: 2rem;
      bottom: 2rem;
    }
  }
}
</style>
