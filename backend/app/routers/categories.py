from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..models import Performance, Assessment

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

    judges = sorted(set(a.number for a in rows))

    matrix = {}
    counts = {}
    for judge in judges:
        matrix[judge] = {}
        counts[judge] = {}
        for region in regions:
            matrix[judge][region] = 0.0
            counts[judge][region] = 0

    for a in rows:
        perf = perf_map.get(a.performance_id)
        if not perf or not perf.region:
            continue
        deviation = a.referee_assessment - a.result_type_assessment
        matrix[a.number][perf.region] += deviation
        counts[a.number][perf.region] += 1

    for judge in judges:
        for region in regions:
            if counts[judge][region] > 0:
                matrix[judge][region] = round(matrix[judge][region] / counts[judge][region], 3)

    return {
        "competition": competition_name,
        "age_category": age_category,
        "discipline": discipline,
        "judges": judges,
        "regions": regions,
        "matrix": matrix,
    }
