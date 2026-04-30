# Technology Stack

## Frontend

| Technology       | Version | Why                                                                                       |
| ---------------- | ------- | ----------------------------------------------------------------------------------------- |
| **Next.js**      | 16.x    | App Router, RSC, fast Turbopack dev server, built-in API rewrites for backend proxying.   |
| **React**        | 19      | Modern hooks, `use()` for promise unwrapping in dynamic routes.                           |
| **TypeScript**   | 5.x     | Static safety across API boundaries; types regenerated from backend schemas.              |
| **TailwindCSS**  | 4       | Utility-first styling with zero runtime cost.                                             |
| **shadcn/ui**    | latest  | Accessible primitives that we own — copy-and-customize.                                   |
| **framer-motion**| 11      | Subtle, accessible page and list animations.                                              |
| **lucide-react** | latest  | Consistent open-source icon set.                                                          |

## Backend

| Technology        | Version | Why                                                                                  |
| ----------------- | ------- | ------------------------------------------------------------------------------------ |
| **Python**        | 3.11    | Fastest CPython generation; native asyncio support is mature.                        |
| **FastAPI**       | 0.111   | Async first, Pydantic-driven validation, free OpenAPI/Swagger UI on `/docs`.         |
| **SQLAlchemy**    | 2.0     | Modern declarative ORM with full async support and typed `Mapped[...]` columns.      |
| **asyncpg**       | 0.29    | Fastest async driver for PostgreSQL.                                                 |
| **Pydantic**      | v2      | Runtime validation + serialization at the speed of Rust (`pydantic-core`).           |
| **PostgreSQL**    | 16      | Strong relational model fits judge↔assessment↔performance graph.                     |
| **Docker Compose**| —       | One command spins up Postgres + backend, regardless of host OS.                      |
| **pytest**        | 8.3     | Rich plugin ecosystem (asyncio, mock, coverage).                                     |
| **httpx**         | 0.27    | ASGI test transport — exercise FastAPI without spawning a server.                    |
| **aiosqlite**     | 0.20    | In-memory SQLite for fully isolated, parallel-safe tests.                            |

## Why FastAPI over Django / Flask?

- **Django** ships ORM + admin + templates that we don't need for a JSON API.
- **Flask** is synchronous by default and demands many extensions for parity with FastAPI.
- **FastAPI** delivers async, dependency injection, and OpenAPI generation natively — and is **5–10× faster** than Flask in TechEmpower benchmarks.

## Why PostgreSQL over MongoDB / SQLite?

The judging dataset is heavily relational (referee → assessment → performance with foreign keys). SQL aggregations (`GROUP BY`, joins) are concise and indexable. SQLite was great for tests but cannot serve concurrent writers in production. MongoDB's aggregation pipeline would be far less ergonomic for the queries we run.

## Why async everywhere?

CSV uploads and aggregation queries spend most of their wall time waiting on Postgres I/O. With async/await, a single Uvicorn worker continues to serve other requests while one is waiting for the database — measurable throughput improvement under concurrent load.

## Why Docker Compose?

`docker compose up --build` boots Postgres, runs migrations, and starts FastAPI on any developer's machine. No manual database setup, no version drift, identical to CI.
