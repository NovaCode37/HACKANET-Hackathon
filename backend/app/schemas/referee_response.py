from pydantic import BaseModel

class JudgeListItem(Basemodel):
    id: int
    fio: str 
    region: str | None
    city: str | None
    execution_accuracy: float
    artistic_accuracy: float
    bias_accuracy: float

