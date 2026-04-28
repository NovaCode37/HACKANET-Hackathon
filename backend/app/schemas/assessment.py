from pydantic import BaseModel, ConfigDict

class AssessmentBase(BaseModel):
    referee_id: int 
    perfomance_id: int
    type: str
    number: int
    referee_assessment: float 
    result_type_assessment: float
    result_assessment: float

class AssessmentCreate(AssessmentBase):
    id: int

class AssessmentOut(AssessmentCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)

class AssessmentWithAccuracy(AssessmentOut):
    accuracy_label: str