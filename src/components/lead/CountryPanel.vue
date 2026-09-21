<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { flagUrl, type Country } from '@/config/countries'
import { form as copy } from '@/config/copy/landing'

defineProps<{
  items: Country[]
  currentCode: string
  listId: string
  activeId?: string
  optionId: (code: string) => string
}>()

const emit = defineEmits<{ choose: [item: Country]; keydown: [event: KeyboardEvent] }>()

const query = defineModel<string>('query', { required: true })
const activeIndex = defineModel<number>('activeIndex', { required: true })

const search = ref<HTMLInputElement | null>(null)

// El panel existe solo mientras está abierto: al montarse, el foco va al buscador.
onMounted(() => search.value?.focus({ preventScroll: true }))
</script>

<template>
  <div class="panel">
    <div class="panel__search">
      <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
      <input
        ref="search"
        v-model="query"
        type="text"
        role="combobox"
        inputmode="search"
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
        aria-expanded="true"
        aria-autocomplete="list"
        :aria-controls="listId"
        :aria-activedescendant="activeId"
        :aria-label="copy.country.search"
        :placeholder="copy.country.searchPlaceholder"
        @keydown="emit('keydown', $event)"
      />
    </div>

    <ul :id="listId" class="panel__list" role="listbox" :aria-label="copy.country.button">
      <li
        v-for="(item, index) in items"
        :id="optionId(item.code)"
        :key="item.code"
        class="panel__option"
        :class="{ 'panel__option--active': index === activeIndex }"
        role="option"
        :aria-selected="item.code === currentCode"
        @click="emit('choose', item)"
        @mousemove="activeIndex = index"
      >
        <img
          class="panel__flag"
          :src="flagUrl(item.code)"
          alt=""
          width="22"
          height="16"
          loading="lazy"
        />
        <span class="panel__name">{{ item.name }}</span>
        <span class="panel__code">{{ item.dial }}</span>
        <i
          v-if="item.code === currentCode"
          class="fa-solid fa-check panel__check"
          aria-hidden="true"
        ></i>
      </li>
      <li v-if="!items.length" class="panel__empty" role="presentation">
        {{ copy.country.empty }}
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.panel {
  position: absolute;
  top: calc(100% + 6px);
  left: -1px;
  z-index: 30;
  width: min(19rem, calc(100% + 2px));
  background: $surface;
  border: 1px solid $line;
  border-radius: $radius-sm;
  box-shadow: $shadow-md;
  overflow: hidden;
  transform-origin: top left;

  &__search {
    @include flex(row, center, flex-start, 0.6rem);
    padding: 0 0.9rem;
    border-bottom: 1px solid $line;
    color: $ink-muted;
    font-size: 0.8rem;

    input {
      border: none;
      border-radius: 0;
      padding: 0.75rem 0;
      background: transparent;
      // 16 px evita el zoom automático de iOS al enfocar.
      font-size: 1rem;

      &:focus {
        box-shadow: none;
      }
    }
  }

  &__list {
    list-style: none;
    max-height: 13.5rem;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 0.3rem;
  }

  &__option {
    @include flex(row, center, flex-start, 0.65rem);
    padding: 0.6rem;
    border-radius: 7px;
    font-size: 0.88rem;
    cursor: pointer;

    &--active {
      background: $sand;
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

  &__name {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__code {
    color: $ink-muted;
    font-variant-numeric: tabular-nums;
  }

  &__check {
    font-size: 0.7rem;
    color: $accent;
  }

  &__empty {
    padding: 0.9rem 0.6rem;
    font-size: 0.85rem;
    color: $ink-muted;
  }
}
</style>
