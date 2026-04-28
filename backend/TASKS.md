# Backend — Задачи по каждому файлу (с примерами)

## Порядок реализации
```
1. config.py
2. database.py
3. models/ (referee → performance → assessment → __init__)
4. alembic/versions/001_initial.py  ← миграция (создать таблицы)
5. schemas/ (referee → performance → assessment → __init__)
6. services/ (accuracy → bias → csv_import)
7. routers/ (upload → competitions → categories → referees)
8. main.py
```

---

## 1. `app/config.py`
**Задача:** читать переменные окружения из `.env` файла.

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str  # обязательная переменная — будет браться из .env

    class Config:
        env_file = ".env"  # путь к .env (относительно места запуска uvicorn)

settings = Settings()
```

> `.env` файл (уже создан рядом):
> ```
> DATABASE_URL=postgresql+asyncpg://user:password@db:5432/aerobic
> ```

---

## 2. `app/database.py`
**Задача:** создать async-подключение к PostgreSQL и dependency `get_db`.

```python
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from .config import settings

# Движок — асинхронный
engine = create_async_engine(settings.DATABASE_URL, echo=True)

# Фабрика сессий
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

# Базовый класс для всех моделей
Base = declarative_base()

# Dependency для FastAPI роутеров — использовать как Depends(get_db)
async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session
```

---

## 3. `app/models/referee.py`
**Задача:** описать таблицу `referees` в БД.

```python
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from ..database import Base

class Referee(Base):
    __tablename__ = "referees"

    id     = Column(Integer, primary_key=True, index=True)
    fio    = Column(String, nullable=False)
    region = Column(String)
    city   = Column(String)

    # TODO: добавить relationship к Assessment
    # assessments = relationship("Assessment", back_populates="referee")
```

---

## 4. `app/models/perfomance.py`
**Задача:** описать таблицу `performances`.

```python
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from ..database import Base

class Performance(Base):
    __tablename__ = "performances"

    id               = Column(Integer, primary_key=True, index=True)
    region           = Column(String)
    city             = Column(String)
    competition_type = Column(String)   # "RUSSIA" или "REGION"
    competition      = Column(String, index=True)
    age_category     = Column(String)
    discipline       = Column(String)

    # TODO: добавить relationship к Assessment
    # assessments = relationship("Assessment", back_populates="performance")
```

---

## 5. `app/models/assessment.py`
**Задача:** описать таблицу `assessments` с внешними ключами.

```python
from sqlalchemy import Column, Integer, Float, String, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class Assessment(Base):
    __tablename__ = "assessments"

    id                     = Column(Integer, primary_key=True, index=True)
    referee_id             = Column(Integer, ForeignKey("referees.id"), index=True)
    performance_id         = Column(Integer, ForeignKey("performances.id"), index=True)
    type                   = Column(String)   # "ARTISTIC" или "EXECUTION"
    number                 = Column(Integer)  # порядковый номер судьи в бригаде (1-4)
    referee_assessment     = Column(Float)    # оценка судьи
    result_type_assessment = Column(Float)    # итоговая оценка по категории
    result_assessment      = Column(Float)    # общая оценка за выступление

    # TODO: добавить relationships
    # referee     = relationship("Referee", back_populates="assessments")
    # performance = relationship("Performance", back_populates="assessments")
```

---

## 6. `app/models/__init__.py`
**Задача:** экспортировать все модели, чтобы Alembic их видел.

```python
from .referee import Referee
from .perfomance import Performance
from .assessment import Assessment
```

---

## 7. `app/schemas/referee.py`
**Задача:** Pydantic-схемы для валидации данных судьи.

```python
from pydantic import BaseModel, ConfigDict

class RefereeBase(BaseModel):
    fio: str
    region: str | None = None
    city: str | None = None

class RefereeCreate(RefereeBase):
    id: int  # берётся из CSV

class RefereeOut(RefereeBase):
    id: int
    model_config = ConfigDict(from_attributes=True)  # разрешает создание из ORM-объекта

# TODO: для профиля судьи — расширить метриками
class RefereeProfile(RefereeOut):
    accuracy_score: float   # % попадания в допустимое отклонение
    bias_score: float       # коэффициент предвзятости
```

---

## 8. `app/schemas/perfomance.py`
**Задача:** Pydantic-схемы для выступлений.

```python
from pydantic import BaseModel, ConfigDict

