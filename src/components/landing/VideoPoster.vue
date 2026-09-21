<script setup lang="ts">
import { hero } from '@/config/copy/landing'

/**
 * Cara del video antes de darle play: un cuadro real del VSL, la etiqueta, el botón grande y
 * la duración. Solo es visual; el botón o enlace que lo envuelve decide qué pasa al tocarlo.
 */
defineProps<{ cta?: string }>()

const copy = hero.video

// Cuadro del video en Wistia: se pide al tamaño justo para cada pantalla.
const posterSet = [640, 960, 1280, 1920]
  .map((w) => `${copy.poster}?image_crop_resized=${w}x${Math.round((w * 9) / 16)} ${w}w`)
  .join(', ')
</script>

<template>
  <span class="poster">
    <img
      class="poster__image"
      :src="`${copy.poster}?image_crop_resized=1280x720`"
      :srcset="posterSet"
      sizes="(min-width: 1024px) 62vw, 100vw"
      :alt="copy.posterAlt"
      width="1280"
      height="720"
      fetchpriority="high"
      decoding="async"
    />
    <span class="poster__shade" aria-hidden="true"></span>

    <span class="poster__tag">
      <span class="poster__dot" aria-hidden="true"></span>
      <span>{{ copy.tag }}</span>
      <span class="poster__method"><span aria-hidden="true">·</span> {{ copy.method }}</span>
    </span>

    <span class="poster__center">
      <span class="poster__play" aria-hidden="true"><i class="fa-solid fa-play"></i></span>
      <span v-if="cta" class="poster__cta">{{ cta }}</span>
    </span>

    <span class="poster__meta">
      <span class="poster__chip">
        <i class="fa-regular fa-clock" aria-hidden="true"></i>
        <span aria-hidden="true">{{ copy.duration }}</span>
        <span class="visually-hidden">{{ copy.durationLabel }}</span>
      </span>
      <span class="poster__chip poster__chip--sound">
        <i class="fa-solid fa-volume-high" aria-hidden="true"></i>{{ copy.sound }}
      </span>
    </span>
  </span>
</template>

<style scoped lang="scss">
.poster {
  position: absolute;
  inset: 0;
  display: block;
  overflow: hidden;
  color: $on-night;
  background: $night;

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.01);
    transition: transform 1.2s $ease;
  }

  // Oscurece arriba y abajo para que etiqueta y duración se lean sobre cualquier cuadro.
  &__shade {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, rgba($night, 0.55) 0%, transparent 28%),
      linear-gradient(0deg, rgba($night, 0.75) 0%, transparent 38%),
      rgba($night, 0.12);
    transition: background-color 0.4s ease;
  }

  &__tag {
    position: absolute;
    top: 0.75rem;
    left: 0.75rem;
    @include flex(row, center, flex-start, 0.45rem);
    max-width: calc(100% - 1.5rem);
    padding: 0.4rem 0.75rem 0.4rem 0.6rem;
    border-radius: $radius-pill;
    background: rgba($night, 0.55);
    border: 1px solid rgba($on-night, 0.14);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    font-size: 0.66rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    white-space: nowrap;

    @include from('md') {
      top: 1.1rem;
      left: 1.1rem;
      font-size: 0.7rem;
    }
  }

  // En pantallas angostas la etiqueta queda en "Mira cómo trabajamos": el método ya está en el titular.
  &__method {
    display: none;
    color: $accent-glow;

    @include from('sm') {
      display: inline;
    }
  }

  &__dot {
    flex: none;
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 50%;
    background: $accent-glow;
    box-shadow: 0 0 0 3px rgba($accent-glow, 0.25);
  }

  &__center {
    position: absolute;
    inset: 0;
    @include flex(column, center, center, 0.75rem);
  }

  &__play {
    position: relative;
    @include flex(row, center, center);
    width: 4.4rem;
    height: 4.4rem;
    border-radius: 50%;
    background: $accent;
    color: $surface;
    font-size: 1.25rem;
    padding-left: 0.25rem;
    box-shadow:
      0 0 0 8px rgba($accent, 0.22),
      0 18px 40px rgba(#000, 0.45);
    transition:
      transform 0.35s $ease,
      box-shadow 0.35s $ease;

    // Onda suave que invita a tocar; con movimiento reducido queda quieta.
    &::after {
      content: '';
      position: absolute;
      inset: -8px;
      border-radius: 50%;
      border: 1px solid rgba($accent-glow, 0.7);
      animation: poster-ring 2.4s $ease infinite;
    }

    @include from('md') {
      width: 5.75rem;
      height: 5.75rem;
      font-size: 1.6rem;
    }
  }

  &__cta {
    padding: 0.35rem 0.9rem;
    border-radius: $radius-pill;
    background: rgba($night, 0.6);
    font-size: $text-sm;
    font-weight: 600;
    letter-spacing: 0.04em;
  }

  &__meta {
    position: absolute;
    inset: auto 0.75rem 0.75rem;
    @include flex(row, center, space-between, 0.5rem);

    @include from('md') {
      inset: auto 1.1rem 1.1rem;
    }
  }

  &__chip {
    @include flex(row, center, flex-start, 0.4rem);
    padding: 0.3rem 0.65rem;
    border-radius: $radius-pill;
    background: rgba($night, 0.55);
    font-size: 0.72rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.04em;

    i {
      font-size: 0.72rem;
      color: $accent-glow;
    }

    &--sound {
      color: $on-night-soft;
    }
  }

  // El contenedor (botón o enlace) marca hover y foco; el póster responde.
  :hover > &,
  :focus-visible > & {
    .poster__image {
      transform: scale(1.04);
    }

    .poster__play {
      transform: scale(1.07);
      box-shadow:
        0 0 0 12px rgba($accent, 0.24),
        0 22px 50px rgba(#000, 0.5);
    }
  }
}

@keyframes poster-ring {
  0% {
    opacity: 0.8;
    transform: scale(1);
  }
  70%,
  100% {
    opacity: 0;
    transform: scale(1.45);
  }
}

@include reduced-motion {
  .poster__play::after {
    animation: none;
    opacity: 0;
  }
}
</style>
