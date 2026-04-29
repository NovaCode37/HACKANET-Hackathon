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

class PerformanceOut(PerformanceCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)