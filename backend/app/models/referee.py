from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from ..database import Base

class Referee(Base):
    __tablename__ = "referees"

    id = Column(Integer, primary_key=True, index=True)
    fio = Column(String, nullable=False)
    region = Column(String)
    city = Column(String)