<script setup lang="ts">
import { onMounted, ref } from 'vue'
import FormCta from '@/components/landing/FormCta.vue'
import { useReveal } from '@/composables/useReveal'
import { cld, cldSet } from '@/config/media'
import { gallery } from '@/config/copy/landing'

const root = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const atStart = ref(true)
const atEnd = ref(false)
useReveal(root)

function update() {
  const el = track.value
  if (!el) return
  atStart.value = el.scrollLeft <= 4
  atEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
}

function move(direction: 1 | -1) {
  const el = track.value
  if (!el) return
  const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: smooth ? 'smooth' : 'auto' })
}

onMounted(update)
</script>

<template>
  <section ref="root" class="gallery" aria-labelledby="gallery-title">
    <div class="gallery__inner">
      <header class="gallery__head reveal">
        <div class="gallery__titles">
          <p class="gallery__eyebrow">{{ gallery.eyebrow }}</p>
          <h2 id="gallery-title" class="gallery__title">{{ gallery.title }}</h2>
        </div>
        <div class="gallery__controls">
          <button
            type="button"
            class="gallery__arrow"
            :aria-label="gallery.prev"
            :disabled="atStart"
            @click="move(-1)"
          >
            <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
          </button>
          <button
            type="button"
            class="gallery__arrow"
            :aria-label="gallery.next"
            :disabled="atEnd"
            @click="move(1)"
          >
            <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </button>
        </div>
      </header>
    </div>

    <div
      ref="track"
      class="gallery__track reveal"
      role="region"
      :aria-label="gallery.region"
      tabindex="0"
      @scroll.passive="update"
    >
      <ul class="gallery__list">
        <li
          v-for="item in gallery.items"
          :key="item.id"
          class="gallery__item"
          :style="{ aspectRatio: String(item.ratio) }"
        >
          <img
            :src="cld(item.id, 800)"
            :srcset="cldSet(item.id, [400, 640, 960])"
            sizes="(min-width: 768px) 30rem, 17rem"
            :alt="item.alt"
            loading="lazy"
            decoding="async"
          />
          <span class="gallery__tag" :class="`gallery__tag--${item.kind}`">
            {{ gallery.tags[item.kind] }}
          </span>
        </li>
      </ul>
    </div>

    <div class="gallery__inner gallery__foot">
      <FormCta :label="gallery.cta" variant="light" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.gallery {
  background: $night;
  color: $on-night;
  padding-block: $space-section;

  &__inner {
    @include container(1280px);
  }

  &__head {
    @include flex(row, flex-end, space-between, 1.5rem);
    flex-wrap: wrap;
  }

  &__titles {
    @include flex(column, flex-start, flex-start, 1rem);
    max-width: 40rem;
  }

  &__eyebrow {
    @include eyebrow;
    color: $accent-glow;
  }

  &__title {
    @include display($display-md, 400);
  }

  &__controls {
    @include flex(row, center, flex-start, 0.6rem);
  }

  &__arrow {
    @include flex(row, center, center);
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    border: 1px solid rgba($on-night, 0.3);
    color: $on-night;
    transition:
      border-color 0.25s $ease,
      color 0.25s $ease,
      opacity 0.25s $ease;
    @include focus-ring($accent-glow);

    &:hover:not(:disabled) {
      border-color: $accent-glow;
      color: $accent-glow;
    }

    &:disabled {
      opacity: 0.3;
      cursor: default;
    }
  }

  // Carrusel nativo: scroll-snap, arrastre con el dedo y teclado con el foco en la pista.
  &__track {
    margin-top: 2.5rem;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: 1.25rem;
    padding-inline: 1.25rem;
    padding-bottom: 0.5rem;
    scrollbar-width: none;
    @include focus-ring($accent-glow);

    &::-webkit-scrollbar {
      display: none;
    }

    // Alinea el primer cuadro con el contenedor en pantallas anchas y sangra a la derecha.
    @include from('md') {
      padding-inline: max(2rem, calc((100vw - 1280px) / 2 + 2rem));
      scroll-padding-inline: max(2rem, calc((100vw - 1280px) / 2 + 2rem));
    }
  }

  &__list {
    list-style: none;
    @include flex(row, stretch, flex-start, 0.9rem);
    width: max-content;

    @include from('md') {
      gap: 1.25rem;
    }
  }

  &__item {
    position: relative;
    flex: 0 0 auto;
    height: 17rem;
    scroll-snap-align: start;
    overflow: hidden;
    border-radius: $radius-sm;
    background: $night-soft;

    @include from('md') {
      height: 30rem;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__tag {
    position: absolute;
    left: 0.8rem;
    bottom: 0.8rem;
    padding: 0.3rem 0.7rem;
    border-radius: $radius-pill;
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.06em;
    background: rgba($night, 0.72);
    backdrop-filter: blur(6px);
    color: $on-night;

    &--real {
      background: $accent-glow;
      color: $night;
    }
  }

  &__foot {
    margin-top: 2.5rem;
  }
}
</style>
