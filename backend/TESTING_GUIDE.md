# Testing Guide — Aerobic.space Backend

> [!info] Для кого это
> Для новичка, который хочет **написать тесты сам**, но с подсказками.
> После каждого пункта будет **что сделать** и **зачем**.

#testing #pytest #fastapi #tutorial

---

## Оглавление

- [[#Шаг 0 — Зачем нужны тесты]]
- [[#Шаг 1 — Установка зависимостей]]
- [[#Шаг 2 — Структура тестов]]
- [[#Шаг 3 — Конфигурация (`conftest.py`)]]
- [[#Шаг 4 — Первый тест юнит-теста]]
- [[#Шаг 5 — Тесты сервисов]]
- [[#Шаг 6 — Тесты роутеров (интеграционные)]]
- [[#Шаг 7 — Запуск тестов]]a
- [[#Шаг 8 — Что тестировать дальше]]

---

## Шаг 0 — Зачем нужны тесты

> [!question] Что такое тест?
> Это маленькая функция, которая **вызывает твой код** и **проверяет результат**.
>
> Пример:
> ```python
> def test_sum():
>     assert 2 + 2 == 4   # если False — тест упадёт
> ```

**Виды тестов:**
- **Юнит-тесты** — проверяют одну функцию изолированно (без БД, без HTTP). Быстрые.
- **Интеграционные** — проверяют несколько компонентов вместе (роутер + БД). Медленнее.

**Что мы будем писать:**
1. Юнит-тесты для `services/accuracy.py` и `services/bias.py`
2. Интеграционные тесты для роутеров

---

## Шаг 1 — Установка зависимостей

### Что сделать
Добавь в `requirements.txt`:
```
pytest==8.3.3
pytest-asyncio==0.24.0
httpx==0.27.2
aiosqlite==0.20.0
```

> [!tip] Зачем каждое
> - **`pytest`** — сам фреймворк
> - **`pytest-asyncio`** — для тестов `async` функций
> - **`httpx`** — HTTP-клиент для тестов FastAPI
> - **`aiosqlite`** — драйвер SQLite (для тестовой БД в памяти, чтобы не трогать Postgres)

Установи:
```bash
docker-compose exec backend pip install -r requirements.txt
```
Или локально:
```bash
pip install pytest pytest-asyncio httpx aiosqlite
```

---

## Шаг 2 — Структура тестов

### Что сделать
Создай папку `backend/tests/` со структурой:
```
backend/
├── app/
└── tests/
    ├── __init__.py            # пустой
    ├── conftest.py            # общие фикстуры
    ├── test_accuracy.py       # юнит-тесты accuracy
    ├── test_bias.py           # юнит-тесты bias
    ├── test_referees.py       # тесты роутера /api/referees
    ├── test_competitions.py   # тесты роутера /api/competitions
    └── test_upload.py         # тесты загрузки CSV
```

> [!tip] Почему `__init__.py`
> Чтобы Python считал папку **пакетом**. Иначе будут проблемы с импортами.

---

## Шаг 3 — Конфигурация (`conftest.py`)

> [!info] Что такое `conftest.py`
> Это файл с **фикстурами** — переиспользуемыми кусочками подготовки данных (БД, клиент, и т.д.).
> pytest сам его подхватывает.

### Что сделать
Создай файл `backend/tests/conftest.py`:

```python
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.main import app
from app.database import Base, get_db

# Тестовая БД — SQLite в памяти, не трогает Postgres
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


@pytest_asyncio.fixture
async def db_session():
    """Создаёт чистую БД перед каждым тестом и удаляет после."""
    engine = create_async_engine(TEST_DATABASE_URL)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    SessionLocal = async_sessionmaker(engine, expire_on_commit=False)
    async with SessionLocal() as session:
        yield session

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture
async def client(db_session):
    """HTTP-клиент для тестов API. Подменяет get_db на тестовую сессию."""
    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

    app.dependency_overrides.clear()
```

> [!tip] Что тут происходит
> 1. **`db_session`** — создаёт БД в памяти, отдаёт сессию, удаляет БД после теста
> 2. **`client`** — поднимает FastAPI приложение, подменяет реальную БД на тестовую
> 3. Каждый тест получает **свежую БД** — тесты не влияют друг на друга

Также создай `backend/pytest.ini`:
```ini
[pytest]
asyncio_mode = auto
pythonpath = .
testpaths = tests
```

> [!tip] Зачем
> - `asyncio_mode = auto` — все async-тесты запускаются автоматически
> - `pythonpath = .` — чтобы `from app.main import app` работало
> - `testpaths = tests` — где искать тесты

---

## Шаг 4 — Первый юнит-тест

### Цель
Протестировать `get_threshold()` из `app/services/accuracy.py`.

### Что сделать
Создай `backend/tests/test_accuracy.py`:

```python
from app.services.accuracy import get_threshold, classify_accuracy, calc_accuracy_percent


def test_threshold_high_score():
    # При оценке 9.0 порог должен быть 0.3
    assert get_threshold(9.0) == 0.3


def test_threshold_medium_score():
    # При оценке 7.5 порог должен быть 0.4
    assert get_threshold(7.5) == 0.4


def test_threshold_low_score():
    assert get_threshold(6.5) == 0.5
    assert get_threshold(5.0) == 0.6
```

> [!example] Запусти
> ```bash
> pytest tests/test_accuracy.py -v
> ```
> Должно показать **3 passed**.

### Задание для тебя
Допиши тесты для `classify_accuracy`:
- Точное попадание → `"bullseye"`
- Отклонение в пределах порога → `"acceptable"`
- Большое отклонение → `"serious"`

> [!hint]- Подсказка
> ```python
> def test_classify_bullseye():
>     assert classify_accuracy(8.0, 8.0) == "bullseye"
>
> def test_classify_acceptable():
>     # 8.0 → порог 0.3, отклонение 0.2 < 0.3
>     assert classify_accuracy(8.2, 8.0) == "acceptable"
>
> def test_classify_serious():
>     # 8.0 → порог 0.3, отклонение 1.0 > 0.3
>     assert classify_accuracy(9.0, 8.0) == "serious"
> ```

### Задание для тебя — `calc_accuracy_percent`
Сложнее: функция принимает **список объектов** с полями `referee_assessment` и `result_type_assessment`.

> [!hint]- Подсказка
> Используй `dataclass` или простой класс для мока:
> ```python
> from dataclasses import dataclass
>
> @dataclass
> class FakeAssessment:
>     referee_assessment: float
>     result_type_assessment: float
>
>
> def test_calc_accuracy_empty():
>     assert calc_accuracy_percent([]) == 0.0
>
>
> def test_calc_accuracy_all_bullseye():
>     items = [FakeAssessment(8.0, 8.0), FakeAssessment(7.0, 7.0)]
>     assert calc_accuracy_percent(items) == 100.0
>
>
> def test_calc_accuracy_half_serious():
>     items = [
>         FakeAssessment(8.0, 8.0),    # bullseye
>         FakeAssessment(9.5, 8.0),    # serious
>     ]
>     assert calc_accuracy_percent(items) == 50.0
> ```

---

## Шаг 5 — Тесты сервисов (`bias.py`)

### Цель
Протестировать `calc_bias()`. Логика: средние отклонения «свои» vs «чужие».

### Задание для тебя
Создай `backend/tests/test_bias.py`. Протестируй сценарии:

1. Нет «своих» оценок → возвращает `0.0`
2. Нет «чужих» оценок → возвращает `0.0`
3. Положительный bias (судит «своих» строже)
4. Отрицательный bias (судит «своих» мягче)

> [!hint]- Подсказка к структуре теста
> ```python
> from dataclasses import dataclass
> from app.services.bias import calc_bias
>
>
> @dataclass
> class FakeAssessment:
>     referee_assessment: float
>     result_type_assessment: float
>
> @dataclass
> class FakePerformance:
>     competition_type: str
>     region: str
>     city: str
>
>
> def test_bias_no_own():
>     # Все performances — чужие
>     a = FakeAssessment(8.0, 8.0)
>     p = FakePerformance("RUSSIA", "Тюмень", "Тюмень")
>     result = calc_bias("Москва", "Москва", [(a, p)])
>     assert result == 0.0
>
>
> def test_bias_softer_to_own():
>     # Своим ставит выше (deviation > 0)
>     own_a = FakeAssessment(8.5, 8.0)        # +0.5 свой
>     own_p = FakePerformance("RUSSIA", "Москва", "Москва")
>     other_a = FakeAssessment(8.0, 8.0)      # 0.0 чужой
>     other_p = FakePerformance("RUSSIA", "Тюмень", "Тюмень")
>
>     # mean_others = 0.0, mean_own = 0.5
>     # bias = 0.0 - 0.5 = -0.5 (мягче к своим)
>     result = calc_bias("Москва", "Москва", [(own_a, own_p), (other_a, other_p)])
>     assert result == -0.5
> ```

---

## Шаг 6 — Тесты роутеров (интеграционные)

### Цель
Проверить что эндпоинты возвращают правильный формат и работают с БД.

### Что сделать
Создай `backend/tests/test_referees.py`:

```python
import pytest
from app.models import Referee


@pytest.mark.asyncio
async def test_get_referees_empty(client):
    """Если БД пустая — возвращается пустой список."""
    response = await client.get("/api/referees/")
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_get_referees_one(client, db_session):
    """Если в БД один судья — он возвращается."""
    # Подготовка: создаём судью
    ref = Referee(id=1, fio="Иванов И.И.", region="Москва", city="Москва")
    db_session.add(ref)
    await db_session.commit()

    # Действие
    response = await client.get("/api/referees/")

    # Проверка
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["fio"] == "Иванов И.И."
    assert data[0]["region"] == "Москва"
```

> [!tip] Шаблон AAA — Arrange / Act / Assert
> 1. **Arrange** — подготовь данные в БД
> 2. **Act** — сделай HTTP-запрос
> 3. **Assert** — проверь ответ

### Задание для тебя
Напиши тесты:

1. **`test_get_referees_search`** — добавь 2 судей, фильтруй по `?search=Иван`, должен вернуться 1
2. **`test_get_referee_profile_not_found`** — запрос `/api/referees/999` → должен вернуть `404` (после того как ты добавишь обработку 404 в код, см. [[CODE_REVIEW#Проблема №4]])
3. **`test_get_referee_profile_no_assessments`** — судья есть, оценок нет → `accuracy_percent = 0`, `bias = 0`

> [!hint]- Подсказка к фильтру
> ```python
> @pytest.mark.asyncio
> async def test_get_referees_search(client, db_session):
>     db_session.add_all([
>         Referee(id=1, fio="Иванов И.И.", region="Москва", city="Москва"),
>         Referee(id=2, fio="Петров П.П.", region="Тюмень", city="Тюмень"),
>     ])
>     await db_session.commit()
>
>     response = await client.get("/api/referees/?search=Иван")
>     data = response.json()
>     assert len(data) == 1
>     assert data[0]["fio"] == "Иванов И.И."
> ```

---

## Шаг 7 — Тест загрузки CSV

### Цель
Проверить что POST `/api/upload/referees` парсит CSV и сохраняет в БД.

### Задание для тебя
Создай `backend/tests/test_upload.py`:

```python
import pytest
import io


@pytest.mark.asyncio
async def test_upload_referees(client):
    csv_content = "1,Иванов И.И.,Москва,Москва\n2,Петров П.П.,Тюмень,Тюмень\n"
    files = {"file": ("referees.csv", io.BytesIO(csv_content.encode("utf-8")), "text/csv")}

    response = await client.post("/api/upload/referees", files=files)

    assert response.status_code == 200
    assert response.json() == {"inserted": 2}

    # Проверим что данные правда попали
    list_response = await client.get("/api/referees/")
    assert len(list_response.json()) == 2
```

> [!tip] Что важно
> - `io.BytesIO` — превращает строку в файл-в-памяти
> - `("referees.csv", file, "text/csv")` — формат для multipart upload в `httpx`

### Задание для тебя
Напиши:
1. **`test_upload_empty_csv`** — пустой файл → `inserted = 0`
2. **`test_upload_duplicate_id`** — два раза один id → второй раз `inserted = 0` (потому что `on_conflict_do_nothing`)
3. **`test_upload_performances`** и **`test_upload_assessments`** — по аналогии

---

## Шаг 7 — Запуск тестов

```bash
# Все тесты
pytest

# С подробным выводом
pytest -v

# Только один файл
pytest tests/test_accuracy.py

# Только один тест
pytest tests/test_accuracy.py::test_threshold_high_score

# Остановиться на первой ошибке
pytest -x

# Покрытие кода (нужен pip install pytest-cov)
pytest --cov=app --cov-report=html
```

> [!tip] Запуск в Docker
> ```bash
> docker-compose exec backend pytest
> ```

---

## Шаг 8 — Что тестировать дальше

### Чек-лист тестов

- [ ] `services/accuracy.py` — `get_threshold`, `classify_accuracy`, `calc_accuracy_percent`
- [ ] `services/bias.py` — `calc_bias` для всех сценариев
- [ ] `services/csv_import.py` — парсинг с разными кодировками, плохими строками
- [ ] `routers/referees.py` — список, фильтр, профиль, 404
- [ ] `routers/competitions.py` — список, детали, агрегаты
- [ ] `routers/categories.py` — heatmap с разными сценариями
- [ ] `routers/upload.py` — все 3 эндпоинта

### Минимум для демо
1. `test_accuracy.py` — все функции
2. `test_bias.py` — основные сценарии
3. `test_referees.py` — список + профиль
4. `test_upload.py` — загрузка работает

### Покрытие
Цель: **70%+ строк** покрыто тестами.
```bash
pytest --cov=app
```

---

## Полезные команды pytest

| Команда | Что делает |
|---|---|
| `pytest` | Все тесты |
| `pytest -v` | С именами тестов |
| `pytest -x` | Остановка на 1-й ошибке |
| `pytest -k "accuracy"` | Только тесты с `accuracy` в имени |
| `pytest --lf` | Только упавшие в прошлый раз |
| `pytest -s` | Показывать `print()` |
| `pytest --pdb` | Зайти в дебаггер при ошибке |

---

## Типичные ошибки новичка

> [!warning] `ModuleNotFoundError: No module named 'app'`
> Не настроен `pythonpath` в `pytest.ini`. Проверь файл из [[#Шаг 3]].

> [!warning] `RuntimeError: Event loop is closed`
> Забыл `@pytest.mark.asyncio` или не настроен `asyncio_mode = auto`.

> [!warning] Тесты влияют друг на друга
> БД не пересоздаётся между тестами. Проверь что фикстура `db_session` использует `:memory:` и пересоздаёт схему.

> [!warning] `AttributeError: 'NoneType' object has no attribute ...`
> Запрос вернул `None` (например, судьи не существует), а код это не обрабатывает. Это **сигнал что нужен `404`** (см. [[CODE_REVIEW#Проблема №4]]).

---

## Связанные заметки

- [[CODE_REVIEW]] — анализ кода
- [[FRONTEND_ADAPTATION]] — адаптация под фронт
- [[BUGS_AND_TASKS]] — баги и задачи

---

## Примерный план на 1 вечер

1. **30 мин** — установить pytest, создать `conftest.py`, запустить пустой тест
2. **1 час** — `test_accuracy.py` (юнит-тесты, легко)
3. **1 час** — `test_bias.py` (юнит-тесты, чуть сложнее)
4. **1.5 часа** — `test_referees.py` (интеграционные, много нюансов)
5. **30 мин** — `test_upload.py`

> [!success] Финал
> Запусти `pytest --cov=app` и сохрани отчёт.
> Если 70%+ покрытия — ты молодец.
