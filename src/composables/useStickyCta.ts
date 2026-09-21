import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * La barra fija de móvil solo aparece cuando la persona ya dejó atrás el formulario
 * (lo pasó hacia abajo) y se esconde apenas vuelve a tenerlo a la vista: nunca compite con él.
 */
export function useStickyCta(targetSelector: string) {
  const visible = ref(false)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    const target = document.querySelector(targetSelector)
    if (!target) return

    observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        visible.value = !entry.isIntersecting && entry.boundingClientRect.bottom < 0
      },
      { threshold: 0 },
    )
    observer.observe(target)
  })

  onBeforeUnmount(() => observer?.disconnect())

  return { visible }
}
