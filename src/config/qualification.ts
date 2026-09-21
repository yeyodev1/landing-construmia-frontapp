/**
 * Opciones cerradas del embudo. Los `value` son contrato con el backapp
 * (`src/config/leadOptions.ts`): si cambia uno acá, cambia allá.
 */
export interface Option {
  value: string
  label: string
  icon?: string
  hint?: string
}

export const startTimeframes: Option[] = [
  { value: 'inmediato', label: 'Lo antes posible (menos de 1 mes)' },
  { value: '1-3-meses', label: 'En 1 a 3 meses' },
  { value: '3-6-meses', label: 'En 3 a 6 meses' },
  { value: 'mas-6-meses', label: 'En más de 6 meses' },
  { value: 'explorando', label: 'Solo estoy explorando' },
]

export interface QualificationQuestion {
  key: 'projectType' | 'budget' | 'propertyStatus' | 'location' | 'decisionMaker'
  title: string
  help: string
  options: Option[]
}

/** Máximo 5 preguntas, una por pantalla, todas de un solo toque. */
export const qualificationQuestions: QualificationQuestion[] = [
  {
    key: 'projectType',
    title: '¿Qué quieres transformar?',
    help: 'Elige lo que más se parece a tu proyecto.',
    options: [
      { value: 'remodelacion-integral', label: 'Remodelación integral', hint: 'Varios espacios de la casa a la vez', icon: 'fa-solid fa-house-chimney' },
      { value: 'ampliacion', label: 'Ampliación o segundo piso', hint: 'Crecer sobre lo que ya existe', icon: 'fa-solid fa-layer-group' },
      { value: 'casa-antigua', label: 'Casa antigua', hint: 'Reestructurarla por completo', icon: 'fa-solid fa-hammer' },
      { value: 'construccion-nueva', label: 'Construcción desde cero', hint: 'Terreno listo o por comprar', icon: 'fa-solid fa-compass-drafting' },
      { value: 'un-ambiente', label: 'Un solo ambiente', hint: 'Una cocina, un baño, un cuarto', icon: 'fa-solid fa-couch' },
    ],
  },
  {
    key: 'budget',
    title: '¿Con qué inversión cuentas?',
    help: 'No es para limitarte: con este dato te recomendamos lo que sí puedes ejecutar.',
    options: [
      { value: 'menos-15k', label: 'Menos de $15.000' },
      { value: '15k-30k', label: '$15.000 a $30.000' },
      { value: '30k-60k', label: '$30.000 a $60.000' },
      { value: '60k-100k', label: '$60.000 a $100.000' },
      { value: 'mas-100k', label: 'Más de $100.000' },
    ],
  },
  {
    key: 'propertyStatus',
    title: '¿De quién es la propiedad?',
    help: 'Nos ayuda a saber si hay permisos o trámites legales que prever.',
    options: [
      { value: 'propia', label: 'Es mi propiedad', icon: 'fa-solid fa-key' },
      { value: 'en-compra', label: 'La estoy comprando', icon: 'fa-solid fa-file-signature' },
      { value: 'familiar', label: 'Es de mi familia', icon: 'fa-solid fa-people-roof' },
      { value: 'alquilada', label: 'Es alquilada', icon: 'fa-solid fa-building' },
    ],
  },
  {
    key: 'location',
    title: '¿Dónde está el proyecto?',
    help: 'Para coordinar la visita técnica.',
    options: [
      { value: 'guayaquil', label: 'Guayaquil' },
      { value: 'samborondon', label: 'Samborondón' },
      { value: 'via-a-la-costa', label: 'Vía a la Costa' },
      { value: 'daule-aurora', label: 'Daule / La Aurora' },
      { value: 'salinas-peninsula', label: 'Salinas / Península' },
      { value: 'otra', label: 'Otra ciudad' },
    ],
  },
  {
    key: 'decisionMaker',
    title: '¿Quién toma la decisión?',
    help: 'Así invitamos a la visita a quien tiene que estar.',
    options: [
      { value: 'yo', label: 'Yo decido', icon: 'fa-solid fa-user' },
      { value: 'pareja', label: 'Con mi pareja', icon: 'fa-solid fa-user-group' },
      { value: 'familia-socios', label: 'Entre familia o socios', icon: 'fa-solid fa-users' },
    ],
  },
]
