# REST API Reference

All endpoints are served by FastAPI on `http://localhost:8001` and proxied from the Next.js frontend via `/api/*` (see `next.config.ts`).

Full interactive documentation (Swagger UI) is available at:

```
http://localhost:8001/docs
```

## Upload

| Method | Path                          | Body            | Description                |
| ------ | ----------------------------- | --------------- | -------------------------- |
| POST   | `/api/upload/referees`        | `file` (CSV)    | Loads the referee dictionary. |
| POST   | `/api/upload/performances`    | `file` (CSV)    | Loads athlete performances.   |
| POST   | `/api/upload/assessments`     | `file` (CSV)    | Loads judging marks.          |

Constraints:
- Extension must be `.csv`
- Max size: **10 MB**
- Re-uploading is idempotent (`INSERT ... ON CONFLICT DO NOTHING`)

## Competitions

### `GET /api/competitions/`
Optional query: `?search=<substring>`

Returns a list of competitions with aggregated metrics:
```json
[
  {
    "id": "string",
    "name": "string",
    "type": "RUSSIA" | "REGIONAL",
    "execution_accuracy": 87.5,
    "artistic_accuracy": 81.0,
    "performance_count": 42
  }
]
```

### `GET /api/competitions/{name}`
Detailed view with categories and judges.
```json
{
  "id": "string",
  "name": "string",
  "type": "RUSSIA",
  "execution_accuracy": 87.5,
  "artistic_accuracy": 81.0,
  "performance_count": 42,
  "avg_scrores": 8.4,
  "total_assessments": 1280,
  "serious_count": 36,
  "execution_bullseye": 410,
  "execution_allowable": 200,
  "execution_serious": 30,
  "artistic_bullseye": 380,
  "artistic_allowable": 220,
  "artistic_serious": 40,
  "disciplines": ["ИЖ", "СП", "ТР"],
  "age_categories": ["13-15", "16-17"],
  "categories": [
    {
      "id": "string",
      "discipline": "ИЖ",
      "age_category": "13-15",
      "execution_accuracy": 88.1,
      "artistic_accuracy": 82.0,
      "deviation_coefficient": 0.18,
      "performance_count": 12
    }
  ],
  "judges": [
    {
      "referee": { "id": 1, "fio": "Ivanova A.B.", "region": "Moscow", "city": "Moscow" },
      "avg_deviation": 0.21,
      "assessment_count": 96,
      "bias_coefficient": 0.04
    }
  ]
}
```

## Categories — Heatmap

### `GET /api/categories/{competition}/{age_category}/{discipline}`
Returns a Judge × Region matrix used by the heatmap on the competition detail page.
```json
{
  "judges": [{ "id": 1, "fio": "Ivanova A.B." }],
  "regions": ["Moscow", "Saint Petersburg"],
  "cells": [
    {
      "referee_id": 1,
      "referee_name": "Ivanova A.B.",
      "region": "Moscow",
      "avg_deviation": 0.12,
      "performance_count": 5
    }
  ]
}
```

## Referees (Judges)

### `GET /api/referees/`
Optional query: `?search=<substring>`
```json
[
  {
    "id": 1,
    "fio": "Ivanova A.B.",
    "region": "Moscow",
    "city": "Moscow",
    "execution_accuracy": 88.0,
    "artistic_accuracy": 82.0,
    "bias_coefficient": 0.04,
    "total_assessments": 96
  }
]
```

### `GET /api/referees/{id}`
Detailed judge profile, including a per-performance history with deviation and accuracy class.
```json
{
  "id": 1,
  "fio": "Ivanova A.B.",
  "region": "Moscow",
  "city": "Moscow",
  "execution_accuracy": 88.0,
  "artistic_accuracy": 82.0,
  "bias_coefficient": 0.04,
  "bullseye_count": 41,
  "allowable_count": 50,
  "serious_count": 5,
  "total_count": 96,
  "performances": [
    {
      "performance": {
        "id": "string",
        "competition": "Cup of Russia 2024",
        "discipline": "ИЖ",
        "age_category": "13-15",
        "region": "Moscow",
        "city": "Moscow"
      },
      "type": "EXECUTION",
      "my_score": 8.2,
      "result_score": 8.0,
      "deviation": 0.2,
      "accuracy": "acceptable"
    }
  ]
}
```

## Error Codes

| Status | Cause                                                         |
| ------ | ------------------------------------------------------------- |
| 400    | Wrong file extension or invalid filter parameter.             |
| 404    | Referee, competition, or category not found.                  |
| 413    | File exceeds the 10 MB upload limit.                          |
| 422    | Pydantic validation failure (malformed body or query string). |
