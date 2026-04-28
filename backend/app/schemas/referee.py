from pydantic import BaseModel, ConfigDict

class RefereeBase(BaseModel):
    fio: str
    region: str | None = None
    city: str | None = None

class RefereeCreate(RefereeBase):
    id: int

class RefereeOut(RefereeBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

class RefereeProfile(RefereeOut):
    accuracy_score: float
    bias_score: float
    
