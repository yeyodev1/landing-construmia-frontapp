<script setup lang="ts">
import { FORM_ANCHOR } from '@/config/copy/landing'

/**
 * El único CTA de la landing: baja al formulario. Se hace a mano (y no con el hash) porque
 * el router no re-navega a un hash en el que ya está, y así el foco llega al formulario
 * sin abrir el teclado en móvil.
 */
withDefaults(
  defineProps<{
    label: string
    variant?: 'primary' | 'light' | 'dark'
    block?: boolean
  }>(),
  { variant: 'primary', block: false },
)

function goToForm(event: MouseEvent) {
  const target = document.querySelector<HTMLElement>(FORM_ANCHOR)
  if (!target) return
  event.preventDefault()
  const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
  target.focus({ preventScroll: true })
}
</script>

<template>
  <a
    :href="FORM_ANCHOR"
    class="btn btn--lg form-cta"
    :class="[`btn--${variant}`, { 'btn--block': block }]"
    @click="goToForm"
  >
    {{ label }}
    <i class="fa-solid fa-arrow-down form-cta__icon" aria-hidden="true"></i>
  </a>
</template>

<style scoped lang="scss">
.form-cta {
  text-align: center;

  // En móvil el CTA ocupa el ancho: se toca fácil y los textos largos no se parten feo.
  @include until('sm') {
    width: 100%;
    padding-inline: 1.25rem;
    letter-spacing: 0.02em;
  }

  &__icon {
    font-size: 0.8em;
    transition: transform 0.3s $ease;
  }

  &:hover &__icon {
    transform: translateY(2px);
  }
}
</style>
