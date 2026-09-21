<script setup lang="ts">
import { useLeadModal } from '@/composables/useLeadModal'

/**
 * El CTA de la landing: abre el registro en modal, paso 1 (tipo de proyecto).
 * Quien ya se registró sigue directo en su paso del embudo.
 */
withDefaults(
  defineProps<{
    label: string
    variant?: 'primary' | 'light' | 'dark'
    block?: boolean
  }>(),
  { variant: 'primary', block: false },
)

const { open } = useLeadModal()
</script>

<template>
  <button
    type="button"
    class="btn btn--lg form-cta"
    :class="[`btn--${variant}`, { 'btn--block': block }]"
    aria-haspopup="dialog"
    @click="open('cta')"
  >
    {{ label }}
    <i class="fa-solid fa-arrow-right form-cta__icon" aria-hidden="true"></i>
  </button>
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
    transform: translateX(3px);
  }
}
</style>
