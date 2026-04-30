import type { CompetitionListItem, CompetitionDetail, JudgeListItem, HeatmapData, JudgeProfile } from '../types'

export const mockCompetitions: CompetitionListItem[] = [
  {
    id: '1',
    name: 'Кубок Москвы по аэробике 2024',
    type: 'REGION',
    execution_accuracy: 72.3,
    artistic_accuracy: 68.9,
    performance_count: 32,
    avg_scrores: 8.4
  },
  {
    id: '2',
    name: 'Первенство Центрального федерального округа',
    type: 'REGION',
    execution_accuracy: 55.3,
    artistic_accuracy: 61.4,
    performance_count: 40,
    avg_scrores: 8.4
  },
  {
    id: '3',
    name: 'Открытый кубок Краснодарского края 2024',
    type: 'REGION',
    execution_accuracy: 93.1,
    artistic_accuracy: 90.0,
    performance_count: 20,
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
    name: 'Чемпионат Сибирского федерального округа',
    type: 'REGION',
    execution_accuracy: 48.7,
    artistic_accuracy: 52.2,
    performance_count: 30,
    avg_scrores: 8.4
  },
  {
    id: '7',
    name: 'Первенство России среди юниоров 2024',
    type: 'RUSSIA',
    execution_accuracy: 79.4,
    artistic_accuracy: 83.1,
    performance_count: 36,
    avg_scrores: 8.4
  },
  {
    id: '8',
    name: 'Кубок России по спортивной аэробике 2025',
    type: 'RUSSIA',
    execution_accuracy: 87.5,
    artistic_accuracy: 91.2,
    performance_count: 48,
    avg_scrores: 8.4
  },
]

