import csv
import io
from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.dialects.postgresql import insert 
from ..models import Referee, Performance, Assessment

async def import_referees(file: UploadFile, db: AsyncSession) -> int:
    content = await file.read()
    text = content.decode("utf-8")

    reader = csv.DictReader(io.StringIO(text))

    inserted = 0
    for row in reader:
        stmt = insert(Referee).values(
            id=int(row["id"]),
            fio=row["fio"],
            region=row.get("region"),
            city=row.get("city"),
        ).on_conflict_do_nothing(index_elements=["id"])

        result = await db.execute(stmt)
        if result.rowcount > 0:
            inserted += 1

    await db.commit()
    return inserted
        

async def import_performances(file: UploadFile, db: AsyncSession) -> int:
    content = await file.read()
    text = content.decode("utf-8")

    reader = csv.DictReader(io.StringIO(text))

    inserted = 0
    for row in reader:
        stmt = insert(Performance).values(
            id=int(row["id"]),
            region=row.get("region"),
            city=row.get("city"),
            competition_type=row.get("competition_type"),
            competition=row.get("competition"),
            age_category=row.get("age_category"),
            discipline=row.get("discipline"),
        ).on_conflict_do_nothing(index_elements=["id"])

        result = await db.execute(stmt)
        if result.rowcount > 0:
            inserted += 1

    await db.commit()
    return inserted

async def import_assessments(file: UploadFile, db: AsyncSession) -> int:
    content = await file.read()
    text = content.decode("utf-8")

    reader = csv.DictReader(io.StringIO(text))

    inserted = 0
    for row in reader:
        stmt = insert(Assessment).values(
            id=int(row["id"]),
            referee_id=int(row["referee_id"]),
            performance_id=int(row["performance_id"]),
            type=row["type"],
            number=int(row["number"]),
            referee_assessment=float(row["referee_assessment"]),
            result_type_assessment=float(row["result_type_assessment"]),
            result_assessment=float(row["result_assessment"]),
        ).on_conflict_do_nothing(index_elements=["id"])

        result = await db.execute(stmt)
        if result.rowcount > 0:
            inserted += 1
    
    await db.commit()
    return inserted
