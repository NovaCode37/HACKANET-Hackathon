from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..models import Referee, Assessment, Performance
from ..services.accuracy import calc_accuracy_percent, classify_accuracy
from ..services.bias import calc_bias

router = APIRouter(prefix="/referees", tags=["referees"])

@router.get("/")
async def get_referees(search: str = Query(None), db: AsyncSession = Depends(get_db)):
    query = select(Referee)
    if search:
        query = query.where(Referee.fio.ilike(f"%{search}%"))
    result = await db.execute(query)
    referees = result.scalars().all()

    items = []
    for ref in referees:
        q = (
            select(Assessment, Performance)
            .join(Performance, Assessment.performance_id == Performance.id)
            .where(Assessment.referee_id == ref.id)
        )
        rows = (await db.execute(q)).all()

        exec_assessments = [a for a, p in rows if a.type == "EXECUTION"]
        art_assessments = [a for a, p in rows if a.type == "ARTISTIC"]

        exec_acc = calc_accuracy_percent(exec_assessments)
        art_acc = calc_accuracy_percent(art_assessments)
        bias = calc_bias(ref.region, ref.city, rows)

        items.append({
            "id": ref.id,
            "fio": ref.fio,
            "region": ref.region,
            "city": ref.city,
            "execution_accuracy": round(exec_acc, 1),
            "artistic_accuracy": round(art_acc, 1),
            "bias_coefficient": round(bias, 2),
        })

    return items

@router.get("/{referee_id}")
async def get_referee_profile(referee_id: int, type: str = Query(None), 
                                age_category: str = Query(None), competition: str = Query(None),
                                db: AsyncSession = Depends(get_db)):
    referee = await db.get(Referee, referee_id)

    query = (
        select(Assessment, Performance)
        .join(Performance, Assessment.performance_id == Performance.id)
        .where(Assessment.referee_id == referee_id)
    )
    if type:
        query = query.where(Performance.competition_type == type)
    if age_category:
        query = query.where(Performance.age_category == age_category)
    if competition:
        query = query.where(Performance.competition == competition)
    rows = (await db.execute(query)).all()

    exec_assessments = [a for a, p in rows if a.type == "EXECUTION"]
    art_assessments = [a for a, p in rows if a.type == "ARTISTIC"]

    exec_acc = calc_accuracy_percent(exec_assessments)
    art_acc = calc_accuracy_percent(art_assessments)
    bias = calc_bias(referee.region, referee.city, rows)

    performances_out = []
    for a, p in rows:
        others_q = (
            select(Assessment.referee_assessment)
            .where(Assessment.performance_id == a.performance_id)
            .where(Assessment.type == a.type)
            .where(Assessment.referee_id != referee_id)
        )
        others = (await db.execute(others_q)).scalars().all()

        performances_out.append({
            "performance": {
                "id": p.id, "region": p.region, "city": p.city,
                "competition_type": p.competition_type, "competition": p.competition,
                "age_category": p.age_category, "discipline": p.discipline,
            },
            "type": a.type,
            "my_score": a.referee_assessment,
            "other_scores": list(others),
            "result_score": a.result_type_assessment,
            "deviation": round(a.referee_assessment - a.result_type_assessment, 3),
            "accuracy": classify_accuracy(a.referee_assessment, a.result_type_assessment),
        })

    return {
        "referee": {"id": referee.id, "fio": referee.fio, "region": referee.region, "city": referee.city},
        "execution_accuracy": round(exec_acc, 1),
        "artistic_accuracy": round(art_acc, 1),
        "bias_coefficient": round(bias, 2),
        "performances": performances_out,
    }
