<script setup lang="ts">
import FormCta from '@/components/landing/FormCta.vue'
import { useStickyCta } from '@/composables/useStickyCta'
import { FORM_ANCHOR, stickyCta } from '@/config/copy/landing'

// Solo en móvil: en desktop el header ya lleva el CTA a la vista todo el tiempo.
const { visible } = useStickyCta(FORM_ANCHOR)
</script>

<template>
  <Transition name="sticky">
    <div v-show="visible" class="sticky-cta">
      <p class="sticky-cta__text">{{ stickyCta.text }}</p>
      <FormCta :label="stickyCta.cta" class="sticky-cta__button" />
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.sticky-cta {
  position: fixed;
  inset: auto 0 0;
  z-index: 90;
  @include flex(row, center, space-between, 0.75rem);
  padding: 0.7rem 1rem calc(0.7rem + env(safe-area-inset-bottom));
  background: rgba($night, 0.94);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-top: 1px solid $night-line;
  color: $on-night;

  @include from('md') {
    display: none !important;
  }

  &__text {
    font-size: $text-xs;
    line-height: 1.35;
    color: $on-night-soft;
    min-width: 0;
  }

  // Más específico que el CTA de ancho completo de móvil: acá comparte fila con el texto.
  & &__button {
    flex: 0 0 auto;
    width: auto;
    padding: 0.8rem 1.2rem;
    font-size: 0.82rem;
  }
}

.sticky-enter-active,
.sticky-leave-active {
  transition:
    transform 0.35s $ease,
    opacity 0.35s $ease;
}

.sticky-enter-from,
.sticky-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
