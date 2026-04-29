import type { CompetitionListItem, CompetitionDetail, JudgeListItem } from '../types'

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

export const mockJudges: JudgeListItem[] = [
  { id: 1, fio: 'Иванова Мария Сергеевна',    region: 'Москва',          city: 'Москва',          execution_accuracy: 91.2, artistic_accuracy: 0,    bias_coefficient: 0.12  },
  { id: 2, fio: 'Петров Алексей Владимирович', region: 'Санкт-Петербург', city: 'Санкт-Петербург', execution_accuracy: 78.4, artistic_accuracy: 0,    bias_coefficient: -0.05 },
  { id: 3, fio: 'Сидорова Елена Ивановна',     region: 'Краснодар',       city: 'Краснодар',       execution_accuracy: 0,    artistic_accuracy: 85.6, bias_coefficient: 0.31  },
  { id: 4, fio: 'Козлов Дмитрий Петрович',     region: 'Москва',          city: 'Москва',          execution_accuracy: 0,    artistic_accuracy: 72.1, bias_coefficient: -0.18 },
  { id: 5, fio: 'Новикова Анна Александровна', region: 'Екатеринбург',    city: 'Екатеринбург',    execution_accuracy: 88.0, artistic_accuracy: 0,    bias_coefficient: 0.04  },
  { id: 6, fio: 'Морозов Сергей Николаевич',   region: 'Новосибирск',     city: 'Новосибирск',     execution_accuracy: 0,    artistic_accuracy: 66.7, bias_coefficient: 0.45  },
]
