import { computed, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLeadStore } from '@/stores/lead'
import { useToastStore } from '@/stores/toast'
import { qualificationQuestions, type QualificationQuestion } from '@/config/qualification'
import { videoCopy } from '@/config/copy/video'
import type { ApiError, LeadMeta, QualificationAnswers } from '@/types'

export type QualifyPhase = 'questions' | 'reviewing' | 'success' | 'error'
type Answers = Partial<QualificationAnswers>

/** Pausa tras el toque: lo justo para ver la opción marcada antes de que entre la siguiente. */
const ADVANCE_MS = 250
/** "Revisando tu proyecto…" se sostiene un mínimo: un destello de 80 ms se lee como un error. */
const REVIEW_MIN_MS = 700
/** Cuánto se ve la pantalla de éxito antes de pasar a la agenda: lo justo para leerla. */
const SUCCESS_MS = 1200

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms))

/**
 * El cuestionario de cualificación: una pregunta por pantalla, avance automático,
 * respuestas parciales en sessionStorage (por lead) y el envío final con su reintento.
 * Las respuestas que ya dio en el registro (el tipo de proyecto) no se repiten.
 */
export function useQualification(options: { meta?: () => LeadMeta | undefined } = {}) {
  const router = useRouter()
  const leadStore = useLeadStore()
  const toast = useToastStore()

  const storageKey = `construmia_qualify_${leadStore.lead?.id ?? 'anon'}`

  // El tipo de proyecto se pregunta en el registro: si ya lo dio, no se le vuelve a preguntar
  // y el cuestionario queda en 4 pasos. El PUT igual lleva las 5 respuestas (el backend las exige).
  const known = knownAnswers()
  const questions = qualificationQuestions.filter((q) => !known[q.key])
  const total = questions.length

  const answers = ref<Answers>(restore())
  const index = ref(firstUnanswered())
  const direction = ref<'forward' | 'back'>('forward')
  const phase = ref<QualifyPhase>('questions')
  /** Bloquea toques durante la pausa de avance: un doble toque no salta dos preguntas. */
  const locked = ref(false)
  let alive = true

  // El índice siempre cae dentro del arreglo; el respaldo solo le da a TypeScript un tipo sin undefined.
  const question = computed<QualificationQuestion>(() => questions[index.value] ?? questions[0]!)
  const selected = computed(() => answers.value[question.value.key] ?? null)
  const canGoBack = computed(() => phase.value === 'questions' && index.value > 0 && !locked.value)

  /** Respuestas que ya vienen del registro, solo si siguen siendo una opción válida. */
  function knownAnswers(): Answers {
    const out: Answers = {}
    const projectType = leadStore.lead?.projectType
    const typeQuestion = qualificationQuestions.find((q) => q.key === 'projectType')
    if (projectType && typeQuestion?.options.some((option) => option.value === projectType))
      out.projectType = projectType
    return out
  }

  function restore(): Answers {
    try {
      const raw = sessionStorage.getItem(storageKey)
      const saved = raw ? (JSON.parse(raw) as Answers) : {}
      // Solo sobreviven valores que sigan existiendo en la configuración.
      const clean: Answers = {}
      for (const q of questions) {
        const value = saved[q.key]
        if (value && q.options.some((option) => option.value === value)) clean[q.key] = value
      }
      return { ...clean, ...known }
    } catch {
      return { ...known }
    }
  }

  function persist() {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(answers.value))
    } catch {
      // Sin sessionStorage las respuestas viven solo en memoria: el flujo sigue igual.
    }
  }

  function firstUnanswered(): number {
    const pending = questions.findIndex((q) => !answers.value[q.key])
    return pending === -1 ? total - 1 : pending
  }

  async function select(value: string) {
    if (locked.value || phase.value !== 'questions') return
    if (!question.value.options.some((option) => option.value === value)) return

    answers.value = { ...answers.value, [question.value.key]: value }
    persist()
    locked.value = true
    await wait(ADVANCE_MS)
    if (!alive) return
    locked.value = false

    if (index.value < total - 1) {
      direction.value = 'forward'
      index.value += 1
    } else {
      await submit()
    }
  }

  function back() {
    if (!canGoBack.value) return
    direction.value = 'back'
    index.value -= 1
  }

  /** Desde la pantalla de error se puede volver a las preguntas sin perder nada. */
  function review() {
    direction.value = 'back'
    phase.value = 'questions'
  }

  async function submit() {
    // Lo que venga del registro manda: una respuesta vieja guardada en la sesión no lo pisa.
    answers.value = { ...answers.value, ...known }
    const missing = questions.findIndex((q) => !answers.value[q.key])
    if (missing !== -1) {
      direction.value = 'back'
      index.value = missing
      phase.value = 'questions'
      return
    }

    phase.value = 'reviewing'
    try {
      await Promise.all([
        leadStore.qualify(answers.value as QualificationAnswers, options.meta?.()),
        wait(REVIEW_MIN_MS),
      ])
      try {
        sessionStorage.removeItem(storageKey)
      } catch {
        // nada que limpiar
      }
      if (!alive) return

      if (leadStore.isQualified) {
        phase.value = 'success'
        await wait(SUCCESS_MS)
        if (alive) router.push({ name: 'Schedule' })
      } else {
        router.push({ name: 'Thanks' })
      }
    } catch (error) {
      if (!alive) return
      phase.value = 'error'
      toast.error((error as ApiError)?.message || videoCopy.qualify.errorFallback)
    }
  }

  onBeforeUnmount(() => (alive = false))

  return {
    questions,
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
    retry: submit,
  }
}