export const mockHeatmapData: HeatmapData = {
  judges: [
    { id: 1, fio: 'Иванова Мария' },
    { id: 2, fio: 'Николаева Анна' },
    { id: 3, fio: 'Петров Алексей' },
    { id: 4, fio: 'Фёдорова Ольга' },
    { id: 5, fio: 'Сидорова Елена' },
    { id: 6, fio: 'Морозов Игорь' },
    { id: 7, fio: 'Козлов Дмитрий' },
    { id: 8, fio: 'Вагнер Татьяна' },
  ],
  regions: ['Краснодарская кр.', 'Москва', 'Московская обл.', 'Новосибирская обл.', 'Ростовская обл.', 'Санкт-Петербург', 'Свердловская обл.', 'Татарстан'],
  cells: [
    { referee_id: 1, referee_name: 'Иванова Мария',   region: 'Краснодарская кр.',   value: -0.09, performance_count: 3 },
    { referee_id: 1, referee_name: 'Иванова Мария',   region: 'Москва',              value:  0.19, performance_count: 4 },
    { referee_id: 1, referee_name: 'Иванова Мария',   region: 'Московская обл.',     value: -0.48, performance_count: 2 },
    { referee_id: 1, referee_name: 'Иванова Мария',   region: 'Новосибирская обл.',  value:  0.48, performance_count: 3 },
    { referee_id: 1, referee_name: 'Иванова Мария',   region: 'Ростовская обл.',     value: -0.09, performance_count: 2 },
    { referee_id: 1, referee_name: 'Иванова Мария',   region: 'Санкт-Петербург',    value:  0.19, performance_count: 3 },
    { referee_id: 1, referee_name: 'Иванова Мария',   region: 'Свердловская обл.',   value: -0.31, performance_count: 2 },
    { referee_id: 1, referee_name: 'Иванова Мария',   region: 'Татарстан',           value: -0.10, performance_count: 2 },

    { referee_id: 2, referee_name: 'Николаева Анна',  region: 'Краснодарская кр.',   value: -0.25, performance_count: 3 },
    { referee_id: 2, referee_name: 'Николаева Анна',  region: 'Москва',              value: -0.12, performance_count: 4 },
    { referee_id: 2, referee_name: 'Николаева Анна',  region: 'Московская обл.',     value:  0.13, performance_count: 2 },
    { referee_id: 2, referee_name: 'Николаева Анна',  region: 'Новосибирская обл.',  value:  0.33, performance_count: 3 },
    { referee_id: 2, referee_name: 'Николаева Анна',  region: 'Ростовская обл.',     value: -0.09, performance_count: 2 },
    { referee_id: 2, referee_name: 'Николаева Анна',  region: 'Санкт-Петербург',    value: -0.40, performance_count: 3 },
    { referee_id: 2, referee_name: 'Николаева Анна',  region: 'Свердловская обл.',   value: -0.31, performance_count: 2 },
    { referee_id: 2, referee_name: 'Николаева Анна',  region: 'Татарстан',           value:  0.35, performance_count: 2 },

    { referee_id: 3, referee_name: 'Петров Алексей',  region: 'Краснодарская кр.',   value: -0.36, performance_count: 3 },
    { referee_id: 3, referee_name: 'Петров Алексей',  region: 'Москва',              value:  0.15, performance_count: 4 },
    { referee_id: 3, referee_name: 'Петров Алексей',  region: 'Московская обл.',     value:  0.53, performance_count: 2 },
    { referee_id: 3, referee_name: 'Петров Алексей',  region: 'Новосибирская обл.',  value: -0.48, performance_count: 3 },
    { referee_id: 3, referee_name: 'Петров Алексей',  region: 'Ростовская обл.',     value:  0.03, performance_count: 2 },
    { referee_id: 3, referee_name: 'Петров Алексей',  region: 'Санкт-Петербург',    value: -0.45, performance_count: 3 },
    { referee_id: 3, referee_name: 'Петров Алексей',  region: 'Свердловская обл.',   value:  0.08, performance_count: 2 },
    { referee_id: 3, referee_name: 'Петров Алексей',  region: 'Татарстан',           value: -0.07, performance_count: 2 },

    { referee_id: 4, referee_name: 'Фёдорова Ольга',  region: 'Краснодарская кр.',   value:  0.21, performance_count: 3 },
    { referee_id: 4, referee_name: 'Фёдорова Ольга',  region: 'Москва',              value:  0.19, performance_count: 4 },
    { referee_id: 4, referee_name: 'Фёдорова Ольга',  region: 'Московская обл.',     value:  0.32, performance_count: 2 },
    { referee_id: 4, referee_name: 'Фёдорова Ольга',  region: 'Новосибирская обл.',  value: -0.48, performance_count: 3 },
    { referee_id: 4, referee_name: 'Фёдорова Ольга',  region: 'Ростовская обл.',     value:  0.03, performance_count: 2 },
    { referee_id: 4, referee_name: 'Фёдорова Ольга',  region: 'Санкт-Петербург',    value: -0.45, performance_count: 3 },
    { referee_id: 4, referee_name: 'Фёдорова Ольга',  region: 'Свердловская обл.',   value:  0.08, performance_count: 2 },
    { referee_id: 4, referee_name: 'Фёдорова Ольга',  region: 'Татарстан',           value:  0.25, performance_count: 2 },

    { referee_id: 5, referee_name: 'Сидорова Елена',  region: 'Краснодарская кр.',   value:  0.10, performance_count: 3 },
    { referee_id: 5, referee_name: 'Сидорова Елена',  region: 'Москва',              value:  0.14, performance_count: 4 },
    { referee_id: 5, referee_name: 'Сидорова Елена',  region: 'Московская обл.',     value: -0.30, performance_count: 2 },
    { referee_id: 5, referee_name: 'Сидорова Елена',  region: 'Новосибирская обл.',  value: -0.34, performance_count: 3 },
    { referee_id: 5, referee_name: 'Сидорова Елена',  region: 'Ростовская обл.',     value:  0.18, performance_count: 2 },
    { referee_id: 5, referee_name: 'Сидорова Елена',  region: 'Санкт-Петербург',    value: -0.34, performance_count: 3 },
    { referee_id: 5, referee_name: 'Сидорова Елена',  region: 'Свердловская обл.',   value: -0.08, performance_count: 2 },
    { referee_id: 5, referee_name: 'Сидорова Елена',  region: 'Татарстан',           value:  0.51, performance_count: 2 },

    { referee_id: 6, referee_name: 'Морозов Игорь',   region: 'Краснодарская кр.',   value:  0.01, performance_count: 3 },
    { referee_id: 6, referee_name: 'Морозов Игорь',   region: 'Москва',              value: -0.03, performance_count: 4 },
    { referee_id: 6, referee_name: 'Морозов Игорь',   region: 'Московская обл.',     value:  0.23, performance_count: 2 },
    { referee_id: 6, referee_name: 'Морозов Игорь',   region: 'Новосибирская обл.',  value: -0.09, performance_count: 3 },
    { referee_id: 6, referee_name: 'Морозов Игорь',   region: 'Ростовская обл.',     value: -0.05, performance_count: 2 },
    { referee_id: 6, referee_name: 'Морозов Игорь',   region: 'Санкт-Петербург',    value: -0.43, performance_count: 3 },
    { referee_id: 6, referee_name: 'Морозов Игорь',   region: 'Свердловская обл.',   value: -0.11, performance_count: 2 },
    { referee_id: 6, referee_name: 'Морозов Игорь',   region: 'Татарстан',           value: -0.15, performance_count: 2 },

    { referee_id: 7, referee_name: 'Козлов Дмитрий',  region: 'Краснодарская кр.',   value: -0.12, performance_count: 3 },
    { referee_id: 7, referee_name: 'Козлов Дмитрий',  region: 'Москва',              value:  0.01, performance_count: 4 },
    { referee_id: 7, referee_name: 'Козлов Дмитрий',  region: 'Московская обл.',     value:  0.23, performance_count: 2 },
    { referee_id: 7, referee_name: 'Козлов Дмитрий',  region: 'Новосибирская обл.',  value: -0.09, performance_count: 3 },
    { referee_id: 7, referee_name: 'Козлов Дмитрий',  region: 'Ростовская обл.',     value: -0.05, performance_count: 2 },
    { referee_id: 7, referee_name: 'Козлов Дмитрий',  region: 'Санкт-Петербург',    value: -0.43, performance_count: 3 },
    { referee_id: 7, referee_name: 'Козлов Дмитрий',  region: 'Свердловская обл.',   value: -0.11, performance_count: 2 },
    { referee_id: 7, referee_name: 'Козлов Дмитрий',  region: 'Татарстан',           value: -0.50, performance_count: 2 },

    { referee_id: 8, referee_name: 'Вагнер Татьяна',  region: 'Краснодарская кр.',   value: -0.01, performance_count: 3 },
    { referee_id: 8, referee_name: 'Вагнер Татьяна',  region: 'Москва',              value: -0.18, performance_count: 4 },
    { referee_id: 8, referee_name: 'Вагнер Татьяна',  region: 'Московская обл.',     value: -0.16, performance_count: 2 },
    { referee_id: 8, referee_name: 'Вагнер Татьяна',  region: 'Новосибирская обл.',  value: -0.09, performance_count: 3 },
    { referee_id: 8, referee_name: 'Вагнер Татьяна',  region: 'Ростовская обл.',     value: -0.16, performance_count: 2 },
    { referee_id: 8, referee_name: 'Вагнер Татьяна',  region: 'Санкт-Петербург',    value: -0.16, performance_count: 3 },
    { referee_id: 8, referee_name: 'Вагнер Татьяна',  region: 'Свердловская обл.',   value: -0.43, performance_count: 2 },
    { referee_id: 8, referee_name: 'Вагнер Татьяна',  region: 'Татарстан',           value: -0.64, performance_count: 2 },
  ],
}

