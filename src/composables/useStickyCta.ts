import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * La barra fija de móvil aparece cuando la persona ya dejó atrás el video del inicio y se
 * esconde al llegar al formulario del final: nunca compite con el video ni con el formulario.
 */
export function useStickyCta(afterSelector: string, hideNearSelector?: string) {
  const passed = ref(false)
  const nearForm = ref(false)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    const after = document.querySelector(afterSelector)
    const form = hideNearSelector ? document.querySelector(hideNearSelector) : null
    if (!after) return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === after) {
            passed.value = !entry.isIntersecting && entry.boundingClientRect.bottom < 0
          } else {
            nearForm.value = entry.isIntersecting
          }
        })
      },
      { threshold: 0 },
    )
    observer.observe(after)
    if (form) observer.observe(form)
  })

  onBeforeUnmount(() => observer?.disconnect())

  return { visible: computed(() => passed.value && !nearForm.value) }
}
