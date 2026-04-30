# Aerobic.Space — Judge Performance Analytics Platform

> **Built in 3 days during the HACKANET hackathon — [xakanet.ru](https://xakanet.ru)**

A full-stack analytics platform for the Russian Aerobic Gymnastics Federation that detects judging bias and scoring accuracy across competitions. The system ingests official CSV reports, computes per-judge metrics (accuracy, deviation, bias toward home athletes), and visualises them through interactive dashboards and a judge × region heatmap.

---

## Features

- **CSV Upload Pipeline** — three-stage upload of referees, performances, and assessments with idempotent `INSERT ... ON CONFLICT DO NOTHING` semantics.
- **Accuracy Engine** — score-dependent deviation thresholds classify every assessment as `bullseye / acceptable / serious`.
- **Bias Coefficient** — quantifies whether a judge favors athletes from their own region/city.
- **Competition Drill-down** — list → detail → category, with filter-driven category tables and a Judge × Region heatmap.
- **Judge Profile** — execution/artistic tabs, deviation history, accuracy donut breakdown.
- **Discipline Translation Layer** — Russian abbreviations (`ИЖ`, `СП`, `ТР`, `ГР` …) are mapped to full names in the UI.

---

## Tech Stack

| Layer    | Technology                                                     |
| ----------| ----------------------------------------------------------------|
| Frontend | **Next.js 16** (App Router, Turbopack) + React 19 + TypeScript |
| Styling  | TailwindCSS 4, shadcn/ui, framer-motion, lucide-react          |
| Backend  | **FastAPI** (async) + SQLAlchemy 2.0 (asyncpg) + Pydantic v2   |
| Database | **PostgreSQL 16-alpine**                                       |
| DevOps   | Docker Compose, multi-stage builds                             |
| Testing  | pytest + pytest-asyncio + httpx (ASGITransport) + aiosqlite    |

See [`docs/TECH_STACK.md`](docs/TECH_STACK.md) for justifications.

---

## Repository Layout

```
hackanet/
├── app/                  # Next.js App Router (frontend pages)
│   └── (dashboard)/      # competitions, judges, upload
├── components/           # Reusable UI primitives
├── lib/                  # API client, types, discipline mapper
├── public/
├── backend/              # FastAPI service
│   ├── app/
│   │   ├── routers/      # HTTP endpoints
│   │   ├── services/     # accuracy, bias, csv_import
│   │   ├── models/       # SQLAlchemy ORM
│   │   └── schemas/      # Pydantic
│   ├── tests/            # 28 tests, all green
│   ├── Dockerfile
│   └── docker-compose.yml
├── data/                 # Sample CSV inputs (referees / performances / assessments)
├── docs/                 # Architecture, stack, API, presentation (English)
└── README.md
```

---

## Quick Start

### 1. Backend (Docker)

```bash
cd backend
docker compose up -d --build
# API will be available at http://localhost:8001
# OpenAPI docs:           http://localhost:8001/docs
```

### 2. Frontend

```bash
npm install
npm run dev
# UI at http://localhost:3000
```

### 3. Load sample data

Open `http://localhost:3000/upload` and upload, in order:

1. `data/referees.csv`
2. `data/performances.csv`
3. `data/assessments.csv`

After upload, visit **/judges** and **/competitions**.

---

## Tests

```bash
docker compose exec backend pytest
```

28 tests covering accuracy logic, bias calculation, upload flow, and referee endpoints. Tests run against an isolated in-memory SQLite database (`aiosqlite`).

---

## Documentation

All documents live in [`docs/`](docs/):

- [`ARCHITECTURE.md`](docs/ARCHITECTURE.md) — system design, data flow, layered backend
- [`TECH_STACK.md`](docs/TECH_STACK.md) — technology choices and rationale
- [`API.md`](docs/API.md) — REST endpoint reference
- [`PRESENTATION.md`](docs/PRESENTATION.md) — full hackathon presentation in English

---

## Hackathon

This project was built **end-to-end in 3 days** during a hackathon hosted on the [HACKANET](https://xakanet.ru) platform. The challenge was issued by the Russian Aerobic Gymnastics Federation, which needed objective metrics to monitor judging integrity across regional and national competitions.

The user interface was designed from scratch in **Figma** before any code was written, then implemented one-to-one in Next.js with TailwindCSS and shadcn/ui.

---

## Team

| Role         | Author          | GitHub                                              |
| ------------ | --------------- | --------------------------------------------------- |
| **Backend**  | NovaCode37 (me) | [github.com/NovaCode37](https://github.com/NovaCode37)     |
| **Frontend** | XenonZeon       | [github.com/XenonZeon](https://github.com/XenonZeon)       |
| **Design**   | jeltokbelok     | [github.com/jeltokbelok](https://github.com/jeltokbelok)   |

---

## License

MIT
