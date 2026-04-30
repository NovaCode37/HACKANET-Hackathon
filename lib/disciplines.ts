export const DISCIPLINE_NAMES: Record<string, string> = {
  'ИЖ': 'Индивидуальные женщины',
  'ИМ': 'Индивидуальные мужчины',
  'СП': 'Смешанные пары',
  'ТР': 'Тройка',
  'ГР': 'Группа',
  'ГП': 'Гимнастическая платформа',
  'ТГ': 'Танцевальная гимнастика',
}

export function disciplineName(code: string): string {
  return DISCIPLINE_NAMES[code] ?? code
}
