import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useLeadStore } from '@/stores/lead'
import { site } from '@/config/site'

/**
 * El embudo: registro (/) → video y cualificación (/video) → agenda (/agendar).
 * Vía rápida: /pago (visita técnica) → /pago/respuesta → /agendar.
 */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: site.name },
  },
  {
    path: '/video',
    name: 'Video',
    component: () => import('@/views/VideoView.vue'),
    meta: { title: 'El método Construmia 380', requiresLead: true },
  },
  {
    path: '/agendar',
    name: 'Schedule',
    component: () => import('@/views/ScheduleView.vue'),
    meta: { title: 'Agenda tu visita técnica', requiresLead: true, requiresUnlock: true },
  },
  {
    path: '/pago',
    name: 'Pay',
    component: () => import('@/views/PayView.vue'),
    meta: { title: 'Reserva tu visita técnica', requiresLead: true },
  },
  {
    // Payphone redirige acá con ?id=&clientTransactionId=
    path: '/pago/respuesta',
    name: 'PayResponse',
    component: () => import('@/views/PayResponseView.vue'),
    meta: { title: 'Confirmando tu pago' },
  },
  {
    path: '/gracias',
    name: 'Thanks',
    component: () => import('@/views/ThanksView.vue'),
    meta: { title: 'Gracias', requiresLead: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Página no encontrada' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { left: 0, top: 0 }
  },
})

router.beforeEach((to) => {
  const leadStore = useLeadStore()

  // Sin registro no hay video ni agenda: se vuelve al formulario.
  if (to.meta.requiresLead && !leadStore.isRegistered) {
    return { name: 'Home', hash: '#registro', replace: true }
  }

  // La agenda se abre al calificar o al pagar la visita.
  if (to.meta.requiresUnlock && !leadStore.canSchedule) {
    return { name: 'Video', replace: true }
  }
})

router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  document.title = title && title !== site.name ? `${title} — ${site.name}` : site.name
})

export default router
