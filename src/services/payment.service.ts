import APIBase from './httpBase'
import type { Lead, PaymentBoxConfig, PaymentConfirmation } from '@/types'

class PaymentService extends APIBase {
  /** Crea la orden de la visita técnica; el monto lo decide el servidor. */
  async create(leadId: string): Promise<PaymentBoxConfig> {
    const { data } = await this.post<PaymentBoxConfig>('payments', { leadId })
    return data
  }

  /** Payphone reversa el cobro si no se confirma en 5 minutos: llamar apenas carga la página. */
  async confirm(id: string, clientTransactionId: string): Promise<PaymentConfirmation> {
    const { data } = await this.post<PaymentConfirmation>('payments/confirm', {
      id,
      clientTransactionId,
    })
    return data
  }

  /** Transferencia bancaria: sube el comprobante y queda pendiente de validación manual. */
  async reportTransfer(leadId: string, bank: string, receipt: File): Promise<Lead> {
    const form = new FormData()
    form.append('leadId', leadId)
    form.append('bank', bank)
    form.append('receipt', receipt)
    const { data } = await this.post<{ lead: Lead }>('payments/transfer', form, undefined, {
      timeout: 60000,
    })
    return data.lead
  }
}

export const paymentService = new PaymentService()
