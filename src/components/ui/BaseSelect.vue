<script setup lang="ts">
import { toRef, useTemplateRef } from 'vue'
import type { Option } from '@/config/qualification'
import { useListbox } from '@/composables/useListbox'

/**
 * Select con lista propia: el nativo abre la lista del sistema operativo, que no
 * acepta estilos. Mismo contrato que un campo de formulario: v-model, label, error y blur.
 */
const props = defineProps<{
  id: string
  label: string
  placeholder: string
  options: readonly Option[]
  error?: string
}>()

const emit = defineEmits<{ blur: [] }>()
const value = defineModel<string>({ required: true })

const { open, activeIndex, selected, show, hide, choose, onKeydown } = useListbox(
  toRef(props, 'options'),
  value,
  () => emit('blur'),
  useTemplateRef<HTMLElement>('root'),
  useTemplateRef<HTMLElement>('list'),
)

const listId = `${props.id}-list`
const optionId = (index: number) => `${props.id}-opt-${index}`

function toggle() {
  if (open.value) hide()
  else show()
}
</script>

<template>
  <div ref="root" class="field bselect" :class="{ 'field--invalid': error, 'is-open': open }">
    <label :id="`${id}-label`" :for="id">{{ label }}</label>
    <div class="bselect__box">
      <button
        :id="id"
        type="button"
        class="bselect__control"
        role="combobox"
        aria-haspopup="listbox"
        :aria-expanded="open"
        :aria-controls="listId"
        :aria-labelledby="`${id}-label ${id}`"
        :aria-activedescendant="open && activeIndex >= 0 ? optionId(activeIndex) : undefined"
        :aria-invalid="!!error"
        :aria-describedby="`${id}-error`"
        @click="toggle"
        @keydown="onKeydown"
      >
        <span class="bselect__value" :class="{ 'is-empty': !selected }">
          <i v-if="selected?.icon" :class="selected.icon" aria-hidden="true"></i>
          {{ selected?.label ?? placeholder }}
        </span>
        <i class="fa-solid fa-chevron-down bselect__chevron" aria-hidden="true"></i>
      </button>

      <Transition name="bselect">
        <ul
          v-show="open"
          :id="listId"
          ref="list"
          class="bselect__list"
          role="listbox"
          :aria-labelledby="`${id}-label`"
          tabindex="-1"
        >
          <li
            v-for="(option, index) in options"
            :id="optionId(index)"
            :key="option.value"
            class="bselect__option"
            role="option"
            :aria-selected="option.value === value"
            :class="{ 'is-active': index === activeIndex, 'is-selected': option.value === value }"
            @pointerenter="activeIndex = index"
            @mousedown.prevent
            @click="choose(index)"
          >
            <i v-if="option.icon" :class="option.icon" class="bselect__icon" aria-hidden="true"></i>
            <span class="bselect__text">
              {{ option.label }}
              <small v-if="option.hint">{{ option.hint }}</small>
            </span>
            <i class="fa-solid fa-check bselect__check" aria-hidden="true"></i>
          </li>
        </ul>
      </Transition>
    </div>

    <p :id="`${id}-error`" class="field__error" aria-live="polite">{{ error }}</p>
  </div>
</template>

<style scoped lang="scss">
.bselect {
  &__box {
    position: relative;
  }

  &__control {
    @include flex(row, center, space-between, 0.6rem);
    width: 100%;
    min-height: 3.1rem;
    padding: 0.7rem 0.95rem;
    // 16 px: por debajo iOS hace zoom al enfocar.
    font-size: 1rem;
    text-align: left;
    background: $surface;
    border: 1px solid $line;
    border-radius: $radius-sm;
    color: $ink;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;

    &:hover {
      border-color: rgba($accent, 0.45);
    }

    &:focus-visible,
    .is-open & {
      outline: none;
      border-color: $accent;
      box-shadow: 0 0 0 3px rgba($accent, 0.15);
    }
  }

  &.field--invalid &__control {
    border-color: $danger;
  }

  &__value {
    @include flex(row, center, flex-start, 0.55rem);
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &.is-empty {
      color: $ink-muted;
    }

    i {
      color: $accent;
    }
  }

  &__chevron {
    font-size: 0.75rem;
    color: $ink-muted;
    transition: transform 0.25s $ease;

    .is-open & {
      transform: rotate(180deg);
      color: $accent;
    }
  }

  &__list {
    position: absolute;
    z-index: 20;
    top: calc(100% + 6px);
    left: 0;
    right: 0;
    max-height: 17rem;
    overflow-y: auto;
    overscroll-behavior: contain;
    list-style: none;
    padding: 0.35rem;
    background: $surface;
    border: 1px solid $line;
    border-radius: $radius-md;
    box-shadow: $shadow-lg;
  }

  &__option {
    @include flex(row, center, flex-start, 0.75rem);
    padding: 0.75rem 0.8rem;
    border-radius: $radius-sm;
    font-size: 0.95rem;
    line-height: 1.35;
    color: $ink;
    cursor: pointer;
    transition: background-color 0.15s ease;

    &.is-active {
      background: $sand;
    }

    &.is-selected {
      font-weight: 600;
      color: $accent-deep;
    }
  }

  // Insignia con fondo: el ícono se lee como parte de la opción, no como adorno suelto.
  &__icon {
    @include flex(row, center, center, 0);
    flex: none;
    width: 2rem;
    height: 2rem;
    border-radius: $radius-sm;
    background: rgba($accent, 0.1);
    color: $accent;
    font-size: 0.85rem;
    transition:
      background-color 0.15s ease,
      color 0.15s ease;

    .is-selected & {
      background: $accent;
      color: $surface;
    }
  }

  &__text {
    @include flex(column, flex-start, flex-start, 0.1rem);
    flex: 1;
    min-width: 0;

    small {
      font-size: 0.78rem;
      font-weight: 400;
      color: $ink-muted;
    }
  }

  &__check {
    font-size: 0.75rem;
    color: $accent;
    opacity: 0;

    .is-selected & {
      opacity: 1;
    }
  }
}

.bselect-enter-active,
.bselect-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.22s $ease;
  transform-origin: top center;
}

.bselect-enter-from,
.bselect-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
</style>
