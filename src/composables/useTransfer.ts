import { computed, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { paymentService } from '@/services/payment.service'
import { useLeadStore } from '@/stores/lead'
import { transferCopy } from '@/config/copy/checkout'
import type { ApiError } from '@/types'

export const RECEIPT_MAX_BYTES = 10 * 1024 * 1024
export const RECEIPT_ACCEPT = 'image/*,application/pdf'

function isPdfFile(file: File): boolean {
  return file.type === 'application/pdf' || /\.pdf$/i.test(file.name)
}

/** Devuelve el mensaje de error del comprobante, o '' si sirve. */
export function validateReceipt(file: File): string {
  // Algunos teléfonos entregan fotos HEIC sin `type`: se acepta por extensión.
  const isImage = file.type.startsWith('image/') || /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name)
  if (!isImage && !isPdfFile(file)) return transferCopy.errors.type
  if (file.size > RECEIPT_MAX_BYTES) return transferCopy.errors.size
  return ''
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Copia al portapapeles; en contextos sin Clipboard API (http en la red local) usa el método viejo. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Permiso denegado: se intenta el respaldo.
  }

  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', '')
  area.style.position = 'fixed'
  area.style.opacity = '0'
  document.body.appendChild(area)
  area.select()
  let copied = false
  try {
    copied = document.execCommand('copy')
  } catch {
    copied = false
  }
  area.remove()
  return copied
}

/** Formulario de reporte de transferencia: banco + comprobante → API → /gracias. */
export function useTransfer() {
  const router = useRouter()
  const leadStore = useLeadStore()

  const bank = ref('')
  const file = ref<File | null>(null)
  const previewUrl = ref('')
  const bankError = ref('')
  const fileError = ref('')
  const submitError = ref('')
  const submitting = ref(false)

  const isPdf = computed(() => (file.value ? isPdfFile(file.value) : false))

  function revokePreview() {
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = ''
  }

  function selectBank(name: string) {
    bank.value = name
    bankError.value = ''
  }

  function selectFile(next: File) {
    submitError.value = ''
    const problem = validateReceipt(next)
    if (problem) {
      // Un archivo inválido no reemplaza a uno válido que ya estaba elegido.
      fileError.value = problem
      return
    }
    revokePreview()
    file.value = next
    fileError.value = ''
    // HEIC no se puede pintar en todos los navegadores; el componente cae al nombre del archivo.
    if (!isPdfFile(next)) previewUrl.value = URL.createObjectURL(next)
  }

  function clearFile() {
    revokePreview()
    file.value = null
    fileError.value = ''
  }

  async function submit() {
    if (submitting.value) return
    submitError.value = ''
    bankError.value = bank.value ? '' : transferCopy.errors.bank
    if (!file.value) fileError.value = transferCopy.errors.file
    if (bankError.value || !file.value) return

    const leadId = leadStore.lead?.id
    if (!leadId) {
      submitError.value = transferCopy.errors.noLead
      return
    }

    submitting.value = true
    try {
      leadStore.set(await paymentService.reportTransfer(leadId, bank.value, file.value))
      await router.push({ name: 'Thanks', query: { motivo: 'transferencia' } })
    } catch (error) {
      submitError.value = (error as ApiError).message || transferCopy.errors.fallback
    } finally {
      submitting.value = false
    }
  }

  onBeforeUnmount(revokePreview)

  return {
    bank,
    file,
    previewUrl,
    isPdf,
    bankError,
    fileError,
    submitError,
    submitting,
    selectBank,
    selectFile,
    clearFile,
    submit,
  }
}
