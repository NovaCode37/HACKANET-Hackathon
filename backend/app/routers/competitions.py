from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, func, distinct
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..models import Performance, Assessment
from ..services.accuracy import classify_accuracy

router = APIRouter(prefix="/competitions", tags=["competitions"])

@router.get("/")
async def get_competitions(search: str = Query(None), db: AsyncSession = Depends(get_db)):
    query = select(distinct(Performance.competition))
    if search:
        query = query.where(Performance.competition.ilike(f"%{search}%"))
    result = await db.execute(query)
    competitions = result.scalars().all()

    items = []
    for comp in competitions:
        query = (
            select(Assessment)
            .join(Performance, Assessment.performance_id == Performance.id)
            .where(Performance.competition == comp)
        )
        rows = (await db.execute(query)).scalars().all()

        exec_ok = 0
        exec_total = 0
        art_ok = 0
        art_total = 0

        for a in rows:
            label = classify_accuracy(a.referee_assessment, a.result_type_assessment)
            if a.type == "EXECUTION":
                exec_total += 1
                if label != "serious":
                    exec_ok += 1
            elif a.type == "ARTISTIC":
                art_total += 1
                if label != "serious":
                    art_ok += 1

        items.append({
            "competition": comp,
            "execution_accuracy": exec_ok / exec_total * 100 if exec_total else 0,
            "artistic_accuracy": art_ok / art_total * 100 if art_total else 0,
        })

    return items

@router.get("/{competition_name}")
async def get_competitions_detail(competition_name: str, db: AsyncSession = Depends(get_db)):
    query = (
        select(Performance)
        .where(Performance.competition == competition_name)
    )
    result = await db.execute(query)
    performances = result.scalars().all()

    categories = []
    seen = set()
    for p in performances:
        key = (p.age_category, p.discipline)
        if key not in seen:
            seen.add(key)
            categories.append({"age_category": p.age_category, "discipline": p.discipline})

    perf_ids = [p.id for p in performances]
    query = (
        select(Assessment)
        .where(Assessment.performance_id.in_(perf_ids))
    )
    rows = (await db.execute(query)).scalars().all()

    exec_ok = 0
    exec_total = 0
    art_ok = 0
    art_total = 0

    for a in rows:
        label = classify_accuracy(a.referee_assessment, a.result_type_assessment)
        if a.type == "EXECUTION":
            exec_total += 1
            if label != "serious":
                exec_ok += 1
        elif a.type == "ARTISTIC":
            art_total += 1
            if label != "serious":
                art_ok += 1

    return {
        "competition": competition_name,
        "categories": categories,
        "execution_accuracy": exec_ok / exec_total * 100 if exec_total else 0,
        "artistic_accuracy": art_ok / art_total * 100 if art_total else 0,
    }