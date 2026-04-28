from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db

router = APIRouter(prefix="/categories", tags=["categories"])

@router.get("/{competition_name}/{age_category}/{discipline}")
async def get_category_heatmap(competition_name: str, age_category: str,
                                discipline: str, db = AsyncSession(get_db)):
    pass
