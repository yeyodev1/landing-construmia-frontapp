<script setup lang="ts">
import type { Option } from '@/config/qualification'
import { leadModal as copy } from '@/config/copy/landing'

/** Lo que eligió en el paso 1, a la vista mientras llena sus datos, con salida para cambiarlo. */
defineProps<{ option: Option }>()
const emit = defineEmits<{ change: [] }>()
</script>

<template>
  <div class="chosen">
    <span class="chosen__icon" aria-hidden="true"><i :class="option.icon"></i></span>
    <p class="chosen__text">
      <span>{{ copy.details.chosen }}</span>
      <strong>{{ option.label }}</strong>
    </p>
    <button type="button" class="chosen__change" @click="emit('change')">
      {{ copy.details.change }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.chosen {
  @include flex(row, center, flex-start, 0.75rem);
  margin: 1rem 0 1.15rem;
  padding: 0.55rem 0.4rem 0.55rem 0.55rem;
  background: $sand;
  border-radius: 12px;

  &__icon {
    flex: none;
    @include flex(row, center, center);
    width: 2.3rem;
    height: 2.3rem;
    border-radius: 9px;
    background: $accent;
    color: $surface;
    font-size: 0.9rem;
  }

  &__text {
    @include flex(column, flex-start, center, 0);
    flex: 1;
    min-width: 0;
    font-size: 0.92rem;
    line-height: 1.3;
    color: $ink;

    span {
      font-size: 0.66rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: $ink-soft;
    }
  }

  &__change {
    flex: none;
    min-height: 44px;
    padding: 0 0.75rem;
    font-size: $text-sm;
    font-weight: 600;
    color: $accent-deep;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}
</style>
