export type JudgeType = 'EXECUTION' | 'ARTISTIC'
export type CompetitionType = 'RUSSIA' | 'REGION'
export type AccuracyCategory = 'bullseye' | 'acceptable' | 'serious'


export interface Referee {
  id: number
  fio: string
  region: string
  city: string
}

export interface Performance {
  id: number
  region: string
  city: string
  competition_type: CompetitionType
  competition: string
  age_category: string
  discipline: string
}

export interface Assessment {
  id: number
  referee_id: number
  performance_id: number
  type: JudgeType
  number: number
  referee_assessment: number
  result_type_assessment: number
  result_assessment: number
}


export interface CompetitionListItem {
  id: string
  name: string
  type: CompetitionType
  execution_accuracy: number   
  artistic_accuracy: number
  performance_count: number
  avg_scrores: number
}



export interface CompetitionDetail extends CompetitionListItem {
  disciplines: string[]
  age_categories: string[]
  categories: CategoryStats[]
  judges: JudgeSummary[]
}

export interface CategoryStats {
  id: string
  discipline: string
  age_category: string
  execution_accuracy: number
  artistic_accuracy: number
  deviation_coefficient: number
  performance_count: number
}

export interface JudgeSummary {
  referee: Referee
  type: JudgeType
  avg_score: number
  accuracy_percent: number
  bias_coefficient: number
}


export interface HeatmapCell {
  referee_id: number
  referee_name: string
  region: string
  avg_deviation: number
  performance_count: number
}

export interface HeatmapData {
  judges: Pick<Referee, 'id' | 'fio'>[]
  regions: string[]
  cells: HeatmapCell[]
}

export interface JudgeListItem {
  id: number
  fio: string
  region: string
  city: string
  execution_accuracy: number
  artistic_accuracy: number
  bias_coefficient: number
}

export interface JudgeProfile {
  referee: Referee
  execution_accuracy: number
  artistic_accuracy: number
  bias_coefficient: number
  performances: JudgePerformanceRow[]
}

export interface JudgePerformanceRow {
  performance: Performance
  type: JudgeType
  my_score: number
  other_scores: number[]
  result_score: number
  deviation: number
  accuracy: AccuracyCategory
}
