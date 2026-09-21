<script setup lang="ts">
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()

const icons: Record<string, string> = {
  success: 'fa-solid fa-circle-check',
  error: 'fa-solid fa-circle-exclamation',
  info: 'fa-solid fa-circle-info',
}
</script>

<template>
  <Teleport to="body">
    <div class="toasts" aria-live="polite">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toastStore.toasts"
          :key="toast.id"
          class="toasts__item"
          :class="`toasts__item--${toast.type}`"
          @click="toastStore.dismiss(toast.id)"
        >
          <i :class="icons[toast.type]" aria-hidden="true"></i>
          <span>{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.toasts {
  position: fixed;
  // En móvil, por encima de la barra fija del CTA (misma altura que el aviso de actividad).
  bottom: calc(88px + env(safe-area-inset-bottom));
  right: 1rem;
  left: 1rem;
  @include flex(column, stretch, flex-end, 0.6rem);
  z-index: 400; // por encima del modal de cualificación (300)
  pointer-events: none;

  @include from('md') {
    bottom: calc(1.4rem + env(safe-area-inset-bottom));
    right: 1.4rem;
    left: auto;
    max-width: 360px;
  }

  &__item {
    @include flex(row, center, flex-start, 0.7rem);
    background: $ink;
    color: $paper;
    font-size: $text-sm;
    padding: 0.85rem 1.1rem;
    border-radius: $radius-sm;
    box-shadow: $shadow-md;
    cursor: pointer;
    pointer-events: auto;

    i {
      color: $accent-soft;
    }

    &--success i {
      color: $success;
    }

    &--error {
      background: $danger;

      i {
        color: $paper;
      }
    }
  }
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s $ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(24px);
}
</style>
