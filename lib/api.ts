import type { JudgeListItem, JudgeProfile, CompetitionListItem } from './types'

const API = '/api'

export async function fetchJudges(search?: string): Promise<JudgeListItem[]> {
  const params = search ? `?search=${encodeURIComponent(search)}` : ''
  const res = await fetch(`${API}/referees${params}`)
  if (!res.ok) throw new Error('Ошибка загрузки судей')
  return res.json()
}

export async function fetchJudgeProfile(id: number): Promise<JudgeProfile> {
  const res = await fetch(`${API}/referees/${id}`)
  if (!res.ok) throw new Error('Судья не найден')
  return res.json()
}

export async function fetchCompetitions(search?: string): Promise<CompetitionListItem[]> {
  const params = search ? `?search=${encodeURIComponent(search)}` : ''
  const res = await fetch(`${API}/competitions${params}`)
  if (!res.ok) throw new Error('Ошибка загрузки соревнований')
  return res.json()
}

export interface CompetitionDetailResponse {
  id: string
  name: string
  type: string
  execution_accuracy: number
  artistic_accuracy: number
  performance_count: number
  avg_scrores: number
  total_assessments: number
  serious_count: number
  execution_bullseye: number
  execution_allowable: number
  execution_serious: number
  artistic_bullseye: number
  artistic_allowable: number
  artistic_serious: number
  disciplines: string[]
  age_categories: string[]
  categories: {
    id: string
    discipline: string
    age_category: string
    execution_accuracy: number
    artistic_accuracy: number
    deviation_coefficient: number
    performance_count: number
  }[]
  judges: {
    referee: { id: number; fio: string; region: string; city: string }
    avg_deviation: number
    assessment_count: number
    bias_coefficient: number
  }[]
}

export async function fetchCompetitionDetail(name: string): Promise<CompetitionDetailResponse> {
  const res = await fetch(`${API}/competitions/${encodeURIComponent(name)}`)
  if (!res.ok) throw new Error('Соревнование не найдено')
  return res.json()
}

export interface HeatmapResponse {
  judges: { id: number; fio: string }[]
  regions: string[]
  cells: {
    referee_id: number
    referee_name: string
    region: string
    avg_deviation: number
    performance_count: number
  }[]
}

export async function fetchCategoryHeatmap(
  competition: string, ageCategory: string, discipline: string
): Promise<HeatmapResponse> {
  const res = await fetch(
    `${API}/categories/${encodeURIComponent(competition)}/${encodeURIComponent(ageCategory)}/${encodeURIComponent(discipline)}`
  )
  if (!res.ok) throw new Error('Ошибка загрузки тепловой карты')
  return res.json()
}
