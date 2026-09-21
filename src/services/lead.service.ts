import APIBase from './httpBase'
import type { Lead, LeadContactPayload, LeadMeta, QualificationAnswers, RecentActivity } from '@/types'

class LeadService extends APIBase {
  /** Paso 1: crea (o actualiza, si el correo ya existe) el contacto. */
  async create(payload: LeadContactPayload): Promise<Lead> {
    const { data } = await this.post<{ lead: Lead }>('leads', payload)
    return data.lead
  }

  /** Paso 2: guarda la cualificación y devuelve si el proyecto califica. */
  async qualify(id: string, answers: QualificationAnswers, meta?: LeadMeta): Promise<Lead> {
    const { data } = await this.put<{ lead: Lead }>(`leads/${id}/qualification`, { ...answers, meta })
    return data.lead
  }

  async find(id: string): Promise<Lead> {
    const { data } = await this.get<{ lead: Lead }>(`leads/${id}`)
    return data.lead
  }

  async recent(): Promise<{ items: RecentActivity[]; total: number }> {
    const { data } = await this.get<{ items: RecentActivity[]; total: number }>('leads/recent')
    return data
  }
}

export const leadService = new LeadService()
