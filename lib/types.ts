export interface ShapExplanation {
  feature: string
  value: any
  importance: number
}

export interface QuestionnaireData {
  // 1. Profil du Patient
  patient_id?: string
  age_years: number
  age_months: number
  gender: "M" | "F"
  poids: number

  // Brancchements Conditionnels Child (< 5 ans)
  incapable_boire_teter?: boolean
  vomit_tout?: boolean
  perimetre_brachial_muac?: number

  // Brancchements Conditionnels Pregnancy (F > 13 ans)
  enceinte?: boolean
  trimestre?: 1 | 2 | 3
  derniere_date_regles?: string

  // 2. Données de Localisation
  region: string
  district: string
  commune: string
  gps_latitude?: number
  gps_longitude?: number
  usage_moustiquaire?: boolean

  // 3. Signes Vitaux
  temperature_c: number
  spo2_pct: number
  fc_bpm: number
  fr_pm: number
  pa_systolique: number
  pa_diastolique: number

  // Brancchements Conditionnels Fever
  duree_fievre_jours?: number
  fievre_cyclique?: boolean

  // 4. Symptômes Rapportés (0/1 binary for XGBoost)
  fievre: boolean
  cephalees: boolean
  troubles_conscience: boolean
  nausees_vomissements: boolean
  fatigue: boolean // Prostration included
  douleurs_articulaires: boolean
  frissons: boolean
  diarhee: boolean
  convulsions: boolean

  // 5. Champs d'Alliance (Portal Agent)
  tdr_paludisme?: "positif" | "négatif" | "inconcluant"
  resultat_palu?: boolean
  parasitemia_pct?: number

  // 6. Métadonnées de Session
  robot_id: string
  health_center: string
  nurse_name: string
  source_type: "kiosque"
  data_quality_status: "en revue" | "validé" | "rejeté"
}

export interface ResultData {
  score: number
  riskLevel: "Faible" | "Modéré" | "Élevé" | "Très Élevé"
  riskColor: string
  recommendation: string[]
  orientation: string
  explanations: ShapExplanation[]
}

export interface Question {
  id: number
  field: string
  question: string
  icon: string
  type: "radio" | "number" | "checkbox" | "select" | "text" | "geolocation" | "synced-select" | "date"
  required: boolean
  helpText?: string
  placeholder?: string
  options?: Array<{ label: string; value: any }>
  checkboxes?: Array<{ label: string; field: string }>
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
  dependsOn?: string // For synced selects
  visibleIf?: (data: Partial<QuestionnaireData>) => boolean
  suggestions?: Array<{ label: string; value: any }>
}