// returns heatmap data shifted by discipline/age to simulate real filtering
export function getHeatmapForFilter(discipline: string, age: string): HeatmapData {
  if (!discipline && !age) return mockHeatmapData
  const offsets: Record<string, number[]> = {
    'Индивидуальные женщины': [ 0.12, -0.08,  0.20, -0.15,  0.05, -0.22,  0.18, -0.10],
    'Индивидуальные мужчины': [-0.10,  0.15, -0.18,  0.08, -0.05,  0.20, -0.12,  0.07],
    'Смешанные пары':         [ 0.05, -0.20,  0.10, -0.05,  0.25, -0.08,  0.15, -0.18],
    'Трио':                   [-0.15,  0.10, -0.05,  0.20, -0.18,  0.12, -0.08,  0.22],
    'Группа':                 [ 0.20, -0.12,  0.08, -0.25,  0.10, -0.15,  0.05, -0.20],
  }
  const ageOffset = age === 'Юниоры 12-14' ? 0.05 : age === 'Юниоры 15-17' ? -0.03 : age === 'Взрослые 18+' ? 0.08 : 0
  const discOffsets = offsets[discipline] ?? new Array(8).fill(0)
  return {
    ...mockHeatmapData,
    cells: mockHeatmapData.cells.map((c) => ({
      ...c,
      value: Math.round((c.value + discOffsets[c.referee_id - 1] + ageOffset) * 100) / 100,
    })),
  }
}

