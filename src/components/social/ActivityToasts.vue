<script setup lang="ts">
import { useRoute, type RouteLocationRaw } from 'vue-router'
import { useActivityFeed } from '@/composables/useActivityFeed'
import { activityCopy } from '@/config/copy/shell'

const route = useRoute()
const { current, visible, paused, dismissed, dismiss, consume, hold, release } = useActivityFeed()

// En táctil no existe "salir" del hover: solo el mouse pausa el aviso.
function onPointer(event: PointerEvent, entering: boolean) {
  if (event.pointerType !== 'mouse') return
  if (entering) hold('hover')
  else release('hover')
}

function onLink(to: RouteLocationRaw) {
  // Si ya se está en la landing, el router no vuelve a navegar al mismo hash: se baja a mano.
  const hash = typeof to === 'object' && 'hash' in to ? to.hash : undefined
  if (hash && route.name === 'Home') {
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.querySelector(hash)?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })
  }
  consume()
}
</script>

<template>
  <div v-if="!dismissed" class="activity" aria-live="polite" :aria-label="activityCopy.regionLabel" role="region">
    <Transition name="activity">
      <div
        v-if="visible && current"
        :key="current.id"
        class="activity__card"
        :class="{ 'activity__card--paused': paused }"
        @pointerenter="onPointer($event, true)"
        @pointerleave="onPointer($event, false)"
        @focusin="hold('focus')"
        @focusout="release('focus')"
      >
        <p class="activity__meta">
          <span class="activity__dot" :class="`activity__dot--${current.kind}`" aria-hidden="true"></span>
          <span class="activity__eyebrow">{{ current.eyebrow }}</span>
          <span v-if="current.time" class="activity__time">
            <span aria-hidden="true">·</span> {{ current.time }}
          </span>
        </p>

        <p class="activity__text">{{ current.text }}</p>

        <!-- Los ejemplos se rotulan dentro del propio aviso, a la vista y en el texto que se anuncia. -->
        <p v-if="current.label" class="activity__sample">
          <i class="fa-regular fa-lightbulb" aria-hidden="true"></i>
          {{ current.label }}
        </p>

        <RouterLink v-if="current.link" :to="current.link.to" class="activity__link" @click="onLink(current.link.to)">
          {{ current.link.label }}
          <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </RouterLink>

        <button type="button" class="activity__close" :aria-label="activityCopy.close" @click="dismiss">
          <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>

        <span class="activity__timer" aria-hidden="true"></span>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.activity {
  position: fixed;
  left: max(1rem, env(safe-area-inset-left));
  // En móvil va por encima de la barra fija del CTA (StickyCta): 88 px + la zona segura.
  // Una vista con otra altura de barra puede ajustarlo con --activity-offset.
  bottom: calc(var(--activity-offset, 88px) + env(safe-area-inset-bottom));
  z-index: 150; // sobre el header (100), debajo de modales (300) y toasts (400)
  width: min(320px, calc(100vw - 2rem));
  pointer-events: none;

  @include from('md') {
    left: max(1.5rem, env(safe-area-inset-left));
    bottom: calc(max(1.5rem, env(safe-area-inset-bottom)) + var(--activity-offset-md, 0px));
  }

  &__card {
    position: relative;
    @include flex(column, flex-start, flex-start, 0.3rem);
    padding: 0.8rem 2.6rem 0.9rem 1rem;
    background: $surface;
    border: 1px solid $line;
    border-radius: $radius-sm;
    box-shadow: $shadow-md;
    overflow: hidden;
    pointer-events: auto;
  }

  &__meta {
    @include flex(row, center, flex-start, 0.45rem);
    font-size: 0.66rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: $ink-soft;
    line-height: 1.3;
  }

  &__dot {
    flex: none;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: $accent;

    // El pulso se reserva para la actividad real: ahí sí hay algo "en vivo".
    &--activity {
      animation: activity-pulse 2.4s $ease infinite;
    }

    // Ni el ejemplo ni el dato informativo "laten": no hay nada en vivo detrás.
    &--tip,
    &--sample {
      background: transparent;
      box-shadow: inset 0 0 0 1.5px $accent;
    }
  }

  &__eyebrow {
    color: $accent-deep;
  }

  &__time {
    letter-spacing: 0.06em;
    text-transform: none;
    font-weight: 500;
    font-size: 0.72rem;
    white-space: nowrap;
  }

  &__text {
    font-size: 0.86rem;
    font-weight: 500;
    line-height: 1.45;
    color: $ink;
  }

  // Etiqueta de ejemplo: pequeña pero legible (ink-soft sobre arena, ~7:1), nunca en gris tenue.
  &__sample {
    @include flex(row, center, flex-start, 0.4rem);
    margin-top: 0.2rem;
    padding: 0.2rem 0.55rem;
    font-size: 0.72rem;
    font-weight: 600;
    line-height: 1.3;
    color: $ink-soft;
    background: $sand;
    border: 1px dashed rgba($ink-soft, 0.35);
    border-radius: $radius-pill;

    i {
      font-size: 0.68rem;
      color: $accent-deep;
    }
  }

  &__link {
    @include flex(row, center, flex-start, 0.4rem);
    margin-top: 0.15rem;
    padding-block: 0.2rem;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: $accent-deep;
    border-bottom: 1px solid rgba($accent, 0.35);
    @include transition(border-color);

    i {
      font-size: 0.68rem;
      transition: transform 0.25s $ease;
    }

    @media (hover: hover) {
      &:hover {
        border-color: $accent-deep;

        i {
          transform: translateX(3px);
        }
      }
    }
  }

  &__close {
    position: absolute;
    top: 0.3rem;
    right: 0.3rem;
    width: 2rem;
    height: 2rem;
    @include flex(row, center, center);
    font-size: 0.8rem;
    color: $ink-muted;
    border-radius: 50%;
    @include transition;

    // Área táctil de 44 px sin agrandar el botón visible.
    &::after {
      content: '';
      position: absolute;
      inset: -6px;
    }

    @media (hover: hover) {
      &:hover {
        color: $ink;
        background: $sand;
      }
    }

    &:active {
      transform: scale(0.94);
    }
  }

  // Hilo de cobre que se consume en lo que dura el aviso; se detiene con el hover.
  &__timer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    background: $accent;
    transform-origin: left center;
    animation: activity-timer 6s linear forwards;

    @include reduced-motion {
      display: none;
    }
  }

  &__card--paused &__timer {
    animation-play-state: paused;
  }
}

.activity-enter-active {
  transition:
    opacity 0.4s $ease,
    transform 0.4s $ease;
}

.activity-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.activity-enter-from {
  opacity: 0;
  transform: translateY(14px);
}

.activity-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

@keyframes activity-timer {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

@keyframes activity-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba($accent, 0.45);
  }
  60% {
    box-shadow: 0 0 0 5px rgba($accent, 0);
  }
}
</style>
