from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    referee_id = Column(Integer, ForeignKey("referees.id"))
    performance_id = Column(Integer, ForeignKey("performances.id"))
    type = Column(String)
    number = Column(Integer)
    referee_assessment = Column(Float)
    result_type_assessment = Column(Float)
    result_assessment = Column(Float)

