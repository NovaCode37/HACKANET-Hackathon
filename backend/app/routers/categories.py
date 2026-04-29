from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..models import Performance, Assessment, Referee

router = APIRouter(prefix="/categories", tags=["categories"])

@router.get("/{competition_name}/{age_category}/{discipline}")
async def get_category_heatmap(competition_name: str, age_category: str,
                                discipline: str, db: AsyncSession = Depends(get_db)):
    query = (
        select(Performance)
        .where(Performance.competition == competition_name)
        .where(Performance.age_category == age_category)
        .where(Performance.discipline == discipline)
    )
    result = await db.execute(query)
    performances = result.scalars().all()

    perf_ids = [p.id for p in performances]
    perf_map = {p.id: p for p in performances}

    query = (
        select(Assessment)
        .where(Assessment.performance_id.in_(perf_ids))
    )
    rows = (await db.execute(query)).scalars().all()

    regions = set()
    for p in performances:
        if p.region:
            regions.add(p.region)
    regions = sorted(regions)

    judge_map = {}
    for a in rows:
        if a.referee_id not in judge_map:
            referee = await db.get(Referee, a.referee_id)
            if referee:
                judge_map[a.referee_id] = referee

    matrix = {}
    counts = {}
    for rid in judge_map:
        matrix[rid] = {}
        counts[rid] = {}
        for region in regions:
            matrix[rid][region] = 0.0
            counts[rid][region] = 0

    for a in rows:
        perf = perf_map.get(a.performance_id)
        if not perf or not perf.region:
            continue
        if a.referee_id not in matrix:
            continue
        deviation = a.referee_assessment - a.result_type_assessment
        matrix[a.referee_id][perf.region] += deviation
        counts[a.referee_id][perf.region] += 1

    for rid in judge_map:
        for region in regions:
            if counts[rid][region] > 0:
                matrix[rid][region] = round(matrix[rid][region] / counts[rid][region], 3)

    judges_out = [{"id": r.id, "fio": r.fio} for r in judge_map.values()]

    cells = []
    for rid, ref in judge_map.items():
        for region in regions:
            if counts[rid][region] > 0:
                cells.append({
                    "referee_id": ref.id,
                    "referee_name": ref.fio,
                    "region": region,
                    "avg_deviation": matrix[rid][region],
                    "performance_count": counts[rid][region],
                })

    return {
        "judges": judges_out,
        "regions": regions,
        "cells": cells,
    }
