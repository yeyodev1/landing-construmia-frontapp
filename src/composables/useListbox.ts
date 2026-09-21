import { computed, nextTick, onBeforeUnmount, ref, watch, type Ref, type ShallowRef } from 'vue'
import type { Option } from '@/config/qualification'

/**
 * Lógica de un listbox propio (patrón "select-only combobox" de WAI-ARIA).
 * El <select> nativo abre una lista del sistema operativo que no acepta estilos;
 * esto la reemplaza conservando teclado, lector de pantalla y cierre al hacer clic fuera.
 */
export function useListbox(
  options: Ref<readonly Option[]>,
  model: Ref<string>,
  onCommit: () => void,
  /** Contenedor del campo (para cerrar al hacer clic fuera) y la lista (para el scroll). */
  root: Readonly<ShallowRef<HTMLElement | null>>,
  list: Readonly<ShallowRef<HTMLElement | null>>,
) {
  const open = ref(false)
  const activeIndex = ref(-1)

  const selectedIndex = computed(() => options.value.findIndex((o) => o.value === model.value))
  const selected = computed(() => options.value[selectedIndex.value] ?? null)

  let typed = ''
  let typedTimer: ReturnType<typeof setTimeout> | undefined

  function scrollActiveIntoView() {
    nextTick(() => {
      const el = list.value?.children[activeIndex.value] as HTMLElement | undefined
      el?.scrollIntoView({ block: 'nearest' })
    })
  }

  function show() {
    if (open.value) return
    open.value = true
    activeIndex.value = Math.max(selectedIndex.value, 0)
    scrollActiveIntoView()
  }

  function hide() {
    if (!open.value) return
    open.value = false
    onCommit()
  }

  function choose(index: number) {
    const option = options.value[index]
    if (!option) return
    model.value = option.value
    open.value = false
    onCommit()
  }

  function move(delta: number) {
    const last = options.value.length - 1
    activeIndex.value = Math.min(last, Math.max(0, activeIndex.value + delta))
    scrollActiveIntoView()
  }

  /** Escribir las primeras letras salta a la opción, como en el select nativo. */
  function typeAhead(key: string) {
    clearTimeout(typedTimer)
    typed += key.toLocaleLowerCase('es')
    typedTimer = setTimeout(() => (typed = ''), 600)
    const index = options.value.findIndex((o) => o.label.toLocaleLowerCase('es').startsWith(typed))
    if (index < 0) return
    if (open.value) {
      activeIndex.value = index
      scrollActiveIntoView()
    } else {
      model.value = options.value[index]!.value
    }
  }

  function onKeydown(event: KeyboardEvent) {
    const { key } = event
    if (key === 'ArrowDown' || key === 'ArrowUp') {
      event.preventDefault()
      if (!open.value) return show()
      move(key === 'ArrowDown' ? 1 : -1)
    } else if (key === 'Home' || key === 'End') {
      if (!open.value) return
      event.preventDefault()
      activeIndex.value = key === 'Home' ? 0 : options.value.length - 1
      scrollActiveIntoView()
    } else if (key === 'Enter' || key === ' ') {
      event.preventDefault()
      if (open.value) choose(activeIndex.value)
      else show()
    } else if (key === 'Escape') {
      if (open.value) {
        // Que el Esc no cierre también el modal que contiene al campo.
        event.stopPropagation()
        hide()
      }
    } else if (key === 'Tab') {
      if (open.value) choose(activeIndex.value)
    } else if (key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
      typeAhead(key)
    }
  }

  function onDocumentPointer(event: PointerEvent) {
    if (root.value && !root.value.contains(event.target as Node)) hide()
  }

  watch(open, (isOpen) => {
    if (isOpen) document.addEventListener('pointerdown', onDocumentPointer)
    else document.removeEventListener('pointerdown', onDocumentPointer)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', onDocumentPointer)
    clearTimeout(typedTimer)
  })

  return { open, activeIndex, selected, selectedIndex, show, hide, choose, onKeydown }
}
