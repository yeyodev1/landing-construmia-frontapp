<script setup lang="ts">
import { useTemplateRef } from 'vue'
import CountryPanel from '@/components/lead/CountryPanel.vue'
import { useCountryPicker } from '@/composables/useCountryPicker'
import { flagUrl, type Country } from '@/config/countries'
import { form as copy } from '@/config/copy/landing'

const props = defineProps<{
  id: string
  label: string
  placeholder: string
  error: string
}>()

const emit = defineEmits<{ blur: []; input: []; countryChange: [] }>()

const number = defineModel<string>({ required: true })
const country = defineModel<string>('country', { required: true })

const picker = useCountryPicker(country, props.id, {
  root: useTemplateRef<HTMLElement>('root'),
  trigger: useTemplateRef<HTMLElement>('trigger'),
})
const { open, query, activeIndex, current, filtered, listId, activeId } = picker

function choose(item: Country) {
  picker.choose(item)
  emit('countryChange')
}

function onSearchKeydown(event: KeyboardEvent) {
  const before = country.value
  picker.onSearchKeydown(event)
  if (country.value !== before) emit('countryChange')
}

/** Solo dígitos y espacios: letras y símbolos ni siquiera llegan a escribirse. */
function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  const clean = target.value.replace(/[^\d\s]/g, '')
  if (clean !== target.value) target.value = clean
  number.value = clean
  emit('input')
}
</script>

<template>
  <div class="field phone" :class="{ 'field--invalid': error }">
    <label :for="id">{{ label }}</label>

    <div ref="root" class="phone__control" :class="{ 'phone__control--invalid': error }">
      <button
        ref="trigger"
        type="button"
        class="phone__country"
        aria-haspopup="listbox"
        :aria-expanded="open"
        :aria-controls="open ? listId : undefined"
        :aria-label="`${copy.country.button}: ${current.name} ${current.dial}`"
        @click="picker.toggle"
        @keydown="picker.onTriggerKeydown"
      >
        <img class="phone__flag" :src="flagUrl(current.code)" alt="" width="22" height="16" />
        <span>{{ current.dial }}</span>
        <i class="fa-solid fa-chevron-down phone__caret" aria-hidden="true"></i>
      </button>

      <input
        :id="id"
        class="phone__input"
        :value="number"
        type="tel"
        inputmode="tel"
        autocomplete="tel-national"
        :placeholder="placeholder"
        :maxlength="current.max + 5"
        :aria-invalid="!!error"
        :aria-describedby="`${id}-error`"
        required
        @input="onInput"
        @blur="emit('blur')"
      />

      <Transition name="phone-panel">
        <CountryPanel
          v-if="open"
          v-model:query="query"
          v-model:active-index="activeIndex"
          :items="filtered"
          :current-code="current.code"
          :list-id="listId"
          :active-id="activeId"
          :option-id="picker.optionId"
          @choose="choose"
          @keydown="onSearchKeydown"
        />
      </Transition>
    </div>

    <p :id="`${id}-error`" class="field__error" aria-live="polite">{{ error }}</p>
  </div>
</template>

<style scoped lang="scss">
.phone {
  &__control {
    position: relative;
    display: flex;
    align-items: stretch;
    background: $surface;
    border: 1px solid $line;
    border-radius: $radius-sm;
    transition:
      border-color 0.25s ease,
      box-shadow 0.25s ease;

    &:focus-within {
      border-color: $accent;
      box-shadow: 0 0 0 3px rgba($accent, 0.15);
    }

    &--invalid {
      border-color: $danger;
    }
  }

  &__country {
    @include flex(row, center, flex-start, 0.4rem);
    flex: none;
    padding: 0 0.7rem 0 0.8rem;
    border-right: 1px solid $line;
    border-radius: $radius-sm 0 0 $radius-sm;
    font-size: 0.9rem;
    font-weight: 500;
    color: $ink;
    transition: background-color 0.2s ease;

    &:hover {
      background: $paper;
    }

    &:focus-visible {
      outline-offset: -2px;
    }
  }

  &__flag {
    width: 22px;
    height: 16px;
    border-radius: 3px;
    object-fit: cover;
    box-shadow: 0 0 0 1px rgba($ink, 0.08);
    flex: none;
  }

  &__caret {
    font-size: 0.6rem;
    color: $ink-muted;
    transition: transform 0.2s $ease;

    [aria-expanded='true'] > & {
      transform: rotate(180deg);
    }
  }

  &__input {
    flex: 1;
    min-width: 0;
    border: none;
    background: transparent;
    border-radius: 0 $radius-sm $radius-sm 0;
    // 16 px evita el zoom automático de iOS al enfocar.
    font-size: 1rem;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.02em;

    &:focus {
      box-shadow: none;
    }
  }
}

.field__error:empty {
  margin-top: 0;
}

.phone-panel-enter-active {
  transition:
    opacity 0.16s ease-out,
    transform 0.16s $ease;
}

.phone-panel-leave-active {
  transition: opacity 0.1s ease-in;
}

.phone-panel-enter-from {
  opacity: 0;
  transform: scale(0.97) translateY(-4px);
}

.phone-panel-leave-to {
  opacity: 0;
}
</style>
