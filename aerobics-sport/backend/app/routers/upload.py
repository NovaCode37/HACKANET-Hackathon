from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..services.csv_import import import_referees, import_performances, import_assessments

router = APIRouter(prefix="/upload", tags=["upload"])

@router.post("/referees")
async def upload_referees(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    count =  await import_referees(file, db)
    return {"inserted": count}

@router.post("/performances")
async def upload_performances(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    count = await import_performances(file, db)
    return {"inserted": count}

@router.post("/assessments")
async def upload_perfomances(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    count = await import_assessments(file, db)
    return {"inserted": count}

