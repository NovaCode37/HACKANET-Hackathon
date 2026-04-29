# Структура проекта Aerobic.Space

```
aerobics-sport/
├── .env.local                        # DATABASE_URL=./aerobic.db
├── .gitignore
├── CLAUDE.md                         # контекст для AI: ТЗ, соглашения, предметная область
├── structure.md                      # этот файл
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts (или css)
├── package.json
├── public/
│
└── app/                              # App Router (Next.js)
    ├── globals.css
    ├── layout.tsx                    # корневой layout: шрифты, провайдеры
    ├── page.tsx                      # редирект на /competitions
    │
    ├── (dashboard)/                  # группа с общим Sidebar + Header
    │   ├── layout.tsx
    │   │
    │   ├── competitions/
    │   │   ├── page.tsx              # 5.1 Список соревнований + поиск
    │   │   └── [id]/
    │   │       ├── page.tsx          # 5.2 Детали соревнования
    │   │       └── [categoryId]/
    │   │           └── page.tsx      # 5.3 Тепловая карта Судья × Регион
    │   │
    │   ├── judges/
    │   │   ├── page.tsx              # 5.4 Список судей + поиск по ФИО
    │   │   └── [id]/
    │   │       └── page.tsx          # 5.5 Профиль судьи + вкладки + фильтры
    │   │
    │   └── upload/
    │       └── page.tsx              # 5.6 Загрузка CSV (Судьи → Выступления → Оценки)
    │
    └── api/                          # REST API (Server-side)
        ├── competitions/
        │   ├── route.ts              # GET /api/competitions — список с агрегатами
        │   └── [id]/
        │       ├── route.ts          # GET /api/competitions/:id — детали
        │       └── category/
        │           └── [categoryId]/
        │               └── route.ts  # GET — данные для тепловой карты
        ├── judges/
        │   ├── route.ts              # GET /api/judges — список
        │   └── [id]/
        │       └── route.ts          # GET /api/judges/:id — профиль + оценки
        └── upload/
            └── route.ts              # POST /api/upload — парсинг CSV → SQLite

## Компоненты (src/components/ или app/_components/)

components/
├── layout/
│   ├── Sidebar.tsx                   # навигация: Соревнования / Судьи / Загрузка
│   ├── Header.tsx                    # хлебные крошки + заголовок страницы
│   └── Breadcrumb.tsx
│
├── ui/                               # переиспользуемые примитивы
│   ├── Card.tsx
│   ├── Table.tsx
│   ├── Badge.tsx                     # зелёный / жёлтый / красный
│   ├── SearchInput.tsx
│   ├── Skeleton.tsx
│   ├── Spinner.tsx
│   ├── Tabs.tsx
│   └── Filters.tsx                   # дисциплина, возраст, соревнование
│
├── competitions/
│   ├── CompetitionList.tsx           # таблица соревнований
│   ├── CompetitionCard.tsx           # карточка в списке
│   ├── CompetitionDetail.tsx         # детальная страница
│   ├── AccuracyIndicator.tsx         # % попадания (исп. / арт.)
│   ├── DeviationBadge.tsx            # коэффициент девиации
│   └── CategoryStats.tsx            # средние оценки / предвзятость
│
├── judges/
│   ├── JudgeList.tsx
│   ├── JudgeCard.tsx
│   ├── JudgeProfile.tsx
│   ├── BiasIndicator.tsx             # индикатор предвзятости
│   ├── AccuracyIndicator.tsx         # индикатор точности
│   ├── PerformanceTable.tsx          # список выступлений судьи
│   └── ScoreRow.tsx                  # строка: оценка судьи + остальные + цвет
│
└── charts/
    ├── HeatmapChart.tsx              # тепловая карта Судья × Регион
    ├── DeviationBarChart.tsx         # столбчатая: отклонения по судьям
    ├── AccuracyPieChart.tsx          # круговая: "в яблочко" / допуст. / серьёзное
    └── ScoreDistributionChart.tsx    # распределение оценок

## Бизнес-логика (lib/)

lib/
├── db/
│   ├── index.ts                      # инициализация SQLite, singleton
│   ├── schema.ts                     # CREATE TABLE: referees, performances, assessments
│   └── queries/
│       ├── competitions.ts           # SQL для соревнований + агрегаты
│       ├── judges.ts                 # SQL для судей + bias
│       └── assessments.ts           # SQL для оценок + точность
│
├── calculations/
│   ├── accuracy.ts                   # отклонение оценки, категория точности
│   ├── bias.ts                       # avg(чужие) - avg(свои)
│   └── deviation.ts                  # допустимые пороги по диапазонам
│
├── upload/
│   ├── csvParser.ts                  # papaparse → объекты
│   └── validators.ts                 # проверка схемы CSV перед вставкой
│
├── types.ts                          # все TypeScript-интерфейсы
├── constants.ts                      # DEVIATION_THRESHOLDS, JUDGE_TYPES
└── utils.ts                          # форматирование, clsx-хелперы

## Хуки (hooks/)

hooks/
├── useCompetitions.ts                # fetch /api/competitions
├── useJudges.ts                      # fetch /api/judges
├── useFilters.ts                     # состояние фильтров (дисциплина, возраст, соревнование)
└── useUpload.ts                      # загрузка CSV с прогрессом
```

## Навигационные переходы

```
/upload
  → (после загрузки данных)

/competitions
  → /competitions/[id]               (клик по соревнованию)
      → /competitions/[id]/[categoryId]  (клик по категории)

/judges
  → /judges/[id]                     (клик по судье)
```

## Цветовая схема отклонений

| Категория             | Цвет    | Tailwind-класс         |
|-----------------------|---------|------------------------|
| В яблочко (= 0)       | Зелёный | `text-green-600`       |
| Допустимое отклонение | Жёлтый  | `text-yellow-500`      |
| Серьёзное отклонение  | Красный | `text-red-600`         |
