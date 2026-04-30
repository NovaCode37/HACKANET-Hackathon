from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..services.csv_import import import_referees, import_performances, import_assessments

MAX_FILE_SIZE = 10 * 1024 * 1024  
router = APIRouter(prefix="/upload", tags=["upload"])

def _validate(file: UploadFile) -> None:
    if file.size and file.size > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large (max 10 MB)")
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files allowed")

@router.post("/referees")
async def upload_referees(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    _validate(file)
    count = await import_referees(file, db)
    return {"inserted": count}

@router.post("/performances")
async def upload_performances(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    _validate(file)
    count = await import_performances(file, db)
    return {"inserted": count}

@router.post("/assessments")
async def upload_assessments(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    _validate(file)
    count = await import_assessments(file, db)
    return {"inserted": count}

