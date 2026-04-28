aerobic-space/
├── .env.local.example          # DATABASE_URL для SQLite
├── next.config.js
├── package.json                # зависимости: Next 14, Recharts, MUI, better-sqlite3, papaparse
├── tailwind.config.js          # цвета: accurate/allowable/serious
├── tsconfig.json               # алиас @/*
│
└── src/
    ├── app/
    │   ├── layout.tsx / globals.css / page.tsx
    │   ├── (dashboard)/
    │   │   ├── layout.tsx                          # обёртка с Sidebar + Header
    │   │   ├── competitions/
    │   │   │   ├── page.tsx                        # 5.1 Список соревнований
    │   │   │   └── [id]/
    │   │   │       ├── page.tsx                    # 5.2 Детали соревнования
    │   │   │       └── [categoryId]/page.tsx       # 5.3 Статистика по категории
    │   │   ├── judges/
    │   │   │   ├── page.tsx                        # 5.4 Список судей
    │   │   │   └── [id]/page.tsx                   # 5.5 Профиль судьи
    │   │   └── upload/page.tsx                     # загрузка CSV
    │   └── api/
    │       ├── competitions/route.ts + [id]/...
    │       ├── judges/route.ts + [id]/...
    │       └── upload/route.ts
    │
    ├── components/
    │   ├── layout/     Sidebar, Header, Breadcrumb
    │   ├── ui/         Card, Table, Badge, SearchInput, Skeleton, Spinner, Tabs, Filters
    │   ├── competitions/  CompetitionList/Card/Detail, AccuracyIndicator, DeviationBadge, CategoryStats
    │   ├── judges/     JudgeList/Card/Profile, BiasIndicator, AccuracyIndicator, PerformanceTable, ScoreRow
    │   └── charts/     HeatmapChart, DeviationBarChart, AccuracyPieChart, ScoreDistributionChart
    │
    ├── lib/
    │   ├── db/         index.ts (SQLite), schema.ts, queries/{competitions,judges,assessments}.ts
    │   ├── calculations/  accuracy.ts, bias.ts, deviation.ts
    │   ├── upload/     csvParser.ts, validators.ts
    │   ├── types.ts    — все TypeScript интерфейсы
    │   ├── constants.ts — пороги отклонений (0.3/0.4/0.5/0.6)
    │   └── utils.ts
    │
    └── hooks/
        useCompetitions, useJudges, useFilters, useUpload
