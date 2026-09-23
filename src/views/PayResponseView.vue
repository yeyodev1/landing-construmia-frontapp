<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { confirmPaymentOnce } from '@/composables/usePayphone'
import { useLeadStore } from '@/stores/lead'
import { facts, whatsappLink } from '@/config/site'
import { track } from '@/utils/pixel'
import { payResponseCopy as copy } from '@/config/copy/checkout'
import type { ApiError } from '@/types'

type State = 'confirming' | 'paid' | 'canceled' | 'pending' | 'error'

const REDIRECT_MS = 2500

const route = useRoute()
const router = useRouter()
const leadStore = useLeadStore()

const state = ref<State>('confirming')
const serverMessage = ref('')
let redirectTimer: number | undefined

const firstQuery = (value: unknown) => String((Array.isArray(value) ? value[0] : value) ?? '').trim()
const id = firstQuery(route.query.id)
const clientTransactionId = firstQuery(route.query.clientTransactionId)

// Pagó desde un navegador sin registro guardado y el API no devolvió el lead: la agenda no abriría.
const canOpenSchedule = computed(() => leadStore.canSchedule)

const view = computed(() => {
  if (state.value === 'paid') {
    return {
      icon: 'fa-solid fa-check',
      tone: 'ok',
      eyebrow: copy.paid.eyebrow,
      title: copy.paid.title,
      text: canOpenSchedule.value ? copy.paid.text : copy.paid.noLeadText,
    }
  }
  if (state.value === 'canceled') return { icon: 'fa-solid fa-xmark', tone: 'muted', ...copy.canceled }
  if (state.value === 'pending') return { icon: 'fa-regular fa-clock', tone: 'muted', ...copy.pending }
  return {
    icon: 'fa-solid fa-triangle-exclamation',
    tone: 'warn',
    eyebrow: copy.error.eyebrow,
    title: copy.error.title,
    text: serverMessage.value || copy.error.fallback,
  }
})

function goToSchedule() {
  window.clearTimeout(redirectTimer)
  router.replace({ name: 'Schedule' })
}

async function confirm() {
  window.clearTimeout(redirectTimer)
  serverMessage.value = ''

  if (!id || !clientTransactionId) {
    state.value = 'error'
    serverMessage.value = copy.error.missing
    return
  }

  state.value = 'confirming'
  try {
    const result = await confirmPaymentOnce(id, clientTransactionId)

    if (result.status === 'paid') {
      if (result.lead) leadStore.set(result.lead)
      else await leadStore.refresh()
      state.value = 'paid'
      track('Purchase', { value: facts.visitPrice, currency: 'USD' })
      if (canOpenSchedule.value) redirectTimer = window.setTimeout(goToSchedule, REDIRECT_MS)
      return
    }
    state.value = result.status
  } catch (error) {
    state.value = 'error'
    serverMessage.value = (error as ApiError).message
  }
}

// Sin esperar clics: Payphone reversa el cobro si no se confirma en 5 minutos.
onMounted(confirm)
onBeforeUnmount(() => window.clearTimeout(redirectTimer))
</script>

