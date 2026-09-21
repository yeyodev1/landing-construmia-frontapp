<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { QualificationQuestion } from '@/config/qualification'

const props = defineProps<{
  question: QualificationQuestion
  selected: string | null
  /** Pausa de avance en curso: la opción ya está marcada y no se aceptan más toques. */
  locked: boolean
}>()

const emit = defineEmits<{ select: [value: string]; back: [] }>()

const optionEls = ref<HTMLButtonElement[]>([])
const titleId = `qualify-title-${props.question.key}`
const helpId = `qualify-help-${props.question.key}`

// Tabindex itinerante, como un radiogroup nativo: Tab entra una vez al grupo y las flechas
// recorren las opciones. Arranca en la respuesta ya dada (si se volvió atrás) o en la primera.
const initial = props.question.options.findIndex((option) => option.value === props.selected)
const active = ref(initial === -1 ? 0 : initial)

function focusOption(i: number) {
  const count = props.question.options.length
  active.value = (i + count) % count
  optionEls.value[active.value]?.focus({ preventScroll: true })
}

function focusedIndex(): number {
  return optionEls.value.findIndex((el) => el === document.activeElement)
}

/** Teclado del paso: flechas mueven el foco, 1-9 responden directo, flecha izquierda vuelve. */
function handleKey(event: KeyboardEvent): boolean {
  if (event.altKey || event.ctrlKey || event.metaKey) return false
  const current = focusedIndex()

  switch (event.key) {
    case 'ArrowDown':
      focusOption(current === -1 ? 0 : current + 1)
      return true
    case 'ArrowUp':
      focusOption(current === -1 ? props.question.options.length - 1 : current - 1)
      return true
    case 'Home':
      focusOption(0)
      return true
    case 'End':
      focusOption(props.question.options.length - 1)
      return true
    case 'ArrowLeft':
      emit('back')
      return true
  }

  if (/^[1-9]$/.test(event.key)) {
    const option = props.question.options[Number(event.key) - 1]
    if (!option) return false
    focusOption(Number(event.key) - 1)
    emit('select', option.value)
    return true
  }
  return false
}

defineExpose({ handleKey })

// Con teclado, Enter basta: el foco ya está sobre una respuesta.
onMounted(() => focusOption(active.value))
</script>

<template>
  <div class="step">
    <h2 :id="titleId" class="step__title">{{ question.title }}</h2>
    <p :id="helpId" class="step__help">{{ question.help }}</p>

    <div
      class="step__options"
      role="radiogroup"
      :aria-labelledby="titleId"
      :aria-describedby="helpId"
    >
      <button
        v-for="(option, i) in question.options"
        :key="option.value"
        ref="optionEls"
        type="button"
        role="radio"
        class="option"
        :class="{ 'option--selected': option.value === selected }"
        :aria-checked="option.value === selected"
        :aria-disabled="locked"
        :tabindex="i === active ? 0 : -1"
        @focus="active = i"
        @click="emit('select', option.value)"
      >
        <i v-if="option.icon" class="option__icon" :class="option.icon" aria-hidden="true"></i>
        <span class="option__text">
          <span class="option__label">{{ option.label }}</span>
          <span v-if="option.hint" class="option__hint">{{ option.hint }}</span>
        </span>
        <span class="option__mark" aria-hidden="true">
          <i class="fa-solid fa-check option__check"></i>
          <kbd class="option__key">{{ i + 1 }}</kbd>
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.step {
  @include flex(column, stretch, flex-start, 0);

  &__title {
    @include display($text-xl, 500);
    color: $ink;
  }

  &__help {
    margin-top: 0.45rem;
    font-size: $text-sm;
    line-height: 1.5;
    color: $ink-soft;
  }

  &__options {
    @include flex(column, stretch, flex-start, 0.5rem);
    margin-top: 1.25rem;
  }
}

.option {
  @include flex(row, center, flex-start, 0.9rem);
  width: 100%;
  min-height: 3.5rem;
  padding: 0.7rem 0.9rem 0.7rem 1rem;
  text-align: left;
  background: $surface;
  border: 1px solid $line;
  border-radius: $radius-sm;
  // Sin retardo en móvil ni zoom por doble toque: el toque tiene que sentirse inmediato.
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition:
    border-color 0.18s ease,
    background-color 0.18s ease,
    transform 0.12s ease;

  @media (hover: hover) {
    &:hover {
      border-color: $accent;
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
  }

  &__icon {
    flex: none;
    width: 1.5rem;
    text-align: center;
    font-size: 1rem;
    color: $accent-deep;
  }

  &__text {
    @include flex(column, flex-start, center, 0.1rem);
    flex: 1;
    min-width: 0;
  }

  &__label {
    font-size: 0.95rem;
    font-weight: 600;
    line-height: 1.3;
    color: $ink;
  }

  &__hint {
    font-size: 0.78rem;
    line-height: 1.35;
    color: $ink-muted;
  }

  &__mark {
    position: relative;
    flex: none;
    @include flex(row, center, center);
    width: 1.5rem;
    height: 1.5rem;
  }

  &__check {
    position: absolute;
    font-size: 0.8rem;
    color: $accent-deep;
    opacity: 0;
    transform: scale(0.5);
    transition:
      opacity 0.15s ease,
      transform 0.2s $ease;
  }

  &--selected &__check {
    opacity: 1;
    transform: scale(1);
  }

  // La tecla solo se sugiere donde hay teclado de verdad.
  &__key {
    display: none;
    font-family: $font-principal;
    font-size: 0.68rem;
    font-weight: 600;
    color: $ink-muted;
    border: 1px solid $line;
    border-radius: 5px;
    width: 1.4rem;
    height: 1.4rem;
    line-height: 1.3rem;
    text-align: center;
    transition: opacity 0.15s ease;

    @media (hover: hover) and (pointer: fine) {
      display: block;
    }
  }

  &--selected &__key {
    opacity: 0;
  }
}
</style>
