import io
import pytest

def _csv_file(content: str, name: str = "data.csv"):
    return {"file": (name, io.BytesIO(content.encode("utf-8")), "text/csv")}

@pytest.mark.asyncio
async def test_upload_referees_ok(client):
    csv = "1,Иванов И.И.,Москва,Москва\n2,Петров П.П.,Тюмень,Тюмень\n"
    response = await client.post("/api/upload/referees", files=_csv_file(csv, "referees.csv"))
    assert response.status_code == 200
    assert response.json() == {"inserted": 2}

    list_response = await client.get("/api/referees/")
    assert len(list_response.json()) == 2

@pytest.mark.asyncio
async def test_upload_rejects_non_csv(client):
    response = await client.post(
        "/api/upload/referees",
        files=_csv_file("any", "data.txt"),
    )
    assert response.status_code == 400

@pytest.mark.asyncio
async def test_upload_duplicate_id_skipped(client):
    csv = "1,Иванов,Москва,Москва\n"
    r1 = await client.post("/api/upload/referees", files=_csv_file(csv, "ref.csv"))
    assert r1.json() == {"inserted": 1}

    r2 = await client.post("/api/upload/referees", files=_csv_file(csv, "ref.csv"))
    assert r2.json() == {"inserted": 0}

@pytest.mark.asyncio
async def test_upload_performances_ok(client):
    csv = "1,Москва,Москва,RUSSIA,Cup-2024,Senior,AG\n"
    response = await client.post(
        "/api/upload/performances",
        files=_csv_file(csv, "perfs.csv"),
    )
    assert response.status_code == 200
    assert response.json() == {"inserted": 1}

@pytest.mark.asyncio
async def test_upload_assessments_ok(client):
    refs = "1,Иванов,Москва,Москва\n"
    perfs = "1,Москва,Москва,RUSSIA,Cup-2024,Senior,AG\n"
    asses = "1,1,1,EXECUTION,1,8.0,8.0,16.0\n"

    await client.post("/api/upload/referees", files=_csv_file(refs, "r.csv"))
    await client.post("/api/upload/performances", files=_csv_file(perfs, "p.csv"))
    response = await client.post("/api/upload/assessments", files=_csv_file(asses, "a.csv"))
    assert response.status_code == 200
    assert response.json() == {"inserted": 1}
