<script setup lang="ts">
import BaseSelect from '@/components/ui/BaseSelect.vue'
import type { Option } from '@/config/qualification'

/**
 * Select del registro. Usa la lista propia de BaseSelect: el <select> nativo abre la
 * lista del sistema operativo, que no se puede estilar y rompe la estética del modal.
 * `name` se conserva en un input oculto para que el navegador lo trate como parte del formulario.
 */
defineProps<{
  id: string
  label: string
  name: string
  placeholder: string
  options: readonly Option[]
  error: string
}>()

const emit = defineEmits<{ blur: [] }>()

const value = defineModel<string>({ required: true })
</script>

<template>
  <BaseSelect
    :id="id"
    v-model="value"
    :label="label"
    :placeholder="placeholder"
    :options="options"
    :error="error"
    @blur="emit('blur')"
  />
  <input type="hidden" :name="name" :value="value" />
</template>
