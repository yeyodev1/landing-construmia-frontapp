<script setup lang="ts">
import HeroVideo from '@/components/landing/HeroVideo.vue'
import { hero } from '@/config/copy/landing'

// El video es el protagonista: en desktop comparte la primera pantalla con el titular;
// en móvil va a sangre justo debajo del titular, y la prueba de confianza queda debajo del video.
</script>

<template>
  <section id="inicio" class="hero" aria-labelledby="hero-title">
    <div class="hero__inner">
      <div class="hero__copy">
        <p class="hero__eyebrow">{{ hero.eyebrow }}</p>
        <h1 id="hero-title" class="hero__title">
          {{ hero.title[0] }}
          <em>{{ hero.title[1] }}</em>
        </h1>
        <p class="hero__lead">{{ hero.lead }}</p>
      </div>

      <div class="hero__stage">
        <HeroVideo class="hero__video" />

        <dl class="hero__trust">
          <div v-for="item in hero.trust" :key="item.label" class="hero__fact">
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </div>
        </dl>
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

  // La luz del proyector: un halo cobre muy tenue detrás de la pantalla, nada más.
  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    right: -10%;
    top: 10%;
    width: min(1100px, 150vw);
    height: 80%;
    background: radial-gradient(closest-side, rgba($accent, 0.2), transparent);
    pointer-events: none;
  }

  &__inner {
    @include container(1280px);
    @include flex(column, stretch, flex-start, 1.6rem);
    padding-block: 2rem 3rem;

    @include from('lg') {
      flex-direction: row;
      align-items: center;
      gap: clamp(2.5rem, 4vw, 4rem);
      padding-block: 3.5rem 4.5rem;
      min-height: calc(100svh - 72px);
    }
  }

  &__copy {
    @include flex(column, flex-start, flex-start, 0.9rem);
    animation: hero-rise 0.7s $ease both;

    @include from('lg') {
      flex: 0 0 34%;
      min-width: 0;
      gap: 1.3rem;
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
    @include display(clamp(2.1rem, 1.5rem + 2.6vw, 3.6rem), 400);
    line-height: 1.04;
    letter-spacing: -0.03em;

    em {
      display: block;
      font-style: italic;
      color: $accent-glow;
    }
  }

  &__lead {
    font-size: $text-base;
    line-height: 1.6;
    color: $on-night-soft;
    max-width: 34rem;

    @include from('lg') {
      font-size: $text-lg;
    }
  }

  &__stage {
    @include flex(column, stretch, flex-start, 0);
    min-width: 0;
    animation: hero-rise 0.8s $ease 0.1s both;

    @include from('lg') {
      flex: 1 1 0;
    }
  }

  // En móvil la pantalla va a sangre: el video se ve más grande sin salirse del flujo.
  &__video {
    margin-inline: -1.25rem;

    @include from('md') {
      margin-inline: 0;
    }
  }

  &__trust {
    @include flex(column, stretch, flex-start, 0);
    margin-top: 1.25rem;
    border-top: 1px solid $night-line;

    @include from('sm') {
      flex-direction: row;
    }

    @include from('md') {
      margin-top: 1.75rem;
    }
  }

  &__fact {
    @include flex(column-reverse, flex-start, flex-end, 0.25rem);
    padding: 0.9rem 0;
    border-bottom: 1px solid $night-line;

    @include from('sm') {
      flex: 1 1 0;
      border-bottom: 0;
      padding: 1.1rem 1.1rem 0 0;

      & + & {
        padding-left: 1.1rem;
        border-left: 1px solid $night-line;
      }
    }

    dd {
      @include display($text-lg, 500);
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

@keyframes hero-rise {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
