<script setup lang="ts">
import { ref, watch } from 'vue'
import { RECEIPT_ACCEPT, formatFileSize } from '@/composables/useTransfer'
import { transferCopy } from '@/config/copy/checkout'

const props = defineProps<{
  file: File | null
  previewUrl: string
  isPdf: boolean
  error: string
  disabled?: boolean
}>()

const emit = defineEmits<{ select: [file: File]; clear: [] }>()

const copy = transferCopy.upload
const dragging = ref(false)
// Fotos que el navegador no sabe pintar (HEIC): se muestra el nombre en vez de una imagen rota.
const previewBroken = ref(false)
// dragenter/dragleave se disparan por cada hijo: se cuenta la profundidad para no parpadear.
let dragDepth = 0

watch(
  () => props.previewUrl,
  () => (previewBroken.value = false),
)

function onChange(event: Event) {
  const target = event.target as HTMLInputElement
  const picked = target.files?.[0]
  if (picked) emit('select', picked)
  // Permite volver a elegir el mismo archivo después de quitarlo.
  target.value = ''
}

function onDragEnter() {
  if (props.disabled) return
  dragDepth++
  dragging.value = true
}

function onDragLeave() {
  dragDepth = Math.max(0, dragDepth - 1)
  if (dragDepth === 0) dragging.value = false
}

function onDrop(event: DragEvent) {
  dragDepth = 0
  dragging.value = false
  if (props.disabled) return
  const dropped = event.dataTransfer?.files?.[0]
  if (dropped) emit('select', dropped)
}
</script>

<template>
  <div
    class="upload"
    :class="{ 'upload--dragging': dragging, 'upload--invalid': !!error, 'upload--filled': !!file }"
    @dragenter.prevent="onDragEnter"
    @dragover.prevent
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
  >
    <input
      id="receipt-file"
      class="visually-hidden upload__input"
      type="file"
      :accept="RECEIPT_ACCEPT"
      :disabled="disabled"
      :aria-invalid="!!error"
      aria-describedby="receipt-hint receipt-error"
      @change="onChange"
    />

    <label v-if="!file" for="receipt-file" class="upload__zone">
      <span class="upload__icon" aria-hidden="true">
        <i :class="dragging ? 'fa-solid fa-arrow-down' : 'fa-solid fa-arrow-up-from-bracket'"></i>
      </span>
      <span class="upload__title">
        <template v-if="dragging">{{ copy.drop }}</template>
        <template v-else>
          <span class="upload__only-touch">{{ copy.idleMobile }}</span>
          <span class="upload__only-pointer">{{ copy.idle }}</span>
        </template>
      </span>
      <span v-if="!dragging" class="upload__browse upload__only-pointer">{{ copy.browse }}</span>
      <span id="receipt-hint" class="upload__hint">{{ copy.hint }}</span>
    </label>

    <div v-else class="upload__file">
      <span class="upload__thumb">
        <img
          v-if="previewUrl && !previewBroken"
          :src="previewUrl"
          :alt="copy.previewAlt"
          @error="previewBroken = true"
        />
        <i v-else :class="isPdf ? 'fa-solid fa-file-pdf' : 'fa-solid fa-file-image'" aria-hidden="true"></i>
      </span>
      <span class="upload__meta">
        <span class="upload__name">{{ file.name }}</span>
        <span class="upload__size">{{ isPdf ? `${copy.pdf} · ` : '' }}{{ formatFileSize(file.size) }}</span>
      </span>
      <span class="upload__actions">
        <label for="receipt-file" class="upload__action">{{ copy.change }}</label>
        <button type="button" class="upload__action" :disabled="disabled" @click="emit('clear')">
          {{ copy.remove }}
        </button>
      </span>
    </div>

    <p id="receipt-error" class="upload__error" role="alert">{{ error }}</p>
  </div>
</template>

<style scoped lang="scss">
.upload {
  @include flex(column, stretch, flex-start, 0.4rem);

  &__zone {
    @include flex(column, center, center, 0.3rem);
    min-height: 10.5rem;
    margin: 0;
    padding: 1.5rem 1rem;
    text-align: center;
    cursor: pointer;
    background: $surface;
    border: 1.5px dashed darken($line, 12);
    border-radius: 14px;
    transition:
      border-color 0.25s $ease,
      background-color 0.25s $ease;

    @media (hover: hover) {
      &:hover {
        border-color: $accent;
      }
    }
  }

  // El input está oculto: el foco de teclado se pinta sobre la zona.
  &__input:focus-visible + &__zone,
  &__input:focus-visible + &__file {
    outline: 2px solid $accent;
    outline-offset: 3px;
  }

  &--dragging &__zone {
    border-color: $accent;
    border-style: solid;
    background: $accent-soft;
  }

  &--invalid &__zone {
    border-color: $danger;
  }

  &__icon {
    @include flex(row, center, center);
    width: 2.6rem;
    height: 2.6rem;
    margin-bottom: 0.4rem;
    border-radius: 50%;
    background: $sand;
    color: $accent-deep;
  }

  &__title {
    font-size: $text-base;
    font-weight: 600;
    color: $ink;
  }

  &__browse {
    font-size: $text-sm;
    color: $accent-deep;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  &__hint {
    font-size: $text-xs;
    font-weight: 400;
    color: $ink-muted;
  }

  // Arrastrar solo existe con puntero fino; en táctil se invita a tocar.
  &__only-pointer {
    display: none;
  }

  @media (hover: hover) and (pointer: fine) {
    &__only-pointer {
      display: inline;
    }

    &__only-touch {
      display: none;
    }
  }

  &__file {
    @include card;
    @include flex(row, center, flex-start, 0.85rem);
    flex-wrap: wrap;
    padding: 0.75rem;
  }

  &--dragging &__file {
    border-color: $accent;
    background: $accent-soft;
  }

  &__thumb {
    @include flex(row, center, center);
    flex: 0 0 4.5rem;
    width: 4.5rem;
    height: 4.5rem;
    overflow: hidden;
    border-radius: $radius-sm;
    background: $sand;
    color: $accent-deep;
    font-size: 1.5rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__meta {
    @include flex(column, flex-start, center, 0.1rem);
    flex: 1 1 8rem;
    min-width: 0;
  }

  &__name {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink;
  }

  &__size {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__actions {
    @include flex(row, center, flex-end, 0.25rem);
  }

  &__action {
    margin: 0;
    padding: 0.55rem 0.7rem;
    border-radius: $radius-pill;
    font-size: $text-xs;
    font-weight: 600;
    color: $ink-soft;
    cursor: pointer;
    transition:
      color 0.2s $ease,
      background-color 0.2s $ease;

    @media (hover: hover) {
      &:hover {
        color: $ink;
        background: $sand;
      }
    }
  }

  &__error {
    min-height: 1.1rem;
    font-size: 0.76rem;
    color: $danger;
  }
}
</style>
