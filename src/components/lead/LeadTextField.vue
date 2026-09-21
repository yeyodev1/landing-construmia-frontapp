<script setup lang="ts">
/**
 * Campo de texto del registro: label real, error anunciado y conectado con aria-describedby.
 * Los atributos del input (type, autocomplete, maxlength...) y los @blur/@input pasan directo al input.
 */
defineOptions({ inheritAttrs: false })

defineProps<{
  id: string
  label: string
  error: string
}>()

const value = defineModel<string>({ required: true })
</script>

<template>
  <div class="field" :class="{ 'field--invalid': error }">
    <label :for="id">{{ label }}</label>
    <input
      :id="id"
      v-model="value"
      v-bind="$attrs"
      required
      :aria-invalid="!!error"
      :aria-describedby="`${id}-error`"
    />
    <p :id="`${id}-error`" class="field__error" aria-live="polite">{{ error }}</p>
  </div>
</template>

<style scoped lang="scss">
// 16 px en el control: por debajo de eso iOS hace zoom al enfocar.
input {
  font-size: 1rem;
}

.field__error:empty {
  margin-top: 0;
}
</style>
