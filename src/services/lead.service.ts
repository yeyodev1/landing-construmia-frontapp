import APIBase from './httpBase'
import type { Lead, LeadContactPayload, QualificationAnswers, RecentActivity } from '@/types'

class LeadService extends APIBase {
  /** Paso 1: crea (o actualiza, si el correo ya existe) el contacto. */
  async create(payload: LeadContactPayload): Promise<Lead> {
    const { data } = await this.post<{ lead: Lead }>('leads', payload)
    return data.lead
  }

  /** Paso 2: guarda la cualificación y devuelve si el proyecto califica. */
  async qualify(id: string, answers: QualificationAnswers): Promise<Lead> {
    const { data } = await this.put<{ lead: Lead }>(`leads/${id}/qualification`, answers)
    return data.lead
  }

  async find(id: string): Promise<Lead> {
    const { data } = await this.get<{ lead: Lead }>(`leads/${id}`)
    return data.lead
  }

  async recent(): Promise<RecentActivity[]> {
    const { data } = await this.get<{ items: RecentActivity[] }>('leads/recent')
    return data.items
  }
}

export const leadService = new LeadService()
