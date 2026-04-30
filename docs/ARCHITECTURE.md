# Architecture

> A clean, layered full-stack architecture designed to make business logic independent of the HTTP and ORM layers.

## High-Level Diagram

```
                ┌──────────────────────────────────┐
                │   Next.js 16 Frontend (App      │
                │   Router, React 19, TypeScript) │
                │                                  │
                │   ┌──────────────────────────┐  │
                │   │  /api/* rewrite proxy    │──┼───────────────┐
                │   └──────────────────────────┘  │               │
                └──────────────────────────────────┘               │
                                                                   ▼
                                              ┌────────────────────────────────────┐
                                              │  FastAPI (async)                   │
                                              │  ┌──────────┐  ┌──────────────┐    │
                                              │  │ Routers  │→ │   Services    │    │
                                              │  │  (HTTP)  │  │ accuracy,bias │    │
                                              │  └──────────┘  └──────┬───────┘    │
                                              │  ┌──────────┐         │            │
                                              │  │ Schemas  │         │            │
                                              │  │ (Pydantic│         ▼            │
                                              │  └──────────┘  ┌──────────────┐    │
                                              │                │   Models      │    │
                                              │                │ (SQLAlchemy)  │    │
                                              │                └──────┬───────┘    │
                                              └───────────────────────┼────────────┘
                                                                      ▼
                                                          ┌──────────────────┐
                                                          │ PostgreSQL 16    │
                                                          │ asyncpg driver   │
                                                          └──────────────────┘
```

## Backend Layered Design

| Layer        | Folder                     | Responsibility                                                  |
| ------------ | -------------------------- | --------------------------------------------------------------- |
| **Routers**  | `backend/app/routers/`     | Parse HTTP, validate request bodies, return JSON. No logic.     |
| **Schemas**  | `backend/app/schemas/`     | Pydantic models — the contract between API and clients.         |
| **Services** | `backend/app/services/`    | Pure business rules: accuracy, bias, CSV import. Easy to test.  |
| **Models**   | `backend/app/models/`      | SQLAlchemy 2.0 declarative ORM with relationships and indexes.  |
| **Database** | `backend/app/database.py`  | Async engine + session factory.                                 |

> **Why this matters:** Replacing FastAPI with Flask or Litestar would not require rewriting `services/`. Tests for the accuracy and bias engines run on plain dataclasses — no HTTP client, no DB.

## Data Model

### `Referee`
Columns: `id`, `fio`, `region`, `city`.

### `Performance`
Columns: `id`, `region`, `city`, `competition_type`, `competition`, `age_category`, `discipline`.

### `Assessment` (the core of the system)
Columns: `id`, `referee_id` (FK), `performance_id` (FK), `type` (`EXECUTION`/`ARTISTIC`), `number`, `referee_assessment`, `result_type_assessment`, `result_assessment`.

Indexes on every frequently filtered column (`competition`, `region`, `referee_id`, `performance_id`, `type`).

## Key Algorithms

### Accuracy classification (`services/accuracy.py`)
```
threshold = f(result_score):
    >= 8.0 → 0.30
    >= 7.0 → 0.40
    >= 6.0 → 0.50
    else   → 0.60

deviation = |referee_score − result_score|
deviation == 0      → bullseye
deviation ≤ threshold → acceptable
deviation > threshold → serious
```

### Bias coefficient (`services/bias.py`)
1. Partition assessments into "own" and "others":
   - National event ⇒ "own" = same region as referee.
   - Regional event ⇒ "own" = same city as referee.
2. `bias = mean_deviation(others) − mean_deviation(own)`

Interpretation:
- `bias > 0`  → softer on home athletes (harsher on outsiders)
- `bias < 0`  → harsher on home athletes
- `bias ≈ 0`  → no detectable bias

### CSV ingestion (`services/csv_import.py`)
- No headers in the source files → `fieldnames` is supplied programmatically.
- `utf-8-sig` strips the Excel BOM.
- `INSERT ... ON CONFLICT DO NOTHING` makes re-uploads idempotent.

## Frontend Architecture

```
app/(dashboard)/
  competitions/
    page.tsx             ← list page
    [id]/page.tsx        ← detail page (filters → categories table → heatmap)
    [id]/[categoryId]/   ← category drill-down
  judges/
    page.tsx             ← list
    [id]/page.tsx        ← profile, exec/artistic tabs
  upload/
    page.tsx             ← three-step CSV upload

lib/
  api.ts                 ← typed fetch helpers
  types.ts               ← shared TypeScript interfaces
  disciplines.ts         ← Russian abbreviation → full name mapper
```

The frontend speaks to FastAPI exclusively through `/api/*`, which is rewritten to `http://localhost:8001/api/*` via `next.config.ts`.

## Quality Gates

- Pydantic validates every request and response.
- Upload endpoint enforces `.csv` extension and **10 MB** size limit.
- CORS pinned to the frontend origin.
- 28 backend tests pass on each push (`docker compose exec backend pytest`).
