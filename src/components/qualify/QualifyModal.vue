<script setup lang="ts">
import { computed, ref, toRef } from 'vue'
import { videoCopy } from '@/config/copy/video'
import { useBodyScroll } from '@/composables/useBodyScroll'
import { useFocusTrap } from '@/composables/useFocusTrap'
import { useQualification } from '@/composables/useQualification'
import QualifyProgress from './QualifyProgress.vue'
import QualifyStep from './QualifyStep.vue'
import QualifyResult from './QualifyResult.vue'
import type { LeadMeta } from '@/types'

const props = defineProps<{
  open: boolean
  /** Métricas de la página (tiempo en /video, dispositivo) que viajan con las respuestas. */
  meta?: () => LeadMeta
}>()
const emit = defineEmits<{ close: [] }>()

const copy = videoCopy.qualify
const isOpen = toRef(props, 'open')
const sheet = ref<HTMLElement | null>(null)
const step = ref<InstanceType<typeof QualifyStep> | null>(null)

const {
  total,
  index,
  question,
  selected,
  direction,
  phase,
  locked,
  canGoBack,
  select,
  back,
  review,
  retry,
} = useQualification({ meta: () => props.meta?.() })

useBodyScroll(isOpen)
useFocusTrap(sheet, isOpen)

// Mientras se envía (o ya calificó y va a la agenda) no se puede cerrar: se perdería el resultado.
const canClose = computed(() => phase.value === 'questions' || phase.value === 'error')

function close() {
  if (canClose.value) emit('close')
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
    return
  }
  if (phase.value === 'questions' && step.value?.handleKey(event)) event.preventDefault()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="qualify">
      <div v-if="open" class="qualify" @click.self="close">
        <div
          ref="sheet"
          class="qualify__sheet"
          role="dialog"
          aria-modal="true"
          :aria-label="copy.dialogLabel"
          tabindex="-1"
          @keydown="onKeydown"
        >
          <header class="qualify__bar">
            <button
              type="button"
              class="qualify__nav"
              :class="{ 'qualify__nav--hidden': !canGoBack }"
              :disabled="!canGoBack"
              :aria-label="copy.back"
              @click="back"
            >
              <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
            </button>

            <QualifyProgress
              :current="index + 1"
              :total="total"
              :complete="phase !== 'questions'"
            />

            <button
              type="button"
              class="qualify__nav"
              :class="{ 'qualify__nav--hidden': !canClose }"
              :disabled="!canClose"
              :aria-label="copy.close"
              @click="close"
            >
              <i class="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
          </header>

          <div class="qualify__body">
            <Transition :name="`slide-${direction}`" mode="out-in">
              <QualifyStep
                v-if="phase === 'questions'"
                :key="question.key"
                ref="step"
                :question="question"
                :selected="selected"
                :locked="locked"
                @select="select"
                @back="back"
              />
              <QualifyResult v-else key="result" :phase="phase" @retry="retry" @review="review" />
            </Transition>
          </div>

          <p v-if="phase === 'questions'" class="qualify__keys">
            {{ copy.keyboardHint(question.options.length) }}
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.qualify {
  position: fixed;
  inset: 0;
  z-index: 300;
  @include flex(row, flex-end, center);
  background: rgba(#0e0c0a, 0.72);
  backdrop-filter: blur(4px);

  @include from('sm') {
    align-items: center;
    padding: 1rem;
  }

  // En móvil es una hoja inferior del alto de su contenido: las opciones quedan al alcance del pulgar.
  &__sheet {
    position: relative;
    @include flex(column, stretch, flex-start, 0);
    width: 100%;
    max-height: 92vh;
    max-height: 92dvh;
    background: $paper;
    border-radius: 22px 22px 0 0;
    padding: 1.2rem 1.1rem calc(1rem + env(safe-area-inset-bottom));
    box-shadow: $shadow-lg;
    outline: none;
    overflow: hidden;

    // El asa de la hoja: dice "esto sube desde abajo" sin ocupar espacio.
    &::before {
      content: '';
      position: absolute;
      top: 0.5rem;
      left: 50%;
      width: 2.25rem;
      height: 4px;
      margin-left: -1.125rem;
      border-radius: 2px;
      background: $line;
    }

    @include from('sm') {
      max-width: 440px;
      max-height: calc(100dvh - 2rem);
      border-radius: $radius-md;
      padding: 1rem 1.5rem 1.25rem;

      &::before {
        display: none;
      }
    }
  }

  &__bar {
    @include flex(row, center, space-between, 0.5rem);
    flex: none;
    margin-inline: -0.4rem;
  }

  &__nav {
    flex: none;
    @include flex(row, center, center);
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    font-size: 0.95rem;
    color: $ink-soft;
    transition:
      background-color 0.2s ease,
      opacity 0.2s ease;

    &:hover {
      background: $sand;
      color: $ink;
    }

    &--hidden {
      opacity: 0;
      pointer-events: none;
    }
  }

  &__body {
    @include flex(column, stretch, flex-start, 0);
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    // Aire para que el anillo de foco de las opciones no se corte contra el borde con scroll.
    margin-inline: -0.35rem;
    padding: 1rem 0.35rem 0.5rem;
    // La pregunta más larga marca el alto: la hoja no cambia de tamaño entre pasos.
    // En pantallas bajas cede y el cuerpo hace scroll.
    min-height: min(29.5rem, calc(92dvh - 6rem));

    @include from('sm') {
      min-height: min(30.5rem, calc(100dvh - 8rem));
    }
  }

  &__keys {
    display: none;
    flex: none;
    padding-top: 0.75rem;
    font-size: 0.72rem;
    text-align: center;
    color: $ink-muted;

    @media (hover: hover) and (pointer: fine) {
      display: block;
    }
  }
}

.qualify-enter-active,
.qualify-leave-active {
  transition: opacity 0.28s ease;

  .qualify__sheet {
    transition: transform 0.38s $ease;
  }
}

.qualify-leave-active {
  transition-duration: 0.2s;

  .qualify__sheet {
    transition-duration: 0.22s;
  }
}

.qualify-enter-from,
.qualify-leave-to {
  opacity: 0;

  .qualify__sheet {
    transform: translateY(100%);

    @include from('sm') {
      transform: translateY(14px) scale(0.98);
    }
  }
}

// Los pasos se deslizan en el sentido del avance; la salida es más corta que la entrada
// para que el cambio se sienta inmediato.
.slide-forward-enter-active,
.slide-back-enter-active {
  transition:
    opacity 0.22s ease,
    transform 0.26s $ease;
}

.slide-forward-leave-active,
.slide-back-leave-active {
  transition:
    opacity 0.11s ease,
    transform 0.11s ease-in;
}

.slide-forward-enter-from,
.slide-back-leave-to {
  opacity: 0;
  transform: translateX(26px);
}

.slide-forward-leave-to,
.slide-back-enter-from {
  opacity: 0;
  transform: translateX(-26px);
}
</style>
