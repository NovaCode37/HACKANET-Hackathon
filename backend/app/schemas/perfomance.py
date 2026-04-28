from pydantic import BaseModel, ConfigDict

class PerfomanceBase(BaseModel):
    region: str | None = None
    city: str | None = None
    competition_type: str
    competition: str
    age_category: str
    discipline: str

class PerfomanceCreate(PerfomanceBase):
    id: int

class PerfomanceOut(PerfomanceCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)