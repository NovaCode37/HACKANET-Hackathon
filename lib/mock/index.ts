import type { CompetitionListItem, CompetitionDetail, JudgeListItem, HeatmapData, JudgeProfile } from '../types'

export const mockCompetitions: CompetitionListItem[] = [
  {
    id: '1',
    name: 'Чемпионат России по спортивной аэробике 2024',
    type: 'RUSSIA',
    execution_accuracy: 87.5,
    artistic_accuracy: 91.2,
    performance_count: 48,
    avg_scrores: 8.4
  },
  {
    id: '2',
    name: 'Первенство России среди юниоров 2024',
    type: 'RUSSIA',
    execution_accuracy: 79.4,
    artistic_accuracy: 83.1,
    performance_count: 36,
    avg_scrores: 8.4
  },
  {
    id: '3',
    name: 'Кубок Москвы по аэробике 2024',
    type: 'REGION',
    execution_accuracy: 72.3,
    artistic_accuracy: 68.9,
    performance_count: 32,
    avg_scrores: 8.4
  },
  {
    id: '4',
    name: 'Чемпионат Московской области 2024',
    type: 'REGION',
    execution_accuracy: 65.0,
    artistic_accuracy: 70.8,
    performance_count: 24,
    avg_scrores: 8.4
  },
  {
    id: '5',
    name: 'Кубок Санкт-Петербурга по аэробике',
    type: 'REGION',
    execution_accuracy: 88.9,
    artistic_accuracy: 85.6,
    performance_count: 28,
    avg_scrores: 8.4
  },
  {
    id: '6',
    name: 'Первенство Центрального федерального округа',
    type: 'REGION',
    execution_accuracy: 55.3,
    artistic_accuracy: 61.4,
    performance_count: 40,
    avg_scrores: 8.4
  },
  {
    id: '7',
    name: 'Открытый кубок Краснодарского края 2024',
    type: 'REGION',
    execution_accuracy: 93.1,
    artistic_accuracy: 90.0,
    performance_count: 20,
    avg_scrores: 8.4
  },
  {
    id: '8',
    name: 'Чемпионат Сибирского федерального округа',
    type: 'REGION',
    execution_accuracy: 48.7,
    artistic_accuracy: 52.2,
    performance_count: 30,
    avg_scrores: 8.4
  },
]

export const mockHeatmapData: HeatmapData = {
  judges: [
    { id: 1, fio: 'Иванова Мария Сергеевна' },
    { id: 2, fio: 'Петров Алексей Владимирович' },
    { id: 3, fio: 'Сидорова Елена Ивановна' },
    { id: 4, fio: 'Козлов Дмитрий Петрович' },
  ],
  regions: ['Москва', 'Санкт-Петербург', 'Краснодар', 'Новосибирск'],
  cells: [
    { referee_id: 1, referee_name: 'Иванова Мария Сергеевна', region: 'Москва',          avg_deviation: 0.05, performance_count: 4 },
    { referee_id: 1, referee_name: 'Иванова Мария Сергеевна', region: 'Санкт-Петербург', avg_deviation: 0.32, performance_count: 3 },
    { referee_id: 1, referee_name: 'Иванова Мария Сергеевна', region: 'Краснодар',       avg_deviation: 0.41, performance_count: 2 },
    { referee_id: 1, referee_name: 'Иванова Мария Сергеевна', region: 'Новосибирск',     avg_deviation: 0.55, performance_count: 3 },
    { referee_id: 2, referee_name: 'Петров Алексей Владимирович', region: 'Москва',          avg_deviation: 0.28, performance_count: 4 },
    { referee_id: 2, referee_name: 'Петров Алексей Владимирович', region: 'Санкт-Петербург', avg_deviation: 0.08, performance_count: 3 },
    { referee_id: 2, referee_name: 'Петров Алексей Владимирович', region: 'Краснодар',       avg_deviation: 0.35, performance_count: 2 },
    { referee_id: 2, referee_name: 'Петров Алексей Владимирович', region: 'Новосибирск',     avg_deviation: 0.62, performance_count: 3 },
    { referee_id: 3, referee_name: 'Сидорова Елена Ивановна', region: 'Москва',          avg_deviation: 0.45, performance_count: 4 },
    { referee_id: 3, referee_name: 'Сидорова Елена Ивановна', region: 'Санкт-Петербург', avg_deviation: 0.38, performance_count: 3 },
    { referee_id: 3, referee_name: 'Сидорова Елена Ивановна', region: 'Краснодар',       avg_deviation: 0.06, performance_count: 2 },
    { referee_id: 3, referee_name: 'Сидорова Елена Ивановна', region: 'Новосибирск',     avg_deviation: 0.29, performance_count: 3 },
    { referee_id: 4, referee_name: 'Козлов Дмитрий Петрович', region: 'Москва',          avg_deviation: 0.12, performance_count: 4 },
    { referee_id: 4, referee_name: 'Козлов Дмитрий Петрович', region: 'Санкт-Петербург', avg_deviation: 0.51, performance_count: 3 },
    { referee_id: 4, referee_name: 'Козлов Дмитрий Петрович', region: 'Краснодар',       avg_deviation: 0.44, performance_count: 2 },
    { referee_id: 4, referee_name: 'Козлов Дмитрий Петрович', region: 'Новосибирск',     avg_deviation: 0.18, performance_count: 3 },
  ],
}

