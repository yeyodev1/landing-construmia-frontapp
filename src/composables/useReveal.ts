import { onBeforeUnmount, onMounted, type Ref } from 'vue'

/**
 * Activa la clase `.is-visible` en los hijos `.reveal` de un contenedor cuando entran
 * al viewport. Un solo observer por sección; con reduced-motion se muestran de una.
 */
export function useReveal(root: Ref<HTMLElement | null>) {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    const items = root.value?.querySelectorAll<HTMLElement>('.reveal') ?? []
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach((el) => el.classList.add('is-visible'))
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer?.unobserve(entry.target)
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    items.forEach((el) => observer?.observe(el))
  })

  onBeforeUnmount(() => observer?.disconnect())
}
