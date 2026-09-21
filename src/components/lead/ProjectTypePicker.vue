<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Option } from '@/config/qualification'

/**
 * Paso 1 del registro: un toque y listo. Se porta como un radiogroup nativo (Tab entra una vez,
 * las flechas recorren) y el foco arranca en la opción ya elegida o en la primera.
 */
const props = defineProps<{
  options: Option[]
  selected: string
  labelledby: string
  describedby?: string
}>()

const emit = defineEmits<{ select: [value: string] }>()

const optionEls = ref<HTMLButtonElement[]>([])
const initial = props.options.findIndex((option) => option.value === props.selected)
const active = ref(initial === -1 ? 0 : initial)

function focusOption(i: number) {
  const count = props.options.length
  active.value = (i + count) % count
  optionEls.value[active.value]?.focus({ preventScroll: true })
}

function onKeydown(event: KeyboardEvent) {
  const moves: Record<string, number> = {
    ArrowDown: active.value + 1,
    ArrowRight: active.value + 1,
    ArrowUp: active.value - 1,
    ArrowLeft: active.value - 1,
    Home: 0,
    End: props.options.length - 1,
  }
  const next = moves[event.key]
  if (next === undefined) return
  event.preventDefault()
  focusOption(next)
}

onMounted(() => focusOption(active.value))
</script>

<template>
  <div
    class="picker"
    role="radiogroup"
    :aria-labelledby="labelledby"
    :aria-describedby="describedby"
    @keydown="onKeydown"
  >
    <button
      v-for="(option, i) in options"
      :key="option.value"
      ref="optionEls"
      type="button"
      role="radio"
      class="picker__option"
      :class="{ 'picker__option--selected': option.value === selected }"
      :aria-checked="option.value === selected"
      :tabindex="i === active ? 0 : -1"
      :style="{ '--i': i }"
      @focus="active = i"
      @click="emit('select', option.value)"
    >
      <span class="picker__icon" aria-hidden="true">
        <i :class="option.icon ?? 'fa-solid fa-house'"></i>
      </span>
      <span class="picker__text">
        <span class="picker__label">{{ option.label }}</span>
        <span v-if="option.hint" class="picker__hint">{{ option.hint }}</span>
      </span>
      <span class="picker__mark" aria-hidden="true">
        <i class="fa-solid fa-check"></i>
      </span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.picker {
  @include flex(column, stretch, flex-start, 0.55rem);

  &__option {
    @include flex(row, center, flex-start, 0.95rem);
    width: 100%;
    min-height: 4.25rem;
    padding: 0.7rem 0.95rem 0.7rem 0.7rem;
    text-align: left;
    background: $surface;
    border: 1px solid $line;
    border-radius: 14px;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    animation: picker-in 0.4s $ease both;
    animation-delay: calc(var(--i) * 40ms + 60ms);
    transition:
      border-color 0.2s ease,
      background-color 0.2s ease,
      box-shadow 0.25s ease,
      transform 0.15s ease;

    @media (hover: hover) {
      &:hover {
        border-color: rgba($accent, 0.6);
        box-shadow: $shadow-sm;
      }
    }

    &:active {
      transform: scale(0.985);
    }

    &:focus-visible {
      outline: 2px solid $accent;
      outline-offset: 2px;
    }

    &--selected {
      border-color: $accent;
      background: $accent-soft;
      box-shadow: 0 0 0 1px $accent;
    }
  }

  &__icon {
    flex: none;
    @include flex(row, center, center);
    width: 2.9rem;
    height: 2.9rem;
    border-radius: 11px;
    background: $sand;
    color: $accent-deep;
    font-size: 1.05rem;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;

    .picker__option--selected & {
      background: $accent;
      color: $surface;
    }
  }

  &__text {
    @include flex(column, flex-start, center, 0.12rem);
    flex: 1;
    min-width: 0;
  }

  &__label {
    font-size: 0.97rem;
    font-weight: 600;
    line-height: 1.3;
    color: $ink;
  }

  &__hint {
    font-size: 0.8rem;
    line-height: 1.35;
    color: $ink-soft;
  }

  &__mark {
    flex: none;
    @include flex(row, center, center);
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    border: 1px solid $line;
    font-size: 0.65rem;
    color: transparent;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease,
      color 0.2s ease;

    .picker__option--selected & {
      background: $accent;
      border-color: $accent;
      color: $surface;
    }
  }
}

@keyframes picker-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
