<script setup lang="ts">
import { nextTick } from 'vue'
import { payCopy as copy } from '@/config/copy/checkout'

type PayMethod = 'card' | 'transfer'

const active = defineModel<PayMethod>({ required: true })

const methods: { id: PayMethod; label: string; icon: string }[] = [
  { id: 'card', label: copy.tabs.card, icon: 'fa-regular fa-credit-card' },
  { id: 'transfer', label: copy.tabs.transfer, icon: 'fa-solid fa-building-columns' },
]

async function activate(method: PayMethod, focus = false) {
  active.value = method
  if (!focus) return
  await nextTick()
  document.getElementById(`pay-tab-${method}`)?.focus()
}

// Patrón de pestañas de la WAI-ARIA: flechas, Inicio y Fin mueven y activan.
function onKeydown(event: KeyboardEvent) {
  const index = methods.findIndex((method) => method.id === active.value)
  const last = methods.length - 1
  const next: Record<string, number> = {
    ArrowRight: index === last ? 0 : index + 1,
    ArrowLeft: index === 0 ? last : index - 1,
    Home: 0,
    End: last,
  }
  const target = methods[next[event.key] ?? -1]
  if (!target) return
  event.preventDefault()
  activate(target.id, true)
}

// La vista lo usa cuando la Cajita no está disponible y manda a transferencia.
defineExpose({ activate })
</script>

<template>
  <div
    class="tabs"
    :class="`tabs--${active}`"
    role="tablist"
    :aria-label="copy.methodsLabel"
    @keydown="onKeydown"
  >
    <button
      v-for="method in methods"
      :id="`pay-tab-${method.id}`"
      :key="method.id"
      type="button"
      role="tab"
      class="tabs__tab"
      :aria-selected="active === method.id"
      :aria-controls="`pay-panel-${method.id}`"
      :tabindex="active === method.id ? 0 : -1"
      @click="activate(method.id)"
    >
      <i :class="method.icon" aria-hidden="true"></i>
      {{ method.label }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.tabs {
  position: relative;
  display: flex;
  padding: 0.25rem;
  border-radius: $radius-pill;
  background: $sand;

  // Indicador deslizante: son dos pestañas del mismo ancho, basta con trasladarlo.
  &::before {
    content: '';
    position: absolute;
    top: 0.25rem;
    bottom: 0.25rem;
    left: 0.25rem;
    width: calc(50% - 0.25rem);
    border-radius: $radius-pill;
    background: $surface;
    box-shadow: $shadow-sm;
    transition: transform 0.3s $ease;
  }

  &--transfer::before {
    transform: translateX(100%);
  }

  &__tab {
    @include flex(row, center, center, 0.5rem);
    position: relative;
    flex: 1 1 50%;
    min-height: 2.75rem;
    border-radius: $radius-pill;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-muted;
    transition: color 0.25s $ease;

    &[aria-selected='true'] {
      color: $ink;
    }
  }
}
</style>
