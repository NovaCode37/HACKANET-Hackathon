# Hackathon Presentation — Aerobic.Space

> **Built in 3 days during the HACKANET hackathon — [xakanet.ru](https://xakanet.ru)**
>
> An end-to-end analytics platform for the Russian Aerobic Gymnastics Federation that detects scoring inaccuracy and judging bias.

---

## 1. The Problem

Aerobic gymnastics is judged subjectively. Scores vary between referees, and athletes from a referee's home region historically receive different marks than outsiders. The federation lacked an objective tool to:

- Quantify each referee's **accuracy** against the official aggregated mark.
- Detect **bias** toward home athletes (region for national events, city for regional events).
- Drill down from competition → category → judge × region heatmap.

## 2. The Solution

A full-stack web application that ingests official CSV exports and presents three views:

1. **Competitions list** with aggregated metrics, filterable by category and age.
2. **Judge directory** with per-judge accuracy and bias scores.
3. **Heatmap** of average deviation per judge × region for any selected category.

---

## 3. Tech Stack & Why

### Backend

| Technology         | Version | Why                                                                                       |
| ------------------ | ------- | ----------------------------------------------------------------------------------------- |
| **Python**         | 3.11    | Mature async, fastest CPython generation, ideal for data work.                            |
| **FastAPI**        | 0.111   | Async out of the box, Pydantic validation, **free OpenAPI/Swagger** at `/docs`.           |
| **SQLAlchemy 2.0** | async   | Modern typed ORM with full async support.                                                 |
| **PostgreSQL**     | 16      | Strong relational guarantees, indexes, production-ready.                                  |
| **asyncpg**        | 0.29    | Fastest async driver for PostgreSQL.                                                      |
| **Pydantic v2**    | —       | Runtime validation; clients cannot accidentally receive malformed payloads.               |
| **Docker Compose** | —       | One command boots Postgres + backend on any OS.                                           |
| **pytest + httpx** | 8.3     | Standard for async testing; ASGI transport tests FastAPI without spawning a server.       |
| **aiosqlite**      | 0.20    | In-memory SQLite for fully isolated tests.                                                |

### Frontend

| Technology      | Why                                                                                       |
| --------------- | ----------------------------------------------------------------------------------------- |
| **Next.js 16**  | App Router + Turbopack + built-in `/api/*` rewrites for backend proxying.                 |
| **React 19**    | New `use()` hook for unwrapping `params` Promises.                                        |
| **TypeScript**  | Static safety across the API boundary.                                                    |
| **TailwindCSS** | Utility-first styling at zero runtime cost.                                               |
| **shadcn/ui**   | Accessible primitives we own and customise.                                               |
| **framer-motion** | Subtle, accessible animations.                                                          |

### Why FastAPI rather than Django / Flask?

- **Django** ships ORM + admin + templates we don't need.
- **Flask** is synchronous by default; many extensions are needed to match FastAPI.
- **FastAPI** delivers async, typed validation, and OpenAPI generation natively — and is **5–10× faster** than Flask in TechEmpower benchmarks.

### Why async everywhere?

CSV uploads and aggregation queries spend most of their time waiting on Postgres I/O. Async makes a single Uvicorn worker keep serving other requests while the database responds.

---

## 4. Project Structure

```
hackanet/
├── app/                  # Next.js App Router (frontend)
│   └── (dashboard)/      # competitions, judges, upload
├── components/
├── lib/                  # api, types, discipline mapper
├── backend/
│   ├── app/
│   │   ├── main.py       # entry point + middleware
│   │   ├── config.py     # settings from .env
│   │   ├── database.py   # async SQLAlchemy engine
│   │   ├── constants.py  # JudgeType, CompetitionType
│   │   ├── models/       # SQLAlchemy ORM
│   │   ├── schemas/      # Pydantic input/output contracts
│   │   ├── services/     # accuracy, bias, csv_import
│   │   └── routers/      # HTTP endpoints
│   ├── tests/            # 28 tests — all green
│   ├── Dockerfile
│   └── docker-compose.yml
├── data/                 # CSV inputs
└── docs/                 # English docs (this file, ARCHITECTURE, API, TECH_STACK)
```

### Layered Backend

1. **Routers** — only HTTP. Parse, call service, return JSON.
2. **Services** — pure business rules. No HTTP, easy to test.
3. **Models** — table definitions and indexes.
4. **Schemas** — request/response contracts with the frontend.

> Replacing FastAPI with Litestar or Flask would not require rewriting `services/`. Service tests run on plain dataclasses — no HTTP client, no DB.

---

## 5. Data Model

### `Referee`
`id, fio, region, city` — sourced from `referees.csv`. Region/city are required for bias calculation.

### `Performance`
`id, region, city, competition_type, competition, age_category, discipline` — sourced from `performances.csv`. Describes one athlete's performance.

### `Assessment` (the core)
`id, referee_id (FK), performance_id (FK), type (EXECUTION/ARTISTIC), number, referee_assessment, result_type_assessment, result_assessment` — sourced from `assessments.csv`. Connects a referee to a performance with their score.

Indexes on every frequently filtered column (`competition`, `region`, `referee_id`, `performance_id`, `type`).

---

## 6. Business Logic

### 6.1 Accuracy (`services/accuracy.py`)

Score-dependent threshold function:

| `result_score` | threshold |
| -------------- | --------- |
| ≥ 8.0          | 0.30      |
| ≥ 7.0          | 0.40      |
| ≥ 6.0          | 0.50      |
| else           | 0.60      |

Classification:

- `bullseye` — deviation == 0
- `acceptable` — deviation within threshold
- `serious` — beyond threshold (gross error)

> **Example:** Referee marks 8.2, official mark 8.0. Threshold for 8.0 is 0.3. Deviation 0.2 < 0.3 → **acceptable** ✅. If they had marked 9.0 → 1.0 > 0.3 → **serious** ❌.

### 6.2 Bias coefficient (`services/bias.py`)

```
bias = mean_deviation(others) − mean_deviation(own)
```

- `bias > 0` — softer on home athletes
- `bias < 0` — harsher on home athletes
- `≈ 0` — no detectable bias

### 6.3 CSV Ingestion (`services/csv_import.py`)

- CSV files have **no headers** (matches federation export) → `csv.DictReader(fieldnames=...)`
- Encoding `utf-8-sig` — strips Excel BOM
- `INSERT ... ON CONFLICT DO NOTHING` — re-uploads are idempotent

---

## 7. API

| Method | Path                                       | Description                          |
| ------ | ------------------------------------------ | ------------------------------------ |
| POST   | `/api/upload/referees`                     | Upload referee CSV                   |
| POST   | `/api/upload/performances`                 | Upload performances CSV              |
| POST   | `/api/upload/assessments`                  | Upload assessments CSV               |
| GET    | `/api/competitions/`                       | List with aggregates                 |
| GET    | `/api/competitions/{name}`                 | Detail: judges, categories, metrics  |
| GET    | `/api/categories/{comp}/{age}/{discipline}`| Judge × Region heatmap               |
| GET    | `/api/referees/?search=`                   | List judges with metrics             |
| GET    | `/api/referees/{id}`                       | Profile + performance history        |

All endpoints validated by Pydantic. Upload limited to **10 MB** with `.csv` extension check.

---

## 8. Tests

**28 tests, all green.** Run with:

```bash
docker compose exec backend pytest
```

| File                | Tests | What it covers                                     |
| ------------------- | ----- | -------------------------------------------------- |
| `test_accuracy.py`  | 11    | Every accuracy function (unit)                     |
| `test_bias.py`      | 5     | Bias for every scenario (unit)                     |
| `test_referees.py`  | 6     | List, search, 404, profile (integration)           |
| `test_upload.py`    | 6     | Upload CSV, duplicates, non-CSV rejection          |

Tests use **in-memory SQLite (`aiosqlite`)** with a fresh schema per test for full isolation.

---

## 9. Security & Quality

- Secrets in `.env` (never committed; in `.gitignore`)
- CORS pinned to `http://localhost:3000`
- 10 MB upload limit
- Correct HTTP codes: 400, 404, 413, 422
- Pydantic validates everything on the wire
- `Constants` module eliminates magic strings (`JudgeType.EXECUTION`)

---

## 10. FAQ for Reviewers

> **Why FastAPI?**
> Async + typing + free Swagger. A single decorator (`@router.get`) and the endpoint appears in `/docs` with the OpenAPI schema. The frontend can auto-generate TypeScript types.

> **Why PostgreSQL, not MongoDB or SQLite?**
> The data is heavily relational: referee ↔ assessment ↔ performance with foreign keys. SQL aggregations (`GROUP BY`, joins) are far cleaner than Mongo's pipelines. SQLite cannot handle concurrent writers in production.

> **Why Docker?**
> So nobody has to install Postgres, the right Python, or asyncpg manually. `docker compose up` and everything runs identically on any OS.

> **How does it scale?**
> The backend is **stateless** → multiple instances behind nginx. Postgres scales with read replicas. Async already optimises a single instance for I/O-heavy workloads.

> **What was the hardest part?**
> Parsing CSVs without headers and a Windows-1251 BOM, plus the bias formula. Solved with `csv.DictReader(fieldnames=...)` and Python-side region/city grouping.

> **What kind of tests?**
> Unit tests for `accuracy`/`bias` (no DB, just dataclass fakes) plus integration tests via `httpx.AsyncClient` against an ASGI app backed by in-memory SQLite. **28 tests, 100% service coverage.**

> **What didn't make it?**
> Alembic migrations (currently `Base.metadata.create_all`), `response_model` on every endpoint, and a Redis cache for hot competition queries.

---

## 11. The Hackathon

Built **end-to-end in 3 days** during a hackathon hosted on the **HACKANET** platform — [xakanet.ru](https://xakanet.ru). The customer was the Russian Aerobic Gymnastics Federation, which needed objective metrics to monitor judging integrity across regional and national competitions.
