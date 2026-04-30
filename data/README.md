# Sample Data

This folder contains anonymised CSV exports from the Russian Aerobic Gymnastics Federation, used as input for the upload pipeline.

| File                | Rows  | Description                                                                                              |
| ------------------- | ----- | -------------------------------------------------------------------------------------------------------- |
| `referees.csv`      | ~50   | Referee directory: full name, region, city.                                                              |
| `performances.csv`  | ~900  | Athlete performances: competition, age category, discipline, region, city.                               |
| `assessments.csv`   | ~2000 | Score rows: linking referee → performance with `EXECUTION` / `ARTISTIC` marks plus official aggregates.  |

## Format

CSV files are stored **without headers** (matching the original federation export). Column order is fixed and parsed via `csv.DictReader(fieldnames=...)` in `backend/app/services/csv_import.py`.

Encoding: `utf-8-sig` (Excel-compatible BOM is stripped automatically).

## Upload Order

The frontend uploads files sequentially in this exact order — each step depends on the previous one:

1. `referees.csv`     → fills the `referees` table
2. `performances.csv` → fills the `performances` table
3. `assessments.csv`  → fills the `assessments` table (foreign keys to the two above)

Re-uploading a file is safe: rows are inserted with `ON CONFLICT DO NOTHING`.
