import pytest
from app.models import Referee, Performance, Assessment

@pytest.mark.asyncio
async def test_get_referees_empty(client):
    response = await client.get("/api/referees/")
    assert response.status_code == 200
    assert response.json() == []

@pytest.mark.asyncio
async def test_get_referees_returns_judge_list_item_shape(client, db_session):
    db_session.add(Referee(id=1, fio="Иванов И.И.", region="Москва", city="Москва"))
    await db_session.commit()

    response = await client.get("/api/referees/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1

    item = data[0]
    expected_keys = {
        "id", "fio", "region", "city",
        "execution_accuracy", "artistic_accuracy", "bias_coefficient",
    }
    assert set(item.keys()) == expected_keys
    assert item["fio"] == "Иванов И.И."

@pytest.mark.asyncio
async def test_get_referees_search_filter(client, db_session):
    db_session.add_all([
        Referee(id=1, fio="Иванов И.И.", region="Москва", city="Москва"),
        Referee(id=2, fio="Петров П.П.", region="Тюмень", city="Тюмень"),
    ])
    await db_session.commit()

    response = await client.get("/api/referees/?search=Иван")
    data = response.json()
    assert len(data) == 1
    assert data[0]["fio"] == "Иванов И.И."

@pytest.mark.asyncio
async def test_get_referee_profile_not_found(client):
    response = await client.get("/api/referees/9999")
    assert response.status_code == 404

@pytest.mark.asyncio
async def test_get_referee_profile_no_assessments(client, db_session):
    db_session.add(Referee(id=1, fio="Иванов И.И.", region="Москва", city="Москва"))
    await db_session.commit()

    response = await client.get("/api/referees/1")
    assert response.status_code == 200
    data = response.json()
    assert data["referee"]["id"] == 1
    assert data["referee"]["fio"] == "Иванов И.И."
    assert data["execution_accuracy"] == 0
    assert data["artistic_accuracy"] == 0
    assert data["bias_coefficient"] == 0
    assert data["performances"] == []

@pytest.mark.asyncio
async def test_get_referee_profile_with_assessments(client, db_session):
    db_session.add(Referee(id=1, fio="Иванов", region="Москва", city="Москва"))
    db_session.add(Performance(
        id=1, region="Москва", city="Москва",
        competition_type="RUSSIA", competition="Cup-2024",
        age_category="Senior", discipline="AG",
    ))
    db_session.add(Assessment(
        id=1, referee_id=1, performance_id=1,
        type="EXECUTION", number=1,
        referee_assessment=8.0, result_type_assessment=8.0, result_assessment=16.0,
    ))
    await db_session.commit()

    response = await client.get("/api/referees/1")
    data = response.json()

    assert len(data["performances"]) == 1
    perf = data["performances"][0]
    assert perf["my_score"] == 8.0
    assert perf["accuracy"] == "bullseye"
    assert perf["deviation"] == 0.0
