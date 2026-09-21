<script setup lang="ts">
import { ref } from 'vue'
import FormCta from '@/components/landing/FormCta.vue'
import { useReveal } from '@/composables/useReveal'
import { cld, cldSet } from '@/config/media'
import { finalCta } from '@/config/copy/landing'

const root = ref<HTMLElement | null>(null)
useReveal(root)
</script>

<template>
  <section ref="root" class="final" aria-labelledby="final-title">
    <img
      class="final__image"
      :src="cld(finalCta.image.id, 1600)"
      :srcset="cldSet(finalCta.image.id, [640, 960, 1280, 1600])"
      sizes="100vw"
      :alt="finalCta.image.alt"
      loading="lazy"
      decoding="async"
    />

    <div class="final__inner reveal">
      <p class="final__eyebrow">{{ finalCta.eyebrow }}</p>
      <h2 id="final-title" class="final__title">{{ finalCta.title }}</h2>
      <p class="final__lead">{{ finalCta.lead }}</p>
      <FormCta :label="finalCta.cta" variant="light" />
      <p class="final__note">{{ finalCta.note }}</p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.final {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background: $night;
  color: $on-night;
  padding-block: clamp(6rem, 14vw, 11rem);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background:
      linear-gradient(180deg, rgba($night, 0.5) 0%, rgba($night, 0.82) 70%, $night 100%),
      rgba($night, 0.25);
  }

  &__image {
    position: absolute;
    inset: 0;
    z-index: -2;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 50% 45%;
  }

  &__inner {
    @include container(52rem);
    @include flex(column, center, flex-start, 1.3rem);
    text-align: center;
  }

  &__eyebrow {
    @include eyebrow;
    color: $accent-glow;
  }

  &__title {
    @include display($display-lg, 400);
    letter-spacing: -0.035em;
  }

  &__lead {
    font-size: $text-lg;
    color: rgba($on-night, 0.82);
    max-width: 40rem;
    margin-bottom: 0.8rem;
  }

  &__note {
    font-size: $text-xs;
    letter-spacing: 0.08em;
    color: $on-night-soft;
  }
}
</style>
