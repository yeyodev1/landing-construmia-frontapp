<script setup lang="ts">
import { computed } from 'vue'
import { videoCopy } from '@/config/copy/video'
import { useCountdown } from '@/composables/useCountdown'

const props = defineProps<{
  seconds: number
  /** Una clave por lead: el contador de una persona no hereda el de otra en el mismo navegador. */
  storageKey: string
}>()

const emit = defineEmits<{ request: [] }>()

const copy = videoCopy.countdown
const { done, startedDone, progress, clock, announceSeconds } = useCountdown({
  seconds: props.seconds,
  storageKey: props.storageKey,
})

// Regla de escala como la de un plano: una marca cada 10 s, una mayor con su cifra cada 30 s.
const TICK = 10
const MAJOR = 30
const segments = computed(() => Math.max(1, Math.round(props.seconds / TICK)))
const marks = computed(() => {
  const out: string[] = []
  for (let s = props.seconds; s >= 0; s -= MAJOR)
    out.push(`${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`)
  return out
})

const announcement = computed(() => {
  if (done.value) return copy.announceDone
  const s = announceSeconds.value
  return copy.announce(Math.floor(s / 60), s % 60)
})
</script>

<template>
  <section
    class="unlock"
    :class="{ 'unlock--done': done, 'unlock--celebrate': done && !startedDone }"
  >
    <p class="visually-hidden" aria-live="polite">{{ announcement }}</p>

    <div class="unlock__head">
      <p class="unlock__label">{{ done ? copy.doneLabel : copy.runningLabel }}</p>
      <p class="unlock__clock" aria-hidden="true">{{ clock }}</p>
    </div>

    <div class="unlock__scale" aria-hidden="true">
      <div class="unlock__ticks">
        <span
          v-for="n in segments"
          :key="n"
          class="unlock__tick"
          :class="{ 'unlock__tick--major': ((n - 1) * TICK) % MAJOR === 0 }"
        ></span>
        <span class="unlock__fill" :style="{ transform: `scaleX(${progress})` }"></span>
      </div>
      <div class="unlock__marks">
        <span v-for="mark in marks" :key="mark">{{ mark }}</span>
      </div>
    </div>

    <Transition name="swap" mode="out-in">
      <div v-if="done" key="done" class="unlock__message">
        <h2 class="unlock__title">{{ copy.doneTitle }}</h2>
        <p class="unlock__hint">{{ copy.doneHint }}</p>
      </div>
      <p v-else key="running" class="unlock__hint unlock__message">{{ copy.runningHint }}</p>
    </Transition>

    <button
      type="button"
      class="btn btn--lg btn--block unlock__btn"
      :class="done ? 'btn--primary' : 'unlock__btn--locked'"
      :disabled="!done"
      @click="emit('request')"
    >
      <i
        class="unlock__btn-icon"
        :class="done ? 'fa-solid fa-arrow-right' : 'fa-solid fa-lock'"
        aria-hidden="true"
      ></i>
      <span class="unlock__btn-text">
        <span>{{ copy.button }}</span>
        <small v-if="!done">{{ copy.buttonWait(clock) }}</small>
      </span>
    </button>
  </section>
</template>

<style scoped lang="scss">
.unlock {
  @include flex(column, stretch, flex-start, 1.25rem);
  padding: 1.5rem 1.25rem;
  background: $night-soft;
  border: 1px solid $night-line;
  border-radius: $radius-md;
  transition: border-color 0.6s $ease;

  @include from('md') {
    padding: 2rem;
  }

  &--done {
    border-color: rgba($accent-glow, 0.45);
  }

  &__head {
    @include flex(row, flex-end, space-between, 1rem);
  }

  &__label {
    @include eyebrow;
    color: $on-night-soft;
    max-width: 13rem;
    line-height: 1.5;
  }

  &--done &__label {
    color: $accent-glow;
  }

  &__clock {
    @include display($display-md, 400);
    color: $on-night;
    font-variant-numeric: tabular-nums lining-nums;
    line-height: 0.9;
    min-width: 4ch;
    text-align: right;
    transition: color 0.6s $ease;
  }

  &--done &__clock {
    color: $accent-glow;
  }

  &__ticks {
    position: relative;
    display: flex;
    align-items: flex-end;
    height: 14px;
    border-bottom: 1px solid rgba($on-night, 0.28);
    border-right: 1px solid rgba($on-night, 0.55);
  }

  &__tick {
    flex: 1;
    height: 6px;
    border-left: 1px solid rgba($on-night, 0.28);

    &--major {
      height: 14px;
      border-left-color: rgba($on-night, 0.55);
    }
  }

  &__fill {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 3px;
    background: $accent-glow;
    transform-origin: left center;
    // Lineal y del largo del tick: la barra avanza continua en vez de a saltos.
    transition: transform 0.26s linear;
  }

  &__marks {
    @include flex(row, center, space-between);
    margin-top: 0.4rem;
    // Las cifras se centran bajo su marca: la primera y la última sobresalen medio ancho.
    margin-inline: -0.8rem;
    font-size: 0.68rem;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.04em;
    color: rgba($on-night, 0.5);

    span {
      width: 1.6rem;
      text-align: center;
    }
  }

  &__message {
    min-height: 4.2rem;
  }

  &__title {
    @include display($text-xl, 500);
    color: $on-night;
    margin-bottom: 0.4rem;
  }

  &__hint {
    font-size: $text-sm;
    color: $on-night-soft;
    max-width: 44ch;
  }

  &__btn {
    position: relative;
    overflow: hidden;
    // Junto a la vía rápida la tarjeta se estira: el botón se queda abajo, alineado con el otro CTA.
    margin-top: auto;
    padding-inline: 1.1rem;
    line-height: 1.25;
    text-align: left;
    justify-content: flex-start;
    gap: 0.9rem;
    border-radius: $radius-sm;

    &--locked {
      border: 1px solid $night-line;
      color: $on-night-soft;
    }

    // El .btn:disabled global baja la opacidad a 0.45: acá el botón bloqueado tiene que leerse.
    &:disabled {
      opacity: 1;
      cursor: not-allowed;
    }
  }

  &__btn-icon {
    flex: none;
    width: 1.1rem;
    text-align: center;
    font-size: 0.85rem;
  }

  &--done &__btn-icon {
    order: 2;
    margin-left: auto;
  }

  &__btn-text {
    @include flex(column, flex-start, center, 0.15rem);
    min-width: 0;

    small {
      font-size: 0.74rem;
      font-weight: 500;
      letter-spacing: 0.02em;
      font-variant-numeric: tabular-nums;
      color: rgba($on-night, 0.5);
    }
  }

  // Un solo destello de luz al habilitarse: avisa sin convertirse en un banner que parpadea.
  &--celebrate &__btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(100deg, transparent 30%, rgba(#fff, 0.35) 50%, transparent 70%);
    transform: translateX(-110%);
    animation: unlock-sheen 1.1s $ease 0.25s 1 forwards;
    pointer-events: none;
  }

  &--celebrate &__btn {
    animation: unlock-rise 0.5s $ease 1;
  }
}

.swap-enter-active,
.swap-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.3s $ease;
}

.swap-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.swap-leave-to {
  opacity: 0;
}

@keyframes unlock-sheen {
  to {
    transform: translateX(110%);
  }
}

@keyframes unlock-rise {
  from {
    transform: scale(0.985);
  }
  to {
    transform: scale(1);
  }
}
</style>
