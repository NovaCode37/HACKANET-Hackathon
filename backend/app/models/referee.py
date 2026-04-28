from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from ..database import Base

class Referee(Base):
    id = Column(Integer, primary_key=True, index=True)
    fio = Column(String, primary_key=True, index=True)
    region = Column(String)
    city = Column(String)