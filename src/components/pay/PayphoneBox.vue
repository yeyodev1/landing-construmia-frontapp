<script setup lang="ts">
import { usePayphone } from '@/composables/usePayphone'
import { payphoneCopy as copy } from '@/config/copy/checkout'
import { facts } from '@/config/site'
import { formatMoney } from '@/utils/format'

const emit = defineEmits<{ 'use-transfer': [] }>()

// El id lo exige Payphone: render('pp-button') busca ese nodo en el documento.
const CONTAINER_ID = 'pp-button'
const { status, errorMessage, renewed, remainingLabel, expiringSoon, retry } = usePayphone(CONTAINER_ID)
</script>

<template>
  <section class="ppbox" aria-labelledby="ppbox-title">
    <header class="ppbox__head">
      <div>
        <h3 id="ppbox-title" class="ppbox__title">{{ copy.title }}</h3>
        <p class="ppbox__subtitle">{{ copy.subtitle }}</p>
      </div>
      <i class="fa-solid fa-lock ppbox__lock" aria-hidden="true"></i>
    </header>

    <div class="ppbox__summary">
      <span>{{ copy.summaryLabel }}</span>
      <strong>{{ formatMoney(facts.visitPrice) }}</strong>
    </div>

    <p v-if="status === 'ready'" class="ppbox__timer" :class="{ 'ppbox__timer--soon': expiringSoon }">
      <i class="fa-regular fa-clock" aria-hidden="true"></i>
      <span>{{ copy.expiresIn }}</span>
      <!-- Sin aria-live a propósito: un lector de pantalla no debe anunciar cada segundo. -->
      <span class="ppbox__clock">{{ remainingLabel }}</span>
    </p>

    <p class="visually-hidden" role="status" aria-live="polite">
      <template v-if="status === 'loading'">{{ copy.loading }}</template>
      <template v-else-if="status === 'ready' && renewed">{{ copy.renewed }}</template>
    </p>

    <p v-if="status === 'ready' && renewed" class="ppbox__renewed">{{ copy.renewed }}</p>

    <div class="ppbox__stage" :aria-busy="status === 'loading'">
      <div v-if="status === 'loading'" class="ppbox__skeleton" aria-hidden="true">
        <span class="ppbox__bone ppbox__bone--tabs"></span>
        <span class="ppbox__bone"></span>
        <span class="ppbox__bone"></span>
        <span class="ppbox__row">
          <span class="ppbox__bone"></span>
          <span class="ppbox__bone"></span>
        </span>
        <span class="ppbox__bone ppbox__bone--button"></span>
      </div>

      <div v-else-if="status === 'error'" class="ppbox__notice" role="alert">
        <i class="fa-solid fa-triangle-exclamation ppbox__notice-icon" aria-hidden="true"></i>
        <h4 class="ppbox__notice-title">{{ copy.error.title }}</h4>
        <p>{{ errorMessage || copy.error.fallback }}</p>
        <button type="button" class="btn btn--dark" @click="retry">
          <i class="fa-solid fa-rotate-right" aria-hidden="true"></i>
          {{ copy.error.retry }}
        </button>
      </div>

      <div v-else-if="status === 'unavailable'" class="ppbox__notice" role="status">
        <i class="fa-solid fa-building-columns ppbox__notice-icon" aria-hidden="true"></i>
        <h4 class="ppbox__notice-title">{{ copy.unavailable.title }}</h4>
        <p>{{ copy.unavailable.text }}</p>
        <button type="button" class="btn btn--primary" @click="emit('use-transfer')">
          {{ copy.unavailable.action }}
          <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </button>
      </div>

      <!-- Siempre en el DOM: Payphone lo busca por id. El interior es suyo. -->
      <div
        :id="CONTAINER_ID"
        class="payphone-box ppbox__mount"
        :class="{ 'ppbox__mount--hidden': status !== 'ready' }"
      ></div>
    </div>

    <p class="ppbox__secure">
      <i class="fa-solid fa-shield-halved" aria-hidden="true"></i>
      {{ copy.secure }}
    </p>
  </section>
</template>

<style scoped lang="scss">
.ppbox {
  @include flex(column, stretch, flex-start, 1rem);

  &__head {
    @include flex(row, flex-start, space-between, 1rem);
  }

  &__title {
    @include display($text-xl);
  }

  &__subtitle {
    font-size: $text-sm;
    color: $ink-soft;
    margin-top: 0.3rem;
  }

  &__lock {
    color: $ink-muted;
    font-size: 0.9rem;
    padding-top: 0.45rem;
  }

  &__summary {
    @include flex(row, baseline, space-between, 1rem);
    padding-block: 0.85rem;
    border-block: 1px solid $line;
    font-size: $text-sm;
    color: $ink-soft;

    strong {
      font-family: $font-display;
      font-size: $text-lg;
      font-weight: 500;
      color: $ink;
      font-variant-numeric: tabular-nums;
    }
  }

  &__timer {
    @include flex(row, center, flex-start, 0.45rem);
    font-size: $text-xs;
    color: $ink-muted;
    transition: color 0.3s $ease;

    &--soon {
      color: $danger;
    }
  }

  &__clock {
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }

  &__renewed {
    font-size: $text-sm;
    color: $ink-soft;
    background: $sand;
    border-radius: $radius-sm;
    padding: 0.7rem 0.9rem;
  }

  &__stage {
    position: relative;
    min-height: 22rem;
  }

  // Mientras no está listo se saca del flujo: el skeleton ocupa su lugar sin saltos.
  &__mount--hidden {
    position: absolute;
    inset: 0;
    visibility: hidden;
    overflow: hidden;
  }

  &__skeleton {
    @include flex(column, stretch, flex-start, 0.85rem);
  }

  &__row {
    display: flex;
    gap: 0.85rem;

    > * {
      flex: 1;
    }
  }

  &__bone {
    display: block;
    height: 3rem;
    border-radius: $radius-sm;
    background: linear-gradient(100deg, $sand 40%, lighten($sand, 3) 50%, $sand 60%);
    background-size: 220% 100%;
    animation: ppbox-shimmer 1.6s linear infinite;

    @include reduced-motion {
      animation: none;
    }

    &--tabs {
      height: 2.4rem;
      width: 62%;
    }

    &--button {
      height: 3.2rem;
      border-radius: $radius-pill;
      margin-top: 0.5rem;
    }
  }

  &__notice {
    @include flex(column, flex-start, center, 0.7rem);
    min-height: 22rem;
    padding: 1.5rem;
    background: $sand;
    border-radius: 14px;
    font-size: $text-sm;
    color: $ink-soft;

    .btn {
      margin-top: 0.5rem;
    }
  }

  &__notice-icon {
    @include flex(row, center, center);
    width: 2.6rem;
    height: 2.6rem;
    border-radius: 50%;
    background: $surface;
    color: $accent-deep;
  }

  &__notice-title {
    @include display($text-lg);
    color: $ink;
  }

  &__secure {
    @include flex(row, flex-start, flex-start, 0.55rem);
    font-size: $text-xs;
    color: $ink-muted;

    i {
      padding-top: 0.2rem;
    }
  }
}

@keyframes ppbox-shimmer {
  to {
    background-position: -220% 0;
  }
}
</style>
