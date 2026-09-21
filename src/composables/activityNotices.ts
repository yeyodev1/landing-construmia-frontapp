import type { RouteLocationRaw } from 'vue-router'
import { qualificationQuestions } from '@/config/qualification'
import { activityCopy, type ActivitySample, type ActivityTip } from '@/config/copy/shell'
import type { RecentActivity } from '@/types'

/**
 * Cómo se arma cada aviso de abajo a la izquierda. Funciones puras: el ritmo, las pausas
 * y la decisión real / ejemplo viven en useActivityFeed.
 */
export interface ActivityNotice {
  id: string
  kind: 'activity' | 'sample' | 'tip'
  eyebrow: string
  text: string
  time?: string
  /** Solo los avisos de ejemplo: la etiqueta visible "Ejemplo ilustrativo". */
  label?: string
  link?: { label: string; to: RouteLocationRaw }
}

const locationLabels = new Map(
  (qualificationQuestions.find((q) => q.key === 'location')?.options ?? []).map((o) => [
    o.value,
    o.label,
  ]),
)

function firstName(raw: string): string {
  const word = raw.trim().split(/\s+/)[0] ?? ''
  return word ? word.charAt(0).toLocaleUpperCase('es') + word.slice(1).toLocaleLowerCase('es') : ''
}

/** El API puede mandar el `value` del select o su etiqueta; "otra ciudad" no aporta y se omite. */
function placeName(raw: string | undefined): string {
  const value = (raw ?? '').trim()
  if (!value || /^otra/i.test(value)) return ''
  return locationLabels.get(value) ?? value
}

function sentence(name: string, place: string, action: string): string {
  return place ? `${name}, de ${place}, ${action}` : `${name} ${action}`
}

function minutesLabel(minutes: number): string {
  const t = activityCopy.time
  if (minutes < 5) return t.now
  if (minutes < 60) return t.minutes(minutes)
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return t.hours(hours)
  const days = Math.floor(hours / 24)
  return days === 1 ? t.yesterday : t.days(days)
}

export function relativeTime(iso: string, now = Date.now()): string {
  const diff = now - new Date(iso).getTime()
  if (!Number.isFinite(diff)) return ''
  return minutesLabel(Math.max(0, Math.floor(diff / 60000)))
}

export function realNotice(item: RecentActivity, key: number): ActivityNotice | null {
  const name = firstName(item.firstName ?? '')
  const action = activityCopy.actions[item.action]
  if (!name || !action) return null
  return {
    id: `activity-${key}`,
    kind: 'activity',
    eyebrow: activityCopy.eyebrowActivity,
    text: sentence(name, placeName(item.location), action),
    time: relativeTime(item.at),
  }
}

/**
 * El "hace X" de un ejemplo depende de su turno en la rotación (0, 1, 2...), no del reloj:
 * es estable y cada aviso parece un poco más antiguo que el anterior, como una lista de recientes.
 * 6 min, 17 min, 30 min, 47 min, 1 h, 1 h, 1 h, 2 h...
 */
function sampleMinutes(turn: number): number {
  return Math.round(6 + 9 * turn + 1.6 * turn * turn)
}

export function sampleNotice(sample: ActivitySample, turn: number): ActivityNotice {
  return {
    id: `sample-${turn}`,
    kind: 'sample',
    eyebrow: activityCopy.eyebrowActivity,
    label: activityCopy.sampleLabel,
    text: sentence(sample.firstName, placeName(sample.location), activityCopy.actions[sample.action]),
    time: minutesLabel(sampleMinutes(turn)),
  }
}

export function tipNotice(tip: ActivityTip, turn: number, fastTrackTo: RouteLocationRaw): ActivityNotice {
  return {
    id: `tip-${tip.id}-${turn}`,
    kind: 'tip',
    eyebrow: activityCopy.eyebrowTip,
    text: tip.text,
    link: tip.fastTrack ? { label: activityCopy.fastTrackLink, to: fastTrackTo } : undefined,
  }
}
