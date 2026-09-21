<script setup lang="ts">
defineProps<{
  id: string
  text: string
  error: string
}>()

const emit = defineEmits<{ change: [] }>()

const checked = defineModel<boolean>({ required: true })
</script>

<template>
  <div class="commit" :class="{ 'commit--invalid': error, 'commit--checked': checked }">
    <label class="commit__label" :for="id">
      <input
        :id="id"
        v-model="checked"
        class="commit__input"
        type="checkbox"
        required
        :aria-invalid="!!error"
        :aria-describedby="`${id}-error`"
        @change="emit('change')"
      />
      <span class="commit__box" aria-hidden="true">
        <i class="fa-solid fa-check"></i>
      </span>
      <span class="commit__text">{{ text }}</span>
    </label>
    <p :id="`${id}-error`" class="field__error commit__error" aria-live="polite">{{ error }}</p>
  </div>
</template>

<style scoped lang="scss">
// El compromiso es el filtro del embudo: se lee como una declaración, no como letra chica.
.commit {
  &__label {
    @include flex(row, flex-start, flex-start, 0.8rem);
    margin: 0;
    padding: 0.9rem 1rem;
    border: 1px solid $line;
    border-left: 2px solid $accent;
    border-radius: 0 $radius-sm $radius-sm 0;
    background: $paper;
    cursor: pointer;
    transition:
      border-color 0.25s ease,
      background-color 0.25s ease;
  }

  &--checked &__label {
    background: $accent-soft;
    border-color: rgba($accent, 0.35);
    border-left-color: $accent;
  }

  &--invalid &__label {
    border-color: $danger;
  }

  // El input real sigue ahí para teclado y lectores de pantalla; solo se oculta a la vista.
  &__input {
    position: absolute;
    width: 1.35rem;
    height: 1.35rem;
    margin: 0;
    padding: 0;
    opacity: 0;
  }

  &__box {
    @include flex(row, center, center);
    flex: none;
    width: 1.35rem;
    height: 1.35rem;
    margin-top: 0.1rem;
    border: 1.5px solid $ink-muted;
    border-radius: 5px;
    background: $surface;
    color: $surface;
    font-size: 0.7rem;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease;

    i {
      transform: scale(0.4);
      opacity: 0;
      transition:
        transform 0.22s $ease,
        opacity 0.15s ease;
    }
  }

  &__input:checked + &__box {
    background: $accent;
    border-color: $accent;

    i {
      transform: scale(1);
      opacity: 1;
    }
  }

  &__input:focus-visible + &__box {
    outline: 2px solid $accent;
    outline-offset: 2px;
  }

  &__text {
    font-size: 0.8rem;
    font-weight: 500;
    line-height: 1.5;
    color: $ink;
  }

  &__error:empty {
    margin-top: 0;
  }
}
</style>
