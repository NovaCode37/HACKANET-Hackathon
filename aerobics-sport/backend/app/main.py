from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import upload, competitions, categories, referees

app = FastAPI(title="Aerobic.space API", version="1.0.0")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

app.include_router(upload.router, prefix="/api")
app.include_router(competitions.router, prefix="/api")
app.include_router(categories.router, prefix="/api")
app.include_router(referees.router, prefix="/api")