export const mockCompetitionDetail: CompetitionDetail = {
  ...mockCompetitions[0],
  disciplines: ['Индивидуальные женщины', 'Индивидуальные мужчины', 'Смешанные пары', 'Трио', 'Группа'],
  age_categories: ['Юниоры 12-14', 'Юниоры 15-17', 'Взрослые 18+'],
  categories: [
    {
      id: 'c1',
      discipline: 'Индивидуальные женщины',
      age_category: 'Взрослые 18+',
      execution_accuracy: 90.0,
      artistic_accuracy: 93.3,
      deviation_coefficient: 1.12,
      performance_count: 12,
    },
    {
      id: 'c2',
      discipline: 'Индивидуальные мужчины',
      age_category: 'Взрослые 18+',
      execution_accuracy: 83.3,
      artistic_accuracy: 88.9,
      deviation_coefficient: 1.34,
      performance_count: 9,
    },
    {
      id: 'c3',
      discipline: 'Смешанные пары',
      age_category: 'Юниоры 15-17',
      execution_accuracy: 87.5,
      artistic_accuracy: 91.7,
      deviation_coefficient: 1.08,
      performance_count: 8,
    },
  ],
  judges: [],
}

export const mockJudgeProfile: JudgeProfile = {
  referee: { id: 1, fio: 'Иванова Мария Сергеевна', region: 'Москва', city: 'Москва' },
  execution_accuracy: 91.2,
  artistic_accuracy: 78.4,
  bias_coefficient: 0.12,
  performances: [
    {
      performance: { id: 101, region: 'Москва', city: 'Москва', competition_type: 'RUSSIA', competition: 'Чемпионат России 2024', age_category: 'Взрослые 18+', discipline: 'Индивидуальные женщины' },
      type: 'EXECUTION',
      my_score: 8.5,
      other_scores: [8.4, 8.6, 8.5],
      result_score: 8.5,
      deviation: 0,
      accuracy: 'bullseye',
    },
    {
      performance: { id: 102, region: 'Санкт-Петербург', city: 'Санкт-Петербург', competition_type: 'RUSSIA', competition: 'Чемпионат России 2024', age_category: 'Взрослые 18+', discipline: 'Индивидуальные мужчины' },
      type: 'EXECUTION',
      my_score: 7.8,
      other_scores: [8.1, 8.0, 8.2],
      result_score: 8.05,
      deviation: 0.25,
      accuracy: 'allowable',
    },
    {
      performance: { id: 103, region: 'Краснодар', city: 'Краснодар', competition_type: 'REGION', competition: 'Кубок Краснодара', age_category: 'Юниоры 15-17', discipline: 'Смешанные пары' },
      type: 'EXECUTION',
      my_score: 7.2,
      other_scores: [7.8, 7.7, 7.9],
      result_score: 7.8,
      deviation: 0.6,
      accuracy: 'serious',
    },
    {
      performance: { id: 104, region: 'Москва', city: 'Москва', competition_type: 'RUSSIA', competition: 'Первенство юниоров', age_category: 'Юниоры 12-14', discipline: 'Группа' },
      type: 'ARTISTIC',
      my_score: 9.1,
      other_scores: [9.0, 9.2, 9.1],
      result_score: 9.1,
      deviation: 0,
      accuracy: 'bullseye',
    },
    {
      performance: { id: 105, region: 'Новосибирск', city: 'Новосибирск', competition_type: 'REGION', competition: 'Чемпионат СФО', age_category: 'Взрослые 18+', discipline: 'Трио' },
      type: 'ARTISTIC',
      my_score: 6.5,
      other_scores: [7.2, 7.1, 7.3],
      result_score: 7.2,
      deviation: 0.7,
      accuracy: 'serious',
    },
  ],
}

export const mockJudges: JudgeListItem[] = [
  { id: 1, fio: 'Иванова Мария Сергеевна',    region: 'Москва',          city: 'Москва',          execution_accuracy: 91.2, artistic_accuracy: 0,    bias_coefficient: 0.12  },
  { id: 2, fio: 'Петров Алексей Владимирович', region: 'Санкт-Петербург', city: 'Санкт-Петербург', execution_accuracy: 78.4, artistic_accuracy: 0,    bias_coefficient: -0.05 },
  { id: 3, fio: 'Сидорова Елена Ивановна',     region: 'Краснодар',       city: 'Краснодар',       execution_accuracy: 0,    artistic_accuracy: 85.6, bias_coefficient: 0.31  },
  { id: 4, fio: 'Козлов Дмитрий Петрович',     region: 'Москва',          city: 'Москва',          execution_accuracy: 0,    artistic_accuracy: 72.1, bias_coefficient: -0.18 },
  { id: 5, fio: 'Новикова Анна Александровна', region: 'Екатеринбург',    city: 'Екатеринбург',    execution_accuracy: 88.0, artistic_accuracy: 0,    bias_coefficient: 0.04  },
  { id: 6, fio: 'Морозов Сергей Николаевич',   region: 'Новосибирск',     city: 'Новосибирск',     execution_accuracy: 0,    artistic_accuracy: 66.7, bias_coefficient: 0.45  },
]
