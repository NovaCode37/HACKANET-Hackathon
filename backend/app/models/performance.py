from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from ..database import Base

class Performance(Base):
    __tablename__ = "performances"
    
    id = Column(Integer, primary_key=True, index=True)
    region = Column(String)
    city = Column(String)
    competition_type = Column(String)
    competition = Column(String)
    age_category = Column(String)
    discipline = Column(String)