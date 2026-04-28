from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..models import Referee, Assessment, Performance
from ..services.accuracy import calc_accuracy_percent
from ..services.bias import calc_bias

router = APIRouter(prefix="/referees", tags=["referees"])

@router.get("/")
async def get_referees(search: str = Query(None), db: AsyncSession = Depends(get_db)):
    query = select(Referee)
    if search:
        query = query.where(Referee.fio.ilike(f"%{search}%"))
    result = await db.execute(query)
    return result.scalars().all()

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
    rows = (await db.execute(query)).all()
    assessments = [a for a, p in rows]

    accuracy = calc_accuracy_percent(assessments)
    bias = calc_bias(referee.region, referee.city, rows)

    return {
        "id": referee_id,
        "fio": referee.fio,
        "region": referee.region,
        "city": referee.city,
        "accuracy_score": accuracy,
        "bias_score": bias,
    }
