<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { videoCopy } from '@/config/copy/video'
import type { QualifyPhase } from '@/composables/useQualification'

const props = defineProps<{ phase: Exclude<QualifyPhase, 'questions'> }>()
const emit = defineEmits<{ retry: []; review: [] }>()

const copy = videoCopy.qualify
const retryBtn = ref<HTMLButtonElement | null>(null)

// Si el envío falla, el foco cae en "Reintentar": con teclado es un Enter y ya.
function focusRetry() {
  if (props.phase === 'error') retryBtn.value?.focus({ preventScroll: true })
}
onMounted(focusRetry)
watch(() => props.phase, focusRetry, { flush: 'post' })
</script>

<template>
  <div class="result" :class="`result--${phase}`">
    <!-- Un trazo que se dibuja, como la primera línea de un plano: es la espera y también el visto bueno. -->
    <span class="result__figure" aria-hidden="true">
      <svg viewBox="0 0 64 64" class="result__frame">
        <rect x="2" y="2" width="60" height="60" rx="4" pathLength="100" />
      </svg>
      <i v-if="phase === 'success'" class="fa-solid fa-check result__glyph"></i>
      <i v-else-if="phase === 'error'" class="fa-solid fa-rotate-right result__glyph"></i>
    </span>

    <div class="result__text" role="status" aria-live="polite">
      <template v-if="phase === 'reviewing'">
        <h2 class="result__title">{{ copy.reviewingTitle }}</h2>
        <p class="result__hint">{{ copy.reviewingHint }}</p>
      </template>
      <template v-else-if="phase === 'success'">
        <h2 class="result__title">{{ copy.successTitle }}</h2>
        <p class="result__hint">{{ copy.successHint }}</p>
      </template>
      <template v-else>
        <h2 class="result__title">{{ copy.errorTitle }}</h2>
        <p class="result__hint">{{ copy.errorHint }}</p>
      </template>
    </div>

    <div v-if="phase === 'error'" class="result__actions">
      <button ref="retryBtn" type="button" class="btn btn--dark btn--block" @click="emit('retry')">
        {{ copy.retry }}
      </button>
      <button type="button" class="result__link" @click="emit('review')">{{ copy.review }}</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.result {
  @include flex(column, center, center, 1.4rem);
  flex: 1;
  text-align: center;
  padding-block: 1.5rem;

  &__figure {
    position: relative;
    @include flex(row, center, center);
    width: 4rem;
    height: 4rem;
  }

  &__frame {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;

    rect {
      fill: transparent;
      stroke: $accent;
      stroke-width: 1.5;
      stroke-dasharray: 100;
      stroke-dashoffset: 100;
      transition: fill 0.4s ease;
    }
  }

  &--reviewing &__frame rect {
    animation: result-trace 1.4s $ease infinite;
  }

  // Con movimiento reducido la animación global dura 0: el marco se deja ya dibujado.
  @include reduced-motion {
    &--reviewing &__frame rect {
      stroke-dashoffset: 0;
    }
  }

  &--success &__frame rect {
    stroke-dashoffset: 0;
    fill: $accent;
  }

  &--error &__frame rect {
    stroke: $danger;
    stroke-dashoffset: 0;
  }

  &__glyph {
    position: relative;
    font-size: 1.35rem;
    color: $surface;
    animation: result-pop 0.35s $ease 1 both;
  }

  &--error &__glyph {
    color: $danger;
  }

  &__title {
    @include display($text-xl, 500);
    color: $ink;
  }

  &__hint {
    margin-top: 0.5rem;
    font-size: $text-sm;
    color: $ink-soft;
    max-width: 32ch;
    margin-inline: auto;
  }

  &__actions {
    @include flex(column, stretch, flex-start, 0.4rem);
    width: 100%;
    max-width: 18rem;
  }

  &__link {
    padding: 0.7rem;
    font-size: $text-sm;
    font-weight: 500;
    color: $ink-soft;
    text-decoration: underline;
    text-underline-offset: 3px;

    &:hover {
      color: $accent-deep;
    }
  }
}

@keyframes result-trace {
  0% {
    stroke-dashoffset: 100;
  }
  60%,
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes result-pop {
  from {
    opacity: 0;
    transform: scale(0.6);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
