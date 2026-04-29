from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, func, distinct
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..models import Performance, Assessment, Referee
from ..services.accuracy import classify_accuracy, calc_accuracy_percent
from ..services.bias import calc_bias

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
        perf_query = select(Performance).where(Performance.competition == comp)
        perfs = (await db.execute(perf_query)).scalars().all()
        comp_type = perfs[0].competition_type if perfs else "REGION"

        perf_ids = [p.id for p in perfs]
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

        avg_score = sum(a.result_assessment for a in rows) / len(rows) if rows else 0

        items.append({
            "id": comp,
            "name": comp,
            "type": comp_type,
            "execution_accuracy": round(exec_ok / exec_total * 100, 1) if exec_total else 0,
            "artistic_accuracy": round(art_ok / art_total * 100, 1) if art_total else 0,
            "performance_count": len(perfs),
            "avg_scrores": round(avg_score, 1),
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
    comp_type = performances[0].competition_type if performances else "REGION"
    perf_map = {p.id: p for p in performances}

    perf_ids = [p.id for p in performances]
    query = (
        select(Assessment)
        .where(Assessment.performance_id.in_(perf_ids))
    )
    rows = (await db.execute(query)).scalars().all()

    disciplines = sorted(set(p.discipline for p in performances))
    age_categories = sorted(set(p.age_category for p in performances))

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

    avg_score = sum(a.result_assessment for a in rows) / len(rows) if rows else 0

    cat_assessments = {}
    for a in rows:
        perf = perf_map.get(a.performance_id)
        if not perf:
            continue
        key = (perf.age_category, perf.discipline)
        if key not in cat_assessments:
            cat_assessments[key] = []
        cat_assessments[key].append(a)

    categories = []
    for (age_cat, disc), cat_rows in cat_assessments.items():
        c_exec_ok = 0
        c_exec_total = 0
        c_art_ok = 0
        c_art_total = 0
        deviations = []
        for a in cat_rows:
            dev = abs(a.referee_assessment - a.result_type_assessment)
            deviations.append(dev)
            label = classify_accuracy(a.referee_assessment, a.result_type_assessment)
            if a.type == "EXECUTION":
                c_exec_total += 1
                if label != "serious":
                    c_exec_ok += 1
            elif a.type == "ARTISTIC":
                c_art_total += 1
                if label != "serious":
                    c_art_ok += 1

        avg_dev = sum(deviations) / len(deviations) if deviations else 0
        cat_perf_ids = set(a.performance_id for a in cat_rows)

        categories.append({
            "id": f"{age_cat}_{disc}",
            "discipline": disc,
            "age_category": age_cat,
            "execution_accuracy": round(c_exec_ok / c_exec_total * 100, 1) if c_exec_total else 0,
            "artistic_accuracy": round(c_art_ok / c_art_total * 100, 1) if c_art_total else 0,
            "deviation_coefficient": round(avg_dev, 2),
            "performance_count": len(cat_perf_ids),
        })

    referee_ids = set(a.referee_id for a in rows)
    judges = []
    for rid in referee_ids:
        referee = await db.get(Referee, rid)
        if not referee:
            continue
        ref_assessments = [a for a in rows if a.referee_id == rid]
        ref_rows = [(a, perf_map[a.performance_id]) for a in ref_assessments if a.performance_id in perf_map]

        acc = calc_accuracy_percent(ref_assessments)
        bias = calc_bias(referee.region, referee.city, ref_rows)
        avg_ref_score = sum(a.referee_assessment for a in ref_assessments) / len(ref_assessments)

        judges.append({
            "referee": {"id": referee.id, "fio": referee.fio, "region": referee.region, "city": referee.city},
            "type": ref_assessments[0].type if ref_assessments else "EXECUTION",
            "avg_score": round(avg_ref_score, 2),
            "accuracy_percent": round(acc, 1),
            "bias_coefficient": round(bias, 2),
        })

    return {
        "id": competition_name,
        "name": competition_name,
        "type": comp_type,
        "execution_accuracy": round(exec_ok / exec_total * 100, 1) if exec_total else 0,
        "artistic_accuracy": round(art_ok / art_total * 100, 1) if art_total else 0,
        "performance_count": len(performances),
        "avg_scrores": round(avg_score, 1),
        "disciplines": disciplines,
        "age_categories": age_categories,
        "categories": categories,
        "judges": judges,
    }