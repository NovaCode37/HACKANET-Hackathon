from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from ..database import Base

class Perfomance(Base):
    __tablename__ = "perfomances"
    
    id = Column(Integer, primary_key=True, index=True)
    region = Column(String)
    competition_type = Column(String)
    competition = Column(String)
    age_category = Column(String)
    discipline = Column(String)