from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db

router = APIRouter(prefix="/referees", tags=["referees"])

@router.get("/")
async def get_referees(search: str = Query(None), db: AsyncSession = Depends(get_db)):
    pass

@router.get("/{referee_id}")
async def get_referee_profile(referee_id: int, type: str = Query(None), 
                                age_category: str = Query(None), competition: str = Query(None),
                                db: AsyncSession = Depends(get_db())):
    pass