class PerformanceBase(BaseModel):
    region: str | None = None
    city: str | None = None
    competition_type: str
    competition: str
    age_category: str
    discipline: str

class PerformanceCreate(PerformanceBase):
    id: int

class PerformanceOut(PerformanceBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
```

---

## 9. `app/schemas/assessment.py`
**Задача:** Pydantic-схемы для оценок + метка точности.

```python
from pydantic import BaseModel, ConfigDict

class AssessmentBase(BaseModel):
    referee_id: int
    performance_id: int
    type: str                   # "ARTISTIC" | "EXECUTION"
    number: int
    referee_assessment: float
    result_type_assessment: float
    result_assessment: float

class AssessmentCreate(AssessmentBase):
    id: int

class AssessmentOut(AssessmentBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# TODO: для профиля судьи — добавить метку точности
class AssessmentWithAccuracy(AssessmentOut):
    accuracy_label: str  # "bullseye" | "acceptable" | "serious"
```

---

## 10. `app/services/accuracy.py`
**Задача:** функции расчёта точности оценки судьи.

```python
def get_threshold(result_score: float) -> float:
    """
    Возвращает допустимое отклонение по таблице из кейса:
    8.00-10.00 → 0.3
    7.00-7.99  → 0.4
    6.00-6.99  → 0.5
    0.00-5.99  → 0.6
    """
    # TODO: реализовать через if/elif

def classify_accuracy(referee_score: float, result_score: float) -> str:
    """
    Возвращает метку точности:
    - "bullseye"    если referee_score == result_score
    - "acceptable"  если |referee_score - result_score| <= threshold
    - "serious"     если отклонение больше допустимого
    """
    # TODO: использовать get_threshold() и abs()

def calc_accuracy_percent(assessments: list) -> float:
    """
    Считает % оценок в допустимом диапазоне (bullseye + acceptable).
    assessments — список объектов с полями referee_assessment и result_type_assessment.
    Возвращает число от 0.0 до 100.0
    """
    # TODO: применить classify_accuracy к каждой оценке, посчитать долю не "serious"
```

---

## 11. `app/services/bias.py`
**Задача:** расчёт предвзятости судьи к "своим".

```python
def calc_bias(
    referee_id: int,
    referee_region: str,
    referee_city: str,
    assessments_with_performances: list,  # список кортежей (Assessment, Performance)
) -> float:
    """
    Формула: bias = mean_deviation(чужие) - mean_deviation(свои)
    
    deviation для каждой оценки = referee_assessment - result_type_assessment
    
    "Свои" определяются по competition_type выступления:
    - RUSSIA → сравниваем referee.region с performance.region
    - REGION → сравниваем referee.city с performance.city
    
    Если данных нет (нет оценок "своих" или "чужих") — вернуть 0.0
    """
    # TODO:
    # 1. разделить оценки на "свои" и "чужие" по правилу выше
    # 2. посчитать среднее отклонение для каждой группы
    # 3. вернуть разницу
```

---

## 12. `app/services/csv_import.py`
**Задача:** идемпотентная загрузка CSV (повторная загрузка не дублирует данные).

```python
import csv
import io
from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.dialects.postgresql import insert  # для ON CONFLICT DO NOTHING
from ..models import Referee, Performance, Assessment

async def import_referees(file: UploadFile, db: AsyncSession) -> int:
    """
    1. Прочитать байты файла: content = await file.read()
    2. Декодировать: text = content.decode("utf-8")
    3. Пройти по строкам csv.DictReader(io.StringIO(text))
    4. Для каждой строки выполнить:
       INSERT INTO referees VALUES (...) ON CONFLICT (id) DO NOTHING
    5. Вернуть кол-во реально вставленных строк
    """
    # TODO: реализовать аналогично для performances и assessments

async def import_performances(file: UploadFile, db: AsyncSession) -> int:
    # TODO: аналогично import_referees, таблица performances
    pass

async def import_assessments(file: UploadFile, db: AsyncSession) -> int:
    # TODO: аналогично, таблица assessments
    pass
```

---

## 13. `app/routers/upload.py`
**Задача:** принимать CSV через форму и передавать в сервисы.

```python
from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..services.csv_import import import_referees, import_performances, import_assessments

router = APIRouter(prefix="/upload", tags=["upload"])

@router.post("/referees")
async def upload_referees(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    # TODO: вызвать import_referees(file, db), вернуть {"inserted": N}
    pass

@router.post("/performances")
async def upload_performances(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    # TODO: вызвать import_performances(file, db)
    pass

@router.post("/assessments")
async def upload_assessments(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    # TODO: вызвать import_assessments(file, db)
    pass
```

---

## 14. `app/routers/competitions.py`
**Задача:** список соревнований и детальная статистика по одному.

```python
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db

router = APIRouter(prefix="/competitions", tags=["competitions"])

@router.get("/")
async def get_competitions(search: str = Query(None), db: AsyncSession = Depends(get_db)):
    """
    TODO:
    - SELECT DISTINCT competition FROM performances
    - Если search передан — фильтровать по ILIKE '%search%'
    - Для каждого соревнования JOIN assessments:
        посчитать avg % точности по EXECUTION и ARTISTIC
        через calc_accuracy_percent() из services/accuracy.py
    - Вернуть список: [{competition, exec_accuracy_pct, artistic_accuracy_pct}]
    """
    pass

@router.get("/{competition_name}")
async def get_competition_detail(competition_name: str, db: AsyncSession = Depends(get_db)):
    """
    TODO:
    - Список дисциплин и возрастных категорий для этого соревнования
    - Общие индикаторы (avg % EXECUTION, avg % ARTISTIC, девиация)
    - Таблица: age_category + discipline → средние оценки каждого судьи (number 1-4)
                                          → bias каждого судьи
    """
    pass
```

---

## 15. `app/routers/categories.py`
**Задача:** тепловая карта "Судья × Регионы" для конкретной категории.

```python
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db

router = APIRouter(prefix="/categories", tags=["categories"])

@router.get("/{competition_name}/{age_category}/{discipline}")
async def get_category_heatmap(
    competition_name: str,
    age_category: str,
    discipline: str,
    db: AsyncSession = Depends(get_db)
):
    """
    TODO:
    - Выбрать все assessments для данного competition + age_category + discipline
    - JOIN с performances (для региона) и referees (для номера судьи)
    - Построить матрицу: строки = number судьи (1-4),
                         столбцы = уникальные регионы участников,
                         значение = среднее отклонение (referee_assessment - result_type_assessment)
    - Вернуть: { referees: [1,2,3,4], regions: [...], matrix: [[...],[...]] }
    """
    pass
```

---

## 16. `app/routers/referees.py`
**Задача:** список судей и детальный профиль.

```python
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db

router = APIRouter(prefix="/referees", tags=["referees"])

@router.get("/")
async def get_referees(search: str = Query(None), db: AsyncSession = Depends(get_db)):
    """
    TODO:
    - SELECT * FROM referees
    - Если search — фильтр по fio ILIKE '%search%'
    - Вернуть список RefereeOut
    """
    pass

@router.get("/{referee_id}")
async def get_referee_profile(
    referee_id: int,
    type: str = Query(None),           # "EXECUTION" | "ARTISTIC"
    discipline: str = Query(None),
    age_category: str = Query(None),
    competition: str = Query(None),
    db: AsyncSession = Depends(get_db)
):
    """
    TODO:
    - Данные судьи из referees
    - Все его оценки из assessments + JOIN performances
    - Применить фильтры (type, discipline, age_category, competition) если переданы
    - Посчитать accuracy_score через calc_accuracy_percent()
    - Посчитать bias_score через calc_bias()
    - Для каждой оценки добавить accuracy_label через classify_accuracy()
    - Вернуть RefereeProfile + список AssessmentWithAccuracy
    """
    pass
```

---

## 17. `app/main.py`
**Задача:** собрать всё приложение, подключить роутеры, настроить CORS.

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import upload, competitions, categories, referees

app = FastAPI(title="Aerobic.Space API", version="1.0.0")

# TODO: настроить CORS (разрешить запросы с фронтенда)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # в проде заменить на конкретный URL фронтенда
    allow_methods=["*"],
    allow_headers=["*"],
)

# TODO: подключить все роутеры
app.include_router(upload.router, prefix="/api")
app.include_router(competitions.router, prefix="/api")
app.include_router(categories.router, prefix="/api")
app.include_router(referees.router, prefix="/api")

# TODO: при запуске создать таблицы (если не используешь alembic migrate в docker)
# @app.on_event("startup")
# async def startup():
#     async with engine.begin() as conn:
