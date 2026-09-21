import { defineStore } from 'pinia'
import { leadService } from '@/services/lead.service'
import type { Lead, LeadContactPayload, QualificationAnswers } from '@/types'

const STORAGE_KEY = 'construmia_lead'

function load(): Lead | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Lead) : null
  } catch {
    return null
  }
}

/**
 * El lead vive en localStorage: el embudo son varias páginas y la persona puede
 * recargar o volver después sin tener que registrarse otra vez.
 */
export const useLeadStore = defineStore('lead', {
  state: () => ({ lead: load() as Lead | null }),

  getters: {
    isRegistered: (state) => !!state.lead,
    isQualified: (state) => state.lead?.qualified === true,
    hasPaid: (state) => state.lead?.paid === true,
    /** Agenda desbloqueada: calificó o pagó la visita (vía rápida). */
    canSchedule: (state) => state.lead?.qualified === true || state.lead?.paid === true,
  },

  actions: {
    set(lead: Lead | null) {
      this.lead = lead
      if (lead) localStorage.setItem(STORAGE_KEY, JSON.stringify(lead))
      else localStorage.removeItem(STORAGE_KEY)
    },

    async register(payload: LeadContactPayload) {
      this.set(await leadService.create(payload))
    },

    async qualify(answers: QualificationAnswers) {
      if (!this.lead) throw { status: 400, message: 'Primero completa tu registro' }
      this.set(await leadService.qualify(this.lead.id, answers))
    },

    /** Vuelve a leer el lead del API (por ejemplo tras confirmar un pago). */
    async refresh() {
      if (!this.lead) return
      try {
        this.set(await leadService.find(this.lead.id))
      } catch {
        // Si el API no responde se conserva lo guardado: no se bota a la persona del embudo.
      }
    },
  },
})