export const mockCompetitionDetail: CompetitionDetail = {
  ...mockCompetitions[7],
  city: 'Москва',
  date: '15.03.2025',
  total_assessments: 56,
  serious_count: 2,
  execution_bullseye: 45,
  execution_allowable: 40,
  execution_serious: 15,
  artistic_bullseye: 50,
  artistic_allowable: 35,
  artistic_serious: 15,
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
  judges: [
    { referee: { id: 1, fio: 'Иванова Мария Петровна',      region: 'Москва',          city: 'Москва'          }, avg_deviation: 0.38, assessment_count: 9,  bias_coefficient: -0.03 },
    { referee: { id: 2, fio: 'Николаева Анна Сергеевна',    region: 'Санкт-Петербург', city: 'Санкт-Петербург' }, avg_deviation: 0.22, assessment_count: 11, bias_coefficient:  0.25 },
    { referee: { id: 3, fio: 'Петров Алексей Иванович',     region: 'Краснодар',       city: 'Краснодар'       }, avg_deviation: 0.31, assessment_count: 10, bias_coefficient: -0.05 },
    { referee: { id: 4, fio: 'Фёдорова Ольга Дмитриевна',  region: 'Москва',          city: 'Москва'          }, avg_deviation: 0.19, assessment_count: 8,  bias_coefficient:  0.25 },
    { referee: { id: 5, fio: 'Сидорова Елена Викторовна',   region: 'Новосибирск',     city: 'Новосибирск'     }, avg_deviation: 0.44, assessment_count: 9,  bias_coefficient:  0.51 },
  ],
}

export const mockJudgeProfile: JudgeProfile = {
  referee: { id: 1, fio: 'Иванова Мария Петровна', region: 'Москва', city: 'Москва' },
  execution_accuracy: 57.6,
  artistic_accuracy: 57.6,
  bias_coefficient: 0.092,
  bullseye_count: 0,
  allowable_count: 60,
  serious_count: 52,
  total_count: 112,
  performances: [
    { performance: { id: 101, region: 'Москва',          city: 'Москва',          competition_type: 'RUSSIA',  competition: 'Чемпионат России 2024', age_category: '12-14 лет', discipline: 'Тройка'       }, type: 'EXECUTION', my_score: 8.93, other_scores: [8.2, 8.4, 8.5], result_score: 8.36, deviation:  0.57, accuracy: 'serious'   },
    { performance: { id: 102, region: 'Санкт-Петербург', city: 'Санкт-Петербург', competition_type: 'RUSSIA',  competition: 'Чемпионат России 2024', age_category: '12-14 лет', discipline: 'Аэро-степ'    }, type: 'EXECUTION', my_score: 9.93, other_scores: [9.4, 9.5, 9.6], result_score: 9.36, deviation: -0.18, accuracy: 'allowable' },
    { performance: { id: 103, region: 'Краснодар',       city: 'Краснодар',       competition_type: 'REGION',  competition: 'Кубок Краснодара',      age_category: '12-14 лет', discipline: 'Аэро-степ'    }, type: 'EXECUTION', my_score: 9.93, other_scores: [9.4, 9.5, 9.6], result_score: 9.36, deviation: -0.18, accuracy: 'allowable' },
    { performance: { id: 104, region: 'Москва',          city: 'Москва',          competition_type: 'RUSSIA',  competition: 'Первенство юниоров',    age_category: '12-14 лет', discipline: 'Тройка'       }, type: 'EXECUTION', my_score: 8.93, other_scores: [8.2, 8.4, 8.5], result_score: 8.36, deviation:  0.57, accuracy: 'serious'   },
    { performance: { id: 105, region: 'Новосибирск',     city: 'Новосибирск',     competition_type: 'REGION',  competition: 'Чемпионат СФО',         age_category: '12-14 лет', discipline: 'Тройка'       }, type: 'EXECUTION', my_score: 8.93, other_scores: [8.2, 8.4, 8.5], result_score: 8.36, deviation:  0.57, accuracy: 'serious'   },
    { performance: { id: 106, region: 'Краснодар',       city: 'Краснодар',       competition_type: 'REGION',  competition: 'Кубок Краснодара',      age_category: '12-14 лет', discipline: 'Аэро-степ'    }, type: 'EXECUTION', my_score: 9.93, other_scores: [9.4, 9.5, 9.6], result_score: 9.36, deviation: -0.18, accuracy: 'allowable' },
    { performance: { id: 107, region: 'Москва',          city: 'Москва',          competition_type: 'RUSSIA',  competition: 'Чемпионат России 2024', age_category: '12-14 лет', discipline: 'Аэро-степ'    }, type: 'EXECUTION', my_score: 9.93, other_scores: [9.4, 9.5, 9.6], result_score: 9.36, deviation: -0.18, accuracy: 'allowable' },
    { performance: { id: 108, region: 'Санкт-Петербург', city: 'Санкт-Петербург', competition_type: 'RUSSIA',  competition: 'Первенство юниоров',    age_category: '12-14 лет', discipline: 'Тройка'       }, type: 'EXECUTION', my_score: 8.93, other_scores: [8.2, 8.4, 8.5], result_score: 8.36, deviation:  0.57, accuracy: 'serious'   },
    { performance: { id: 109, region: 'Москва',          city: 'Москва',          competition_type: 'RUSSIA',  competition: 'Чемпионат России 2024', age_category: '12-14 лет', discipline: 'Тройка'       }, type: 'EXECUTION', my_score: 8.93, other_scores: [8.2, 8.4, 8.5], result_score: 8.36, deviation:  0.57, accuracy: 'serious'   },
    { performance: { id: 110, region: 'Новосибирск',     city: 'Новосибирск',     competition_type: 'REGION',  competition: 'Чемпионат СФО',         age_category: '12-14 лет', discipline: 'Аэро-степ'    }, type: 'EXECUTION', my_score: 9.93, other_scores: [9.4, 9.5, 9.6], result_score: 9.36, deviation: -0.18, accuracy: 'allowable' },
    { performance: { id: 111, region: 'Краснодар',       city: 'Краснодар',       competition_type: 'REGION',  competition: 'Кубок Краснодара',      age_category: '12-14 лет', discipline: 'Аэро-степ'    }, type: 'EXECUTION', my_score: 9.93, other_scores: [9.4, 9.5, 9.6], result_score: 9.36, deviation: -0.18, accuracy: 'allowable' },
    { performance: { id: 112, region: 'Москва',          city: 'Москва',          competition_type: 'RUSSIA',  competition: 'Первенство юниоров',    age_category: '12-14 лет', discipline: 'Тройка'       }, type: 'EXECUTION', my_score: 8.93, other_scores: [8.2, 8.4, 8.5], result_score: 8.36, deviation:  0.57, accuracy: 'serious'   },
  ],
}

