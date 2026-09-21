<script setup lang="ts">
import LeadForm from '@/components/lead/LeadForm.vue'
import { cld, cldSet } from '@/config/media'
import { hero } from '@/config/copy/landing'

// El formulario es el protagonista: en desktop comparte la primera pantalla con el titular;
// en móvil va justo debajo del titular, y la bajada y las pruebas quedan después.
// `#registro` vive acá (no en LeadForm) porque es el ancla de todos los CTA y del router.
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero__media">
      <img
        :src="cld(hero.image.id, 1600)"
        :srcset="cldSet(hero.image.id, [640, 960, 1280, 1600, 2000])"
        sizes="100vw"
        :alt="hero.image.alt"
        width="1600"
        height="1600"
        fetchpriority="high"
        decoding="async"
      />
    </div>

    <div class="hero__inner">
      <div class="hero__copy">
        <div class="hero__intro">
          <p class="hero__eyebrow">{{ hero.eyebrow }}</p>
          <h1 id="hero-title" class="hero__title">
            {{ hero.title[0] }}
            <em>{{ hero.title[1] }}</em>
          </h1>
        </div>

        <div class="hero__details">
          <p class="hero__lead">{{ hero.lead }}</p>
          <dl class="hero__trust">
            <div v-for="item in hero.trust" :key="item.label" class="hero__fact">
              <dt>{{ item.label }}</dt>
              <dd>{{ item.value }}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div id="registro" class="hero__form" tabindex="-1">
        <LeadForm />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  isolation: isolate;
  background: $night;
  color: $on-night;
  overflow: hidden;

  // Móvil: la foto es una banda arriba que se funde en la noche detrás del titular.
  &__media {
    position: absolute;
    inset: 0 0 auto;
    height: 30rem;
    z-index: -1;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        180deg,
        rgba($night, 0.35) 0%,
        rgba($night, 0.55) 45%,
        $night 100%
      );
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: 50% 40%;
    }

    @include from('lg') {
      inset: 0;
      height: auto;

      img {
        object-position: 50% 70%;
      }

      &::after {
        background:
          linear-gradient(90deg, rgba($night, 0.94) 0%, rgba($night, 0.78) 42%, rgba($night, 0.3) 100%),
          linear-gradient(0deg, rgba($night, 0.85) 0%, transparent 40%);
      }
    }
  }

  &__inner {
    @include container(1280px);
    @include flex(column, stretch, flex-start, 0);
    padding-block: 3.2rem 3.5rem;

    @include from('lg') {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: clamp(2.5rem, 5vw, 5rem);
      padding-block: 4.5rem 5rem;
      min-height: calc(100svh - 72px);
    }
  }

  // En móvil los hijos de la columna se ordenan alrededor del formulario.
  &__copy {
    display: contents;

    @include from('lg') {
      @include flex(column, flex-start, flex-start, 2.2rem);
      flex: 1 1 0;
      min-width: 0;
      max-width: 40rem;
    }
  }

  &__intro {
    order: 1;
    @include flex(column, flex-start, flex-start, 1.1rem);
    margin-bottom: 2rem;

    @include from('lg') {
      margin-bottom: 0;
    }
  }

  &__eyebrow {
    @include eyebrow;
    color: $accent-glow;

    @include until('sm') {
      letter-spacing: 0.14em;
    }
  }

  &__title {
    @include display(clamp(2.35rem, 1.5rem + 4.2vw, 4.6rem), 400);
    line-height: 1.02;
    letter-spacing: -0.03em;

    em {
      display: block;
      font-style: italic;
      color: $accent-glow;
    }
  }

  &__form {
    order: 2;
    scroll-margin-top: 5rem;
    outline: none;

    @include from('lg') {
      flex: 0 0 min(30rem, 44%);
    }
  }

  &__details {
    order: 3;
    @include flex(column, stretch, flex-start, 2rem);
    margin-top: 2.5rem;

    @include from('lg') {
      margin-top: 0;
    }
  }

  &__lead {
    font-size: $text-lg;
    line-height: 1.6;
    color: $on-night-soft;
    max-width: 34rem;
  }

  &__trust {
    @include flex(column, stretch, flex-start, 0);
    border-top: 1px solid $night-line;

    @include from('sm') {
      flex-direction: row;
    }
  }

  &__fact {
    @include flex(column-reverse, flex-start, flex-end, 0.25rem);
    padding: 1rem 0;
    border-bottom: 1px solid $night-line;

    @include from('sm') {
      flex: 1 1 0;
      border-bottom: 0;
      padding: 1.2rem 1.2rem 0 0;

      & + & {
        padding-left: 1.2rem;
        border-left: 1px solid $night-line;
      }
    }

    dd {
      @include display($text-xl, 500);
      color: $on-night;
    }

    dt {
      font-size: $text-xs;
      letter-spacing: 0.04em;
      color: $on-night-soft;
      line-height: 1.45;
    }
  }
}
</style>
