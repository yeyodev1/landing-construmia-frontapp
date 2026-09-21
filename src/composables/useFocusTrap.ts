import { nextTick, onBeforeUnmount, watch, type Ref } from 'vue'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Foco atrapado dentro de un diálogo mientras está abierto: Tab y Shift+Tab dan la vuelta
 * sin salir, y al cerrar el foco vuelve a quien lo abrió (el botón del contador).
 */
export function useFocusTrap(container: Ref<HTMLElement | null>, active: Ref<boolean>) {
  let opener: HTMLElement | null = null

  function focusables(): HTMLElement[] {
    const root = container.value
    if (!root) return []
    return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.tabIndex >= 0 && el.offsetParent !== null,
    )
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.key !== 'Tab' || !container.value) return
    const items = focusables()
    const first = items[0]
    const last = items[items.length - 1]
    if (!first || !last) {
      event.preventDefault()
      container.value.focus()
      return
    }
    const current = document.activeElement as HTMLElement | null
    const outside = !current || !container.value.contains(current)

    if (event.shiftKey && (current === first || outside)) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && (current === last || outside)) {
      event.preventDefault()
      first.focus()
    }
  }

  function release() {
    document.removeEventListener('keydown', onKeydown)
    opener?.focus({ preventScroll: true })
    opener = null
  }

  watch(
    active,
    async (open) => {
      if (open) {
        opener = document.activeElement as HTMLElement | null
        document.addEventListener('keydown', onKeydown)
        await nextTick()
        // Si la pantalla ya puso el foco en un control suyo (la primera opción), se respeta.
        const root = container.value
        if (root && !root.contains(document.activeElement)) root.focus({ preventScroll: true })
      } else if (opener) {
        release()
      }
    },
    { immediate: true },
  )

  onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
}
