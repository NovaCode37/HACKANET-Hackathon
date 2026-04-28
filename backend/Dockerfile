FROM python:3.11-slim

WORKDIR /app

# Копируем зависимости отдельно для кэширования слоёв Docker
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем весь код приложения
COPY . .

# Порт, который слушает uvicorn
EXPOSE 8000

# Запуск: app.main — путь к модулю, app — объект FastAPI внутри него
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