<template>
  <section class="response">
    <div class="response__card" aria-live="polite" :aria-busy="state === 'confirming'">
      <template v-if="state === 'confirming'">
        <span class="response__spinner" aria-hidden="true"></span>
        <h1 class="response__title">{{ copy.confirming.title }}</h1>
        <p class="response__text">{{ copy.confirming.text }}</p>
      </template>

      <template v-else>
        <span class="response__icon" :class="`response__icon--${view.tone}`" aria-hidden="true">
          <i :class="view.icon"></i>
        </span>
        <p class="response__eyebrow">{{ view.eyebrow }}</p>
        <h1 class="response__title">{{ view.title }}</h1>
        <p class="response__text">{{ view.text }}</p>

        <div v-if="state === 'paid'" class="response__actions">
          <template v-if="canOpenSchedule">
            <button type="button" class="btn btn--primary btn--lg" @click="goToSchedule">
              {{ copy.paid.action }}
              <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </button>
            <span class="response__progress" aria-hidden="true"><span></span></span>
          </template>
          <a
            v-else
            class="btn btn--primary btn--lg"
            :href="whatsappLink(copy.paid.whatsappMessage)"
            target="_blank"
            rel="noopener"
          >
            <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
            {{ copy.paid.noLeadAction }}
          </a>
        </div>

        <div v-else class="response__actions">
          <button v-if="state === 'pending'" type="button" class="btn btn--primary" @click="confirm">
            <i class="fa-solid fa-rotate-right" aria-hidden="true"></i>
            {{ copy.pending.retry }}
          </button>
          <button
            v-else-if="state === 'error' && id && clientTransactionId"
            type="button"
            class="btn btn--primary"
            @click="confirm"
          >
            <i class="fa-solid fa-rotate-right" aria-hidden="true"></i>
            {{ copy.error.retry }}
          </button>
          <RouterLink :to="{ name: 'Pay' }" class="btn" :class="state === 'canceled' ? 'btn--primary' : 'btn--ghost'">
            {{ copy.backToPay }}
          </RouterLink>
          <!-- Solo si pudo haber un cobro real: sin transacción o con el pago cancelado no hay WhatsApp. -->
          <a
            v-if="state !== 'canceled' && id && clientTransactionId"
            class="response__help"
            :href="whatsappLink(copy.helpMessage)"
            target="_blank"
            rel="noopener"
          >
            <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
            {{ copy.help }}
          </a>
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped lang="scss">
.response {
  @include container(40rem);
  @include flex(column, center, center);
  flex: 1;
  padding-block: $space-xl;
  min-height: 70vh;

  &__card {
    @include flex(column, center, flex-start, 0);
    width: 100%;
    text-align: center;
  }

  // Un solo aro fino girando: sobrio, sin rebotes.
  &__spinner {
    width: 3rem;
    height: 3rem;
    margin-bottom: 1.75rem;
    border: 1.5px solid $line;
    border-top-color: $accent;
    border-radius: 50%;
    animation: response-spin 0.9s linear infinite;

    @include reduced-motion {
      animation-duration: 2.4s !important;
      animation-iteration-count: infinite !important;
    }
  }

  &__icon {
    @include flex(row, center, center);
    width: 3.5rem;
    height: 3.5rem;
    margin-bottom: 1.5rem;
    border-radius: 50%;
    font-size: 1.2rem;
    animation: response-pop 0.4s $ease both;

    &--ok {
      background: $success-bg;
      color: $success;
    }

    &--muted {
      background: $sand;
      color: $ink-soft;
    }

    &--warn {
      background: $danger-bg;
      color: $danger;
    }
  }

  &__eyebrow {
    @include eyebrow;
    margin-bottom: 0.8rem;
  }

  &__title {
    @include display($display-sm);
  }

  &__text {
    max-width: 30rem;
    margin-top: 1rem;
    font-size: $text-lg;
    line-height: 1.5;
    color: $ink-soft;
  }

  &__actions {
    @include flex(row, center, center, 0.75rem);
    flex-wrap: wrap;
    width: 100%;
    margin-top: 2rem;

    @include until('sm') {
      flex-direction: column;

      .btn {
        width: 100%;
      }
    }
  }

  // Cuenta regresiva visual hacia la agenda: se llena en lo que tarda la redirección.
  &__progress {
    flex: 0 0 100%;
    width: 100%;
    max-width: 12rem;
    height: 2px;
    margin-top: 0.75rem;
    overflow: hidden;
    border-radius: 2px;
    background: $line;

    span {
      display: block;
      height: 100%;
      background: $accent;
      transform-origin: left;
      animation: response-fill 2.5s linear both;
    }
  }

  &__help {
    @include flex(row, center, center, 0.5rem);
    flex: 0 0 100%;
    min-height: 2.75rem;
    margin-top: 0.25rem;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-soft;
    transition: color 0.2s $ease;

    &:hover {
      color: $accent-deep;
    }
  }
}

@keyframes response-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes response-pop {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
}

@keyframes response-fill {
  from {
    transform: scaleX(0);
  }
}
</style>
