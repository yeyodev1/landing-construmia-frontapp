import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'
import { countries, type Country } from '@/config/countries'

/** Ecuador va primero en la lista: es el mercado y el país por defecto del teléfono. */
export const DEFAULT_COUNTRY: Country = (() => {
  const first = countries[0]
  if (!first) throw new Error('countries.ts no puede estar vacío')
  return first
})()

/** País por código ISO; si el código no existe (dato viejo o manipulado), vuelve al de defecto. */
export function findCountry(code: string): Country {
  return countries.find((item) => item.code === code) ?? DEFAULT_COUNTRY
}

/** Elementos del DOM que pone el componente: el contenedor (clic afuera) y el disparador (foco de vuelta). */
export interface CountryPickerElements {
  root: Readonly<Ref<HTMLElement | null>>
  trigger: Readonly<Ref<HTMLElement | null>>
}

/** "Perú" y "peru" tienen que encontrarse igual. */
function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

/**
 * Selector de país del teléfono: lista con búsqueda que se maneja entera con teclado.
 * El foco vive en el buscador y la opción activa se anuncia con aria-activedescendant.
 * La vista se reparte entre PhoneField (disparador) y CountryPanel (buscador y lista).
 */
export function useCountryPicker(
  selected: Ref<string>,
  idPrefix: string,
  { root, trigger }: CountryPickerElements,
) {
  const open = ref(false)
  const query = ref('')
  const activeIndex = ref(0)

  const current = computed(() => findCountry(selected.value))

  const filtered = computed(() => {
    const term = normalize(query.value)
    if (!term) return countries
    const digits = term.replace(/\D/g, '')
    return countries.filter(
      (item) =>
        normalize(item.name).includes(term) ||
        (digits !== '' && item.dial.replace('+', '').startsWith(digits)),
    )
  })

  const listId = `${idPrefix}-country-list`
  const optionId = (code: string) => `${idPrefix}-country-${code}`
  const activeId = computed(() => {
    const item = filtered.value[activeIndex.value]
    return item ? optionId(item.code) : undefined
  })

  function scrollToActive() {
    nextTick(() => {
      const id = activeId.value
      if (!id) return
      document.getElementById(id)?.scrollIntoView({ block: 'nearest' })
    })
  }

  function show() {
    query.value = ''
    activeIndex.value = Math.max(
      0,
      countries.findIndex((item) => item.code === selected.value),
    )
    open.value = true
    // El buscador se enfoca solo al montarse (CountryPanel); acá solo se ubica la lista.
    scrollToActive()
  }

  function hide(returnFocus = true) {
    if (!open.value) return
    open.value = false
    if (returnFocus) trigger.value?.focus()
  }

  function toggle() {
    if (open.value) hide()
    else show()
  }

  function choose(item: Country) {
    selected.value = item.code
    hide()
  }

  function move(step: number) {
    const total = filtered.value.length
    if (!total) return
    activeIndex.value = (activeIndex.value + step + total) % total
    scrollToActive()
  }

  function onSearchKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        move(1)
        break
      case 'ArrowUp':
        event.preventDefault()
        move(-1)
        break
      case 'Home':
        event.preventDefault()
        activeIndex.value = 0
        scrollToActive()
        break
      case 'End':
        event.preventDefault()
        activeIndex.value = Math.max(0, filtered.value.length - 1)
        scrollToActive()
        break
      case 'Enter': {
        // Enter elige el país; no debe enviar el formulario que lo contiene.
        event.preventDefault()
        const item = filtered.value[activeIndex.value]
        if (item) choose(item)
        break
      }
      case 'Escape':
        event.preventDefault()
        event.stopPropagation()
        hide()
        break
      case 'Tab':
        hide(false)
        break
    }
  }

  function onTriggerKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      show()
    }
  }

  function onPointerDownOutside(event: PointerEvent) {
    if (open.value && !root.value?.contains(event.target as Node)) hide(false)
  }

  // Cada búsqueda nueva deja activa la primera coincidencia.
  watch(query, () => {
    activeIndex.value = 0
  })

  onMounted(() => document.addEventListener('pointerdown', onPointerDownOutside))
  onBeforeUnmount(() => document.removeEventListener('pointerdown', onPointerDownOutside))

  return {
    open,
    query,
    activeIndex,
    current,
    filtered,
    listId,
    optionId,
    activeId,
    toggle,
    choose,
    onSearchKeydown,
    onTriggerKeydown,
  }
}