export const mockJudges: JudgeListItem[] = [
  { id: 1, fio: 'Иванова Мария Петровна',      region: 'Москва',          city: 'Москва',          execution_accuracy: 57.6, artistic_accuracy: 57.6, bias_coefficient:  0.092, total_assessments: 112 },
  { id: 2, fio: 'Николаева Анна Сергеевна',    region: 'Санкт-Петербург', city: 'Санкт-Петербург', execution_accuracy: 78.4, artistic_accuracy: 0,    bias_coefficient:  0.09,  total_assessments: 98  },
  { id: 3, fio: 'Петров Алексей Владимирович', region: 'Краснодар',       city: 'Краснодар',       execution_accuracy: 82.1, artistic_accuracy: 0,    bias_coefficient: -0.05,  total_assessments: 84  },
  { id: 4, fio: 'Фёдорова Ольга Дмитриевна',  region: 'Москва',          city: 'Москва',          execution_accuracy: 0,    artistic_accuracy: 85.6, bias_coefficient:  0.09,  total_assessments: 76  },
  { id: 5, fio: 'Сидорова Елена Викторовна',   region: 'Новосибирск',     city: 'Новосибирск',     execution_accuracy: 0,    artistic_accuracy: 72.1, bias_coefficient: -0.18,  total_assessments: 64  },
  { id: 6, fio: 'Морозов Игорь Сергеевич',    region: 'Екатеринбург',    city: 'Екатеринбург',    execution_accuracy: 88.0, artistic_accuracy: 0,    bias_coefficient:  0.04,  total_assessments: 91  },
  { id: 7, fio: 'Козлов Дмитрий Петрович',    region: 'Новосибирск',     city: 'Новосибирск',     execution_accuracy: 0,    artistic_accuracy: 66.7, bias_coefficient:  0.45,  total_assessments: 55  },
  { id: 8, fio: 'Вагнер Татьяна Николаевна',  region: 'Краснодар',       city: 'Краснодар',       execution_accuracy: 91.2, artistic_accuracy: 0,    bias_coefficient:  0.12,  total_assessments: 103 },
]
