from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from ..database import Base

class Performance(Base):
    __tablename__ = "performances"
    
    id = Column(Integer, primary_key=True, index=True)
    region = Column(String, nullable=False, default="", index=True)
    city = Column(String, nullable=False, default="", index=True)
    competition_type = Column(String, nullable=False, default="", index=True)
    competition = Column(String, nullable=False, default="", index=True)
    age_category = Column(String, nullable=False, default="", index=True)
    discipline = Column(String, nullable=False, default="", index=True)