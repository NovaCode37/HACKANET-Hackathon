import csv
import io
from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.dialects.postgresql import insert 
from ..models import Referee, Performance, Assessment

async def import_referees(file: UploadFile, db: AsyncSession) -> int:
    pass

async def import_perfomances(file: UploadFile, db: AsyncSession) -> int:
    pass

async def import_assessments(file: UploadFile, db: AsyncSession) -> int:
    pass
