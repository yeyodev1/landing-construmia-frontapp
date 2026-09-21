<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import LeadForm from '@/components/lead/LeadForm.vue'
import ProjectTypePicker from '@/components/lead/ProjectTypePicker.vue'
import ProjectTypeChosen from '@/components/lead/ProjectTypeChosen.vue'
import LeadModalBar from '@/components/lead/LeadModalBar.vue'
import { useLeadModal } from '@/composables/useLeadModal'
import { useBodyScroll } from '@/composables/useBodyScroll'
import { useFocusTrap } from '@/composables/useFocusTrap'
import { leadModal as copy, projectTypeQuestion } from '@/config/copy/landing'

/**
 * Registro en dos pasos: primero el tipo de proyecto (un toque, el dato que más filtra),
 * después los datos de contacto. En móvil es una hoja inferior; en desktop, un diálogo pequeño.
 */
const ADVANCE_MS = 250

const { isOpen, source, close } = useLeadModal()

const sheet = ref<HTMLElement | null>(null)
const heading = ref<HTMLElement | null>(null)
const step = ref<1 | 2>(1)
const direction = ref<'forward' | 'back'>('forward')
const projectType = ref('')
const advancing = ref(false)
let timer: number | undefined

const chosen = computed(() =>
  projectTypeQuestion.options.find((option) => option.value === projectType.value),
)

useBodyScroll(isOpen)
useFocusTrap(sheet, isOpen)

// Cada apertura arranca en el paso 1, con lo que ya eligió marcado.
watch(isOpen, (open) => {
  if (!open) return
  window.clearTimeout(timer)
  advancing.value = false
  direction.value = 'forward'
  step.value = 1
})

function select(value: string) {
  if (advancing.value) return
  projectType.value = value
  advancing.value = true
  // Una pausa corta para que se vea la marca antes de avanzar.
  timer = window.setTimeout(() => {
    advancing.value = false
    direction.value = 'forward'
    step.value = 2
  }, ADVANCE_MS)
}

function change() {
  direction.value = 'back'
  step.value = 1
}

// En el paso 2 el foco va al título, no a un campo: en móvil no se abre el teclado de golpe.
async function onStepEntered() {
  if (step.value !== 2) return
  await nextTick()
  heading.value?.focus({ preventScroll: true })
}

function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape') return
  event.preventDefault()
  close()
}

// Al registrarse la home se desmonta: el diálogo no puede quedar abierto para la próxima visita.
onBeforeUnmount(() => {
  window.clearTimeout(timer)
  close()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="lead-modal">
      <div v-if="isOpen" class="lead-modal" @click.self="close">
        <div
          ref="sheet"
          class="lead-modal__sheet"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lead-modal-title"
          tabindex="-1"
          @keydown="onKeydown"
        >

          <LeadModalBar :step="step" :total="2" @back="change" @close="close" />

          <div class="lead-modal__body">
            <Transition :name="`lead-step-${direction}`" mode="out-in" @after-enter="onStepEntered">
              <section v-if="step === 1" key="type" class="lead-modal__step">
                <p class="lead-modal__eyebrow">{{ copy.intro[source] }}</p>
                <h2 id="lead-modal-title" class="lead-modal__title">{{ copy.typeTitle }}</h2>
                <p id="lead-modal-help" class="lead-modal__help">{{ copy.typeHelp }}</p>
                <ProjectTypePicker
                  class="lead-modal__picker"
                  :options="projectTypeQuestion.options"
                  :selected="projectType"
                  labelledby="lead-modal-title"
                  describedby="lead-modal-help"
                  @select="select"
                />
              </section>

              <section v-else key="details" class="lead-modal__step">
                <h2 id="lead-modal-title" ref="heading" class="lead-modal__title" tabindex="-1">
                  {{ copy.details.title }}
                </h2>
                <p class="lead-modal__help">{{ copy.details.lead }}</p>
                <ProjectTypeChosen v-if="chosen" :option="chosen" @change="change" />
                <LeadForm bare :project-type="projectType" />
              </section>
            </Transition>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.lead-modal {
  position: fixed;
  inset: 0;
  z-index: 300;
  @include flex(row, flex-end, center);
  background: rgba(#0e0c0a, 0.7);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);

  @include from('sm') {
    align-items: center;
    padding: 1rem;
  }

  // Móvil: hoja inferior con asa; desde sm, diálogo pequeño y centrado.
  &__sheet {
    position: relative;
    @include flex(column, stretch, flex-start, 0);
    width: 100%;
    max-height: 94dvh;
    background: $paper;
    border-radius: 22px 22px 0 0;
    padding: 1.1rem 1.15rem calc(1.1rem + env(safe-area-inset-bottom));
    box-shadow: 0 -20px 60px rgba(#000, 0.35);
    outline: none;
    overflow: hidden;

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
      max-width: 460px;
      max-height: calc(100dvh - 2rem);
      border-radius: $radius-md;
      padding: 1rem 1.6rem 1.5rem;
      box-shadow: 0 40px 100px rgba(#000, 0.45);

      &::before {
        display: none;
      }
    }
  }

  &__body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    // Aire para que el anillo de foco no se corte contra el borde del scroll.
    margin-inline: -0.35rem;
    padding: 0.9rem 0.35rem 0.25rem;
  }

  &__step {
    @include flex(column, stretch, flex-start, 0);
  }

  &__eyebrow {
    @include eyebrow;
    letter-spacing: 0.14em;
    line-height: 1.5;
    margin-bottom: 0.55rem;
  }

  &__title {
    @include display($text-xl, 500);
    color: $ink;
    outline: none;
  }

  &__help {
    margin-top: 0.4rem;
    font-size: $text-sm;
    line-height: 1.5;
    color: $ink-soft;
  }

  &__picker {
    margin-top: 1.15rem;
  }
}

.lead-modal-enter-active,
.lead-modal-leave-active {
  transition: opacity 0.3s ease;

  .lead-modal__sheet {
    transition: transform 0.4s $ease, opacity 0.3s ease;
  }
}

.lead-modal-leave-active {
  transition-duration: 0.2s;

  .lead-modal__sheet {
    transition-duration: 0.22s;
  }
}

.lead-modal-enter-from,
.lead-modal-leave-to {
  opacity: 0;

  .lead-modal__sheet {
    transform: translateY(100%);

    @include from('sm') {
      opacity: 0;
      transform: translateY(18px) scale(0.97);
    }
  }
}

.lead-step-forward-enter-active,
.lead-step-back-enter-active {
  transition: opacity 0.22s ease, transform 0.26s $ease;
}

.lead-step-forward-leave-active,
.lead-step-back-leave-active {
  transition: opacity 0.12s ease, transform 0.12s ease-in;
}

.lead-step-forward-enter-from,
.lead-step-back-leave-to {
  opacity: 0;
  transform: translateX(24px);
}

.lead-step-forward-leave-to,
.lead-step-back-enter-from {
  opacity: 0;
  transform: translateX(-24px);
}
</style>
