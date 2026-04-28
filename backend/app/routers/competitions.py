from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db

router = APIRouter(prefix="/competitions", tags=["competitions"])

@router.get("/")
async def get_competitions(search: str = Query(None), db: AsyncSession = Depends(get_db)):
    pass

@router.get("/{competition_name}")
async def get_competitions_detail(competition_name: str, db: AsyncSession = Depends(get_db)):
    pass